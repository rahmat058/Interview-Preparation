import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  Heart,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { addItem } from '@/lib/store/slices/cartSlice'
import { selectIsInCart, selectProductTotalQuantity } from '@/lib/store/selectors/cartSelectors'
import { getDefaultVariantId } from '@/lib/types/cart'
import { formatCurrency } from '@/lib/utils/cartPricing'
import {
  getDeliveryEta,
  getProductPromo,
  getProductSeller,
  hasFreeDelivery,
  isNewProduct,
  isSoldOut,
} from '@/lib/utils/productDisplay'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/lib/types/cart'

interface ProductCardProps {
  product: Product
  index: number
  linkToDetail?: boolean
  layout?: 'compact' | 'catalog-grid' | 'catalog-list'
  onBuyNow?: () => void
}

export function ProductCard({
  product,
  index,
  linkToDetail = false,
  layout = 'compact',
  onBuyNow,
}: ProductCardProps) {
  const dispatch = useAppDispatch()
  const quantity = useAppSelector(selectProductTotalQuantity(product.id))
  const inCart = useAppSelector(selectIsInCart(product.id))
  const defaultVariantId = getDefaultVariantId(product)
  const soldOut = isSoldOut(product)
  const atMax = quantity >= product.stock
  const [wishlisted, setWishlisted] = useState(false)

  const promo = getProductPromo(product)
  const seller = getProductSeller(product)
  const freeDelivery = hasFreeDelivery(product)
  const isNew = isNewProduct(product)

  const handleBuyNow = () => {
    if (!atMax && !soldOut) {
      dispatch(addItem({ productId: product.id, variantId: defaultVariantId }))
    }
    onBuyNow?.()
  }

  if (layout === 'catalog-list') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02, duration: 0.3 }}
        className="flex gap-4 rounded-xl border border-teal-100/80 bg-white/90 p-4 transition-shadow hover:shadow-md hover:shadow-teal-500/10"
      >
        <Link
          to={`/products/${product.id}`}
          className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-teal-50 to-cyan-50 text-4xl"
        >
          {product.emoji}
          {soldOut && <SoldOutBadge className="text-[10px]" />}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-cyan-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span className="font-medium">{seller}</span>
              <span className="text-teal-600">Verified</span>
            </div>

            <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
              <Link to={`/products/${product.id}`} className="hover:text-teal-700">
                {product.name}
              </Link>
            </h3>

            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{product.description}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-3 w-3 fill-current" />
                {product.rating}
              </span>
              {isNew && <Tag label="New" />}
              {freeDelivery && (
                <span className="flex items-center gap-1 text-teal-600">
                  <Truck className="h-3 w-3" />
                  Free delivery
                </span>
              )}
              <span className="text-slate-400">{getDeliveryEta(product)}</span>
            </div>
          </div>

          <div className="mt-3 flex shrink-0 flex-col items-end justify-between gap-3 sm:mt-0 sm:min-w-[140px]">
            <PriceBlock
              price={product.price}
              originalPrice={promo.originalPrice}
              discountPercent={promo.discountPercent}
            />
            <button
              type="button"
              disabled={soldOut || atMax}
              onClick={handleBuyNow}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 sm:w-auto"
            >
              <ShoppingCart className="h-4 w-4" />
              {soldOut ? 'Sold out' : inCart ? `In cart (${quantity})` : 'Buy Now'}
            </button>
          </div>
        </div>
      </motion.article>
    )
  }

  if (layout === 'catalog-grid') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.35 }}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-teal-100/80 bg-white/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/10"
      >
        <div className="relative">
          <span className="absolute top-2 left-2 z-10 rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{promo.discountPercent}%
          </span>
          <button
            type="button"
            onClick={() => setWishlisted((value) => !value)}
            className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 text-slate-400 shadow-sm transition-colors hover:text-rose-500"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-4 w-4', wishlisted && 'fill-rose-500 text-rose-500')} />
          </button>

          <Link
            to={`/products/${product.id}`}
            className="relative flex h-40 items-center justify-center bg-linear-to-br from-teal-50 via-white to-cyan-50 text-5xl"
          >
            {product.emoji}
            {soldOut && <SoldOutBadge />}
          </Link>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1.5 flex items-center gap-1 text-[11px] text-cyan-700">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate font-medium">{seller}</span>
            <span className="shrink-0 text-teal-600">Verified</span>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
            <Link to={`/products/${product.id}`} className="hover:text-teal-700">
              {product.name}
            </Link>
          </h3>

          <div className="mt-2">
            <PriceBlock
              price={product.price}
              originalPrice={promo.originalPrice}
              discountPercent={promo.discountPercent}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {isNew && <Tag label="New" />}
            <span className="flex items-center gap-0.5 text-xs text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              {product.rating}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-teal-50 pt-3 text-[11px] text-slate-500">
            {freeDelivery ? (
              <span className="flex items-center gap-1 text-teal-600">
                <Truck className="h-3 w-3" />
                Free delivery
              </span>
            ) : (
              <span>Standard shipping</span>
            )}
            <span>{getDeliveryEta(product)}</span>
          </div>

          <button
            type="button"
            disabled={soldOut || atMax}
            onClick={handleBuyNow}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {soldOut ? 'Sold out' : inCart ? `In cart (${quantity})` : 'Buy Now'}
          </button>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="flex h-full flex-col rounded-xl border border-teal-100/80 bg-white/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/10"
    >
      <div className="mb-3 flex h-16 items-center justify-center rounded-xl bg-linear-to-br from-teal-50 to-cyan-50 text-3xl">
        {product.emoji}
      </div>

      <div className="mb-1 flex items-center gap-1 text-xs text-amber-500">
        <Star className="h-3 w-3 fill-current" />
        <span className="font-medium">{product.rating}</span>
        <span className="text-slate-400">· {product.stock} in stock</span>
        {product.variants && (
          <span className="text-slate-400">· {product.variants.length} colors</span>
        )}
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
        {linkToDetail ? (
          <Link to={`/products/${product.id}`} className="hover:text-teal-700">
            {product.name}
          </Link>
        ) : (
          product.name
        )}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-xs text-slate-500">{product.description}</p>

      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="text-lg font-bold text-teal-700">{formatCurrency(product.price)}</span>
        <button
          type="button"
          disabled={atMax}
          onClick={handleBuyNow}
          className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </motion.article>
  )
}

function PriceBlock({
  price,
  originalPrice,
  discountPercent,
}: {
  price: number
  originalPrice: number
  discountPercent: number
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-lg font-bold text-teal-700">{formatCurrency(price)}</span>
      <span className="text-xs text-slate-400 line-through">{formatCurrency(originalPrice)}</span>
      <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
        -{discountPercent}%
      </span>
    </div>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
      {label}
    </span>
  )
}

function SoldOutBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute inset-x-3 top-1/2 -translate-y-1/2 rounded bg-slate-900/75 py-1.5 text-center text-xs font-bold tracking-wider text-white uppercase',
        className,
      )}
    >
      Sold out
    </span>
  )
}
