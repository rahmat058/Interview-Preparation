import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setSortBy } from '@/lib/store/slices/cartSlice'
import { selectAdvancedFilters } from '@/lib/store/selectors/cartSelectors'
import type { CatalogSortBy } from '@/lib/types/cart'
import { SORT_OPTIONS } from '@/lib/utils/productCatalog'
import { cn } from '@/lib/utils/cn'

interface SortSelectProps {
  hideLabel?: boolean
}

export function SortSelect({ hideLabel = false }: SortSelectProps) {
  const dispatch = useAppDispatch()
  const { sortBy } = useAppSelector(selectAdvancedFilters)

  return (
    <div className="space-y-2">
      <label
        htmlFor="sort-by"
        className={cn(
          'text-xs font-semibold text-slate-700',
          hideLabel && 'sr-only',
        )}
      >
        Sort by
      </label>
      <select
        id="sort-by"
        value={sortBy}
        onChange={(event) => dispatch(setSortBy(event.target.value as CatalogSortBy))}
        className={cn(
          'w-full rounded-xl border border-teal-200 bg-white/80 px-3 py-2 text-sm text-slate-700',
          'outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100',
        )}
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
