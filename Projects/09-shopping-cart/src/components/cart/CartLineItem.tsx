import { Minus, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/lib/store/hooks'
import {
  decrementQuantity,
  incrementQuantity,
  removeItem,
  setQuantity,
} from '@/lib/store/slices/cartSlice'
import { formatCurrency, getLineTotal } from '@/lib/utils/cartPricing'
import type { Product } from '@/lib/types/cart'

interface CartLineItemProps {
  productId: string
  quantity: number
  product: Product
}

export function CartLineItem({ productId, quantity, product }: CartLineItemProps) {
  const dispatch = useAppDispatch()
  const lineTotal = getLineTotal(product, quantity)
  const atMax = quantity >= product.stock

  return (
    <li className="flex gap-3 border-b border-teal-100/80 py-4 last:border-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xl">
        {product.emoji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{product.name}</h4>
            <p className="text-xs text-slate-400">
              {formatCurrency(product.price)} each · {product.stock} available
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(removeItem(productId))}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            aria-label={`Remove ${product.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-teal-200 bg-white">
            <button
              type="button"
              onClick={() => dispatch(decrementQuantity(productId))}
              className="rounded-l-lg px-2.5 py-1.5 text-teal-700 hover:bg-teal-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(event) =>
                dispatch(
                  setQuantity({
                    productId,
                    quantity: Number(event.target.value),
                  }),
                )
              }
              className="w-10 border-x border-teal-100 bg-transparent py-1.5 text-center text-sm font-semibold tabular-nums text-slate-800 outline-none"
              aria-label={`Quantity for ${product.name}`}
            />
            <button
              type="button"
              onClick={() => dispatch(incrementQuantity(productId))}
              disabled={atMax}
              className="rounded-r-lg px-2.5 py-1.5 text-teal-700 hover:bg-teal-50 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-bold tabular-nums text-teal-700">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </li>
  )
}
