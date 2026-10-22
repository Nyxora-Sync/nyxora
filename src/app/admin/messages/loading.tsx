import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-3 w-48" />
      </div>

      <Skeleton className="h-10 rounded-md border" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Skeleton className="h-5 w-40" />
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-3/4 mt-1" />
              <Skeleton className="h-4 w-1/2 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}
