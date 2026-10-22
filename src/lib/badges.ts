import type { ProgressState } from '@/lib/progress-state'
import { tracks, type Lesson } from '@/lib/curriculum'
import { tierOrder, type BadgeContext, type BadgeDefinition } from '@/lib/badge-meta'

export * from '@/lib/badge-meta'

// ---------------------------------------------------------------------------
// Progress helpers shared by the badge checks
// ---------------------------------------------------------------------------

const allLessons = tracks.flatMap((track) =>
  track.modules.flatMap((module) => module.lessons)
)

const ALL_LESSON_IDS = Array.from(new Set(allLessons.map((lesson) => lesson.id)))

export const TOTAL_LESSON_COUNT = ALL_LESSON_IDS.length

const languageTrackKeys = tracks
  .filter((track) => track.category === 'programming-languages')
  .map((track) => track.key)

function completedCount(state: ProgressState): number {
  return Object.values(state.lessons).filter((lesson) => lesson.completed).length
}

function trackLessons(trackKey: string): Lesson[] {
  const track = tracks.find((candidate) => candidate.key === trackKey)
  return track ? track.modules.flatMap((module) => module.lessons) : []
}

function moduleLessons(moduleKey: string): Lesson[] {
  for (const track of tracks) {
    const trackModule = track.modules.find((candidate) => candidate.key === moduleKey)
    if (trackModule) return trackModule.lessons
  }
  return []
}

function isModuleComplete(
  state: ProgressState,
  moduleKey: string,
  matches: (lesson: Lesson) => boolean = () => true
): boolean {
  const lessons = moduleLessons(moduleKey).filter(matches)
  return lessons.length > 0 && lessons.every((lesson) => state.lessons[lesson.id]?.completed)
}

function isTrackComplete(state: ProgressState, trackKey: string): boolean {
  const lessons = trackLessons(trackKey)
  return lessons.length > 0 && lessons.every((lesson) => state.lessons[lesson.id]?.completed)
}

function isLanguageComplete(state: ProgressState, trackKey: string): boolean {
  const lessons = trackLessons(trackKey)
  return lessons.length > 0 && lessons.every((lesson) => state.lessons[lesson.id]?.completed)
}

function completedLanguageCount(state: ProgressState): number {
  return languageTrackKeys.filter((trackKey) =>
    trackLessons(trackKey).some((lesson) => state.lessons[lesson.id]?.completed)
  ).length
}

function completedDates(state: ProgressState): Date[] {
  return Object.values(state.lessons)
    .filter((lesson) => lesson.completed && lesson.completedAt)
    .map((lesson) => new Date(lesson.completedAt as string))
    .filter((date) => !Number.isNaN(date.getTime()))
}

function hasCompletionInHourRange(state: ProgressState, startHour: number, endHour: number): boolean {
  return completedDates(state).some((date) => {
    const hour = date.getHours()
    return hour >= startHour && hour < endHour
  })
}

function maxLessonsInOneDay(state: ProgressState): number {
  const counts = new Map<string, number>()
  for (const date of completedDates(state)) {
    const key = date.toDateString()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Math.max(0, ...counts.values())
}

function hasWeekendBothDays(state: ProgressState): boolean {
  const weekendDays = new Map<string, Set<number>>()

  for (const date of completedDates(state)) {
    const day = date.getDay()
    if (day !== 0 && day !== 6) continue

    // Key each weekend by its Monday so Saturday and Sunday line up.
    const monday = new Date(date)
    monday.setHours(0, 0, 0, 0)
    monday.setDate(date.getDate() - ((day + 6) % 7))
    const weekKey = monday.toDateString()

    const days = weekendDays.get(weekKey) ?? new Set<number>()
    days.add(day)
    weekendDays.set(weekKey, days)
  }

  return Array.from(weekendDays.values()).some((days) => days.has(0) && days.has(6))
}

const ALL_WEB_TRACKS = ['beginner', 'developer', 'specializations'] as const

// Badge definitions (mirrors prisma/seed.ts, but computed client-side)
export const badgeDefinitions: BadgeDefinition[] = [
  // Milestone badges (lesson completion)
  { key: 'first-lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', check: ({ state }) => completedCount(state) >= 1, category: 'milestone', tier: 'bronze' },
  { key: 'five-lessons', name: 'Getting Warmed Up', icon: '🔥', description: 'Complete 5 lessons', check: ({ state }) => completedCount(state) >= 5, category: 'milestone', tier: 'bronze' },
  { key: 'ten-lessons', name: 'Committed', icon: '💪', description: 'Complete 10 lessons', check: ({ state }) => completedCount(state) >= 10, category: 'milestone', tier: 'silver' },
  { key: 'twenty-lessons', name: 'Halfway Hero', icon: '🚀', description: 'Complete 20 lessons', check: ({ state }) => completedCount(state) >= 20, category: 'milestone', tier: 'gold' },
  { key: 'fifty-lessons', name: 'Scholar', icon: '📚', description: 'Complete 50 lessons', check: ({ state }) => completedCount(state) >= 50, category: 'milestone', tier: 'platinum' },
  { key: 'hundred-lessons', name: 'Scholar Supreme', icon: '📖', description: 'Complete 100 lessons', check: ({ state }) => completedCount(state) >= 100, category: 'milestone', tier: 'diamond' },
  { key: 'two-hundred-lessons', name: 'Omniscient', icon: '🧠', description: 'Complete 200 lessons', check: ({ state }) => completedCount(state) >= 200, category: 'milestone', tier: 'diamond' },
  { key: 'all-lessons', name: 'Knowledge Incarnate', icon: '👑', description: 'Complete every single lesson', check: ({ state }) => ALL_LESSON_IDS.every((lessonId) => state.lessons[lessonId]?.completed), category: 'milestone', tier: 'legendary' },

  // Streak badges
  { key: 'streak-1', name: 'Day One', icon: '🌱', description: 'Start a 1-day learning streak', check: ({ state }) => state.streak.current >= 1, category: 'streak', tier: 'bronze' },
  { key: 'streak-3', name: 'On Fire', icon: '🔥', description: 'Maintain a 3-day learning streak', check: ({ state }) => state.streak.longest >= 3, category: 'streak', tier: 'bronze' },
  { key: 'streak-7', name: 'Unstoppable', icon: '⚡', description: 'Maintain a 7-day learning streak', check: ({ state }) => state.streak.longest >= 7, category: 'streak', tier: 'silver' },
  { key: 'streak-14', name: 'Fortnight Warrior', icon: '🌙', description: 'Maintain a 14-day learning streak', check: ({ state }) => state.streak.longest >= 14, category: 'streak', tier: 'gold' },
  { key: 'streak-30', name: 'Monthly Master', icon: '📅', description: 'Maintain a 30-day learning streak', check: ({ state }) => state.streak.longest >= 30, category: 'streak', tier: 'platinum' },
  { key: 'streak-60', name: 'Habitual', icon: '♾️', description: 'Maintain a 60-day learning streak', check: ({ state }) => state.streak.longest >= 60, category: 'streak', tier: 'diamond' },
  { key: 'streak-100', name: 'Centurion', icon: '💯', description: 'Maintain a 100-day learning streak', check: ({ state }) => state.streak.longest >= 100, category: 'streak', tier: 'legendary' },
  { key: 'streak-365', name: 'Eternal Flame', icon: '🔥', description: 'Maintain a 365-day learning streak', check: ({ state }) => state.streak.longest >= 365, category: 'streak', tier: 'legendary' },

  // XP badges
  { key: 'xp-50', name: 'Novice', icon: '🌟', description: 'Earn 50 XP', check: ({ state }) => state.xp >= 50, category: 'xp', tier: 'bronze' },
  { key: 'xp-100', name: 'Century Club', icon: '💯', description: 'Earn 100 XP', check: ({ state }) => state.xp >= 100, category: 'xp', tier: 'silver' },
  { key: 'xp-250', name: 'Rising Star', icon: '⭐', description: 'Earn 250 XP', check: ({ state }) => state.xp >= 250, category: 'xp', tier: 'gold' },
  { key: 'xp-500', name: 'XP Hunter', icon: '🏆', description: 'Earn 500 XP', check: ({ state }) => state.xp >= 500, category: 'xp', tier: 'platinum' },
  { key: 'xp-1000', name: 'MERN Master', icon: '👑', description: 'Earn 1000 XP', check: ({ state }) => state.xp >= 1000, category: 'xp', tier: 'diamond' },
  { key: 'xp-2500', name: 'XP Legend', icon: '💎', description: 'Earn 2500 XP', check: ({ state }) => state.xp >= 2500, category: 'xp', tier: 'legendary' },
  { key: 'xp-5000', name: 'XP Deity', icon: '💫', description: 'Earn 5000 XP', check: ({ state }) => state.xp >= 5000, category: 'xp', tier: 'legendary' },
  { key: 'xp-10000', name: 'XP Deity Supreme', icon: '🌌', description: 'Earn 10000 XP', check: ({ state }) => state.xp >= 10000, category: 'xp', tier: 'legendary' },

  // Project badges
  { key: 'first-project', name: 'Builder', icon: '🏗️', description: 'Share your first project in the showcase', check: ({ contributions }) => contributions.projects >= 1, category: 'project', tier: 'bronze' },
  { key: 'five-projects', name: 'Architect', icon: '🏛️', description: 'Share 5 projects', check: ({ contributions }) => contributions.projects >= 5, category: 'project', tier: 'silver' },
  { key: 'ten-projects', name: 'Master Builder', icon: '🏰', description: 'Share 10 projects', check: ({ contributions }) => contributions.projects >= 10, category: 'project', tier: 'gold' },
  { key: 'twenty-projects', name: 'Grand Architect', icon: '🏙️', description: 'Share 20 projects', check: ({ contributions }) => contributions.projects >= 20, category: 'project', tier: 'platinum' },
  { key: 'fifty-projects', name: 'City Planner', icon: '🌆', description: 'Share 50 projects', check: ({ contributions }) => contributions.projects >= 50, category: 'project', tier: 'diamond' },
  { key: 'hundred-projects', name: 'Metropolis Builder', icon: '🏛️', description: 'Share 100 projects', check: ({ contributions }) => contributions.projects >= 100, category: 'project', tier: 'legendary' },

  // Community badges
  { key: 'first-comment', name: 'Voice', icon: '💬', description: 'Post your first comment', check: ({ contributions }) => contributions.comments >= 1, category: 'community', tier: 'bronze' },
  { key: 'ten-comments', name: 'Conversationalist', icon: '🗣️', description: 'Post 10 comments', check: ({ contributions }) => contributions.comments >= 10, category: 'community', tier: 'silver' },
  { key: 'fifty-comments', name: 'Orator', icon: '🎤', description: 'Post 50 comments', check: ({ contributions }) => contributions.comments >= 50, category: 'community', tier: 'gold' },
  { key: 'hundred-comments', name: 'Orator Supreme', icon: '📢', description: 'Post 100 comments', check: ({ contributions }) => contributions.comments >= 100, category: 'community', tier: 'platinum' },
  { key: 'first-upvote', name: 'Supporter', icon: '👍', description: 'Give your first upvote', check: ({ contributions }) => contributions.upvotes >= 1, category: 'community', tier: 'bronze' },
  { key: 'ten-upvotes', name: 'Cheerleader', icon: '📣', description: 'Give 10 upvotes', check: ({ contributions }) => contributions.upvotes >= 10, category: 'community', tier: 'silver' },
  { key: 'fifty-upvotes', name: 'Champion', icon: '🏅', description: 'Give 50 upvotes', check: ({ contributions }) => contributions.upvotes >= 50, category: 'community', tier: 'gold' },
  { key: 'hundred-upvotes', name: 'Champion Supreme', icon: '🏅', description: 'Give 100 upvotes', check: ({ contributions }) => contributions.upvotes >= 100, category: 'community', tier: 'platinum' },
  { key: 'follower-10', name: 'Rising Star', icon: '✨', description: 'Gain 10 followers', check: ({ followers }) => followers >= 10, category: 'community', tier: 'silver' },
  { key: 'follower-50', name: 'Influencer', icon: '🌟', description: 'Gain 50 followers', check: ({ followers }) => followers >= 50, category: 'community', tier: 'gold' },
  { key: 'follower-100', name: 'Leader', icon: '👑', description: 'Gain 100 followers', check: ({ followers }) => followers >= 100, category: 'community', tier: 'platinum' },
  { key: 'follower-500', name: 'Luminary', icon: '💫', description: 'Gain 500 followers', check: ({ followers }) => followers >= 500, category: 'community', tier: 'diamond' },
  { key: 'follower-1000', name: 'Legend', icon: '🏆', description: 'Gain 1000 followers', check: ({ followers }) => followers >= 1000, category: 'community', tier: 'legendary' },

  // Mastery badges (web tracks)
  { key: 'html-master', name: 'HTML Artisan', icon: '🌐', description: 'Complete all HTML lessons', check: ({ state }) => isModuleComplete(state, 'foundations', (lesson) => lesson.id.includes('html')), category: 'mastery', tier: 'gold' },
  { key: 'css-master', name: 'CSS Virtuoso', icon: '🎨', description: 'Complete all CSS lessons', check: ({ state }) => isModuleComplete(state, 'foundations', (lesson) => lesson.id.includes('css')), category: 'mastery', tier: 'gold' },
  { key: 'js-master', name: 'JavaScript Sage', icon: '⚡', description: 'Complete all JavaScript lessons', check: ({ state }) => isModuleComplete(state, 'foundations', (lesson) => lesson.id.includes('js') || lesson.id.includes('es6')), category: 'mastery', tier: 'gold' },
  { key: 'react-master', name: 'React Architect', icon: '⚛️', description: 'Complete all React lessons', check: ({ state }) => isModuleComplete(state, 'react'), category: 'mastery', tier: 'platinum' },
  { key: 'node-master', name: 'Node.js Architect', icon: '🟢', description: 'Complete all Node.js lessons', check: ({ state }) => isModuleComplete(state, 'node-express'), category: 'mastery', tier: 'platinum' },
  { key: 'mongodb-master', name: 'MongoDB Master', icon: '🍃', description: 'Complete all MongoDB lessons', check: ({ state }) => isModuleComplete(state, 'mongodb'), category: 'mastery', tier: 'gold' },
  { key: 'typescript-master', name: 'TypeScript Architect', icon: '📘', description: 'Complete all TypeScript lessons', check: ({ state }) => isModuleComplete(state, 'typescript'), category: 'mastery', tier: 'platinum' },
  { key: 'testing-master', name: 'Testing Guru', icon: '🧪', description: 'Complete all testing lessons', check: ({ state }) => isModuleComplete(state, 'testing'), category: 'mastery', tier: 'platinum' },
  { key: 'security-master', name: 'Security Guardian', icon: '🛡️', description: 'Complete all security lessons', check: ({ state }) => isModuleComplete(state, 'security'), category: 'mastery', tier: 'platinum' },
  { key: 'devops-master', name: 'DevOps Engineer', icon: '☁️', description: 'Complete all DevOps lessons', check: ({ state }) => isModuleComplete(state, 'devops'), category: 'mastery', tier: 'platinum' },
  { key: 'performance-master', name: 'Performance Engineer', icon: '🚀', description: 'Complete all performance lessons', check: ({ state }) => isModuleComplete(state, 'performance'), category: 'mastery', tier: 'platinum' },
  { key: 'architecture-master', name: 'System Architect', icon: '🏗️', description: 'Complete all architecture lessons', check: ({ state }) => isModuleComplete(state, 'architecture'), category: 'mastery', tier: 'platinum' },
  { key: 'scalable-systems-master', name: 'Scalability Architect', icon: '📦', description: 'Complete all scalable systems lessons', check: ({ state }) => isModuleComplete(state, 'scalable-systems'), category: 'mastery', tier: 'diamond' },
  { key: 'react-native-master', name: 'Mobile Architect', icon: '📱', description: 'Complete all React Native lessons', check: ({ state }) => isModuleComplete(state, 'react-native'), category: 'mastery', tier: 'diamond' },

  // Mastery badges (language tracks)
  { key: 'c-master', name: 'C Systems Master', icon: '🔧', description: 'Complete all C language lessons', check: ({ state }) => isLanguageComplete(state, 'c'), category: 'mastery', tier: 'diamond' },
  { key: 'cpp-master', name: 'C++ Systems Master', icon: '⚙️', description: 'Complete all C++ language lessons', check: ({ state }) => isLanguageComplete(state, 'cpp'), category: 'mastery', tier: 'diamond' },
  { key: 'csharp-master', name: 'C# .NET Master', icon: '🎯', description: 'Complete all C# language lessons', check: ({ state }) => isLanguageComplete(state, 'csharp'), category: 'mastery', tier: 'diamond' },
  { key: 'python-master', name: 'Python Master', icon: '🐍', description: 'Complete all Python language lessons', check: ({ state }) => isLanguageComplete(state, 'python'), category: 'mastery', tier: 'diamond' },
  { key: 'polyglot-2', name: 'Bilingual Coder', icon: '🗣️', description: 'Complete lessons in 2 languages', check: ({ state }) => completedLanguageCount(state) >= 2, category: 'mastery', tier: 'silver' },
  { key: 'polyglot-5', name: 'Polyglot', icon: '🌐', description: 'Complete lessons in 5 languages', check: ({ state }) => completedLanguageCount(state) >= 5, category: 'mastery', tier: 'platinum' },
  { key: 'polyglot-10', name: 'Omniglott', icon: '👑', description: 'Complete lessons in 10 languages', check: ({ state }) => completedLanguageCount(state) >= 10, category: 'mastery', tier: 'legendary' },

  // Special/secret badges
  { key: 'night-owl', name: 'Night Owl', icon: '🦉', description: 'Complete a lesson after midnight', check: ({ state }) => hasCompletionInHourRange(state, 0, 5), category: 'special', tier: 'silver' },
  { key: 'early-bird', name: 'Early Bird', icon: '🐦', description: 'Complete a lesson before 6 AM', check: ({ state }) => hasCompletionInHourRange(state, 4, 6), category: 'special', tier: 'silver' },
  { key: 'weekend-warrior', name: 'Weekend Warrior', icon: '⚔️', description: 'Complete lessons on both Saturday and Sunday in one weekend', check: ({ state }) => hasWeekendBothDays(state), category: 'special', tier: 'gold' },
  { key: 'speed-learner', name: 'Speed Learner', icon: '⚡', description: 'Complete 10 lessons in a single day', check: ({ state }) => maxLessonsInOneDay(state) >= 10, category: 'special', tier: 'platinum' },
  { key: 'marathon-learner', name: 'Marathon Learner', icon: '🏃', description: 'Complete 25 lessons in a single day', check: ({ state }) => maxLessonsInOneDay(state) >= 25, category: 'special', tier: 'diamond' },
  { key: 'perfectionist', name: 'Perfectionist', icon: '💎', description: 'Complete a project with 100% test coverage', check: () => false, category: 'special', tier: 'diamond' },
  { key: 'first-blood', name: 'First Blood', icon: '🩸', description: 'Be the first to complete a new lesson', check: () => false, category: 'special', tier: 'gold' },
  { key: 'helpful-hand', name: 'Helpful Hand', icon: '🤝', description: 'Have 10 comments marked as helpful', check: () => false, category: 'special', tier: 'gold' },
  { key: 'bug-hunter', name: 'Bug Hunter', icon: '🐛', description: 'Report 5 verified bugs', check: () => false, category: 'special', tier: 'gold' },
  { key: 'mentor', name: 'Mentor', icon: '🎓', description: 'Help 50 learners with answers', check: () => false, category: 'special', tier: 'platinum' },
  { key: 'full-stack-master', name: 'Full-Stack Master', icon: '🌈', description: 'Complete all tracks: Beginner, Developer, and all Specializations', check: ({ state }) => ALL_WEB_TRACKS.every((trackKey) => isTrackComplete(state, trackKey)), category: 'special', tier: 'legendary' },
  { key: 'community-pillar', name: 'Community Pillar', icon: '🏛️', description: 'Help 100+ learners through comments and upvotes', check: ({ contributions }) => contributions.comments >= 100 && contributions.upvotes >= 100, category: 'special', tier: 'legendary' },
  { key: 'early-adopter', name: 'Early Adopter', icon: '🚀', description: 'Joined during beta phase', check: ({ joinedAt }) => Boolean(joinedAt) && new Date(joinedAt as string).getTime() < new Date('2025-01-01T00:00:00Z').getTime(), category: 'special', tier: 'gold' },
  { key: 'contributor', name: 'Open Source Contributor', icon: '🔀', description: 'Contribute to the platform codebase', check: () => false, category: 'special', tier: 'platinum' },
  { key: 'content-creator', name: 'Content Creator', icon: '✍️', description: 'Create a lesson or resource used by 100+ learners', check: () => false, category: 'special', tier: 'platinum' },
]

export function getEarnedBadges(context: BadgeContext): BadgeDefinition[] {
  return badgeDefinitions.filter((badge) => badge.check(context))
}

export function sortBadgesByEarned(
  badges: BadgeDefinition[],
  earnedKeys: Set<string>
): BadgeDefinition[] {
  return [...badges].sort((a, b) => {
    const earnedA = earnedKeys.has(a.key) ? 0 : 1
    const earnedB = earnedKeys.has(b.key) ? 0 : 1
    if (earnedA !== earnedB) return earnedA - earnedB

    const tierA = tierOrder[a.tier]
    const tierB = tierOrder[b.tier]
    if (tierA !== tierB) return tierA - tierB

    return badges.indexOf(a) - badges.indexOf(b)
  })
}
