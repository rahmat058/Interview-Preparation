import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardCheck, Database, ShieldCheck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { restoreWizardState, resetWizard } from '@/lib/store/slices/wizardSlice'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { WizardProgress } from '@/components/wizard/WizardProgress'
import { WizardNavigation } from '@/components/wizard/WizardNavigation'
import { WizardSuccess } from '@/components/wizard/WizardSuccess'
import { useStartOverWizard } from '@/hooks/useStartOverWizard'
import { StepPersonal } from '@/components/wizard/steps/StepPersonal'
import { StepProfessional } from '@/components/wizard/steps/StepProfessional'
import { StepPreferences } from '@/components/wizard/steps/StepPreferences'
import { StepReview } from '@/components/wizard/steps/StepReview'
import {
  WIZARD_DEFAULT_VALUES,
  wizardFormSchema,
  type WizardFormValues,
} from '@/lib/validation/wizardSchemas'
import {
  clearPersistedWizard,
  loadPersistedWizard,
  mergeWithDefaults,
} from '@/lib/utils/wizardPersistence'

const STEP_COMPONENTS = [StepPersonal, StepProfessional, StepPreferences, StepReview]

const TIPS = [
  { icon: ShieldCheck, text: 'Zod validation per step' },
  { icon: Database, text: 'localStorage persistence' },
  { icon: ClipboardCheck, text: 'react-hook-form architecture' },
]

export function WizardApp() {
  const dispatch = useAppDispatch()
  const { currentStep, submitStatus } = useAppSelector((state) => state.wizard)
  const startOver = useStartOverWizard()

  const savedDraft = useMemo(() => loadPersistedWizard(), [])

  const methods = useForm<WizardFormValues>({
    defaultValues: savedDraft ? mergeWithDefaults(savedDraft.formValues) : WIZARD_DEFAULT_VALUES,
    resolver: zodResolver(wizardFormSchema),
    mode: 'onTouched',
  })

  useEffect(() => {
    if (savedDraft) {
      dispatch(
        restoreWizardState({
          currentStep: savedDraft.currentStep,
          completedSteps: savedDraft.completedSteps,
        }),
      )
    }
  }, [dispatch, savedDraft])

  useFormPersistence(methods.watch)

  function handleClearDraft() {
    clearPersistedWizard()
    methods.reset(WIZARD_DEFAULT_VALUES)
    dispatch(resetWizard())
  }

  if (submitStatus === 'succeeded') {
    return (
      <main className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <WizardSuccess onStartOver={startOver} />
      </main>
    )
  }

  const StepComponent = STEP_COMPONENTS[currentStep] ?? StepPersonal

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Multi-Step Form
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 sm:text-base">
          Onboarding wizard with step validation, progress tracking, and auto-save to localStorage.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="glass-card mt-8 p-5 sm:p-8"
      >
        <FormProvider {...methods}>
          <form onSubmit={(event) => event.preventDefault()} noValidate>
            <WizardProgress />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>

            {submitStatus === 'failed' && (
              <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                Submission failed. Please try again.
              </p>
            )}

            <WizardNavigation
              trigger={methods.trigger}
              handleSubmit={methods.handleSubmit}
              onClearDraft={handleClearDraft}
            />
          </form>
        </FormProvider>
      </motion.div>

      <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5 text-amber-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  )
}
