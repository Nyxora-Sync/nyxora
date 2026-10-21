import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { compareSync } from 'bcrypt-ts'

export const adminCredentials = Credentials({
  id: 'admin',
  name: 'Admin',
  credentials: {
    username: { label: 'Username', type: 'text' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.username || !credentials?.password) return null

    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@nyxora.local' },
    })

    if (!adminUser || !adminUser.passwordHash) return null

    const isValid = compareSync(credentials.password as string, adminUser.passwordHash)
    if (!isValid) return null

    return {
      id: adminUser.id,
      name: adminUser.name ?? 'nyx',
      email: adminUser.email,
      image: adminUser.image,
    }
  },
})