import type { ReactNode } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/motion/reveal'
import { FileText } from 'lucide-react'

export function LegalPage({
  badge,
  title,
  intro,
  updated,
  children,
}: {
  badge: string
  title: string
  intro: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border/50 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4">
              <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {badge}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
            <p className="mt-4 text-sm text-muted-foreground">Last updated {updated}</p>
          </div>
        </section>

        <Reveal className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2 prose-h3:mt-8 prose-h3:text-xl prose-p:leading-relaxed prose-li:my-1 prose-a:text-primary prose-a:underline-offset-4 prose-strong:text-foreground">
            {children}
          </article>

          <p className="mt-10 rounded-xl border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
            Questions about this page?{' '}
            <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
              Contact the maintainers
            </Link>
            .
          </p>
        </Reveal>
      </main>
      <Footer />
    </div>
  )
}
