import { put } from '@vercel/blob'
import { auth } from '@/lib/auth/auth'
import { COMMUNITY_DISABLED, communityEnabled, jsonError } from '@/lib/community'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])

export async function POST(request: Request) {
  if (!communityEnabled()) {
    return jsonError(COMMUNITY_DISABLED.status, COMMUNITY_DISABLED.code, COMMUNITY_DISABLED.message)
  }

  const session = await auth()
  if (!session?.user?.id) {
    return jsonError(401, 'UNAUTHORIZED', 'Sign in to upload an image.')
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return jsonError(
      503,
      'UPLOADS_DISABLED',
      'Image uploads are not configured on this deployment. Paste a direct image URL instead.'
    )
  }

  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')

  if (!(file instanceof File)) {
    return jsonError(422, 'INVALID_FILE', 'Choose an image to upload.')
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonError(422, 'INVALID_FILE', 'Use a JPEG, PNG, WebP, GIF, or AVIF image.')
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return jsonError(422, 'INVALID_FILE', 'Images must be smaller than 5 MB.')
  }

  try {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'img'
    const blob = await put(
      `community/${session.user.id}/${Date.now()}.${extension}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type,
      }
    )

    return Response.json({ data: { url: blob.url } }, { status: 201 })
  } catch (error) {
    console.error('Project image upload failed', error)
    return jsonError(502, 'UPLOAD_FAILED', 'Could not upload that image. Try a smaller file.')
  }
}
