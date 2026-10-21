'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  Inbox,
  Loader2,
  LogIn,
  Save,
  ShieldCheck,
  Trash2,
  Trophy,
  UserCog,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'
import { timeAgo } from '@/lib/time'

interface FollowRequest {
  id: string
  createdAt: string
  follower: {
    id: string
    name: string | null
    image: string | null
    bio: string | null
  }
}

interface NotificationItem {
  id: string
  type: string
  message: string | null
  href: string | null
  readAt: string | null
  createdAt: string
  actor: { id: string; name: string | null; image: string | null } | null
}

interface SettingsResponse {
  id: string
  isAdmin: boolean
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
  progress: {
    xp: number
    streakCurrent: number
    streakLongest: number
    lessonsCompleted: number
  }
  followers: number
  following: number
  viewCounts: {
    allTime: number
    month: number
    week: number
    day: number
  }
  followRequests: FollowRequest[]
  notifications: NotificationItem[]
}

const MAX_AVATAR_INPUT = 8 * 1024 * 1024

async function prepareAvatar(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file.')
  }
  if (file.size > MAX_AVATAR_INPUT) {
    throw new Error('Choose an image under 8 MB.')
  }
  if (typeof createImageBitmap !== 'function') return file

  try {
    const bitmap = await createImageBitmap(file)
    const maxEdge = 512
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.86)
    )
    return blob && blob.size > 0 ? blob : file
  } catch {
    // Older browsers or unusual formats can fall back to the original file.
    return file
  }
}

export function SettingsClient() {
  const { status, update: updateSession } = useSession()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [profile, setProfile] = useState<SettingsResponse | null>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [activeTab, setActiveTab] = useState('profile')
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

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [confirmRemoveAvatar, setConfirmRemoveAvatar] = useState(false)

  const [respondingId, setRespondingId] = useState<string | null>(null)
  const [requestMessage, setRequestMessage] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab')
    if (tab === 'profile' || tab === 'progress' || tab === 'privacy') {
      setActiveTab(tab)
    }
  }, [])

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
        const response = await fetch('/api/community/profile', {
          signal: controller.signal,
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error?.message ?? 'Could not load your settings.')
        }
        const data = payload.data as SettingsResponse
        setProfile(data)
        setNotifications(data.notifications ?? [])
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
        setLoadError(
          err instanceof Error ? err.message : 'Could not load your settings.'
        )
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

      setProfile((current) =>
        current
          ? {
              ...current,
              name: form.name.trim() || null,
              bio: form.bio.trim() || null,
              website: form.website.trim() || null,
              githubUrl: form.githubUrl.trim() || null,
              twitterUrl: form.twitterUrl.trim() || null,
              preferences: {
                ...current.preferences,
                showProgress: form.showProgress,
                emailUpdates: form.emailUpdates,
              },
            }
          : current
      )
      await updateSession().catch(() => {})
      setSaved(true)
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Could not save your profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || avatarUploading) return

    setAvatarUploading(true)
    setAvatarError(null)
    try {
      const image = await prepareAvatar(file)
      const body = new FormData()
      body.append('avatar', image, 'avatar.webp')

      const response = await fetch('/api/community/profile/avatar', {
        method: 'POST',
        body,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Could not upload that image.')
      }

      setProfile((current) =>
        current ? { ...current, image: payload.data.image } : current
      )
      await updateSession().catch(() => {})
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : 'Could not upload that image.'
      )
    } finally {
      setAvatarUploading(false)
    }
  }

  async function removeAvatar() {
    setAvatarUploading(true)
    setAvatarError(null)
    try {
      const response = await fetch('/api/community/profile/avatar', {
        method: 'DELETE',
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Could not remove your photo.')
      }

      setProfile((current) =>
        current ? { ...current, image: null } : current
      )
      setConfirmRemoveAvatar(false)
      await updateSession().catch(() => {})
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : 'Could not remove your photo.'
      )
    } finally {
      setAvatarUploading(false)
    }
  }

  async function respondToRequest(request: FollowRequest, action: 'accept' | 'reject') {
    if (respondingId) return
    setRespondingId(request.id)
    setRequestMessage(null)
    setRequestError(null)

    try {
      const response = await fetch(
        `/api/community/follow-requests/${request.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        }
      )
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(
          payload?.error?.message ?? 'Could not update that follow request.'
        )
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              followers:
                action === 'accept' ? current.followers + 1 : current.followers,
              followRequests: current.followRequests.filter(
                (item) => item.id !== request.id
              ),
            }
          : current
      )
      setRequestMessage(
        action === 'accept'
          ? 'Follow request accepted. They have been notified.'
          : 'Follow request declined. They have been notified.'
      )
    } catch (err) {
      setRequestError(
        err instanceof Error
          ? err.message
          : 'Could not update that follow request.'
      )
    } finally {
      setRespondingId(null)
    }
  }

  async function markNotificationRead(notification: NotificationItem) {
    if (notification.readAt) return
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, readAt: new Date().toISOString() }
          : item
      )
    )
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: notification.id }),
    }).catch(() => {})
  }

  async function markAllNotificationsRead() {
    if (markingAll) return
    setMarkingAll(true)
    try {
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      if (response.ok) {
        const now = new Date().toISOString()
        setNotifications((current) =>
          current.map((item) => ({ ...item, readAt: item.readAt ?? now }))
        )
      }
    } finally {
      setMarkingAll(false)
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div
        className="h-64 animate-pulse rounded-xl border border-border/50 bg-muted/40"
        aria-busy="true"
        aria-label="Loading settings"
      />
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
          <p className="mt-2 text-sm text-muted-foreground">
            {loadError ?? 'Could not load your profile.'}
          </p>
          <Button variant="outline" className="mt-5" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const displayName = profile.name?.trim() || 'Your profile'
  const initial = displayName.charAt(0).toUpperCase()
  const hasCustomAvatar = profile.image?.startsWith('/api/community/avatar/') ?? false
  const unreadNotifications = notifications.filter((item) => !item.readAt).length

  const visitorCards = [
    { label: 'All time', value: profile.viewCounts.allTime, icon: Eye },
    { label: 'This month', value: profile.viewCounts.month, icon: CalendarDays },
    { label: 'Last 7 days', value: profile.viewCounts.week, icon: Calendar },
    { label: 'Last 24 hours', value: profile.viewCounts.day, icon: Clock },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-3 sm:inline-grid sm:w-auto">
          <TabsTrigger type="button" value="profile">
            My Profile
          </TabsTrigger>
          <TabsTrigger type="button" value="progress">
            My Progress
          </TabsTrigger>
          <TabsTrigger type="button" value="privacy">
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>
                This appears next to your comments and projects. You can also{' '}
                <Link
                  href={`/community/people/${profile.id}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  view your public profile
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20 border border-border/60">
                  <AvatarImage src={profile.image ?? ''} alt="" />
                  <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      aria-label="Upload profile photo"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={avatarUploading}
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      {avatarUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Camera className="h-4 w-4" aria-hidden="true" />
                      )}
                      {avatarUploading ? 'Uploading...' : 'Change photo'}
                    </Button>
                    {hasCustomAvatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground"
                        disabled={avatarUploading}
                        onClick={() => setConfirmRemoveAvatar(true)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP, or GIF. Resized to 512px and stored with your account.
                  </p>
                  {avatarError && (
                    <p className="text-xs text-destructive" role="alert">
                      {avatarError}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

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
                  <p className="text-xs text-muted-foreground">
                    From your sign-in provider. Never shown publicly.
                  </p>
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
                <p className="text-xs text-muted-foreground">
                  {form.bio.length} / 600 characters
                </p>
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    Profile visitors
                  </CardTitle>
                  <CardDescription>
                    Unique people who opened your public profile. You are not counted.
                  </CardDescription>
                </div>
                <Button asChild type="button" variant="ghost" size="sm">
                  <Link href={`/community/people/${profile.id}`}>View profile</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {visitorCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl border border-border/50 bg-muted/20 p-4"
                  >
                    <card.icon className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <p className="mt-2 text-2xl font-bold tabular-nums">
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span>
                  <strong className="text-foreground">{profile.followers}</strong> followers
                </span>
                <span>
                  <strong className="text-foreground">{profile.following}</strong> following
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                Follow requests
                {profile.followRequests.length > 0 && (
                  <Badge variant="secondary">{profile.followRequests.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Accept a request to let someone follow you. They will be notified either way.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {requestMessage && (
                <p className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400" role="status">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {requestMessage}
                </p>
              )}
              {requestError && (
                <p className="text-sm text-destructive" role="alert">
                  {requestError}
                </p>
              )}
              {profile.followRequests.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                  No pending follow requests right now.
                </p>
              ) : (
                profile.followRequests.map((request) => {
                  const name = request.follower.name?.trim() || 'A learner'
                  return (
                    <div
                      key={request.id}
                      className="flex flex-col gap-3 rounded-xl border border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.follower.image ?? ''} alt="" />
                          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Link
                            href={`/community/people/${request.follower.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            Requested {timeAgo(request.createdAt)}
                          </p>
                          {request.follower.bio && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {request.follower.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1.5"
                          disabled={respondingId !== null}
                          onClick={() => respondToRequest(request, 'accept')}
                        >
                          {respondingId === request.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          disabled={respondingId !== null}
                          onClick={() => respondToRequest(request, 'reject')}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    Recent notifications
                    {unreadNotifications > 0 && (
                      <Badge variant="secondary">{unreadNotifications} new</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Follow request responses and other account activity.
                  </CardDescription>
                </div>
                {unreadNotifications > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={markingAll}
                    onClick={markAllNotificationsRead}
                  >
                    {markingAll && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    )}
                    Mark all read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                  No notifications yet. Follow requests and their responses will appear here.
                </p>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const href =
                      notification.href ??
                      (notification.actor
                        ? `/community/people/${notification.actor.id}`
                        : '/settings?tab=profile')
                    return (
                      <Link
                        key={notification.id}
                        href={href}
                        onClick={() => markNotificationRead(notification)}
                        className={`flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent ${
                          notification.readAt ? '' : 'bg-emerald-500/5'
                        }`}
                      >
                        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                          {notification.type === 'follow_request' ? (
                            <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm leading-snug">
                            {notification.message ?? 'You have a new notification.'}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {timeAgo(notification.createdAt)}
                          </span>
                        </span>
                        {!notification.readAt && (
                          <span
                            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                            aria-label="Unread"
                          />
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Progress</CardTitle>
              <CardDescription>
                Your saved learning stats across every device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    icon: Zap,
                    label: 'XP earned',
                    value: profile.progress.xp.toLocaleString(),
                    color: 'text-amber-500',
                  },
                  {
                    icon: BookOpen,
                    label: 'Lessons completed',
                    value: profile.progress.lessonsCompleted.toLocaleString(),
                    color: 'text-emerald-500',
                  },
                  {
                    icon: Flame,
                    label: 'Current streak',
                    value: `${profile.progress.streakCurrent}d`,
                    color: 'text-orange-500',
                  },
                  {
                    icon: Award,
                    label: 'Longest streak',
                    value: `${profile.progress.streakLongest}d`,
                    color: 'text-violet-500',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/50 bg-muted/20 p-4"
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                    <p className="mt-2 text-2xl font-bold tabular-nums">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild type="button" className="gap-2">
                  <Link href="/dashboard">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                    Open progress dashboard
                  </Link>
                </Button>
                <Button asChild type="button" variant="outline" className="gap-2">
                  <Link href="/learn">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Continue learning
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-0 space-y-6">
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

          {profile.isAdmin && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  Maintainer tools
                </CardTitle>
                <CardDescription>
                  Read and manage private messages sent through the contact form.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/admin/messages">
                    <Inbox className="h-4 w-4" aria-hidden="true" />
                    Open contact inbox
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {activeTab !== 'progress' && (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
          {saved && (
            <span
              className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400"
              role="status"
            >
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
      )}

      <ConfirmDialog
        open={confirmRemoveAvatar}
        onOpenChange={setConfirmRemoveAvatar}
        title="Remove profile photo?"
        description="Your initials will be shown instead. You can upload a new photo at any time."
        confirmLabel="Remove photo"
        destructive
        pending={avatarUploading}
        onConfirm={removeAvatar}
      />
    </form>
  )
}
