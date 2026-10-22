import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
} from '@/lib/community'
import { resolveUserId } from '../route'

type RouteContext = { params: Promise<{ id: string }> }

const userSelect = {
  id: true,
  name: true,
  image: true,
  username: true,
  bio: true,
  createdAt: true,
} as const

export async function GET(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const { id: identifier } = await params
  const userId = await resolveUserId(identifier)

  if (!userId) {
    return jsonError(404, 'NOT_FOUND', 'Profile not found.')
  }

  const url = new URL(request.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
  const cursor = url.searchParams.get('cursor')

  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
      status: 'accepted',
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      follower: { select: userSelect },
    },
  })

  let nextCursor: string | null = null
  if (followers.length > limit) {
    const next = followers.pop()
    nextCursor = next!.id
  }

  return Response.json({
    data: followers.map((f) => ({
      id: f.follower.id,
      name: f.follower.name,
      image: f.follower.image,
      username: f.follower.username,
      bio: f.follower.bio,
      createdAt: f.createdAt.toISOString(),
    })),
    nextCursor,
  })
}
