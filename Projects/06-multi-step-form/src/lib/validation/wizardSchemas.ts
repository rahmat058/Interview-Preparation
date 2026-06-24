import { z } from 'zod'

export const personalStepSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s()-]{10,}$/, 'Enter a valid phone number (10+ digits)'),
})

export const professionalStepSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  experienceYears: z.coerce
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Cannot be negative')
    .max(50, 'Maximum 50 years'),
  linkedIn: z
    .string()
    .refine((val) => val === '' || z.string().url().safeParse(val).success, 'Enter a valid URL'),
})

export const preferencesStepSchema = z.object({
  plan: z.enum(['starter', 'professional', 'enterprise'], {
    required_error: 'Select a plan',
  }),
  timezone: z.string().min(1, 'Select a timezone'),
  newsletter: z.boolean(),
  smsAlerts: z.boolean(),
})

export const wizardFormSchema = personalStepSchema
  .merge(professionalStepSchema)
  .merge(preferencesStepSchema)

export type WizardFormValues = z.infer<typeof wizardFormSchema>
export type PersonalStepValues = z.infer<typeof personalStepSchema>
export type ProfessionalStepValues = z.infer<typeof professionalStepSchema>
export type PreferencesStepValues = z.infer<typeof preferencesStepSchema>

export const WIZARD_DEFAULT_VALUES: WizardFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  experienceYears: 0,
  linkedIn: '',
  plan: 'starter',
  timezone: 'America/New_York',
  newsletter: true,
  smsAlerts: false,
}

export const STEP_FIELD_MAP = {
  0: ['firstName', 'lastName', 'email', 'phone'] as const,
  1: ['company', 'jobTitle', 'experienceYears', 'linkedIn'] as const,
  2: ['plan', 'timezone', 'newsletter', 'smsAlerts'] as const,
  3: [] as const,
} satisfies Record<number, readonly (keyof WizardFormValues)[]>

export const STEP_SCHEMAS = [personalStepSchema, professionalStepSchema, preferencesStepSchema] as const
