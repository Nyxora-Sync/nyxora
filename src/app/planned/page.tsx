import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, BookOpen, Construction, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn, getAccent } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Planned & Future Tracks',
  description: 'See what\'s coming next on Nyxora Sync. These tracks are planned but not yet ready for learners.',
  path: '/planned',
  noIndex: true,
})

interface PlannedTrack {
  key: string
  name: string
  description: string
  category: string
  color: string
  estimatedLessons: number
  estimatedHours: number
  status: 'planned' | 'in-progress' | 'needs-contributors'
  modules: { name: string; description: string }[]
  notes?: string
}

const plannedTracks: PlannedTrack[] = [
  {
    key: 'embedded',
    name: 'Embedded Systems & IoT',
    description: 'Program microcontrollers, build IoT devices, and control hardware with code.',
    category: 'embedded-systems',
    color: 'amber',
    estimatedLessons: 40,
    estimatedHours: 120,
    status: 'planned',
    modules: [
      { name: 'Arduino Fundamentals', description: 'GPIO, PWM, I2C/SPI, interrupts, and libraries' },
      { name: 'ESP32 WiFi & Bluetooth', description: 'Web servers, BLE, MQTT, OTA updates' },
      { name: 'Sensors & Actuators', description: 'Temperature, distance, motors, displays' },
      { name: 'RTOS & FreeRTOS', description: 'Tasks, queues, semaphores, timing' },
      { name: 'IoT Cloud Integration', description: 'AWS IoT, Azure, MQTT brokers' },
      { name: 'PCB Design Basics', description: 'KiCad, schematics, layout, manufacturing' },
    ],
    notes: 'Requires hardware (Arduino/ESP32) or simulator (Wokwi). Content not yet written.',
  },
  {
    key: 'mobile-development',
    name: 'Mobile Development (Cross-Platform)',
    description: 'Build native and cross-platform apps for iOS and Android.',
    category: 'mobile-development',
    color: 'violet',
    estimatedLessons: 30,
    estimatedHours: 90,
    status: 'planned',
    modules: [
      { name: 'Expo & React Native Basics', description: 'Setup, navigation, core components' },
      { name: 'Native Modules & Device APIs', description: 'Camera, location, push notifications' },
      { name: 'Offline-First & Sync', description: 'Local storage, background sync, conflict resolution' },
      { name: 'Store Deployment', description: 'App Store, Play Store, EAS Build' },
    ],
    notes: 'React Native specialization track exists but is incomplete.',
  },
  {
    key: 'data-science',
    name: 'Data Science & AI',
    description: 'Analyze data, build ML models, and create intelligent applications.',
    category: 'data-science',
    color: 'rose',
    estimatedLessons: 35,
    estimatedHours: 100,
    status: 'planned',
    modules: [
      { name: 'Python for Data', description: 'NumPy, Pandas, visualization' },
      { name: 'Machine Learning Fundamentals', description: 'scikit-learn, model evaluation, pipelines' },
      { name: 'Deep Learning Intro', description: 'PyTorch, neural networks, CNNs, RNNs' },
      { name: 'LLMs & RAG', description: 'Embeddings, vector databases, retrieval-augmented generation' },
      { name: 'MLOps Basics', description: 'Model serving, monitoring, drift detection' },
    ],
    notes: 'Python track exists; this extends it toward ML engineering.',
  },
  {
    key: 'game-development',
    name: 'Game Development',
    description: 'Create 2D and 3D games with modern engines and frameworks.',
    category: 'game-development',
    color: 'orange',
    estimatedLessons: 25,
    estimatedHours: 80,
    status: 'planned',
    modules: [
      { name: 'Game Dev Fundamentals', description: 'Loops, input, rendering, physics basics' },
      { name: '2D with Phaser/Godot', description: 'Sprites, tilemaps, collisions, scenes' },
      { name: '3D with Three.js/Godot', description: 'Meshes, lighting, cameras, animation' },
      { name: 'Multiplayer & Networking', description: 'WebRTC, WebSockets, authoritative servers' },
    ],
    notes: 'No content yet. Seeking contributors with game dev experience.',
  },
  {
    key: 'desktop-apps',
    name: 'Desktop Applications',
    description: 'Build cross-platform desktop apps with native performance.',
    category: 'desktop-apps',
    color: 'slate',
    estimatedLessons: 20,
    estimatedHours: 60,
    status: 'planned',
    modules: [
      { name: 'Tauri & Rust Basics', description: 'Rust fundamentals for web devs' },
      { name: 'Tauri App Architecture', description: 'Commands, events, window management' },
      { name: 'System Integration', description: 'Tray, notifications, auto-updates, file associations' },
      { name: 'Distribution & Signing', description: 'MSIX, DMG, AppImage, code signing' },
    ],
    notes: 'Requires Rust knowledge. Could follow C/C++ tracks.',
  },
]

const advancedLanguageModules = [
  {
    track: 'c',
    name: 'C Advanced Modules (Modules 4-8)',
    description: 'Linux kernel internals, custom allocators, VFS, eBPF, kernel modules, device drivers.',
    color: 'blue',
    status: 'advanced' as const,
    note: 'These modules go far beyond job-ready C. They target OS developers and kernel engineers. Keep in repo but hidden from main navigation.',
  },
  {
    track: 'cpp',
    name: 'C++ Advanced Modules',
    description: 'Template metaprogramming, SIMD, coroutines, custom allocators, lock-free programming.',
    color: 'blue',
    status: 'advanced' as const,
    note: 'Expert-level content. Not required for general C++ proficiency.',
  },
  {
    track: 'csharp',
    name: 'C# Advanced Modules',
    description: 'Orleans/Actors, Source Generators, Native AOT, advanced ASP.NET Core internals.',
    color: 'blue',
    status: 'advanced' as const,
    note: 'Specialized topics for senior .NET engineers.',
  },
  {
    track: 'python',
    name: 'Python Advanced Modules',
    description: 'CPython internals, C extensions, async internals, performance optimization.',
    color: 'blue',
    status: 'advanced' as const,
    note: 'Deep internals track. Not needed for application development.',
  },
]

function StatusBadge({ status, color = 'blue' }: { status: string; color?: string }) {
  const variants: Record<string, string> = {
    planned: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'needs-contributors': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    advanced: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[status] ?? variants.planned)}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  )
}

export default function PlannedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/50 px-4 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 mb-6">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span>Planned & Advanced Content</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              What{' '}
              <span className="bg-gradient-to-r from-amber-500 via-violet-500 to-rose-500 bg-clip-text text-transparent">
                Comes Next
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Nyxora Sync is built in the open. These tracks are either planned for the future,
              marked as advanced/experimental, or waiting for contributors. They are <strong>not ready for learners yet</strong>.
            </p>
          </div>
        </section>

        {/* Planned Tracks */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Planned Tracks</h2>
                <p className="mt-2 text-muted-foreground">
                  Full learning paths with written lessons, projects, and progress tracking — coming when ready.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plannedTracks.map((track) => (
                <Card key={track.key} className="relative overflow-hidden border-border/50">
                  <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', getAccent(track.color).gradient)} />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', getAccent(track.color).icon)}>
                          <BookOpen className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{track.name}</CardTitle>
                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {track.category.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={track.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                    <ul className="space-y-2" role="list">
                      {track.modules.map((module, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-current" />
                          <span>{module.name}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        ~{track.estimatedLessons} lessons
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        ~{track.estimatedHours} hours
                      </span>
                    </div>
                    {track.notes && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                        <Construction className="inline h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                        {track.notes}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="border-t-0 pt-0">
                    <Button variant="outline" disabled className="w-full justify-between opacity-50 cursor-not-allowed">
                      Not Available Yet
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced / Experimental Modules */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Advanced / Experimental Modules</h2>
                <p className="mt-2 text-muted-foreground">
                  These modules exist in the codebase but are hidden from main navigation. They target specialists,
                  not job-seeking learners. We keep them for reference and potential future expansion.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {advancedLanguageModules.map((mod) => (
                <Card key={mod.track} className="relative overflow-hidden border-border/50">
                  <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', getAccent(mod.color).gradient)} />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{mod.name}</CardTitle>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {mod.track.toUpperCase()} Track
                        </p>
                      </div>
                      <StatusBadge status="advanced" color={mod.color} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                    <p className="text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
                      <Construction className="inline h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                      {mod.note}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t-0 pt-0">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/learn/${mod.track}`} className="flex items-center gap-1.5">
                        View {mod.track.toUpperCase()} Track
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Contribute */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-amber-500/10 border-border/50">
              <CardContent className="relative py-12 sm:py-16 text-center">
                <div className="mx-auto max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Want to Help Build These?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Every track on Nyxora Sync started as a plan. If you have expertise in any of these areas,
                    your contributions — lessons, resources, reviews, or even just feedback — make them real.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/contribute">
                        Read Contribution Guide
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="https://github.com/Nyxora-Sync/nyxora-sync/issues/new/choose" target="_blank" rel="noopener noreferrer">
                        Suggest a Track or Lesson
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
            <p>
              Time estimates and lesson counts are rough projections. Actual scope may change.
              <br />
              <strong>No dates are committed.</strong> Tracks ship when they meet our quality bar:
              written lessons, working projects, verified resources, and peer review.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}