import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { addItem } from '@/lib/store/slices/cartSlice'
import { selectIsInCart, selectProductQuantity } from '@/lib/store/selectors/cartSelectors'
import { formatCurrency } from '@/lib/utils/cartPricing'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/lib/types/cart'

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const quantity = useAppSelector(selectProductQuantity(product.id))
  const inCart = useAppSelector(selectIsInCart(product.id))
  const atMax = quantity >= product.stock

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="flex flex-col rounded-xl border border-teal-100/80 bg-white/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/10"
    >
      <div className="mb-3 flex h-16 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 text-3xl">
        {product.emoji}
      </div>

      <div className="mb-1 flex items-center gap-1 text-xs text-amber-500">
        <Star className="h-3 w-3 fill-current" />
        <span className="font-medium">{product.rating}</span>
        <span className="text-slate-400">· {product.stock} in stock</span>
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">{product.name}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-xs text-slate-500">{product.description}</p>

      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="text-lg font-bold text-teal-700">{formatCurrency(product.price)}</span>
        <Button
          size="sm"
          variant={inCart ? 'outline' : 'primary'}
          disabled={atMax}
          onClick={() => dispatch(addItem(product.id))}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-3.5 w-3.5" />
          {inCart ? `In cart (${quantity})` : 'Add'}
        </Button>
      </div>
    </motion.article>
  )
}
