'use client'

import { CheckCircle2, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  categoryIcons,
  tierColors,
  tierIcons,
  tierLabels,
  type BadgeDefinition,
} from '@/lib/badge-meta'
import { cn } from '@/lib/utils'

interface BadgeGridProps {
  badges: BadgeDefinition[]
  earnedKeys: Set<string>
  className?: string
}

export function BadgeGrid({ badges, earnedKeys, className }: BadgeGridProps) {
  return (
    <div
      className={cn(
        'grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7',
        className
      )}
    >
      {badges.map((badge) => {
        const earned = earnedKeys.has(badge.key)
        const [borderColor, bgColor, textColor] = tierColors[badge.tier].split(' ')

        return (
          <Card
            key={badge.key}
            className={cn(
              'relative text-center transition-all duration-300',
              earned
                ? `border-2 ${borderColor} ${bgColor} hover:shadow-lg`
                : 'opacity-40 grayscale border-dashed border-border/30'
            )}
          >
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <span className="text-xs" aria-hidden="true">{tierIcons[badge.tier]}</span>
              <span className={`text-[10px] font-medium ${textColor}`}>{tierLabels[badge.tier]}</span>
              <span className="text-xs" aria-hidden="true">{categoryIcons[badge.category]}</span>
            </div>
            <CardContent className="pt-5 pb-4">
              <div className="text-4xl mb-2" aria-hidden="true">{badge.icon}</div>
              <p className="font-semibold text-sm">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
              {earned ? (
                <div className="mt-3 flex items-center justify-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    <span>Earned</span>
                  </span>
                </div>
              ) : badge.tier !== 'bronze' ? (
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 text-muted-foreground text-[10px] font-medium">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    <span>Locked</span>
                  </span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
