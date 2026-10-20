// Middleware for NextAuth.js on Cloudflare Pages Edge Runtime
// https://next-auth.js.org/configuration/nextjs#middleware

import { auth } from '@/lib/auth/auth'

export default auth((req) => {
  // Runs on edge - can check auth status before page loads
  const isAuthenticated = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/')
  const isPublicPage = ['/', '/learn', '/categories', '/roadmap', '/playground', '/community', '/about', '/faq', '/privacy', '/terms', '/accessibility'].includes(req.nextUrl.pathname)
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')
  const isStaticAsset = req.nextUrl.pathname.startsWith('/_next/') || req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|webp|avif|css|js|woff|woff2)$/)

  // Allow public pages, auth pages, API routes, and static assets
  if (isPublicPage || isAuthPage || isApiRoute || isStaticAsset) {
    return
  }

  // Redirect unauthenticated users to sign-in
  if (!isAuthenticated) {
    const callbackUrl = req.nextUrl.pathname + req.nextUrl.search
    return Response.redirect(new URL(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.nextUrl.origin))
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}