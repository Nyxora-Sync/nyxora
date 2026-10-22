import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="mb-10 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Link key={i} href={`/learn/${i}`} className="group">
            <Card className="relative overflow-hidden transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl h-full border-border/50">
              <Skeleton className="h-1 bg-gradient-to-r from-emerald-500 to-violet-500" />
              <CardHeader>
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="grid grid-cols-3 gap-4 text-center">
                  <Skeleton className="h-8 w-12 mx-auto rounded-lg" />
                  <Skeleton className="h-8 w-12 mx-auto rounded-lg" />
                  <Skeleton className="h-8 w-12 mx-auto rounded-lg" />
                </Skeleton>
                <Skeleton className="h-px bg-border" />
                <ul className="space-y-3" role="list">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <li key={j} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Skeleton className="flex-shrink-0 w-10 h-10 rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="border-t-0 pt-0">
                <Skeleton className="w-full h-10" />
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
