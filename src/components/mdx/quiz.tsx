'use client'

import { useState } from 'react'
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Quiz({
  question,
  options,
  answer,
  explanation,
}: {
  question: string
  options: string[]
  answer: number
  explanation?: string
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null
  const correct = selected === answer

  return (
    <div className="not-prose my-8 rounded-xl border border-border/60 bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
        Quick check
      </div>
      <p className="mb-4 font-medium">{question}</p>

      <div className="grid gap-2" role="group" aria-label="Answer options">
        {options.map((option, index) => {
          const isSelected = selected === index
          const isAnswer = answer === index
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
              disabled={answered}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                !answered && 'hover:border-primary/50 hover:bg-muted/50',
                answered && isAnswer && 'border-emerald-500/50 bg-emerald-500/10',
                answered && isSelected && !isAnswer && 'border-rose-500/50 bg-rose-500/10',
                !answered || (!isAnswer && !isSelected) ? 'border-border/60' : ''
              )}
              aria-pressed={isSelected}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                  answered && isAnswer
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : answered && isSelected
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : 'border-border text-muted-foreground'
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="pt-0.5">{option}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          className={cn(
            'mt-4 rounded-lg border p-3 text-sm',
            correct
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-amber-500/30 bg-amber-500/5'
          )}
          role="status"
        >
          <p className="flex items-center gap-2 font-medium">
            {correct ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
            )}
            {correct ? 'Correct!' : 'Not quite — here is why:'}
          </p>
          {explanation && <p className="mt-1 text-muted-foreground">{explanation}</p>}
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
