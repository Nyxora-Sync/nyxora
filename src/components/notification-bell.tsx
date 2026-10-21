'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Bell, CheckCheck, Loader2, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { timeAgo } from '@/lib/time'

interface NotificationItem {
  id: string
  type: string
  message: string | null
  href: string | null
  readAt: string | null
  createdAt: string
  actor: { id: string; name: string | null; image: string | null } | null
}

export function NotificationBell() {
  const { status } = useSession()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const [marking, setMarking] = useState(false)

  const load = useCallback(async () => {
    if (status !== 'authenticated') return
    setLoading(true)
    try {
      const response = await fetch('/api/notifications', { cache: 'no-store' })
      if (!response.ok) return
      const payload = await response.json().catch(() => null)
      setNotifications(payload?.data?.notifications ?? [])
      setUnread(payload?.data?.unread ?? 0)
    } catch {
      // The bell is supplementary; a failed refresh should stay quiet.
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    if (status !== 'authenticated') return

    const initialLoad = window.setTimeout(load, 0)
    const timer = window.setInterval(load, 5 * 60_000)
    return () => {
      window.clearTimeout(initialLoad)
      window.clearInterval(timer)
    }
  }, [status, load])

  if (status !== 'authenticated') return null

  async function markRead(notification: NotificationItem) {
    if (!notification.readAt) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, readAt: new Date().toISOString() }
            : item
        )
      )
      setUnread((current) => Math.max(0, current - 1))
    }

    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: notification.id }),
    }).catch(() => {})
  }

  async function markAllRead() {
    if (marking || unread === 0) return
    setMarking(true)
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
        setUnread(0)
      }
    } finally {
      setMarking(false)
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && load()}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'
          }
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-bold leading-none text-white sm:text-[10px]">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              disabled={marking}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              {marking ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCheck className="h-3 w-3" aria-hidden="true" />
              )}
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet. Follow requests and their responses will
              appear here.
            </p>
          ) : (
            notifications.map((notification) => {
              const Icon =
                notification.type === 'follow_request' ? UserPlus : CheckCheck
              const href =
                notification.href ??
                (notification.actor
                  ? `/community/people/${notification.actor.id}`
                  : '/settings?tab=profile')

              return (
                <Link
                  key={notification.id}
                  href={href}
                  onClick={() => markRead(notification)}
                  className={`flex gap-3 border-b border-border/50 px-3 py-3 transition-colors last:border-b-0 hover:bg-accent ${
                    notification.readAt ? '' : 'bg-emerald-500/5'
                  }`}
                >
                  <Avatar className="mt-0.5 h-9 w-9">
                    <AvatarImage
                      src={notification.actor?.image ?? ''}
                      alt=""
                    />
                    <AvatarFallback>
                      {notification.actor?.name?.charAt(0) ?? (
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      {notification.message ?? 'You have a new notification.'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.readAt && (
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                      aria-label="Unread"
                    />
                  )}
                </Link>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
