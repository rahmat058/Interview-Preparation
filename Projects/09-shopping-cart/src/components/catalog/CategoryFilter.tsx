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

export function CategoryFilter() {
  const dispatch = useAppDispatch()
  const active = useAppSelector((state) => state.cart.categoryFilter)
  const counts = useAppSelector(selectCategoryCounts)

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
