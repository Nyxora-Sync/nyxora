import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Accessibility',
  description:
    'MERN Learn aims for WCAG 2.2 AA. What works today, the known gaps, and how to report an accessibility barrier.',
  path: '/accessibility',
})

export default function AccessibilityPage() {
  return (
    <LegalPage
      badge="Accessibility"
      title="Accessibility"
      intro="A free curriculum is only free if the people who need it can use it. This page records where we are, what is still broken, and how to tell us."
      updated="October 20, 2026"
    >
      <h2>Our target</h2>
      <p>
        MERN Learn aims to meet the{' '}
        <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
          Web Content Accessibility Guidelines (WCAG) 2.2, Level AA
        </a>
        . This is a target, not a certification. The site has not yet been independently audited.
      </p>

      <h2>What is in place</h2>
      <ul>
        <li>Semantic headings, landmarks, lists, and form labels; a visible focus outline on interactive elements.</li>
        <li>Keyboard-operable navigation, dialogs, menus, filters, and forms, including Escape to close dialogs.</li>
        <li>Text alternatives for meaningful icons and empty alt text for decorative images.</li>
        <li>Theme-aware color contrast designed against the WCAG AA thresholds for normal and large text.</li>
        <li>Layouts that reflow at 200% zoom and on narrow screens without requiring horizontal scrolling for prose.</li>
        <li>No autoplaying audio or video. The homepage has a slow, low-contrast ambient visual that becomes a still image when reduced motion is requested.</li>
        <li>Reduced-motion support: page transitions, reveal effects, and the homepage visual are removed or made static when your system asks for less motion.</li>
        <li>Code blocks that remain readable and copyable without a mouse.</li>
        <li>Forms that report errors in text, not color alone, and keep their labels associated with inputs.</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>
          <strong>No independent audit yet.</strong> The checks above are part of development, not a
          formal conformance test with assistive technology.
        </li>
        <li>
          <strong>The code playground.</strong> The live preview runs inside a sandboxed frame and the
          editor is a plain text area. Some screen-reader and mobile keyboard combinations may still
          be awkward; the lesson text and code samples are complete without the playground.
        </li>
        <li>
          <strong>User-generated images.</strong> Project screenshots are treated as decorative. A
          project owner can describe the image in the project description, but there is no separate
          alt-text field yet.
        </li>
        <li>
          <strong>Third-party resources.</strong> Linked videos, articles, and documentation are
          outside our control and may not meet the same standard.
        </li>
        <li>
          <strong>Older lessons.</strong> A few diagrams or long code samples may need better structure
          on small screens. They are being fixed as they are reviewed.
        </li>
      </ul>

      <h2>How we test</h2>
      <p>
        Accessibility is checked during development with keyboard-only navigation, browser zoom,
        automated linting, and contrast review of the theme palette. When a barrier is reported, we
        reproduce it, fix it, and add the case to the checks for future changes.
      </p>

      <h2>Compatibility</h2>
      <p>
        The site is tested in current versions of Chrome, Firefox, Safari, and Edge on desktop, and in
        mobile Safari and Chrome on a small viewport. It does not require JavaScript for reading
        lessons, but interactive progress, the playground, and community features do.
      </p>

      <h2>Report a barrier</h2>
      <p>
        If something blocks you, use the <Link href="/contact">contact form</Link> and choose
        &ldquo;General question&rdquo; or &ldquo;Bug or broken page&rdquo;. Describe the page, what
        you were trying to do, the assistive technology or input method you use, and what happened.
        You can also open a GitHub issue labeled <code>accessibility</code>.
      </p>
      <p>
        We will acknowledge the report, tell you whether we can reproduce it, and explain what we plan
        to do. Reports about a lesson&apos;s code or explanation are handled like any other content
        correction.
      </p>

      <h2>Feedback on this statement</h2>
      <p>
        This statement is reviewed when the site changes substantially. If something here is
        inaccurate, say so through the contact form; an honest statement is more useful than an
        optimistic one.
      </p>
    </LegalPage>
  )
}
