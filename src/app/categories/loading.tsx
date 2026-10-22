import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <Skeleton className="h-1 bg-gradient-to-r from-emerald-500 to-violet-500" />
            <CardContent className="pt-6 pb-8">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 mt-2" />
              <Skeleton className="h-4 w-16 mt-4" />
              <Skeleton className="h-4 w-16 mt-4" />
              <Skeleton className="h-4 w-16 mt-4" />
              <Skeleton className="h-4 w-full mt-8" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
