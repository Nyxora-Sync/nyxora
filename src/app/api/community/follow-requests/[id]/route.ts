import { after } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
} from '@/lib/community'
import { notifyFollowAccepted, notifyFollowRejected, notifyFollowRequest } from '@/lib/realtime/notify'
import { syncUserBadges } from '@/lib/badge-awards'

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

    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    })
    if (!target) return jsonError(404, 'NOT_FOUND', 'Profile not found.')

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

    const follow = existing
      ? await prisma.follow.update({
          where: {
            followerId_followingId: {
              followerId: userId,
              followingId: targetUserId,
            },
          },
          data: { status: 'pending' },
        })
      : await prisma.follow.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
            status: 'pending',
          },
        })

    try {
      await notifyFollowRequest(userId, targetUserId)
    } catch (error) {
      console.error('Failed to create follow request notification', error)
    }

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

  const status = action === 'accept' ? 'accepted' : 'rejected'
  const updated = await prisma.follow.updateMany({
    where: { id, followingId: userId, status: 'pending' },
    data: { status },
  })
  if (updated.count === 0) {
    return jsonError(404, 'NOT_FOUND', 'This follow request is no longer pending.')
  }

  try {
    if (action === 'accept') {
      await notifyFollowAccepted(follow.followerId, userId)
    } else {
      await notifyFollowRejected(follow.followerId, userId)
    }
  } catch (error) {
    console.error('Failed to create follow response notification', error)
  }

  if (action === 'accept') {
    after(async () => {
      try {
        await syncUserBadges(userId)
      } catch (error) {
        console.error('Failed to sync follower badges', error)
      }
    })
  }

  return Response.json({
    data: { status: action === 'accept' ? 'following' : 'none' },
  })
}
