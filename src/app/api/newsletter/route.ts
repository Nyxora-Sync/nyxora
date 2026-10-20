import { z } from 'zod'
import { prisma } from '@/lib/db'
import { jsonError, sinceMinutes } from '@/lib/community'
import {
  newsletterEmailConfigured,
  sendNewsletterConfirmation,
  verifyNewsletterToken,
} from '@/lib/newsletter'
import { siteUrl } from '@/lib/seo'

const emailSchema = z
  .email('Enter a valid email address')
  .max(254)
  .transform((value) => value.toLowerCase())

const subscribeSchema = z
  .object({
    email: emailSchema,
    source: z.enum(['footer', 'newsletter', 'site']).default('site'),
    // Honeypot. Real people never fill this in.
    website: z.string().max(200).optional(),
  })
  .strict()

const unsubscribeSchema = z
  .object({
    email: emailSchema.optional(),
    token: z.string().trim().min(20).max(4096).optional(),
  })
  .strict()
  .refine((value) => Boolean(value.email || value.token), {
    message: 'Enter an email address or use the link from your email.',
  })

function databaseReady() {
  return Boolean(process.env.DATABASE_URL)
}

export async function POST(request: Request) {
  if (!databaseReady()) {
    return jsonError(503, 'NEWSLETTER_UNAVAILABLE', 'Newsletter signup is temporarily unavailable.')
  }
  if (!newsletterEmailConfigured()) {
    return jsonError(
      503,
      'NEWSLETTER_UNAVAILABLE',
      'Newsletter signup is temporarily unavailable. Please try again later.'
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Enter a valid email address.',
        },
      },
      { status: 422 }
    )
  }

  // Silently accept honeypot submissions so bots do not learn they were caught.
  if (parsed.data.website) {
    return Response.json({ data: { subscribed: true, confirmationRequired: false } })
  }

  const recent = await prisma.newsletterSubscriber.count({
    where: { createdAt: { gte: sinceMinutes(60) } },
  })
  if (recent >= 200) {
    return jsonError(429, 'RATE_LIMITED', 'Too many signups right now. Try again later.')
  }

  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email, source: parsed.data.source },
    update: {},
  })

  if (subscriber.confirmedAt) {
    return Response.json({
      data: {
        subscribed: true,
        confirmationRequired: false,
        alreadyConfirmed: true,
      },
    })
  }

  const sentRecently =
    subscriber.confirmationSentAt &&
    Date.now() - subscriber.confirmationSentAt.getTime() < 60_000

  if (sentRecently) {
    return Response.json({
      data: {
        subscribed: true,
        confirmationRequired: true,
        alreadySent: true,
      },
    })
  }

  try {
    await sendNewsletterConfirmation({
      email: subscriber.email,
      subscriberId: subscriber.id,
      origin: siteUrl,
    })
  } catch (error) {
    console.error(
      'Newsletter confirmation email failed:',
      error instanceof Error ? error.message : error
    )
    return jsonError(
      503,
      'NEWSLETTER_UNAVAILABLE',
      'We could not send the confirmation email. Please try again in a minute.'
    )
  }

  await prisma.newsletterSubscriber
    .update({
      where: { id: subscriber.id },
      data: { confirmationSentAt: new Date() },
    })
    .catch((error) => {
      console.error(
        'Could not record newsletter confirmation time:',
        error instanceof Error ? error.message : error
      )
    })

  return Response.json(
    {
      data: {
        subscribed: true,
        confirmationRequired: true,
        alreadySent: false,
      },
    },
    { status: 201 }
  )
}

export async function DELETE(request: Request) {
  if (!databaseReady()) {
    return jsonError(503, 'NEWSLETTER_UNAVAILABLE', 'Newsletter settings are temporarily unavailable.')
  }

  const body = await request.json().catch(() => null)
  const parsed = unsubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Enter a valid email address.',
        },
      },
      { status: 422 }
    )
  }

  if (parsed.data.token) {
    const verified = verifyNewsletterToken(parsed.data.token, 'unsubscribe')
    if (!verified) {
      return jsonError(
        400,
        'INVALID_TOKEN',
        'That unsubscribe link is invalid or has expired. Use the form on the newsletter page.'
      )
    }
    await prisma.newsletterSubscriber.deleteMany({ where: { id: verified.subscriberId } })
    return Response.json({ data: { unsubscribed: true } })
  }

  // Deleting a non-existent address succeeds too: never confirm who is on the list.
  await prisma.newsletterSubscriber.deleteMany({ where: { email: parsed.data.email } })
  return Response.json({ data: { unsubscribed: true } })
}
