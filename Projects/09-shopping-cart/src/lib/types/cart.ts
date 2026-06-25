export type ProductCategory = 'electronics' | 'books' | 'home' | 'fashion' | 'all'

export type CatalogSortBy =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'

export type CatalogViewMode = 'grid' | 'list'

export interface ProductVariant {
  id: string
  color: string
  hex: string
  stock: number
  emoji?: string
}

export interface Product {
  id: string
  name: string
  category: Exclude<ProductCategory, 'all'>
  price: number
  stock: number
  rating: number
  emoji: string
  description: string
  variants?: ProductVariant[]
  defaultVariantId?: string
}

export interface ProductsMeta {
  schemaVersion: string
  collection: string
  totalProducts: number
  categories: string[]
  currency: string
  generatedAt: string
}

export interface ProductsResponse {
  meta: ProductsMeta
  data: Product[]
}

export interface CartLineItem {
  productId: string
  variantId?: string
  quantity: number
}

export interface CartItemsById {
  [lineKey: string]: CartLineItem
}

export type CatalogStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface AdvancedFilters {
  priceMin: number
  priceMax: number
  minRating: number
  inStockOnly: boolean
  freeDeliveryOnly: boolean
  sortBy: CatalogSortBy
  viewMode: CatalogViewMode
}

export interface CartState {
  productsById: Record<string, Product>
  meta: ProductsMeta | null
  itemsById: CartItemsById
  promoCode: string | null
  categoryFilter: ProductCategory
  advancedFilters: AdvancedFilters
  catalogStatus: CatalogStatus
  catalogError: string | null
  restoredFromStorage: boolean
}

export interface CartPricing {
  itemCount: number
  uniqueCount: number
  subtotal: number
  discount: number
  discountLabel: string | null
  tax: number
  shipping: number
  shippingLabel: string
  total: number
  freeShippingThreshold: number
  amountToFreeShipping: number
}

export const PROMO_CODES: Record<
  string,
  { type: 'percent' | 'shipping'; value: number; label: string }
> = {
  SAVE10: { type: 'percent', value: 0.1, label: '10% off' },
  FREESHIP: { type: 'shipping', value: 0, label: 'Free shipping' },
}

export const TAX_RATE = 0.08
export const SHIPPING_FLAT = 5.99
export const FREE_SHIPPING_THRESHOLD = 75

export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  priceMin: 0,
  priceMax: 500,
  minRating: 0,
  inStockOnly: false,
  freeDeliveryOnly: false,
  sortBy: 'name-asc',
  viewMode: 'grid',
}

export function getCartLineKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId
}

export function getProductVariant(product: Product, variantId?: string): ProductVariant | undefined {
  if (!variantId || !product.variants) return undefined
  return product.variants.find((variant) => variant.id === variantId)
}

export function getProductStock(product: Product, variantId?: string): number {
  const variant = getProductVariant(product, variantId)
  if (variant) return variant.stock
  return product.stock
}

export function getProductDisplayEmoji(product: Product, variantId?: string): string {
  const variant = getProductVariant(product, variantId)
  return variant?.emoji ?? product.emoji
}

export function getDefaultVariantId(product: Product): string | undefined {
  if (!product.variants?.length) return undefined
  return product.defaultVariantId ?? product.variants[0]?.id
}
