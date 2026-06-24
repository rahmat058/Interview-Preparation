import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setFilter } from '@/lib/store/slices/tableSlice'
import type { TableFilters } from '@/lib/types/table'

const FILTER_LABELS: Record<keyof TableFilters, string> = {
  department: 'Department',
  role: 'Role',
  status: 'Status',
  location: 'Location',
}

export function TableFilters() {
  const dispatch = useAppDispatch()
  const { query, datasetMeta } = useAppSelector((state) => state.table)

  if (!datasetMeta) return null

  const options: Record<keyof TableFilters, string[]> = {
    department: datasetMeta.departments,
    role: datasetMeta.roles,
    status: datasetMeta.statuses,
    location: datasetMeta.locations,
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {(Object.keys(FILTER_LABELS) as (keyof TableFilters)[]).map((key) => (
        <label key={key} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">{FILTER_LABELS[key]}</span>
          <select
            value={query.filters[key]}
            onChange={(event) => dispatch(setFilter({ key, value: event.target.value }))}
            className="rounded-lg border border-blue-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/60 focus:outline-none"
          >
            <option value="">All</option>
            {options[key].map((option) => (
              <option key={option} value={option}>
                {key === 'status' ? option.replace(/_/g, ' ') : option}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}
