import { prisma } from '@/lib/db'
import { tracks } from '@/lib/curriculum'

export interface EarnedCertificate {
  id: string
  verificationId: string
  trackKey: string
  trackName: string
  recipientName: string | null
  issuedAt: string
}

function trackLessonIds(track: (typeof tracks)[number]): string[] {
  return track.modules.flatMap((mod) => mod.lessons.map((lesson) => lesson.id))
}

export function trackProgress(trackKey: string, completedLessonIds: Set<string>) {
  const track = tracks.find((candidate) => candidate.key === trackKey)
  if (!track) return { completed: 0, total: 0, percent: 0 }
  const lessonIds = trackLessonIds(track)
  const completed = lessonIds.filter((id) => completedLessonIds.has(id)).length
  return {
    completed,
    total: lessonIds.length,
    percent: lessonIds.length === 0 ? 0 : Math.round((completed / lessonIds.length) * 100),
  }
}

/**
 * Issue certificates for tracks whose every lesson is complete. Idempotent:
 * the unique (userId, trackKey) constraint and createMany skipDuplicates make
 * concurrent progress writes safe.
 */
export async function syncUserCertificates(userId: string): Promise<EarnedCertificate[]> {
  const [user, completedRows] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.userProgress.findMany({
      where: { userId, completed: true },
      select: { lessonKey: true },
    }),
  ])

  if (!user) return []

  const completedIds = new Set(completedRows.map((row) => row.lessonKey))
  const eligible = tracks.filter((track) => {
    const lessonIds = trackLessonIds(track)
    return lessonIds.length > 0 && lessonIds.every((id) => completedIds.has(id))
  })

  if (eligible.length > 0) {
    await prisma.certificate.createMany({
      data: eligible.map((track) => ({
        userId,
        trackKey: track.key,
        trackName: track.name,
        recipientName: user.name?.trim() || 'Nyxora Sync Learner',
      })),
      skipDuplicates: true,
    })
  }

  return getUserCertificates(userId)
}

export async function getUserCertificates(userId: string): Promise<EarnedCertificate[]> {
  const rows = await prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: 'desc' },
    select: {
      id: true,
      verificationId: true,
      trackKey: true,
      trackName: true,
      recipientName: true,
      issuedAt: true,
    },
  })

  return rows.map((row) => ({
    ...row,
    issuedAt: row.issuedAt.toISOString(),
  }))
}

export async function getCertificateByVerificationId(verificationId: string) {
  return prisma.certificate.findUnique({
    where: { verificationId },
    select: {
      id: true,
      verificationId: true,
      trackKey: true,
      trackName: true,
      recipientName: true,
      issuedAt: true,
      user: { select: { name: true } },
    },
  })
}
