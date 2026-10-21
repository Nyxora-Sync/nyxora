import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import {
  COMMUNITY_DISABLED,
  communityEnabled,
  jsonError,
} from '@/lib/community'

const MAX_BYTES = 3 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

/** Upload or replace the signed-in user's profile photo. */
export async function POST(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BYTES + 1024 * 1024) {
    return jsonError(413, 'FILE_TOO_LARGE', 'Choose an image smaller than 3 MB.')
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('avatar')
  if (!(file instanceof File)) {
    return jsonError(422, 'VALIDATION_ERROR', 'Choose an image to upload.')
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonError(422, 'INVALID_FILE_TYPE', 'Use a JPG, PNG, WebP, or GIF image.')
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return jsonError(413, 'FILE_TOO_LARGE', 'Choose an image smaller than 3 MB.')
  }

  const data = Buffer.from(await file.arrayBuffer())
  const image = `/api/community/avatar/${userId}?v=${Date.now()}`

  await prisma.$transaction([
    prisma.userAvatar.upsert({
      where: { userId },
      create: { userId, mime: file.type, data: data.toString('base64') },
      update: { mime: file.type, data: data.toString('base64') },
    }),
    prisma.user.update({ where: { id: userId }, data: { image } }),
  ])

  return Response.json(
    { data: { image } },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

/** Remove the uploaded photo. The avatar falls back to the user's initial. */
export async function DELETE() {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return jsonError(401, 'UNAUTHORIZED', 'Sign in first.')

  await prisma.$transaction([
    prisma.userAvatar.deleteMany({ where: { userId } }),
    prisma.user.update({ where: { id: userId }, data: { image: null } }),
  ])

  return Response.json(
    { data: { image: null } },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
