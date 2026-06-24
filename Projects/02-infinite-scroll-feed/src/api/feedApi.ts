import type { FeedPost, FeedQueryParams, FeedResponse } from '@/lib/types/feed'
import { MOCK_FEED_POSTS } from '@/data/mockFeedPosts'
import { randomBetween } from '@/lib/utils/helpers'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const MOCK_LATENCY_MIN_MS = 300
const MOCK_LATENCY_MAX_MS = 800
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'
const SIMULATE_ERROR = import.meta.env.VITE_SIMULATE_FEED_ERROR === 'true'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function mockFeedService(params: FeedQueryParams): Promise<FeedResponse> {
  const start = performance.now()
  await delay(randomBetween(MOCK_LATENCY_MIN_MS, MOCK_LATENCY_MAX_MS))

  const page = params.page ?? 1
  const limit = params.limit ?? 10

  // Simulate flaky network on page 4 when env flag set (for demo)
  if (SIMULATE_ERROR && page === 4) {
    throw new Error('Network error: failed to load feed page. Please retry.')
  }

  const published = MOCK_FEED_POSTS.filter((p) => p.isPublished).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const total = published.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const data = published.slice(offset, offset + limit)
  const tookMs = Math.round(performance.now() - start)

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
      tookMs,
    },
  }
}

/**
 * Production swap: VITE_USE_MOCK_API=false
 * GET /api/feed?page={n}&limit={n}
 */
export async function fetchFeedPage(params: FeedQueryParams, signal?: AbortSignal): Promise<FeedResponse> {
  if (USE_MOCK_API) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    return mockFeedService(params)
  }

  const searchParams = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  })

  const response = await fetch(`${API_BASE_URL}/feed?${searchParams}`, { signal })

  if (!response.ok) {
    throw new Error(`Feed fetch failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<FeedResponse>
}

export type { FeedPost, FeedQueryParams, FeedResponse }
