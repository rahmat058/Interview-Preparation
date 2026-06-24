import type { WizardFormValues } from '@/lib/validation/wizardSchemas'

export const STORAGE_KEY = 'formflow-wizard-draft'

export interface PersistedWizardState {
  formValues: WizardFormValues
  currentStep: number
  completedSteps: number[]
  savedAt: string
}

export type WizardSubmitStatus = 'idle' | 'submitting' | 'succeeded' | 'failed'

export interface WizardState {
  currentStep: number
  completedSteps: number[]
  submitStatus: WizardSubmitStatus
  submitError: string | null
  submissionId: string | null
  restoredFromStorage: boolean
}

export interface WizardStepConfig {
  id: number
  title: string
  description: string
}

export const WIZARD_STEPS: WizardStepConfig[] = [
  { id: 0, title: 'Personal', description: 'Your contact details' },
  { id: 1, title: 'Professional', description: 'Work background' },
  { id: 2, title: 'Preferences', description: 'Plan & notifications' },
  { id: 3, title: 'Review', description: 'Confirm & submit' },
]

export const TIMEZONE_OPTIONS = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
]

export const PLAN_OPTIONS = [
  { value: 'starter', label: 'Starter', price: '$9/mo' },
  { value: 'professional', label: 'Professional', price: '$29/mo' },
  { value: 'enterprise', label: 'Enterprise', price: '$99/mo' },
] as const

export interface SubmitWizardResponse {
  id: string
  message: string
  submittedAt: string
}
