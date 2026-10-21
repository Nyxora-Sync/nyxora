import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
} from '@/lib/community'
import { actorName } from '@/lib/social'
import { notifyFollowAccepted, notifyFollowRejected, notifyFollowRequest } from '@/lib/realtime/notify'

type RouteContext = { params: Promise<{ id: string }> }

/** Create a follow request. */
export async function POST(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const body = await request.json().catch(() => null)
  const action = body?.action
  const targetUserId = body?.targetUserId

  // Create a new follow request
  if (action === 'create' && targetUserId) {
    if (targetUserId === userId) {
      return jsonError(422, 'VALIDATION_ERROR', 'You cannot follow yourself.')
    }

    // Check if already following or requested
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
      select: { status: true },
    })

    if (existing) {
      if (existing.status === 'accepted') {
        return jsonError(422, 'VALIDATION_ERROR', 'You are already following this user.')
      }
      if (existing.status === 'pending') {
        return jsonError(422, 'VALIDATION_ERROR', 'You already have a pending follow request.')
      }
      // If rejected, allow new request
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
        status: 'pending',
      },
    })

    // Send real-time notification
    notifyFollowRequest(userId, targetUserId).catch(console.error)

    return Response.json({ data: { status: 'pending', requestId: follow.id } }, { status: 201 })
  }

  // Accept or reject an incoming follow request
  if (action !== 'accept' && action !== 'reject') {
    return jsonError(422, 'VALIDATION_ERROR', 'Choose accept, reject, or create.')
  }

  const { id } = await params
  const follow = await prisma.follow.findFirst({
    where: { id, followingId: userId, status: 'pending' },
    select: { id: true, followerId: true },
  })
  if (!follow) {
    return jsonError(404, 'NOT_FOUND', 'This follow request is no longer pending.')
  }

  const recipient = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })

  const status = action === 'accept' ? 'accepted' : 'rejected'
  const updated = await prisma.follow.updateMany({
    where: { id, followingId: userId, status: 'pending' },
    data: { status },
  })
  if (updated.count === 0) {
    return jsonError(404, 'NOT_FOUND', 'This follow request is no longer pending.')
  }

  const name = actorName(recipient?.name)
  await prisma.notification.create({
    data: {
      userId: follow.followerId,
      actorId: userId,
      type: action === 'accept' ? 'follow_accepted' : 'follow_rejected',
      message:
        action === 'accept'
          ? `${name} accepted your follow request.`
          : `${name} declined your follow request.`,
      href: `/community/people/${userId}`,
    },
  })

  // Send real-time notification
  if (action === 'accept') {
    notifyFollowAccepted(follow.followerId, userId).catch(console.error)
  } else {
    notifyFollowRejected(follow.followerId, userId).catch(console.error)
  }

  return Response.json({
    data: { status: action === 'accept' ? 'following' : 'none' },
  })
}
