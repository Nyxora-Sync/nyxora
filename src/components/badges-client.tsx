'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Trophy } from 'lucide-react'
import { useProgress } from '@/hooks/use-progress'
import { useCommunityStats } from '@/hooks/use-community-stats'
import {
  badgeDefinitions,
  getEarnedBadges,
  sortBadgesByEarned,
} from '@/lib/badges'
import { BadgeGrid } from '@/components/badge-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function BadgesClient() {
  const { state, isLoaded, xp, streak } = useProgress()
  const { stats: community } = useCommunityStats()

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-xl border border-border/50 bg-muted/40" />
        <div className="grid grid-cols-1 gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
          {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-xl border border-border/50 bg-muted/40" />
          ))}
        </div>
      </div>
    )
  }

  const context = { state, ...community }
  const earnedBadges = getEarnedBadges(context)
  const earnedKeys = new Set(earnedBadges.map((badge) => badge.key))
  const sortedBadges = sortBadgesByEarned(badgeDefinitions, earnedKeys)
  const percentage = Math.round((earnedBadges.length / badgeDefinitions.length) * 100)

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Badge collection</p>
              <p className="mt-1 text-3xl font-bold">
                {earnedBadges.length}
                <span className="text-lg font-normal text-muted-foreground"> / {badgeDefinitions.length}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{percentage}% unlocked</p>
            </div>
            <div className="flex flex-wrap gap-5 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Trophy className="h-4 w-4 text-violet-500" aria-hidden="true" />
                <strong className="text-foreground">{earnedBadges.length}</strong> earned
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <strong className="text-foreground">{xp.toLocaleString()}</strong> XP
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                🔥 <strong className="text-foreground">{streak.longest}</strong> day streak
              </span>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2 sm:shrink-0">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
            </Button>
          </div>
          <Progress value={percentage} className="mt-5 h-2" />
        </CardContent>
      </Card>

      <BadgeGrid badges={sortedBadges} earnedKeys={earnedKeys} />
    </div>
  )
}
