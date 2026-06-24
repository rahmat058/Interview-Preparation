import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, Filter, Search, Table2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { loadDatasetMeta, setSearch } from '@/lib/store/slices/tableSlice'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useTableQueryLoader } from '@/hooks/useTableQueryLoader'
import { TableToolbar } from '@/components/table/TableToolbar'
import { TableFilters } from '@/components/table/TableFilters'
import { DataTable } from '@/components/table/DataTable'
import { TablePagination } from '@/components/table/TablePagination'
import { TableSkeleton } from '@/components/table/TableSkeleton'
import { TableError } from '@/components/table/TableError'

const TIPS = [
  { icon: Search, text: 'Debounced global search' },
  { icon: Filter, text: 'Multi-column filters' },
  { icon: ArrowUpDown, text: 'Sortable headers' },
  { icon: Table2, text: 'Server-style pagination' },
]

export function TableApp() {
  const dispatch = useAppDispatch()
  const { query, status, error, resultMeta } = useAppSelector((state) => state.table)
  const [searchInput, setSearchInput] = useState(query.search)
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    dispatch(loadDatasetMeta())
  }, [dispatch])

  useEffect(() => {
    dispatch(setSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  useTableQueryLoader([
    query.search,
    query.sortBy,
    query.sortOrder,
    query.filters.department,
    query.filters.role,
    query.filters.status,
    query.filters.location,
    query.page,
    query.pageSize,
  ])

  const isInitialLoad = status === 'loading' && resultMeta === null

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-gradient-to-r from-slate-700 via-blue-600 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Data Table
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
          Sort, filter, search, and paginate 80 employee records. Query pipeline runs search → filter → sort → paginate.
        </p>
      </motion.div>

      {status === 'failed' && error && (
        <div className="mt-8">
          <TableError message={error} />
        </div>
      )}

      {status !== 'failed' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-8"
        >
          {isInitialLoad ? (
            <TableSkeleton />
          ) : (
            <div className="glass-card p-5 sm:p-6">
              <TableToolbar searchInput={searchInput} onSearchChange={setSearchInput} />

              <div className="mt-4">
                <TableFilters />
              </div>

              <div className="mt-5">
                <DataTable />
              </div>

              <div className="mt-5">
                <TablePagination />
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5 text-blue-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  )
}
