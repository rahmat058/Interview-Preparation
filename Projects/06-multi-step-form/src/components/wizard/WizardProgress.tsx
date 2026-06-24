import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setCurrentStep } from '@/lib/store/slices/wizardSlice'
import { WIZARD_STEPS } from '@/lib/types/wizard'
import { cn } from '@/lib/utils/cn'

export function WizardProgress() {
  const dispatch = useAppDispatch()
  const { currentStep, completedSteps } = useAppSelector((state) => state.wizard)

  const progressPercent = (currentStep / (WIZARD_STEPS.length - 1)) * 100

  return (
    <div className="mb-8">
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-amber-100/80">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>

      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {WIZARD_STEPS.map((step) => {
          const isActive = currentStep === step.id
          const isCompleted = completedSteps.includes(step.id)
          const isClickable = isCompleted || step.id <= currentStep

          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && dispatch(setCurrentStep(step.id))}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors',
                  isActive
                    ? 'border-amber-300 bg-amber-50/80 ring-2 ring-amber-200/60'
                    : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                      : 'border-slate-200/80 bg-white/50 opacity-60',
                  isClickable && !isActive && 'cursor-pointer hover:border-amber-200',
                  !isClickable && 'cursor-not-allowed',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                        : 'bg-slate-200 text-slate-500',
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.id + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-slate-800">{step.title}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{step.description}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
