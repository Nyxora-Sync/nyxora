'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { Menu, X, Sun, Moon, User, LogOut, BookOpen, Trophy, Users, Code2, Rocket, Search, Layers, ChevronDown, CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NotificationBell } from '@/components/notification-bell'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { trackCategories } from '@/lib/curriculum'
import { Globe, Code2 as Code2Icon, Cpu, Smartphone, Brain, Cloud, Gamepad2, Monitor } from 'lucide-react'

const categoryIcons: Record<string, typeof Globe> = {
  'web-development': Globe,
  'programming-languages': Code2Icon,
  'embedded-systems': Cpu,
  'mobile-development': Smartphone,
  'data-science': Brain,
  'devops-cloud': Cloud,
  'game-development': Gamepad2,
  'desktop-apps': Monitor,
}

const navigation = [
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Categories', href: '/categories', icon: Layers },
  { name: 'Progress', href: '/dashboard', icon: Trophy, auth: true },
  { name: 'Showcase', href: '/community/showcase', icon: Rocket },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Playground', href: '/playground', icon: Code2 },
]

export function Header() {
  const { data: session, status } = useSession()
  const { setTheme } = useTheme()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.2 })

  // next-themes owns the class on <html>; mirror it so the toggle exposes an
  // accurate pressed state for assistive technology.
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const activeNavigationHref = navigation
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <header
      data-site-header
      data-print-hide
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Nyxora Sync Home">
            <Image
              src="/site-mark.webp"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
              priority
            />
            <span className="whitespace-nowrap font-bold text-xl font-sans">Nyxora Sync</span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {navigation.map((item) => {
              // Categories gets a dropdown menu
              if (item.name === 'Categories') {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          `relative flex items-center gap-1.5 text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:content-[''] hover:text-primary hover:after:scale-x-100`,
                          session || !item.auth ? 'text-foreground' : 'text-muted-foreground'
                        )}
                        aria-current={activeNavigationHref === item.href ? 'page' : undefined}
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {item.name}
                        <ChevronDown className="h-3.5 w-3.5 ml-0.5" aria-hidden="true" />
                      </Link>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72" align="start" forceMount>
                      <DropdownMenuLabel className="font-semibold">Browse by Category</DropdownMenuLabel>
                      {trackCategories
                        .filter((cat) => cat.order <= 8)
                        .map((cat) => {
                          const Icon = categoryIcons[cat.id];
                          return (
                            <DropdownMenuItem key={cat.id} asChild>
                              <Link
                                href={`/categories/${cat.id}`}
                                className="flex items-center gap-2"
                              >
                                <Icon className="h-4 w-4" aria-hidden="true" />
                                {cat.name}
                              </Link>
                            </DropdownMenuItem>
                          )
                        })}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/categories" className="flex items-center gap-2 font-medium">
                          <Layers className="h-4 w-4" aria-hidden="true" />
                          View All Categories
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    `relative flex items-center gap-1.5 text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:content-[''] hover:text-primary hover:after:scale-x-100`,
                    session || !item.auth ? 'text-foreground' : 'text-muted-foreground'
                  )}
                  aria-current={activeNavigationHref === item.href ? 'page' : undefined}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/search" aria-label="Search the site">
                    <Search className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                Search the site
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  aria-label="Dark mode"
                  aria-pressed={isDark}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                Toggle dark mode
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <NotificationBell />

          {status === 'loading' ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" aria-hidden="true" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/community/people/${session.user.id}`}
                    className="flex items-center gap-2"
                  >
                    <CircleUser className="h-4 w-4" aria-hidden="true" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                    My Progress
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <User className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signin?callbackUrl=/learn">Get Started</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="overflow-hidden border-t border-border/50 lg:hidden"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-4">
              <Link
                href="/search"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                Search the site
              </Link>
              {navigation.map((item) => {
                // In mobile, Categories just links to /categories page
                if (item.name === 'Categories') {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-accent',
                        session || !item.auth ? 'text-foreground' : 'text-muted-foreground'
                      )}
                      aria-current={activeNavigationHref === item.href ? 'page' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  )
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-accent',
                      session || !item.auth ? 'text-foreground' : 'text-muted-foreground'
                    )}
                    aria-current={activeNavigationHref === item.href ? 'page' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                )
              })}
              {!session && (
                <div className="flex w-full flex-col gap-2 pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signin?callbackUrl=/learn" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
    </header>
  )
}