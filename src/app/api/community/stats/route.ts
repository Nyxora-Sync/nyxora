import { prisma } from '@/lib/db'
import { COMMUNITY_DISABLED, communityEnabled, jsonError } from '@/lib/community'

/**
 * Real numbers for the community landing page — never invented ones.
 * Public and cheap: four aggregate counts.
 */
export async function GET() {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const [members, projects, comments, lessonsCompleted] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.comment.count(),
    prisma.userProgress.count({ where: { completed: true } }),
  ])

  return Response.json(
    { data: { members, projects, comments, lessonsCompleted } },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
