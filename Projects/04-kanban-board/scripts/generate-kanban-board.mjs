import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/kanban-board.json')

const columns = [
  { id: 'col_backlog', title: 'Backlog', accent: 'slate' },
  { id: 'col_todo', title: 'To Do', accent: 'violet' },
  { id: 'col_progress', title: 'In Progress', accent: 'fuchsia' },
  { id: 'col_done', title: 'Done', accent: 'emerald' },
]

const assignees = [
  { id: 'usr_01', name: 'Sarah Chen', color: '#8b5cf6' },
  { id: 'usr_02', name: 'Marcus Johnson', color: '#d946ef' },
  { id: 'usr_03', name: 'Priya Sharma', color: '#6366f1' },
  { id: 'usr_04', name: 'Alex Rivera', color: '#ec4899' },
  { id: 'usr_05', name: 'Emily Watson', color: '#a855f7' },
]

const priorities = ['low', 'medium', 'high']
const labelPool = ['frontend', 'backend', 'design', 'bug', 'feature', 'docs', 'devops', 'qa']

const taskTemplates = [
  'Implement drag-and-drop between columns',
  'Add Redux state for card reordering',
  'Design glass-card column layout',
  'Write ARCHITECTURE.md for kanban flow',
  'Fix keyboard sensor for accessibility',
  'Add priority badges to task cards',
  'Create mock API with 400ms latency',
  'Build card detail hover states',
  'Optimize re-renders during drag',
  'Add column card count in header',
  'Implement optimistic moveCard reducer',
  'Add Framer Motion card entrance',
  'Write 15+ interview Q&A entries',
  'Support cross-column drop zones',
  'Add assignee avatars on cards',
  'Generate seed data script',
  'Add loading skeleton for board',
  'Handle empty column drop target',
  'Persist board state to localStorage',
  'Add undo for card moves',
  'Write unit tests for moveCard',
  'Add filter by assignee',
  'Mobile responsive horizontal scroll',
  'Add card creation form',
]

function pad(n, width = 3) {
  return String(n).padStart(width, '0')
}

function isoDate(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const cardsById = {}
const columnCardIds = {
  col_backlog: [],
  col_todo: [],
  col_progress: [],
  col_done: [],
}

const distribution = [
  ...Array(6).fill('col_backlog'),
  ...Array(6).fill('col_todo'),
  ...Array(6).fill('col_progress'),
  ...Array(6).fill('col_done'),
]

for (let i = 0; i < 24; i++) {
  const columnId = distribution[i]
  const assignee = assignees[i % assignees.length]
  const id = `card_${pad(i + 1)}`

  cardsById[id] = {
    id,
    columnId,
    title: taskTemplates[i % taskTemplates.length],
    description: `Sprint task #${i + 1} — practice complex Redux updates when moving cards between columns.`,
    priority: priorities[i % priorities.length],
    assigneeId: assignee.id,
    assigneeName: assignee.name,
    assigneeColor: assignee.color,
    labels: [labelPool[i % labelPool.length], labelPool[(i + 3) % labelPool.length]].slice(0, 1 + (i % 2)),
    storyPoints: 1 + (i % 5),
    createdAt: isoDate(30 - i),
    updatedAt: isoDate(i % 10),
  }

  columnCardIds[columnId].push(id)
}

const payload = {
  meta: {
    schemaVersion: '1.0.0',
    collection: 'kanban_board',
    boardId: 'board_sprint_01',
    boardTitle: 'Sprint 24 — React Machine Coding',
    columnCount: columns.length,
    cardCount: Object.keys(cardsById).length,
    generatedAt: new Date().toISOString(),
  },
  data: {
    columns: columns.map((col) => ({
      ...col,
      cardIds: columnCardIds[col.id],
    })),
    cardsById,
  },
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

console.log(`Wrote ${payload.meta.cardCount} cards across ${payload.meta.columnCount} columns → ${outPath}`)
