export interface FaqLink {
  label: string
  href: string
}

export interface FaqItem {
  slug: string
  question: string
  answer: string
  related?: FaqLink
}

export interface FaqSection {
  id: string
  title: string
  description: string
  items: FaqItem[]
}

export const FAQ_LAST_REVIEWED = '2026-10-20'

export const faqSections: FaqSection[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    description: 'What the site is, who it is for, and what you need before the first lesson.',
    items: [
      {
        slug: 'is-it-free',
        question: 'Is Nyxora Sync really free?',
        answer:
          'Yes. Every written lesson, the resource directory, the playground, progress tracking, and the community features are free to use. There is no paywall, trial, or required purchase.',
        related: { label: 'Start with the beginner track', href: '/learn/beginner' },
      },
      {
        slug: 'do-i-need-an-account',
        question: 'Do I need an account to learn?',
        answer:
          'No. You can read every lesson and keep progress in your browser without signing in. An account is only needed if you want progress synced across devices, lesson discussions, a public profile, or the project showcase.',
        related: { label: 'See how progress works', href: '/dashboard' },
      },
      {
        slug: 'which-track',
        question: 'Which track should I start with?',
        answer:
          'Choose the beginner track if HTML, CSS, and JavaScript are new to you. Choose the developer track if you are already comfortable with JavaScript and want to move through Node, Express, MongoDB, React, and the advanced material faster. If you want a language path, start with Python for the gentlest on-ramp, C to understand memory, C++ for performance-sensitive systems, or C# for the .NET ecosystem. The shared MERN modules are the same in both web tracks.',
        related: { label: 'Compare the paths', href: '/learn' },
      },
      {
        slug: 'certificates',
        question: 'Do I get a certificate or credential?',
        answer:
          'No. Nyxora Sync does not issue certificates, diplomas, or accredited credentials. The lessons and projects are built to help you understand the stack and produce work you can show, not to replace a formal program.',
        related: { label: 'Build something for the showcase', href: '/community/showcase' },
      },
      {
        slug: 'how-long',
        question: 'How long does the curriculum take?',
        answer:
          'There is no fixed schedule. Each lesson lists an estimated reading time, but the real time depends on your background, how many exercises you complete, and how much you build. Work through one module at a time and use the projects to practise.',
        related: { label: 'View the roadmap', href: '/roadmap' },
      },
    ],
  },
  {
    id: 'learning',
    title: 'Lessons and progress',
    description: 'How the written lessons, practice tools, and progress tracking fit together.',
    items: [
      {
        slug: 'written-lessons',
        question: 'Are the lessons written on the site, or just links?',
        answer:
          'The core lessons are full written tutorials hosted here. External videos, articles, and documentation are optional “Go deeper” material. You do not need to leave the site to follow a lesson, and links are there when you want another explanation.',
        related: { label: 'Browse all lessons', href: '/learn' },
      },
      {
        slug: 'progress-storage',
        question: 'Where is my progress stored?',
        answer:
          'While you are signed out, lesson completion, XP, streaks, notes, bookmarks, and your last visited lesson stay in your browser’s local storage. When you sign in, that progress is synced to your account so it can follow you to another device.',
        related: { label: 'Open your dashboard', href: '/dashboard' },
      },
      {
        slug: 'xp-and-badges',
        question: 'What are XP and badges for?',
        answer:
          'XP and badges are a lightweight way to mark progress and keep momentum. They are for you, not for a certificate or a public ranking. You can hide your learning progress from other people in settings.',
        related: { label: 'Manage your settings', href: '/settings' },
      },
      {
        slug: 'playground',
        question: 'Can I run code on the site?',
        answer:
          'Yes. The playground has HTML, CSS, and JavaScript editors with a live preview. It runs in your browser and is meant for small experiments and lesson exercises, not for running a full Node or database server.',
        related: { label: 'Open the playground', href: '/playground' },
      },
      {
        slug: 'notes-bookmarks',
        question: 'Can I save notes and bookmark lessons?',
        answer:
          'Yes. Each lesson has a private notes area and a bookmark control. Notes and bookmarks are stored locally while signed out and sync with your account when you sign in.',
        related: { label: 'Find bookmarks in your dashboard', href: '/dashboard' },
      },
    ],
  },
  {
    id: 'community',
    title: 'Community and the site',
    description: 'Contributing, sharing projects, accessibility, and reusing the material.',
    items: [
      {
        slug: 'contribute',
        question: 'Can I contribute a lesson or fix?',
        answer:
          'Yes. The content lives in the open repository, and corrections, examples, and new material are welcome. Read the contribution guide first so changes match the lesson structure and tone.',
        related: { label: 'Read the contribution guide', href: '/contribute' },
      },
      {
        slug: 'share-project',
        question: 'How do I share a project?',
        answer:
          'Sign in, open the showcase, and add a title, description, track, tags, and any live demo or source links. Screenshots are submitted as an image URL rather than a direct file upload, so the form explains the available options.',
        related: { label: 'Visit the showcase', href: '/community/showcase' },
      },
      {
        slug: 'discussions',
        question: 'Where can I ask questions?',
        answer:
          'Every lesson and showcase project has a discussion thread. Sign in to post a question, correction, or reply. Keep discussions constructive and follow the code of conduct.',
        related: { label: 'Read the code of conduct', href: '/code-of-conduct' },
      },
      {
        slug: 'accessibility',
        question: 'Is the site accessible?',
        answer:
          'The site is built with keyboard navigation, semantic landmarks, visible focus states, reduced-motion support, and screen-reader labels in mind. If something creates a barrier for you, report it through the contact form so it can be fixed.',
        related: { label: 'Read the accessibility statement', href: '/accessibility' },
      },
      {
        slug: 'reuse-content',
        question: 'Can I reuse the lessons?',
        answer:
          'The written content is licensed under CC BY-SA 4.0, and the code is licensed under MIT. Attribution and share-alike terms apply to the content; check the license files in the repository for the exact terms.',
        related: { label: 'View the terms of service', href: '/terms' },
      },
      {
        slug: 'report-a-problem',
        question: 'How do I report a broken link or bug?',
        answer:
          'Use the contact form and include the page, what you expected, and what happened. If the issue is in the code or content, you can also open an issue on GitHub.',
        related: { label: 'Contact the maintainers', href: '/contact' },
      },
    ],
  },
]
