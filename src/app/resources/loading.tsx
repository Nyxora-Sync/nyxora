import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-24 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
