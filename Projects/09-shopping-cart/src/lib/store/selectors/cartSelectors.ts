import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store/types'
import type { Product, ProductCategory } from '@/lib/types/cart'
import { getCartLineKey, getProductVariant } from '@/lib/types/cart'
import { calculateCartPricing } from '@/lib/utils/cartPricing'
import { applyAdvancedFilters, sortProducts } from '@/lib/utils/productCatalog'

export const selectProductsById = (state: RootState) => state.cart.productsById
export const selectItemsById = (state: RootState) => state.cart.itemsById
export const selectPromoCode = (state: RootState) => state.cart.promoCode
export const selectCategoryFilter = (state: RootState) => state.cart.categoryFilter
export const selectAdvancedFilters = (state: RootState) => state.cart.advancedFilters
export const selectCatalogStatus = (state: RootState) => state.cart.catalogStatus
export const selectCatalogError = (state: RootState) => state.cart.catalogError

export const selectCartPricing = createSelector(
  [selectItemsById, selectProductsById, selectPromoCode],
  (itemsById, productsById, promoCode) =>
    calculateCartPricing({ itemsById, productsById, promoCode }),
)

export const selectCartLines = createSelector(
  [selectItemsById, selectProductsById],
  (itemsById, productsById) =>
    Object.entries(itemsById)
      .map(([lineKey, line]) => {
        const product = productsById[line.productId]
        if (!product) return null
        const variant = getProductVariant(product, line.variantId)
        return { lineKey, ...line, product, variant }
      })
      .filter((line): line is NonNullable<typeof line> => line !== null),
)

export const selectFilteredProducts = createSelector(
  [selectProductsById, selectCategoryFilter],
  (productsById, categoryFilter) => {
    const products = Object.values(productsById)
    if (categoryFilter === 'all') return products
    return products.filter((product) => product.category === categoryFilter)
  },
)

export const selectAdvancedFilteredProducts = createSelector(
  [selectFilteredProducts, selectAdvancedFilters],
  (products, filters) => {
    const filtered = applyAdvancedFilters(products, filters)
    return sortProducts(filtered, filters.sortBy)
  },
)

export const selectProductById = (productId: string) => (state: RootState) =>
  state.cart.productsById[productId]

export const selectProductTotalQuantity = (productId: string) => (state: RootState) =>
  Object.values(state.cart.itemsById)
    .filter((line) => line.productId === productId)
    .reduce((sum, line) => sum + line.quantity, 0)

export const selectVariantQuantity =
  (productId: string, variantId?: string) => (state: RootState) => {
    const lineKey = getCartLineKey(productId, variantId)
    return state.cart.itemsById[lineKey]?.quantity ?? 0
  }

export const selectIsInCart = (productId: string) => (state: RootState) =>
  Object.values(state.cart.itemsById).some((line) => line.productId === productId)

export const selectCartItemCount = (state: RootState) => selectCartPricing(state).itemCount

export function sortProductsByName(products: Product[]): Product[] {
  return sortProducts(products, 'name-asc')
}

export const selectSortedFilteredProducts = createSelector(
  [selectFilteredProducts],
  (products) => sortProductsByName(products),
)

export const selectCategoryCounts = createSelector([selectProductsById], (productsById) => {
  const counts: Record<ProductCategory, number> = {
    all: Object.keys(productsById).length,
    electronics: 0,
    books: 0,
    home: 0,
    fashion: 0,
  }

  for (const product of Object.values(productsById)) {
    counts[product.category] += 1
  }

  return counts
})

export const selectCatalogPriceBounds = createSelector([selectProductsById], (productsById) => {
  const products = Object.values(productsById)
  if (products.length === 0) return { min: 0, max: 500 }
  const prices = products.map((product) => product.price)
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
})

export const selectAdvancedFilterResultCount = createSelector(
  [selectAdvancedFilteredProducts],
  (products) => products.length,
)
