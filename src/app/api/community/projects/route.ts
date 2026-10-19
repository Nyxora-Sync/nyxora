import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  getLimit,
  jsonError,
  projectSchema,
  publicUserSelect,
  sinceMinutes,
} from '@/lib/community'

function serializeProject(
  project: {
    id: string
    title: string
    description: string
    githubUrl: string | null
    demoUrl: string | null
    imageUrl: string | null
    track: string
    modules: string[]
    tags: string[]
    upvotes: number
    createdAt: Date
    user: {
      id: string
      name: string | null
      image: string | null
      bio: string | null
      website: string | null
      githubUrl: string | null
      twitterUrl: string | null
      createdAt: Date
    }
    upvoteRows: { id: string }[]
  },
  commentCount = 0
) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    imageUrl: project.imageUrl,
    track: project.track,
    modules: project.modules,
    tags: project.tags,
    upvotes: project.upvotes,
    commentCount,
    createdAt: project.createdAt.toISOString(),
    author: project.user,
    upvoted: project.upvoteRows.length > 0,
  }
}

export async function GET(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const url = new URL(request.url)
  const track = url.searchParams.get('track')
  const tag = url.searchParams.get('tag')
  const sort = url.searchParams.get('sort') === 'popular' ? 'popular' : 'newest'
  const q = url.searchParams.get('q')?.trim()
  const limit = getLimit(url)
  const cursor = url.searchParams.get('cursor')

  const session = await auth()
  const userId = session?.user?.id ?? null

  const where: Prisma.ProjectWhereInput = {}
  if (track === 'beginner' || track === 'developer') where.track = track
  if (tag) where.tags = { has: tag }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const projects = await prisma.project.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy:
      sort === 'popular'
        ? [{ upvotes: 'desc' }, { createdAt: 'desc' }]
        : [{ createdAt: 'desc' }],
    include: {
      user: { select: publicUserSelect },
      // A sentinel id keeps the response shape identical for signed-out visitors.
      upvoteRows: { where: { userId: userId ?? '__none__' }, select: { id: true } },
    },
  })

  const hasMore = projects.length > limit
  const page = hasMore ? projects.slice(0, limit) : projects
  const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null

  const ids = page.map((project) => project.id)
  const commentCounts = ids.length
    ? await prisma.comment.groupBy({
        by: ['targetId'],
        where: { targetType: 'project', targetId: { in: ids } },
        _count: { _all: true },
      })
    : []
  const countByProject = new Map(commentCounts.map((row) => [row.targetId, row._count._all]))

  return Response.json({
    data: page.map((project) => serializeProject(project, countByProject.get(project.id) ?? 0)),
    nextCursor,
    sort,
  })
}

export async function POST(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in to share a project.')

  const body = await request.json().catch(() => null)
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Invalid project',
        },
      },
      { status: 422 }
    )
  }

  const recent = await prisma.project.count({
    where: { userId, createdAt: { gte: sinceMinutes(24 * 60) } },
  })
  if (recent >= 5) {
    return jsonError(429, 'RATE_LIMITED', 'You can share up to 5 projects per day.')
  }

  const modules = Array.from(new Set(parsed.data.modules))
  const tags = Array.from(new Set(parsed.data.tags.map((tag) => tag.toLowerCase())))

  const project = await prisma.project.create({
    data: { ...parsed.data, modules, tags, userId },
    include: {
      user: { select: publicUserSelect },
      upvoteRows: { where: { userId }, select: { id: true } },
    },
  })

  return Response.json({ data: serializeProject(project) }, { status: 201 })
}
