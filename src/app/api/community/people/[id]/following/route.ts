import { auth } from '@/lib/auth/auth'
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

  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
      status: 'accepted',
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      following: { select: userSelect },
    },
  })

  let nextCursor: string | null = null
  if (following.length > limit) {
    const next = following.pop()
    nextCursor = next!.id
  }

  return Response.json({
    data: following.map((f) => ({
      id: f.following.id,
      name: f.following.name,
      image: f.following.image,
      username: f.following.username,
      bio: f.following.bio,
      createdAt: f.createdAt.toISOString(),
    })),
    nextCursor,
  })
}
