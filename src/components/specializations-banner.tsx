import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getTrack } from '@/lib/curriculum'
import { cn, getAccent } from '@/lib/utils'

export function SpecializationsBanner({ className }: { className?: string }) {
  const track = getTrack('specializations')
  if (!track) return null

  return (
    <section
      aria-labelledby="specializations-heading"
      className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
    >
      <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="lg:w-80 lg:shrink-0">
              <div
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
                  getAccent(track.color).pill
                )}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                After the core
              </div>
              <h2 id="specializations-heading" className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {track.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>
              <Button asChild variant="outline" className="mt-5 gap-2">
                <Link href={`/learn/${track.key}`}>
                  Explore specializations
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {track.modules.map((module) => (
                <Link key={module.id} href={`/learn/${track.key}/${module.key}`} className="group block">
                  <div className="h-full rounded-xl border border-border/60 bg-card p-4 transition-all motion-safe:hover:-translate-y-0.5 hover:border-border hover:shadow-md">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                      Specialization {module.order}
                    </p>
                    <h3 className="mt-1 font-semibold group-hover:text-primary transition-colors">
                      {module.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{module.description}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {module.lessons.length} lessons · ~{module.estimatedHours} hours
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
