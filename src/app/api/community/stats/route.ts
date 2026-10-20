import { prisma } from '@/lib/db'
import { COMMUNITY_DISABLED, communityEnabled, jsonError } from '@/lib/community'

// Force dynamic rendering - this endpoint queries the database and must not run at build time
export const dynamic = 'force-dynamic'
export const revalidate = 60

async function getCommunityStats() {
  const [members, projects, comments, lessonsCompleted] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.comment.count(),
    prisma.userProgress.count({ where: { completed: true } }),
  ])

  return { members, projects, comments, lessonsCompleted }
}

/**
 * Real numbers for the community landing page — never invented ones.
 * Cached for 60 seconds via revalidate.
 */
export async function GET() {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  try {
    const data = await getCommunityStats()
    return Response.json(
      { data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    // Database not migrated yet or connection issue
    console.error('Community stats error:', error)
    return Response.json(
      { data: { members: 0, projects: 0, comments: 0, lessonsCompleted: 0 } },
      { status: 200 }
    )
  }
}