import { prisma } from '@/lib/db'
import { COMMUNITY_DISABLED, communityEnabled, jsonError } from '@/lib/community'

export const runtime = 'edge'

async function getCommunityStats() {
  try {
    const [members, projects, comments, lessonsCompleted] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.comment.count(),
      prisma.userProgress.count({ where: { completed: true } }),
    ])
    return { members, projects, comments, lessonsCompleted }
  } catch (error) {
    // Database not migrated yet, or connection issue — return zeros instead of crashing build
    console.warn('Community stats DB query failed (expected at build time):', error)
    return { members: 0, projects: 0, comments: 0, lessonsCompleted: 0 }
  }
}

/**
 * Real numbers for the community landing page — never invented ones.
 * Runs at request time (dynamic by default for API routes).
 * Cached for 60 seconds via Cache-Control header.
 */
export async function GET() {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const data = await getCommunityStats()

  return Response.json(
    { data },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}