import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { jsonError } from '@/lib/community'
import { getRequestIp, hashIp, writeAuditLog } from '@/lib/security'

const actionSchema = z
  .object({
    action: z.enum(['resolve', 'dismiss', 'delete']),
    note: z.string().trim().max(1000).optional(),
  })
  .strict()

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth()
  const adminId = session?.user?.id
  if (!adminId || !isAdmin(session?.user?.email)) {
    return jsonError(403, 'FORBIDDEN', 'Maintainer access required.')
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = actionSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(422, 'VALIDATION_ERROR', 'Choose resolve, dismiss, or delete.')
  }

  const report = await prisma.report.findUnique({ where: { id } })
  if (!report) return jsonError(404, 'NOT_FOUND', 'Report not found.')

  const { action, note } = parsed.data
  const ipHash = hashIp(getRequestIp(request))
  const reviewedAt = new Date()

  if (action === 'delete') {
    if (report.targetType === 'profile') {
      return jsonError(400, 'UNSUPPORTED', 'Profile reports cannot delete an account from this queue.')
    }

    if (report.targetType === 'project') {
      await prisma.$transaction([
        prisma.comment.deleteMany({
          where: { targetType: 'project', targetId: report.targetId },
        }),
        prisma.project.deleteMany({ where: { id: report.targetId } }),
      ])
    } else {
      const comment = await prisma.comment.findUnique({
        where: { id: report.targetId },
        select: { parentId: true },
      })
      if (comment) {
        await prisma.comment.deleteMany({
          where: comment.parentId
            ? { id: report.targetId }
            : { OR: [{ id: report.targetId }, { parentId: report.targetId }] },
        })
      }
    }

    await prisma.report.updateMany({
      where: {
        targetType: report.targetType,
        targetId: report.targetId,
        status: 'open',
      },
      data: {
        status: 'resolved',
        resolutionNote: note || 'Content removed by a maintainer.',
        reviewedById: adminId,
        reviewedAt,
      },
    })

    await writeAuditLog({
      actorId: adminId,
      action: `moderation.delete_${report.targetType}`,
      targetType: report.targetType,
      targetId: report.targetId,
      metadata: { reportId: report.id, reason: report.reason },
      ipHash,
    })

    return Response.json({ data: { status: 'deleted' } })
  }

  const status = action === 'resolve' ? 'resolved' : 'dismissed'
  const updated = await prisma.report.update({
    where: { id },
    data: {
      status,
      resolutionNote: note || null,
      reviewedById: adminId,
      reviewedAt,
    },
  })

  await writeAuditLog({
    actorId: adminId,
    action: `moderation.${action}_report`,
    targetType: report.targetType,
    targetId: report.targetId,
    metadata: { reportId: report.id, reason: report.reason },
    ipHash,
  })

  return Response.json({ data: { status: updated.status } })
}
