import { prisma } from '@/lib/db'
import { compareSync } from 'bcrypt-ts'
import { encode as jwtEncode } from '@auth/core/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production'
const COOKIE_NAME = '__Secure-authjs.session-token'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const callbackUrl = (formData.get('callbackUrl') as string) || '/'

    if (!username || !password) {
      return NextResponse.json({ error: 'MissingCredentials' }, { status: 400 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@nyxora.local' },
    })

    if (!adminUser) {
      console.error('Admin user not found')
      return NextResponse.json({ error: 'InvalidCredentials', detail: 'User not found' }, { status: 401 })
    }
    if (!adminUser.passwordHash) {
      console.error('Admin user has no password hash')
      return NextResponse.json({ error: 'InvalidCredentials', detail: 'No password hash' }, { status: 401 })
    }

    const isValid = compareSync(password, adminUser.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'InvalidCredentials', detail: 'Wrong password' }, { status: 401 })
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

    // Create response with session cookie
    const response = NextResponse.json({ redirectUrl: callbackUrl }, { status: 200 })
    response.cookies.set('__Secure-authjs.session-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'InternalError', detail: String(error) }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/auth/signin', request.url))
}
