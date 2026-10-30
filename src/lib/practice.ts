import type { ResourceType } from './curriculum'

// ============================================================
// TYPES
// ============================================================

export type PracticeItem = Flashcard | CodeKata | MicroProject | InterviewDrill

export type PracticeMode = 'flashcard' | 'kata' | 'project' | 'interview'

export type PracticeCategory =
  | 'javascript'
  | 'react'
  | 'nodejs'
  | 'mongodb'
  | 'typescript'
  | 'testing'
  | 'security'
  | 'devops'
  | 'architecture'
  | 'first-client'

export interface BasePracticeItem {
  id: string
  title: string
  description: string
  category: PracticeCategory
  tags: string[]
  estimatedMinutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xpReward: number
  createdAt: string
}

export interface Flashcard extends BasePracticeItem {
  type: 'flashcard'
  question: string
  answer: string
  // Card specific
  cardType: 'concept' | 'code' | 'snippet' | 'formula'
}

export interface CodeKata extends BasePracticeItem {
  type: 'kata'
  prompt: string
  starterCode: string | null
  solution: string | null
  testCases: TestCase[]
  // Kata specific
  language: 'javascript' | 'typescript' | 'python' | 'bash'
  isDaily: boolean
}

export interface MicroProject extends BasePracticeItem {
  type: 'project'
  prompt: string
  requirements: string[]
  constraints: string[]
  starterRepo: string | null
  submissionUrl: string | null
  // Project specific
  stack: string[]
}

export interface InterviewDrill extends BasePracticeItem {
  type: 'interview'
  question: string
  // Drill specific
  drillType: 'behavioral' | 'technical' | 'system-design' | 'whiteboard'
  followUps: string[]
  answerGuide: string
  // For whiteboard/system design
  codeTemplate: string | null
}

interface TestCase {
  input: string
  expected: string
  description: string
}

// Progress types (synced with progress-state.ts)
export interface FlashcardProgress {
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: string
  lastReviewed: string | null
  lastGrade: number | null
}

export interface KataProgress {
  completed: boolean
  completedAt: string
  attempts: number
}

export interface ProjectProgress {
  completed: boolean
  completedAt: string
  submissionUrl?: string
}

export interface DrillProgress {
  completed: boolean
  completedAt: string
  notes?: string
}

export interface PracticeProgress {
  flashcards: Record<string, FlashcardProgress>
  katas: Record<string, KataProgress>
  projects: Record<string, ProjectProgress>
  drills: Record<string, DrillProgress>
  streak: {
    current: number
    lastActiveDate: string | null
    longest: number
  }
}

// ============================================================
// SRS ENGINE (SM-2 Algorithm)
// ============================================================

export function sm2(
  grade: number, // 0-3 scale (0=again, 1=hard, 2=good, 3=easy)
  card: FlashcardProgress
): { easeFactor: number; interval: number; repetitions: number; nextReview: string } {
  let { easeFactor, interval, repetitions } = card

  // SM-2 algorithm
  if (grade < 2) {
    // Failed — reset
    repetitions = 0
    interval = 1
  } else {
    repetitions += 1
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.ceil(interval * easeFactor)
    }
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (2.5 - grade) * (0.08 + (2.5 - grade) * 0.02)))

  // Calculate next review date
  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + interval)

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview: nextDate.toISOString(),
  }
}

// Initial SRS state for a new flashcard
export const initialFlashcardProgress: FlashcardProgress = {
  easeFactor: 2.5,
  interval: 1,
  repetitions: 0,
  nextReview: new Date().toISOString(),
  lastReviewed: null,
  lastGrade: null,
}

// ============================================================
// PRACTICE CATALOG (Static item definitions)
// ============================================================

function createFlashcards(): Flashcard[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'flash-js-promise-states',
      type: 'flashcard',
      title: 'Promise States',
      description: 'The three states of a JavaScript Promise',
      question: 'What are the three states of a JavaScript Promise?',
      answer: 'pending → fulfilled (resolved) or pending → rejected. Once a promise settles, it becomes immutable (either fulfilled or rejected).',
      category: 'javascript',
      tags: ['promises', 'async', 'fundamentals'],
      estimatedMinutes: 1,
      difficulty: 'beginner',
      xpReward: 5,
      createdAt: now,
      cardType: 'concept',
    },
    {
      id: 'flash-js-event-loop',
      type: 'flashcard',
      title: 'Event Loop Order',
      description: 'JavaScript event loop processing order',
      question: 'In what order does the JavaScript event loop process the macrotask queue, microtask queue, and rendering?',
      answer: '1. Macrotask (setTimeout, setInterval, I/O) → 2. Microtask queue drains (Promise.then, queueMicrotask) → 3. Render → 4. Repeat',
      category: 'javascript',
      tags: ['event-loop', 'async', 'advanced'],
      estimatedMinutes: 2,
      difficulty: 'advanced',
      xpReward: 10,
      createdAt: now,
      cardType: 'concept',
    },
    {
      id: 'flash-react-hooks-rules',
      type: 'flashcard',
      title: 'React Hooks Rules',
      description: 'The two rules of React Hooks',
      question: 'What are the two rules of React Hooks?',
      answer: '1. Only call hooks at the top level (not inside loops, conditions, or nested functions). 2. Only call hooks from React function components or custom hooks.',
      category: 'react',
      tags: ['react', 'hooks', 'fundamentals'],
      estimatedMinutes: 1,
      difficulty: 'beginner',
      xpReward: 5,
      createdAt: now,
      cardType: 'concept',
    },
    {
      id: 'flash-react-useeffect-deps',
      type: 'flashcard',
      title: 'useEffect Dependency Array',
      description: 'useEffect dependency array patterns',
      question: 'What happens with these useEffect patterns: `[]`, `[dep]`, no array?',
      answer: '[] → runs once on mount, cleanup on unmount. [dep] → runs on dep change. No array → runs on every render.',
      category: 'react',
      tags: ['react', 'hooks', 'useEffect'],
      estimatedMinutes: 1,
      difficulty: 'intermediate',
      xpReward: 5,
      createdAt: now,
      cardType: 'concept',
    },
    {
      id: 'flash-express-middleware',
      type: 'flashcard',
      title: 'Express Middleware Order',
      description: 'Express middleware mounting order for security',
      question: 'In what order should Express middleware be mounted?',
      answer: '1. Body parser/JSON → 2. CORS → 3. Rate limiter → 4. Helmet/security → 5. Auth routes → 6. API routes → 7. Error handler (last)',
      category: 'nodejs',
      tags: ['express', 'middleware', 'security'],
      estimatedMinutes: 1,
      difficulty: 'intermediate',
      xpReward: 5,
      createdAt: now,
      cardType: 'concept',
    },
  ]
}

function createKatas(): CodeKata[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'kata-js-reverse-words',
      type: 'kata',
      title: 'Reverse Words in a String',
      description: 'Reverse the order of words in a string handling edge cases',
      prompt: 'Write a function that reverses the order of words in a string. "the sky is blue" becomes "blue is sky the". Handle leading/trailing spaces and multiple spaces between words.',
      starterCode: 'function reverseWords(s) {\n  // Your code here\n}',
      solution: '// Trim, split by spaces, filter empty, reverse, join\nreturn s.trim().split(/\\s+/).reverse().join(" ");',
      testCases: [
        { input: '"the sky is blue"', expected: '"blue is sky the"', description: 'Basic case' },
        { input: '"  hello world  "', expected: '"world hello"', description: 'Leading/trailing spaces' },
        { input: '"a good    example"', expected: '"example good a"', description: 'Multiple spaces' },
      ],
      language: 'javascript',
      category: 'javascript',
      tags: ['strings', 'arrays', 'interview'],
      estimatedMinutes: 15,
      difficulty: 'beginner',
      xpReward: 15,
      isDaily: true,
      createdAt: now,
    },
    {
      id: 'kata-js-two-sum',
      type: 'kata',
      title: 'Two Sum (Hash Map)',
      description: 'Find two indices that sum to target using hash map for O(n)',
      prompt: 'Given an array of integers and a target sum, return indices of the two numbers that add up to the target. Use a hash map for O(n) solution.',
      starterCode: 'function twoSum(nums, target) {\n  // Your code here\n}',
      solution: 'const map = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const complement = target - nums[i];\n  if (map.has(complement)) return [map.get(complement), i];\n  map.set(nums[i], i);\n}\nreturn [];',
      testCases: [
        { input: '[2,7,11,15], 9', expected: '[0,1]', description: 'Basic case' },
        { input: '[3,2,4], 6', expected: '[1,2]', description: 'No self-pairing' },
        { input: '[3,3], 6', expected: '[0,1]', description: 'Duplicate values' },
      ],
      language: 'javascript',
      category: 'javascript',
      tags: ['arrays', 'hash-map', 'interview'],
      estimatedMinutes: 20,
      difficulty: 'intermediate',
      xpReward: 20,
      isDaily: true,
      createdAt: now,
    },
    {
      id: 'kata-react-usefetch',
      type: 'kata',
      title: 'Custom useFetch Hook',
      description: 'Build a custom useFetch hook with loading, error, and cleanup',
      prompt: 'Build a custom `useFetch` hook that handles loading, error, and data states. Use it in a component with proper cleanup on unmount.',
      starterCode: 'import { useState, useEffect } from "react";\n\nfunction useFetch(url) {\n  // Your code here\n}',
      solution: '// Hook with abort controller for cleanup\nconst [data, setData] = useState(null);\nconst [loading, setLoading] = useState(true);\nconst [error, setError] = useState(null);\n\nuseEffect(() => {\n  const controller = new AbortController();\n  setLoading(true);\n  fetch(url, { signal: controller.signal })\n    .then(res => res.json())\n    .then(data => { setData(data); setLoading(false); })\n    .catch(err => { if (err.name !== "AbortError") { setError(err); setLoading(false); } });\n  return () => controller.abort();\n}, [url]);\nreturn { data, loading, error };',
      testCases: [
        { input: 'API returns data', expected: 'data is populated, loading is false', description: 'Success state' },
        { input: 'API returns 404', expected: 'error is populated, loading is false', description: 'Error state' },
        { input: 'Component unmounts during fetch', expected: 'No state update or memory leak', description: 'Cleanup on unmount' },
      ],
      language: 'javascript',
      category: 'react',
      tags: ['hooks', 'fetch', 'cleanup'],
      estimatedMinutes: 30,
      difficulty: 'advanced',
      xpReward: 30,
      isDaily: false,
      createdAt: now,
    },
  ]
}

function createMicroProjects(): MicroProject[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'project-express-api',
      type: 'project',
      title: 'Express REST API with Validation',
      description: 'Build a REST API for a todo app with full CRUD, Zod validation, and error handling middleware',
      prompt: 'Build a REST API for a todo app with full CRUD, Zod validation, and error handling middleware.',
      requirements: [
        'Create Express server with routes: GET/POST /todos, GET/PUT/DELETE /todos/:id',
        'Use Zod for input validation (title: string, completed: boolean)',
        'Implement centralized error handling middleware',
        'Add request logging middleware',
        'Return proper HTTP status codes (200, 201, 400, 404, 500)',
      ],
      constraints: ['No external database — use in-memory array', 'No auth required', 'Must have 80%+ test coverage'],
      starterRepo: null,
      submissionUrl: null,
      category: 'nodejs',
      tags: ['express', 'api', 'validation', 'testing'],
      estimatedMinutes: 90,
      difficulty: 'intermediate',
      xpReward: 50,
      createdAt: now,
      stack: ['Node.js', 'Express', 'Zod', 'Vitest'],
    },
    {
      id: 'project-react-todo',
      type: 'project',
      title: 'React Todo with Context API',
      description: 'Build a todo app using Context API for state management',
      prompt: 'Build a todo app using Context API for state management (no Redux). Include add, toggle, delete, and filter (all/active/completed).',
      requirements: [
        'Create TodoContext with CRUD operations',
        'Components: TodoList, TodoItem, AddTodo, FilterBar',
        'Persist todos to localStorage',
        'Show count of active/completed todos',
        'Responsive design with Tailwind CSS',
      ],
      constraints: ['Must use Context API (not Redux)', 'No external UI libraries', 'SSR-safe localStorage access'],
      starterRepo: null,
      submissionUrl: null,
      category: 'react',
      tags: ['react', 'context', 'state-management', 'tailwind'],
      estimatedMinutes: 120,
      difficulty: 'intermediate',
      xpReward: 60,
      createdAt: now,
      stack: ['React 19', 'Context API', 'Tailwind CSS'],
    },
    {
      id: 'project-prisma-mongo',
      type: 'project',
      title: 'Prisma + MongoDB Blog API',
      description: 'Build a blog API with Prisma ORM connected to MongoDB',
      prompt: 'Build a blog API with Prisma ORM connected to MongoDB. Include posts, comments, and authors with proper relations.',
      requirements: [
        'Design Prisma schema: User, Post, Comment models with relations',
        'REST endpoints: /posts, /posts/:id, /comments',
        'Use Prisma Client for all DB operations',
        'Add pagination to posts list',
        'Include input validation with Zod',
      ],
      constraints: ['Must use Prisma Client (not raw MongoDB queries)', 'Must demonstrate relation queries', 'Use MongoDB Atlas (free tier)'],
      starterRepo: null,
      submissionUrl: null,
      category: 'mongodb',
      tags: ['prisma', 'mongodb', 'api', 'orm'],
      estimatedMinutes: 150,
      difficulty: 'advanced',
      xpReward: 75,
      createdAt: now,
      stack: ['Node.js', 'Express', 'Prisma', 'MongoDB', 'Zod'],
    },
  ]
}

function createInterviewDrills(): InterviewDrill[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'drill-behavioral-story',
      type: 'interview',
      title: 'Tell Me About a Time You Debugged a Difficult Bug',
      description: 'STAR format behavioral question about debugging under pressure',
      question: 'Tell me about a time you had to debug a production issue under pressure. What was your process?',
      drillType: 'behavioral',
      followUps: [
        'How did you identify the root cause?',
        'What would you do differently now?',
        'How did you communicate the issue to non-technical stakeholders?',
      ],
      answerGuide: 'Use STAR format: Situation, Task, Action, Result. Show process (reproduce → isolate → fix → verify), ownership, and communication.',
      category: 'first-client',
      tags: ['behavioral', 'debugging', 'communication'],
      estimatedMinutes: 10,
      difficulty: 'intermediate',
      xpReward: 10,
      codeTemplate: null,
      createdAt: now,
    },
    {
      id: 'drill-system-design-scalability',
      type: 'interview',
      title: 'Design a Rate Limiter',
      description: 'System design question for distributed rate limiting',
      question: 'Design a rate limiter for an API. How would you handle 10,000 requests/second across 100,000 users?',
      drillType: 'system-design',
      followUps: [
        'How does the token bucket algorithm work?',
        'How would you handle distributed rate limiting?',
        'What metrics would you track?',
      ],
      answerGuide: 'Discuss: token bucket vs leaky bucket, Redis for distributed rate limiting, sliding window logs, handling burst traffic, graceful degradation.',
      codeTemplate: '// Sketch the API interface\nclass RateLimiter {\n  // constructor, check method, etc.\n}',
      category: 'architecture',
      tags: ['system-design', 'rate-limiting', 'scalability'],
      estimatedMinutes: 20,
      difficulty: 'advanced',
      xpReward: 20,
      createdAt: now,
    },
    {
      id: 'drill-technical-express',
      type: 'interview',
      title: 'Express Error Handling',
      description: 'Technical question about centralized error handling in Express',
      question: 'How would you handle errors in an Express application? Write a centralized error handler.',
      drillType: 'technical',
      followUps: [
        'How do you handle async errors?',
        'What HTTP status codes map to what errors?',
        'How do you avoid leaking sensitive info?',
      ],
      answerGuide: 'Use error middleware (4 args: err, req, res, next). Wrap async routes in try/catch or use express-async-handler. Log errors, return controlled responses. Never expose stack traces in production.',
      codeTemplate: 'app.use((err, req, res, next) => {\n  // Your error handling here\n});',
      category: 'nodejs',
      tags: ['express', 'error-handling', 'middleware'],
      estimatedMinutes: 15,
      difficulty: 'intermediate',
      xpReward: 15,
      createdAt: now,
    },
    {
      id: 'drill-behavioral-client',
      type: 'interview',
      title: 'Handling Client Feedback',
      description: 'Behavioral question about handling unhappy clients professionally',
      question: 'Describe a time when a client was unhappy with your work. How did you handle it?',
      drillType: 'behavioral',
      followUps: [
        'What signals did you miss that could have prevented this?',
        'How did you turn it into a positive outcome?',
        'What process changes did you implement afterward?',
      ],
      answerGuide: 'Focus on: active listening, acknowledging concerns, proposing solutions not excuses, documenting changes, following up. Show empathy and professionalism.',
      category: 'first-client',
      tags: ['behavioral', 'client-communication', 'conflict-resolution'],
      estimatedMinutes: 10,
      difficulty: 'intermediate',
      xpReward: 10,
      codeTemplate: null,
      createdAt: now,
    },
  ]
}

// ============================================================
// CATALOG EXPORTS
// ============================================================

export const allFlashcards = createFlashcards()
export const allKatas = createKatas()
export const allMicroProjects = createMicroProjects()
export const allInterviewDrills = createInterviewDrills()

export const allPracticeItems: PracticeItem[] = [
  ...allFlashcards,
  ...allKatas,
  ...allMicroProjects,
  ...allInterviewDrills,
]

// Lookup helpers
export function getPracticeItem(id: string): PracticeItem | undefined {
  return allPracticeItems.find((item) => item.id === id)
}

export function getFlashcard(id: string): Flashcard | undefined {
  return allFlashcards.find((item) => item.id === id)
}

export function getKata(id: string): CodeKata | undefined {
  return allKatas.find((item) => item.id === id)
}

export function getMicroProject(id: string): MicroProject | undefined {
  return allMicroProjects.find((item) => item.id === id)
}

export function getInterviewDrill(id: string): InterviewDrill | undefined {
  return allInterviewDrills.find((item) => item.id === id)
}

export function getDailyKata(): CodeKata | undefined {
  if (allKatas.length === 0) return undefined
  const todayIndex = Math.floor(Date.now() / 86400000) % allKatas.length
  return allKatas[todayIndex]
}

export function getDueFlashcards(progress: PracticeProgress): Flashcard[] {
  const now = new Date().toISOString()
  return allFlashcards.filter((card) => {
    const prog = progress.flashcards[card.id]
    if (!prog) return true // New cards are due
    return prog.nextReview <= now
  })
}

export function getPracticeItemsByCategory(category: PracticeCategory): PracticeItem[] {
  return allPracticeItems.filter((item) => item.category === category)
}

export function getPracticeItemsByType(type: PracticeMode): PracticeItem[] {
  return allPracticeItems.filter((item) => item.type === type)
}

export function getAllFlashcardsByCategory(category: PracticeCategory): Flashcard[] {
  return allFlashcards.filter((item) => item.category === category)
}

export function getAllKatas(): CodeKata[] {
  return allKatas
}

export function getAllMicroProjects(): MicroProject[] {
  return allMicroProjects
}

export function getAllInterviewDrills(): InterviewDrill[] {
  return allInterviewDrills
}

