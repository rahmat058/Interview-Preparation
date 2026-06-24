import { Search, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { resetFilters } from '@/lib/store/slices/tableSlice'
import { countActiveFilters } from '@/lib/utils/tableQuery'
import { Button } from '@/components/ui/Button'

interface TableToolbarProps {
  searchInput: string
  onSearchChange: (value: string) => void
}

export function TableToolbar({ searchInput, onSearchChange }: TableToolbarProps) {
  const dispatch = useAppDispatch()
  const { query } = useAppSelector((state) => state.table)
  const activeFilters = countActiveFilters(query.filters)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          role="searchbox"
          aria-label="Search employees"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, email, department…"
          className="w-full rounded-xl border border-blue-200/80 bg-white/80 py-2 pr-9 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/60 focus:outline-none"
        />
        {searchInput && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange('')}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {(activeFilters > 0 || query.search) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSearchChange('')
            dispatch(resetFilters())
          }}
        >
          Clear all ({activeFilters + (query.search ? 1 : 0)})
        </Button>
      )}
    </div>
  )
}
