import type { ReactNode } from 'react'
import { Info, Lightbulb, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type CalloutType = 'info' | 'tip' | 'warning' | 'danger' | 'success'

const styles: Record<
  CalloutType,
  { container: string; icon: string; title: string; Icon: typeof Info }
> = {
  info: {
    container: 'border-blue-500/30 bg-blue-500/5',
    icon: 'text-blue-500',
    title: 'text-blue-700 dark:text-blue-300',
    Icon: Info,
  },
  tip: {
    container: 'border-emerald-500/30 bg-emerald-500/5',
    icon: 'text-emerald-500',
    title: 'text-emerald-700 dark:text-emerald-300',
    Icon: Lightbulb,
  },
  warning: {
    container: 'border-amber-500/30 bg-amber-500/5',
    icon: 'text-amber-500',
    title: 'text-amber-700 dark:text-amber-300',
    Icon: AlertTriangle,
  },
  danger: {
    container: 'border-rose-500/30 bg-rose-500/5',
    icon: 'text-rose-500',
    title: 'text-rose-700 dark:text-rose-300',
    Icon: ShieldAlert,
  },
  success: {
    container: 'border-emerald-500/30 bg-emerald-500/5',
    icon: 'text-emerald-500',
    title: 'text-emerald-700 dark:text-emerald-300',
    Icon: CheckCircle2,
  },
}

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: ReactNode
}) {
  const meta = styles[type] ?? styles.info
  const Icon = meta.Icon

  return (
    <aside className={cn('not-prose my-6 rounded-xl border p-4 sm:p-5', meta.container)}>
      <div className="flex gap-3">
        <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', meta.icon)} aria-hidden="true" />
        <div className="min-w-0 space-y-1.5">
          {title && <p className={cn('font-semibold text-sm', meta.title)}>{title}</p>}
          <div className="text-sm leading-relaxed text-foreground/90 [&>p]:m-0 [&>p+p]:mt-2 [&>ul]:my-1 [&>ul]:pl-5 [&>ul]:list-disc">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}

export function KeyPoint({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 text-sm leading-relaxed">
      <span className="mr-2 font-semibold text-violet-600 dark:text-violet-300">Key idea:</span>
      {children}
    </div>
  )
}
