import { Info } from 'lucide-react'
import { CERTIFICATE_DISCLAIMER } from '@/lib/certificate-copy'
import { cn } from '@/lib/utils'

interface CertificateNoticeProps {
  className?: string
  text?: string
}

export function CertificateNotice({ className, text = CERTIFICATE_DISCLAIMER }: CertificateNoticeProps) {
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground',
        className
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <p className="leading-relaxed">{text}</p>
    </div>
  )
}
