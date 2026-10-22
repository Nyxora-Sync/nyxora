'use client'

import { useState } from 'react'
import { Flag, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type ReportTarget = 'project' | 'comment' | 'profile'

const REASONS = [
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'harassment', label: 'Harassment or hate' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'copyright', label: 'Copyright violation' },
  { value: 'other', label: 'Something else' },
] as const

export function ReportButton({
  targetType,
  targetId,
  className,
}: {
  targetType: ReportTarget
  targetId: string
  className?: string
}) {
  const { status } = useSession()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<string>('spam')
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (status !== 'authenticated') return null

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    try {
      const response = await fetch('/api/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          details: details.trim() || undefined,
        }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          payload?.error?.message ?? 'Could not submit this report right now.'
        )
      }

      setSubmitted(true)
      setDetails('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit this report.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setError(null)
          setSubmitted(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`gap-1.5 text-muted-foreground ${className ?? ''}`}
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Report submitted</DialogTitle>
              <DialogDescription>
                Thanks. A maintainer will review it. We do not share reporter identities
                with the person you reported.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Report this {targetType}</DialogTitle>
              <DialogDescription>
                Tell us what is wrong. Reports are private and reviewed by a maintainer.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason</Label>
              <select
                id="report-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {REASONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-details">Details (optional)</Label>
              <Textarea
                id="report-details"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="Add context that helps us review this quickly."
                maxLength={1000}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">{details.length} / 1000</p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Submit report
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
