import { after } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { getEarnedBadges } from '@/lib/badges'
import { getPersistedBadges, syncUserBadges, type EarnedBadge } from '@/lib/badge-awards'
import type { ProgressState } from '@/lib/progress-state'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
  publicUserSelect,
} from '@/lib/community'
import {
  getFollowCounts,
  getFollowRelationship,
  getProfileViewCounts,
  recordProfileView,
} from '@/lib/social'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * Resolve a user by either their CUID (id) or username.
 * Returns the user's actual database id.
 */
export async function resolveUserId(identifier: string): Promise<string | null> {
  // First try exact ID match (could be CUID or shortened id like "admin")
  const byId = await prisma.user.findUnique({
    where: { id: identifier },
    select: { id: true },
  })
  if (byId) return byId.id

  // Then try username match (case-insensitive)
  if (identifier.length >= 3 && identifier.length <= 30) {
    const byUsername = await prisma.user.findUnique({
      where: { username: identifier.toLowerCase() },
      select: { id: true },
    })
    if (byUsername) return byUsername.id
  }

  return null
}

export async function GET(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const { id: identifier } = await params
  const userId = await resolveUserId(identifier)

  if (!userId) {
    return jsonError(404, 'NOT_FOUND', 'Profile not found.')
  }

  const session = await auth()
  const viewerId = session?.user?.id ?? null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...publicUserSelect,
      username: true,
      preferences: { select: { showProgress: true, featuredBadges: true } },
    },
  })

  if (!user) return jsonError(404, 'NOT_FOUND', 'Profile not found.')
  if (!user.name && !user.bio && !user.image && viewerId !== user.id) {
    // Providers are allowed to omit names; avoid publishing empty shells.
    // The viewer can always open their own profile to fill it in.
    return jsonError(404, 'NOT_FOUND', 'Profile not found.')
  }

  const isSelf = viewerId === user.id
  const canSeeProgress = isSelf || (user.preferences?.showProgress ?? true)

  const [
    stats,
    completedRows,
    projects,
    projectCount,
    commentCount,
    upvoteCount,
    followCounts,
    relationship,
    viewCounts,
  ] = await Promise.all([
    prisma.userStats.findUnique({
      where: { userId: user.id },
      select: { xp: true, streakCurrent: true, streakLongest: true },
    }),
    prisma.userProgress.findMany({
      where: { userId: user.id, completed: true },
      select: { lessonKey: true, completedAt: true },
    }),
    prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        upvoteRows: { where: { userId: viewerId ?? '__none__' }, select: { id: true } },
      },
    }),
    prisma.project.count({ where: { userId: user.id } }),
    prisma.comment.count({ where: { userId: user.id } }),
    prisma.projectUpvote.count({ where: { userId: user.id } }),
    getFollowCounts(user.id),
    getFollowRelationship(viewerId, user.id),
    isSelf ? getProfileViewCounts(user.id) : Promise.resolve(null),
    recordProfileView(request, user.id, viewerId),
  ])

  const progressState: ProgressState = {
    lessons: Object.fromEntries(
      completedRows.map((row) => [
        row.lessonKey,
        {
          completed: true,
          ...(row.completedAt ? { completedAt: row.completedAt.toISOString() } : {}),
        },
      ])
    ),
    xp: stats?.xp ?? 0,
    streak: {
      current: stats?.streakCurrent ?? 0,
      longest: stats?.streakLongest ?? 0,
      lastActiveDate: null,
    },
    bookmarks: [],
    lastVisited: null,
  }

  const computedBadges = getEarnedBadges({
    state: progressState,
    contributions: {
      projects: projectCount,
      comments: commentCount,
      upvotes: upvoteCount,
    },
    followers: followCounts.followers,
    joinedAt: user.createdAt.toISOString(),
  })

  // Prefer persisted awards. Older accounts are backfilled lazily on their
  // first profile view, while the response can still render immediately.
  let earnedBadges: EarnedBadge[] = await getPersistedBadges(user.id)
  if (earnedBadges.length === 0 && computedBadges.length > 0) {
    earnedBadges = computedBadges.map((badge) => ({ ...badge, earnedAt: null }))
    after(async () => {
      try {
        await syncUserBadges(user.id)
      } catch (error) {
        console.error('Failed to backfill profile badges', error)
      }
    })
  }

  const earnedKeys = new Set(computedBadges.map((badge) => badge.key))
  const selectedFeatured = (user.preferences?.featuredBadges ?? [])
    .filter((key) => earnedKeys.has(key))
    .slice(0, 3)
  const featuredBadges =
    selectedFeatured.length > 0
      ? selectedFeatured
      : earnedBadges.slice(0, 3).map((badge) => badge.key)

  return Response.json(
    {
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        bio: user.bio,
        website: user.website,
        githubUrl: user.githubUrl,
        twitterUrl: user.twitterUrl,
        createdAt: user.createdAt.toISOString(),
        isSelf,
        followers: followCounts.followers,
        following: followCounts.following,
        relationship,
        viewCounts,
        progress: canSeeProgress
          ? {
              xp: stats?.xp ?? 0,
              streakCurrent: stats?.streakCurrent ?? 0,
              streakLongest: stats?.streakLongest ?? 0,
              lessonsCompleted: completedRows.length,
              featuredBadges,
              badges: earnedBadges.map((badge) => ({
                key: badge.key,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                category: badge.category,
                tier: badge.tier,
                earnedAt: badge.earnedAt,
              })),
            }
          : null,
        projects: projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          track: project.track,
          tags: project.tags,
          upvotes: project.upvotes,
          createdAt: project.createdAt.toISOString(),
          upvoted: project.upvoteRows.length > 0,
        })),
        contributions: {
          projects: projectCount,
          comments: commentCount,
          upvotes: upvoteCount,
        },
      },
    },
    {
      headers: {
        // Viewer-dependent (isSelf and upvote state), so keep it private.
        'Cache-Control': 'private, max-age=10, stale-while-revalidate=60',
      },
    }
  )
}
