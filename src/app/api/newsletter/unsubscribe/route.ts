import { z } from 'zod'
import { prisma } from '@/lib/db'
import { jsonError } from '@/lib/community'
import { verifyNewsletterToken } from '@/lib/newsletter'

const bodySchema = z
  .object({ token: z.string().trim().min(20).max(4096) })
  .strict()

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return jsonError(503, 'NEWSLETTER_UNAVAILABLE', 'Newsletter settings are temporarily unavailable.')
  }

  // Mailbox providers send an empty POST to the List-Unsubscribe URL, so the
  // token may arrive in the query string instead of a JSON body.
  const url = new URL(request.url)
  const queryToken = url.searchParams.get('token')
  const body = queryToken ? null : await request.json().catch(() => null)
  const token = queryToken || body?.token

  const parsed = bodySchema.safeParse({ token })
  if (!parsed.success) {
    return jsonError(422, 'VALIDATION_ERROR', 'That unsubscribe link is invalid.')
  }

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
