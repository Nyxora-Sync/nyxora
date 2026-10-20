'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./hero-scene'), {
  ssr: false,
  loading: () => null,
})

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

/**
 * The Three.js scene is decorative. Keep it out of the mobile bundle and load
 * it only on larger screens once the browser is idle (or after a short delay
 * where requestIdleCallback is unavailable). The CSS glow is always visible.
 */
export function HeroVisual() {
  const [showScene, setShowScene] = useState(false)

  useEffect(() => {
    if (
      !window.matchMedia('(min-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const idleWindow = window as IdleWindow

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(() => setShowScene(true), {
        timeout: 2500,
      })
      return () => idleWindow.cancelIdleCallback?.(handle)
    }

    const timer = window.setTimeout(() => setShowScene(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.11),rgba(139,92,246,0.09)_45%,transparent_72%)] blur-2xl" />
      <div className="hero-canvas-mask absolute inset-0 opacity-45 dark:opacity-70">
        {showScene && <HeroScene />}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  )
}
