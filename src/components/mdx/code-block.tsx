'use client'

import { useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CodeBlock({ children, className, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard can be unavailable (non-secure context); ignore.
    }
  }

  return (
    <div className="not-prose group relative my-6">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-zinc-300 opacity-0 transition-opacity hover:bg-white/10 focus:opacity-100 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy
          </>
        )}
      </button>
      <pre
        ref={ref}
        tabIndex={0}
        className={cn(
          'overflow-x-auto rounded-xl border border-border/60 bg-[#0d1117] p-4 text-sm leading-relaxed text-[#c9d1d9] shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
