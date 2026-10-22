'use client'

import { useEffect } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintButton({ auto = false }: { auto?: boolean }) {
  useEffect(() => {
    if (!auto) return
    const timer = window.setTimeout(() => window.print(), 350)
    return () => window.clearTimeout(timer)
  }, [auto])

  return (
    <Button type="button" variant="outline" className="gap-2" onClick={() => window.print()}>
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print certificate
    </Button>
  )
}
