import { z } from 'zod'
import { prisma } from '@/lib/db'
import { jsonError, sinceMinutes } from '@/lib/community'

const emailSchema = z.email('Enter a valid email address').max(254).transform((value) => value.toLowerCase())

const subscribeSchema = z
  .object({
    email: emailSchema,
    source: z.enum(['footer', 'newsletter', 'site']).default('site'),
    // Honeypot. Real people never fill this in.
    website: z.string().max(200).optional(),
  })
  .strict()

const unsubscribeSchema = z.object({ email: emailSchema }).strict()

function databaseReady() {
  return Boolean(process.env.DATABASE_URL)
}

export async function POST(request: Request) {
  if (!databaseReady()) {
    return jsonError(503, 'NEWSLETTER_UNAVAILABLE', 'Newsletter signup is temporarily unavailable.')
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
    return Response.json({ data: { subscribed: true } })
  }

  const recent = await prisma.newsletterSubscriber.count({
    where: { createdAt: { gte: sinceMinutes(60) } },
  })
  if (recent >= 200) {
    return jsonError(429, 'RATE_LIMITED', 'Too many signups right now. Try again later.')
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email, source: parsed.data.source },
    update: {},
  })

  return Response.json({ data: { subscribed: true } }, { status: 201 })
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

  // Deleting a non-existent address succeeds too: never confirm who is on the list.
  await prisma.newsletterSubscriber.deleteMany({ where: { email: parsed.data.email } })
  return Response.json({ data: { unsubscribed: true } })
}
