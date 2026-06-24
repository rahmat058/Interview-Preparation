import { useFormContext } from 'react-hook-form'
import { PLAN_OPTIONS } from '@/lib/types/wizard'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'

function ReviewRow({ label, value }: { label: string; value: string | number | boolean }) {
  const display =
    typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value === '' ? '—' : String(value)

  return (
    <div className="flex justify-between gap-4 border-b border-amber-50 py-2.5 last:border-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-800">{display}</dd>
    </div>
  )
}

export function StepReview() {
  const { getValues } = useFormContext<WizardFormValues>()
  const values = getValues()
  const planLabel = PLAN_OPTIONS.find((p) => p.value === values.plan)?.label ?? values.plan

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Review & Submit</h3>
        <p className="mt-1 text-sm text-slate-500">Confirm your details before submitting.</p>
      </div>

      <section className="rounded-xl border border-amber-100 bg-white/60 p-4">
        <h4 className="mb-2 text-xs font-semibold tracking-wide text-amber-700 uppercase">Personal</h4>
        <dl>
          <ReviewRow label="Name" value={`${values.firstName} ${values.lastName}`} />
          <ReviewRow label="Email" value={values.email} />
          <ReviewRow label="Phone" value={values.phone} />
        </dl>
      </section>

      <section className="rounded-xl border border-amber-100 bg-white/60 p-4">
        <h4 className="mb-2 text-xs font-semibold tracking-wide text-amber-700 uppercase">Professional</h4>
        <dl>
          <ReviewRow label="Company" value={values.company} />
          <ReviewRow label="Job title" value={values.jobTitle} />
          <ReviewRow label="Experience" value={`${values.experienceYears} years`} />
          <ReviewRow label="LinkedIn" value={values.linkedIn || '—'} />
        </dl>
      </section>

      <section className="rounded-xl border border-amber-100 bg-white/60 p-4">
        <h4 className="mb-2 text-xs font-semibold tracking-wide text-amber-700 uppercase">Preferences</h4>
        <dl>
          <ReviewRow label="Plan" value={planLabel} />
          <ReviewRow label="Timezone" value={values.timezone.replace(/_/g, ' ')} />
          <ReviewRow label="Newsletter" value={values.newsletter} />
          <ReviewRow label="SMS alerts" value={values.smsAlerts} />
        </dl>
      </section>
    </div>
  )
}
