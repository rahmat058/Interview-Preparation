import { LayoutGrid } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { getCardCount } from '@/lib/utils/kanbanHelpers'

export function Header() {
  const { meta, columns } = useAppSelector((state) => state.kanban)
  const cardCount = getCardCount(columns)

  return (
    <header className="sticky top-0 z-50 border-b border-violet-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-lg font-bold text-transparent">
              FlowBoard
            </h1>
            <p className="text-xs text-slate-500">Kanban Board</p>
          </div>
        </div>
        {meta && (
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 sm:inline">
              {meta.boardTitle}
            </span>
            <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-medium text-fuchsia-800 tabular-nums">
              {cardCount} cards
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
