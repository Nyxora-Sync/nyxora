import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
  projectUpdateSchema,
  publicUserSelect,
} from '@/lib/community'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const { id } = await params
  const session = await auth()
  const userId = session?.user?.id ?? null

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      user: { select: publicUserSelect },
      upvoteRows: { where: { userId: userId ?? '__none__' }, select: { id: true } },
    },
  })

  if (!project) return jsonError(404, 'NOT_FOUND', 'Project not found.')

  const commentCount = await prisma.comment.count({
    where: { targetType: 'project', targetId: id },
  })

  return Response.json({
    data: {
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
      updatedAt: project.updatedAt.toISOString(),
      author: project.user,
      upvoted: project.upvoteRows.length > 0,
      isOwner: userId === project.userId,
    },
  })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const { id } = await params
  const existing = await prisma.project.findUnique({ where: { id }, select: { userId: true } })
  if (!existing) return jsonError(404, 'NOT_FOUND', 'Project not found.')
  if (existing.userId !== userId) {
    return jsonError(403, 'FORBIDDEN', 'You can only edit your own project.')
  }

  const body = await request.json().catch(() => null)
  const parsed = projectUpdateSchema.safeParse(body)
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

  const data = { ...parsed.data }
  if (data.modules) data.modules = Array.from(new Set(data.modules))
  if (data.tags) data.tags = Array.from(new Set(data.tags.map((tag) => tag.toLowerCase())))

  const project = await prisma.project.update({ where: { id }, data })
  return Response.json({ data: { id: project.id, updatedAt: project.updatedAt.toISOString() } })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const { id } = await params
  const existing = await prisma.project.findUnique({ where: { id }, select: { userId: true } })
  if (!existing) return jsonError(404, 'NOT_FOUND', 'Project not found.')
  if (existing.userId !== userId) {
    return jsonError(403, 'FORBIDDEN', 'You can only delete your own project.')
  }

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { targetType: 'project', targetId: id } }),
    prisma.project.delete({ where: { id } }),
  ])

  return new Response(null, { status: 204 })
}
