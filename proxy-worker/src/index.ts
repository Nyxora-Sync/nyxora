interface Env {
  UPSTREAM_ORIGIN: string
}

/**
 * Thin public-origin proxy. The Next.js app runs on Vercel; this Worker keeps
 * the original sync.nyxora.workers.dev URL and OAuth callback URLs stable.
 * It only streams requests and rewrites upstream redirects, so it stays far
 * below the Workers Free 10 ms CPU limit.
 */
const proxy = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const incoming = new URL(request.url)
    const upstream = new URL(env.UPSTREAM_ORIGIN)
    const target = new URL(incoming.pathname + incoming.search, upstream)

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

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  },
}

export default proxy
