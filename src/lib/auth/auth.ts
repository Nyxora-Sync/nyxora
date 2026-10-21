import NextAuth, { type NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Email from 'next-auth/providers/email'
import { prisma } from '@/lib/db'
import { sendVerificationRequest } from '@/lib/auth/email'
import { adminCredentials } from '@/lib/auth/admin-credentials'

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

// Admin credentials provider (always available when database is configured)
providers.push(adminCredentials)

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
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ?? (token?.sub as string)
        const userEmail = user?.email ?? token?.email
        session.user.isAdmin = userEmail === 'admin@nyxora.local'
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/learn`
    },
  },
  debug: process.env.NODE_ENV === 'development',
})
