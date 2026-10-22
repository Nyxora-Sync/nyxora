import { after } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
  sinceMinutes,
} from '@/lib/community'

const reportSchema = z
  .object({
    targetType: z.enum(['project', 'comment', 'profile']),
    targetId: z.string().trim().min(1).max(160),
    reason: z.enum(['spam', 'harassment', 'inappropriate', 'copyright', 'other']),
    details: z.string().trim().max(1000).optional(),
  })
  .strict()

export async function POST(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in to report content.')

  const body = await request.json().catch(() => null)
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Invalid report',
        },
      },
      { status: 422 }
    )
  }

  const { targetType, targetId, reason, details } = parsed.data

  let ownerId: string | null = null
  if (targetType === 'project') {
    const project = await prisma.project.findUnique({
      where: { id: targetId },
      select: { userId: true },
    })
    ownerId = project?.userId ?? null
  } else if (targetType === 'comment') {
    const comment = await prisma.comment.findUnique({
      where: { id: targetId },
      select: { userId: true },
    })
    ownerId = comment?.userId ?? null
  } else {
    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true },
    })
    ownerId = user?.id ?? null
  }

  if (!ownerId) return jsonError(404, 'NOT_FOUND', 'That content no longer exists.')
  if (ownerId === userId) {
    return jsonError(422, 'INVALID_REPORT', 'You cannot report your own content.')
  }

  const recent = await prisma.report.count({
    where: { reporterId: userId, createdAt: { gte: sinceMinutes(24 * 60) } },
  })
  if (recent >= 10) {
    return jsonError(429, 'RATE_LIMITED', 'You can submit up to 10 reports per day.')
  }

  try {
    const report = await prisma.report.create({
      data: {
        reporterId: userId,
        targetType,
        targetId,
        reason,
        details: details || null,
      },
      select: { id: true, createdAt: true },
    })

    after(async () => {
      try {
        const adminEmails = new Set(
          (process.env.ADMIN_EMAILS ?? '')
            .split(',')
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
        )
        adminEmails.add('admin@nyxora.local')
        const admins = await prisma.user.findMany({
          where: { email: { in: Array.from(adminEmails) } },
          select: { id: true },
        })
        if (admins.length > 0) {
          await prisma.notification.createMany({
            data: admins.map((admin) => ({
              userId: admin.id,
              actorId: userId,
              type: 'moderation_report',
              message: `submitted a report on a ${targetType}.`,
              href: '/admin/reports',
            })),
          })
        }
      } catch (error) {
        console.error('Failed to notify admins about report', error)
      }
    })

    return Response.json(
      { data: { id: report.id, createdAt: report.createdAt.toISOString() } },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return jsonError(409, 'ALREADY_REPORTED', 'You already reported this content.')
    }
    throw error
  }
}
