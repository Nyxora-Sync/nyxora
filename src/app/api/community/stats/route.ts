import { cacheLife } from 'next/cache'
import { prisma } from '@/lib/db'
import { COMMUNITY_DISABLED, communityEnabled, jsonError } from '@/lib/community'

async function getCommunityStats() {
  'use cache'
  cacheLife('minutes')

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
 * The four aggregates are cached for a minute and served through the CDN.
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
