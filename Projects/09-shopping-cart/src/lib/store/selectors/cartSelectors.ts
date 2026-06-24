import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import type { Product, ProductCategory } from '@/lib/types/cart'
import { calculateCartPricing, getCartQuantity } from '@/lib/utils/cartPricing'

export const selectProductsById = (state: RootState) => state.cart.productsById
export const selectItemsById = (state: RootState) => state.cart.itemsById
export const selectPromoCode = (state: RootState) => state.cart.promoCode
export const selectCategoryFilter = (state: RootState) => state.cart.categoryFilter

export const selectCartPricing = createSelector(
  [selectItemsById, selectProductsById, selectPromoCode],
  (itemsById, productsById, promoCode) =>
    calculateCartPricing({ itemsById, productsById, promoCode }),
)

export const selectCartLines = createSelector(
  [selectItemsById, selectProductsById],
  (itemsById, productsById) =>
    Object.values(itemsById)
      .map((line) => {
        const product = productsById[line.productId]
        if (!product) return null
        return { ...line, product }
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

export const selectProductQuantity = (productId: string) => (state: RootState) =>
  getCartQuantity(state.cart.itemsById, productId)

export const selectIsInCart = (productId: string) => (state: RootState) =>
  Boolean(state.cart.itemsById[productId])

export const selectCartItemCount = (state: RootState) => selectCartPricing(state).itemCount

export function sortProductsByName(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.name.localeCompare(b.name))
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
