import { z } from 'zod'
import { prisma } from '@/lib/db'
import { jsonError, sinceMinutes } from '@/lib/community'
import { sendContactNotification } from '@/lib/contact-email'

const emailSchema = z.email('Enter a valid email address').max(254).transform((value) => value.toLowerCase())

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .max(80)
      .optional()
      .transform((value) => (value ? value : null)),
    email: emailSchema,
    topic: z.enum(['general', 'bug', 'content', 'conduct', 'privacy', 'security']).default('general'),
    message: z.string().trim().min(20, 'Please add a little more detail').max(4000),
    website: z.string().max(200).optional(),
  })
  .strict()

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return jsonError(503, 'CONTACT_UNAVAILABLE', 'The contact form is temporarily unavailable.')
  }

  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Check the form and try again.',
        },
      },
      { status: 422 }
    )
  }

  if (parsed.data.website) {
    return Response.json({ data: { received: true } }, { status: 201 })
  }

  const [fromSender, recently] = await Promise.all([
    prisma.contactMessage.count({
      where: { email: parsed.data.email, createdAt: { gte: sinceMinutes(60) } },
    }),
    prisma.contactMessage.count({
      where: { createdAt: { gte: sinceMinutes(60) } },
    }),
  ])

  if (fromSender >= 3 || recently >= 100) {
    return jsonError(429, 'RATE_LIMITED', 'Too many messages right now. Try again in a little while.')
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      topic: parsed.data.topic,
      message: parsed.data.message,
    },
  })

  // Stored successfully. Notification is a bonus, not a requirement.
  try {
    await sendContactNotification({
      name: parsed.data.name ?? null,
      email: parsed.data.email,
      topic: parsed.data.topic,
      message: parsed.data.message,
    })
  } catch (error) {
    console.error('Contact notification email failed:', error instanceof Error ? error.message : error)
  }

  return Response.json({ data: { received: true } }, { status: 201 })
}
