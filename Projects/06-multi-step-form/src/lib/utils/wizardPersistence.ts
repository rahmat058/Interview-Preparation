import type { PersistedWizardState } from '@/lib/types/wizard'
import { STORAGE_KEY } from '@/lib/types/wizard'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'
import { WIZARD_DEFAULT_VALUES } from '@/lib/validation/wizardSchemas'

export function loadPersistedWizard(): PersistedWizardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedWizardState
    if (!parsed.formValues || typeof parsed.currentStep !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function savePersistedWizard(state: PersistedWizardState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or private mode — fail silently
  }
}

export function clearPersistedWizard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function mergeWithDefaults(values: Partial<WizardFormValues>): WizardFormValues {
  return { ...WIZARD_DEFAULT_VALUES, ...values }
}
