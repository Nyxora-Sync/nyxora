import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
  sinceMinutes,
} from '@/lib/community'
import { actorName } from '@/lib/social'
import { notifyFollowRequest } from '@/lib/realtime/notify'

type RouteContext = { params: Promise<{ id: string }> }

/** Send a follow request. The target must accept before it becomes a follow. */
export async function POST(_request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in to follow someone.')

  const { id } = await params
  if (id === userId) return jsonError(400, 'INVALID_REQUEST', 'You cannot follow yourself.')

  const [target, actor] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { id: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ])
  if (!target) return jsonError(404, 'NOT_FOUND', 'Profile not found.')

  const [existing, reverse] = await Promise.all([
    prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: userId, followingId: id },
      },
      select: { id: true, status: true },
    }),
    prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: id, followingId: userId },
      },
      select: { id: true, status: true },
    }),
  ])

  if (existing?.status === 'accepted') {
    return jsonError(409, 'ALREADY_FOLLOWING', 'You already follow this learner.')
  }
  if (existing?.status === 'pending') {
    return jsonError(409, 'REQUEST_PENDING', 'Your follow request is already pending.')
  }
  if (reverse?.status === 'pending') {
    return jsonError(
      409,
      'INCOMING_REQUEST',
      'This learner has already sent you a follow request. Accept it from your profile.'
    )
  }

  const recent = await prisma.follow.count({
    where: { followerId: userId, createdAt: { gte: sinceMinutes(24 * 60) } },
  })
  if (recent >= 30) {
    return jsonError(429, 'RATE_LIMITED', 'You can send up to 30 follow requests per day.')
  }

  try {
    const follow = await prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId: userId, followingId: id },
      },
      create: { followerId: userId, followingId: id, status: 'pending' },
      update: { status: 'pending' },
      select: { id: true },
    })

    await prisma.notification.create({
      data: {
        userId: id,
        actorId: userId,
        type: 'follow_request',
        message: `${actorName(actor?.name)} sent you a follow request.`,
        href: '/settings?tab=profile',
      },
    })

    // Send real-time notification
    notifyFollowRequest(userId, id).catch(console.error)

    return Response.json({ data: { status: 'pending_outgoing', requestId: follow.id } })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return jsonError(409, 'REQUEST_PENDING', 'Your follow request is already pending.')
    }
    throw error
  }
}

/** Cancel a pending request or unfollow an accepted follow. */
export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const { id } = await params
  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId: userId, followingId: id },
    },
    select: { id: true },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
  }

  return Response.json({ data: { status: 'none' } })
}
