import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { tracks } from '@/lib/curriculum'
import type { ProgressState } from '@/lib/progress-state'

export const runtime = 'edge'

const lessonProgressSchema = z.object({
  completed: z.boolean(),
  completedAt: z.string().max(40).nullish(),
  notes: z.string().max(10_000).nullish(),
})

const progressStateSchema = z.object({
  lessons: z
    .record(z.string().min(1).max(160), lessonProgressSchema)
    .refine((lessons) => Object.keys(lessons).length <= 500, {
      message: 'Too many lessons in payload',
    }),
  xp: z.number().int().min(0).max(10_000_000),
  streak: z.object({
    current: z.number().int().min(0).max(100_000),
    longest: z.number().int().min(0).max(100_000),
    lastActiveDate: z.string().max(10).nullable(),
  }),
  bookmarks: z.array(z.string().min(1).max(160)).max(500),
  lastVisited: z
    .object({
      track: z.string().max(160),
      module: z.string().max(160),
      lesson: z.string().max(160),
      timestamp: z.string().max(40),
    })
    .nullish(),
})

const xpByLesson = new Map<string, number>()
for (const track of tracks) {
  for (const mod of track.modules) {
    for (const lesson of mod.lessons) {
      xpByLesson.set(lesson.id, lesson.xpReward)
    }
  }
}

function toDate(value?: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id ?? null
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [rows, stats] = await Promise.all([
    prisma.userProgress.findMany({ where: { userId } }),
    prisma.userStats.findUnique({ where: { userId } }),
  ])

  const state: ProgressState = {
    lessons: Object.fromEntries(
      rows.map((row) => [
        row.lessonKey,
        {
          completed: row.completed,
          ...(row.completedAt ? { completedAt: row.completedAt.toISOString() } : {}),
          ...(row.notes ? { notes: row.notes } : {}),
        },
      ])
    ),
    xp: stats?.xp ?? 0,
    streak: {
      current: stats?.streakCurrent ?? 0,
      longest: stats?.streakLongest ?? 0,
      lastActiveDate: stats?.streakLastActive
        ? stats.streakLastActive.toISOString().split('T')[0]
        : null,
    },
    bookmarks: stats?.bookmarks ?? [],
    lastVisited:
      stats?.lastVisitedTrack &&
      stats.lastVisitedModule &&
      stats.lastVisitedLesson &&
      stats.lastVisitedAt
        ? {
            track: stats.lastVisitedTrack,
            module: stats.lastVisitedModule,
            lesson: stats.lastVisitedLesson,
            timestamp: stats.lastVisitedAt.toISOString(),
          }
        : null,
  }

  return Response.json({ state })
}

export async function PUT(request: Request) {
  const session = await auth()
  const userId = session?.user?.id ?? null
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = progressStateSchema.safeParse(
    body && typeof body === 'object' && 'state' in body ? body.state : null
  )
  if (!parsed.success) {
    return Response.json({ error: 'Invalid progress payload' }, { status: 400 })
  }

  const payload = parsed.data

  // Only persist lessons that have been completed or annotated.
  const entries = Object.entries(payload.lessons).filter(
    ([, progress]) => progress.completed || Boolean(progress.notes?.trim())
  )
  // Never trust a client-provided XP total: recompute it from the curriculum.
  const xp = entries.reduce(
    (sum, [key, progress]) =>
      progress.completed ? sum + (xpByLesson.get(key) ?? 0) : sum,
    0
  )

  const lastVisited = payload.lastVisited
    ? {
        lastVisitedTrack: payload.lastVisited.track,
        lastVisitedModule: payload.lastVisited.module,
        lastVisitedLesson: payload.lastVisited.lesson,
        lastVisitedAt: toDate(payload.lastVisited.timestamp),
      }
    : {
        lastVisitedTrack: null,
        lastVisitedModule: null,
        lastVisitedLesson: null,
        lastVisitedAt: null,
      }

  const streakLastActive = toDate(payload.streak.lastActiveDate)

  await prisma.$transaction(async (tx) => {
    // PUT replaces the learner's saved progress. Replacing the rows in two
    // statements avoids one upsert round-trip per lesson.
    await tx.userProgress.deleteMany({ where: { userId } })

    if (entries.length > 0) {
      await tx.userProgress.createMany({
        data: entries.map(([lessonKey, progress]) => ({
          userId,
          lessonKey,
          completed: progress.completed,
          notes: progress.notes?.trim() ? progress.notes : null,
          xpEarned: progress.completed ? (xpByLesson.get(lessonKey) ?? 0) : 0,
          completedAt: progress.completed
            ? toDate(progress.completedAt) ?? new Date()
            : null,
        })),
      })
    }

    const statsData = {
      xp,
      streakCurrent: payload.streak.current,
      streakLongest: payload.streak.longest,
      streakLastActive,
      bookmarks: Array.from(new Set(payload.bookmarks)),
      ...lastVisited,
    }

    await tx.userStats.upsert({
      where: { userId },
      create: { userId, ...statsData },
      update: statsData,
    })
  })

  const sanitizedLessons: ProgressState['lessons'] = {}
  for (const [lessonKey, progress] of entries) {
    sanitizedLessons[lessonKey] = {
      completed: progress.completed,
      ...(progress.completed
        ? { completedAt: toDate(progress.completedAt)?.toISOString() ?? new Date().toISOString() }
        : {}),
      ...(progress.notes?.trim() ? { notes: progress.notes } : {}),
    }
  }

  const state: ProgressState = {
    lessons: sanitizedLessons,
    xp,
    streak: payload.streak,
    bookmarks: Array.from(new Set(payload.bookmarks)),
    lastVisited: payload.lastVisited
      ? { ...payload.lastVisited, timestamp: toDate(payload.lastVisited.timestamp)?.toISOString() ?? new Date().toISOString() }
      : null,
  }

  return Response.json({ state })
}
