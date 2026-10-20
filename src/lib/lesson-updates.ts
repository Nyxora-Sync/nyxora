/**
 * Last meaningful update for each written lesson, taken from the latest Git
 * commit that touched its MDX file. Keep this map in sync when editing a
 * lesson (or regenerate it with `git log -1 --format=%cs -- <file>`).
 */
const lessonUpdates: Record<string, string> = {
  'architecture-api-evolution': '2026-10-20',
  'architecture-data-modeling': '2026-10-20',
  'architecture-system-design': '2026-10-20',
  'capstone-portfolio-career': '2026-10-20',
  'capstone-saas-app': '2026-10-20',
  'devops-cicd-production': '2026-10-20',
  'devops-docker-deep': '2026-10-20',
  'devops-observability-scaling': '2026-10-20',
  'express-auth': '2026-10-20',
  'express-basics': '2026-10-20',
  'express-testing': '2026-10-20',
  'foundations-async-js': '2026-10-20',
  'foundations-css-basics': '2026-10-20',
  'foundations-es6': '2026-10-20',
  'foundations-git': '2026-10-20',
  'foundations-how-web-works': '2026-10-20',
  'foundations-html-basics': '2026-10-20',
  'foundations-js-basics': '2026-10-20',
  'foundations-js-dom': '2026-10-20',
  'foundations-project-portfolio': '2026-10-20',
  'fullstack-architecture': '2026-10-20',
  'fullstack-deployment': '2026-10-20',
  'fullstack-integration': '2026-10-20',
  'fullstack-project': '2026-10-20',
  'fullstack-realtime': '2026-10-20',
  'fullstack-uploads': '2026-10-20',
  'mongodb-aggregation': '2026-10-20',
  'mongodb-intro': '2026-10-20',
  'mongoose-relationships': '2026-10-20',
  'mongoose-schemas': '2026-10-20',
  'node-intro': '2026-10-20',
  'performance-database': '2026-10-20',
  'performance-frontend-delivery': '2026-10-20',
  'performance-node-runtime': '2026-10-20',
  'react-forms': '2026-10-20',
  'react-hooks': '2026-10-20',
  'react-intro': '2026-10-20',
  'react-performance': '2026-10-20',
  'react-router': '2026-10-20',
  'react-state-management': '2026-10-20',
  'rest-api-design': '2026-10-20',
  'security-auth-advanced': '2026-10-20',
  'security-data-protection': '2026-10-20',
  'security-express-hardening': '2026-10-20',
  'security-web-fundamentals': '2026-10-20',
  'testing-api-integration': '2026-10-20',
  'testing-e2e-playwright': '2026-10-20',
  'testing-react-components': '2026-10-20',
  'testing-strategy': '2026-10-20',
  'typescript-express': '2026-10-20',
  'typescript-foundations': '2026-10-20',
  'typescript-fullstack': '2026-10-20',
  'typescript-react': '2026-10-20',
}

export function getLessonUpdated(id: string): string | undefined {
  return lessonUpdates[id]
}

export function formatLessonUpdated(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date)
}
