import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Lightweight liveness/readiness endpoint for uptime monitors and deploys.
 * Never include secrets or user data in the response.
 */
export async function GET() {
  const startedAt = Date.now()

  try {
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json(
      {
        status: 'ok',
        checks: { database: 'ok' },
        latencyMs: Date.now() - startedAt,
        release: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'unknown',
      },
      {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    )
  } catch (error) {
    console.error('Health check failed', error)

    return NextResponse.json(
      {
        status: 'degraded',
        checks: { database: 'error' },
        latencyMs: Date.now() - startedAt,
      },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    )
  }
}
