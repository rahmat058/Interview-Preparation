import type { AdvancedFilters, CatalogSortBy, Product } from '@/lib/types/cart'
import { hasFreeDelivery } from '@/lib/utils/productDisplay'

const SORT_LABELS: Record<CatalogSortBy, string> = {
  'name-asc': 'Relevance',
  'name-desc': 'Name: Z–A',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'rating-desc': 'Top Rated',
}

export function getSortLabel(sortBy: CatalogSortBy): string {
  return SORT_LABELS[sortBy] ?? 'Relevance'
}

export const SORT_OPTIONS: { value: CatalogSortBy; label: string }[] = (
  Object.entries(SORT_LABELS) as [CatalogSortBy, string][]
).map(([value, label]) => ({ value, label }))

export function getCatalogPriceBounds(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 500 }
  const prices = products.map((product) => product.price)
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
}

export function sortProducts(products: Product[], sortBy: CatalogSortBy): Product[] {
  const sorted = [...products]
  switch (sortBy) {
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'name-asc':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
}

export function applyAdvancedFilters(
  products: Product[],
  filters: AdvancedFilters,
): Product[] {
  return products.filter((product) => {
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false
    if (filters.minRating > 0 && product.rating < filters.minRating) return false
    if (filters.inStockOnly && product.stock < 1) return false
    if (filters.freeDeliveryOnly && !hasFreeDelivery(product)) return false
    return true
  })
}
