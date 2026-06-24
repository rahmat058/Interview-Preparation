import { ClipboardList } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { WIZARD_STEPS } from '@/lib/types/wizard'

export function Header() {
  const { currentStep, completedSteps, restoredFromStorage } = useAppSelector((state) => state.wizard)
  const progress = Math.round(((completedSteps.length + (currentStep === WIZARD_STEPS.length - 1 ? 1 : 0)) / WIZARD_STEPS.length) * 100)

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-lg font-bold text-transparent">
              FormFlow
            </h1>
            <p className="text-xs text-slate-500">Multi-Step Form</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {restoredFromStorage && (
            <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-medium text-amber-800 sm:inline">
              Draft restored
            </span>
          )}
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 tabular-nums">
            {progress}% complete
          </span>
        </div>
      </div>
    </header>
  )
}
