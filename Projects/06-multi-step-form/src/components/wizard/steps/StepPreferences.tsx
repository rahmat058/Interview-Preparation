import { useFormContext } from 'react-hook-form'
import { FormField, inputClassName, inputErrorClassName } from '@/components/form/FormField'
import { PLAN_OPTIONS, TIMEZONE_OPTIONS } from '@/lib/types/wizard'
import { cn } from '@/lib/utils/cn'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'

export function StepPreferences() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  const selectedPlan = watch('plan')

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Preferences</h3>
        <p className="mt-1 text-sm text-slate-500">Choose your plan and notification settings.</p>
      </div>

      <FormField label="Plan" htmlFor="plan" error={errors.plan}>
        <div className="grid gap-3 sm:grid-cols-3">
          {PLAN_OPTIONS.map((plan) => (
            <label
              key={plan.value}
              className={cn(
                'cursor-pointer rounded-xl border p-3 transition-colors',
                selectedPlan === plan.value
                  ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-200/60'
                  : 'border-slate-200/80 bg-white/60 hover:border-amber-200',
              )}
            >
              <input type="radio" value={plan.value} {...register('plan')} className="sr-only" />
              <span className="block text-sm font-semibold text-slate-800">{plan.label}</span>
              <span className="mt-0.5 block text-xs text-orange-600">{plan.price}</span>
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Timezone" htmlFor="timezone" error={errors.timezone}>
        <select
          id="timezone"
          {...register('timezone')}
          className={cn(inputClassName, errors.timezone && inputErrorClassName)}
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </FormField>

      <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50/30 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            {...register('newsletter')}
            className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-400"
          />
          <span className="text-sm text-slate-700">Subscribe to product newsletter</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            {...register('smsAlerts')}
            className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-400"
          />
          <span className="text-sm text-slate-700">Enable SMS alerts for account activity</span>
        </label>
      </div>
    </div>
  )
}
