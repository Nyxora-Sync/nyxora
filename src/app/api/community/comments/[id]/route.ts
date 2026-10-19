import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { COMMUNITY_DISABLED, communityEnabled, jsonError } from '@/lib/community'

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const { id } = await params
  const comment = await prisma.comment.findUnique({ where: { id }, select: { userId: true } })
  if (!comment) return jsonError(404, 'NOT_FOUND', 'Comment not found.')
  if (comment.userId !== userId) {
    return jsonError(403, 'FORBIDDEN', 'You can only delete your own comment.')
  }

  // Replies cascade with the parent.
  await prisma.comment.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
