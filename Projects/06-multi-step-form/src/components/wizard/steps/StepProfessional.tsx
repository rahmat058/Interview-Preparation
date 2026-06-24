import { useFormContext } from 'react-hook-form'
import { FormField, inputClassName, inputErrorClassName } from '@/components/form/FormField'
import { cn } from '@/lib/utils/cn'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'

export function StepProfessional() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Professional Background</h3>
        <p className="mt-1 text-sm text-slate-500">Share your work experience.</p>
      </div>

      <FormField label="Company" htmlFor="company" error={errors.company}>
        <input
          id="company"
          {...register('company')}
          className={cn(inputClassName, errors.company && inputErrorClassName)}
          placeholder="Acme Inc."
          autoComplete="organization"
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Job title" htmlFor="jobTitle" error={errors.jobTitle}>
          <input
            id="jobTitle"
            {...register('jobTitle')}
            className={cn(inputClassName, errors.jobTitle && inputErrorClassName)}
            placeholder="Senior Engineer"
            autoComplete="organization-title"
          />
        </FormField>

        <FormField label="Years of experience" htmlFor="experienceYears" error={errors.experienceYears}>
          <input
            id="experienceYears"
            type="number"
            min={0}
            max={50}
            {...register('experienceYears', { valueAsNumber: true })}
            className={cn(inputClassName, errors.experienceYears && inputErrorClassName)}
          />
        </FormField>
      </div>

      <FormField label="LinkedIn (optional)" htmlFor="linkedIn" error={errors.linkedIn}>
        <input
          id="linkedIn"
          type="url"
          {...register('linkedIn')}
          className={cn(inputClassName, errors.linkedIn && inputErrorClassName)}
          placeholder="https://linkedin.com/in/janedoe"
        />
      </FormField>
    </div>
  )
}
