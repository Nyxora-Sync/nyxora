import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
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
      preferences: { select: { showProgress: true } },
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
    completedCount,
    badges,
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
    prisma.userProgress.count({ where: { userId: user.id, completed: true } }),
    prisma.userBadge.findMany({
      where: { userId: user.id },
      orderBy: { earnedAt: 'desc' },
      take: 12,
      include: {
        badge: {
          select: { key: true, name: true, description: true, icon: true, category: true },
        },
      },
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
              lessonsCompleted: completedCount,
              badges: badges.map((entry) => ({
                key: entry.badge.key,
                name: entry.badge.name,
                description: entry.badge.description,
                icon: entry.badge.icon,
                category: entry.badge.category,
                earnedAt: entry.earnedAt.toISOString(),
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
