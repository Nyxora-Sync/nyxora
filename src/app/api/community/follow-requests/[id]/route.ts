import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
} from '@/lib/community'
import { actorName } from '@/lib/social'

type RouteContext = { params: Promise<{ id: string }> }

/** Accept or reject an incoming follow request. */
export async function POST(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const body = await request.json().catch(() => null)
  const action = body?.action
  if (action !== 'accept' && action !== 'reject') {
    return jsonError(422, 'VALIDATION_ERROR', 'Choose accept or reject.')
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

  return Response.json({
    data: { status: action === 'accept' ? 'following' : 'none' },
  })
}
