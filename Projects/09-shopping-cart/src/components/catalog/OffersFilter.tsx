import { BadgeCheck, Truck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setFreeDeliveryOnly, setInStockOnly } from '@/lib/store/slices/cartSlice'
import { selectAdvancedFilters } from '@/lib/store/selectors/cartSelectors'
import { cn } from '@/lib/utils/cn'

export function OffersFilter() {
  const dispatch = useAppDispatch()
  const { inStockOnly, freeDeliveryOnly } = useAppSelector(selectAdvancedFilters)

  const options = [
    {
      id: 'in-stock',
      label: 'In stock',
      checked: inStockOnly,
      onChange: (checked: boolean) => dispatch(setInStockOnly(checked)),
      icon: null,
    },
    {
      id: 'free-delivery',
      label: 'Free delivery',
      checked: freeDeliveryOnly,
      onChange: (checked: boolean) => dispatch(setFreeDeliveryOnly(checked)),
      icon: Truck,
    },
  ] as const

  return (
    <div className="space-y-1">
      {options.map(({ id, label, checked, onChange, icon: Icon }) => (
        <label
          key={id}
          className={cn(
            'flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-teal-50/60',
            checked && 'bg-teal-50',
          )}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className="h-4 w-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
          />
          {Icon && <Icon className="h-3.5 w-3.5 text-teal-600" />}
          <span className="text-sm text-slate-700">{label}</span>
        </label>
      ))}

      <p className="mt-2 flex items-center gap-1.5 px-2 text-[11px] text-cyan-700">
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified sellers on orders $50+
      </p>
    </div>
  )
}
