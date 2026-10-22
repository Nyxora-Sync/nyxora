'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface RealtimeNotification {
  type: string
  notificationId: string
  actorId: string
  actorName: string
  actorImage: string | null
  message: string
  href: string
  timestamp: string
}

export interface UseNotificationsOptions {
  onNotification?: (notification: RealtimeNotification) => void
  enabled?: boolean
}

export function useNotifications({ onNotification, enabled = true }: UseNotificationsOptions = {}) {
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  
  const [connected, setConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const addNotification = useCallback((notification: RealtimeNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)])
    setUnreadCount(prev => prev + 1)
    onNotification?.(notification)
  }, [onNotification])

  const markAsRead = useCallback((notificationId?: string) => {
    if (notificationId === undefined) {
      setNotifications([])
      setUnreadCount(0)
    } else {
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }, [])

  const connect = useCallback(() => {
    if (!userId || !enabled || eventSourceRef.current) return

    const es = new EventSource('/api/notifications/stream')
    eventSourceRef.current = es

    es.onopen = () => {
      // Don't set connected immediately - wait for first heartbeat or message
      // to ensure connection is stable
      reconnectAttemptsRef.current = 0
    }

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeNotification
        if (data.type === 'connected') {
          // Connection is confirmed stable after receiving connected event
          setConnected(true)
          return
        }
        if (data.type === 'heartbeat') {
          // Heartbeat confirms connection is alive
          if (!connected) setConnected(true)
          return
        }
        addNotification(data)
      } catch {
        // Ignore parse errors
      }
    }

    es.onerror = () => {
      setConnected(false)
      es.close()
      eventSourceRef.current = null

      // Exponential backoff reconnect
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
      reconnectAttemptsRef.current += 1
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (enabled) connect()
      }, delay)
    }
  }, [userId, enabled, addNotification])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    setConnected(false)
  }, [])

  useEffect(() => {
    if (userId && enabled) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [userId, enabled, connect, disconnect])

  return {
    connected,
    unreadCount,
    notifications,
    markAsRead,
    connect,
    disconnect,
  }
}
