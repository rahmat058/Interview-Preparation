import { getMockEmployees } from '@/data/mockEmployees'
import type { TableMeta, TableQuery, TableQueryResponse } from '@/lib/types/table'
import { queryEmployees } from '@/lib/utils/tableQuery'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'
const SIMULATE_ERROR = import.meta.env.VITE_SIMULATE_TABLE_ERROR === 'true'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

function buildQueryString(query: TableQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    search: query.search,
    department: query.filters.department,
    role: query.filters.role,
    status: query.filters.status,
    location: query.filters.location,
  })
  return params.toString()
}

async function mockFetchTable(query: TableQuery, signal?: AbortSignal): Promise<TableQueryResponse> {
  await delay(350 + Math.floor(Math.random() * 350), signal)
  if (SIMULATE_ERROR) {
    throw new Error('Simulated network error — failed to load table data')
  }

  const { data } = getMockEmployees()
  const result = queryEmployees(data, query)
  return { meta: result.meta, data: result.rows }
}

async function realFetchTable(query: TableQuery, signal?: AbortSignal): Promise<TableQueryResponse> {
  const qs = buildQueryString(query)
  const response = await fetch(`${API_BASE}/employees?${qs}`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load table data (${response.status})`)
  }
  return response.json() as Promise<TableQueryResponse>
}

export async function fetchTableData(
  query: TableQuery,
  signal?: AbortSignal,
): Promise<TableQueryResponse> {
  return USE_MOCK ? mockFetchTable(query, signal) : realFetchTable(query, signal)
}

export async function fetchDatasetMeta(signal?: AbortSignal): Promise<TableMeta> {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE}/employees/meta`, { signal })
    if (!response.ok) throw new Error('Failed to load dataset meta')
    return response.json() as Promise<TableMeta>
  }

  await delay(200, signal)
  return getMockEmployees().meta
}
