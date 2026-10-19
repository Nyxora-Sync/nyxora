'use client'


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CornerDownRight, Loader2, MessageSquare, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { UserChip } from '@/components/community/user-chip'
import type { CommentItem } from '@/lib/community-types'
import { timeAgo } from '@/lib/time'

interface CommentThreadProps {
  targetType: 'lesson' | 'project'
  targetId: string
  title?: string
  description?: string
}

export function CommentThread({
  targetType,
  targetId,
  title = 'Discussion',
  description = 'Questions, corrections, and things that clicked — this is where the lesson keeps going.',
}: CommentThreadProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)

  const total = comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const params = new URLSearchParams({ targetType, targetId })
        const response = await fetch(`/api/community/comments?${params.toString()}`, {
          signal: controller.signal,
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error?.message ?? 'Could not load the discussion.')
        }
        setComments(payload.data as CommentItem[])
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setLoadError(err instanceof Error ? err.message : 'Could not load the discussion.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [targetType, targetId, reloadKey])

  async function submitComment(text: string, parentId?: string) {
    const response = await fetch('/api/community/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType, targetId, body: text, parentId }),
    })
    const payload = await response.json().catch(() => null)

    if (response.status === 401) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      throw new Error('Please sign in again.')
    }
    if (!response.ok) {
      throw new Error(payload?.error?.message ?? 'Could not post your comment.')
    }
    return payload.data as CommentItem
  }

  async function handlePost(event: React.FormEvent) {
    event.preventDefault()
    if (!body.trim() || submitting) return
    setSubmitting(true)
    setFormError(null)
    try {
      const comment = await submitComment(body.trim())
      setComments((current) => [...current, comment])
      setBody('')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not post your comment.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReply(event: React.FormEvent, parentId: string) {
    event.preventDefault()
    if (!replyBody.trim() || replySubmitting) return
    setReplySubmitting(true)
    setFormError(null)
    try {
      const reply = await submitComment(replyBody.trim(), parentId)
      setComments((current) =>
        current.map((comment) =>
          comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment
        )
      )
      setReplyBody('')
      setReplyTo(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not post your reply.')
    } finally {
      setReplySubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this comment? Replies will be removed too.')) return
    const response = await fetch(`/api/community/comments/${id}`, { method: 'DELETE' })
    if (response.ok) {
      setComments((current) =>
        current
          .filter((comment) => comment.id !== id)
          .map((comment) => ({
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== id),
          }))
      )
    } else {
      const payload = await response.json().catch(() => null)
      setFormError(payload?.error?.message ?? 'Could not delete the comment.')
    }
  }

  return (
    <section aria-labelledby="discussion-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="discussion-heading" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <MessageSquare className="h-5 w-5 text-blue-500" aria-hidden="true" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {!loading && total > 0 && (
          <Badge variant="secondary" className="text-xs">
            {total} {total === 1 ? 'comment' : 'comments'}
          </Badge>
        )}
      </div>

      {status === 'authenticated' ? (
        <form onSubmit={handlePost} className="rounded-xl border border-border/50 bg-card p-4">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Ask a question or share what helped..."
            rows={3}
            maxLength={2000}
            aria-label="Write a comment"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{body.length} / 2000</span>
            <Button type="submit" size="sm" disabled={submitting || !body.trim()} className="gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              Post comment
            </Button>
          </div>
          {formError && <p className="mt-2 text-sm text-destructive" role="alert">{formError}</p>}
        </form>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-5 text-sm">
          <p className="text-muted-foreground">
            Sign in to join the discussion — ask questions, post corrections, or help the next learner.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() =>
              router.push(
                `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`
              )
            }
          >
            Sign in to comment
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading comments">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl border border-border/50 bg-muted/30" />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm">
          <p className="text-muted-foreground">{loadError}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </Button>
        </div>
      ) : comments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
          No comments yet. Be the first to ask or share something useful.
        </p>
      ) : (
        <ul className="space-y-4" role="list">
          {comments.map((comment) => {
            const own = session?.user?.id === comment.author.id
            return (
              <li key={comment.id} className="rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <UserChip user={comment.author} meta={timeAgo(comment.createdAt)} />
                  {own && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete your comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{comment.body}</p>

                <div className="mt-2 flex items-center gap-3">
                  {status === 'authenticated' && (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(replyTo === comment.id ? null : comment.id)
                        setReplyBody('')
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <CornerDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                      Reply
                    </button>
                  )}
                </div>

                {replyTo === comment.id && (
                  <form onSubmit={(event) => handleReply(event, comment.id)} className="mt-3 space-y-2">
                    <Textarea
                      value={replyBody}
                      onChange={(event) => setReplyBody(event.target.value)}
                      placeholder={`Reply to ${comment.author.name ?? 'this learner'}...`}
                      rows={2}
                      maxLength={2000}
                      aria-label="Write a reply"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button type="submit" size="sm" disabled={replySubmitting || !replyBody.trim()} className="gap-2">
                        {replySubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                        Reply
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {comment.replies.length > 0 && (
                  <ul className="mt-4 space-y-3 border-l-2 border-border/60 pl-4" role="list">
                    {comment.replies.map((reply) => {
                      const replyOwn = session?.user?.id === reply.author.id
                      return (
                        <li key={reply.id}>
                          <div className="flex items-start justify-between gap-3">
                            <UserChip user={reply.author} meta={timeAgo(reply.createdAt)} />
                            {replyOwn && (
                              <button
                                type="button"
                                onClick={() => handleDelete(reply.id)}
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Delete your reply"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{reply.body}</p>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
