import { LayoutGrid, List } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setCatalogViewMode } from '@/lib/store/slices/cartSlice'
import { selectAdvancedFilters } from '@/lib/store/selectors/cartSelectors'
import type { CatalogViewMode } from '@/lib/types/cart'
import { cn } from '@/lib/utils/cn'

const MODES: { id: CatalogViewMode; icon: typeof LayoutGrid; label: string }[] = [
  { id: 'grid', icon: LayoutGrid, label: 'Grid view' },
  { id: 'list', icon: List, label: 'List view' },
]

export function CatalogViewToggle() {
  const dispatch = useAppDispatch()
  const { viewMode } = useAppSelector(selectAdvancedFilters)

  return (
    <div
      className="flex rounded-xl border border-teal-200/80 bg-white/80 p-1"
      role="group"
      aria-label="Catalog view mode"
    >
      {MODES.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => dispatch(setCatalogViewMode(id))}
          aria-label={label}
          aria-pressed={viewMode === id}
          className={cn(
            'rounded-lg p-2 transition-all duration-200',
            viewMode === id
              ? 'bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25'
              : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700',
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
