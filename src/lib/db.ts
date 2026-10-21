import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Vercel reuses a warm function instance for multiple requests, so a single
// Prisma client (and its pg pool) should be shared instead of reconnecting on
// every invocation. The module cache is enough in production; the global is
// for local development hot reloads.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (connectionString) {
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    })
  }

  // Local fallback when no database is configured. The app's core learning
  // experience works without auth/community persistence.
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
