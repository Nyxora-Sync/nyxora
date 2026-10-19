'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UpvoteButtonProps {
  projectId: string
  initialUpvotes: number
  initialUpvoted: boolean
  size?: 'sm' | 'lg'
  className?: string
}

export function UpvoteButton({
  projectId,
  initialUpvotes,
  initialUpvoted,
  size = 'sm',
  className,
}: UpvoteButtonProps) {
  const { status } = useSession()
  const router = useRouter()
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (status !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    if (pending) return

    const previous = { upvoted, upvotes }
    setUpvoted(!upvoted)
    setUpvotes(upvotes + (upvoted ? -1 : 1))
    setPending(true)
    setError(null)

    try {
      const response = await fetch(`/api/community/projects/${projectId}/upvote`, {
        method: 'POST',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message ?? 'Could not save your upvote.')
      }
      const body = await response.json()
      setUpvoted(body.data.upvoted)
      setUpvotes(body.data.upvotes)
    } catch (err) {
      setUpvoted(previous.upvoted)
      setUpvotes(previous.upvotes)
      setError(err instanceof Error ? err.message : 'Could not save your upvote.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn('flex flex-col items-start', className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={upvoted}
        aria-label={upvoted ? 'Remove upvote' : 'Upvote this project'}
        title={error ?? undefined}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border font-semibold transition-colors',
          size === 'lg' ? 'px-3 py-2 text-sm' : 'px-2.5 py-1.5 text-xs',
          upvoted
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'border-border/60 bg-background text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-600',
          pending && 'opacity-70'
        )}
      >
        <ArrowUp className={cn(size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5', pending && 'animate-pulse')} aria-hidden="true" />
        {upvotes}
      </button>
      {error && <span className="mt-1 text-[11px] text-destructive">{error}</span>}
    </div>
  )
}
