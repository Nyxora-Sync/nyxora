'use client'

import dynamic from 'next/dynamic'

const BadgesClient = dynamic(
  () => import('@/components/badges-client').then((mod) => mod.BadgesClient),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-xl border border-border/50 bg-muted/40" />
        <div className="grid grid-cols-1 gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
          {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-xl border border-border/50 bg-muted/40" />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
)

export function BadgesClientWrapper() {
  return <BadgesClient />
}
