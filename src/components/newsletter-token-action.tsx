'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, MailCheck, MailX, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Mode = 'confirm' | 'unsubscribe'

export function NewsletterTokenAction({ mode, token }: { mode: Mode; token: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleAction() {
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch(
        mode === 'confirm' ? '/api/newsletter/confirm' : '/api/newsletter/unsubscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }
      )
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(body?.error?.message ?? 'Something went wrong. Try again.')
      }
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="space-y-4" role="status">
        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
          <CheckCircle2
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium text-foreground">
              {mode === 'confirm' ? 'Subscription confirmed' : 'You have been unsubscribed'}
            </p>
            <p className="mt-1 text-muted-foreground">
              {mode === 'confirm'
                ? 'Future curriculum updates will land in your inbox. We only write when there is something worth reading.'
                : 'That address has been removed from the list. You will not receive any more newsletter emails.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={mode === 'confirm' ? '/learn' : '/'}>
              {mode === 'confirm' ? 'Start learning' : 'Back to Nyxora Sync'}
            </Link>
          </Button>
          {mode === 'unsubscribe' && (
            <Button variant="outline" asChild>
              <Link href="/newsletter">Manage newsletter</Link>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {status === 'error' && (
        <p
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </p>
      )}

      <Button
        onClick={handleAction}
        disabled={status === 'loading'}
        variant={mode === 'unsubscribe' ? 'destructive' : 'default'}
        className="gap-2"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : mode === 'confirm' ? (
          <MailCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <MailX className="h-4 w-4" aria-hidden="true" />
        )}
        {mode === 'confirm' ? 'Confirm my subscription' : 'Unsubscribe this address'}
      </Button>

      <p className="text-xs text-muted-foreground">
        {mode === 'confirm'
          ? 'The confirmation link expires 48 hours after it was sent.'
          : 'This removes the address immediately and cannot be undone. You can sign up again later.'}
      </p>
    </div>
  )
}
