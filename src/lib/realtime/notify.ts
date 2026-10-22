import { prisma } from '@/lib/db'
import { getLessonHref } from '@/lib/lesson-links'

function actorLabel(name: string | null | undefined): string {
  return name?.trim() || 'A learner'
}

/** Notify a project owner when someone comments on their project. */
export async function notifyCommentCreated(
  commentId: string,
  targetType: 'lesson' | 'project',
  targetId: string,
  authorId: string
): Promise<void> {
  if (targetType === 'lesson') return

  const project = await prisma.project.findUnique({
    where: { id: targetId },
    select: { userId: true },
  })

  if (!project || project.userId === authorId) return

  await prisma.notification.create({
    data: {
      userId: project.userId,
      actorId: authorId,
      type: 'comment_created',
      message: 'commented on your project',
      href: `/community/showcase/${targetId}?comment=${commentId}#discussion-heading`,
    },
  })
}

/** Notify the parent comment author about a reply. */
export async function notifyCommentReply(
  replyId: string,
  parentCommentId: string,
  authorId: string
): Promise<void> {
  const parentComment = await prisma.comment.findUnique({
    where: { id: parentCommentId },
    select: { userId: true, targetType: true, targetId: true },
  })

  if (!parentComment || parentComment.userId === authorId) return

  const href =
    parentComment.targetType === 'lesson'
      ? `${getLessonHref(parentComment.targetId)}?comment=${replyId}#discussion-heading`
      : `/community/showcase/${parentComment.targetId}?comment=${replyId}#discussion-heading`

  await prisma.notification.create({
    data: {
      userId: parentComment.userId,
      actorId: authorId,
      type: 'comment_reply',
      message: 'replied to your comment',
      href,
    },
  })
}

/** Notify someone that they received a follow request. */
export async function notifyFollowRequest(
  followerId: string,
  followingId: string
): Promise<void> {
  if (followerId === followingId) return

  const actor = await prisma.user.findUnique({
    where: { id: followerId },
    select: { name: true },
  })

  await prisma.notification.create({
    data: {
      userId: followingId,
      actorId: followerId,
      type: 'follow_request',
      message: `${actorLabel(actor?.name)} sent you a follow request.`,
      href: '/settings?tab=profile',
    },
  })
}

/** Notify the requester that their follow request was accepted. */
export async function notifyFollowAccepted(
  followerId: string,
  followingId: string
): Promise<void> {
  const actor = await prisma.user.findUnique({
    where: { id: followingId },
    select: { name: true },
  })

  await prisma.notification.create({
    data: {
      userId: followerId,
      actorId: followingId,
      type: 'follow_accepted',
      message: `${actorLabel(actor?.name)} accepted your follow request.`,
      href: `/community/people/${followingId}`,
    },
  })
}

/** Notify the requester that their follow request was declined. */
export async function notifyFollowRejected(
  followerId: string,
  followingId: string
): Promise<void> {
  const actor = await prisma.user.findUnique({
    where: { id: followingId },
    select: { name: true },
  })

  await prisma.notification.create({
    data: {
      userId: followerId,
      actorId: followingId,
      type: 'follow_rejected',
      message: `${actorLabel(actor?.name)} declined your follow request.`,
      href: `/community/people/${followingId}`,
    },
  })
}

/** Notify a project owner about a new upvote. */
export async function notifyProjectUpvote(
  projectId: string,
  voterId: string
): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  })

  if (!project || project.userId === voterId) return

  await prisma.notification.create({
    data: {
      userId: project.userId,
      actorId: voterId,
      type: 'project_upvote',
      message: 'upvoted your project',
      href: `/community/showcase/${projectId}`,
    },
  })
}
