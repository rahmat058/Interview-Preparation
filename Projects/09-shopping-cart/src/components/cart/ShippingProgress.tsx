import { Truck } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { selectCartPricing } from '@/lib/store/selectors/cartSelectors'
import { formatCurrency } from '@/lib/utils/cartPricing'
import { cn } from '@/lib/utils/cn'

export function ShippingProgress() {
  const pricing = useAppSelector(selectCartPricing)

  if (pricing.itemCount === 0) return null
  if (pricing.amountToFreeShipping <= 0) {
    return (
      <p className="flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700">
        <Truck className="h-3.5 w-3.5" />
        You unlocked free shipping!
      </p>
    )
  }

  const progress =
    ((pricing.freeShippingThreshold - pricing.amountToFreeShipping) /
      pricing.freeShippingThreshold) *
    100

  return (
    <div className="rounded-lg bg-cyan-50 px-3 py-2">
      <p className="flex items-center gap-1.5 text-xs font-medium text-cyan-800">
        <Truck className="h-3.5 w-3.5" />
        Add {formatCurrency(pricing.amountToFreeShipping)} more for free shipping
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cyan-100">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500')}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  )
}
