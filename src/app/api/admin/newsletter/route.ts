import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { jsonError } from '@/lib/community'
import {
  isNewsletterAdmin,
  newsletterEmailConfigured,
  sendNewsletterBroadcast,
} from '@/lib/newsletter'
import { siteUrl } from '@/lib/seo'

// Sending to a small list can take longer than the default route budget. The
// admin UI is intentionally limited to a few hundred recipients per send.
export const maxDuration = 60

const MAX_RECIPIENTS = 500

const schema = z
  .object({
    subject: z
      .string()
      .trim()
      .min(3, 'Write a subject')
      .max(140, 'Keep the subject under 140 characters')
      .refine((value) => !/[\r\n]/.test(value), 'The subject must be a single line'),
    body: z
      .string()
      .trim()
      .min(20, 'Write at least a couple of sentences')
      .max(20_000, 'Keep the email under 20,000 characters'),
    test: z.boolean().optional().default(false),
    confirm: z.string().optional(),
  })
  .strict()

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return jsonError(503, 'NEWSLETTER_UNAVAILABLE', 'The newsletter database is not configured.')
  }

  const session = await auth()
  const adminEmail = session?.user?.email
  if (!isNewsletterAdmin(adminEmail)) {
    return jsonError(403, 'FORBIDDEN', 'You do not have access to the newsletter admin.')
  }
  if (!newsletterEmailConfigured()) {
    return jsonError(503, 'EMAIL_UNAVAILABLE', 'Email delivery is not configured.')
  }

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Check the subject and body.',
        },
      },
      { status: 422 }
    )
  }

  const { subject, body: text, test, confirm } = parsed.data

  try {
    if (test) {
      const result = await sendNewsletterBroadcast({
        subject,
        body: text,
        recipients: [],
        origin: siteUrl,
        testTo: adminEmail!,
      })

      await prisma.newsletterSend.create({
        data: {
          sentBy: adminEmail!,
          subject,
          recipientCount: 1,
          failedCount: 0,
          isTest: true,
        },
      })

      return Response.json({ data: { ...result, total: 1, test: true } })
    }

    if (confirm !== 'SEND') {
      return jsonError(400, 'CONFIRMATION_REQUIRED', 'Type SEND to confirm a real broadcast.')
    }

    const lastSend = await prisma.newsletterSend.findFirst({
      where: { isTest: false },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    })
    if (lastSend && Date.now() - lastSend.createdAt.getTime() < 60_000) {
      return jsonError(
        429,
        'RATE_LIMITED',
        'A broadcast was just sent. Wait a minute before sending another one.'
      )
    }

    const recipients = await prisma.newsletterSubscriber.findMany({
      where: { confirmedAt: { not: null } },
      select: { id: true, email: true },
      orderBy: { createdAt: 'asc' },
      take: MAX_RECIPIENTS + 1,
    })

    if (recipients.length === 0) {
      return jsonError(400, 'NO_RECIPIENTS', 'There are no confirmed subscribers yet.')
    }
    if (recipients.length > MAX_RECIPIENTS) {
      return jsonError(
        400,
        'TOO_MANY_RECIPIENTS',
        `This broadcast has more than ${MAX_RECIPIENTS} recipients. Send it in smaller batches.`
      )
    }

    const result = await sendNewsletterBroadcast({
      subject,
      body: text,
      recipients,
      origin: siteUrl,
    })

    await prisma.newsletterSend.create({
      data: {
        sentBy: adminEmail!,
        subject,
        recipientCount: recipients.length,
        failedCount: result.failed,
        isTest: false,
      },
    })

    if (result.sent === 0) {
      return Response.json(
        {
          error: {
            code: 'SEND_FAILED',
            message: 'Every recipient failed. Check the email server configuration and try again.',
          },
          data: { ...result, total: recipients.length },
        },
        { status: 502 }
      )
    }

    return Response.json({
      data: { ...result, total: recipients.length, test: false },
    })
  } catch (error) {
    console.error(
      'Newsletter broadcast failed:',
      error instanceof Error ? error.message : error
    )
    return jsonError(
      502,
      'SEND_FAILED',
      'The email server did not accept the send. Check the server logs and try again.'
    )
  }
}
