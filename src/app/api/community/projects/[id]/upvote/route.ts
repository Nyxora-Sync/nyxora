import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { COMMUNITY_DISABLED, communityEnabled, jsonError } from '@/lib/community'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * Toggle an upvote. The unique (projectId, userId) constraint makes concurrent
 * double-clicks harmless; the denormalized counter moves in the same
 * transaction so sorting by popularity stays consistent with the vote rows.
 */
export async function POST(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in to upvote a project.')

  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id }, select: { id: true } })
  if (!project) return jsonError(404, 'NOT_FOUND', 'Project not found.')

  const existing = await prisma.projectUpvote.findUnique({
    where: { projectId_userId: { projectId: id, userId } },
  })

  let upvoted: boolean
  if (existing) {
    await prisma.$transaction([
      prisma.projectUpvote.delete({ where: { id: existing.id } }),
      prisma.project.update({ where: { id }, data: { upvotes: { decrement: 1 } } }),
    ])
    upvoted = false
  } else {
    try {
      await prisma.$transaction([
        prisma.projectUpvote.create({ data: { projectId: id, userId } }),
        prisma.project.update({ where: { id }, data: { upvotes: { increment: 1 } } }),
      ])
    } catch (error) {
      // Lost a race with another click: the vote already exists, which is the
      // desired end state. Swallow only the unique-constraint error.
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error
      }
    }
    upvoted = true
  }

  const updated = await prisma.project.findUnique({
    where: { id },
    select: { upvotes: true },
  })

  return Response.json({ data: { upvoted, upvotes: updated?.upvotes ?? 0 } })
}
