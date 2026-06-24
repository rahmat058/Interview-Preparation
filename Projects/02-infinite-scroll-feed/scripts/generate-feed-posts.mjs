import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/feed-posts.json')

const authors = [
  { id: 'usr_01', name: 'Sarah Chen', username: 'sarahchen', dept: 'Engineering' },
  { id: 'usr_02', name: 'Marcus Johnson', username: 'marcusj', dept: 'Product' },
  { id: 'usr_03', name: 'Priya Sharma', username: 'priyasharma', dept: 'Engineering' },
  { id: 'usr_04', name: 'Alex Rivera', username: 'alexrivera', dept: 'Design' },
  { id: 'usr_05', name: 'Emily Watson', username: 'emilywatson', dept: 'Data' },
  { id: 'usr_06', name: 'James O\'Connor', username: 'jamesoc', dept: 'DevOps' },
  { id: 'usr_07', name: 'Nina Patel', username: 'ninapatel', dept: 'QA' },
  { id: 'usr_08', name: 'David Kim', username: 'davidkim', dept: 'Mobile' },
  { id: 'usr_09', name: 'Olivia Martinez', username: 'oliviam', dept: 'Backend' },
  { id: 'usr_10', name: 'Aisha Rahman', username: 'aisharahman', dept: 'ML' },
]

const categories = ['Tech', 'Design', 'Career', 'Open Source', 'Tutorial', 'News', 'Opinion', 'Showcase']
const tagPool = ['react', 'typescript', 'performance', 'redux', 'vite', 'tailwind', 'api', 'testing', 'ux', 'mobile', 'devops', 'ai', 'frontend', 'backend', 'interview']

const contentTemplates = [
  'Just shipped a new infinite scroll feed with Intersection Observer and Redux Toolkit. Lazy loading feels buttery smooth!',
  'Pro tip: always abort in-flight requests when paginating — stale responses are the #1 bug in feed UIs.',
  'Redux vs React Query for feeds? Redux wins when you need predictable global state; RQ wins for cache invalidation.',
  'Spent the morning optimizing re-renders in our feed list. React.memo on cards + stable keys = huge win.',
  'Our team migrated from offset pagination to cursor-based. Sub-100ms page loads on mobile now.',
  'Design systems tip: skeleton loaders beat spinners for perceived performance on infinite scroll.',
  'Built a mock API layer today — JSON seed data with 60 posts. Swap to real backend with one env flag.',
  'Framer Motion stagger on feed cards makes the app feel premium. Worth the bundle size for demos.',
  'Accessibility check: ensure screen readers announce "loading more" when the sentinel enters view.',
  'Interview prep: be ready to explain why Intersection Observer beats scroll event listeners.',
  'Cursor pagination scales better than OFFSET for large tables. Here is why we switched.',
  'Error boundaries + retry buttons saved our feed UX during a flaky API deploy last week.',
  'Virtualization is next on our roadmap — 500+ items in DOM is where perf breaks down.',
  'Loving Tailwind 4 glass-card pattern for feed containers. Matches our flight-search design system.',
  'Code review insight: separate "initial load" from "load more" states in Redux for clearer UX.',
]

function pad(n, width = 3) {
  return String(n).padStart(width, '0')
}

function isoDate(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(9 + (daysAgo % 10), (daysAgo * 7) % 60, 0, 0)
  return d.toISOString()
}

function pickTags(index) {
  const count = 2 + (index % 3)
  const tags = []
  for (let i = 0; i < count; i++) {
    tags.push(tagPool[(index + i * 3) % tagPool.length])
  }
  return [...new Set(tags)]
}

const TOTAL = 60
const data = []

for (let i = 1; i <= TOTAL; i++) {
  const author = authors[(i - 1) % authors.length]
  const category = categories[(i - 1) % categories.length]
  const content = `${contentTemplates[(i - 1) % contentTemplates.length]} (Post #${i})`

  data.push({
    id: `post_01FF${pad(i)}`,
    authorId: author.id,
    authorName: author.name,
    authorUsername: author.username,
    authorAvatarUrl: null,
    authorDepartment: author.dept,
    content,
    excerpt: content.length > 120 ? `${content.slice(0, 117)}...` : content,
    imageUrl: i % 5 === 0 ? `https://picsum.photos/seed/flowfeed${i}/800/400` : null,
    category,
    tags: pickTags(i),
    likesCount: 12 + ((i * 17) % 500),
    commentsCount: 2 + ((i * 7) % 80),
    sharesCount: 1 + ((i * 3) % 40),
    isPublished: true,
    isPinned: i <= 2,
    createdAt: isoDate(i),
    updatedAt: isoDate(Math.max(0, i - 2)),
  })
}

const dataset = {
  meta: {
    schemaVersion: '1.0.0',
    collection: 'feed_posts',
    description: 'Mock social feed posts — mirrors production DB export format',
    count: data.length,
    pageSize: 10,
    lastUpdated: new Date().toISOString(),
  },
  data,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf8')
console.log(`Generated ${data.length} feed posts → ${outPath}`)
