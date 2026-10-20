'use client'

import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./hero-scene'), {
  ssr: false,
  loading: () => null,
})

export function HeroVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.11),rgba(139,92,246,0.09)_45%,transparent_72%)] blur-2xl" />
      <div className="hero-canvas-mask absolute inset-0 opacity-45 dark:opacity-70">
        <HeroScene />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  )
}
