import Link from 'next/link'
import { Mail, Heart, Code2 } from 'lucide-react'
import { GithubIcon, XIcon, DiscordIcon } from '@/components/icons/brand'
import { cn } from '@/lib/utils'

interface FooterLink {
  name: string
  href: string
  external?: boolean
  icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
}

interface FooterColumn {
  learn: FooterLink[]
  community: FooterLink[]
  platform: FooterLink[]
  connect: FooterLink[]
}

const footerLinks: FooterColumn = {
  learn: [
    { name: 'Beginner Track', href: '/learn/beginner' },
    { name: 'Developer Track', href: '/learn/developer' },
    { name: 'All Modules', href: '/learn/modules' },
    { name: 'Resources', href: '/resources' },
    { name: 'Roadmap', href: '/roadmap' },
  ],
  community: [
    { name: 'Discord', href: 'https://discord.gg/mern-learn', external: true, icon: DiscordIcon },
    { name: 'GitHub Discussions', href: 'https://github.com/mern-learn/mern-learn/discussions', external: true, icon: GithubIcon },
    { name: 'Project Showcase', href: '/community/showcase' },
    { name: 'Contribute', href: '/contribute' },
    { name: 'Code of Conduct', href: '/code-of-conduct' },
  ],
  platform: [
    { name: 'About', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Open Source', href: 'https://github.com/mern-learn/mern-learn', external: true, icon: GithubIcon },
  ],
  connect: [
    { name: 'Newsletter', href: '/newsletter', icon: Mail },
    { name: 'Twitter', href: 'https://twitter.com/mernlearn', external: true, icon: XIcon },
    { name: 'GitHub', href: 'https://github.com/mern-learn', external: true, icon: GithubIcon },
    { name: 'Discord', href: 'https://discord.gg/mern-learn', external: true, icon: DiscordIcon },
    { name: 'Contact', href: '/contact', icon: Mail },
  ],
}

const socialLinks: FooterLink[] = [
  { name: 'GitHub', href: 'https://github.com/mern-learn', icon: GithubIcon },
  { name: 'Twitter', href: 'https://twitter.com/mernlearn', icon: XIcon },
  { name: 'Discord', href: 'https://discord.gg/mern-learn', icon: DiscordIcon },
  { name: 'Email', href: 'mailto:hello@mern-learn.dev', icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="MERN Learn Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600">
                <Code2 className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl font-sans">MERN Learn</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Learn the MERN stack (MongoDB, Express, React, Node.js) from beginner to mastery.
              Curated free resources, interactive playgrounds, progress tracking, and community.
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
                  {social.icon && <social.icon className="h-5 w-5" aria-hidden="true" />}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Learn">
            <h3 className="font-semibold">Learn</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Community">
            <h3 className="font-semibold">Community</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.icon && <link.icon className="h-3.5 w-3.5" aria-hidden="true" />}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Platform">
            <h3 className="font-semibold">Platform</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.icon && <link.icon className="h-3.5 w-3.5" aria-hidden="true" />}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get new lessons, resources, and community updates delivered to your inbox.
            </p>
            <form className="mt-4 flex gap-2" action="/newsletter" method="POST">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                required
              />
              <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              No spam. Unsubscribe anytime.{' '}
              <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with{' '}
            <span className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>{' '}
            by the MERN Learn Community
          </p>
          <p className="text-sm text-muted-foreground">
            Content licensed under{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              CC BY-SA 4.0
            </a>{' '}
            • Code under{' '}
            <a href="https://github.com/mern-learn/mern-learn/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              MIT License
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}