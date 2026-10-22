import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-10">
      {/* Sync status */}
      <Skeleton className="h-24 rounded-xl border" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-4 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning */}
      <Skeleton className="h-28 rounded-xl border" />

      {/* Track Progress */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>

      {/* Badges */}
      <div className="grid grid-cols-1 gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-10 w-10 rounded-lg mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-1" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookmarks */}
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg border" />
        ))}
      </div>

      {/* Reset */}
      <Skeleton className="h-12" />
    </div>
  )
}
