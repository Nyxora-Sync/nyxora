import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ResourcesClient } from '@/components/resources-client'
import { Badge } from '@/components/ui/badge'
import { resourcesData } from '@/lib/resources-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Free Resource Directory',
  description: `A curated directory of ${resourcesData.length} free resources for learning the MERN stack: videos, articles, docs, courses, and interactive tutorials.`,
  path: '/resources',
  keywords: ['free MERN resources', 'MongoDB tutorials', 'Express tutorials', 'React tutorials', 'Node.js tutorials'],
})

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4">{resourcesData.length} curated resources</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Free Resource{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Every resource here is 100% free forever. No trials, no paywalls, no affiliate links.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ResourcesClient resources={resourcesData} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}