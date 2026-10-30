import { languageTracks } from './language-curriculum'

export type ResourceType = 'video' | 'article' | 'docs' | 'interactive' | 'project' | 'cheatsheet'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type TrackCategory =
  | 'web-development'
  | 'programming-languages'
  | 'embedded-systems'
  | 'mobile-development'
  | 'data-science'
  | 'devops-cloud'
  | 'game-development'
  | 'desktop-apps'

export interface TrackCategoryInfo {
  id: TrackCategory
  name: string
  description: string
  icon: string
  color: string
  order: number
}

export const trackCategories: TrackCategoryInfo[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Learn the web from first principles, then build and operate full-stack applications.',
    icon: 'Globe',
    color: 'emerald',
    order: 1,
  },
  {
    id: 'programming-languages',
    name: 'Programming Languages',
    description: 'Build durable language foundations, then take each path from beginner to mastery.',
    icon: 'Code',
    color: 'blue',
    order: 2,
  },
  {
    id: 'embedded-systems',
    name: 'Embedded Systems & IoT',
    description: 'Program microcontrollers, build IoT devices, and control hardware with code.',
    icon: 'Cpu',
    color: 'amber',
    order: 3,
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    description: 'Build native and cross-platform apps for iOS and Android.',
    icon: 'Smartphone',
    color: 'violet',
    order: 4,
  },
  {
    id: 'data-science',
    name: 'Data Science & AI',
    description: 'Analyze data, build ML models, and create intelligent applications.',
    icon: 'Brain',
    color: 'rose',
    order: 5,
  },
  {
    id: 'devops-cloud',
    name: 'DevOps & Cloud',
    description: 'Deploy, scale, and operate applications on modern cloud infrastructure.',
    icon: 'Cloud',
    color: 'indigo',
    order: 6,
  },
  {
    id: 'game-development',
    name: 'Game Development',
    description: 'Create 2D and 3D games with modern engines and frameworks.',
    icon: 'Gamepad2',
    color: 'orange',
    order: 7,
  },
  {
    id: 'desktop-apps',
    name: 'Desktop Applications',
    description: 'Build cross-platform desktop apps with native performance.',
    icon: 'Monitor',
    color: 'slate',
    order: 8,
  },
]

export interface Resource {
  type: ResourceType
  title: string
  url: string
  description?: string
  duration?: string
  provider?: string
  isVerified?: boolean // official docs / high-quality curated
}

export interface Lesson {
  id: string
  title: string
  description: string
  order: number
  estimatedMinutes: number
  difficulty: Difficulty
  xpReward: number
  resources: Resource[]
  playground?: {
    template: string
    title: string
    description: string
  }
  keyTakeaways: string[]
  isProject?: boolean
  // Portfolio / Fast-Track enhancements
  portfolioChecklist?: string[]          // What makes this project "portfolio grade"
  liveDemoUrl?: string                   // Example live deployment URL
  repoUrl?: string                       // Example GitHub repo URL
  architectureDiagram?: string           // Text diagram of system architecture
  techStack?: string[]                   // Key technologies used
  difficultyNote?: string                // e.g., "Fast-track: 2-3 weeks" or "Deep-dive: 4-6 weeks"
}

export type ModuleStatus = 'core' | 'advanced' | 'planned'

export interface CapstoneProject {
  title: string
  description: string
  liveDemoUrl: string
  repoUrl: string
  techStack: string[]
  portfolioChecklist: string[]
  difficultyNote: string
}

export interface Module {
  id: string
  key: string
  name: string
  description: string
  order: number
  estimatedHours: number
  estimatedHoursRange?: string  // e.g., "40-60 hrs" for realistic ranges
  icon: string
  color: string
  lessons: Lesson[]
  status?: ModuleStatus // defaults to 'core'
  // Outcome-driven fields
  outcomes?: string[]           // "What you'll be able to build/earn"
  capstoneProject?: CapstoneProject
  isCapstone?: boolean
  isFastTrackModule?: boolean   // Part of job-ready fast track
  isExperimental?: boolean      // Advanced/experimental content, hidden by default in UI
}

export interface Track {
  id: string
  key: string
  name: string
  description: string
  category: TrackCategory
  icon: string
  color: string
  modules: Module[]
  isFastTrack?: boolean          // Highlights the job-ready fast track
  fastTrackDescription?: string  // What the fast track covers
  // Computed properties (added when transformed for display)
  duration?: string
  lessons?: number
  modulesList?: Array<{ key: string; name: string; weeks: number; lessons: number }>
}

// ============================================================
// BEGINNER TRACK
// ============================================================

const beginnerModules: Module[] = [
  {
    id: 'foundations',
    key: 'foundations',
    name: 'Web Foundations',
    description: 'HTML, CSS, JavaScript, Git, and developer tools. Start from absolute zero.',
    order: 1,
    estimatedHours: 120,
    estimatedHoursRange: '40-60 hrs',
    icon: 'BookOpen',
    color: 'emerald',
    isFastTrackModule: true,
    outcomes: [
      'Build responsive, accessible static websites with HTML5 and CSS3',
      'Write modern JavaScript (ES6+) for DOM manipulation and API calls',
      'Use Git/GitHub for version control and collaboration',
      'Deploy static sites to Vercel, Netlify, or GitHub Pages',
    ],
    capstoneProject: {
      title: 'Personal Portfolio Website',
      description: 'A responsive, accessible portfolio showcasing your projects and skills — deployed live with a clean Git history.',
      liveDemoUrl: 'https://yourname.vercel.app',
      repoUrl: 'https://github.com/yourusername/portfolio',
      techStack: ['HTML5', 'CSS3 (Flexbox/Grid)', 'Vanilla JS', 'Vercel/Netlify'],
      portfolioChecklist: [
        'Live deployment on Vercel/Netlify/GitHub Pages',
        'README with: who you are, what you\'re learning, project links, contact info',
        'GitHub repo with meaningful commits (not a single dump)',
        'Mobile-first responsive design (375px, 768px, 1440px)',
        'Semantic HTML5 structure (header, main, section, footer)',
        'Clean CSS: custom properties, consistent spacing, no !important abuse',
        'Accessible: alt text on images, heading hierarchy, focus styles',
        'At least 3 portfolio projects featured (even if placeholders for now)',
        'Favicon, meta tags, Open Graph tags for social sharing',
      ],
      difficultyNote: 'Fast-track: 1-2 weeks · Deep-dive: 3-4 weeks',
    },
    lessons: [
      {
        id: 'foundations-how-web-works',
        title: 'How the Web Works',
        description: 'Understand what happens when you visit a website: DNS, HTTP, browsers, and servers.',
        order: 1,
        estimatedMinutes: 45,
        difficulty: 'beginner',
        xpReward: 10,
        keyTakeaways: [
          'The difference between frontend and backend',
          'What HTTP requests and responses are',
          'How DNS translates domain names to IP addresses',
          'The client-server model',
        ],
        resources: [
          {
            type: 'video',
            title: 'How the Internet Works in 5 Minutes',
            url: 'https://www.youtube.com/watch?v=7_LPdttKXPc',
            provider: 'Aaron Titus',
            duration: '5 min',
          },
          {
            type: 'article',
            title: 'How the Web Works: A Primer for Newcomers',
            url: 'https://www.freecodecamp.org/news/how-the-web-works-a-primer-for-newcomers-to-web-development-or-anyone-really-b4584e63585c/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'MDN: How the Web Works',
            url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works',
            provider: 'MDN',
            isVerified: true,
          },
        ],
      },
      {
        id: 'foundations-html-basics',
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of every webpage: tags, elements, attributes, and semantic HTML.',
        order: 2,
        estimatedMinutes: 180,
        difficulty: 'beginner',
        xpReward: 20,
        keyTakeaways: [
          'Structure of an HTML document',
          'Common HTML tags and attributes',
          'Semantic HTML and why it matters',
          'Forms and input elements',
        ],
        resources: [
          {
            type: 'interactive',
            title: 'freeCodeCamp Responsive Web Design Certification',
            url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
            provider: 'freeCodeCamp',
            duration: '~20 hours',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'HTML Full Course for Beginners',
            url: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
            provider: 'Bro Code',
            duration: '4 hours',
          },
          {
            type: 'interactive',
            title: 'MDN: HTML Basics',
            url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content',
            provider: 'MDN',
            isVerified: true,
          },
        ],
      },
      {
        id: 'foundations-css-basics',
        title: 'CSS Fundamentals',
        description: 'Style your pages: selectors, box model, colors, typography, and modern layout.',
        order: 3,
        estimatedMinutes: 240,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'CSS selectors and specificity',
          'Box model, margin, padding, borders',
          'Flexbox for 1D layouts',
          'CSS Grid for 2D layouts',
          'Responsive design with media queries',
        ],
        resources: [
          {
            type: 'video',
            title: 'CSS Tutorial – Zero to Hero',
            url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
            provider: 'freeCodeCamp',
            duration: '6 hours',
          },
          {
            type: 'interactive',
            title: 'Flexbox Froggy',
            url: 'https://flexboxfroggy.com/',
            provider: 'Flexbox Froggy',
            isVerified: true,
            description: 'Learn Flexbox by playing a game',
          },
          {
            type: 'interactive',
            title: 'Grid Garden',
            url: 'https://cssgridgarden.com/',
            provider: 'Grid Garden',
            isVerified: true,
            description: 'Learn CSS Grid by playing a game',
          },
          {
            type: 'docs',
            title: 'CSS-Tricks Complete Guide to Flexbox',
            url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
            provider: 'CSS-Tricks',
            isVerified: true,
          },
        ],
      },
      {
        id: 'foundations-js-basics',
        title: 'JavaScript Fundamentals',
        description: 'Variables, data types, functions, conditionals, loops, and arrays. The core of programming.',
        order: 4,
        estimatedMinutes: 360,
        difficulty: 'beginner',
        xpReward: 40,
        keyTakeaways: [
          'let, const, var and when to use each',
          'Functions, arrow functions, and scope',
          'Arrays and objects manipulation',
          'Array methods: map, filter, reduce',
          'Control flow and loops',
        ],
        resources: [
          {
            type: 'interactive',
            title: 'freeCodeCamp JavaScript Algorithms and Data Structures',
            url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
            provider: 'freeCodeCamp',
            duration: '~30 hours',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'JavaScript Tutorial for Beginners',
            url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            provider: 'Programming with Mosh',
            duration: '1 hour',
          },
          {
            type: 'interactive',
            title: 'javascript.info',
            url: 'https://javascript.info/',
            provider: 'javascript.info',
            isVerified: true,
            description: 'The Modern JavaScript Tutorial - free and comprehensive',
          },
        ],
      },
      {
        id: 'foundations-js-dom',
        title: 'DOM Manipulation & Events',
        description: 'Make pages interactive: select elements, handle events, and update the DOM.',
        order: 5,
        estimatedMinutes: 180,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'Selecting DOM elements',
          'Event listeners and event objects',
          'Creating and removing elements',
          'Event bubbling and delegation',
        ],
        resources: [
          {
            type: 'interactive',
            title: 'JavaScript DOM Manipulation',
            url: 'https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events',
            provider: 'The Odin Project',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'JavaScript DOM Crash Course',
            url: 'https://www.youtube.com/watch?v=0ik6X4DJKCc',
            provider: 'Traversy Media',
            duration: '1 hour',
          },
        ],
      },
      {
        id: 'foundations-async-js',
        title: 'Async JavaScript, Promises & Fetch',
        description: 'Handle asynchronous operations: callbacks, promises, async/await, and API calls.',
        order: 6,
        estimatedMinutes: 240,
        difficulty: 'beginner',
        xpReward: 30,
        keyTakeaways: [
          'Synchronous vs asynchronous code',
          'Promise chaining and error handling',
          'async/await syntax',
          'Fetch API for HTTP requests',
        ],
        resources: [
          {
            type: 'article',
            title: 'JavaScript Promises: An Introduction',
            url: 'https://web.dev/articles/promises',
            provider: 'web.dev',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'Async JS Crash Course - Callbacks, Promises, Async Await',
            url: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
            provider: 'Traversy Media',
            duration: '30 min',
          },
          {
            type: 'article',
            title: 'Fetch API Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
            provider: 'MDN',
            isVerified: true,
          },
        ],
      },
      {
        id: 'foundations-es6',
        title: 'Modern JavaScript (ES6+)',
        description: 'Destructuring, spread/rest, modules, optional chaining, and modern syntax.',
        order: 7,
        estimatedMinutes: 180,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'Destructuring objects and arrays',
          'Spread and rest operators',
          'ES modules (import/export)',
          'Template literals, optional chaining, nullish coalescing',
        ],
        resources: [
          {
            type: 'video',
            title: 'ES6+ Features: A Comprehensive Guide',
            url: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
            provider: 'Web Dev Simplified',
            duration: '1 hour',
          },
          {
            type: 'article',
            title: 'ES6 Tutorial: Full Crash Course',
            url: 'https://www.freecodecamp.org/news/write-less-do-more-with-javascript-es6-5fd4a8e50ee2/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
      },
      {
        id: 'foundations-git',
        title: 'Git, GitHub & Terminal',
        description: 'Version control, collaboration workflow, and essential command-line skills.',
        order: 8,
        estimatedMinutes: 180,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'Essential Git commands (init, add, commit, push, pull)',
          'Branching and merging',
          'Pull requests and code review',
          'Basic terminal navigation',
        ],
        resources: [
          {
            type: 'interactive',
            title: 'Learn Git Branching',
            url: 'https://learngitbranching.js.org/',
            provider: 'Learn Git Branching',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'Git and GitHub for Beginners - Crash Course',
            url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
            provider: 'freeCodeCamp',
            duration: '1 hour',
          },
          {
            type: 'docs',
            title: 'Pro Git Book',
            url: 'https://git-scm.com/book/en/v2',
            provider: 'Git SCM',
            isVerified: true,
          },
        ],
      },
      {
        id: 'foundations-project-portfolio',
        title: 'Project: Personal Portfolio Page',
        description: 'Build your first real project: a responsive personal portfolio using HTML, CSS, and JS.',
        order: 9,
        estimatedMinutes: 300,
        difficulty: 'beginner',
        xpReward: 50,
        keyTakeaways: [
          'Combining HTML, CSS, and JS',
          'Responsive design in practice',
          'Deploying a static site',
          'Writing a README',
        ],
        resources: [
          {
            type: 'project',
            title: 'Build a Portfolio Website',
            url: 'https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'Frontend Mentor Challenges',
            url: 'https://www.frontendmentor.io/challenges',
            provider: 'Frontend Mentor',
            description: 'Real-world HTML/CSS challenges',
          },
          {
            type: 'docs',
            title: 'Deploy with Vercel',
            url: 'https://vercel.com/docs/getting-started-with-vercel',
            provider: 'Vercel',
            isVerified: true,
          },
        ],
        // Portfolio / Fast-Track metadata
        isProject: true,
        portfolioChecklist: [
          'Live deployment on Vercel/Netlify/GitHub Pages',
          'README with: who you are, what you\'re learning, project links, contact info',
          'GitHub repo with meaningful commits (not a single dump)',
          'Mobile-first responsive design (375px, 768px, 1440px)',
          'Semantic HTML5 structure (header, main, section, footer)',
          'Clean CSS: custom properties, consistent spacing, no !important abuse',
          'Accessible: alt text on images, heading hierarchy, focus styles',
          'At least 3 portfolio projects featured (even if placeholders for now)',
          'Favicon, meta tags, Open Graph tags for social sharing',
        ],
        liveDemoUrl: 'https://yourname.vercel.app',
        repoUrl: 'https://github.com/yourusername/portfolio',
        architectureDiagram: `Static HTML/CSS/JS → Vercel/Netlify → CDN`,
        techStack: ['HTML5', 'CSS3 (Flexbox/Grid)', 'Vanilla JS', 'Vercel/Netlify'],
        difficultyNote: 'Fast-track: 1-2 weeks · Deep-dive: 3-4 weeks',
      },
    ],
  },
  {
    id: 'node-express',
    key: 'node-express',
    name: 'Node.js & Express',
    description: 'Server-side JavaScript, REST APIs, authentication, and testing.',
    order: 2,
    estimatedHours: 60,
    estimatedHoursRange: '30-45 hrs',
    icon: 'Server',
    color: 'emerald',
    isFastTrackModule: true,
    outcomes: [
      'Build and deploy REST APIs with Express.js',
      'Implement JWT authentication with bcrypt password hashing',
      'Write unit and integration tests with Jest and Supertest',
      'Handle errors gracefully with centralized error middleware',
    ],
    capstoneProject: {
      title: 'Task Manager REST API',
      description: 'A complete REST API with authentication, CRUD operations, validation, and tests — ready for a frontend to consume.',
      liveDemoUrl: 'https://task-api.onrender.com',
      repoUrl: 'https://github.com/yourusername/task-api',
      techStack: ['Node.js', 'Express', 'JWT', 'Zod', 'Jest', 'Supertest', 'MongoDB', 'Render'],
      portfolioChecklist: [
        'Live deployment on Render/Railway with health endpoint',
        'README with: problem statement, API docs, setup instructions, demo credentials',
        'GitHub repo with clean commit history',
        'Authentication: register, login, logout, protected routes',
        'Full CRUD for at least 2 resources with validation (Zod)',
        'Error handling: proper HTTP status codes, consistent error format',
        'Tests: unit + integration (auth, CRUD) with >80% coverage',
        'CI pipeline (GitHub Actions) running tests on every push',
        'Environment variables documented (.env.example)',
      ],
      difficultyNote: 'Fast-track: 2-3 weeks · Deep-dive: 4-5 weeks',
    },
    lessons: [
      {
        id: 'node-intro',
        title: 'Node.js Fundamentals',
        description: 'What Node.js is, the event loop, npm, and your first server.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'beginner',
        xpReward: 20,
        keyTakeaways: [
          'Why Node.js exists and when to use it',
          'The event loop and non-blocking I/O',
          'npm, package.json, and scripts',
          'Creating a basic HTTP server',
        ],
        resources: [
          {
            type: 'video',
            title: 'Node.js Crash Course',
            url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
            provider: 'Traversy Media',
            duration: '1.5 hours',
          },
          {
            type: 'docs',
            title: 'Node.js Official Introduction',
            url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
            provider: 'Node.js',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'NodeSchool Workshoppers',
            url: 'https://nodeschool.io/',
            provider: 'NodeSchool',
            isVerified: true,
          },
        ],
      },
      {
        id: 'express-basics',
        title: 'Express.js: Routing & Middleware',
        description: 'Build a web server with Express: routes, middleware, request/response handling.',
        order: 2,
        estimatedMinutes: 180,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'Setting up an Express app',
          'Route parameters and query strings',
          'Middleware functions and the request pipeline',
          'Serving static files and JSON',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Express.js Official Getting Started',
            url: 'https://expressjs.com/en/starter/installing.html',
            provider: 'Express',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'Express JS Crash Course',
            url: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
            provider: 'Traversy Media',
            duration: '1 hour',
          },
        ],
        playground: {
          template: 'express-basics',
          title: 'Build a Simple Express Server',
          description: 'Create routes, use middleware, and return JSON responses.',
        },
      },
      {
        id: 'rest-api-design',
        title: 'REST API Design',
        description: 'Designing clean REST APIs: HTTP methods, status codes, versioning, and best practices.',
        order: 3,
        estimatedMinutes: 150,
        difficulty: 'intermediate',
        xpReward: 25,
        keyTakeaways: [
          'REST principles and resource naming',
          'HTTP methods and status codes',
          'API versioning strategies',
          'Error response design',
        ],
        resources: [
          {
            type: 'article',
            title: 'REST API Design Best Practices',
            url: 'https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/',
            provider: 'Stack Overflow Blog',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Microsoft REST API Guidelines',
            url: 'https://github.com/microsoft/api-guidelines',
            provider: 'Microsoft',
          },
          {
            type: 'interactive',
            title: 'Build a REST API with Node.js',
            url: 'https://www.freecodecamp.org/news/build-consume-and-document-a-rest-api/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
      },
      {
        id: 'express-auth',
        title: 'Authentication & Authorization',
        description: 'JWT, sessions, bcrypt, role-based access control, and secure password storage.',
        order: 4,
        estimatedMinutes: 240,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'Hashing passwords with bcrypt',
          'JWT structure and verification',
          'Sessions vs tokens',
          'Role-based access control (RBAC)',
          'Security best practices (helmet, CORS, rate limiting)',
        ],
        resources: [
          {
            type: 'video',
            title: 'JWT Authentication Tutorial - Node.js',
            url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
            provider: 'Web Dev Simplified',
            duration: '1 hour',
          },
          {
            type: 'article',
            title: 'JWT.io Introduction',
            url: 'https://jwt.io/introduction',
            provider: 'Auth0',
            isVerified: true,
          },
          {
            type: 'article',
            title: 'Authentication vs Authorization',
            url: 'https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization',
            provider: 'Auth0',
            isVerified: true,
          },
        ],
        playground: {
          template: 'express-auth',
          title: 'Implement JWT Auth',
          description: 'Create register/login routes with hashed passwords and JWT tokens.',
        },
      },
      {
        id: 'express-testing',
        title: 'Testing & Error Handling',
        description: 'Test Express APIs with Jest and Supertest. Centralized error handling and validation.',
        order: 5,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'Unit vs integration vs e2e testing',
          'Jest and Supertest basics',
          'Centralized error handling middleware',
          'Input validation with Zod or Joi',
        ],
        resources: [
          {
            type: 'video',
            title: 'Testing Express APIs with Jest & Supertest',
            url: 'https://www.youtube.com/watch?v=8JHr3m2l6oE',
            provider: 'Coding with Domenic',
            duration: '30 min',
          },
          {
            type: 'docs',
            title: 'Jest Official Docs',
            url: 'https://jestjs.io/docs/getting-started',
            provider: 'Jest',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Zod Documentation',
            url: 'https://zod.dev/',
            provider: 'Zod',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'mongodb',
    key: 'mongodb',
    name: 'MongoDB & Mongoose',
    description: 'NoSQL databases, data modeling, relationships, and aggregations.',
    order: 3,
    estimatedHours: 40,
    estimatedHoursRange: '20-30 hrs',
    icon: 'Database',
    color: 'emerald',
    isFastTrackModule: true,
    outcomes: [
      'Model data with Mongoose schemas, validation, and middleware',
      'Design relationships with referencing vs embedding strategies',
      'Build aggregation pipelines for analytics and reporting',
      'Secure MongoDB with authentication, indexes, and least-privilege users',
    ],
    capstoneProject: {
      title: 'Blog Platform API with MongoDB',
      description: 'A content API demonstrating advanced Mongoose patterns: relationships, virtuals, aggregation, and middleware.',
      liveDemoUrl: 'https://blog-api.onrender.com',
      repoUrl: 'https://github.com/yourusername/blog-api',
      techStack: ['MongoDB', 'Mongoose', 'Express', 'Aggregation Pipeline', 'MongoDB Atlas'],
      portfolioChecklist: [
        'Models for User, Post, Comment with proper relationships',
        'Virtuals for computed fields (e.g., post.authorName)',
        'Middleware for slugs, timestamps, cascade deletes',
        'Aggregation: posts by category, popular tags, author stats',
        'Indexes for query performance (compound, text, partial)',
        'Validation at schema and controller level',
        'Seed script for reproducible development data',
      ],
      difficultyNote: 'Fast-track: 1-2 weeks · Deep-dive: 2-3 weeks',
    },
    lessons: [
      {
        id: 'mongodb-intro',
        title: 'MongoDB Fundamentals',
        description: 'Documents, collections, BSON, MongoDB Shell, and Compass.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'beginner',
        xpReward: 20,
        keyTakeaways: [
          'NoSQL vs SQL databases',
          'Documents, collections, and BSON',
          'CRUD operations in the MongoDB shell',
          'Using MongoDB Compass GUI',
        ],
        resources: [
          {
            type: 'interactive',
            title: 'MongoDB University: Introduction to MongoDB',
            url: 'https://learn.mongodb.com/courses/introduction-to-mongodb',
            provider: 'MongoDB University',
            isVerified: true,
            description: 'Free official course with certificate',
          },
          {
            type: 'video',
            title: 'MongoDB Crash Course',
            url: 'https://www.youtube.com/watch?v=-56x56UppqQ',
            provider: 'Traversy Media',
            duration: '30 min',
          },
        ],
      },
      {
        id: 'mongoose-schemas',
        title: 'Mongoose Schemas & Models',
        description: 'Model your data with Mongoose schemas, validation, middleware, and methods.',
        order: 2,
        estimatedMinutes: 180,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'Defining schemas and models',
          'Built-in and custom validators',
          'Schema methods, statics, and virtuals',
          'Pre/post middleware hooks',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Mongoose Official Docs',
            url: 'https://mongoosejs.com/docs/guide.html',
            provider: 'Mongoose',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'Mongoose Crash Course',
            url: 'https://www.youtube.com/watch?v=DZBGEVgL2eE',
            provider: 'Web Dev Simplified',
            duration: '45 min',
          },
        ],
        playground: {
          template: 'mongoose-schemas',
          title: 'Define a Blog Post Schema',
          description: 'Create a Mongoose schema with validation and virtuals.',
        },
      },
      {
        id: 'mongoose-relationships',
        title: 'Data Relationships & Population',
        description: 'Referencing vs embedding documents, populate(), and modeling real-world relations.',
        order: 3,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'One-to-one, one-to-many, many-to-many',
          'When to embed vs reference',
          'Populating references',
          'Cascade deletes and hooks',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Mongoose Population',
            url: 'https://mongoosejs.com/docs/populate.html',
            provider: 'Mongoose',
            isVerified: true,
          },
          {
            type: 'article',
            title: 'MongoDB Data Modeling Best Practices',
            url: 'https://www.mongodb.com/docs/manual/data-modeling/',
            provider: 'MongoDB',
            isVerified: true,
          },
        ],
      },
      {
        id: 'mongodb-aggregation',
        title: 'Aggregation Pipeline',
        description: 'Transform data with $match, $group, $lookup, $project, and performance tuning.',
        order: 4,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Aggregation stages and pipeline flow',
          '$match, $group, $sort, $limit',
          '$lookup for joins',
          'Indexing for performance',
        ],
        resources: [
          {
            type: 'docs',
            title: 'MongoDB Aggregation Pipeline',
            url: 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline/',
            provider: 'MongoDB',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'MongoDB University: Aggregation Framework',
            url: 'https://learn.mongodb.com/courses/mongodb-aggregation',
            provider: 'MongoDB University',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'react',
    key: 'react',
    name: 'React',
    description: 'Modern React with hooks, routing, state management, and performance.',
    order: 4,
    estimatedHours: 80,
    estimatedHoursRange: '40-60 hrs',
    icon: 'Atom',
    color: 'emerald',
    isFastTrackModule: true,
    outcomes: [
      'Build interactive UIs with React hooks, Context, and React Router',
      'Manage forms with React Hook Form + Zod validation',
      'Fetch and cache server state with TanStack Query',
      'Optimize performance with memo, lazy loading, and profiling',
    ],
    capstoneProject: {
      title: 'E-Commerce Frontend',
      description: 'A production-ready React SPA with cart, checkout flow, authentication, and product catalog — ready to connect to any backend.',
      liveDemoUrl: 'https://shop.vercel.app',
      repoUrl: 'https://github.com/yourusername/ecommerce-frontend',
      techStack: ['React 19', 'React Router', 'TanStack Query', 'React Hook Form', 'Zod', 'Tailwind', 'Zustand', 'Vercel'],
      portfolioChecklist: [
        'Live deployment on Vercel with preview deployments',
        'README with: architecture diagram, tech stack, setup instructions',
        'GitHub repo with clean commits and PR template',
        'Pages: Home, Products, Product Detail, Cart, Checkout, Account, Login/Register',
        'State management: cart (Zustand), server state (TanStack Query), forms (RHF + Zod)',
        'Authentication flow: protected routes, token refresh, logout',
        'Responsive: mobile-first at 375px, 768px, 1440px',
        'Accessible: semantic HTML, ARIA labels, focus management, contrast',
        'Performance: code-split routes, lazy-loaded images, optimized bundle',
        'Error boundaries, loading skeletons, empty states on all data screens',
      ],
      difficultyNote: 'Fast-track: 2-3 weeks · Deep-dive: 4-6 weeks',
    },
    lessons: [
      {
        id: 'react-intro',
        title: 'React Fundamentals',
        description: 'Components, JSX, props, state, and the virtual DOM.',
        order: 1,
        estimatedMinutes: 180,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'Components and JSX',
          'Props and one-way data flow',
          'useState and re-rendering',
          'Lists, keys, and conditional rendering',
        ],
        resources: [
          {
            type: 'interactive',
            title: 'React Official: Learn React',
            url: 'https://react.dev/learn',
            provider: 'React',
            isVerified: true,
            description: 'The new official React docs with interactive examples',
          },
          {
            type: 'video',
            title: 'React Course - Beginner\'s Tutorial',
            url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            provider: 'freeCodeCamp',
            duration: '12 hours',
          },
        ],
        playground: {
          template: 'react-basics',
          title: 'Your First React Components',
          description: 'Build components with props and state.',
        },
      },
      {
        id: 'react-hooks',
        title: 'Hooks Deep Dive',
        description: 'useEffect, useRef, useMemo, useCallback, useReducer, and custom hooks.',
        order: 2,
        estimatedMinutes: 240,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'useEffect: side effects and cleanup',
          'useRef for DOM and mutable values',
          'useMemo and useCallback for performance',
          'useReducer for complex state',
          'Writing custom hooks',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React: Referencing Values with Refs & Effects',
            url: 'https://react.dev/learn/referencing-values-with-refs',
            provider: 'React',
            isVerified: true,
          },
          {
            type: 'video',
            title: '10 React Hooks Explained',
            url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
            provider: 'Fireship',
            duration: '15 min',
          },
          {
            type: 'article',
            title: 'A Complete Guide to useEffect',
            url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
            provider: 'Dan Abramov',
            isVerified: true,
          },
        ],
      },
      {
        id: 'react-router',
        title: 'React Router v6+',
        description: 'Client-side routing, nested routes, layouts, params, and protected routes.',
        order: 3,
        estimatedMinutes: 150,
        difficulty: 'intermediate',
        xpReward: 25,
        keyTakeaways: [
          'Setting up React Router',
          'Dynamic route params',
          'Nested routes and layouts',
          'Protected/private routes',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React Router Official Tutorial',
            url: 'https://reactrouter.com/start/framework/installation',
            provider: 'React Router',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'React Router v6 Tutorial',
            url: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU',
            provider: 'Web Dev Simplified',
            duration: '1 hour',
          },
        ],
      },
      {
        id: 'react-state-management',
        title: 'State Management',
        description: 'Context API, Zustand, and Redux Toolkit. When to use what.',
        order: 4,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'Context API and its limits',
          'Zustand for simple global state',
          'Redux Toolkit fundamentals',
          'Selecting the right tool',
        ],
        resources: [
          {
            type: 'video',
            title: 'Redux Toolkit Tutorial',
            url: 'https://www.youtube.com/watch?v=bbkBuqC1rU4',
            provider: 'Dave Gray',
            duration: '2 hours',
          },
          {
            type: 'docs',
            title: 'Zustand Documentation',
            url: 'https://zustand.docs.pmnd.rs/',
            provider: 'Zustand',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Redux Toolkit: Quick Start',
            url: 'https://redux-toolkit.js.org/tutorials/quick-start',
            provider: 'Redux',
            isVerified: true,
          },
        ],
      },
      {
        id: 'react-forms',
        title: 'Forms & Data Fetching',
        description: 'React Hook Form, Zod validation, TanStack Query, and server state.',
        order: 5,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'Controlled vs uncontrolled forms',
          'React Hook Form patterns',
          'Schema validation with Zod',
          'TanStack Query for server state',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React Hook Form Docs',
            url: 'https://react-hook-form.com/get-started',
            provider: 'React Hook Form',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'TanStack Query Overview',
            url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
            provider: 'TanStack',
            isVerified: true,
          },
        ],
        playground: {
          template: 'react-forms',
          title: 'Build a Validated Form',
          description: 'Create a form with React Hook Form and Zod.',
        },
      },
      {
        id: 'react-performance',
        title: 'React Performance',
        description: 'memo, lazy loading, virtualization, and profiling tools.',
        order: 6,
        estimatedMinutes: 150,
        difficulty: 'advanced',
        xpReward: 30,
        keyTakeaways: [
          'React.memo and when it helps',
          'Code splitting with lazy/Suspense',
          'List virtualization',
          'React DevTools Profiler',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React Performance Docs',
            url: 'https://react.dev/learn/render-and-commit',
            provider: 'React',
            isVerified: true,
          },
          {
            type: 'article',
            title: 'React Performance Optimization Guide',
            url: 'https://react.dev/learn/render-and-commit',
            provider: 'React',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'fullstack',
    key: 'fullstack',
    name: 'Full Stack Mastery',
    description: 'Integrate everything: architecture, real-time, deployment, and CI/CD.',
    order: 5,
    estimatedHours: 50,
    estimatedHoursRange: '30-45 hrs',
    icon: 'Layers',
    color: 'emerald',
    isFastTrackModule: true,
    outcomes: [
      'Connect React frontend to Express backend with typed API client',
      'Implement real-time features with Socket.io',
      'Deploy full MERN stack: MongoDB Atlas, Render/Railway, Vercel',
      'Set up CI/CD pipeline with GitHub Actions',
    ],
    capstoneProject: {
      title: 'TeamBoard — Real-Time Collaboration App',
      description: 'A Trello-like board with real-time updates, drag-and-drop, authentication, and full deployment pipeline.',
      liveDemoUrl: 'https://teamboard.vercel.app',
      repoUrl: 'https://github.com/yourusername/teamboard',
      techStack: ['React 19', 'React Router', 'TanStack Query', 'Tailwind', 'Node 20', 'Express', 'Socket.io', 'Mongoose', 'Zod', 'Vitest', 'MongoDB Atlas', 'Render', 'Vercel', 'GitHub Actions'],
      portfolioChecklist: [
        'Live deployment on Vercel/Render/Neon (not localhost)',
        'README with: problem statement, architecture diagram, tech stack, setup instructions, demo credentials',
        'GitHub repo with clean commit history (no single "initial commit" dumps)',
        'At least 3 meaningful integration tests (auth, CRUD, real-time)',
        'CI pipeline (GitHub Actions) running tests on every push',
        'Error handling: loading, empty, and error states on every data screen',
        'Mobile-responsive layout (375px, 768px, 1440px breakpoints)',
        'Accessibility basics: semantic HTML, labels, contrast, focus management',
        '30-second demo video or GIF of the core user flow',
      ],
      difficultyNote: 'Fast-track: 2-3 weeks · Deep-dive: 4-6 weeks',
    },
    lessons: [
      {
        id: 'fullstack-architecture',
        title: 'Project Architecture & Monorepo',
        description: 'Structuring full stack apps: folders, env config, and shared types.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'intermediate',
        xpReward: 20,
        keyTakeaways: [
          'Monorepo vs separate repos',
          'Environment configuration',
          'Sharing types between client and server',
          'Project folder conventions',
        ],
        resources: [
          {
            type: 'article',
            title: 'Monorepo Explained',
            url: 'https://monorepo.tools/',
            provider: 'monorepo.tools',
            isVerified: true,
          },
        ],
      },
      {
        id: 'fullstack-integration',
        title: 'Connecting Frontend & Backend',
        description: 'CORS, proxies, cookies, auth flows, and API client patterns.',
        order: 2,
        estimatedMinutes: 150,
        difficulty: 'intermediate',
        xpReward: 25,
        keyTakeaways: [
          'CORS explained and configured',
          'Cookie-based vs token-based auth flows',
          'Building a typed API client',
          'Handling loading and error states',
        ],
        resources: [
          {
            type: 'article',
            title: 'What Is CORS?',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
            provider: 'MDN',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'Connecting React to Express',
            url: 'https://www.youtube.com/watch?v=v0t42xBIYIs',
            provider: 'Web Dev Simplified',
            duration: '30 min',
          },
        ],
        playground: {
          template: 'fullstack-client',
          title: 'Build a Typed API Client',
          description: 'Create a fetch wrapper with error handling for your Express API.',
        },
      },
      {
        id: 'fullstack-realtime',
        title: 'Real-time with Socket.io',
        description: 'WebSockets, rooms, events, and building a real-time chat.',
        order: 3,
        estimatedMinutes: 180,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'WebSockets vs HTTP polling',
          'Socket.io server and client setup',
          'Rooms and namespaces',
          'Scaling real-time apps',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Socket.io Official Tutorial',
            url: 'https://socket.io/get-started/chat',
            provider: 'Socket.io',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'Socket.io Crash Course',
            url: 'https://www.youtube.com/watch?v=ZKEqqIO7n-k',
            provider: 'Traversy Media',
            duration: '45 min',
          },
        ],
      },
      {
        id: 'fullstack-uploads',
        title: 'File Uploads',
        description: 'Multer, validation, and cloud storage with Cloudinary.',
        order: 4,
        estimatedMinutes: 150,
        difficulty: 'intermediate',
        xpReward: 25,
        keyTakeaways: [
          'Handling multipart/form-data',
          'Multer storage engines',
          'Validating file types and sizes',
          'Uploading to Cloudinary',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Express Multer Docs',
            url: 'https://expressjs.com/en/resources/middleware/multer.html',
            provider: 'Express',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'Cloudinary Node.js SDK',
            url: 'https://cloudinary.com/documentation/node_integration',
            provider: 'Cloudinary',
            isVerified: true,
          },
        ],
      },
      {
        id: 'fullstack-deployment',
        title: 'Deployment & CI/CD',
        description: 'Deploy MERN apps: MongoDB Atlas, Render/Railway, Vercel, and GitHub Actions.',
        order: 5,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'MongoDB Atlas setup',
          'Deploying Express to Render/Railway',
          'Deploying React to Vercel/Netlify',
          'Environment variables in production',
          'GitHub Actions CI/CD pipeline',
        ],
        resources: [
          {
            type: 'docs',
            title: 'MongoDB Atlas Getting Started',
            url: 'https://www.mongodb.com/docs/atlas/getting-started/',
            provider: 'MongoDB',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Deploy to Render',
            url: 'https://docs.render.com/deploy-node-express-app',
            provider: 'Render',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'GitHub Actions Quickstart',
            url: 'https://docs.github.com/en/actions/quickstart',
            provider: 'GitHub',
            isVerified: true,
          },
        ],
        playground: {
          template: 'docker-basics',
          title: 'Dockerize a MERN App',
          description: 'Write a Dockerfile for an Express app.',
        },
      },
      {
        id: 'fullstack-project',
        title: 'Capstone: Full Stack App',
        description: 'Build and deploy a complete MERN application with auth, CRUD, and real-time features.',
        order: 6,
        estimatedMinutes: 600,
        difficulty: 'advanced',
        xpReward: 100,
        keyTakeaways: [
          'End-to-end MERN architecture',
          'Authentication and authorization',
          'CRUD operations with Mongoose',
          'Deployment pipeline',
          'Writing documentation',
        ],
        resources: [
          {
            type: 'project',
            title: 'MERN Stack Tutorial: Build a Blog',
            url: 'https://www.youtube.com/watch?v=CvCiNeLnZ00',
            provider: 'Traversy Media',
            duration: '4 hours',
          },
          {
            type: 'project',
            title: 'Build a MERN E-commerce Store',
            url: 'https://www.freecodecamp.org/news/search/?query=build+mern+ecommerce',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
        // Portfolio / Fast-Track metadata
        isProject: true,
        portfolioChecklist: [
          'Live deployment on Vercel/Render/Neon (not localhost)',
          'README with: problem statement, architecture diagram, tech stack, setup instructions, demo credentials',
          'GitHub repo with clean commit history (no single "initial commit" dumps)',
          'At least 3 meaningful integration tests (auth, CRUD, real-time)',
          'CI pipeline (GitHub Actions) running tests on every push',
          'Error handling: loading, empty, and error states on every data screen',
          'Mobile-responsive layout (375px, 768px, 1440px breakpoints)',
          'Accessibility basics: semantic HTML, labels, contrast, focus management',
          '30-second demo video or GIF of the core user flow',
        ],
        liveDemoUrl: 'https://teamboard.vercel.app',
        repoUrl: 'https://github.com/yourusername/teamboard',
        architectureDiagram: `Client (React + TanStack Query) → API (Express + Socket.io) → MongoDB Atlas
                                    ↘ WebSocket (real-time)         ↘ Redis (optional, for scaling)`,
        techStack: ['React 19', 'React Router', 'TanStack Query', 'Tailwind', 'Node 20', 'Express', 'Socket.io', 'Mongoose', 'Zod', 'Vitest', 'MongoDB Atlas', 'Render', 'Vercel', 'GitHub Actions'],
        difficultyNote: 'Fast-track: 2-3 weeks · Deep-dive: 4-6 weeks',
      },
    ],
  },
]

// ============================================================
// MASTERY MODULES (developer track — after the core MERN modules)
// ============================================================

const masteryModules: Module[] = [
  {
    id: 'typescript',
    key: 'typescript',
    name: 'TypeScript',
    description: 'Static types across the whole stack: fundamentals, typed Express APIs, React with TypeScript, and end-to-end type safety.',
    order: 5,
    estimatedHours: 12,
    estimatedHoursRange: '20-30 hrs',
    icon: 'FileCode',
    color: 'blue',
    status: 'advanced' as ModuleStatus,
    outcomes: [
      'Add static types to JavaScript projects with confidence',
      'Type Express APIs end-to-end with Zod schema inference',
      'Write type-safe React components, hooks, and forms',
      'Share types across client and server for contract-first development',
    ],
    lessons: [
      {
        id: 'typescript-foundations',
        title: 'TypeScript Fundamentals for JS Developers',
        description: 'Types, interfaces, unions, narrowing, generics, and a strict tsconfig — everything a JavaScript developer needs to start writing TypeScript.',
        order: 1,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'Type inference and annotations',
          'Interfaces vs type aliases',
          'Union types and narrowing',
          'Generics basics',
          'Strict mode in tsconfig',
        ],
        resources: [
          {
            type: 'docs',
            title: 'TypeScript Handbook',
            url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
            provider: 'TypeScript',
            isVerified: true,
          },
          {
            type: 'article',
            title: 'TypeScript for JavaScript Programmers',
            url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
            provider: 'TypeScript',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'TypeScript for Beginners (free tutorial)',
            url: 'https://www.totaltypescript.com/tutorials/beginners-typescript',
            provider: 'Total TypeScript',
          },
        ],
      },
      {
        id: 'typescript-express',
        title: 'Typing Express APIs',
        description: 'Type requests, responses, middleware, and errors — then derive validation types from Zod so the API and its types never drift apart.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'Request and Response generics',
          'Typed middleware and request augmentation',
          'Inferring types from Zod schemas',
          'Typing Mongoose models',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Mongoose: TypeScript Support',
            url: 'https://mongoosejs.com/docs/typescript.html',
            provider: 'Mongoose',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Zod Documentation',
            url: 'https://zod.dev',
            provider: 'Zod',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'The tsconfig Reference',
            url: 'https://www.typescriptlang.org/tsconfig',
            provider: 'TypeScript',
            isVerified: true,
          },
        ],
      },
      {
        id: 'typescript-react',
        title: 'TypeScript in React',
        description: 'Type props, state, events, refs, and context — plus discriminated unions for UI state and form types inferred from Zod.',
        order: 3,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'Typing props, children, and events',
          'Generic hooks and refs',
          'Discriminated unions for UI state',
          'Form types with React Hook Form + Zod',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React TypeScript Cheatsheet',
            url: 'https://react-typescript-cheatsheet.netlify.app/',
            provider: 'Community',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'React with TypeScript (free tutorial)',
            url: 'https://www.totaltypescript.com/tutorials/react-with-typescript',
            provider: 'Total TypeScript',
          },
          {
            type: 'docs',
            title: 'Using TypeScript (React docs)',
            url: 'https://react.dev/learn/typescript',
            provider: 'React',
            isVerified: true,
          },
        ],
      },
      {
        id: 'typescript-fullstack',
        title: 'End-to-End Type Safety',
        description: 'Share types across client and server: a typed API client, contract-first development, schema-derived types, and an honest look at tRPC.',
        order: 4,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Sharing types through a workspace package',
          'A fully typed API client',
          'Contract-first development with Zod',
          'When tRPC or codegen earns its place',
        ],
        resources: [
          {
            type: 'docs',
            title: 'tRPC Documentation',
            url: 'https://trpc.io/docs/',
            provider: 'tRPC',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'OpenAPI TypeScript Generator',
            url: 'https://github.com/ferdikoomen/openapi-typescript-codegen',
            provider: 'OpenAPI TypeScript',
          },
        ],
      },
    ],
  },
  {
    id: 'testing',
    key: 'testing',
    name: 'Testing in Depth',
    description: 'From the testing trophy to Playwright: unit tests, API integration tests, component tests, and end-to-end coverage that runs in CI. Covers fundamentals; mastery takes months of practice.',
    order: 6,
    estimatedHours: 14,
    estimatedHoursRange: '25-40 hrs',
    icon: 'FlaskConical',
    color: 'rose',
    status: 'advanced' as ModuleStatus,
    outcomes: [
      'Write unit tests with Vitest that catch real bugs',
      'Build API integration tests with Supertest and in-memory databases',
      'Test React components with Testing Library and MSW',
      'Run end-to-end tests in CI with Playwright',
    ],
    lessons: [
      {
        id: 'testing-strategy',
        title: 'Testing Strategy & Unit Tests',
        description: 'What to test and why: the testing trophy, writing unit tests with Vitest, mocking without lying to yourself, and using coverage as a map.',
        order: 1,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'The testing trophy and where to invest',
          'Vitest setup and API',
          'Mocks, spies, and test doubles',
          'Coverage as a signal, not a score',
        ],
        resources: [
          {
            type: 'article',
            title: 'The Testing Trophy and Testing Classifications',
            url: 'https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications',
            provider: 'Kent C. Dodds',
          },
          {
            type: 'docs',
            title: 'Vitest Guide',
            url: 'https://vitest.dev/guide/',
            provider: 'Vitest',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Vitest Mocking Guide',
            url: 'https://vitest.dev/guide/mocking',
            provider: 'Vitest',
            isVerified: true,
          },
        ],
      },
      {
        id: 'testing-api-integration',
        title: 'API Integration Testing',
        description: 'Test the real request pipeline with Supertest and an in-memory database: factories, seeders, auth flows, and clean isolation.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'Supertest request patterns',
          'In-memory MongoDB for fast, isolated runs',
          'Test factories and seed helpers',
          'Testing auth and error paths',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Supertest',
            url: 'https://github.com/ladjs/supertest',
            provider: 'GitHub',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'mongodb-memory-server',
            url: 'https://github.com/typegoose/mongodb-memory-server',
            provider: 'GitHub',
            isVerified: true,
          },
        ],
      },
      {
        id: 'testing-react-components',
        title: 'Testing React Components',
        description: 'React Testing Library done right: querying like a user, simulating interactions, mocking the network with MSW, and asserting accessibility.',
        order: 3,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'User-centered queries with Testing Library',
          'Interactions with user-event',
          'Network mocking with MSW',
          'Testing loading, error, and empty states',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React Testing Library',
            url: 'https://testing-library.com/docs/react-testing-library/intro/',
            provider: 'Testing Library',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'user-event',
            url: 'https://testing-library.com/docs/user-event/intro/',
            provider: 'Testing Library',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Mock Service Worker (MSW)',
            url: 'https://mswjs.io/docs/',
            provider: 'MSW',
            isVerified: true,
          },
        ],
      },
      {
        id: 'testing-e2e-playwright',
        title: 'End-to-End Testing with Playwright',
        description: 'Drive a real browser: locators, auto-waiting, authentication state, network mocking, trace viewer debugging, and a CI-ready pipeline.',
        order: 4,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Playwright setup and project structure',
          'Locators and auto-waiting',
          'Reusable auth state and fixtures',
          'Debugging with traces in CI',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Playwright: Getting Started',
            url: 'https://playwright.dev/docs/intro',
            provider: 'Playwright',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Playwright: Continuous Integration',
            url: 'https://playwright.dev/docs/ci',
            provider: 'Playwright',
            isVerified: true,
          },
          {
            type: 'video',
            title: 'Playwright YouTube Channel',
            url: 'https://www.youtube.com/@Playwrightdev',
            provider: 'Playwright',
          },
        ],
      },
    ],
  },
  {
    id: 'security',
    key: 'security',
    name: 'Security',
    description: 'Think like an attacker and defend like an engineer: web vulnerabilities, API hardening, advanced auth, and protecting stored data. Covers fundamentals; mastery takes months of practice.',
    order: 7,
    estimatedHours: 13,
    estimatedHoursRange: '25-35 hrs',
    icon: 'ShieldCheck',
    color: 'amber',
    status: 'advanced' as ModuleStatus,
    outcomes: [
      'Identify and prevent OWASP Top 10 vulnerabilities (XSS, CSRF, injection)',
      'Harden Express APIs with Helmet, rate limiting, and validation',
      'Implement advanced auth: refresh tokens, 2FA/TOTP, OAuth 2.0',
      'Protect data with encryption, least-privilege DB users, and audit logs',
    ],
    lessons: [
      {
        id: 'security-web-fundamentals',
        title: 'Web Security Fundamentals',
        description: 'The threat landscape every developer must know: XSS, CSRF, injection, clickjacking, and the headers, cookies, and policies that stop them.',
        order: 1,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'The OWASP Top 10 in practice',
          'XSS, CSRF, and injection attacks',
          'Secure cookies and session rules',
          'CSP, CORS, and security headers',
        ],
        resources: [
          {
            type: 'docs',
            title: 'OWASP Top 10',
            url: 'https://owasp.org/www-project-top-ten/',
            provider: 'OWASP',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'MDN: Web Security',
            url: 'https://developer.mozilla.org/en-US/docs/Web/Security',
            provider: 'MDN',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'OWASP Cheat Sheet Series',
            url: 'https://cheatsheetseries.owasp.org/',
            provider: 'OWASP',
            isVerified: true,
          },
        ],
      },
      {
        id: 'security-express-hardening',
        title: 'Hardening Express APIs',
        description: 'Lock the API down: security headers with Helmet, rate limiting, input validation at the edge, secret handling, and dependency hygiene.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Helmet and secure headers',
          'Rate limiting and brute-force protection',
          'Validation, sanitization, and mass assignment',
          'Safe logging and dependency audits',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Node.js Security Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html',
            provider: 'OWASP',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Helmet',
            url: 'https://helmetjs.github.io',
            provider: 'Helmet',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'express-rate-limit',
            url: 'https://github.com/express-rate-limit/express-rate-limit',
            provider: 'GitHub',
            isVerified: true,
          },
        ],
      },
      {
        id: 'security-auth-advanced',
        title: 'Advanced Authentication',
        description: 'Beyond basic JWT: refresh token rotation, session invalidation, 2FA with TOTP, OAuth 2.0 flows, and role-based access control.',
        order: 3,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Access + refresh token architecture',
          'Token revocation and session invalidation',
          'Two-factor authentication with TOTP',
          'OAuth 2.0 and OIDC at a working level',
        ],
        resources: [
          {
            type: 'docs',
            title: 'OWASP Authentication Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
            provider: 'OWASP',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Refresh Token Rotation',
            url: 'https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation',
            provider: 'Auth0',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'WebAuthn Guide',
            url: 'https://webauthn.guide',
            provider: 'WebAuthn Guide',
          },
        ],
      },
      {
        id: 'security-data-protection',
        title: 'Data Protection & MongoDB Security',
        description: 'Guard the data layer: NoSQL operator injection, least-privilege database users, encryption, backups, and handling personal data responsibly.',
        order: 4,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'NoSQL injection and operator attacks',
          'Least-privilege database users and network rules',
          'Encryption in transit and at rest',
          'Backups, audit logs, and PII discipline',
        ],
        resources: [
          {
            type: 'docs',
            title: 'MongoDB Security Checklist',
            url: 'https://www.mongodb.com/docs/manual/administration/security-checklist/',
            provider: 'MongoDB',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'MongoDB: Encryption at Rest',
            url: 'https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/',
            provider: 'MongoDB',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'devops',
    key: 'devops',
    name: 'DevOps',
    description: 'Ship and operate with confidence: containers in depth, production CI/CD, observability, and scaling past a single server. Covers fundamentals; mastery takes months of practice.',
    order: 8,
    estimatedHours: 11,
    estimatedHoursRange: '20-30 hrs',
    icon: 'Container',
    color: 'cyan',
    status: 'advanced' as ModuleStatus,
    outcomes: [
      'Dockerize full-stack apps with multi-stage builds and Compose',
      'Build production CI/CD pipelines with environments and rollbacks',
      'Add observability: structured logging, metrics, tracing, and alerts',
      'Scale horizontally with zero-downtime deployments',
    ],
    lessons: [
      {
        id: 'devops-docker-deep',
        title: 'Docker & Containers in Depth',
        description: 'Understand what containers really are: images and layers, caching, multi-stage builds, Compose for the full stack, and production images.',
        order: 1,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'Images, layers, and the build cache',
          'Multi-stage builds for small images',
          'Docker Compose for the MERN stack',
          'Production image practices',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Docker: Get Started',
            url: 'https://docs.docker.com/get-started/',
            provider: 'Docker',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Multi-stage Builds',
            url: 'https://docs.docker.com/build/building/multi-stage/',
            provider: 'Docker',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'Docker Get Started Tutorial',
            url: 'https://docs.docker.com/get-started/',
            provider: 'Docker',
            isVerified: true,
          },
        ],
      },
      {
        id: 'devops-cicd-production',
        title: 'Production CI/CD',
        description: 'Take the pipeline to production: environments and promotion, deployment strategies, database migrations, feature flags, and fast rollbacks.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Dev/staging/production environments',
          'Rolling, blue-green, and canary deploys',
          'Migrations and backwards-compatible schema changes',
          'Rollbacks and deploy hygiene',
        ],
        resources: [
          {
            type: 'docs',
            title: 'GitHub Actions Documentation',
            url: 'https://docs.github.com/en/actions',
            provider: 'GitHub',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Deploying with GitHub Actions',
            url: 'https://docs.github.com/en/actions/deployment/about-deployments/deploying-with-github-actions',
            provider: 'GitHub',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Render: Deploys',
            url: 'https://docs.render.com/deploys',
            provider: 'Render',
          },
        ],
      },
      {
        id: 'devops-observability-scaling',
        title: 'Observability & Scaling',
        description: 'Know what production is doing: structured logging, metrics, tracing, alerts — then scale horizontally without downtime.',
        order: 3,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Structured logging and correlation IDs',
          'Metrics, tracing, and what to alert on',
          'Error tracking with Sentry',
          'Horizontal scaling and zero-downtime deploys',
        ],
        resources: [
          {
            type: 'docs',
            title: 'What is OpenTelemetry?',
            url: 'https://opentelemetry.io/docs/what-is-opentelemetry/',
            provider: 'OpenTelemetry',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Sentry for Node.js',
            url: 'https://docs.sentry.io/platforms/node/',
            provider: 'Sentry',
            isVerified: true,
          },
          {
            type: 'article',
            title: 'The Twelve-Factor App',
            url: 'https://12factor.net',
            provider: '12factor.net',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'architecture',
    key: 'architecture',
    name: 'Architecture & System Design',
    description: 'Design systems that last: modular architecture, background jobs and caching, evolving APIs, and data modeling at scale. Covers fundamentals; mastery takes months of practice.',
    order: 9,
    estimatedHours: 12,
    estimatedHoursRange: '20-30 hrs',
    icon: 'Network',
    color: 'indigo',
    status: 'advanced' as ModuleStatus,
    outcomes: [
      'Design modular monoliths and extract services when justified',
      'Implement background jobs with BullMQ and Redis',
      'Design caching layers with invalidation strategies',
      'Model data for access patterns at scale',
    ],
    lessons: [
      {
        id: 'architecture-system-design',
        title: 'System Design for MERN Developers',
        description: 'Monoliths, services, and the tradeoffs between them: background jobs with BullMQ, caching layers, queues, and when to reach for each.',
        order: 1,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Modular monoliths vs services',
          'Background jobs and queues with BullMQ',
          'Caching layers and invalidation',
          'A vocabulary for system design interviews',
        ],
        resources: [
          {
            type: 'project',
            title: 'The System Design Primer',
            url: 'https://github.com/donnemartin/system-design-primer',
            provider: 'GitHub',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'BullMQ Documentation',
            url: 'https://docs.bullmq.io',
            provider: 'BullMQ',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Redis Documentation',
            url: 'https://redis.io/docs/latest/',
            provider: 'Redis',
            isVerified: true,
          },
        ],
      },
      {
        id: 'architecture-api-evolution',
        title: 'API Design at Scale',
        description: 'APIs that survive their clients: versioning, pagination and filtering conventions, idempotency, webhooks, and contract discipline.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Versioning strategies and deprecation',
          'Consistent pagination, filtering, and errors',
          'Idempotency keys for safe retries',
          'Webhooks done reliably',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Stripe: Idempotent Requests',
            url: 'https://docs.stripe.com/api/idempotent_requests',
            provider: 'Stripe',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Stripe: Webhook Best Practices',
            url: 'https://docs.stripe.com/webhooks/best-practices',
            provider: 'Stripe',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'GitHub REST API Versioning',
            url: 'https://docs.github.com/en/rest/about-the-rest-api/api-versions',
            provider: 'GitHub',
            isVerified: true,
          },
        ],
      },
      {
        id: 'architecture-data-modeling',
        title: 'Advanced Data Modeling',
        description: 'Model for the queries you will actually run: embed vs reference at scale, index strategy, transactions, migrations, and denormalization.',
        order: 3,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Schema design from access patterns',
          'Embed vs reference at scale',
          'Transactions and consistency choices',
          'Schema migrations without downtime',
        ],
        resources: [
          {
            type: 'docs',
            title: 'MongoDB: Data Modeling',
            url: 'https://www.mongodb.com/docs/manual/data-modeling/',
            provider: 'MongoDB',
            isVerified: true,
          },
          {
            type: 'article',
            title: '6 Rules of Thumb for MongoDB Schema Design',
            url: 'https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1',
            provider: 'MongoDB',
          },
          {
            type: 'docs',
            title: 'Mongoose: Transactions',
            url: 'https://mongoosejs.com/docs/transactions.html',
            provider: 'Mongoose',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'performance',
    key: 'performance',
    name: 'Performance Engineering',
    description: 'Measure, then make it fast everywhere: Node.js internals, database queries, and frontend delivery with caching.',
    order: 10,
    estimatedHours: 11,
    estimatedHoursRange: '20-30 hrs',
    icon: 'Gauge',
    color: 'violet',
    status: 'advanced' as ModuleStatus,
    outcomes: [
      'Profile Node.js apps and fix memory leaks',
      'Optimize MongoDB queries with indexes and explain plans',
      'Improve Core Web Vitals: images, fonts, bundles, caching',
      'Implement Redis cache-aside patterns with invalidation',
    ],
    lessons: [
      {
        id: 'performance-node-runtime',
        title: 'Node.js Performance',
        description: 'Understand the event loop, find the slow code with profiling, hunt memory leaks, and stream instead of buffering.',
        order: 1,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'The event loop and blocking code',
          'Profiling with node --prof and Clinic.js',
          'Finding and fixing memory leaks',
          'Streams and worker threads',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Node.js: The Event Loop',
            url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
            provider: 'Node.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Clinic.js',
            url: 'https://clinicjs.org',
            provider: 'NearForm',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Node.js: Performance Measurement APIs',
            url: 'https://nodejs.org/api/perf_hooks.html',
            provider: 'Node.js',
            isVerified: true,
          },
        ],
      },
      {
        id: 'performance-database',
        title: 'Database Performance',
        description: 'Indexes, explain plans, and query shape: make MongoDB fast on purpose instead of by accident.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Reading explain() plans',
          'Compound, covered, and partial indexes',
          'Aggregation pipeline optimization',
          'Projection, lean(), and pooling',
        ],
        resources: [
          {
            type: 'docs',
            title: 'MongoDB: Indexes',
            url: 'https://www.mongodb.com/docs/manual/indexes/',
            provider: 'MongoDB',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'MongoDB: Explain Results',
            url: 'https://www.mongodb.com/docs/manual/reference/explain-results/',
            provider: 'MongoDB',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Mongoose: Lean',
            url: 'https://mongoosejs.com/docs/tutorials/lean.html',
            provider: 'Mongoose',
            isVerified: true,
          },
        ],
      },
      {
        id: 'performance-frontend-delivery',
        title: 'Frontend Delivery & Caching',
        description: 'Core Web Vitals, images, fonts, and bundles — then HTTP caching, CDNs, and Redis cache-aside patterns that serve answers before computing them.',
        order: 3,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Core Web Vitals and how to improve them',
          'Image, font, and bundle delivery',
          'HTTP caching, CDNs, and cache headers',
          'Cache-aside with Redis and invalidation',
        ],
        resources: [
          {
            type: 'article',
            title: 'Core Web Vitals',
            url: 'https://web.dev/articles/vitals',
            provider: 'web.dev',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'Learn Performance',
            url: 'https://web.dev/learn/performance',
            provider: 'web.dev',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'MDN: HTTP Caching',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
            provider: 'MDN',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'capstone',
    key: 'capstone',
    name: 'Master Capstone',
    description: 'The final build: a multi-tenant SaaS application — then ship it, document it, and use it to open doors.',
    order: 11,
    estimatedHours: 19,
    estimatedHoursRange: '40-60 hrs',
    icon: 'Rocket',
    color: 'emerald',
    status: 'advanced' as ModuleStatus,
    isCapstone: true,
    outcomes: [
      'Build a production-grade multi-tenant SaaS with orgs, roles, and billing',
      'Implement audit logs, background jobs, and real-time features',
      'Deploy with monitoring, health checks, and CI/CD',
      'Write a compelling case study that opens doors',
    ],
    capstoneProject: {
      title: 'PulseBoard — Multi-Tenant SaaS Platform',
      description: 'A production-grade multi-tenant collaboration platform with organizations, role-based access, invites, audit logs, background jobs, and a billing stub.',
      liveDemoUrl: 'https://pulseboard.vercel.app',
      repoUrl: 'https://github.com/yourusername/pulseboard',
      techStack: ['React 19', 'React Router', 'TanStack Query', 'Tailwind', 'Node 20', 'Express', 'Socket.io', 'BullMQ', 'Mongoose', 'Zod', 'Vitest', 'Playwright', 'MongoDB Atlas', 'Redis', 'Render', 'Vercel', 'GitHub Actions', 'Stripe'],
      portfolioChecklist: [
        'Live deployment with health monitoring endpoint',
        'README with: multi-tenant problem statement, architecture diagram, tech stack, setup instructions, demo credentials',
        'GitHub repo with clean, incremental commit history showing progression',
        'Cross-tenant isolation tests proving data separation (critical for SaaS)',
        'CI pipeline with test + lint + type-check on every push',
        'Four states (loading, empty, error, success) on every data screen',
        'Mobile-responsive at 375px, 768px, 1440px',
        'Accessibility: semantic HTML, labels, ARIA where needed, keyboard navigation',
        '3-minute demo video showing: signup → org creation → invite member → core feature flow',
        'Case study document: problem, constraints, decisions, outcome, what you\'d change',
      ],
      difficultyNote: 'Fast-track: 3-4 weeks · Deep-dive: 6-8 weeks',
    },
    lessons: [
      {
        id: 'capstone-saas-app',
        title: 'Master Project: Multi-Tenant SaaS',
        description: 'Build a production-grade SaaS: organizations and memberships, role-based access, invites, audit logs, background jobs, and a billing stub.',
        order: 1,
        estimatedMinutes: 900,
        difficulty: 'advanced',
        xpReward: 120,
        keyTakeaways: [
          'Multi-tenant data modeling and isolation',
          'Roles, invites, and organization scoping',
          'Audit logs and background jobs',
          'A production deployment with monitoring',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Multi-tenant SaaS Architecture Approaches',
            url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/overview',
            provider: 'Microsoft',
          },
          {
            type: 'docs',
            title: 'Stripe Billing Quickstart',
            url: 'https://docs.stripe.com/billing/quickstart',
            provider: 'Stripe',
            isVerified: true,
          },
          {
            type: 'project',
            title: 'Build a MERN E-commerce Store',
            url: 'https://www.freecodecamp.org/news/search/?query=build+mern+ecommerce',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
        // Portfolio / Fast-Track metadata
        isProject: true,
        portfolioChecklist: [
          'Live deployment with health monitoring endpoint',
          'README with: multi-tenant problem statement, architecture diagram, tech stack, setup instructions, demo credentials',
          'GitHub repo with clean, incremental commit history showing progression',
          'Cross-tenant isolation tests proving data separation (critical for SaaS)',
          'CI pipeline with test + lint + type-check on every push',
          'Four states (loading, empty, error, success) on every data screen',
          'Mobile-responsive at 375px, 768px, 1440px',
          'Accessibility: semantic HTML, labels, ARIA where needed, keyboard navigation',
          '3-minute demo video showing: signup → org creation → invite member → core feature flow',
          'Case study document: problem, constraints, decisions, outcome, what you\'d change',
        ],
        liveDemoUrl: 'https://pulseboard.vercel.app',
        repoUrl: 'https://github.com/yourusername/pulseboard',
        architectureDiagram: `Client (React + TanStack Query) → API (Express + Socket.io + BullMQ) → MongoDB Atlas
                                    ↘ WebSocket (real-time)          ↘ Redis (queue + cache)
                                    ↘ Worker (background jobs)       ↘ Stripe (billing stub)`,
        techStack: ['React 19', 'React Router', 'TanStack Query', 'Tailwind', 'Node 20', 'Express', 'Socket.io', 'BullMQ', 'Mongoose', 'Zod', 'Vitest', 'Playwright', 'MongoDB Atlas', 'Redis', 'Render', 'Vercel', 'GitHub Actions', 'Stripe'],
        difficultyNote: 'Fast-track: 3-4 weeks · Deep-dive: 6-8 weeks',
      },
      {
        id: 'capstone-portfolio-career',
        title: 'Portfolio, Open Source & Career',
        description: 'Turn projects into opportunities: READMEs that get read, contributions that get merged, and interview preparation that works.',
        order: 2,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'READMEs and DX that reviewers notice',
          'Contributing to open source the practical way',
          'A portfolio that tells one clear story',
          'System design and coding interview preparation',
        ],
        resources: [
          {
            type: 'article',
            title: 'How to Write a Good README',
            url: 'https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'How to Contribute to Open Source',
            url: 'https://opensource.guide/how-to-contribute/',
            provider: 'Open Source Guides',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Tech Interview Handbook',
            url: 'https://www.techinterviewhandbook.org',
            provider: 'Tech Interview Handbook',
            isVerified: true,
          },
        ],
      },
    ],
  },
]

// ============================================================
// FIRST CLIENT TRACK (8-week freelancing system)
// ============================================================

const firstClientModules: Module[] = [
  {
    id: 'client-m1-offer',
    key: 'offer-positioning',
    name: 'Week 1: Offer & Positioning',
    description: 'Define your high-value freelance offer, select a profitable niche, and price your services for international clients.',
    order: 1,
    estimatedHours: 10,
    icon: 'Briefcase',
    color: 'indigo',
    lessons: [
      {
        id: 'client-niche-selection',
        title: 'Choosing a Profitable Freelance Niche',
        description: 'Why generalists struggle and specialists thrive. How to position yourself around business outcomes, not just code.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'The problem with "full stack developer for hire"',
          'Matching technical skills to business problems (e.g. e-commerce conversion, SaaS dashboards)',
          'Targeting international clients on platforms and direct outreach',
        ],
        resources: [
          {
            type: 'article',
            title: 'The Positioning Manual for Technical Freelancers',
            url: 'https://www.freecodecamp.org/news/freelance-web-developer-guide/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
      },
      {
        id: 'client-pricing-strategy',
        title: 'Pricing for International Clients',
        description: 'Value-based pricing vs. hourly vs. fixed-scope. How to charge $1,000+ per project instead of competing on $5/hr races to the bottom.',
        order: 2,
        estimatedMinutes: 150,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'Why hourly pricing punishes efficiency',
          'How to calculate project fees based on client ROI',
          'Handling currency conversion, Wise, Payoneer, and Stripe safely from emerging markets',
        ],
        resources: [
          {
            type: 'article',
            title: 'Double Your Freelancing Rate',
            url: 'https://doubleyourfreelancing.com/rate/',
            provider: 'Brennan Dunn',
          },
        ],
      },
    ],
  },
  {
    id: 'client-m2-portfolio',
    key: 'portfolio-proof',
    name: 'Week 2: Portfolio & Case Studies',
    description: 'Transform your capstone projects into compelling case studies that prove reliability and competence.',
    order: 2,
    estimatedHours: 10,
    icon: 'FileCode',
    color: 'indigo',
    lessons: [
      {
        id: 'client-case-studies',
        title: 'Writing Case Studies That Sell',
        description: 'Structure your projects around Problem → Solution → Outcome. What clients look for before hiring.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'beginner',
        xpReward: 25,
        keyTakeaways: [
          'Anatomy of a high-converting freelance portfolio piece',
          'Highlighting trade-offs, testing, and production deployments',
          'Recording a 60-second Loom walkthrough for each project',
        ],
        resources: [
          {
            type: 'article',
            title: 'How to Showcase Projects in Your Portfolio',
            url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes',
            provider: 'GitHub Guides',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'client-m3-outreach',
    key: 'outreach-channels',
    name: 'Week 3: Platforms & Cold Outreach',
    description: 'Master Upwork proposals, Contra/Fiverr profiles, and personalized cold email/DM strategies.',
    order: 3,
    estimatedHours: 12,
    icon: 'Network',
    color: 'indigo',
    lessons: [
      {
        id: 'client-upwork-mastery',
        title: 'Winning Upwork Proposals',
        description: 'How to beat 50+ applicants by focusing the first two sentences entirely on the client\'s problem.',
        order: 1,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'Spotting legitimate clients vs. time-wasters',
          'The 3-part proposal formula (Hook, Relevant Proof, Clear Call to Action)',
          'Setting up JSS (Job Success Score) foundations from day one',
        ],
        resources: [
          {
            type: 'article',
            title: 'Upwork Proposal Guide',
            url: 'https://www.upwork.com/freelancers/',
            provider: 'Upwork',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'client-m4-proposals',
    key: 'discovery-proposals',
    name: 'Week 4: Discovery Calls & Proposals',
    description: 'Run professional discovery calls, uncover hidden requirements, and send proposals that close.',
    order: 4,
    estimatedHours: 10,
    icon: 'FileCode',
    color: 'indigo',
    lessons: [
      {
        id: 'client-discovery-call',
        title: 'Running a 15-Minute Discovery Call',
        description: 'Ask the right questions, listen 80% of the time, and diagnose whether the client is a good fit.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'The BANT framework (Budget, Authority, Need, Timeline) adapted for web dev',
          'Red flags: clients who want everything yesterday for $100',
          'Transitioning from call to paid proposal',
        ],
        resources: [
          {
            type: 'article',
            title: 'The Freelance Discovery Call Blueprint',
            url: 'https://www.freecodecamp.org/news/tag/freelancing/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'client-m5-workflow',
    key: 'delivery-workflow',
    name: 'Week 5: Contracts, Milestones & Invoices',
    description: 'Protect yourself with solid contracts, milestone payments, and professional client communication.',
    order: 5,
    estimatedHours: 10,
    icon: 'ShieldCheck',
    color: 'indigo',
    lessons: [
      {
        id: 'client-contracts-invoicing',
        title: 'Contracts, Deposits & Scope Control',
        description: 'Never write a line of code without a 50% upfront deposit and a signed scope of work.',
        order: 1,
        estimatedMinutes: 150,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Essential clauses in a freelance dev contract (IP ownership, revisions cap, termination)',
          'Managing scope creep politely and profitably',
          'Invoicing and payment rails for international work',
        ],
        resources: [
          {
            type: 'docs',
            title: 'AIGA Standard Form of Agreement',
            url: 'https://www.aiga.org/standard-agreement/',
            provider: 'AIGA',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'client-m6-execution',
    key: 'project-execution',
    name: 'Week 6: Simulated Client Execution',
    description: 'Execute an end-to-end simulated client project following strict acceptance criteria and staging deploys.',
    order: 6,
    estimatedHours: 15,
    icon: 'Rocket',
    color: 'indigo',
    lessons: [
      {
        id: 'client-simulation-capstone',
        title: 'Capstone: Client Project Simulation',
        description: 'Build, test, stage, and hand off a client project with zero friction.',
        order: 1,
        estimatedMinutes: 450,
        difficulty: 'advanced',
        xpReward: 100,
        keyTakeaways: [
          'Staging environments on Vercel/Render',
          'Client feedback loops and Loom video updates',
          'Production handover and documentation',
        ],
        resources: [
          {
            type: 'project',
            title: 'Simulated Client Brief & Spec',
            url: 'https://github.com/nyxora-sync',
            provider: 'Nyxora Sync',
          },
        ],
        isProject: true,
        portfolioChecklist: [
          'Staging URL provided to client',
          'Loom video demo recorded and shared',
          'Clean handoff document with credentials and maintenance notes',
        ],
      },
    ],
  },
  {
    id: 'client-m7-retention',
    key: 'retention-upsells',
    name: 'Week 7: Retention, Upsells & Referrals',
    description: 'Turn one-off project clients into recurring monthly retainer clients and generate referral flywheels.',
    order: 7,
    estimatedHours: 8,
    icon: 'Trophy',
    color: 'indigo',
    lessons: [
      {
        id: 'client-retainers-referrals',
        title: 'Turning One-Offs into Monthly Retainers',
        description: 'Maintenance packages, SEO audits, security updates, and the 60-day post-launch check-in.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'intermediate',
        xpReward: 25,
        keyTakeaways: [
          'Structuring monthly maintenance retainers ($200-$500/mo)',
          'The exact script to ask for referrals and LinkedIn recommendations',
        ],
        resources: [
          {
            type: 'article',
            title: 'Building Recurring Revenue as a Freelancer',
            url: 'https://www.freecodecamp.org/news/freelance-web-developer-guide/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'client-m8-scale',
    key: 'systems-scale',
    name: 'Week 8: Systems & Agency Scaling',
    description: 'Build SOPs for your freelance business, automate invoicing, and decide whether to hire subcontractors.',
    order: 8,
    estimatedHours: 8,
    icon: 'Cloud',
    color: 'indigo',
    lessons: [
      {
        id: 'client-sops-scaling',
        title: 'SOPs, Automation & Scaling Solo',
        description: 'Standard Operating Procedures for client onboarding, code standards, and deployment checklists.',
        order: 1,
        estimatedMinutes: 120,
        difficulty: 'advanced',
        xpReward: 30,
        keyTakeaways: [
          'Documenting your repeatable workflow',
          'When and how to bring on a junior developer or designer contractor',
        ],
        resources: [
          {
            type: 'docs',
            title: 'The E-Myth Revisited (Summary)',
            url: 'https://www.michaelegerber.com/',
            provider: 'Michael E. Gerber',
          },
        ],
      },
    ],
  },
]


const specializationModules: Module[] = [
  {
    id: 'nextjs-advanced',
    key: 'nextjs-advanced',
    name: 'Advanced React & Next.js',
    description: 'Go beyond the React SPA: Server Components, streaming, Cache Components, Server Actions, and the deployment decisions that keep a Next.js app fast and secure.',
    order: 1,
    estimatedHours: 12,
    icon: 'Atom',
    color: 'violet',
    lessons: [
      {
        id: 'nextjs-server-components',
        title: 'App Router, Server Components & Streaming',
        description: 'Build the mental model behind Next.js: server and client boundaries, nested layouts, streaming, and when a Client Component is actually necessary.',
        order: 1,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Server and Client Component responsibilities',
          'Nested layouts, route segments, and partial rendering',
          'Streaming with Suspense and meaningful loading states',
          'Keeping secrets and heavy dependencies on the server',
          'Designing the smallest possible client boundary',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Next.js: Server and Client Components',
            url: 'https://nextjs.org/docs/app/getting-started/server-and-client-components',
            provider: 'Next.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'React: Server Components',
            url: 'https://react.dev/reference/rsc/server-components',
            provider: 'React',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'React: use client',
            url: 'https://react.dev/reference/react/use-client',
            provider: 'React',
            isVerified: true,
          },
          {
            type: 'interactive',
            title: 'Next.js Learn',
            url: 'https://nextjs.org/learn',
            provider: 'Next.js',
            isVerified: true,
          },
        ],
      },
      {
        id: 'nextjs-data-caching',
        title: 'Data Fetching, Caching & Server Actions',
        description: 'Model server data correctly with async Server Components, Cache Components, tagged revalidation, and Server Actions that validate input and authorize every mutation.',
        order: 2,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Fetching directly in Server Components',
          'Parallel data loading and request memoization',
          'use cache, cacheLife, and cacheTag',
          'Server Actions with Zod validation and authorization',
          'updateTag, revalidateTag, and optimistic UI',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Next.js: Fetching Data',
            url: 'https://nextjs.org/docs/app/getting-started/fetching-data',
            provider: 'Next.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Next.js: Caching',
            url: 'https://nextjs.org/docs/app/getting-started/caching',
            provider: 'Next.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Next.js: Revalidating',
            url: 'https://nextjs.org/docs/app/getting-started/revalidating',
            provider: 'Next.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Next.js: Server Actions and Mutations',
            url: 'https://nextjs.org/docs/app/guides/server-actions',
            provider: 'Next.js',
            isVerified: true,
          },
        ],
      },
      {
        id: 'nextjs-production',
        title: 'Production Next.js: Auth, Security & Deployment',
        description: 'Harden a Next.js app for real traffic: authentication and authorization at the server boundary, route handlers, observability, image and bundle budgets, and deployment choices.',
        order: 3,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Authentication and authorization inside the server boundary',
          'Route Handlers versus Server Actions',
          'Error handling, loading UI, and observability',
          'Security headers, image optimization, and bundle budgets',
          'Vercel versus self-hosted Node deployment trade-offs',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Next.js: Authentication',
            url: 'https://nextjs.org/docs/app/guides/authentication',
            provider: 'Next.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Next.js: Data Security',
            url: 'https://nextjs.org/docs/app/guides/data-security',
            provider: 'Next.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Next.js: Production Checklist',
            url: 'https://nextjs.org/docs/app/guides/production-checklist',
            provider: 'Next.js',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Next.js: Self-Hosting',
            url: 'https://nextjs.org/docs/app/guides/self-hosting',
            provider: 'Next.js',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'devops-cloud',
    key: 'devops-cloud',
    name: 'DevOps & Cloud',
    description: 'Take the deployment skills from the MERN core into cloud production: containers and Kubernetes, a small AWS footprint, infrastructure as code, secrets, and incident response.',
    order: 2,
    estimatedHours: 12,
    icon: 'Cloud',
    color: 'blue',
    lessons: [
      {
        id: 'devops-kubernetes',
        title: 'Kubernetes for MERN Teams',
        description: 'Move from a single container to a scheduler: Deployments, Services, Ingress, ConfigMaps, Secrets, probes, and the operational rules that keep a Node API healthy.',
        order: 1,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Pods, Deployments, Services, and Ingress',
          'ConfigMaps and Secrets without baking config into images',
          'Liveness, readiness, and startup probes',
          'Resource requests, limits, and horizontal scaling',
          'Rolling updates, rollbacks, and zero-downtime deploys',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Kubernetes Tutorials',
            url: 'https://kubernetes.io/docs/tutorials/',
            provider: 'Kubernetes',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Kubernetes: Deployments',
            url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
            provider: 'Kubernetes',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Kubernetes: ConfigMaps',
            url: 'https://kubernetes.io/docs/concepts/configuration/configmap/',
            provider: 'Kubernetes',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Kubernetes: Liveness, Readiness & Startup Probes',
            url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
            provider: 'Kubernetes',
            isVerified: true,
          },
        ],
      },
      {
        id: 'devops-aws',
        title: 'AWS for MERN: VPC, ECS, RDS & S3',
        description: 'Design a small production footprint on AWS: a VPC with public and private subnets, ECS Fargate for the API, RDS for PostgreSQL, S3 and CloudFront for assets, and IAM roles wired in safely.',
        order: 2,
        estimatedMinutes: 270,
        difficulty: 'advanced',
        xpReward: 45,
        keyTakeaways: [
          'VPC, subnets, and security groups for a two-tier app',
          'ECS Fargate behind an Application Load Balancer',
          'RDS PostgreSQL and connection pooling',
          'S3 and CloudFront for uploads and static assets',
          'IAM task roles instead of long-lived access keys',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Amazon ECS: Getting Started',
            url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started.html',
            provider: 'AWS',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Amazon RDS: Getting Started',
            url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.html',
            provider: 'AWS',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Amazon S3: Static Website Hosting',
            url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html',
            provider: 'AWS',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'AWS: Regions and Availability Zones',
            url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/regions-and-availability-zones.html',
            provider: 'AWS',
            isVerified: true,
          },
        ],
      },
      {
        id: 'devops-cloud-operations',
        title: 'Infrastructure as Code, Secrets & Incident Response',
        description: 'Make cloud infrastructure reproducible with Terraform, rotate secrets safely, define SLOs and actionable alerts, and run an incident without improvising.',
        order: 3,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Terraform state, modules, and plan/apply discipline',
          'Secrets management and rotation',
          'SLOs, error budgets, and actionable alerts',
          'Incident roles, timelines, and blameless postmortems',
          'Cost reviews and configuration drift',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Terraform: Get Started with AWS',
            url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started',
            provider: 'HashiCorp',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'AWS Secrets Manager',
            url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html',
            provider: 'AWS',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Google SRE Workbook: Incident Response',
            url: 'https://sre.google/workbook/incident-response/',
            provider: 'Google',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'scalable-systems',
    key: 'scalable-systems',
    name: 'Scalable Systems',
    description: 'Make the jump from a well-structured monolith to a system that survives scale: service boundaries, distributed data, Redis, reliable queues, and idempotent consumers.',
    order: 3,
    estimatedHours: 12,
    icon: 'Boxes',
    color: 'amber',
    lessons: [
      {
        id: 'scale-service-boundaries',
        title: 'Service Boundaries & Distributed Data',
        description: 'Decide when a modular monolith should become services, then handle the hard part: ownership, contracts, sagas, and consistency across databases.',
        order: 1,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'Extraction criteria and bounded contexts',
          'Database-per-service and contract ownership',
          'Sagas versus distributed transactions',
          'The outbox pattern and eventual consistency',
          'Versioning service contracts safely',
        ],
        resources: [
          {
            type: 'article',
            title: 'Microservices: A Definition of This New Architectural Term',
            url: 'https://martinfowler.com/articles/microservices.html',
            provider: 'Martin Fowler',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Pattern: Saga',
            url: 'https://microservices.io/patterns/data/saga.html',
            provider: 'microservices.io',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Pattern: Transactional Outbox',
            url: 'https://microservices.io/patterns/data/transactional-outbox.html',
            provider: 'microservices.io',
            isVerified: true,
          },
        ],
      },
      {
        id: 'scale-redis',
        title: 'Redis at Scale: Caching, Locks & Rate Limits',
        description: 'Use Redis for more than a cache: cache-aside, stampede control, distributed locks with fencing, rate limiting, and memory policies that do not surprise you.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'advanced',
        xpReward: 35,
        keyTakeaways: [
          'Key design, TTLs, and eviction policies',
          'Cache-aside and stampede protection',
          'Distributed locks and fencing tokens',
          'Sliding-window and token-bucket rate limits',
          'Redis persistence and failure modes',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Redis: Client-Side Patterns',
            url: 'https://redis.io/docs/latest/develop/use/patterns/',
            provider: 'Redis',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Redis: Distributed Locks',
            url: 'https://redis.io/docs/latest/develop/use/patterns/distributed-locks/',
            provider: 'Redis',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Redis: SET Command',
            url: 'https://redis.io/docs/latest/commands/set/',
            provider: 'Redis',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Redis: Sorted Sets',
            url: 'https://redis.io/docs/latest/develop/data-types/sorted-sets/',
            provider: 'Redis',
            isVerified: true,
          },
        ],
      },
      {
        id: 'scale-reliable-messaging',
        title: 'Reliable Messaging: Queues, Outbox & Idempotency',
        description: 'Make asynchronous work survive crashes and retries: at-least-once delivery, idempotency keys, the transactional outbox, dead-letter queues, and backpressure.',
        order: 3,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'At-most-once versus at-least-once delivery',
          'Transactional outbox with BullMQ or RabbitMQ',
          'Idempotent consumers and deduplication',
          'Retries, exponential backoff, and dead-letter queues',
          'Queue depth, consumer lag, and backpressure',
        ],
        resources: [
          {
            type: 'docs',
            title: 'BullMQ Documentation',
            url: 'https://docs.bullmq.io/',
            provider: 'BullMQ',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'BullMQ: Idempotent Jobs',
            url: 'https://docs.bullmq.io/patterns/idempotent-jobs',
            provider: 'BullMQ',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'BullMQ: Retrying Failing Jobs',
            url: 'https://docs.bullmq.io/guide/retrying-failing-jobs',
            provider: 'BullMQ',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'RabbitMQ Tutorials',
            url: 'https://www.rabbitmq.com/tutorials',
            provider: 'RabbitMQ',
            isVerified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'react-native',
    key: 'react-native',
    name: 'React Native',
    description: 'Take the MERN client to mobile: React Native with Expo, native navigation, secure authentication, offline data, performance, and a real App Store release.',
    order: 4,
    estimatedHours: 11,
    icon: 'Smartphone',
    color: 'rose',
    lessons: [
      {
        id: 'react-native-foundations',
        title: 'React Native & Expo Foundations',
        description: 'Transfer your React skills to mobile: native components, Flexbox layout, Expo Router, platform differences, and a development loop that runs on a real device.',
        order: 1,
        estimatedMinutes: 180,
        difficulty: 'intermediate',
        xpReward: 30,
        keyTakeaways: [
          'React Native components versus DOM elements',
          'Flexbox defaults and safe-area layout',
          'Expo project structure and development builds',
          'Platform-specific code and mobile accessibility',
          'Debugging on device and in the browser',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React Native: Getting Started',
            url: 'https://reactnative.dev/docs/getting-started',
            provider: 'React Native',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Expo: Create a Project',
            url: 'https://docs.expo.dev/get-started/create-a-project/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Expo Router: Introduction',
            url: 'https://docs.expo.dev/router/introduction/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'React Native: Core Components and APIs',
            url: 'https://reactnative.dev/docs/components-and-apis',
            provider: 'React Native',
            isVerified: true,
          },
        ],
      },
      {
        id: 'react-native-navigation-data',
        title: 'Navigation, Data & Native APIs',
        description: 'Build the app shell: file-based navigation, authenticated route groups, server-state caching, secure tokens, and native capabilities such as camera and network state.',
        order: 2,
        estimatedMinutes: 210,
        difficulty: 'intermediate',
        xpReward: 35,
        keyTakeaways: [
          'Stack and tab navigation with Expo Router',
          'Authenticated route groups and deep links',
          'Server state, caching, and optimistic updates',
          'SecureStore for tokens and sensitive values',
          'Network awareness and useful offline states',
        ],
        resources: [
          {
            type: 'docs',
            title: 'Expo Router: Introduction',
            url: 'https://docs.expo.dev/router/introduction/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Expo SecureStore',
            url: 'https://docs.expo.dev/versions/latest/sdk/securestore/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Expo Network',
            url: 'https://docs.expo.dev/versions/latest/sdk/netinfo/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'TanStack Query: React Native',
            url: 'https://tanstack.com/query/latest/docs/framework/react/react-native',
            provider: 'TanStack',
            isVerified: true,
          },
        ],
      },
      {
        id: 'react-native-production',
        title: 'Production: Auth, Offline & App Store Release',
        description: 'Ship the mobile client: OAuth with PKCE, refresh-token rotation, offline-first sync, performance budgets, EAS builds, and store review.',
        order: 3,
        estimatedMinutes: 240,
        difficulty: 'advanced',
        xpReward: 40,
        keyTakeaways: [
          'OAuth PKCE and secret storage on mobile',
          'Refresh-token rotation and complete logout',
          'Offline-first reads, writes, and conflict handling',
          'List and startup performance profiling',
          'EAS builds, signing, store review, and updates',
        ],
        resources: [
          {
            type: 'docs',
            title: 'React Native: Security',
            url: 'https://reactnative.dev/docs/security',
            provider: 'React Native',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Expo: Authentication',
            url: 'https://docs.expo.dev/versions/latest/sdk/auth-session/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Expo: EAS Build',
            url: 'https://docs.expo.dev/build/introduction/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'Expo: Submit to App Stores',
            url: 'https://docs.expo.dev/submit/introduction/',
            provider: 'Expo',
            isVerified: true,
          },
          {
            type: 'docs',
            title: 'React Native: Performance',
            url: 'https://reactnative.dev/docs/performance',
            provider: 'React Native',
            isVerified: true,
          },
        ],
      },
    ],
  },
]

// ============================================================
// DEVELOPER TRACK (core MERN shared with beginner + mastery modules)
// ============================================================

const developerModules: Module[] = [
  {
    ...beginnerModules[1], // node-express
    order: 1,
  },
  {
    ...beginnerModules[2], // mongodb
    order: 2,
  },
  {
    ...beginnerModules[3], // react
    order: 3,
  },
  {
    ...beginnerModules[4], // fullstack
    order: 4,
  },
  ...masteryModules,
]

// ============================================================
// EXPORTS
// ============================================================

export const tracks: Track[] = [
  {
    id: 'beginner',
    key: 'beginner',
    name: 'Beginner Track',
    description: 'No coding experience? Start here. We\'ll guide you from zero to full-stack developer.',
    category: 'web-development',
    icon: 'BookOpen',
    color: 'emerald',
    modules: beginnerModules,
    isFastTrack: true,
    fastTrackDescription: 'HTML/CSS/JS → Node/Express → MongoDB → React → Full-Stack MERN → Capstone. ~14 weeks to job-ready portfolio.',
  },
  {
    id: 'developer',
    key: 'developer',
    name: 'Developer Track',
    description: 'Already know JavaScript? Skip the basics, master the MERN stack, then go deeper with TypeScript, testing, security, DevOps, architecture, performance, and a master capstone.',
    category: 'web-development',
    isFastTrack: false,
    fastTrackDescription: 'Node/Express → MongoDB → React → Full-Stack MERN → Mastery (TS, Testing, Security, DevOps, Architecture). ~10 weeks to senior-level portfolio.',
    icon: 'Code2',
    color: 'violet',
    modules: developerModules,
  },
  {
    id: 'specializations',
    key: 'specializations',
    name: 'Specializations',
    description: 'Completed the core MERN curriculum? Pick a direction and go deeper: production Next.js, cloud DevOps, scalable systems, or React Native.',
    category: 'web-development',
    icon: 'Sparkles',
    color: 'cyan',
    modules: specializationModules,
  },
  {
    id: 'first-client',
    key: 'first-client',
    name: 'First Client Track',
    description: 'From portfolio to paid work: an 8-week system to land your first freelance client, deliver professionally, and build a repeatable pipeline. Designed for developers in emerging markets targeting international clients.',
    category: 'web-development',
    icon: 'Briefcase',
    color: 'indigo',
    isFastTrack: true,
    fastTrackDescription: '8 weeks to first paid client: positioning → portfolio → outreach → proposals → delivery → retention → scale.',
    modules: firstClientModules,
  },
  ...languageTracks,
  {
    id: 'embedded',
    key: 'embedded',
    name: 'Embedded Systems',
    description: 'Learn Arduino, ESP32, and microcontroller programming. Build IoT devices, control sensors, and create hardware projects.',
    category: 'embedded-systems',
    icon: 'Cpu',
    color: 'amber',
    modules: [
      {
        id: 'embedded-coming-soon',
        key: 'coming-soon',
        name: 'Coming Soon',
        description: 'Arduino fundamentals, ESP32 WiFi/Bluetooth, sensors & actuators, RTOS, and IoT cloud integration.',
        order: 1,
        estimatedHours: 40,
        icon: 'Cpu',
        color: 'amber',
        status: 'planned' as ModuleStatus,
        lessons: [
          {
            id: 'embedded-placeholder',
            title: 'Track in Development',
            description: 'This learning path is being built. Check back soon for complete Arduino and ESP32 curricula.',
            order: 1,
            estimatedMinutes: 5,
            difficulty: 'beginner',
            xpReward: 0,
            keyTakeaways: ['Arduino basics', 'ESP32 WiFi/Bluetooth', 'Sensors & actuators', 'IoT cloud integration'],
            resources: [],
            isProject: false,
          },
        ],
      },
    ],
  },
]

export function getTrack(key: string): Track | undefined {
  return tracks.find((t) => t.key === key)
}

export function getModule(trackKey: string, moduleKey: string): Module | undefined {
  const track = getTrack(trackKey)
  return track?.modules.find((m) => m.key === moduleKey)
}

export function getLesson(trackKey: string, moduleKey: string, lessonId: string): Lesson | undefined {
  const mod = getModule(trackKey, moduleKey)
  return mod?.lessons.find((l) => l.id === lessonId)
}

export function getAllLessons(trackKey: string): Lesson[] {
  const track = getTrack(trackKey)
  if (!track) return []
  return track.modules.flatMap((m) => m.lessons)
}

export function getTotalXP(trackKey: string): number {
  return getAllLessons(trackKey).reduce((sum, lesson) => sum + lesson.xpReward, 0)
}

export function getTotalMinutes(trackKey: string): number {
  return getAllLessons(trackKey).reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0)
}

// Helper to compute display properties for a track
export function getTrackDisplay(track: Track) {
  const totalHours = track.modules.reduce((sum, m) => sum + m.estimatedHours, 0)
  const totalLessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const duration = `~${Math.round(totalHours / 10)} wks` // assuming ~10 hrs/week
  const modulesList = track.modules.map((m) => ({
    key: m.key,
    name: m.name,
    weeks: Math.max(1, Math.round(m.estimatedHours / 10)),
    lessons: m.lessons.length,
  }))
  return { duration, lessons: totalLessons, modulesList }
}