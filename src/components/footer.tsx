import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { NewsletterForm } from '@/components/newsletter-form'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'
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
    { name: 'Specializations', href: '/learn/specializations' },
    { name: 'All Language Paths', href: '/learn/languages' },
    { name: 'C', href: '/learn/c' },
    { name: 'C++', href: '/learn/cpp' },
    { name: 'C#', href: '/learn/csharp' },
    { name: 'Python', href: '/learn/python' },
    { name: 'All Lessons', href: '/learn' },
    { name: 'Resources', href: '/resources' },
    { name: 'Roadmap', href: '/roadmap' },
  ],
  community: [
    { name: 'Lesson Discussions', href: '/community' },
    { name: 'GitHub Issues', href: 'https://github.com/Nyxora-Sync/nyxora-sync/issues', external: true, icon: GithubIcon },
    { name: 'Project Showcase', href: '/community/showcase' },
    { name: 'Contribute', href: '/contribute' },
    { name: 'Code of Conduct', href: '/code-of-conduct' },
  ],
  platform: [
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Open Source', href: 'https://github.com/Nyxora-Sync/nyxora-sync', external: true, icon: GithubIcon },
  ],
  connect: [
    ...(NEWSLETTER_ENABLED
      ? [{ name: 'Newsletter', href: '/newsletter', icon: Mail }]
      : []),
    { name: 'GitHub', href: 'https://github.com/Nyxora-Sync/nyxora-sync', external: true, icon: GithubIcon },
    { name: 'Contact', href: '/contact', icon: Mail },
  ],
}

const socialLinks: FooterLink[] = [
  { name: 'GitHub', href: 'https://github.com/Nyxora-Sync/nyxora-sync', icon: GithubIcon },
  { name: 'Contact', href: '/contact', icon: Mail },
]

export function Footer() {
  return (
    <footer data-site-footer data-print-hide className="border-t border-border/50 bg-muted/30" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className={cn('grid gap-8 md:grid-cols-2', NEWSLETTER_ENABLED ? 'lg:grid-cols-6' : 'lg:grid-cols-5')}>
          <div className="md:col-span-2 lg:col-span-2">
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
              Learn web development and programming languages for free. MERN, C, C++, C#, and Python
              paths from beginner to mastery, with written lessons, projects, playgrounds, and
              community.
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

          {NEWSLETTER_ENABLED && (
            <div>
              <h3 className="font-semibold">Stay Updated</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                One confirmation email, then occasional updates when a new module or major resource
                ships. No spam.
              </p>
              <NewsletterForm compact />
              <p className="mt-3 text-xs text-muted-foreground">
                Unsubscribe anytime; unsubscribing deletes the address.{' '}
                <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
              </p>
            </div>
          )}
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
        </div>
      </div>
    </footer>
  )
}