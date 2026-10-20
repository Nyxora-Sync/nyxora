'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function RouterRefreshInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we need to force refresh by comparing with a stored version
    const lastPathname = sessionStorage.getItem('last-pathname')
    const lastSearchParams = sessionStorage.getItem('last-searchparams')
    const buildId = sessionStorage.getItem('build-id')

    // Get current build ID from a meta tag or global
    const currentBuildId = (window as any).__NEXT_DATA__?.buildId

    if (buildId && currentBuildId && buildId !== currentBuildId) {
      // New deployment detected - force full reload
      sessionStorage.setItem('build-id', currentBuildId)
      window.location.reload()
      return
    }

    if (!buildId && currentBuildId) {
      sessionStorage.setItem('build-id', currentBuildId)
    }

    // Store current pathname for next navigation
    sessionStorage.setItem('last-pathname', pathname)
    sessionStorage.setItem('last-searchparams', searchParams?.toString() || '')
  }, [pathname, searchParams])

  return null
}

export function RouterRefresh() {
  return (
    <Suspense fallback={null}>
      <RouterRefreshInner />
    </Suspense>
  )
}