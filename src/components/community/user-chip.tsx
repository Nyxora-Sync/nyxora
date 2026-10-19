import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { CommunityUser } from '@/lib/community-types'
import { cn } from '@/lib/utils'

export function displayName(user: Pick<CommunityUser, 'name'>): string {
  return user.name?.trim() || 'Anonymous learner'
}

export function UserChip({
  user,
  meta,
  size = 'sm',
  className,
}: {
  user: CommunityUser
  meta?: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const name = displayName(user)
  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Avatar className={size === 'md' ? 'h-10 w-10' : 'h-7 w-7'}>
        <AvatarImage src={user.image || ''} alt="" />
        <AvatarFallback className="text-xs">{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <Link
          href={`/community/people/${user.id}`}
          className="block truncate text-sm font-medium hover:text-primary transition-colors"
        >
          {name}
        </Link>
        {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
      </div>
    </div>
  )
}
