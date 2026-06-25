const STORAGE_KEY = 'vanilla-catalog-cart-v1'

/**
 * Minimal Redux-shaped store: reducer + subscribe + dispatch
 * @template S
 * @param {S} initialState
 * @param {(state: S, action: { type: string, payload?: unknown }) => S} reducer
 */
export function createStore(initialState, reducer) {
  let state = initialState
  /** @type {Set<(state: S) => void>} */
  const listeners = new Set()

  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action)
      listeners.forEach((listener) => listener(state))
      return action
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch {
    return {}
  }
}

export function saveCart(cartById) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartById))
}
