import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Code of Conduct',
  description:
    'The rules for participating in MERN Learn: lesson discussions, the project showcase, profiles, GitHub, and every community space.',
  path: '/code-of-conduct',
})

export default function CodeOfConductPage() {
  return (
    <LegalPage
      badge="Community"
      title="Code of Conduct"
      intro="The short version: be decent, be specific, and do not make the room smaller for the person after you."
      updated="October 20, 2026"
    >
      <p>
        MERN Learn is a learning space. People arrive with different backgrounds, languages, time
        zones, and confidence levels. The rules below exist so that asking a basic question never
        costs anyone their dignity.
      </p>

      <h2>Our pledge</h2>
      <p>
        We pledge to make participation welcoming for everyone, regardless of experience level,
        age, body size, visible or invisible disability, ethnicity, sex characteristics, gender
        identity and expression, education, socio-economic status, nationality, personal
        appearance, race, religion, or sexual identity and orientation.
      </p>

      <h2>Expected behavior</h2>
      <ul>
        <li>Be respectful of differing viewpoints and experiences.</li>
        <li>Give specific, actionable feedback: point at the sentence or line, not the person.</li>
        <li>Assume good faith, then ask a clarifying question before escalating.</li>
        <li>Respect privacy. Do not share someone&apos;s code, error logs, or personal details without permission.</li>
        <li>Credit sources when you reuse an explanation, diagram, or resource.</li>
        <li>Accept correction gracefully. Being wrong about an API is normal; doubling down is a choice.</li>
      </ul>

      <h2>Unacceptable behavior</h2>
      <ul>
        <li>Harassment, intimidation, stalking, or following someone across threads after they asked you to stop.</li>
        <li>Discriminatory jokes, slurs, or imagery, including &ldquo;just a joke&rdquo; versions.</li>
        <li>Sexual attention or advances in any community space.</li>
        <li>Publishing private information (doxxing), including addresses, emails, or credentials.</li>
        <li>Deliberate misinformation, plagiarism, or presenting someone else&apos;s project as your own.</li>
        <li>Spam, undisclosed promotion, recruiting, or repeated off-topic links.</li>
        <li>Posting malware, phishing links, or code intended to harm a reader&apos;s machine.</li>
        <li>Retaliating against someone who reported a problem.</li>
      </ul>

      <h2>Scope</h2>
      <p>
        This code applies in lesson discussions, the project showcase, public profiles, GitHub
        issues and pull requests, contact messages, the newsletter, and any space where you are
        representing MERN Learn.
      </p>

      <h2>Reporting</h2>
      <p>
        Report conduct problems through the{' '}
        <Link href="/contact">contact form</Link> and choose the &ldquo;Code of conduct report&rdquo;
        topic. Include what happened, where, when, and links or screenshots if you have them. If the
        report involves a maintainer, say so; they will be excluded from handling it.
      </p>
      <p>
        Reports are kept confidential within the people handling them. We will acknowledge a report
        as soon as we can and avoid acting on conflicts of interest. We may not be able to act on an
        anonymous report that lacks enough detail to identify the behavior.
      </p>
      <p>
        For security vulnerabilities, do not open a public issue. Use the repository&apos;s security
        reporting flow and see the <Link href="/contact">contact page</Link> for the current route.
      </p>

      <h2>Enforcement</h2>
      <p>Enforcement is proportional to impact and history. A typical progression:</p>
      <ol>
        <li>
          <strong>Correction.</strong> A private note explaining what was inappropriate and why,
          with a request to change the behavior.
        </li>
        <li>
          <strong>Warning.</strong> A recorded warning with consequences for repeating the behavior.
        </li>
        <li>
          <strong>Temporary ban.</strong> A time-limited removal from community spaces, with the
          length matched to severity.
        </li>
        <li>
          <strong>Permanent ban.</strong> Removal for severe or repeated violations, harassment, or
          retaliation.
        </li>
      </ol>
      <p>
        Severe behavior can skip directly to a temporary or permanent ban. Decisions are documented
        so they stay consistent, and the person affected is told what happened unless doing so would
        expose the reporter to harm.
      </p>

      <h2>Attribution</h2>
      <p>
        This code is adapted from the{' '}
        <a href="https://www.contributor-covenant.org/version/2/1/code_of_conduct/" target="_blank" rel="noopener noreferrer">
          Contributor Covenant, version 2.1
        </a>
        , available under CC BY 4.0. The enforcement section is shortened for a small open-source
        project.
      </p>
    </LegalPage>
  )
}
