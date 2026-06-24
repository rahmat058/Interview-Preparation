export type ProductCategory = 'electronics' | 'books' | 'home' | 'fashion' | 'all'

export interface Product {
  id: string
  name: string
  category: Exclude<ProductCategory, 'all'>
  price: number
  stock: number
  rating: number
  emoji: string
  description: string
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
  quantity: number
}

export interface CartItemsById {
  [productId: string]: CartLineItem
}

export type CatalogStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface CartState {
  productsById: Record<string, Product>
  meta: ProductsMeta | null
  itemsById: CartItemsById
  promoCode: string | null
  categoryFilter: ProductCategory
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
