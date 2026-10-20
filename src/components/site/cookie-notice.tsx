'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'mern-learn-cookie-notice-v1'

export function CookieNotice() {
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === 'dismissed') return
    } catch {
      // If storage is unavailable, still show the notice once per page load.
    }

    const timer = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed')
    } catch {
      // The notice is still hidden for this page view.
    }
  }

  if (!visible) return null

  return (
    <motion.div
      role="region"
      aria-label="Cookie notice"
      data-print-hide
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-36 left-4 right-4 z-40 mx-auto max-w-md rounded-xl border border-border/60 bg-background/95 p-4 shadow-xl backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:mx-0 sm:w-[26rem]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Cookie className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">A small note about cookies</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            This site uses essential cookies for sign-in and keeps learning progress in your browser.
            There are no advertising or third-party tracking cookies.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" size="sm" onClick={dismiss}>
              Got it
            </Button>
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Privacy policy
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Dismiss cookie notice"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  )
}
