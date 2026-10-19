export type ResourceType = 'video' | 'article' | 'docs' | 'interactive' | 'project' | 'cheatsheet'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

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
}

export interface Module {
  id: string
  key: string
  name: string
  description: string
  order: number
  estimatedHours: number
  icon: string
  color: string
  lessons: Lesson[]
}

export interface Track {
  id: string
  key: string
  name: string
  description: string
  icon: string
  color: string
  modules: Module[]
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
    icon: 'BookOpen',
    color: 'emerald',
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
    icon: 'Server',
    color: 'emerald',
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
    icon: 'Database',
    color: 'emerald',
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
            url: 'https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/',
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
    icon: 'Atom',
    color: 'emerald',
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
            url: 'https://zustand.docs.pmnd.rs/getting-started/introduction',
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
            url: 'https://www.debugbear.com/blog/react-performance',
            provider: 'DebugBear',
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
    icon: 'Layers',
    color: 'emerald',
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
            url: 'https://www.freecodecamp.org/news/how-to-build-a-mern-stack-ecommerce-website/',
            provider: 'freeCodeCamp',
            isVerified: true,
          },
        ],
      },
    ],
  },
]

// ============================================================
// DEVELOPER TRACK (subset - skips foundations)
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
    icon: 'BookOpen',
    color: 'emerald',
    modules: beginnerModules,
  },
  {
    id: 'developer',
    key: 'developer',
    name: 'Developer Track',
    description: 'Already know JavaScript? Skip the basics and dive straight into MERN mastery.',
    icon: 'Code2',
    color: 'violet',
    modules: developerModules,
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