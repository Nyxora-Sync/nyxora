import { z } from 'zod'
import { tracks } from '@/lib/curriculum'

/**
 * Community features (showcase, discussions, public profiles) all live in
 * PostgreSQL. The rest of the site keeps working without a database, so every
 * route checks this first and returns a friendly 503 instead of throwing.
 */
export function communityEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export function jsonError(status: number, code: string, message: string) {
  return Response.json(
    { error: { code, message } },
    { status, headers: { 'Cache-Control': 'no-store' } }
  )
}

export const COMMUNITY_DISABLED = {
  status: 503,
  code: 'COMMUNITY_UNAVAILABLE',
  message: 'Community features need a configured database. The lessons and playground still work.',
} as const

/** Fields safe to expose on a public profile. Never includes email. */
export const publicUserSelect = {
  id: true,
  name: true,
  image: true,
  bio: true,
  website: true,
  githubUrl: true,
  twitterUrl: true,
  createdAt: true,
} as const

const httpUrl = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine((value) => /^https?:\/\//i.test(value), 'Use an http(s) URL')

const optionalUrl = z
  .union([z.literal(''), httpUrl])
  .transform((value) => (value === '' ? null : value))
  .nullish()

const optionalText = (max: number) =>
  z
    .union([z.literal(''), z.string().trim().max(max)])
    .transform((value) => (value === '' ? null : value))
    .nullish()

const optionalName = z
  .union([z.literal(''), z.string().trim().min(1).max(80)])
  .transform((value) => (value === '' ? null : value))
  .nullish()

export const projectSchema = z
  .object({
    title: z.string().trim().min(4, 'Give your project a title').max(100),
    description: z
      .string()
      .trim()
      .min(30, 'Describe what you built and what you learned (at least 30 characters)')
      .max(4000),
    githubUrl: optionalUrl,
    demoUrl: optionalUrl,
    imageUrl: optionalUrl,
    track: z
      .string()
      .trim()
      .refine((value) => tracks.some((track) => track.key === value), 'Choose a valid track'),
    modules: z.array(z.string().trim().min(1).max(60)).max(12).default([]),
    tags: z.array(z.string().trim().min(1).max(24)).max(8).default([]),
  })
  .strict()

export const projectUpdateSchema = projectSchema.partial().strict()

export const commentSchema = z
  .object({
    targetType: z.enum(['lesson', 'project']),
    targetId: z.string().trim().min(1).max(160),
    body: z.string().trim().min(2, 'Say a little more').max(2000),
    parentId: z.string().trim().min(1).max(40).nullish(),
  })
  .strict()

export const profileSchema = z
  .object({
    name: optionalName,
    bio: optionalText(600),
    website: optionalUrl,
    githubUrl: optionalUrl,
    twitterUrl: optionalUrl,
    showProgress: z.boolean().optional(),
    emailUpdates: z.boolean().optional(),
  })
  .strict()

/** All valid lesson ids, used to reject comments attached to made-up lessons. */
const lessonIds = new Set<string>()
for (const track of tracks) {
  for (const mod of track.modules) {
    for (const lesson of mod.lessons) {
      lessonIds.add(lesson.id)
    }
  }
}

export function isKnownLesson(id: string): boolean {
  return lessonIds.has(id)
}

export function getLimit(url: URL, fallback = 12, max = 48): number {
  const raw = Number(url.searchParams.get('limit'))
  if (!Number.isFinite(raw) || raw < 1) return fallback
  return Math.min(Math.floor(raw), max)
}

/** Basic sliding-window rate limit backed by row counts (no extra infra). */
export function sinceMinutes(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000)
}

export function displayName(user: { name: string | null; email?: string | null }): string {
  return user.name?.trim() || user.email?.split('@')[0] || 'Anonymous learner'
}

export function isHttpUrl(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value)
}
