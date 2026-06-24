import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/employees.json')

const firstNames = ['Sarah', 'Marcus', 'Priya', 'Alex', 'Emily', 'James', 'Nina', 'David', 'Olivia', 'Aisha', 'Ryan', 'Maya', 'Chris', 'Laura', 'Kevin']
const lastNames = ['Chen', 'Johnson', 'Sharma', 'Rivera', 'Watson', 'OConnor', 'Patel', 'Kim', 'Martinez', 'Rahman', 'Brooks', 'Nguyen', 'Foster', 'Lee', 'Singh']
const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Support', 'HR', 'Finance']
const roles = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director']
const statuses = ['active', 'inactive', 'on_leave']
const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Toronto', 'Remote', 'Austin', 'Singapore']

function pad(n, width = 3) {
  return String(n).padStart(width, '0')
}

function isoDate(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo * 30)
  return d.toISOString().slice(0, 10)
}

const TOTAL = 80
const data = []

for (let i = 1; i <= TOTAL; i++) {
  const first = firstNames[(i - 1) % firstNames.length]
  const last = lastNames[(i + 2) % lastNames.length]
  const name = `${first} ${last}`
  const department = departments[(i - 1) % departments.length]
  const role = roles[(i - 1) % roles.length]
  const status = statuses[(i - 1) % statuses.length]
  const location = locations[(i - 1) % locations.length]
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@company.io`

  data.push({
    id: `emp_${pad(i)}`,
    name,
    email,
    department,
    role,
    status,
    location,
    salary: 55000 + (i % 20) * 4500 + (role === 'Director' ? 30000 : role === 'Manager' ? 15000 : 0),
    joinDate: isoDate(24 - (i % 24)),
    performanceScore: 60 + (i % 41),
  })
}

const payload = {
  meta: {
    schemaVersion: '1.0.0',
    collection: 'employees',
    count: TOTAL,
    departments,
    roles,
    statuses,
    locations,
    generatedAt: new Date().toISOString(),
  },
  data,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

console.log(`Wrote ${TOTAL} employee records → ${outPath}`)
