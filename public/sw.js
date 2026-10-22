/* Nyxora Sync app-shell service worker.
 * Deliberately conservative: only static assets are cached. Navigations are
 * network-first and fall back to /offline, so one learner's HTML is never
 * served to another. API and auth requests always go to the network.
 */
const VERSION = 'nyxora-v1'
const OFFLINE_CACHE = `${VERSION}-offline`
const STATIC_CACHE = `${VERSION}-static`
const OFFLINE_URL = '/offline'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(OFFLINE_CACHE)
      .then((cache) =>
        cache.addAll([
          OFFLINE_URL,
          '/site-mark.webp',
          '/icon-192.png',
          '/icon-512.png',
        ])
      )
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    /\.(?:css|js|woff2?|png|jpe?g|webp|avif|gif|svg|ico)$/i.test(url.pathname)
  )
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/admin/')
  ) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(OFFLINE_URL)
        return (
          cached ||
          new Response('You are offline. Reconnect and try again.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        )
      })
    )
    return
  }

  if (!isStaticAsset(url)) return

  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request)
      if (cached) return cached

      const response = await fetch(request)
      if (response.ok) {
        cache.put(request, response.clone()).catch(() => {})
      }
      return response
    })
  )
})
