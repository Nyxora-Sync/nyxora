import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Create a connection pool for the HTTP adapter (edge-compatible)
function createPool() {
  if (!process.env.DATABASE_URL) return undefined
  return new Pool({ connectionString: process.env.DATABASE_URL })
}

// Create Prisma client with appropriate adapter
function createPrismaClient() {
  const pool = createPool()
  
  if (pool) {
    // Edge-compatible: use HTTP adapter via pg
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }
  
  // Fallback: standard client (for local development)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma