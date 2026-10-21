import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
} from '@/lib/community'

/** Mark one notification, or every unread notification, as read. */
export async function POST(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const body = await request.json().catch(() => null)
  if (!body || (body.all !== true && typeof body.id !== 'string')) {
    return jsonError(422, 'VALIDATION_ERROR', 'Provide a notification id or all: true.')
  }

  const updated = await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null,
      ...(body.all === true ? {} : { id: body.id }),
    },
    data: { readAt: new Date() },
  })

  return Response.json(
    { data: { updated: updated.count } },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
