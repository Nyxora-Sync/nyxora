import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  commentSchema,
  communityEnabled,
  isKnownLesson,
  jsonError,
  publicUserSelect,
  sinceMinutes,
} from '@/lib/community'

export async function GET(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const url = new URL(request.url)
  const targetType = url.searchParams.get('targetType')
  const targetId = url.searchParams.get('targetId')

  if (
    (targetType !== 'lesson' && targetType !== 'project') ||
    !targetId
  ) {
    return jsonError(422, 'VALIDATION_ERROR', 'Provide a valid targetType and targetId.')
  }

  const comments = await prisma.comment.findMany({
    where: {
      targetType,
      targetId,
      parentId: null,
    },
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: {
      user: { select: publicUserSelect },
      replies: {
        orderBy: { createdAt: 'asc' },
        take: 50,
        include: { user: { select: publicUserSelect } },
      },
    },
  })

  return Response.json(
    {
      data: comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        author: comment.user,
        replies: comment.replies.map((reply) => ({
          id: reply.id,
          body: reply.body,
          createdAt: reply.createdAt.toISOString(),
          author: reply.user,
        })),
      })),
    },
    {
      headers: {
        // Discussions are public. A short shared cache absorbs refreshes and
        // repeated page views without making new comments feel stale.
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=120',
      },
    }
  )
}

export async function POST(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in to join the discussion.')

  const body = await request.json().catch(() => null)
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Invalid comment',
        },
      },
      { status: 422 }
    )
  }

  const { targetType, targetId, body: commentBody, parentId } = parsed.data

  if (targetType === 'lesson' && !isKnownLesson(targetId)) {
    return jsonError(404, 'NOT_FOUND', 'That lesson does not exist.')
  }
  if (targetType === 'project') {
    const project = await prisma.project.findUnique({ where: { id: targetId }, select: { id: true } })
    if (!project) return jsonError(404, 'NOT_FOUND', 'That project does not exist.')
  }

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { parentId: true, targetType: true, targetId: true },
    })
    if (!parent || parent.targetType !== targetType || parent.targetId !== targetId) {
      return jsonError(404, 'NOT_FOUND', 'The comment you are replying to does not exist.')
    }
    if (parent.parentId) {
      return jsonError(422, 'VALIDATION_ERROR', 'Replies can only be one level deep.')
    }
  }

  const recent = await prisma.comment.count({
    where: { userId, createdAt: { gte: sinceMinutes(10) } },
  })
  if (recent >= 12) {
    return jsonError(429, 'RATE_LIMITED', 'You are posting quickly — take a breath and try again in a few minutes.')
  }

  const comment = await prisma.comment.create({
    data: { userId, targetType, targetId, body: commentBody, parentId: parentId ?? null },
    include: { user: { select: publicUserSelect } },
  })

  return Response.json(
    {
      data: {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        author: comment.user,
        replies: [],
      },
    },
    { status: 201 }
  )
}
