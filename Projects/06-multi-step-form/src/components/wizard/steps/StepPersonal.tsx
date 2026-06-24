import { useFormContext } from 'react-hook-form'
import { FormField, inputClassName, inputErrorClassName } from '@/components/form/FormField'
import { cn } from '@/lib/utils/cn'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'

export function StepPersonal() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
        <p className="mt-1 text-sm text-slate-500">Tell us how to reach you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" htmlFor="firstName" error={errors.firstName}>
          <input
            id="firstName"
            {...register('firstName')}
            className={cn(inputClassName, errors.firstName && inputErrorClassName)}
            placeholder="Jane"
            autoComplete="given-name"
          />
        </FormField>

        <FormField label="Last name" htmlFor="lastName" error={errors.lastName}>
          <input
            id="lastName"
            {...register('lastName')}
            className={cn(inputClassName, errors.lastName && inputErrorClassName)}
            placeholder="Doe"
            autoComplete="family-name"
          />
        </FormField>
      </div>

      <FormField label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={cn(inputClassName, errors.email && inputErrorClassName)}
          placeholder="jane@company.com"
          autoComplete="email"
        />
      </FormField>

      <FormField label="Phone" htmlFor="phone" error={errors.phone} hint="Include country code if applicable">
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className={cn(inputClassName, errors.phone && inputErrorClassName)}
          placeholder="+1 (555) 123-4567"
          autoComplete="tel"
        />
      </FormField>
    </div>
  )
}
