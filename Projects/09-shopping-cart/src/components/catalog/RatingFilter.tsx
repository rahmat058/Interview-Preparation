import { Star } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setMinRating } from '@/lib/store/slices/cartSlice'
import { selectAdvancedFilters } from '@/lib/store/selectors/cartSelectors'
import { cn } from '@/lib/utils/cn'

const RATING_OPTIONS = [
  { value: 0, label: 'Any rating' },
  { value: 4, label: '4.0 & up' },
  { value: 4.5, label: '4.5 & up' },
]

interface RatingFilterProps {
  variant?: 'pills' | 'list'
}

export function RatingFilter({ variant = 'pills' }: RatingFilterProps) {
  const dispatch = useAppDispatch()
  const { minRating } = useAppSelector(selectAdvancedFilters)

  if (variant === 'list') {
    return (
      <div className="space-y-1">
        {RATING_OPTIONS.map(({ value, label }) => (
          <label
            key={value}
            className={cn(
              'flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-teal-50/60',
              minRating === value && 'bg-teal-50',
            )}
          >
            <input
              type="radio"
              name="min-rating"
              checked={minRating === value}
              onChange={() => dispatch(setMinRating(value))}
              className="h-4 w-4 border-teal-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="flex items-center gap-1 text-sm text-slate-700">
              {value > 0 && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
              {label}
            </span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-slate-700">Minimum rating</span>
      <div className="flex flex-wrap gap-2">
        {RATING_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => dispatch(setMinRating(value))}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              minRating === value
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25'
                : 'bg-white/70 text-slate-600 hover:bg-teal-50 hover:text-teal-700',
            )}
          >
            {value > 0 && <Star className="h-3 w-3 fill-current" />}
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
