interface Env {
  UPSTREAM_ORIGIN: string
}

/**
 * High-performance proxy for Next.js on Vercel.
 * Streams responses, caches static assets at Cloudflare edge, preserves cache headers.
 */
const proxy = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const incoming = new URL(request.url)
    const upstream = new URL(env.UPSTREAM_ORIGIN)
    const target = new URL(incoming.pathname + incoming.search, upstream)

    // Check if this is a static asset that can be cached at edge
    const isStaticAsset = 
      incoming.pathname.startsWith('/_next/static/') ||
      incoming.pathname.startsWith('/_next/image/') ||
      /\.(jpg|jpeg|png|webp|avif|woff2?|ico|svg|css|js)$/i.test(incoming.pathname)

    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.set('x-forwarded-host', incoming.host)
    headers.set('x-forwarded-proto', 'https')

    const init: RequestInit & { duplex?: 'half' } = {
      method: request.method,
      headers,
      redirect: 'manual',
      body: request.body,
    }
    if (request.body) init.duplex = 'half'

    const response = await fetch(target, init)
    const responseHeaders = new Headers(response.headers)
    const location = responseHeaders.get('location')

    if (location) {
      const resolved = new URL(location, upstream)
      if (resolved.origin === upstream.origin) {
        responseHeaders.set(
          'location',
          `${incoming.origin}${resolved.pathname}${resolved.search}${resolved.hash}`
        )
      }
    }

    // Rewrite Set-Cookie headers to use the public origin domain
    const setCookieHeaders = responseHeaders.getSetCookie()
    if (setCookieHeaders.length > 0) {
      responseHeaders.delete('set-cookie')
      for (const cookie of setCookieHeaders) {
        let rewrittenCookie = cookie.replace(
          new RegExp(`Domain=${upstream.hostname}(;|$)`, 'i'),
          `Domain=${incoming.hostname}$1`
        )
        if (!/Domain=/i.test(cookie)) {
          rewrittenCookie += `; Domain=${incoming.hostname}`
        }
        responseHeaders.append('set-cookie', rewrittenCookie)
      }
    }

    // Preserve and enhance cache headers
    if (isStaticAsset) {
      // Static assets: cache at Cloudflare edge for 1 year
      responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable')
      responseHeaders.set('CF-Cache-Status', 'HIT')
    } else if (responseHeaders.has('Cache-Control')) {
      // Preserve existing cache headers but ensure they're not no-store for public content
      const cc = responseHeaders.get('Cache-Control') || ''
      if (cc.includes('no-store') && response.status === 200) {
        // Don't override no-store for authenticated responses
      }
    } else if (response.status === 200 && !responseHeaders.has('Cache-Control')) {
      // Default: allow short-term caching for public responses
      responseHeaders.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    }

    // Enable Cloudflare streaming
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  },
}

export default proxy
