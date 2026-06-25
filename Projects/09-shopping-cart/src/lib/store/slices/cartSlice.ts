import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchProducts } from '@/api/cartApi'
import type { CartState, CatalogSortBy, CatalogViewMode, ProductCategory } from '@/lib/types/cart'
import {
  DEFAULT_ADVANCED_FILTERS,
  getCartLineKey,
  getProductStock,
  PROMO_CODES,
} from '@/lib/types/cart'
import { clampQuantity } from '@/lib/utils/cartPricing'
import { loadPersistedCart } from '@/lib/utils/cartPersistence'
import { getCatalogPriceBounds } from '@/lib/utils/productCatalog'

const saved = loadPersistedCart()

const initialState: CartState = {
  productsById: {},
  meta: null,
  itemsById: saved?.itemsById ?? {},
  promoCode: saved?.promoCode ?? null,
  categoryFilter: 'all',
  advancedFilters: { ...DEFAULT_ADVANCED_FILTERS },
  catalogStatus: 'idle',
  catalogError: null,
  restoredFromStorage: Boolean(saved),
}

export interface AddItemPayload {
  productId: string
  variantId?: string
}

export const loadProductCatalog = createAsyncThunk('cart/loadCatalog', async (_, { signal }) => {
  return fetchProducts(signal)
})

function reconcileCartLines(state: CartState) {
  for (const [lineKey, line] of Object.entries(state.itemsById)) {
    const product = state.productsById[line.productId]
    if (!product) {
      delete state.itemsById[lineKey]
      continue
    }

    const stock = getProductStock(product, line.variantId)
    if (stock < 1) {
      delete state.itemsById[lineKey]
      continue
    }

    line.quantity = clampQuantity(line.quantity, stock)
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { productId, variantId } = action.payload
      const product = state.productsById[productId]
      const stock = product ? getProductStock(product, variantId) : 0
      if (!product || stock < 1) return

      const lineKey = getCartLineKey(productId, variantId)
      const existing = state.itemsById[lineKey]
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + 1, stock)
      } else {
        state.itemsById[lineKey] = { productId, variantId, quantity: 1 }
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      delete state.itemsById[action.payload]
    },
    setQuantity(
      state,
      action: PayloadAction<{ lineKey: string; productId: string; variantId?: string; quantity: number }>,
    ) {
      const { lineKey, productId, variantId, quantity } = action.payload
      const product = state.productsById[productId]
      if (!product || !state.itemsById[lineKey]) return

      if (quantity <= 0) {
        delete state.itemsById[lineKey]
        return
      }

      const stock = getProductStock(product, variantId)
      state.itemsById[lineKey].quantity = clampQuantity(quantity, stock)
    },
    incrementQuantity(state, action: PayloadAction<string>) {
      const lineKey = action.payload
      const line = state.itemsById[lineKey]
      if (!line) return

      const product = state.productsById[line.productId]
      if (!product) return

      const stock = getProductStock(product, line.variantId)
      line.quantity = clampQuantity(line.quantity + 1, stock)
    },
    decrementQuantity(state, action: PayloadAction<string>) {
      const lineKey = action.payload
      const line = state.itemsById[lineKey]
      if (!line) return

      if (line.quantity <= 1) {
        delete state.itemsById[lineKey]
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
    setPriceRange(state, action: PayloadAction<{ min: number; max: number }>) {
      state.advancedFilters.priceMin = action.payload.min
      state.advancedFilters.priceMax = action.payload.max
    },
    setMinRating(state, action: PayloadAction<number>) {
      state.advancedFilters.minRating = action.payload
    },
    setInStockOnly(state, action: PayloadAction<boolean>) {
      state.advancedFilters.inStockOnly = action.payload
    },
    setSortBy(state, action: PayloadAction<CatalogSortBy>) {
      state.advancedFilters.sortBy = action.payload
    },
    setCatalogViewMode(state, action: PayloadAction<CatalogViewMode>) {
      state.advancedFilters.viewMode = action.payload
    },
    setFreeDeliveryOnly(state, action: PayloadAction<boolean>) {
      state.advancedFilters.freeDeliveryOnly = action.payload
    },
    resetAdvancedFilters(state) {
      const bounds = getCatalogPriceBounds(Object.values(state.productsById))
      state.advancedFilters = {
        ...DEFAULT_ADVANCED_FILTERS,
        priceMin: bounds.min,
        priceMax: bounds.max,
      }
      state.categoryFilter = 'all'
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

        const bounds = getCatalogPriceBounds(action.payload.data)
        state.advancedFilters.priceMin = bounds.min
        state.advancedFilters.priceMax = bounds.max

        reconcileCartLines(state)
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
  setPriceRange,
  setMinRating,
  setInStockOnly,
  setSortBy,
  setCatalogViewMode,
  setFreeDeliveryOnly,
  resetAdvancedFilters,
  hydrateCart,
} = cartSlice.actions

export default cartSlice.reducer
