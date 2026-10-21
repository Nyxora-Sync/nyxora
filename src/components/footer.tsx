import Link from 'next/link'
import Image from 'next/image'
import { Mail, ExternalLink, Cpu, Smartphone, Brain, Cloud, Gamepad2, Monitor, Code2, Globe, ArrowRight } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { NewsletterForm } from '@/components/newsletter-form'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'
import { trackCategories } from '@/lib/curriculum'
import { cn } from '@/lib/utils'

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'web-development': Globe,
  'programming-languages': Code2,
  'embedded-systems': Cpu,
  'mobile-development': Smartphone,
  'data-science': Brain,
  'devops-cloud': Cloud,
  'game-development': Gamepad2,
  'desktop-apps': Monitor,
}

// Footer shows only top 4 categories + link to all categories
const footerCategories = trackCategories.filter((cat) => cat.order <= 4)

const platformLinks = [
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Accessibility', href: '/accessibility' },
  { name: 'Open Source', href: 'https://github.com/Nyxora-Sync/nyxora-sync', external: true },
]

const communityLinks = [
  { name: 'Lesson Discussions', href: '/community' },
  { name: 'Project Showcase', href: '/community/showcase' },
  { name: 'GitHub Issues', href: 'https://github.com/Nyxora-Sync/nyxora-sync/issues', external: true },
  { name: 'Contribute', href: '/contribute' },
  { name: 'Code of Conduct', href: '/code-of-conduct' },
]

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/Nyxora-Sync/nyxora-sync', external: true },
  { name: 'Contact', href: '/contact', external: false },
]

export function Footer() {
  const visibleCategories = trackCategories.filter((cat) => cat.order <= 4) // Show first 4 in footer

  return (
    <footer data-site-footer data-print-hide className="border-t border-border/50 bg-muted/30" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block" aria-label="Nyxora Sync Home">
              <Image
                src="/site-logo.jpg"
                alt=""
                width={480}
                height={240}
                sizes="(min-width: 640px) 240px, 224px"
                className="h-auto w-56 rounded-xl sm:w-60"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Free learning paths for developers. Web, languages, embedded, and more — from beginner to mastery.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  {social.name === 'GitHub' && (
                    <GithubIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Learning Categories */}
          <nav aria-label="Learning Categories">
            <h3 className="font-semibold">Categories</h3>
            <ul className="mt-4 space-y-3">
              {footerCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {(() => {
                      const Icon = categoryIcons[category.id];
                      return <Icon className="h-4 w-4" aria-hidden="true" />;
                    })()}
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  View all categories
                </Link>
              </li>
            </ul>
          </nav>

          {/* Web Development Tracks */}
          <nav aria-label="Web Development">
            <h3 className="font-semibold">Web Development</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/learn/beginner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Beginner Track</Link></li>
              <li><Link href="/learn/developer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Developer Track</Link></li>
              <li><Link href="/learn/specializations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Specializations</Link></li>
              <li><Link href="/learn/languages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Language Paths</Link></li>
              <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Lessons</Link></li>
              <li><Link href="/roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Full Roadmap</Link></li>
            </ul>
          </nav>

          {/* Platform */}
          <nav aria-label="Platform">
            <h3 className="font-semibold">Platform</h3>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.external && <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Community */}
          <nav aria-label="Community">
            <h3 className="font-semibold">Community</h3>
            <ul className="mt-4 space-y-3">
              {communityLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.external && <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Content licensed under{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              CC BY-SA 4.0
            </a>{' '}
            • Code under{' '}
            <a href="https://github.com/Nyxora-Sync/nyxora-sync/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              MIT License
            </a>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Built with Next.js, React, and TypeScript. Deployed on Vercel.
          </p>
        </div>
      </div>
    </footer>
  )
}