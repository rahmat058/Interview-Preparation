import { ChevronsDownUp, ChevronsUpDown, Search, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { collapseAll, expandAll, setFilterQuery } from '@/lib/store/slices/explorerSlice'
import { Button } from '@/components/ui/Button'

export function ExplorerToolbar() {
  const dispatch = useAppDispatch()
  const { filterQuery } = useAppSelector((state) => state.explorer)

  return (
    <div className="flex flex-col gap-3 border-b border-emerald-100/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1" data-explorer-search>
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          role="searchbox"
          aria-label="Filter files"
          value={filterQuery}
          onChange={(event) => dispatch(setFilterQuery(event.target.value))}
          placeholder="Filter files…"
          className="w-full rounded-xl border border-emerald-200/80 bg-white/80 py-2 pr-9 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60 focus:outline-none"
        />
        {filterQuery && (
          <button
            type="button"
            aria-label="Clear filter"
            onClick={() => dispatch(setFilterQuery(''))}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => dispatch(expandAll())}
          aria-label="Expand all folders"
        >
          <ChevronsUpDown className="h-4 w-4" />
          Expand
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => dispatch(collapseAll())}
          aria-label="Collapse all folders"
        >
          <ChevronsDownUp className="h-4 w-4" />
          Collapse
        </Button>
      </div>
    </div>
  )
}
