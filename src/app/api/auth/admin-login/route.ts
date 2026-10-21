import { prisma } from '@/lib/db'
import { compareSync } from 'bcrypt-ts'
import { encode as jwtEncode } from '@auth/core/jwt'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const JWT_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production'
const COOKIE_NAME = '__Secure-authjs.session-token'

export async function POST(request: Request) {
  const formData = await request.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const callbackUrl = (formData.get('callbackUrl') as string) || '/'

  if (!username || !password) {
    return redirect('/auth/signin?error=MissingCredentials')
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@nyxora.local' },
  })

  if (!adminUser || !adminUser.passwordHash) {
    return redirect('/auth/signin?error=InvalidCredentials')
  }

  const isValid = compareSync(password, adminUser.passwordHash)
  if (!isValid) {
    return redirect('/auth/signin?error=InvalidCredentials')
  }

  // Create NextAuth-compatible encrypted JWT session token
  const token = await jwtEncode({
    token: {
      sub: adminUser.id,
      name: adminUser.name ?? 'nyx',
      email: adminUser.email,
      image: adminUser.image,
      isAdmin: true,
    },
    secret: JWT_SECRET,
    salt: COOKIE_NAME,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('__Secure-authjs.session-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return redirect(callbackUrl)
}

export async function GET() {
  return redirect('/auth/signin')
}
