import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/motion/reveal'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, Code2, Cpu, Smartphone, Brain, Cloud, Gamepad2, Monitor } from 'lucide-react'
import { trackCategories } from '@/lib/curriculum'
import { tracks as curriculumTracks } from '@/lib/curriculum'
import { cn, getAccent } from '@/lib/utils'

const categoryIcons: Record<string, typeof Globe> = {
  'web-development': Globe,
  'programming-languages': Code2,
  'embedded-systems': Cpu,
  'mobile-development': Smartphone,
  'data-science': Brain,
  'devops-cloud': Cloud,
  'game-development': Gamepad2,
  'desktop-apps': Monitor,
}

export const metadata: Metadata = {
  title: 'Learning Categories | Nyxora Sync',
  description: 'Explore all learning categories: Web Development, Programming Languages, Embedded Systems, Mobile Development, Data Science, DevOps, Game Development, and Desktop Apps.',
  openGraph: {
    title: 'Learning Categories | Nyxora Sync',
    description: 'Explore all learning categories: Web Development, Programming Languages, Embedded Systems, Mobile Development, Data Science, DevOps, Game Development, and Desktop Apps.',
  },
}

export default function CategoriesPage() {
  const categoriesWithTracks = trackCategories
    .filter((cat) => curriculumTracks.some((t) => t.category === cat.id))
    .map((category) => {
      const categoryTracks = curriculumTracks.filter((t) => t.category === category.id)
      const totalLessons = categoryTracks.reduce((sum, t) => sum + t.modules.reduce((s, m) => s + m.lessons.length, 0), 0)
      const totalTracks = categoryTracks.length
      return { category, totalLessons, totalTracks }
    })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Learning{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                Categories
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Browse all learning categories. Each category contains multiple learning paths from beginner to mastery.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 sm:py-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              {categoriesWithTracks.map(({ category, totalLessons, totalTracks }) => {
                const Icon = categoryIcons[category.id] ?? Globe
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="group relative block"
                  >
                    <Card className="relative h-full overflow-hidden transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl border-border/50">
                      <div
                        className={cn(
                          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
                          getAccent(category.color).gradient
                        )}
                      />
                      <CardContent className="pt-6 pb-8 flex flex-col h-full">
                        <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(category.color).icon)}>
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground flex-1">
                          {category.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-4">
                          <span>{totalTracks} tracks</span>
                          <span>{totalLessons} lessons</span>
                        </div>
                        <ArrowRight
                          className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground/50 group-hover:text-foreground group-hover:right-3 transition-all"
                          aria-hidden="true"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-amber-500/10 border-border/50">
              <CardContent className="relative py-12 sm:py-16 text-center">
                <div className="mx-auto max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to start learning?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Pick a category above or browse all tracks on the Learn page.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn">
                        Browse All Tracks
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/roadmap">View Full Roadmap</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}