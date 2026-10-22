import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex gap-3 sm:flex-row">
        <Skeleton className="h-11 flex-1 rounded-md" />
        <Skeleton className="h-11 w-32" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
