import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { jsonError } from '@/lib/community'

export const dynamic = 'force-dynamic'

/** Badges newly persisted on another device that this browser has not shown. */
export async function GET() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in to load badge notifications.')

  const rows = await prisma.userBadge.findMany({
    where: { userId, notifiedAt: null },
    select: { badge: { select: { key: true } } },
    orderBy: { earnedAt: 'asc' },
    take: 50,
  })

  return Response.json(
    { data: { keys: rows.map((row) => row.badge.key) } },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

const markSchema = z.object({
  keys: z.array(z.string().min(1).max(160)).max(100),
}).strict()

/** Mark toast-seen badges so other devices do not repeat the celebration. */
export async function POST(request: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in to update badge notifications.')

  const body = await request.json().catch(() => null)
  const parsed = markSchema.safeParse(body)
  if (!parsed.success || parsed.data.keys.length === 0) {
    return jsonError(422, 'VALIDATION_ERROR', 'Provide at least one badge key.')
  }

  await prisma.userBadge.updateMany({
    where: {
      userId,
      notifiedAt: null,
      badge: { key: { in: Array.from(new Set(parsed.data.keys)) } },
    },
    data: { notifiedAt: new Date() },
  })

  return Response.json({ data: { ok: true } })
}
