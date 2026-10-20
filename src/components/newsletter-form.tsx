'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Mode = 'subscribe' | 'unsubscribe'

export function NewsletterForm({
  compact = false,
  mode = 'subscribe',
}: {
  compact?: boolean
  mode?: Mode
}) {
  const formId = useId()
  const emailId = `${formId}-email`
  const websiteId = `${formId}-website`

  const isSubscribe = mode === 'subscribe'
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: isSubscribe ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isSubscribe
            ? { email, website, source: compact ? 'footer' : 'newsletter' }
            : { email }
        ),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(body?.error?.message ?? 'Something went wrong. Try again.')
      }

      if (isSubscribe) {
        if (body?.data?.alreadyConfirmed) {
          setSuccessMessage("That address is already confirmed. You're on the list.")
        } else if (body?.data?.alreadySent) {
          setSuccessMessage('We already sent a confirmation email recently. Check your inbox.')
        } else {
          setSuccessMessage(
            compact
              ? 'Check your inbox and open the confirmation link to finish signing up.'
              : "Check your inbox and click the confirmation link. You're not on the list until you confirm."
          )
        }
      } else {
        setSuccessMessage('That address has been removed from the list.')
      }

      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <p
        className={cn(
          'flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm',
          compact && 'mt-4'
        )}
        role="status"
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" />
        <span>{successMessage}</span>
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn(compact ? 'mt-4 space-y-2' : 'space-y-3')}>
      <div className="space-y-1.5">
        <Label htmlFor={emailId} className={compact ? 'sr-only' : undefined}>
          Email address
        </Label>
        <div className={cn(compact ? 'space-y-2' : 'flex gap-2')}>
          <Input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (status === 'error') setStatus('idle')
            }}
            placeholder="you@example.com"
            maxLength={254}
            className={compact ? 'w-full' : 'h-9 flex-1'}
          />
          <Button
            type="submit"
            size={compact ? 'sm' : 'default'}
            disabled={status === 'loading'}
            className={compact ? 'w-full' : undefined}
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {isSubscribe ? 'Subscribe' : 'Unsubscribe'}
          </Button>
        </div>
      </div>

      {isSubscribe && (
        <div className="hidden" aria-hidden="true">
          <label htmlFor={websiteId}>Website</label>
          <input
            id={websiteId}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
      )}

      {status === 'error' && (
        <p className="text-xs text-destructive" role="alert">
          {message}
        </p>
      )}

      {!compact && isSubscribe && (
        <p className="text-xs text-muted-foreground">
          Double opt-in: we send one confirmation email, and only confirmed addresses receive
          updates. By subscribing you agree to the{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            privacy policy
          </Link>
          . No spam, and you can unsubscribe at any time.
        </p>
      )}
    </form>
  )
}
