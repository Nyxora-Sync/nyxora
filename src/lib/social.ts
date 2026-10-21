import { prisma } from '@/lib/db'

export type FollowRelationshipStatus =
  | 'self'
  | 'none'
  | 'following'
  | 'pending_outgoing'
  | 'pending_incoming'

export interface FollowRelationship {
  status: FollowRelationshipStatus
  /** Present for an incoming pending request, so the profile can accept it. */
  requestId: string | null
}

export interface ProfileViewCounts {
  allTime: number
  month: number
  week: number
  day: number
}

function startOfUtcDay(date = new Date()): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

/**
 * Visitor counts are for unique people, not page loads. ProfileView stores at
 * most one row per viewer per UTC day, and these queries count distinct
 * viewer keys across the requested window.
 */
export async function getProfileViewCounts(
  profileUserId: string
): Promise<ProfileViewCounts> {
  const now = new Date()
  const dayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  )

  const rows = await prisma.$queryRaw<
    Array<{ allTime: number; month: number; week: number; day: number }>
  >`
    SELECT
      COUNT(DISTINCT "viewerKey")::int AS "allTime",
      COUNT(DISTINCT "viewerKey") FILTER (WHERE "viewedAt" >= ${monthStart})::int AS "month",
      COUNT(DISTINCT "viewerKey") FILTER (WHERE "viewedAt" >= ${weekStart})::int AS "week",
      COUNT(DISTINCT "viewerKey") FILTER (WHERE "viewedAt" >= ${dayStart})::int AS "day"
    FROM "ProfileView"
    WHERE "profileUserId" = ${profileUserId}
  `

  return rows[0] ?? { allTime: 0, month: 0, week: 0, day: 0 }
}

async function anonymousViewerKey(request: Request): Promise<string> {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  const userAgent = request.headers.get('user-agent') ?? ''
  const secret = process.env.AUTH_SECRET ?? 'nyxora-profile-view'
  const input = new TextEncoder().encode(`${ip}\n${userAgent}\n${secret}`)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', input)
  const hash = Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return `anon:${hash}`
}

/**
 * Records one visit per visitor per day. Self-views are deliberately ignored.
 * A failure here must never prevent someone from viewing a profile.
 */
export async function recordProfileView(
  request: Request,
  profileUserId: string,
  viewerId: string | null
): Promise<void> {
  if (viewerId === profileUserId) return

  try {
    const viewerKey = viewerId
      ? `user:${viewerId}`
      : await anonymousViewerKey(request)
    const now = new Date()
    const viewDate = startOfUtcDay(now)

    await prisma.profileView.upsert({
      where: {
        profileUserId_viewerKey_viewDate: {
          profileUserId,
          viewerKey,
          viewDate,
        },
      },
      create: {
        profileUserId,
        viewerId,
        viewerKey,
        viewDate,
      },
      update: { viewedAt: now },
    })
  } catch {
    // Visitor analytics are best-effort.
  }
}

export async function getFollowRelationship(
  viewerId: string | null,
  profileUserId: string
): Promise<FollowRelationship> {
  if (!viewerId || viewerId === profileUserId) {
    return {
      status: viewerId === profileUserId ? 'self' : 'none',
      requestId: null,
    }
  }

  const rows = await prisma.follow.findMany({
    where: {
      OR: [
        { followerId: viewerId, followingId: profileUserId },
        { followerId: profileUserId, followingId: viewerId },
      ],
    },
    select: {
      id: true,
      followerId: true,
      followingId: true,
      status: true,
    },
  })

  const outgoing = rows.find((row) => row.followerId === viewerId)
  const incoming = rows.find((row) => row.followerId === profileUserId)

  if (outgoing?.status === 'accepted') {
    return { status: 'following', requestId: null }
  }
  if (outgoing?.status === 'pending') {
    return { status: 'pending_outgoing', requestId: null }
  }
  if (incoming?.status === 'pending') {
    return { status: 'pending_incoming', requestId: incoming.id }
  }
  return { status: 'none', requestId: null }
}

export async function getFollowCounts(userId: string) {
  const rows = await prisma.$queryRaw<
    Array<{ followers: number; following: number }>
  >`
    SELECT
      COUNT(*) FILTER (WHERE "followingId" = ${userId} AND status = 'accepted')::int AS "followers",
      COUNT(*) FILTER (WHERE "followerId" = ${userId} AND status = 'accepted')::int AS "following"
    FROM "Follow"
  `
  return rows[0] ?? { followers: 0, following: 0 }
}

export function actorName(name: string | null | undefined): string {
  return name?.trim() || 'A learner'
}
