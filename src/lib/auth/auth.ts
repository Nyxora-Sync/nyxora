import NextAuth, { type NextAuthConfig, type Session } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Email from 'next-auth/providers/email'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { sendVerificationRequest } from '@/lib/auth/email'
import { isAdmin } from '@/lib/admin'
import { getRequestIp, hashIp, isAdminLoginRateLimited, recordAdminLogin } from '@/lib/security'
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
    async authorize(credentials, request) {
      if (!credentials?.username || !credentials?.password) return null

      const ipHash = hashIp(getRequestIp(request))

      try {
        if (await isAdminLoginRateLimited(ipHash)) {
          return null
        }

        const normalizedUsername = String(credentials.username).trim().toLowerCase()
        const adminUser = await prisma.user.findUnique({
          where: { email: 'admin@nyxora.local' },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
          },
        })

        if (
          !adminUser?.passwordHash ||
          !isAdmin(adminUser.email) ||
          normalizedUsername !== adminUser.email.toLowerCase()
        ) {
          await recordAdminLogin({ actorId: adminUser?.id, ipHash, success: false })
          return null
        }

        const isValid = compareSync(
          credentials.password as string,
          adminUser.passwordHash
        )

        if (!isValid) {
          await recordAdminLogin({ actorId: adminUser.id, ipHash, success: false })
          return null
        }

        await recordAdminLogin({ actorId: adminUser.id, ipHash, success: true })

        return {
          id: adminUser.id,
          name: adminUser.name ?? 'nyx',
          email: adminUser.email,
          image: adminUser.image,
        }
      } catch (error) {
        console.error('Admin credential check failed', error)
        return null
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
  session: { strategy: 'jwt' as const, maxAge: 60 * 60 * 24 * 30 }, // 30 days
  providers,
  cookies: {
    csrfToken: {
      name: 'authjs.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax', // Changed from 'none' to 'lax' for better compatibility
        path: '/',
        secure: true,
      },
    },
    sessionToken: {
      name: '__Secure-authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
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
          isAdmin: isAdmin(typeof token?.email === 'string' ? token.email : null),
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

      // Only sync with database on sign-in or when explicitly triggered
      // NOT on every request - this was a major performance bottleneck
      if (user) {
        // Initial sign-in: fetch fresh user data
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

      // Only sync on explicit update trigger
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
