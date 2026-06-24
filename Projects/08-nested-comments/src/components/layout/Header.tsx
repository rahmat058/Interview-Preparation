import { MessageSquareText } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'

export function Header() {
  const { meta } = useAppSelector((state) => state.comments)

  return (
    <header className="sticky top-0 z-50 border-b border-orange-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/30">
            <MessageSquareText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-lg font-bold text-transparent">
              ThreadNest
            </h1>
            <p className="text-xs text-slate-500">Nested Comments</p>
          </div>
        </div>
        {meta && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 tabular-nums">
            {meta.totalComments} comments · depth {meta.maxDepth}
          </span>
        )}
      </div>
    </header>
  )
}
