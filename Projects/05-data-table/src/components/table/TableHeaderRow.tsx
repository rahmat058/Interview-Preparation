import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { toggleSort } from '@/lib/store/slices/tableSlice'
import { cn } from '@/lib/utils/cn'
import { TABLE_COLUMNS, type SortableColumn } from '@/lib/types/table'

export function TableHeaderRow() {
  const dispatch = useAppDispatch()
  const { query } = useAppSelector((state) => state.table)

  function renderSortIcon(column: SortableColumn) {
    if (query.sortBy !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
    }
    return query.sortOrder === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
    )
  }

  return (
    <thead>
      <tr className="border-b border-blue-100/80 bg-blue-50/40">
        {TABLE_COLUMNS.map((column) => (
          <th
            key={column.id}
            scope="col"
            className={cn(
              'px-4 py-3 text-xs font-semibold tracking-wide text-slate-600 uppercase',
              column.align === 'right' ? 'text-right' : 'text-left',
            )}
          >
            <button
              type="button"
              onClick={() => dispatch(toggleSort(column.id))}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md outline-none hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300',
                column.align === 'right' && 'ml-auto',
                query.sortBy === column.id && 'text-blue-700',
              )}
              aria-sort={
                query.sortBy === column.id
                  ? query.sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              {column.label}
              {renderSortIcon(column.id)}
            </button>
          </th>
        ))}
      </tr>
    </thead>
  )
}
