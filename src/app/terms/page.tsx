import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The plain-language terms for using MERN Learn: accounts, acceptable use, content licenses, moderation, and the limits of a free educational site.',
}

export default function TermsPage() {
  return (
    <LegalPage
      badge="Legal"
      title="Terms of Service"
      intro="These are the rules for using MERN Learn. They are written to be read, not to hide behind."
      updated="October 20, 2026"
    >
      <h2>Using the site</h2>
      <p>
        By visiting MERN Learn or creating an account, you agree to these terms and the{' '}
        <Link href="/privacy">privacy policy</Link>. If you do not agree, use the site without an
        account or do not use it. You must be at least 13 years old, or at least 16 where local law
        sets a higher age for digital consent.
      </p>

      <h2>Free and open source</h2>
      <p>
        The curriculum is free to read. Lesson text is licensed under{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
          CC BY-SA 4.0
        </a>
        ; the site&apos;s source code is licensed under the MIT License. Those licenses control how
        you may reuse the material. If you quote or adapt a lesson, credit MERN Learn and keep the
        same license.
      </p>

      <h2>Accounts</h2>
      <ul>
        <li>You are responsible for activity on your account and for keeping access to your email or OAuth provider secure.</li>
        <li>Provide accurate information and do not impersonate another person or project.</li>
        <li>Do not share an account or sell access to it.</li>
        <li>You can stop using the site at any time and request account deletion through the <Link href="/contact">contact form</Link>.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Harass, threaten, stalk, or discriminate against another person.</li>
        <li>Post malware, phishing links, or code intended to harm a reader&apos;s machine.</li>
        <li>Publish someone else&apos;s private information, credentials, or content without permission.</li>
        <li>Plagiarize a project, lesson, or explanation, or misrepresent who wrote it.</li>
        <li>Spam community spaces with ads, recruiting, or repeated off-topic links.</li>
        <li>Scrape the site at a volume that degrades service, or attempt to bypass authentication or rate limits.</li>
        <li>Use the site to break the law or to instruct others to do so.</li>
      </ul>
      <p>
        The <Link href="/code-of-conduct">Code of Conduct</Link> applies to every community space and
        is part of these terms.
      </p>

      <h2>Your content</h2>
      <p>
        You keep ownership of the comments, projects, profile text, and images you submit. By
        publishing them, you give MERN Learn a non-exclusive, worldwide, royalty-free license to
        host, display, format, and promote that content as part of the site. This license ends when
        you delete the content, except for copies that may remain briefly in backups or in content
        others have already quoted.
      </p>
      <p>
        You are responsible for what you publish. Only submit work you have the right to share, and do
        not include secrets, API keys, or other people&apos;s personal data. Community content is
        public; treat it that way before posting.
      </p>

      <h2>Our content</h2>
      <p>
        The lessons, design, and code are the result of work by the project and its contributors. The
        licenses above grant reuse rights; they do not grant permission to use the MERN Learn name or
        logo to imply endorsement of a product or service.
      </p>

      <h2>Third-party resources</h2>
      <p>
        Lessons link to documentation, videos, articles, and tools maintained by other people. We
        check links when a lesson is written, but we do not control them. A link is not an endorsement,
        and the destination&apos;s terms and privacy policy apply when you visit it. Report broken or
        inappropriate links through the <Link href="/contact">contact form</Link>.
      </p>

      <h2>Moderation and termination</h2>
      <p>
        We may remove content or suspend an account that violates these terms or the Code of Conduct.
        When practical, we explain why. Serious violations can result in immediate removal. You may
        appeal a moderation decision through the contact form; include the relevant links.
      </p>
      <p>
        We may change, suspend, or discontinue parts of the site. Because it is a free project, we do
        not guarantee that any feature or lesson will remain available forever.
      </p>

      <h2>Educational disclaimer</h2>
      <p>
        The content is for learning. It is not professional advice, a guarantee of employment, or a
        certification. Code samples are provided as examples; you are responsible for reviewing and
        testing anything you run or deploy.
      </p>

      <h2>No warranty</h2>
      <p>
        The site and content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
        warranties of any kind, express or implied, including fitness for a particular purpose,
        accuracy, or non-infringement. We work to keep lessons correct, but APIs change and mistakes
        happen.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, MERN Learn and its contributors are not liable for
        indirect, incidental, special, consequential, or punitive damages, or for lost data, profits,
        or opportunities arising from your use of the site. Nothing in these terms excludes liability
        that cannot be excluded by law, or limits mandatory consumer rights.
      </p>

      <h2>Changes</h2>
      <p>
        If these terms change, the date at the top will change. Material changes will be announced on
        the site. Continuing to use the site after a change means you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms go through the <Link href="/contact">contact form</Link>. For
        security reports, use the private route described on that page rather than a public issue.
      </p>
    </LegalPage>
  )
}
