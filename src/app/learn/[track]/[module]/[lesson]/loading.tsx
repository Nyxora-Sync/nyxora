import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-24 mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-24 mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-24 mt-4" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
