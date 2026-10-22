import { tracks } from '@/lib/curriculum'
import { canonicalLearnPath } from '@/lib/seo'

/** Resolve a stable curriculum lesson id to the canonical lesson URL. */
export function getLessonHref(lessonId: string): string {
  for (const track of tracks) {
    for (const mod of track.modules) {
      if (mod.lessons.some((lesson) => lesson.id === lessonId)) {
        return canonicalLearnPath(track.key, mod.key, lessonId)
      }
    }
  }
  return '/learn'
}
