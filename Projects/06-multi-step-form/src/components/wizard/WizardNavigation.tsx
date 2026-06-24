import { ChevronLeft, ChevronRight, Send, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  goToNextStep,
  goToPreviousStep,
  markStepCompleted,
  submitWizard,
} from '@/lib/store/slices/wizardSlice'
import { WIZARD_STEPS } from '@/lib/types/wizard'
import { STEP_FIELD_MAP } from '@/lib/validation/wizardSchemas'
import { clearPersistedWizard } from '@/lib/utils/wizardPersistence'
import { Button } from '@/components/ui/Button'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'
import type { UseFormHandleSubmit, UseFormTrigger } from 'react-hook-form'

interface WizardNavigationProps {
  trigger: UseFormTrigger<WizardFormValues>
  handleSubmit: UseFormHandleSubmit<WizardFormValues>
  onClearDraft: () => void
}

export function WizardNavigation({ trigger, handleSubmit, onClearDraft }: WizardNavigationProps) {
  const dispatch = useAppDispatch()
  const { currentStep, submitStatus } = useAppSelector((state) => state.wizard)
  const isFirst = currentStep === 0
  const isLast = currentStep === WIZARD_STEPS.length - 1
  const isSubmitting = submitStatus === 'submitting'

  async function handleNext() {
    const fields = STEP_FIELD_MAP[currentStep as keyof typeof STEP_FIELD_MAP]
    if (fields.length > 0) {
      const isValid = await trigger([...fields])
      if (!isValid) return
      dispatch(markStepCompleted(currentStep))
    }
    dispatch(goToNextStep())
  }

  function handleBack() {
    dispatch(goToPreviousStep())
  }

  const onSubmit = handleSubmit(async (data) => {
    const result = await dispatch(submitWizard(data))
    if (submitWizard.fulfilled.match(result)) {
      clearPersistedWizard()
    }
  })

  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-amber-100/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onClearDraft}
        className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-rose-600"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Clear saved draft
      </button>

      <div className="flex gap-3">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}

        {isLast ? (
          <Button type="button" loading={isSubmitting} onClick={onSubmit}>
            <Send className="h-4 w-4" />
            Submit
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
