import productsData from '@/data/products.json'
import type { ProductsResponse } from '@/lib/types/cart'

export function getMockProducts(): ProductsResponse {
  return productsData as ProductsResponse
}
