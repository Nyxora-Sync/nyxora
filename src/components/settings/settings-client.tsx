'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CheckCircle2, Loader2, LogIn, Save, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'

interface SettingsResponse {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  website: string | null
  githubUrl: string | null
  twitterUrl: string | null
  preferences: {
    showProgress: boolean
    emailUpdates: boolean
  }
}

export function SettingsClient() {
  const { status } = useSession()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [profile, setProfile] = useState<SettingsResponse | null>(null)
  const [form, setForm] = useState({
    name: '',
    bio: '',
    website: '',
    githubUrl: '',
    twitterUrl: '',
    showProgress: true,
    emailUpdates: false,
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const response = await fetch('/api/community/profile', { signal: controller.signal })
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error?.message ?? 'Could not load your settings.')
        }
        const data = payload.data as SettingsResponse
        setProfile(data)
        setForm({
          name: data.name ?? '',
          bio: data.bio ?? '',
          website: data.website ?? '',
          githubUrl: data.githubUrl ?? '',
          twitterUrl: data.twitterUrl ?? '',
          showProgress: data.preferences.showProgress,
          emailUpdates: data.preferences.emailUpdates,
        })
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setLoadError(err instanceof Error ? err.message : 'Could not load your settings.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [status])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setSaveError(null)
    setSaved(false)

    try {
      const response = await fetch('/api/community/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Could not save your profile.')
      }
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="h-64 animate-pulse rounded-xl border border-border/50 bg-muted/40" aria-busy="true" aria-label="Loading settings" />
    )
  }

  if (status !== 'authenticated') {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="pt-8">
          <LogIn className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold">Sign in to manage your profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An account lets you comment on lessons, share projects, and keep your progress in sync
            across devices.
          </p>
          <Button asChild className="mt-5">
            <Link href="/auth/signin?callbackUrl=/settings">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loadError || !profile) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="pt-8">
          <UserCog className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold">Settings unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{loadError ?? 'Could not load your profile.'}</p>
          <Button variant="outline" className="mt-5" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Public profile</CardTitle>
          <CardDescription>
            This appears next to your comments and projects. You can also{' '}
            <Link href={`/community/people/${profile.id}`} className="text-primary underline-offset-4 hover:underline">
              view your public profile
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="settings-name">Display name</Label>
              <Input
                id="settings-name"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="Ada Lovelace"
                maxLength={80}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" value={profile.email} readOnly disabled />
              <p className="text-xs text-muted-foreground">From your sign-in provider. Never shown publicly.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="settings-bio">Bio</Label>
            <Textarea
              id="settings-bio"
              value={form.bio}
              onChange={(event) => update('bio', event.target.value)}
              placeholder="What are you learning, building, or looking for?"
              rows={4}
              maxLength={600}
            />
            <p className="text-xs text-muted-foreground">{form.bio.length} / 600 characters</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="settings-website">Website</Label>
              <Input
                id="settings-website"
                type="url"
                value={form.website}
                onChange={(event) => update('website', event.target.value)}
                placeholder="https://you.dev"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-github">GitHub</Label>
              <Input
                id="settings-github"
                type="url"
                value={form.githubUrl}
                onChange={(event) => update('githubUrl', event.target.value)}
                placeholder="https://github.com/you"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-twitter">Twitter / X</Label>
              <Input
                id="settings-twitter"
                type="url"
                value={form.twitterUrl}
                onChange={(event) => update('twitterUrl', event.target.value)}
                placeholder="https://x.com/you"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{NEWSLETTER_ENABLED ? 'Privacy & updates' : 'Privacy'}</CardTitle>
          <CardDescription>Control what other learners can see.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.showProgress}
              onChange={(event) => update('showProgress', event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input accent-emerald-500"
            />
            <span>
              <span className="block text-sm font-medium">Show my learning progress</span>
              <span className="block text-xs text-muted-foreground">
                XP, completed lessons, streaks, and badges on your public profile.
              </span>
            </span>
          </label>

          {NEWSLETTER_ENABLED && (
            <>
              <Separator />

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.emailUpdates}
                  onChange={(event) => update('emailUpdates', event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input accent-emerald-500"
                />
                <span>
                  <span className="block text-sm font-medium">Email me about new lessons</span>
                  <span className="block text-xs text-muted-foreground">
                    Occasional updates when a new module or major resource lands. No spam.
                  </span>
                </span>
              </label>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400" role="status">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Saved
          </span>
        )}
        {saveError && (
          <span className="text-sm text-destructive" role="alert">
            {saveError}
          </span>
        )}
      </div>
    </form>
  )
}
