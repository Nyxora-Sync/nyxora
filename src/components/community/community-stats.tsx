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
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch('/api/community/stats', { signal: controller.signal })
        if (!response.ok) throw new Error('Could not load community stats.')
        const payload = await response.json()
        setStats(payload.data as Stats)
        setStatus('ready')
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        // The landing page stays useful without stats; show dashes.
        setStatus('error')
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return (
    <div
      className="grid grid-cols-2 gap-6 sm:grid-cols-4"
      aria-busy={status === 'loading'}
      aria-live="polite"
    >
      {labels.map((entry) => (
        <div key={entry.key} className="text-center">
          {status === 'loading' ? (
            <div className="mx-auto h-9 w-16 animate-pulse rounded-md bg-muted" aria-hidden="true" />
          ) : (
            <p className="text-3xl font-bold tabular-nums">
              {stats ? stats[entry.key].toLocaleString() : '—'}
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">{entry.label}</p>
        </div>
      ))}
    </div>
  )
}
