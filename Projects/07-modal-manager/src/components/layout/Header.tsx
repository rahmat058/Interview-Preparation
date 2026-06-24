import { Layers } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'

export function Header() {
  const stackSize = useAppSelector((state) => state.modal.stack.length)

  return (
    <header className="sticky top-0 z-50 border-b border-violet-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-lg font-bold text-transparent">
              LayerForge
            </h1>
            <p className="text-xs text-slate-500">Modal Manager</p>
          </div>
        </div>
        <span
          className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 tabular-nums"
          aria-live="polite"
        >
          {stackSize === 0 ? 'No modals open' : `${stackSize} modal${stackSize > 1 ? 's' : ''} open`}
        </span>
      </div>
    </header>
  )
}
