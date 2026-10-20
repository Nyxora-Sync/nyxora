import { z } from 'zod'
import { prisma } from '@/lib/db'
import { jsonError } from '@/lib/community'
import { verifyNewsletterToken } from '@/lib/newsletter'

const schema = z.object({ token: z.string().trim().min(20).max(4096) }).strict()

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return jsonError(503, 'NEWSLETTER_UNAVAILABLE', 'Newsletter settings are temporarily unavailable.')
  }

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return jsonError(422, 'VALIDATION_ERROR', 'That confirmation link is invalid.')
  }

  const verified = verifyNewsletterToken(parsed.data.token, 'confirm')
  if (!verified) {
    return jsonError(
      400,
      'INVALID_TOKEN',
      'That confirmation link is invalid or has expired. Sign up again to get a new one.'
    )
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id: verified.subscriberId },
    select: { id: true, confirmedAt: true },
  })
  if (!subscriber) {
    return jsonError(
      404,
      'NOT_FOUND',
      'That subscription no longer exists. Sign up again to get a new confirmation email.'
    )
  }

  if (!subscriber.confirmedAt) {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { confirmedAt: new Date() },
    })
  }

  return Response.json({ data: { confirmed: true } })
}
