import type { EmployeeRecord, SortableColumn, SortOrder, TableFilters, TableQuery } from '@/lib/types/table'

const SEARCHABLE_FIELDS: (keyof EmployeeRecord)[] = ['name', 'email', 'department', 'role', 'location']

export function applySearch(rows: EmployeeRecord[], search: string): EmployeeRecord[] {
  const term = search.trim().toLowerCase()
  if (!term) return rows

  return rows.filter((row) =>
    SEARCHABLE_FIELDS.some((field) => String(row[field]).toLowerCase().includes(term)),
  )
}

export function applyFilters(rows: EmployeeRecord[], filters: TableFilters): EmployeeRecord[] {
  return rows.filter((row) => {
    if (filters.department && row.department !== filters.department) return false
    if (filters.role && row.role !== filters.role) return false
    if (filters.status && row.status !== filters.status) return false
    if (filters.location && row.location !== filters.location) return false
    return true
  })
}

function compareValues(a: unknown, b: unknown, sortOrder: SortOrder): number {
  if (a === b) return 0

  if (typeof a === 'number' && typeof b === 'number') {
    return sortOrder === 'asc' ? a - b : b - a
  }

  const aStr = String(a).toLowerCase()
  const bStr = String(b).toLowerCase()
  const result = aStr.localeCompare(bStr)
  return sortOrder === 'asc' ? result : -result
}

export function applySort(
  rows: EmployeeRecord[],
  sortBy: SortableColumn,
  sortOrder: SortOrder,
): EmployeeRecord[] {
  return [...rows].sort((a, b) => compareValues(a[sortBy], b[sortBy], sortOrder))
}

export function paginateRows<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}

export function queryEmployees(allRows: EmployeeRecord[], query: TableQuery) {
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

export function countActiveFilters(filters: TableFilters): number {
  return Object.values(filters).filter(Boolean).length
}

export function formatSalary(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatJoinDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
}

export function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ')
}

export function getStatusStyles(status: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700'
    case 'inactive':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}
