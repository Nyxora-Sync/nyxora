'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Trophy, X } from 'lucide-react'
import { useProgress } from '@/hooks/use-progress'
import { useCommunityStats } from '@/hooks/use-community-stats'
import { badgeDefinitions, getEarnedBadges, type BadgeDefinition } from '@/lib/badges'
import {
  tierColors,
  tierIcons,
  tierLabels,
} from '@/lib/badge-meta'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TOAST_DURATION_MS = 3000
const STORAGE_PREFIX = 'nyxora-seen-badges'

interface SeenBadges {
  scope: string
  keys: Set<string>
}

export function BadgeEarnedToast() {
  const { state, isLoaded } = useProgress()
  const { data: session } = useSession()
  const { stats: community, isLoaded: communityLoaded } = useCommunityStats()
  const [queue, setQueue] = useState<BadgeDefinition[]>([])
  const seenRef = useRef<SeenBadges | null>(null)

  const scope = session?.user?.id ?? 'guest'
  const storageKey = `${STORAGE_PREFIX}:${scope}`

  const markNotified = useCallback(
    (keys: string[]) => {
      if (!session?.user?.id || keys.length === 0) return
      void fetch('/api/badges/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: Array.from(new Set(keys)) }),
      }).catch(() => {
        // A missed mark only means the toast may appear again on another device.
      })
    },
    [session?.user?.id]
  )

  // Cross-device unlocks: persisted badges with no notifiedAt are shown once,
  // then marked so a second browser does not repeat the celebration.
  useEffect(() => {
    if (!session?.user?.id) return

    let cancelled = false
    fetch('/api/badges/pending', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (cancelled) return
        const keys = (payload?.data?.keys ?? []) as string[]
        const badges = badgeDefinitions.filter((badge) => keys.includes(badge.key))
        if (badges.length === 0) return

        setQueue((existing) => {
          const queued = new Set(existing.map((badge) => badge.key))
          return [...existing, ...badges.filter((badge) => !queued.has(badge.key))]
        })
        markNotified(badges.map((badge) => badge.key))
      })
      .catch(() => {
        // Offline or signed out: the local toast path still works.
      })

    return () => {
      cancelled = true
    }
  }, [session?.user?.id, markNotified])

  useEffect(() => {
    if (!isLoaded || !communityLoaded) return

    const earned = getEarnedBadges({ state, ...community })
    const earnedKeys = new Set(earned.map((badge) => badge.key))

    let seen = seenRef.current
    if (!seen || seen.scope !== scope) {
      let raw: string | null = null
      try {
        raw = window.localStorage.getItem(storageKey)
      } catch {
        // Storage can be unavailable in privacy modes.
      }

      let keys: Set<string>
      if (raw === null) {
        // First visit with this scope: establish a silent baseline so existing
        // badges do not all pop up at once.
        keys = new Set(earnedKeys)
        try {
          window.localStorage.setItem(storageKey, JSON.stringify([...keys]))
        } catch {
          // Ignore storage failures.
        }
      } else {
        try {
          keys = new Set(JSON.parse(raw) as string[])
        } catch {
          keys = new Set(earnedKeys)
        }
      }

      seen = { scope, keys }
      seenRef.current = seen
      if (raw === null) return
    }

    const newBadges = earned.filter((badge) => !seen.keys.has(badge.key))
    let changed = false

    // A reset can remove badges; drop them so earning them again pops again.
    for (const key of Array.from(seen.keys)) {
      if (!earnedKeys.has(key)) {
        seen.keys.delete(key)
        changed = true
      }
    }

    if (newBadges.length > 0) {
      for (const badge of newBadges) seen.keys.add(badge.key)
      changed = true

      setQueue((existing) => {
        const queued = new Set(existing.map((badge) => badge.key))
        return [...existing, ...newBadges.filter((badge) => !queued.has(badge.key))]
      })
      markNotified(newBadges.map((badge) => badge.key))
    }

    if (changed) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...seen.keys]))
      } catch {
        // Ignore storage failures.
      }
    }
  }, [isLoaded, communityLoaded, state, community, scope, storageKey, markNotified])

  const current = queue[0]

  useEffect(() => {
    if (!current) return

    const timer = window.setTimeout(() => {
      setQueue((existing) => existing.slice(1))
    }, TOAST_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [current])

  if (!current) return null

  const [borderColor, bgColor, textColor] = tierColors[current.tier].split(' ')

  return (
    <div
      key={current.key}
      role="status"
      aria-live="polite"
      className="badge-toast-enter fixed bottom-4 right-4 z-[95] w-[calc(100vw-2rem)] max-w-sm"
    >
      <Card className={cn('relative overflow-hidden border-2 shadow-2xl', borderColor, bgColor)}>
        <CardContent className="flex items-start gap-3 p-4">
          <div className="text-3xl leading-none" aria-hidden="true">{current.icon}</div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              <Trophy className="h-3 w-3" aria-hidden="true" />
              Badge unlocked
            </p>
            <p className="mt-0.5 font-semibold leading-tight">{current.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{current.description}</p>
            <p className={cn('mt-1 text-[10px] font-medium', textColor)}>
              {tierIcons[current.tier]} {tierLabels[current.tier]}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setQueue((existing) => existing.slice(1))}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Dismiss badge notification"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </CardContent>
        <div className="badge-toast-progress absolute bottom-0 left-0 h-0.5 w-full bg-emerald-500" aria-hidden="true" />
      </Card>
    </div>
  )
}
