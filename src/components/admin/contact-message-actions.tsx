'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactMessageActions({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function toggleHandled() {
    if (busy) return

    setBusy(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handled: !handled }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Could not update this message.')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this message.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        variant={handled ? 'outline' : 'default'}
        disabled={busy}
        onClick={toggleHandled}
        className="gap-2"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : handled ? (
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {handled ? 'Mark unhandled' : 'Mark handled'}
      </Button>
      {error && (
        <span className="max-w-48 text-right text-xs text-destructive" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
