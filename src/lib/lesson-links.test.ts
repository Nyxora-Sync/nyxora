import { describe, expect, it } from 'vitest'
import { tracks } from '@/lib/curriculum'
import { getLessonHref } from '@/lib/lesson-links'

const knownLesson = tracks[0]!.modules[0]!.lessons[0]!

describe('getLessonHref', () => {
  it('builds a path for a known lesson', () => {
    expect(getLessonHref(knownLesson.id)).toContain(knownLesson.id)
    expect(getLessonHref(knownLesson.id)).toMatch(/^\/learn\//)
  })

  it('falls back to the curriculum index for unknown ids', () => {
    expect(getLessonHref('not-a-real-lesson')).toBe('/learn')
  })
})
