import { useAppSelector } from '@/lib/store/hooks'
import { selectCartPricing } from '@/lib/store/selectors/cartSelectors'
import { formatCurrency } from '@/lib/utils/cartPricing'
import { TAX_RATE } from '@/lib/types/cart'

export function CartSummary() {
  const pricing = useAppSelector(selectCartPricing)

  if (pricing.itemCount === 0) return null

  return (
    <div className="space-y-2 border-t border-teal-100/80 pt-4 text-sm">
      <div className="flex justify-between text-slate-600">
        <span>
          Subtotal ({pricing.itemCount} item{pricing.itemCount === 1 ? '' : 's'})
        </span>
        <span className="tabular-nums">{formatCurrency(pricing.subtotal)}</span>
      </div>

      {pricing.discount > 0 && (
        <div className="flex justify-between text-teal-600">
          <span>{pricing.discountLabel}</span>
          <span className="tabular-nums">−{formatCurrency(pricing.discount)}</span>
        </div>
      )}

      <div className="flex justify-between text-slate-600">
        <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
        <span className="tabular-nums">{formatCurrency(pricing.tax)}</span>
      </div>

      <div className="flex justify-between text-slate-600">
        <span>Shipping</span>
        <span className="tabular-nums">
          {pricing.shipping === 0 ? pricing.shippingLabel : formatCurrency(pricing.shipping)}
        </span>
      </div>

      <div className="flex justify-between border-t border-teal-100 pt-2 text-base font-bold text-slate-900">
        <span>Total</span>
        <span className="tabular-nums text-teal-700">{formatCurrency(pricing.total)}</span>
      </div>
    </div>
  )
}
