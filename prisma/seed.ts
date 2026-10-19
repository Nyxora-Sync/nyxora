import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const badges = [
  {
    key: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'Target',
    category: 'milestone',
    xpReward: 10,
    criteria: { type: 'completed_count', count: 1 },
  },
  {
    key: 'five-lessons',
    name: 'Getting Warmed Up',
    description: 'Complete 5 lessons',
    icon: 'Flame',
    category: 'milestone',
    xpReward: 25,
    criteria: { type: 'completed_count', count: 5 },
  },
  {
    key: 'ten-lessons',
    name: 'Committed',
    description: 'Complete 10 lessons',
    icon: 'TrendingUp',
    category: 'milestone',
    xpReward: 50,
    criteria: { type: 'completed_count', count: 10 },
  },
  {
    key: 'twenty-lessons',
    name: 'Halfway Hero',
    description: 'Complete 20 lessons',
    icon: 'Rocket',
    category: 'milestone',
    xpReward: 100,
    criteria: { type: 'completed_count', count: 20 },
  },
  {
    key: 'streak-3',
    name: 'On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: 'Flame',
    category: 'streak',
    xpReward: 30,
    criteria: { type: 'streak', days: 3 },
  },
  {
    key: 'streak-7',
    name: 'Unstoppable',
    description: 'Maintain a 7-day learning streak',
    icon: 'Zap',
    category: 'streak',
    xpReward: 75,
    criteria: { type: 'streak', days: 7 },
  },
  {
    key: 'streak-30',
    name: 'Habit Master',
    description: 'Maintain a 30-day learning streak',
    icon: 'Award',
    category: 'streak',
    xpReward: 300,
    criteria: { type: 'streak', days: 30 },
  },
  {
    key: 'xp-100',
    name: 'Century Club',
    description: 'Earn 100 XP',
    icon: 'Zap',
    category: 'milestone',
    xpReward: 20,
    criteria: { type: 'xp', amount: 100 },
  },
  {
    key: 'xp-500',
    name: 'XP Hunter',
    description: 'Earn 500 XP',
    icon: 'Trophy',
    category: 'milestone',
    xpReward: 100,
    criteria: { type: 'xp', amount: 500 },
  },
  {
    key: 'xp-1000',
    name: 'XP Legend',
    description: 'Earn 1000 XP',
    icon: 'Crown',
    category: 'milestone',
    xpReward: 250,
    criteria: { type: 'xp', amount: 1000 },
  },
  {
    key: 'first-project',
    name: 'Builder',
    description: 'Share your first project in the showcase',
    icon: 'Hammer',
    category: 'skill',
    xpReward: 50,
    criteria: { type: 'projects', count: 1 },
  },
  {
    key: 'first-api',
    name: 'API Architect',
    description: 'Complete the Node.js & Express module',
    icon: 'Server',
    category: 'skill',
    xpReward: 100,
    criteria: { type: 'module_complete', track: 'developer', module: 'node-express' },
  },
  {
    key: 'mongo-master',
    name: 'Data Modeler',
    description: 'Complete the MongoDB & Mongoose module',
    icon: 'Database',
    category: 'skill',
    xpReward: 100,
    criteria: { type: 'module_complete', track: 'developer', module: 'mongodb' },
  },
  {
    key: 'react-hooks-master',
    name: 'Hook Master',
    description: 'Complete the React module',
    icon: 'Atom',
    category: 'skill',
    xpReward: 100,
    criteria: { type: 'module_complete', track: 'developer', module: 'react' },
  },
  {
    key: 'deployment-pro',
    name: 'Deployment Pro',
    description: 'Deploy your first MERN app',
    icon: 'CloudUpload',
    category: 'skill',
    xpReward: 150,
    criteria: { type: 'module_complete', track: 'developer', module: 'fullstack' },
  },
  {
    key: 'track-complete-developer',
    name: 'MERN Master',
    description: 'Complete the entire Developer Track',
    icon: 'Crown',
    category: 'special',
    xpReward: 500,
    criteria: { type: 'track_complete', track: 'developer' },
  },
  {
    key: 'track-complete-beginner',
    name: 'Zero to Hero',
    description: 'Complete the entire Beginner Track',
    icon: 'Sparkles',
    category: 'special',
    xpReward: 500,
    criteria: { type: 'track_complete', track: 'beginner' },
  },
]

async function main() {
  console.log('🌱 Seeding badges...')

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: badge,
      create: badge,
    })
  }

  console.log(`✅ Seeded ${badges.length} badges`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })