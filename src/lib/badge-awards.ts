import { prisma } from '@/lib/db'
import {
  badgeDefinitions,
  getEarnedBadges,
  tierOrder,
  type BadgeDefinition,
} from '@/lib/badges'
import type { ProgressState } from '@/lib/progress-state'

export interface EarnedBadge extends BadgeDefinition {
  earnedAt: string | null
}

type BadgeContextRow = Awaited<ReturnType<typeof loadBadgeData>>

/**
 * Loads the same progress/community inputs the client-side badge checks use.
 * Keeping this in one place means dashboard, profile and persistence never
 * drift apart.
 */
export async function loadBadgeData(userId: string) {
  const [user, stats, completedRows, projectCount, commentCount, upvoteCount, followerCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
      prisma.userStats.findUnique({
        where: { userId },
        select: { xp: true, streakCurrent: true, streakLongest: true },
      }),
      prisma.userProgress.findMany({
        where: { userId, completed: true },
        select: { lessonKey: true, completedAt: true },
      }),
      prisma.project.count({ where: { userId } }),
      prisma.comment.count({ where: { userId } }),
      prisma.projectUpvote.count({ where: { userId } }),
      prisma.follow.count({ where: { followingId: userId, status: 'accepted' } }),
    ])

  const state: ProgressState = {
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

  return {
    state,
    contributions: {
      projects: projectCount,
      comments: commentCount,
      upvotes: upvoteCount,
    },
    followers: followerCount,
    joinedAt: user?.createdAt.toISOString() ?? null,
  }
}

export function earnedFromData(data: BadgeContextRow): BadgeDefinition[] {
  return getEarnedBadges({
    state: data.state,
    contributions: data.contributions,
    followers: data.followers,
    joinedAt: data.joinedAt,
  })
}

/**
 * Materializes earned badges in UserBadge, prunes computed badges that no
 * longer qualify (for example after a progress reset), and keeps the profile
 * showcase limited to badges the user still owns.
 */
export async function syncUserBadges(userId: string): Promise<{
  earned: EarnedBadge[]
  newKeys: string[]
}> {
  const data = await loadBadgeData(userId)
  const earned = earnedFromData(data)
  const earnedKeys = new Set(earned.map((badge) => badge.key))

  const [allDefinitionsInDb, existing] = await Promise.all([
    prisma.badge.findMany({
      where: { key: { in: badgeDefinitions.map((badge) => badge.key) } },
      select: { id: true, key: true },
    }),
    prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true, earnedAt: true, badge: { select: { key: true } } },
    }),
  ])

  const badgeIdByKey = new Map(allDefinitionsInDb.map((badge) => [badge.key, badge.id]))
  const missingDefinitions = earned.filter((badge) => !badgeIdByKey.has(badge.key))

  if (missingDefinitions.length > 0) {
    await prisma.badge.createMany({
      data: missingDefinitions.map((badge) => ({
        key: badge.key,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        criteria: {
          type: 'computed',
          tier: badge.tier,
        },
      })),
      skipDuplicates: true,
    })

    const refreshed = await prisma.badge.findMany({
      where: { key: { in: missingDefinitions.map((badge) => badge.key) } },
      select: { id: true, key: true },
    })
    for (const badge of refreshed) badgeIdByKey.set(badge.key, badge.id)
  }

  const earnedRows = earned
    .map((badge) => {
      const badgeId = badgeIdByKey.get(badge.key)
      return badgeId ? { userId, badgeId } : null
    })
    .filter((row): row is { userId: string; badgeId: string } => row !== null)

  const existingKeys = new Set(existing.map((row) => row.badge.key))
  const newKeys = earned.filter((badge) => !existingKeys.has(badge.key)).map((badge) => badge.key)

  if (earnedRows.length > 0) {
    await prisma.userBadge.createMany({
      data: earnedRows,
      skipDuplicates: true,
    })
  }

  // Remove computed badges that are no longer earned. Secret/manual awards are
  // not in badgeDefinitions and are therefore never touched.
  const computedIds = badgeDefinitions
    .map((badge) => badgeIdByKey.get(badge.key))
    .filter((id): id is string => Boolean(id))
  const earnedIds = earnedRows.map((row) => row.badgeId)

  if (computedIds.length > 0) {
    await prisma.userBadge.deleteMany({
      where: {
        userId,
        badgeId: {
          in: computedIds,
          ...(earnedIds.length > 0 ? { notIn: earnedIds } : {}),
        },
      },
    })
  }

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId },
    select: { featuredBadges: true },
  })

  if (preferences) {
    const validFeatured = preferences.featuredBadges
      .filter((key) => earnedKeys.has(key))
      .slice(0, 3)

    if (validFeatured.length !== preferences.featuredBadges.length) {
      await prisma.userPreferences.update({
        where: { userId },
        data: { featuredBadges: validFeatured },
      })
    }
  }

  const earnedAtByKey = new Map(existing.map((row) => [row.badge.key, row.earnedAt.toISOString()]))

  return {
    earned: earned
      .map((badge) => ({
        ...badge,
        earnedAt: earnedAtByKey.get(badge.key) ?? null,
      }))
      .sort(
        (a, b) =>
          tierOrder[a.tier] - tierOrder[b.tier] ||
          badgeDefinitions.indexOf(a) - badgeDefinitions.indexOf(b)
      ),
    newKeys,
  }
}

/** Reads persisted badges without recomputing; used by the public profile. */
export async function getPersistedBadges(userId: string): Promise<EarnedBadge[]> {
  const rows = await prisma.userBadge.findMany({
    where: { userId },
    select: {
      earnedAt: true,
      badge: {
        select: {
          key: true,
          name: true,
          description: true,
          icon: true,
          category: true,
        },
      },
    },
    orderBy: { earnedAt: 'asc' },
  })

  const definitionByKey = new Map(badgeDefinitions.map((badge) => [badge.key, badge]))
  const badges: EarnedBadge[] = []

  for (const row of rows) {
    const definition = definitionByKey.get(row.badge.key)
    if (!definition) continue
    badges.push({
      ...definition,
      earnedAt: row.earnedAt.toISOString(),
    })
  }

  return badges.sort(
    (a, b) =>
      tierOrder[a.tier] - tierOrder[b.tier] ||
      badgeDefinitions.indexOf(a) - badgeDefinitions.indexOf(b)
  )
}
