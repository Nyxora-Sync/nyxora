import { auth } from '@/lib/auth/auth'
import { isAdmin } from '@/lib/admin'
import { jsonError } from '@/lib/community'
import { prisma } from '@/lib/db'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) {
    return jsonError(404, 'NOT_FOUND', 'Message not found.')
  }

  if (!process.env.DATABASE_URL) {
    return jsonError(503, 'CONTACT_UNAVAILABLE', 'The contact inbox is temporarily unavailable.')
  }

  const body = (await request.json().catch(() => null)) as { handled?: unknown } | null
  if (!body || typeof body.handled !== 'boolean') {
    return jsonError(422, 'VALIDATION_ERROR', 'Choose whether the message is handled.')
  }

  const { id } = await params
  const updated = await prisma.contactMessage.updateMany({
    where: { id },
    data: { handled: body.handled },
  })

  if (updated.count === 0) {
    return jsonError(404, 'NOT_FOUND', 'Message not found.')
  }

  return Response.json(
    { data: { id, handled: body.handled } },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
