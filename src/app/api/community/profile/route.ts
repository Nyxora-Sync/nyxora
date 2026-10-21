import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
  profileSchema,
} from '@/lib/community'
import { getFollowCounts, getProfileViewCounts } from '@/lib/social'


export async function GET() {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const [
    user,
    stats,
    completedCount,
    followCounts,
    viewCounts,
    followRequests,
    notifications,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
        createdAt: true,
        preferences: true,
      },
    }),
    prisma.userStats.findUnique({
      where: { userId },
      select: { xp: true, streakCurrent: true, streakLongest: true },
    }),
    prisma.userProgress.count({ where: { userId, completed: true } }),
    getFollowCounts(userId),
    getProfileViewCounts(userId),
    prisma.follow.findMany({
      where: { followingId: userId, status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        follower: { select: { id: true, name: true, image: true, bio: true } },
      },
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        type: true,
        message: true,
        href: true,
        readAt: true,
        createdAt: true,
        actor: { select: { id: true, name: true, image: true } },
      },
    }),
  ])

  if (!user) return jsonError(404, 'NOT_FOUND', 'Account not found.')

  return Response.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      website: user.website,
      githubUrl: user.githubUrl,
      twitterUrl: user.twitterUrl,
      createdAt: user.createdAt.toISOString(),
      preferences: {
        showProgress: user.preferences?.showProgress ?? true,
        emailUpdates: user.preferences?.emailUpdates ?? false,
        track: user.preferences?.track ?? 'beginner',
      },
      progress: {
        xp: stats?.xp ?? 0,
        streakCurrent: stats?.streakCurrent ?? 0,
        streakLongest: stats?.streakLongest ?? 0,
        lessonsCompleted: completedCount,
      },
      followers: followCounts.followers,
      following: followCounts.following,
      viewCounts,
      followRequests: followRequests.map((request) => ({
        id: request.id,
        createdAt: request.createdAt.toISOString(),
        follower: request.follower,
      })),
      notifications: notifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        href: notification.href,
        readAt: notification.readAt?.toISOString() ?? null,
        createdAt: notification.createdAt.toISOString(),
        actor: notification.actor,
      })),
    },
  })
}

export async function PATCH(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const body = await request.json().catch(() => null)
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Invalid profile',
        },
      },
      { status: 422 }
    )
  }

  const { showProgress, emailUpdates, ...profile } = parsed.data

  const userData: Prisma.UserUpdateInput = {}
  if (profile.name !== undefined) userData.name = profile.name
  if (profile.bio !== undefined) userData.bio = profile.bio
  if (profile.website !== undefined) userData.website = profile.website
  if (profile.githubUrl !== undefined) userData.githubUrl = profile.githubUrl
  if (profile.twitterUrl !== undefined) userData.twitterUrl = profile.twitterUrl

  if (Object.keys(userData).length > 0) {
    await prisma.user.update({ where: { id: userId }, data: userData })
  }

  if (showProgress !== undefined || emailUpdates !== undefined) {
    const preferences = {
      ...(showProgress !== undefined ? { showProgress } : {}),
      ...(emailUpdates !== undefined ? { emailUpdates } : {}),
    }
    await prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, ...preferences },
      update: preferences,
    })
  }

  return Response.json({ data: { updated: true } })
}
