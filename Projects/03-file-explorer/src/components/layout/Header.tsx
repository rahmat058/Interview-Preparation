import { FolderTree } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'

export function Header() {
  const { meta, expandedPaths } = useAppSelector((state) => state.explorer)
  const expandedCount = Object.values(expandedPaths).filter(Boolean).length

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
            <FolderTree className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-lg font-bold text-transparent">
              TreeScope
            </h1>
            <p className="text-xs text-slate-500">File Explorer</p>
          </div>
        </div>
        {meta && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 tabular-nums">
              {meta.totalFiles} files
            </span>
            <span className="hidden rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 tabular-nums sm:inline">
              {expandedCount} open
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
