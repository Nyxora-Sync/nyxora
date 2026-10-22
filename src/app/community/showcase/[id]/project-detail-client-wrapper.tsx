'use client'

import dynamic from 'next/dynamic'

const ProjectDetailClient = dynamic(
  () => import('@/components/community/project-detail-client').then((mod) => mod.ProjectDetailClient),
  {
    loading: () => (
      <div className="space-y-8">
        <div className="h-40 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-violet-500/20 animate-pulse rounded-xl" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/30" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/30" />)}
        </div>
      </div>
    ),
    ssr: false,
  }
)

export function ProjectDetailClientWrapper({ id }: { id: string }) {
  return <ProjectDetailClient id={id} />
}
