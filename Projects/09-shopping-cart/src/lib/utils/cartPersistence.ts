import type { CartItemsById } from '@/lib/types/cart'

const STORAGE_KEY = 'cartpulse-cart-v1'

export interface PersistedCart {
  itemsById: CartItemsById
  promoCode: string | null
  savedAt: string
}

export function loadPersistedCart(): PersistedCart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedCart
    if (!parsed.itemsById || typeof parsed.itemsById !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function savePersistedCart(itemsById: CartItemsById, promoCode: string | null) {
  const payload: PersistedCart = {
    itemsById,
    promoCode,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearPersistedCart() {
  localStorage.removeItem(STORAGE_KEY)
}
