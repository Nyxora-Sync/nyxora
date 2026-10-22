import { auth } from '@/lib/auth/auth'
import { isAdmin } from '@/lib/admin'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function adminMiddleware(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.redirect(new URL('/auth/signin?error=Unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
