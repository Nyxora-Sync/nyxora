'use client'


import { useEffect, useState } from 'react'
import type { CommunityStats as Stats } from '@/lib/community-types'

const labels: { key: keyof Stats; label: string }[] = [
  { key: 'members', label: 'Members' },
  { key: 'projects', label: 'Projects shared' },
  { key: 'comments', label: 'Comments posted' },
  { key: 'lessonsCompleted', label: 'Lessons completed' },
]

export function CommunityStats() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch('/api/community/stats', { signal: controller.signal })
        if (!response.ok) return
        const payload = await response.json()
        setStats(payload.data as Stats)
      } catch {
        // The landing page stays useful without stats; show dashes.
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {labels.map((entry) => (
        <div key={entry.key} className="text-center">
          <p className="text-3xl font-bold tabular-nums">
            {stats ? stats[entry.key].toLocaleString() : '—'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{entry.label}</p>
        </div>
      ))}
    </div>
  )
}
