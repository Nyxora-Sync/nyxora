import { createHash } from 'node:crypto'
import { prisma } from '@/lib/db'

const LOGIN_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILED_LOGINS = 5

/** Best-effort client IP from the proxy headers Vercel and Cloudflare set. */
export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()

  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

/**
 * Pseudonymize an IP before storing it. We never persist raw addresses in the
 * audit log, but repeated abuse can still be correlated.
 */
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET || 'nyxora-ip-hash'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

export async function isAdminLoginRateLimited(ipHash: string): Promise<boolean> {
  const failures = await prisma.adminAuditLog.count({
    where: {
      action: 'admin.login_failed',
      ipHash,
      createdAt: { gte: new Date(Date.now() - LOGIN_WINDOW_MS) },
    },
  })

  return failures >= MAX_FAILED_LOGINS
}

export async function recordAdminLogin({
  actorId,
  ipHash,
  success,
}: {
  actorId?: string | null
  ipHash: string
  success: boolean
}): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId: success ? actorId ?? null : null,
        action: success ? 'admin.login_success' : 'admin.login_failed',
        ipHash,
      },
    })
  } catch (error) {
    // Audit logging must never turn a valid login into an outage.
    console.error('Failed to record admin login audit event', error)
  }
}

export async function writeAuditLog({
  actorId,
  action,
  targetType,
  targetId,
  metadata,
  ipHash,
}: {
  actorId: string
  action: string
  targetType?: string
  targetId?: string
  metadata?: Record<string, unknown>
  ipHash?: string
}): Promise<void> {
  await prisma.adminAuditLog.create({
    data: {
      actorId,
      action,
      targetType,
      targetId,
      metadata: metadata as object | undefined,
      ipHash,
    },
  })
}
