import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt-ts'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@nyxora.local'
  const adminPassword = process.argv[2] // Pass password as first argument

  if (!adminPassword) {
    console.error('Usage: npx tsx scripts/create-admin.ts <password>')
    console.error('Example: npx tsx scripts/create-admin.ts "your-secure-password"')
    process.exit(1)
  }

  if (adminPassword.length < 12) {
    console.error('Password must be at least 12 characters')
    process.exit(1)
  }

  const passwordHash = hashSync(adminPassword, 10)

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true, email: true, passwordHash: true },
  })

  if (existing) {
    if (existing.passwordHash) {
      console.log(`Admin user already exists: ${existing.email}`)
      console.log('Updating password...')
      await prisma.user.update({
        where: { email: adminEmail },
        data: { passwordHash },
      })
      console.log('Password updated successfully')
    } else {
      console.log(`User exists but has no password (OAuth only): ${existing.email}`)
      console.log('Adding password hash...')
      await prisma.user.update({
        where: { email: adminEmail },
        data: { passwordHash },
      })
      console.log('Password added successfully')
    }
  } else {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'nyx',
        passwordHash,
        emailVerified: new Date(),
      },
    })
    console.log(`Created admin user: ${admin.email} (${admin.id})`)
  }

  // Also create UserStats and UserPreferences for the admin
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true },
  })

  // Note: Skipping UserStats/UserPreferences creation due to schema mismatch
// (practice fields exist in Prisma schema but not in production database yet)
  // These will be created on first sign-in via the auth flow

  console.log('\n✅ Admin user ready!')
  console.log('   Email: admin@nyxora.local')
  console.log('   Use this email and your password to sign in at /auth/signin')
  console.log('\n   Make sure to set ADMIN_EMAILS in your .env if you want additional admin emails')
  console.log('   The admin@nyxora.local email is always an admin by default')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })