import { after } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { syncUserBadges } from '@/lib/badge-awards'
import { syncUserCertificates } from '@/lib/certificates'
import { tracks } from '@/lib/curriculum'
import type { ProgressState, PracticeProgress } from '@/lib/progress-state'


const lessonProgressSchema = z.object({
  completed: z.boolean(),
  completedAt: z.string().max(40).nullish(),
  notes: z.string().max(10_000).nullish(),
})

const flashcardProgressSchema = z.object({
  easeFactor: z.number().min(1.3).max(10),
  interval: z.number().int().min(1).max(3650),
  repetitions: z.number().int().min(0).max(1000),
  nextReview: z.string().max(40),
  lastReviewed: z.string().max(40).nullable(),
  lastGrade: z.number().int().min(0).max(3).nullable(),
})

const kataProgressSchema = z.object({
  completed: z.boolean(),
  completedAt: z.string().max(40),
  attempts: z.number().int().min(0).max(1000),
})

const projectProgressSchema = z.object({
  completed: z.boolean(),
  completedAt: z.string().max(40),
  submissionUrl: z.string().max(500).optional(),
})

const drillProgressSchema = z.object({
  completed: z.boolean(),
  completedAt: z.string().max(40),
  notes: z.string().max(10_000).optional(),
})

const practiceProgressSchema = z.object({
  flashcards: z.record(z.string().min(1).max(160), flashcardProgressSchema),
  katas: z.record(z.string().min(1).max(160), kataProgressSchema),
  projects: z.record(z.string().min(1).max(160), projectProgressSchema),
  drills: z.record(z.string().min(1).max(160), drillProgressSchema),
  streak: z.object({
    current: z.number().int().min(0).max(100_000),
    longest: z.number().int().min(0).max(100_000),
    lastActiveDate: z.string().max(10).nullable(),
  }),
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
  practice: practiceProgressSchema.nullish(),
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

const TRANSIENT_DB_CODES = new Set(['P1001', 'P1017', 'P2002', 'P2028', 'P2034'])

function isTransientDbError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof (error as { code?: unknown }).code === 'string' &&
      TRANSIENT_DB_CODES.has((error as { code: string }).code)
  )
}

async function replaceProgress(
  userId: string,
  entries: [string, z.infer<typeof lessonProgressSchema>][],
  statsData: {
    xp: number
    streakCurrent: number
    streakLongest: number
    streakLastActive: Date | null
    bookmarks: string[]
    lastVisitedTrack: string | null
    lastVisitedModule: string | null
    lastVisitedLesson: string | null
    lastVisitedAt: Date | null
    practiceFlashcards: PracticeProgress['flashcards']
    practiceKatas: PracticeProgress['katas']
    practiceProjects: PracticeProgress['projects']
    practiceDrills: PracticeProgress['drills']
    practiceStreakCurrent: number
    practiceStreakLongest: number
    practiceStreakLastActive: Date | null
  }
) {
  // Two tabs can save at the same time. A transaction-scoped advisory lock
  // serializes replacement per learner, so delete + bulk insert cannot race
  // into a unique-constraint failure on (userId, lessonKey).
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await prisma.$transaction(
        async (tx) => {
          await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))::text AS lock`

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

          await tx.userStats.upsert({
            where: { userId },
            create: { userId, ...statsData },
            update: statsData,
          })
        },
        { maxWait: 10_000, timeout: 30_000 }
      )
      return
    } catch (error) {
      if (attempt < 2 && isTransientDbError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)))
        continue
      }
      throw error
    }
  }
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

  // Parse practice JSON fields
  const practiceFlashcards = (stats?.practiceFlashcards as PracticeProgress['flashcards']) ?? {}
  const practiceKatas = (stats?.practiceKatas as PracticeProgress['katas']) ?? {}
  const practiceProjects = (stats?.practiceProjects as PracticeProgress['projects']) ?? {}
  const practiceDrills = (stats?.practiceDrills as PracticeProgress['drills']) ?? {}

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
    practice: {
      flashcards: practiceFlashcards,
      katas: practiceKatas,
      projects: practiceProjects,
      drills: practiceDrills,
      streak: {
        current: stats?.practiceStreakCurrent ?? 0,
        longest: stats?.practiceStreakLongest ?? 0,
        lastActiveDate: stats?.practiceStreakLastActive
          ? stats.practiceStreakLastActive.toISOString().split('T')[0]
          : null,
      },
    },
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

  const practice = payload.practice ?? {
    flashcards: {},
    katas: {},
    projects: {},
    drills: {},
    streak: { current: 0, longest: 0, lastActiveDate: null },
  }

  const practiceStreakLastActive = toDate(practice.streak.lastActiveDate)

  const statsData = {
    xp,
    streakCurrent: payload.streak.current,
    streakLongest: payload.streak.longest,
    streakLastActive,
    bookmarks: Array.from(new Set(payload.bookmarks)),
    ...lastVisited,
    practiceFlashcards: practice.flashcards,
    practiceKatas: practice.katas,
    practiceProjects: practice.projects,
    practiceDrills: practice.drills,
    practiceStreakCurrent: practice.streak.current,
    practiceStreakLongest: practice.streak.longest,
    practiceStreakLastActive,
  }

  await replaceProgress(userId, entries, statsData)

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
    practice: {
      flashcards: practice.flashcards,
      katas: practice.katas,
      projects: practice.projects,
      drills: practice.drills,
      streak: practice.streak,
    },
  }

  // Persist earned badges after the response has been sent so saving progress
  // stays fast. The client toast still unlocks instantly from local state.
  after(async () => {
    try {
      await Promise.all([syncUserBadges(userId), syncUserCertificates(userId)])
    } catch (error) {
      console.error('Failed to sync badges or certificates after progress update', error)
    }
  })

  return Response.json({ state })
}