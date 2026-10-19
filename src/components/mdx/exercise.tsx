import type { ReactNode } from 'react'
import { Pencil, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

const difficultyStyles = {
  easy: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
  medium: 'bg-amber-500/15 text-amber-600 border-amber-500/20',
  hard: 'bg-rose-500/15 text-rose-600 border-rose-500/20',
} as const

export function Exercise({
  title = 'Practice exercise',
  difficulty = 'easy',
  children,
}: {
  title?: string
  difficulty?: keyof typeof difficultyStyles
  children: ReactNode
}) {
  return (
    <section className="not-prose my-8 rounded-xl border border-border/60 bg-muted/30 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Exercise
        </span>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
            difficultyStyles[difficulty]
          )}
        >
          {difficulty}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold">{title}</h3>
      <div className="text-sm leading-relaxed text-foreground/90 [&>ol]:my-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul:has(input[type=checkbox])]:list-none [&>ul:has(input[type=checkbox])]:pl-0 [&>ul:has(input[type=checkbox])]:space-y-1.5 [&>p+p]:mt-2">
        {children}
      </div>
    </section>
  )
}

export function TryIt({
  title = 'Try it yourself',
  hint = 'Type this out by hand, then run it in the playground or in your own editor.',
  children,
}: {
  title?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="not-prose my-8 rounded-xl border border-blue-500/25 bg-blue-500/5 p-4 sm:p-5">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
        <FlaskConical className="h-4 w-4" aria-hidden="true" />
        {title}
      </div>
      <p className="mb-2 text-xs text-muted-foreground">{hint}</p>
      <div className="[&>div]:my-2 [&>div:last-child]:mb-0">{children}</div>
    </section>
  )
}
