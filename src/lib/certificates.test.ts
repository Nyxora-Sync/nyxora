import { describe, expect, it } from 'vitest'
import { tracks } from '@/lib/curriculum'
import { trackProgress } from '@/lib/certificates'

describe('trackProgress', () => {
  it('reports zero for an empty completed set', () => {
    const progress = trackProgress('beginner', new Set())
    expect(progress.completed).toBe(0)
    expect(progress.total).toBeGreaterThan(0)
    expect(progress.percent).toBe(0)
  })

  it('reports 100 percent when every lesson is complete', () => {
    const track = tracks.find((candidate) => candidate.key === 'beginner')!
    const completed = new Set(track.modules.flatMap((mod) => mod.lessons.map((lesson) => lesson.id)))
    const progress = trackProgress(track.key, completed)
    expect(progress.completed).toBe(progress.total)
    expect(progress.percent).toBe(100)
  })

  it('returns an empty result for an unknown track', () => {
    expect(trackProgress('missing-track', new Set())).toEqual({
      completed: 0,
      total: 0,
      percent: 0,
    })
  })
})
