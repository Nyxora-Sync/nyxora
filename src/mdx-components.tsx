import type { MDXComponents } from 'mdx/types'
import { Callout, KeyPoint } from '@/components/mdx/callout'
import { Quiz } from '@/components/mdx/quiz'
import { Exercise, TryIt } from '@/components/mdx/exercise'
import { CodeBlock } from '@/components/mdx/code-block'

const components: MDXComponents = {
  a: ({ href = '', children, ...props }) => {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="font-medium text-emerald-700 underline decoration-emerald-500/40 underline-offset-4 transition-colors hover:text-emerald-600 dark:text-emerald-400"
        {...props}
      >
        {children}
      </a>
    )
  },
  h2: ({ id, children, ...props }) => (
    <h2 id={id} className="scroll-mt-24" {...props}>
      {children}
    </h2>
  ),
  h3: ({ id, children, ...props }) => (
    <h3 id={id} className="scroll-mt-24" {...props}>
      {children}
    </h3>
  ),
  pre: CodeBlock,
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto [&>table]:my-0">
      <table {...props}>{children}</table>
    </div>
  ),
  Callout,
  KeyPoint,
  Quiz,
  Exercise,
  TryIt,
}

export function useMDXComponents(): MDXComponents {
  return components
}
