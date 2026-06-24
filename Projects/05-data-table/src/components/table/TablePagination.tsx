import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setPage, setPageSize } from '@/lib/store/slices/tableSlice'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

const PAGE_SIZES = [10, 25, 50] as const

export function TablePagination() {
  const dispatch = useAppDispatch()
  const { resultMeta, status } = useAppSelector((state) => state.table)

  if (!resultMeta) return null

  const { page, pageSize, totalPages, filteredTotal } = resultMeta
  const start = filteredTotal === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, filteredTotal)
  const isLoading = status === 'loading'

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return
    dispatch(setPage(nextPage))
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce<(number | 'ellipsis')[]>((acc, n, i, arr) => {
      if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('ellipsis')
      acc.push(n)
      return acc
    }, [])

  return (
    <div className="flex flex-col gap-4 border-t border-blue-100/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{start}–{end}</span> of{' '}
        <span className="font-medium text-slate-700">{filteredTotal}</span>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-500">
          Rows
          <select
            value={pageSize}
            disabled={isLoading}
            onChange={(event) => dispatch(setPageSize(Number(event.target.value)))}
            className="rounded-lg border border-blue-200/80 bg-white px-2 py-1 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => goToPage(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-1 text-slate-400">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                disabled={isLoading}
                onClick={() => goToPage(item)}
                className={cn(
                  'min-w-[2rem] rounded-lg px-2 py-1 text-sm font-medium transition-colors',
                  item === page
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                )}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            ),
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isLoading}
            onClick={() => goToPage(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
