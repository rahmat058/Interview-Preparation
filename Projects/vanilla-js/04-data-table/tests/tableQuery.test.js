import { describe, expect, it } from 'vitest'
import { applySearch, applyFilters, applySort, queryEmployees } from '../src/lib/tableQuery.js'

const sampleRows = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@co.io',
    department: 'Engineering',
    role: 'Senior',
    status: 'active',
    location: 'Remote',
    salary: 90000,
    joinDate: '2023-01-15',
    performanceScore: 80,
  },
  {
    id: '2',
    name: 'Bob Jones',
    email: 'bob@co.io',
    department: 'Sales',
    role: 'Mid-Level',
    status: 'inactive',
    location: 'New York',
    salary: 70000,
    joinDate: '2022-06-01',
    performanceScore: 65,
  },
]

const baseQuery = {
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
  filters: { department: '', role: '', status: '', location: '' },
  page: 1,
  pageSize: 10,
}

describe('tableQuery', () => {
  it('filters by search term', () => {
    const result = applySearch(sampleRows, 'alice')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice Smith')
  })

  it('filters by department', () => {
    const result = applyFilters(sampleRows, { ...baseQuery.filters, department: 'Sales' })
    expect(result).toHaveLength(1)
    expect(result[0].department).toBe('Sales')
  })

  it('sorts salary descending', () => {
    const result = applySort(sampleRows, 'salary', 'desc')
    expect(result[0].salary).toBe(90000)
  })

  it('paginates query pipeline', () => {
    const result = queryEmployees(sampleRows, { ...baseQuery, pageSize: 1 })
    expect(result.rows).toHaveLength(1)
    expect(result.meta.filteredTotal).toBe(2)
    expect(result.meta.totalPages).toBe(2)
  })
})
