import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setPriceRange } from '@/lib/store/slices/cartSlice'
import {
  selectAdvancedFilters,
  selectCatalogPriceBounds,
  selectFilteredProducts,
} from '@/lib/store/selectors/cartSelectors'
import { formatCurrency } from '@/lib/utils/cartPricing'
import { cn } from '@/lib/utils/cn'

const BUCKETS = [
  { id: 'under50', label: 'Under $50', min: 0, max: 50 },
  { id: '50-100', label: '$50 – $100', min: 50, max: 100 },
  { id: '100-200', label: '$100 – $200', min: 100, max: 200 },
  { id: '200plus', label: '$200+', min: 200, max: 9999 },
] as const

export function PriceBucketFilter() {
  const dispatch = useAppDispatch()
  const { priceMin, priceMax } = useAppSelector(selectAdvancedFilters)
  const bounds = useAppSelector(selectCatalogPriceBounds)
  const categoryProducts = useAppSelector(selectFilteredProducts)

  const activeId =
    BUCKETS.find((bucket) => bucket.min === priceMin && bucket.max === priceMax)?.id ??
    (priceMin === bounds.min && priceMax === bounds.max ? 'all' : null)

  return (
    <div className="space-y-1">
      <label
        className={cn(
          'flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-teal-50/60',
          activeId === 'all' && 'bg-teal-50',
        )}
      >
        <span className="flex items-center gap-2.5 text-sm text-slate-700">
          <input
            type="radio"
            name="price-bucket"
            checked={activeId === 'all'}
            onChange={() => dispatch(setPriceRange({ min: bounds.min, max: bounds.max }))}
            className="h-4 w-4 border-teal-300 text-teal-600 focus:ring-teal-500"
          />
          All prices
        </span>
        <span className="text-xs text-slate-400 tabular-nums">{categoryProducts.length}</span>
      </label>

      {BUCKETS.map((bucket) => {
        const count = categoryProducts.filter(
          (product) => product.price >= bucket.min && product.price <= bucket.max,
        ).length
        const isActive = activeId === bucket.id

        return (
          <label
            key={bucket.id}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-teal-50/60',
              isActive && 'bg-teal-50',
            )}
          >
            <span className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="radio"
                name="price-bucket"
                checked={isActive}
                onChange={() => dispatch(setPriceRange({ min: bucket.min, max: bucket.max }))}
                className="h-4 w-4 border-teal-300 text-teal-600 focus:ring-teal-500"
              />
              {bucket.label}
            </span>
            <span className="text-xs text-slate-400 tabular-nums">{count}</span>
          </label>
        )
      })}

      <div className="mt-3 rounded-lg bg-teal-50/50 px-3 py-2 text-xs text-slate-500">
        Custom: {formatCurrency(priceMin)} – {formatCurrency(priceMax)}
      </div>
    </div>
  )
}
