import { auth } from '@/lib/auth/auth'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { jsonError } from '@/lib/community'
import { getLessonHref } from '@/lib/lesson-links'

export const dynamic = 'force-dynamic'

type ReportRow = Awaited<ReturnType<typeof loadReports>>[number]

async function loadReports(status: string) {
  return prisma.report.findMany({
    where: status === 'all' ? {} : { status },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      reporter: { select: { id: true, name: true, image: true, email: true } },
      reviewedBy: { select: { id: true, name: true } },
    },
  })
}

export async function GET(request: Request) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) {
    return jsonError(403, 'FORBIDDEN', 'Maintainer access required.')
  }

  const url = new URL(request.url)
  const statusParam = url.searchParams.get('status')
  const status = ['open', 'resolved', 'dismissed', 'all'].includes(statusParam ?? '')
    ? (statusParam as string)
    : 'open'

  const reports = await loadReports(status)

  const projectIds = reports
    .filter((report) => report.targetType === 'project')
    .map((report) => report.targetId)
  const commentIds = reports
    .filter((report) => report.targetType === 'comment')
    .map((report) => report.targetId)
  const profileIds = reports
    .filter((report) => report.targetType === 'profile')
    .map((report) => report.targetId)

  const [projects, comments, profiles] = await Promise.all([
    projectIds.length
      ? prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: {
            id: true,
            title: true,
            description: true,
            userId: true,
            user: { select: { name: true } },
          },
        })
      : [],
    commentIds.length
      ? prisma.comment.findMany({
          where: { id: { in: commentIds } },
          select: {
            id: true,
            body: true,
            userId: true,
            targetType: true,
            targetId: true,
            user: { select: { name: true } },
          },
        })
      : [],
    profileIds.length
      ? prisma.user.findMany({
          where: { id: { in: profileIds } },
          select: { id: true, name: true, email: true, image: true },
        })
      : [],
  ])

  const projectById = new Map(projects.map((project) => [project.id, project]))
  const commentById = new Map(comments.map((comment) => [comment.id, comment]))
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]))

  const data = reports.map((report: ReportRow) => {
    let title = 'Deleted content'
    let preview = ''
    let href: string | null = null
    let authorName: string | null = null
    let available = true

    if (report.targetType === 'project') {
      const project = projectById.get(report.targetId)
      if (!project) {
        available = false
      } else {
        title = project.title
        preview = project.description.slice(0, 240)
        href = `/community/showcase/${project.id}`
        authorName = project.user.name
      }
    } else if (report.targetType === 'comment') {
      const comment = commentById.get(report.targetId)
      if (!comment) {
        available = false
      } else {
        title = 'Comment'
        preview = comment.body.slice(0, 240)
        href =
          comment.targetType === 'lesson'
            ? `${getLessonHref(comment.targetId)}#discussion-heading`
            : `/community/showcase/${comment.targetId}?comment=${comment.id}#discussion-heading`
        authorName = comment.user.name
      }
    } else {
      const profile = profileById.get(report.targetId)
      if (!profile) {
        available = false
      } else {
        title = profile.name ?? 'Unnamed learner'
        preview = profile.email
        href = `/community/people/${profile.id}`
        authorName = profile.name
      }
    }

    return {
      id: report.id,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      details: report.details,
      status: report.status,
      resolutionNote: report.resolutionNote,
      createdAt: report.createdAt.toISOString(),
      reviewedAt: report.reviewedAt?.toISOString() ?? null,
      reviewedBy: report.reviewedBy,
      reporter: {
        id: report.reporter.id,
        name: report.reporter.name,
        image: report.reporter.image,
      },
      target: { title, preview, href, authorName, available },
    }
  })

  return Response.json(
    { data, status },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
