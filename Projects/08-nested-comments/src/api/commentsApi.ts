import { getMockComments } from '@/data/mockComments'
import type { CommentsResponse } from '@/lib/types/comments'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'
const SIMULATE_ERROR = import.meta.env.VITE_SIMULATE_COMMENTS_ERROR === 'true'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

async function mockFetchComments(signal?: AbortSignal): Promise<CommentsResponse> {
  const latency = 350 + Math.floor(Math.random() * 350)
  await delay(latency, signal)

  if (SIMULATE_ERROR) {
    throw new Error('Simulated network error — failed to load comments')
  }

  return getMockComments()
}

async function realFetchComments(signal?: AbortSignal): Promise<CommentsResponse> {
  const response = await fetch(`${API_BASE}/comments/thread`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load comments (${response.status})`)
  }
  return response.json() as Promise<CommentsResponse>
}

export async function fetchComments(signal?: AbortSignal): Promise<CommentsResponse> {
  return USE_MOCK ? mockFetchComments(signal) : realFetchComments(signal)
}

export async function postReply(
  _parentId: string,
  _body: string,
  signal?: AbortSignal,
): Promise<{ id: string }> {
  const latency = 300 + Math.floor(Math.random() * 300)
  await delay(latency, signal)
  return { id: `cmt_${crypto.randomUUID().slice(0, 8)}` }
}
