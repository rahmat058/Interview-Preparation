import { BellRing } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { selectToastCounts } from '@/lib/store/selectors/toastSelectors'

export function Header() {
  const counts = useAppSelector(selectToastCounts)

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
            <BellRing className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-lg font-bold text-transparent">
              ToastForge
            </h1>
            <p className="text-xs text-slate-500">Toast Notifications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 tabular-nums">
            {counts.visible} live
          </span>
          {counts.pending > 0 && (
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 tabular-nums">
              {counts.pending} queued
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
