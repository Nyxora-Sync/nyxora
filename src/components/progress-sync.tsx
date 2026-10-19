'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import {
  loadProgressState,
  mergeProgressStates,
  saveProgressState,
  switchProgressScope,
  type ProgressState,
} from '@/lib/progress-state'

const SYNC_DEBOUNCE_MS = 1200

/**
 * Keeps localStorage and the signed-in user's database record in sync.
 *
 * - On sign-in: merges guest + account-local + server progress, saves the
 *   union locally, then pushes it to the server (which recomputes XP).
 * - While signed in: every progress change is debounced and pushed.
 * - Signed out: does nothing; progress stays local-only.
 */
export function ProgressSync() {
  const { data: session, status } = useSession()
  const userId = session?.user?.id ?? null
  const syncedFor = useRef<string | null>(null)
  const suppressBroadcast = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef<ProgressState | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!userId) {
      if (syncedFor.current !== null) {
        syncedFor.current = null
        switchProgressScope(null)
      }
      return
    }

    if (syncedFor.current === userId) return
    syncedFor.current = userId
    let cancelled = false

    const initialSync = async () => {
      try {
        const response = await fetch('/api/progress', { cache: 'no-store' })
        if (!response.ok || cancelled) return

        const remote = ((await response.json()) as { state: ProgressState }).state
        const accountLocal = loadProgressState(userId)
        const guest = loadProgressState(null)

        // Account-scoped edits win; guest progress only fills gaps.
        const merged = mergeProgressStates(mergeProgressStates(accountLocal, remote), guest)

        switchProgressScope(userId)
        suppressBroadcast.current = true
        saveProgressState(merged, userId)
        suppressBroadcast.current = false
        latest.current = merged

        const saved = await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: merged }),
        })
        if (!saved.ok || cancelled) return

        const serverState = ((await saved.json()) as { state: ProgressState }).state
        suppressBroadcast.current = true
        saveProgressState(serverState, userId)
        suppressBroadcast.current = false
        latest.current = serverState
      } catch {
        // Offline or transient failure: keep local state, retry on next change.
      }
    }

    void initialSync()

    const handleUpdate = (event: Event) => {
      if (suppressBroadcast.current) return
      latest.current = (event as CustomEvent<ProgressState>).detail

      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        const state = latest.current
        if (!state) return
        try {
          await fetch('/api/progress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state }),
          })
        } catch {
          // Network hiccup; the next change will retry.
        }
      }, SYNC_DEBOUNCE_MS)
    }

    window.addEventListener('progress-updated', handleUpdate)
    return () => {
      cancelled = true
      window.removeEventListener('progress-updated', handleUpdate)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [userId, status])

  return null
}
