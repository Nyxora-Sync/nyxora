'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'motion/react'
import { ReactNode } from 'react'
import { ProgressSync } from '@/components/progress-sync'
import { PwaRegister } from '@/components/pwa-register'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProgressSync />
          <PwaRegister />
          {children}
        </ThemeProvider>
      </MotionConfig>
    </SessionProvider>
  )
}