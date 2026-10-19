import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PlaygroundClient } from '@/components/playground-client'
import { Badge } from '@/components/ui/badge'
import { Code2 } from 'lucide-react'

export const metadata = {
  title: 'Interactive Playground',
  description: 'Write and run HTML, CSS, and JavaScript directly in your browser. Launch Node.js, Express, and React environments with one click.',
}

export default function PlaygroundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4">
              <Code2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              No setup required
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Interactive{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                Playground
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Experiment with code right here in your browser. The web playground runs locally;
              Node, Express, and React environments launch in StackBlitz with one click.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PlaygroundClient />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}