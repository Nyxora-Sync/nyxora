import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
} from '@/lib/community'

export async function GET() {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        type: true,
        message: true,
        href: true,
        readAt: true,
        createdAt: true,
        actor: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ])

  return Response.json(
    {
      data: {
        notifications: notifications.map((notification) => ({
          id: notification.id,
          type: notification.type,
          message: notification.message,
          href: notification.href,
          readAt: notification.readAt?.toISOString() ?? null,
          createdAt: notification.createdAt.toISOString(),
          actor: notification.actor,
        })),
        unread,
      },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
