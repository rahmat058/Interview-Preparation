import { Table2 } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'

export function Header() {
  const { resultMeta } = useAppSelector((state) => state.table)

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-blue-600 shadow-lg shadow-blue-500/30">
            <Table2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-lg font-bold text-transparent">
              GridLens
            </h1>
            <p className="text-xs text-slate-500">Data Table</p>
          </div>
        </div>
        {resultMeta && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 tabular-nums">
            {resultMeta.filteredTotal} of {resultMeta.total} rows
          </span>
        )}
      </div>
    </header>
  )
}
