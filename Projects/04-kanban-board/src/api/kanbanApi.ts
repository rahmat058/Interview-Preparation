import { getMockKanbanBoard } from '@/data/mockKanbanBoard'
import type { KanbanBoardResponse } from '@/lib/types/kanban'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'
const SIMULATE_ERROR = import.meta.env.VITE_SIMULATE_KANBAN_ERROR === 'true'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

async function mockFetchBoard(signal?: AbortSignal): Promise<KanbanBoardResponse> {
  await delay(400 + Math.floor(Math.random() * 400), signal)
  if (SIMULATE_ERROR) {
    throw new Error('Simulated network error — failed to load kanban board')
  }
  return getMockKanbanBoard()
}

async function realFetchBoard(signal?: AbortSignal): Promise<KanbanBoardResponse> {
  const response = await fetch(`${API_BASE}/kanban/board`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load kanban board (${response.status})`)
  }
  return response.json() as Promise<KanbanBoardResponse>
}

export async function fetchKanbanBoard(signal?: AbortSignal): Promise<KanbanBoardResponse> {
  return USE_MOCK ? mockFetchBoard(signal) : realFetchBoard(signal)
}
