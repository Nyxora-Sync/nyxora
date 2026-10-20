'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'motion/react'
import { ReactNode } from 'react'
import { ProgressSync } from '@/components/progress-sync'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProgressSync />
          {children}
        </ThemeProvider>
      </MotionConfig>
    </SessionProvider>
  )
}