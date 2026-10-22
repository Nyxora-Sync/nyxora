'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  EMPTY_COMMUNITY_STATS,
  type CommunityStats,
} from '@/lib/badge-meta'

interface CommunityProfilePayload {
  data?: {
    followers?: number
    createdAt?: string
    contributions?: {
      projects?: number
      comments?: number
      upvotes?: number
    }
  }
}

interface StoredCommunityStats {
  userId: string
  stats: CommunityStats
}

export interface CommunityStatsResult {
  stats: CommunityStats
  isLoaded: boolean
}

/**
 * Loads the signed-in learner's community counters so badge checks can use
 * projects, comments, upvotes, followers, and join date. Falls back to zeros
 * when signed out, loading, offline, or when community features are disabled.
 */
export function useCommunityStats(): CommunityStatsResult {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [stored, setStored] = useState<StoredCommunityStats | null>(null)

  useEffect(() => {
    if (!userId) return

    const controller = new AbortController()

    fetch(`/api/community/people/${encodeURIComponent(userId)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: CommunityProfilePayload | null) => {
        if (controller.signal.aborted) return
        const data = payload?.data

        setStored({
          userId,
          stats: data
            ? {
                followers: data.followers ?? 0,
                joinedAt: data.createdAt ?? null,
                contributions: {
                  projects: data.contributions?.projects ?? 0,
                  comments: data.contributions?.comments ?? 0,
                  upvotes: data.contributions?.upvotes ?? 0,
                },
              }
            : EMPTY_COMMUNITY_STATS,
        })
      })
      .catch(() => {
        if (controller.signal.aborted) return
        // Community features may be disabled; badges relying on them stay locked.
        setStored({ userId, stats: EMPTY_COMMUNITY_STATS })
      })

    return () => controller.abort()
  }, [userId])

  if (!userId) return { stats: EMPTY_COMMUNITY_STATS, isLoaded: true }
  if (stored?.userId !== userId) return { stats: EMPTY_COMMUNITY_STATS, isLoaded: false }
  return { stats: stored.stats, isLoaded: true }
}
