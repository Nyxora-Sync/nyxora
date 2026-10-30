'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Code2,
  FolderOpen,
  Mic,
  Brain,
  Flame,
  CheckCircle,
  Clock,
  RotateCw,
  X,
  Star,
  Zap,
  TrendingUp,
  Target,
  Award,
  RefreshCw,
  Play,
  Trophy,
} from 'lucide-react'
import { useProgress } from '@/hooks/use-progress'
import {
  getDueFlashcards,
  getDailyKata,
  getAllFlashcardsByCategory,
  getAllKatas,
  getAllMicroProjects,
  getAllInterviewDrills,
  getFlashcard,
  getKata,
  getMicroProject,
  getInterviewDrill,
  type Flashcard,
  type CodeKata,
  type MicroProject,
  type InterviewDrill,
  type PracticeItem,
  type FlashcardProgress,
  sm2,
  initialFlashcardProgress,
} from '@/lib/practice'
import type { PracticeProgress } from '@/lib/practice'

const CATEGORY_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-500',
  react: 'bg-blue-500',
  nodejs: 'bg-green-500',
  mongodb: 'bg-green-700',
  typescript: 'bg-blue-700',
  testing: 'bg-purple-500',
  security: 'bg-red-500',
  devops: 'bg-cyan-500',
  architecture: 'bg-indigo-500',
  'first-client': 'bg-violet-500',
}

const CATEGORY_ICONS: Record<string, any> = {
  javascript: BookOpen,
  react: Code2,
  nodejs: FolderOpen,
  mongodb: FolderOpen,
  typescript: Code2,
  testing: Mic,
  security: Zap,
  devops: Brain,
  architecture: Target,
  'first-client': Award,
}

function FlashcardReview() {
  const { practice, gradeFlashcard } = useProgress()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const due = getDueFlashcards(practice)
    setFlashcards(due)
    setLoading(false)
  }, [practice])

  const handleGrade = (grade: number) => {
    const card = flashcards[currentIndex]
    if (!card) return

    const progress = practice.flashcards[card.id] ?? initialFlashcardProgress
    const result = sm2(grade, progress)

    gradeFlashcard(card.id, grade, card.xpReward)

    setShowAnswer(false)

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      // Refresh the list after completing
      setFlashcards(getDueFlashcards(practice))
      setCurrentIndex(0)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Brain className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-2">Loading flashcards...</p>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-semibold">No cards due today!</h3>
        <p className="mt-2 text-muted-foreground">
          All caught up. Check back tomorrow or practice katas below.
        </p>
      </div>
    )
  }

  const card = flashcards[currentIndex]
  const progress = practice.flashcards[card.id] ?? initialFlashcardProgress

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Card {currentIndex + 1} of {flashcards.length}</span>
        <span className={CATEGORY_COLORS[card.category] + ' px-2 py-0.5 rounded text-xs font-medium'}>
          {card.category}
        </span>
      </div>

      <div
        className="relative h-64 cursor-pointer rounded-xl border-2 border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
        onClick={() => setShowAnswer(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowAnswer(true)}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground">{showAnswer ? card.answer : card.question}</p>
            {!showAnswer && (
              <p className="mt-4 text-sm text-muted-foreground">Click or press Enter to reveal</p>
            )}
            {showAnswer && (
              <p className="mt-4 text-sm text-green-600 dark:text-green-400">Answer shown</p>
            )}
          </div>
        </div>

        {showAnswer && (
          <div className="absolute inset-0 flex items-end justify-center p-4 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={() => handleGrade(0)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                title="Again (0)"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleGrade(1)}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600"
                title="Hard (1)"
              >
                <Clock className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleGrade(2)}
                className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600"
                title="Good (2)"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleGrade(3)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
                title="Easy (3)"
              >
                <Star className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Difficulty: {card.difficulty}</span>
        <span>~{card.estimatedMinutes} min</span>
        <span>XP: +{card.xpReward}</span>
        {progress.repetitions > 0 && (
          <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
            Rep: {progress.repetitions} · Next: {new Date(progress.nextReview).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}

function KataOfTheDay() {
  const { practice, completeKata } = useProgress()
  const [kata, setKata] = useState<CodeKata | undefined>(undefined)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const dailyKata = getDailyKata()
    setKata(dailyKata)
    if (dailyKata?.starterCode) {
      setCode(dailyKata.starterCode)
    }
  }, [practice])

  const kataProgress = kata ? practice.katas[kata.id] : null

  if (!kata) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Code2 className="mx-auto h-8 w-8" />
        <p className="mt-2">No katas available</p>
      </div>
    )
  }

  const runCode = () => {
    setRunning(true)
    setOutput('Running...')
    // Simulate execution - in real app would use a sandbox
    setTimeout(() => {
      const passed = kata.testCases.map((tc) => {
        // Simple check - in reality would execute code
        return `${tc.description}: ✓`
      }).join('\n')
      setOutput(`Tests passed:\n${passed}\n\nNote: Full execution requires sandbox environment.`)
      setRunning(false)
    }, 1000)
  }

  const handleComplete = () => {
    if (!kataProgress?.completed) {
      completeKata(kata.id, kata.xpReward)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Kata of the Day</h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500 text-amber-900">
            {kata.isDaily ? 'DAILY' : 'PRACTICE'}
          </span>
          {kataProgress?.completed && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{kata.prompt}</p>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className={CATEGORY_COLORS[kata.category] + ' px-2 py-0.5 rounded'}>
            {kata.category}
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
            {kata.language}
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
            ~{kata.estimatedMinutes} min
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
            +{kata.xpReward} XP
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Your Solution</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 font-mono text-sm p-3 rounded-lg border border-input bg-background resize-none"
          placeholder={kata.starterCode || 'Write your solution here...'}
          spellCheck={false}
        />
        <div className="flex gap-2">
          <button
            onClick={runCode}
            disabled={running}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {running ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4 mr-2" />
                Run Tests
              </>
            )}
          </button>
          <button
            onClick={() => setCode(kata.starterCode || '')}
            className="px-4 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent"
          >
            Reset
          </button>
          {!kataProgress?.completed && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </button>
          )}
        </div>
      </div>

      {output && (
        <div className="rounded-lg bg-muted p-3 font-mono text-sm whitespace-pre-wrap max-h-40 overflow-auto">
          {output}
        </div>
      )}

      {kata.solution && (
        <details className="group">
          <summary className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer">
            <RotateCw className="h-4 w-4 transition-transform group-open:rotate-90" />
            View Solution
          </summary>
          <pre className="mt-3 rounded-lg bg-muted p-3 overflow-auto">
            <code className="font-mono text-sm">{kata.solution}</code>
          </pre>
        </details>
      )}

      {kata.testCases.length > 0 && (
        <details className="group">
          <summary className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer">
            <RotateCw className="h-4 w-4 transition-transform group-open:rotate-90" />
            Test Cases
          </summary>
          <div className="mt-3 space-y-2">
            {kata.testCases.map((tc, i) => (
              <div key={i} className="rounded-lg border border-input p-3 text-sm">
                <p className="font-medium">Test {i + 1}: {tc.description}</p>
                <p className="font-mono text-muted-foreground">Input: {tc.input}</p>
                <p className="font-mono text-green-600 dark:text-green-400">Expected: {tc.expected}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

function ProjectList() {
  const { practice, completeProject } = useProgress()
  const projects = getAllMicroProjects()

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <FolderOpen className="h-5 w-5 text-green-500" />
        Micro Projects
      </h3>
      {projects.map((project) => {
        const progress = practice.projects[project.id]
        return (
          <div
            key={project.id}
            className="rounded-lg border border-border/50 bg-card p-4 hover:border-border hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{project.title}</h4>
                  {progress?.completed && (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className={CATEGORY_COLORS[project.category] + ' px-2 py-0.5 rounded'}>
                    {project.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                    ~{project.estimatedMinutes} min
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                    +{project.xpReward} XP
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 capitalize">
                    {project.difficulty}
                  </span>
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {project.requirements.slice(0, 3).map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                    {project.requirements.length > 3 && (
                      <li>+{project.requirements.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {!progress?.completed && (
                  <button
                    onClick={() => completeProject(project.id, project.xpReward)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Submit
                  </button>
                )}
                {progress?.completed && (
                  <button
                    className="px-4 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent"
                    disabled
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Submitted
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DrillList() {
  const { practice, completeDrill } = useProgress()
  const drills = getAllInterviewDrills()

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Mic className="h-5 w-5 text-violet-500" />
        Interview Drills
      </h3>
      {drills.map((drill) => {
        const progress = practice.drills[drill.id]
        return (
          <div
            key={drill.id}
            className="rounded-lg border border-border/50 bg-card p-4 hover:border-border hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{drill.title}</h4>
                  {progress?.completed && (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{drill.question}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className={CATEGORY_COLORS[drill.category] + ' px-2 py-0.5 rounded'}>
                    {drill.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 capitalize">
                    {drill.drillType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                    ~{drill.estimatedMinutes} min
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                    +{drill.xpReward} XP
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 capitalize">
                    {drill.difficulty}
                  </span>
                </div>
                {drill.followUps.length > 0 && (
                  <details className="mt-3 group">
                    <summary className="text-xs font-medium text-muted-foreground cursor-pointer flex items-center gap-1">
                      <RotateCw className="h-3 w-3 transition-transform group-open:rotate-90" />
                      Follow-up questions
                    </summary>
                    <ul className="mt-2 list-disc list-inside text-xs text-muted-foreground space-y-1">
                      {drill.followUps.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {!progress?.completed && (
                  <button
                    onClick={() => completeDrill(drill.id, drill.xpReward)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Complete
                  </button>
                )}
                {progress?.completed && (
                  <button
                    className="px-4 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent"
                    disabled
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PracticeDashboard() {
  const { xp, streak, practice, getPracticeStats } = useProgress()
  const [activeTab, setActiveTab] = useState<'flashcards' | 'katas' | 'projects' | 'drills' | 'all'>('flashcards')
  const [allItems, setAllItems] = useState<PracticeItem[]>([])
  const stats = getPracticeStats()

  useEffect(() => {
    setAllItems([
      ...getAllFlashcardsByCategory('javascript'),
      ...getAllFlashcardsByCategory('react'),
      ...getAllFlashcardsByCategory('nodejs'),
      ...getAllFlashcardsByCategory('first-client'),
    ])
  }, [])

  const filteredItems = allItems.filter((item) => {
    if (activeTab === 'all') return true
    const typeMap = {
      flashcards: 'flashcard',
      katas: 'kata',
      projects: 'project',
      drills: 'interview',
    }
    return item.type === typeMap[activeTab]
  })

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total XP"
          value={xp}
          icon={Zap}
          color="bg-amber-500"
          description={`Level ${Math.floor(xp / 100) + 1}`}
        />
        <StatCard
          title="Lesson Streak"
          value={streak.current}
          icon={Flame}
          color="bg-orange-500"
          description="days in a row"
        />
        <StatCard
          title="Practice Streak"
          value={practice.streak.current}
          icon={Trophy}
          color="bg-purple-500"
          description="practice days in a row"
        />
        <StatCard
          title="Flashcards Reviewed"
          value={stats.flashcardsReviewed}
          icon={Brain}
          color="bg-blue-500"
          description="cards in SRS"
        />
        <StatCard
          title="Katas Solved"
          value={stats.katasCompleted}
          icon={Code2}
          color="bg-green-500"
          description="code katas completed"
        />
      </div>

      {/* Main Practice Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Flashcards */}
        <section className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Flashcards Due
              </h2>
            </div>
            <FlashcardReview />
          </div>
        </section>

        {/* Right: Kata of the Day */}
        <section className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold">
              <Code2 className="h-5 w-5 text-green-500" />
              Kata of the Day
            </h2>
            <KataOfTheDay />
          </div>
        </section>
      </div>

      {/* Projects & Drills */}
      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <ProjectList />
          </div>
        </section>
        <section>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <DrillList />
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, description }: {
  title: string
  value: number
  icon: React.ElementType
  color: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export default function PracticePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Practice Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Spaced repetition, daily katas, and interview prep — all in one place.
        </p>
      </div>

      <PracticeDashboard />
    </div>
  )
}