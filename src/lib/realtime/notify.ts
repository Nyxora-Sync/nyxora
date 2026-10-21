import { prisma } from '@/lib/db'
import { broadcastToUser } from './broadcast'

/** Notification types that can be broadcast in real-time */
export type RealtimeEventType =
  | 'comment_created'
  | 'comment_reply'
  | 'follow_request'
  | 'follow_accepted'
  | 'follow_rejected'
  | 'project_upvote'

interface RealtimeEvent {
  type: RealtimeEventType
  notificationId: string
  actorId: string
  actorName: string
  actorImage: string | null
  message: string
  href: string
  timestamp: string
}

/** Build a realtime event from a notification */
function buildRealtimeEvent(notification: {
  id: string
  type: string
  actorId: string | null
  message: string | null
  href: string | null
  createdAt: Date
  actor?: { id: string; name: string | null; image: string | null } | null
}): RealtimeEvent | null {
  if (!notification.actor) return null

  return {
    type: notification.type as RealtimeEventType,
    notificationId: notification.id,
    actorId: notification.actor.id,
    actorName: notification.actor.name || 'A learner',
    actorImage: notification.actor.image,
    message: notification.message || '',
    href: notification.href || '/',
    timestamp: notification.createdAt.toISOString(),
  }
}

/** Send real-time notification to a user */
export async function sendRealtimeNotification(userId: string, notificationId: string): Promise<boolean> {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: {
        id: true,
        type: true,
        actorId: true,
        message: true,
        href: true,
        createdAt: true,
        actor: { select: { id: true, name: true, image: true } },
      },
    })

    if (!notification) return false

    const event = buildRealtimeEvent(notification)
    if (!event) return false

    broadcastToUser(userId, event)
    return true
  } catch {
    return false
  }
}

/** Send real-time notification to multiple users */
export async function sendRealtimeNotifications(userIds: string[], notificationId: string): Promise<number> {
  let sent = 0
  for (const userId of userIds) {
    if (await sendRealtimeNotification(userId, notificationId)) {
      sent++
    }
  }
  return sent
}

/** Notify when a new comment is created (for lesson/project owners) */
export async function notifyCommentCreated(
  commentId: string,
  targetType: 'lesson' | 'project',
  targetId: string,
  authorId: string
): Promise<void> {
  // Find the owner of the lesson/project
  // For lessons, we don't have a direct owner - skip
  if (targetType === 'lesson') return

  // For projects, get the project owner
  const project = await prisma.project.findUnique({
    where: { id: targetId },
    select: { userId: true },
  })

  if (!project || project.userId === authorId) return

  // Create notification in database
  const notification = await prisma.notification.create({
    data: {
      userId: project.userId,
      actorId: authorId,
      type: 'comment_created',
      message: 'commented on your project',
      href: `/community/showcase/${targetId}?comment=${commentId}`,
    },
  })

  // Broadcast in real-time
  await sendRealtimeNotification(project.userId, notification.id)
}

/** Notify when a reply is made to a comment */
export async function notifyCommentReply(
  replyId: string,
  parentCommentId: string,
  authorId: string
): Promise<void> {
  // Find the parent comment author
  const parentComment = await prisma.comment.findUnique({
    where: { id: parentCommentId },
    select: { userId: true, targetId: true },
  })

  if (!parentComment || parentComment.userId === authorId) return

  // Create notification in database
  const notification = await prisma.notification.create({
    data: {
      userId: parentComment.userId,
      actorId: authorId,
      type: 'comment_reply',
      message: 'replied to your comment',
      href: `/community/showcase/${parentComment.targetId}?comment=${replyId}`,
    },
  })

  // Broadcast in real-time
  await sendRealtimeNotification(parentComment.userId, notification.id)
}

/** Notify when a follow request is created */
export async function notifyFollowRequest(
  followerId: string,
  followingId: string
): Promise<void> {
  if (followerId === followingId) return

  const notification = await prisma.notification.create({
    data: {
      userId: followingId,
      actorId: followerId,
      type: 'follow_request',
      message: 'sent you a follow request',
      href: `/community/people/${followerId}`,
    },
  })

  await sendRealtimeNotification(followingId, notification.id)
}

/** Notify when a follow request is accepted */
export async function notifyFollowAccepted(
  followerId: string,
  followingId: string
): Promise<void> {
  const notification = await prisma.notification.create({
    data: {
      userId: followerId,
      actorId: followingId,
      type: 'follow_accepted',
      message: 'accepted your follow request',
      href: `/community/people/${followingId}`,
    },
  })

  await sendRealtimeNotification(followerId, notification.id)
}

/** Notify when a follow request is rejected */
export async function notifyFollowRejected(
  followerId: string,
  followingId: string
): Promise<void> {
  const notification = await prisma.notification.create({
    data: {
      userId: followerId,
      actorId: followingId,
      type: 'follow_rejected',
      message: 'declined your follow request',
      href: `/community/people/${followingId}`,
    },
  })

  await sendRealtimeNotification(followerId, notification.id)
}

/** Notify when a project is upvoted */
export async function notifyProjectUpvote(
  projectId: string,
  voterId: string
): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  })

  if (!project || project.userId === voterId) return

  const notification = await prisma.notification.create({
    data: {
      userId: project.userId,
      actorId: voterId,
      type: 'project_upvote',
      message: 'upvoted your project',
      href: `/community/showcase/${projectId}`,
    },
  })

  await sendRealtimeNotification(project.userId, notification.id)
}
