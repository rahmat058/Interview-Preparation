import { createStore, loadCart, saveCart } from './createStore.js'

const initialState = {
  catalog: {
    status: 'idle',
    error: null,
    products: [],
    category: 'all',
    sort: 'name-asc',
    priceMax: 500,
  },
  cart: loadCart(),
}

function catalogReducer(state, action) {
  switch (action.type) {
    case 'catalog/loading':
      return { ...state, status: 'loading', error: null }
    case 'catalog/success':
      return { ...state, status: 'success', products: action.payload, error: null }
    case 'catalog/error':
      return { ...state, status: 'error', error: action.payload }
    case 'catalog/setCategory':
      return { ...state, category: action.payload }
    case 'catalog/setSort':
      return { ...state, sort: action.payload }
    case 'catalog/setPriceMax':
      return { ...state, priceMax: action.payload }
    default:
      return state
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'cart/add': {
      const { productId, stock } = action.payload
      const current = state[productId]?.qty ?? 0
      const next = Math.min(current + 1, stock)
      if (next <= 0) return state
      return { ...state, [productId]: { productId, qty: next } }
    }
    case 'cart/remove': {
      const next = { ...state }
      delete next[action.payload]
      return next
    }
    case 'cart/clear':
      return {}
    default:
      return state
  }
}

function rootReducer(state, action) {
  const nextCatalog = catalogReducer(state.catalog, action)
  const nextCart = cartReducer(state.cart, action)
  const changed = nextCatalog !== state.catalog || nextCart !== state.cart
  if (!changed) return state
  const next = { catalog: nextCatalog, cart: nextCart }
  if (nextCart !== state.cart) saveCart(nextCart)
  return next
}

export const store = createStore(initialState, rootReducer)

export const selectFilteredProducts = (state) => {
  let list = [...state.catalog.products]
  if (state.catalog.category !== 'all') {
    list = list.filter((p) => p.category === state.catalog.category)
  }
  list = list.filter((p) => p.price <= state.catalog.priceMax)
  if (state.catalog.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  if (state.catalog.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  if (state.catalog.sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))
  return list
}

export const selectCartCount = (state) =>
  Object.values(state.cart).reduce((sum, line) => sum + line.qty, 0)

export const selectCartTotal = (state) => {
  const byId = Object.fromEntries(state.catalog.products.map((p) => [p.id, p]))
  return Object.values(state.cart).reduce((sum, line) => {
    const product = byId[line.productId]
    return product ? sum + product.price * line.qty : sum
  }, 0)
}
