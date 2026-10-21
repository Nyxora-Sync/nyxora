import NextAuth, { type NextAuthConfig, type Session } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Email from 'next-auth/providers/email'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { sendVerificationRequest } from '@/lib/auth/email'
import { compareSync } from 'bcrypt-ts'

const providers: NextAuthConfig['providers'] = []

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  )
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.EMAIL_SERVER) {
  providers.push(
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    })
  )
}

// Admin credentials provider
providers.push(
  Credentials({
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
)

const hasDatabase = Boolean(process.env.DATABASE_URL)

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  // Use the app's own auth screens instead of NextAuth's default /api/auth ones.
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  // Use JWT sessions for all providers. The Prisma adapter is still used for
  // account linking and user management when a database is configured.
  ...(hasDatabase ? { adapter: PrismaAdapter(prisma) } : {}),
  session: { strategy: 'jwt' as const },
  providers,
  cookies: {
    csrfToken: {
      name: 'authjs.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  callbacks: {
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        const user = {
          ...session.user,
          id: (token?.sub as string) ?? '',
          name: token?.name ?? null,
          email: token?.email ?? '',
          image: token?.picture ?? null,
          isAdmin: token?.email === 'admin@nyxora.local',
        }
        session.user = user
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
        if (user.name != null) token.name = user.name
        if (user.email != null) token.email = user.email
        if (user.image != null) token.picture = user.image
      }

      // Always sync token with latest user data from database
      if (token.sub && process.env.DATABASE_URL) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { name: true, image: true, email: true },
          })
          if (dbUser) {
            token.name = dbUser.name
            token.image = dbUser.image
            token.email = dbUser.email
          }
        } catch {
          // Ignore DB errors, keep existing token
        }
      }

      if (trigger === 'update' && session && typeof session === 'object') {
        const updateData = session as { name?: string | null; image?: string | null }
        if (updateData.name != null) token.name = updateData.name
        if (updateData.image != null) token.picture = updateData.image
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/learn`
    },
  },
  debug: process.env.NODE_ENV === 'development',
})
