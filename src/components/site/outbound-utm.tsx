'use client'

import { useEffect } from 'react'

const UTM_PARAMS = {
  utm_source: 'mern-learn',
  utm_medium: 'referral',
  utm_campaign: 'outbound',
} as const

function enhanceLink(anchor: HTMLAnchorElement) {
  if (anchor.dataset.utmEnhanced === 'true') return
  if (anchor.hasAttribute('download')) return

  const rawHref = anchor.getAttribute('href')
  if (!rawHref || rawHref.startsWith('#') || /^(mailto|tel|javascript):/i.test(rawHref)) {
    return
  }

  let url: URL
  try {
    url = new URL(rawHref, window.location.href)
  } catch {
    return
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return
  if (url.origin === window.location.origin) return

  // Respect links that already carry campaign data from another source.
  if (!url.searchParams.has('utm_source')) {
    for (const [key, value] of Object.entries(UTM_PARAMS)) {
      url.searchParams.set(key, value)
    }
    anchor.href = url.toString()
  }

  anchor.dataset.utmEnhanced = 'true'
}

function scanForOutboundLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(enhanceLink)
}

/**
 * Adds campaign attribution to every outbound link that appears on the site,
 * including links rendered later by client components. Internal links,
 * anchors, mail links, telephone links, and downloads are left untouched.
 */
export function OutboundUtm() {
  useEffect(() => {
    scanForOutboundLinks()

    function enhanceEventTarget(event: Event) {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest<HTMLAnchorElement>('a[href]')
      if (anchor) enhanceLink(anchor)
    }

    const observer = new MutationObserver(scanForOutboundLinks)
    observer.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('pointerdown', enhanceEventTarget, true)
    document.addEventListener('click', enhanceEventTarget, true)

    return () => {
      observer.disconnect()
      document.removeEventListener('pointerdown', enhanceEventTarget, true)
      document.removeEventListener('click', enhanceEventTarget, true)
    }
  }, [])

  return null
}
