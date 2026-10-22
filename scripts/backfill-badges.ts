/**
 * One-off (and safe to repeat) backfill for accounts that predate persisted
 * badges and certificates. Run after deploying schema migrations:
 *
 *   npm run db:backfill
 */
import { prisma } from '../src/lib/db'
import { syncUserBadges } from '../src/lib/badge-awards'
import { syncUserCertificates } from '../src/lib/certificates'

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
    orderBy: { createdAt: 'asc' },
  })

  console.log(`Backfilling achievements for ${users.length} accounts...`)
  let failures = 0

  for (const user of users) {
    try {
      const [badges, certificates] = await Promise.all([
        syncUserBadges(user.id),
        syncUserCertificates(user.id),
      ])
      console.log(
        `  ${user.email}: ${badges.earned.length} badges, ${certificates.length} certificates`
      )
    } catch (error) {
      failures += 1
      console.error(`  ${user.email}: failed`, error)
    }
  }

  if (failures > 0) {
    throw new Error(`${failures} account(s) failed to backfill.`)
  }

  console.log('Achievement backfill complete.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
