import { prisma } from '@/lib/db'
import { communityEnabled } from '@/lib/community'

type RouteContext = { params: Promise<{ id: string }> }

/** Public, immutable-by-URL avatar image served from PostgreSQL. */
export async function GET(_request: Request, { params }: RouteContext) {
  if (!communityEnabled()) {
    return new Response('Not found', { status: 404 })
  }

  const { id } = await params
  const avatar = await prisma.userAvatar.findUnique({
    where: { userId: id },
    select: { mime: true, data: true },
  })

  if (!avatar?.data) {
    return new Response('Not found', { status: 404 })
  }

  const binary = atob(avatar.data)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new Response(bytes, {
    headers: {
      'Content-Type': avatar.mime,
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
