import { getMockProducts } from '@/data/mockProducts'
import type { ProductsResponse } from '@/lib/types/cart'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

async function mockFetchProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  await delay(300 + Math.floor(Math.random() * 300), signal)
  return getMockProducts()
}

async function realFetchProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch(`${API_BASE}/products`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`)
  }
  return response.json() as Promise<ProductsResponse>
}

export async function fetchProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  return USE_MOCK ? mockFetchProducts(signal) : realFetchProducts(signal)
}
