'use client'

import dynamic from 'next/dynamic'

const ProfileClient = dynamic(
  () => import('@/components/community/profile-client').then((mod) => mod.ProfileClient),
  {
    loading: () => (
      <div className="space-y-8">
        <div className="h-40 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-violet-500/20 animate-pulse rounded-xl" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/30" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/30" />)}
        </div>
      </div>
    ),
    ssr: false,
  }
)

export function ProfileClientWrapper({ id }: { id: string }) {
  return <ProfileClient id={id} />
}
