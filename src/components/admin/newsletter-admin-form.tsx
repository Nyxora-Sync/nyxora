'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Mail, Send, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function NewsletterAdminForm({
  adminEmail,
  confirmedCount,
}: {
  adminEmail: string
  confirmedCount: number
}) {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [sending, setSending] = useState<'test' | 'broadcast' | null>(null)
  const [result, setResult] = useState<{
    tone: 'success' | 'warning' | 'error'
    message: string
  } | null>(null)

  async function submit(test: boolean) {
    if (sending) return
    setResult(null)

    if (!test && confirmText !== 'SEND') {
      setResult({ tone: 'error', message: 'Type SEND in the confirmation box first.' })
      return
    }

    setSending(test ? 'test' : 'broadcast')
    try {
      const response = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          test,
          ...(test ? {} : { confirm: confirmText }),
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'The send failed. Check the server logs.')
      }

      const data = payload?.data
      if (test) {
        setResult({ tone: 'success', message: `Test email sent to ${adminEmail}.` })
        router.refresh()
      } else {
        const sent = data?.sent ?? 0
        const failed = data?.failed ?? 0
        setResult({
          tone: failed > 0 ? 'warning' : 'success',
          message:
            failed > 0
              ? `Sent to ${sent} subscribers; ${failed} failed. Check the email server logs before retrying.`
              : `Sent to ${sent} confirmed subscribers.`,
        })
        setConfirmText('')
        router.refresh()
      }
    } catch (error) {
      setResult({
        tone: 'error',
        message: error instanceof Error ? error.message : 'The send failed. Try again.',
      })
    } finally {
      setSending(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="newsletter-subject">Subject</Label>
          <Input
            id="newsletter-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="New module: authentication from scratch"
            maxLength={140}
          />
          <p className="text-xs text-muted-foreground">{subject.length} / 140</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          {confirmedCount} confirmed{' '}
          {confirmedCount === 1 ? 'subscriber' : 'subscribers'}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newsletter-body">Message</Label>
        <Textarea
          id="newsletter-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={'A short note about what changed and why it matters.\n\nPlain text only. Line breaks are preserved.'}
          rows={12}
          maxLength={20_000}
        />
        <p className="text-xs text-muted-foreground">{body.length} / 20,000 characters</p>
      </div>

      {(subject.trim() || body.trim()) && (
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview
          </p>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="font-semibold">{subject.trim() || 'Your subject'}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {body.trim() || 'Your message'}
            </p>
            <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              Every email includes an unsubscribe link. Unsubscribing deletes the address.
            </p>
          </div>
        </div>
      )}

      {result && (
        <p
          className={
            result.tone === 'success'
              ? 'flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300'
              : result.tone === 'warning'
                ? 'flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300'
                : 'flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive'
          }
          role={result.tone === 'error' ? 'alert' : 'status'}
        >
          {result.tone === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          )}
          <span>{result.message}</span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => submit(true)}
          disabled={Boolean(sending) || !subject.trim() || !body.trim()}
          className="gap-2"
        >
          {sending === 'test' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Mail className="h-4 w-4" aria-hidden="true" />
          )}
          Send test to me
        </Button>
        <p className="text-xs text-muted-foreground">
          Test sends are prefixed with [TEST] and use a placeholder unsubscribe link.
        </p>
      </div>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <h2 className="text-sm font-semibold">Send to the real list</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          This sends immediately to {confirmedCount} confirmed{' '}
          {confirmedCount === 1 ? 'address' : 'addresses'}. There is no undo and no scheduling.
          Type <strong className="text-foreground">SEND</strong> to unlock the button.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            aria-label="Type SEND to confirm"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder="Type SEND"
            className="sm:max-w-44"
            autoComplete="off"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => submit(false)}
            disabled={
              Boolean(sending) ||
              confirmText !== 'SEND' ||
              confirmedCount === 0 ||
              !subject.trim() ||
              !body.trim()
            }
            className="gap-2"
          >
            {sending === 'broadcast' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            Send to {confirmedCount} confirmed
          </Button>
        </div>
      </div>
    </div>
  )
}
