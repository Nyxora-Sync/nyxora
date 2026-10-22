'use client'

import dynamic from 'next/dynamic'

const ShowcaseClient = dynamic(
  () => import('@/components/community/showcase-client').then((mod) => mod.ShowcaseClient),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading projects">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-xl border border-border/50 bg-muted/40" />
        ))}
      </div>
    ),
    ssr: false,
  }
)

export function ShowcaseClientWrapper() {
  return <ShowcaseClient />
}
