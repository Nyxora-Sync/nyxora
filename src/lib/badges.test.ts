import { describe, expect, it } from 'vitest'
import {
  badgeDefinitions,
  getEarnedBadges,
  sortBadgesByEarned,
  tierOrder,
} from '@/lib/badges'
import { tracks } from '@/lib/curriculum'
import type { BadgeContext } from '@/lib/badge-meta'

const firstLesson = tracks[0]!.modules[0]!.lessons[0]!

function context(overrides: Partial<BadgeContext> = {}): BadgeContext {
  return {
    state: {
      lessons: {},
      xp: 0,
      streak: { current: 0, longest: 0, lastActiveDate: null },
      bookmarks: [],
      lastVisited: null,
      practice: {
        flashcards: {},
        katas: {},
        projects: {},
        drills: {},
        streak: { current: 0, longest: 0, lastActiveDate: null },
      },
    },
    contributions: { projects: 0, comments: 0, upvotes: 0 },
    followers: 0,
    joinedAt: null,
    ...overrides,
  }
}

describe('badge catalog', () => {
  it('keeps all 79 badge keys unique', () => {
    const keys = badgeDefinitions.map((badge) => badge.key)
    expect(badgeDefinitions).toHaveLength(79)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('uses a known tier for every badge', () => {
    for (const badge of badgeDefinitions) {
      expect(tierOrder[badge.tier]).toBeTypeOf('number')
    }
  })

  it('unlocks First Steps after one completed lesson', () => {
    const earned = getEarnedBadges(
      context({
        state: {
          ...context().state,
          lessons: { [firstLesson.id]: { completed: true } },
        },
      })
    )
    expect(earned.map((badge) => badge.key)).toContain('first-lesson')
  })

  it('unlocks community badges from contribution counts', () => {
    const earned = getEarnedBadges(
      context({ contributions: { projects: 1, comments: 1, upvotes: 1 } })
    )
    const keys = earned.map((badge) => badge.key)
    expect(keys).toEqual(expect.arrayContaining(['first-project', 'first-comment', 'first-upvote']))
  })

  it('places earned badges before locked badges', () => {
    const earned = new Set(['xp-50', 'first-lesson'])
    const sorted = sortBadgesByEarned(badgeDefinitions, earned)
    const firstLocked = sorted.findIndex((badge) => !earned.has(badge.key))
    const lastEarned = sorted.reduce(
      (last, badge, index) => (earned.has(badge.key) ? index : last),
      -1
    )
    expect(lastEarned).toBeLessThan(firstLocked)
  })
})
