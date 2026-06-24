import { getMockFileTree } from '@/data/mockFileTree'
import type { FileTreeResponse } from '@/lib/types/explorer'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'
const SIMULATE_ERROR = import.meta.env.VITE_SIMULATE_EXPLORER_ERROR === 'true'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

async function mockFetchFileTree(signal?: AbortSignal): Promise<FileTreeResponse> {
  const latency = 400 + Math.floor(Math.random() * 400)
  await delay(latency, signal)

  if (SIMULATE_ERROR) {
    throw new Error('Simulated network error — failed to load file tree')
  }

  return getMockFileTree()
}

async function realFetchFileTree(signal?: AbortSignal): Promise<FileTreeResponse> {
  const response = await fetch(`${API_BASE}/explorer/tree`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load file tree (${response.status})`)
  }
  return response.json() as Promise<FileTreeResponse>
}

export async function fetchFileTree(signal?: AbortSignal): Promise<FileTreeResponse> {
  return USE_MOCK ? mockFetchFileTree(signal) : realFetchFileTree(signal)
}
