import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setCategoryFilter } from '@/lib/store/slices/cartSlice'
import { selectCategoryCounts } from '@/lib/store/selectors/cartSelectors'
import type { ProductCategory } from '@/lib/types/cart'
import { cn } from '@/lib/utils/cn'

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'books', label: 'Books' },
  { id: 'home', label: 'Home' },
  { id: 'fashion', label: 'Fashion' },
]

interface CategoryFilterProps {
  variant?: 'pills' | 'list'
}

export function CategoryFilter({ variant = 'pills' }: CategoryFilterProps) {
  const dispatch = useAppDispatch()
  const active = useAppSelector((state) => state.cart.categoryFilter)
  const counts = useAppSelector(selectCategoryCounts)

  if (variant === 'list') {
    return (
      <div className="space-y-1">
        {CATEGORIES.map(({ id, label }) => (
          <label
            key={id}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-teal-50/60',
              active === id && 'bg-teal-50',
            )}
          >
            <span className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="radio"
                name="category"
                checked={active === id}
                onChange={() => dispatch(setCategoryFilter(id))}
                className="h-4 w-4 border-teal-300 text-teal-600 focus:ring-teal-500"
              />
              {label}
            </span>
            <span className="text-xs text-slate-400 tabular-nums">{counts[id]}</span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => dispatch(setCategoryFilter(id))}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
            active === id
              ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25'
              : 'bg-white/70 text-slate-600 hover:bg-teal-50 hover:text-teal-700',
          )}
        >
          {label}
          <span className="ml-1 opacity-70">({counts[id]})</span>
        </button>
      ))}
    </div>
  )
}
