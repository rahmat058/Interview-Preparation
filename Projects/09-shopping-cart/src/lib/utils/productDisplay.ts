import type { Product } from '@/lib/types/cart'
import { roundCurrency } from '@/lib/utils/cartPricing'

const SELLERS = ['CartPulse Official', 'Tech Hub', 'Home & Living', 'Style Co'] as const

export function getProductSeller(product: Product): string {
  const index = parseInt(product.id.replace(/\D/g, ''), 10) % SELLERS.length
  return SELLERS[index]!
}

export function getProductPromo(product: Product) {
  const seed = parseInt(product.id.replace(/\D/g, ''), 10)
  const discountPercent = 10 + (seed % 4) * 10
  const originalPrice = roundCurrency(product.price / (1 - discountPercent / 100))
  return { discountPercent, originalPrice }
}

export function hasFreeDelivery(product: Product): boolean {
  return product.price >= 50
}

export function isNewProduct(product: Product): boolean {
  return product.rating >= 4.7
}

export function getDeliveryEta(product: Product): string {
  return product.stock > 0 ? 'In 2-3 days' : 'Unavailable'
}

export function isSoldOut(product: Product): boolean {
  return product.stock < 1
}
