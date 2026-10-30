#!/usr/bin/env tsx
/**
 * Change Admin Password Script
 *
 * Usage: npx tsx scripts/change-admin-password.ts "new-secure-password"
 *
 * This script changes the password for the dedicated admin account (admin@nyxora.local).
 * Run this locally with your .env.local file containing DATABASE_URL.
 */

import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt-ts'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@nyxora.local'
  const newPassword = process.argv[2]

  if (!newPassword) {
    console.error('❌ Error: No password provided')
    console.error('')
    console.error('Usage: npx tsx scripts/change-admin-password.ts "new-secure-password"')
    console.error('Example: npx tsx scripts/change-admin-password.ts "MyNewPass123!"')
    process.exit(1)
  }

  if (newPassword.length < 12) {
    console.error('❌ Error: Password must be at least 12 characters')
    process.exit(1)
  }

  if (!/[A-Z]/.test(newPassword)) {
    console.error('❌ Error: Password must contain at least one uppercase letter')
    process.exit(1)
  }

  if (!/[a-z]/.test(newPassword)) {
    console.error('❌ Error: Password must contain at least one lowercase letter')
    process.exit(1)
  }

  if (!/[0-9]/.test(newPassword)) {
    console.error('❌ Error: Password must contain at least one number')
    process.exit(1)
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
    console.error('❌ Error: Password must contain at least one special character')
    process.exit(1)
  }

  const passwordHash = hashSync(newPassword, 10)

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true, email: true, passwordHash: true, name: true },
  })

  if (!existing) {
    console.error(`❌ Error: Admin user (${adminEmail}) not found in database`)
    console.error('Run "npx tsx scripts/create-admin.ts" first to create the admin user')
    process.exit(1)
  }

  await prisma.user.update({
    where: { email: adminEmail },
    data: { passwordHash },
  })

  console.log(`✅ Successfully changed password for admin user: ${existing.email}`)
  console.log(`   User ID: ${existing.id}`)
  console.log(`   Name: ${existing.name || 'nyx'}`)
  console.log('')
  console.log('You can now sign in at /auth/signin with:')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${newPassword}`)
  console.log('')
  console.log('⚠️  Remember to redeploy to Vercel for changes to take effect on production')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })