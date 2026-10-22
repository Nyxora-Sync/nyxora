import { describe, expect, it } from 'vitest'
import { profileSchema } from '@/lib/community'

describe('profileSchema', () => {
  it('deduplicates featured badge keys', () => {
    const parsed = profileSchema.safeParse({
      featuredBadges: ['first-lesson', 'first-lesson', 'streak-1'],
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.featuredBadges).toEqual(['first-lesson', 'streak-1'])
    }
  })

  it('rejects more than three pinned badges', () => {
    const parsed = profileSchema.safeParse({
      featuredBadges: ['a', 'b', 'c', 'd'],
    })
    expect(parsed.success).toBe(false)
  })

  it('rejects unknown profile fields', () => {
    const parsed = profileSchema.safeParse({ isAdmin: true })
    expect(parsed.success).toBe(false)
  })
})
