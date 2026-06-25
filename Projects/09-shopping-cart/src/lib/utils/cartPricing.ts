import type { CartItemsById, CartPricing, Product } from '@/lib/types/cart'
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  SHIPPING_FLAT,
  TAX_RATE,
} from '@/lib/types/cart'

export function clampQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(quantity, stock))
}

export function getLineTotal(product: Product, quantity: number): number {
  return roundCurrency(product.price * quantity)
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

export interface PricingInput {
  itemsById: CartItemsById
  productsById: Record<string, Product>
  promoCode: string | null
}

export function calculateCartPricing(input: PricingInput): CartPricing {
  const { itemsById, productsById, promoCode } = input

  let subtotal = 0
  let itemCount = 0
  let uniqueCount = 0

  for (const line of Object.values(itemsById)) {
    const product = productsById[line.productId]
    if (!product) continue
    uniqueCount += 1
    itemCount += line.quantity
    subtotal += product.price * line.quantity
  }

  subtotal = roundCurrency(subtotal)

  const promo = promoCode ? PROMO_CODES[promoCode.toUpperCase()] : undefined
  let discount = 0
  let discountLabel: string | null = null

  if (promo?.type === 'percent') {
    discount = roundCurrency(subtotal * promo.value)
    discountLabel = promo.label
  }

  const discountedSubtotal = roundCurrency(subtotal - discount)
  const tax = roundCurrency(discountedSubtotal * TAX_RATE)

  let shipping = subtotal > 0 ? SHIPPING_FLAT : 0
  let shippingLabel = shipping === 0 ? 'Free' : formatCurrency(SHIPPING_FLAT)

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shipping = 0
    shippingLabel = 'Free — order over $75'
  }

  if (promo?.type === 'shipping') {
    shipping = 0
    shippingLabel = promo.label
  }

  const total = roundCurrency(discountedSubtotal + tax + shipping)
  const amountToFreeShipping = roundCurrency(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal))

  return {
    itemCount,
    uniqueCount,
    subtotal,
    discount,
    discountLabel,
    tax,
    shipping,
    shippingLabel,
    total,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping,
  }
}

export function getCartQuantity(itemsById: CartItemsById, productId: string, variantId?: string): number {
  const lineKey = variantId ? `${productId}:${variantId}` : productId
  return itemsById[lineKey]?.quantity ?? 0
}
