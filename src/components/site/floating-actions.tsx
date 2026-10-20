'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUp, MessageCircle } from 'lucide-react'

export function FloatingActions() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 480)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname.startsWith('/admin')) return null

  const hideContact = pathname === '/contact'

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div
      data-print-hide
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3"
    >
      <AnimatePresence initial={false}>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowUp className="h-4.5 w-4.5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {!hideContact && (
        <Link
          href="/contact"
          aria-label="Contact MERN Learn"
          title="Contact"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-[background-color,transform] hover:bg-primary/90 motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:active:scale-95"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
