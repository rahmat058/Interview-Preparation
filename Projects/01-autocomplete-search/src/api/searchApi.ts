import type { EntityType, SearchIndexItem, SearchQueryParams, SearchResponse } from '@/lib/types/search'
import { MOCK_SEARCH_INDEX } from '@/data/mockSearchIndex'
import { randomBetween } from '@/lib/utils/helpers'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const MOCK_LATENCY_MIN_MS = 250
const MOCK_LATENCY_MAX_MS = 650
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function scoreItem(item: SearchIndexItem, query: string): number {
  const q = query.toLowerCase().trim()
  if (!q) return 0

  let score = 0
  const title = item.title.toLowerCase()
  const description = item.description.toLowerCase()

  if (title === q) score += 100
  else if (title.startsWith(q)) score += 80
  else if (title.includes(q)) score += 50

  if (description.includes(q)) score += 20
  if (item.category.toLowerCase().includes(q)) score += 15
  if (item.tags.some((tag) => tag.includes(q))) score += 25

  score += item.popularityScore * 0.1
  return score
}

function filterAndRank(items: SearchIndexItem[], params: SearchQueryParams): SearchIndexItem[] {
  const q = params.q.trim().toLowerCase()
  const entityType = params.entityType ?? 'all'

  let filtered = items.filter((item) => item.isActive)

  if (entityType !== 'all') {
    filtered = filtered.filter((item) => item.entityType === entityType)
  }

  if (!q) return []

  return filtered
    .map((item) => ({ item, score: scoreItem(item, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

async function mockSearchService(params: SearchQueryParams): Promise<SearchResponse> {
  const start = performance.now()
  await delay(randomBetween(MOCK_LATENCY_MIN_MS, MOCK_LATENCY_MAX_MS))

  const limit = params.limit ?? 8
  const offset = params.offset ?? 0
  const ranked = filterAndRank(MOCK_SEARCH_INDEX, params)
  const data = ranked.slice(offset, offset + limit)
  const tookMs = Math.round(performance.now() - start)

  return {
    data,
    meta: {
      query: params.q,
      total: ranked.length,
      limit,
      offset,
      tookMs,
      hasMore: offset + limit < ranked.length,
    },
  }
}

/**
 * Production swap: point VITE_USE_MOCK_API=false and implement GET /api/search
 *
 * Expected API contract:
 * GET /api/search?q={query}&limit={n}&offset={n}&entityType={product|city|user|all}
 * Response: SearchResponse
 */
export async function searchItems(
  params: SearchQueryParams,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  if (USE_MOCK_API) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    return mockSearchService(params)
  }

  const searchParams = new URLSearchParams({
    q: params.q,
    limit: String(params.limit ?? 8),
    offset: String(params.offset ?? 0),
  })

  if (params.entityType && params.entityType !== 'all') {
    searchParams.set('entityType', params.entityType)
  }

  const response = await fetch(`${API_BASE_URL}/search?${searchParams}`, { signal })

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<SearchResponse>
}

export type { EntityType, SearchQueryParams, SearchResponse }
