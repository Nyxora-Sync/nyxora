import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
  publicUserSelect,
} from '@/lib/community'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const { id } = await params
  const session = await auth()
  const viewerId = session?.user?.id ?? null

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...publicUserSelect,
      preferences: { select: { showProgress: true } },
    },
  })

  if (!user) return jsonError(404, 'NOT_FOUND', 'Profile not found.')
  if (!user.name && !user.bio && !user.image && viewerId !== id) {
    // Providers are allowed to omit names; avoid publishing empty shells.
    // The viewer can always open their own profile to fill it in.
    return jsonError(404, 'NOT_FOUND', 'Profile not found.')
  }

  const canSeeProgress = viewerId === user.id || (user.preferences?.showProgress ?? true)

  const [stats, completedCount, badges, projects, projectCount, commentCount, upvoteCount] = await Promise.all([
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
  ])

  return Response.json({
    data: {
      id: user.id,
      name: user.name,
      image: user.image,
      bio: user.bio,
      website: user.website,
      githubUrl: user.githubUrl,
      twitterUrl: user.twitterUrl,
      createdAt: user.createdAt.toISOString(),
      isSelf: viewerId === user.id,
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
  })
}
