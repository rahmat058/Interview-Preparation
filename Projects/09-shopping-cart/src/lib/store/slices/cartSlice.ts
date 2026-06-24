import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchProducts } from '@/api/cartApi'
import type { CartState, ProductCategory } from '@/lib/types/cart'
import { PROMO_CODES } from '@/lib/types/cart'
import { clampQuantity } from '@/lib/utils/cartPricing'
import { loadPersistedCart } from '@/lib/utils/cartPersistence'

const saved = loadPersistedCart()

const initialState: CartState = {
  productsById: {},
  meta: null,
  itemsById: saved?.itemsById ?? {},
  promoCode: saved?.promoCode ?? null,
  categoryFilter: 'all',
  catalogStatus: 'idle',
  catalogError: null,
  restoredFromStorage: Boolean(saved),
}

export const loadProductCatalog = createAsyncThunk('cart/loadCatalog', async (_, { signal }) => {
  return fetchProducts(signal)
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<string>) {
      const productId = action.payload
      const product = state.productsById[productId]
      if (!product || product.stock < 1) return

      const existing = state.itemsById[productId]
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + 1, product.stock)
      } else {
        state.itemsById[productId] = { productId, quantity: 1 }
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      delete state.itemsById[action.payload]
    },
    setQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload
      const product = state.productsById[productId]
      if (!product || !state.itemsById[productId]) return

      if (quantity <= 0) {
        delete state.itemsById[productId]
        return
      }

      state.itemsById[productId].quantity = clampQuantity(quantity, product.stock)
    },
    incrementQuantity(state, action: PayloadAction<string>) {
      const productId = action.payload
      const product = state.productsById[productId]
      const line = state.itemsById[productId]
      if (!product || !line) return
      line.quantity = clampQuantity(line.quantity + 1, product.stock)
    },
    decrementQuantity(state, action: PayloadAction<string>) {
      const productId = action.payload
      const line = state.itemsById[productId]
      if (!line) return

      if (line.quantity <= 1) {
        delete state.itemsById[productId]
      } else {
        line.quantity -= 1
      }
    },
    clearCart(state) {
      state.itemsById = {}
      state.promoCode = null
    },
    applyPromoCode(state, action: PayloadAction<string>) {
      const code = action.payload.trim().toUpperCase()
      if (PROMO_CODES[code]) {
        state.promoCode = code
      }
    },
    clearPromoCode(state) {
      state.promoCode = null
    },
    setCategoryFilter(state, action: PayloadAction<ProductCategory>) {
      state.categoryFilter = action.payload
    },
    hydrateCart(state, action: PayloadAction<{ itemsById: CartState['itemsById']; promoCode: string | null }>) {
      state.itemsById = action.payload.itemsById
      state.promoCode = action.payload.promoCode
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductCatalog.pending, (state) => {
        state.catalogStatus = 'loading'
        state.catalogError = null
      })
      .addCase(loadProductCatalog.fulfilled, (state, action) => {
        state.catalogStatus = 'succeeded'
        state.meta = action.payload.meta
        state.productsById = Object.fromEntries(
          action.payload.data.map((product) => [product.id, product]),
        )
        state.catalogError = null

        for (const [productId, line] of Object.entries(state.itemsById)) {
          const product = state.productsById[productId]
          if (!product) {
            delete state.itemsById[productId]
            continue
          }
          line.quantity = clampQuantity(line.quantity, product.stock)
        }
      })
      .addCase(loadProductCatalog.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.catalogStatus = 'failed'
        state.catalogError = action.error.message ?? 'Failed to load catalog'
      })
  },
})

export const {
  addItem,
  removeItem,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  applyPromoCode,
  clearPromoCode,
  setCategoryFilter,
  hydrateCart,
} = cartSlice.actions

export default cartSlice.reducer
