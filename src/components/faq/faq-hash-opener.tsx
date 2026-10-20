'use client'

import { useEffect } from 'react'

/**
 * Search results link to individual FAQ answers with a hash. Native
 * <details> elements do not open just because they are the target of a hash,
 * so open the matching item before scrolling to it.
 */
export function FaqHashOpener() {
  useEffect(() => {
    function openFromHash() {
      const raw = window.location.hash.slice(1)
      if (!raw) return

      let id = raw
      try {
        id = decodeURIComponent(raw)
      } catch {
        // Keep the raw fragment if it is not valid percent-encoding.
      }

      const target = document.getElementById(id)
      if (target instanceof HTMLDetailsElement) {
        target.open = true
        target.scrollIntoView({ block: 'start' })
      }
    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  return null
}
