'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const topics = [
  { value: 'general', label: 'General question' },
  { value: 'bug', label: 'Bug or broken page' },
  { value: 'content', label: 'Lesson correction' },
  { value: 'conduct', label: 'Code of conduct report' },
  { value: 'privacy', label: 'Privacy or account request' },
  { value: 'security', label: 'Security concern' },
]

export function ContactForm() {
  const formId = useId()
  const emailId = `${formId}-email`
  const nameId = `${formId}-name`
  const topicId = `${formId}-topic`
  const messageId = `${formId}-message`
  const websiteId = `${formId}-website`

  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: '',
    website: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    if (status === 'error') setStatus('idle')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Could not send your message. Try again.')
      }
      setStatus('success')
      window.scrollTo({ top: 0 })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not send your message. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6" role="status">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-semibold">Message received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for taking the time. Messages are read by the maintainers, best effort within a
          week. If you reported a security issue, please also use GitHub&apos;s private reporting
          so it does not sit in an inbox.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">Back to the lessons</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={nameId}>Name (optional)</Label>
          <Input
            id={nameId}
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            autoComplete="name"
            maxLength={80}
            placeholder="Ada Lovelace"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            id={emailId}
            type="email"
            required
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={topicId}>Topic</Label>
        <select
          id={topicId}
          value={form.topic}
          onChange={(event) => update('topic', event.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          {topics.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={messageId}>Message</Label>
        <Textarea
          id={messageId}
          required
          minLength={20}
          maxLength={4000}
          rows={7}
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          placeholder="Include the page, what you expected, and what happened. Do not paste passwords or API keys."
        />
        <p className="text-xs text-muted-foreground">
          {form.message.trim().length} / 4000 characters (minimum 20)
        </p>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor={websiteId}>Website</label>
        <input
          id={websiteId}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update('website', event.target.value)}
        />
      </div>

      {status === 'error' && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <Button type="submit" disabled={status === 'loading'} className="gap-2">
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </Button>
        <p className="text-xs text-muted-foreground">
          Your message is stored privately so the maintainers can reply. See the{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
