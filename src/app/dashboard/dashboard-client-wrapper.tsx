'use client'

import dynamic from 'next/dynamic'

const DashboardClient = dynamic(
  () => import('@/components/dashboard-client').then((mod) => mod.DashboardClient),
  {
    loading: () => (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl border border-border/50 bg-muted/40" />
        ))}
      </div>
    ),
    ssr: false,
  }
)

export function DashboardClientWrapper() {
  return <DashboardClient />
}
