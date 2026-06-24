import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { collapseAll, expandAll, setSortBy } from '@/lib/store/slices/commentsSlice'
import { cn } from '@/lib/utils/cn'

export function CommentToolbar() {
  const dispatch = useAppDispatch()
  const { sortBy, meta } = useAppSelector((state) => state.comments)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100/80 pb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-800">
          {meta?.topLevelCount ?? 0} top-level threads
        </span>
        <div className="flex rounded-lg border border-orange-100 bg-white/70 p-0.5">
          {(['top', 'new'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => dispatch(setSortBy(option))}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                sortBy === option
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-orange-600',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(expandAll())}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-600"
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
          Expand all
        </button>
        <button
          type="button"
          onClick={() => dispatch(collapseAll())}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-600"
        >
          <ChevronsDownUp className="h-3.5 w-3.5" />
          Collapse all
        </button>
      </div>
    </div>
  )
}
