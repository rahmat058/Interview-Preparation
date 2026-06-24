import { useEffect } from 'react'
import type { UseFormWatch } from 'react-hook-form'
import { useAppSelector } from '@/lib/store/hooks'
import type { PersistedWizardState } from '@/lib/types/wizard'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'
import { savePersistedWizard } from '@/lib/utils/wizardPersistence'

export function useFormPersistence(watch: UseFormWatch<WizardFormValues>) {
  const { currentStep, completedSteps } = useAppSelector((state) => state.wizard)
  const formValues = watch()

  useEffect(() => {
    const payload: PersistedWizardState = {
      formValues,
      currentStep,
      completedSteps,
      savedAt: new Date().toISOString(),
    }
    savePersistedWizard(payload)
  }, [formValues, currentStep, completedSteps])
}
