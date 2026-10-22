import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing all community data...')
  
  // Delete in correct order to avoid foreign key constraints
  await prisma.notification.deleteMany()
  await prisma.profileView.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.projectUpvote.deleteMany()
  await prisma.project.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.userStats.deleteMany()
  await prisma.userProgress.deleteMany()
  await prisma.userPreferences.deleteMany()
  await prisma.userAvatar.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  
  // Delete users except admin
  await prisma.user.deleteMany({
    where: {
      email: { not: 'admin@nyxora.local' }
    }
  })
  
  console.log('All community data cleared!')
  console.log('Admin user preserved.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
