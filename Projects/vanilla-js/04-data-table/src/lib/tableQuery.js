/** @typedef {'name'|'email'|'department'|'role'|'status'|'location'|'salary'|'joinDate'} SortableColumn */

const SEARCHABLE_FIELDS = ['name', 'email', 'department', 'role', 'location']

/** @param {import('../store/index.js').Employee[]} rows @param {string} search */
export function applySearch(rows, search) {
  const term = search.trim().toLowerCase()
  if (!term) return rows
  return rows.filter((row) =>
    SEARCHABLE_FIELDS.some((field) => String(row[field]).toLowerCase().includes(term)),
  )
}

/** @param {import('../store/index.js').Employee[]} rows @param {import('../store/index.js').TableFilters} filters */
export function applyFilters(rows, filters) {
  return rows.filter((row) => {
    if (filters.department && row.department !== filters.department) return false
    if (filters.role && row.role !== filters.role) return false
    if (filters.status && row.status !== filters.status) return false
    if (filters.location && row.location !== filters.location) return false
    return true
  })
}

/** @param {unknown} a @param {unknown} b @param {'asc'|'desc'} sortOrder */
function compareValues(a, b, sortOrder) {
  if (a === b) return 0
  if (typeof a === 'number' && typeof b === 'number') {
    return sortOrder === 'asc' ? a - b : b - a
  }
  const result = String(a).toLowerCase().localeCompare(String(b).toLowerCase())
  return sortOrder === 'asc' ? result : -result
}

/** @param {import('../store/index.js').Employee[]} rows @param {SortableColumn} sortBy @param {'asc'|'desc'} sortOrder */
export function applySort(rows, sortBy, sortOrder) {
  return [...rows].sort((a, b) => compareValues(a[sortBy], b[sortBy], sortOrder))
}

/** @param {T[]} rows @param {number} page @param {number} pageSize @template T */
export function paginateRows(rows, page, pageSize) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}

/** @param {import('../store/index.js').Employee[]} allRows @param {import('../store/index.js').TableQuery} query */
export function queryEmployees(allRows, query) {
  const searched = applySearch(allRows, query.search)
  const filtered = applyFilters(searched, query.filters)
  const sorted = applySort(filtered, query.sortBy, query.sortOrder)
  const totalPages = Math.max(1, Math.ceil(sorted.length / query.pageSize))
  const safePage = Math.min(query.page, totalPages)
  const pageRows = paginateRows(sorted, safePage, query.pageSize)

  return {
    rows: pageRows,
    meta: {
      total: allRows.length,
      filteredTotal: sorted.length,
      page: safePage,
      pageSize: query.pageSize,
      totalPages,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    },
  }
}

/** @param {import('../store/index.js').TableFilters} filters */
export function countActiveFilters(filters) {
  return Object.values(filters).filter(Boolean).length
}

/** @param {number} value */
export function formatSalary(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

/** @param {string} value */
export function formatJoinDate(value) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
}

/** @param {string} status */
export function formatStatusLabel(status) {
  return status.replace(/_/g, ' ')
}

/** @param {string} status */
export function getStatusStyles(status) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700 ring-emerald-200'
    case 'inactive':
      return 'bg-slate-100 text-slate-600 ring-slate-200'
    default:
      return 'bg-amber-100 text-amber-700 ring-amber-200'
  }
}
