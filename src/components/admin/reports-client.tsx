'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ExternalLink,
  Flag,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { timeAgo } from '@/lib/time'

type ReportStatus = 'open' | 'resolved' | 'dismissed' | 'all'
type ReportAction = 'resolve' | 'dismiss' | 'delete'

interface ReportItem {
  id: string
  targetType: 'project' | 'comment' | 'profile'
  targetId: string
  reason: string
  details: string | null
  status: string
  resolutionNote: string | null
  createdAt: string
  reviewedAt: string | null
  reviewedBy: { id: string; name: string | null } | null
  reporter: { id: string; name: string | null; image: string | null }
  target: {
    title: string
    preview: string
    href: string | null
    authorName: string | null
    available: boolean
  }
}

const reasonLabels: Record<string, string> = {
  spam: 'Spam or advertising',
  harassment: 'Harassment or hate',
  inappropriate: 'Inappropriate content',
  copyright: 'Copyright violation',
  other: 'Something else',
}

const filters: { value: ReportStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
  { value: 'all', label: 'All' },
]

export function AdminReportsClient() {
  const [status, setStatus] = useState<ReportStatus>('open')
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReportItem | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/reports?status=${status}`, {
        cache: 'no-store',
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Could not load reports.')
      }
      setReports(payload.data as ReportItem[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load reports.')
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function act(report: ReportItem, action: ReportAction) {
    if (busyId) return
    setBusyId(report.id)
    setError(null)

    try {
      const response = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          note:
            action === 'delete'
              ? `Removed by moderator (reported as ${reasonLabels[report.reason] ?? report.reason}).`
              : undefined,
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Could not update this report.')
      }

      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this report.')
    } finally {
      setBusyId(null)
    }
  }

  const openCount = reports.filter((report) => report.status === 'open').length

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="outline" className="gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Maintainer only
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Moderation queue</h1>
        <p className="max-w-2xl text-muted-foreground">
          Review reports on projects, comments, and profiles. Deleting content also closes
          every open report attached to it and writes an audit-log entry.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={status === filter.value ? 'default' : 'outline'}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
              {filter.value === 'open' && openCount > 0 ? ` (${openCount})` : ''}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => void load()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading && reports.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading reports...
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Flag className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
            <div>
              <p className="font-medium">Nothing in this queue</p>
              <p className="mt-1 text-sm text-muted-foreground">
                New reports will appear here automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="space-y-4 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {report.targetType}
                      </Badge>
                      <Badge
                        variant={report.status === 'open' ? 'destructive' : 'outline'}
                        className="capitalize"
                      >
                        {report.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(report.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {reasonLabels[report.reason] ?? report.reason}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Reported by {report.reporter.name?.trim() || 'a learner'}
                      {report.target.authorName
                        ? ` · Content by ${report.target.authorName}`
                        : ''}
                    </p>
                  </div>
                  {report.target.href && report.target.available && (
                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                      <Link href={report.target.href} target="_blank" rel="noreferrer">
                        Open content
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <p className="text-sm font-medium">
                    {report.target.available ? report.target.title : 'Deleted content'}
                  </p>
                  {report.target.preview && (
                    <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                      {report.target.preview}
                    </p>
                  )}
                </div>

                {report.details && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Reporter details
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{report.details}</p>
                  </div>
                )}

                {report.resolutionNote && (
                  <p className="text-xs text-muted-foreground">
                    Resolution: {report.resolutionNote}
                  </p>
                )}

                {report.status === 'open' && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1.5"
                      disabled={busyId === report.id}
                      onClick={() => void act(report, 'resolve')}
                    >
                      {busyId === report.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      Resolve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled={busyId === report.id}
                      onClick={() => void act(report, 'dismiss')}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                      Dismiss
                    </Button>
                    {report.targetType !== 'profile' && report.target.available && (
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="gap-1.5"
                        disabled={busyId === report.id}
                        onClick={() => setDeleteTarget(report)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete content
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Delete reported content?"
        description={
          deleteTarget
            ? `This permanently deletes the ${deleteTarget.targetType} and closes all open reports for it. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete permanently"
        destructive
        pending={busyId !== null}
        onConfirm={() => {
          if (deleteTarget) return act(deleteTarget, 'delete')
        }}
      />
    </div>
  )
}
