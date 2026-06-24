import type { FieldError } from 'react-hook-form'
import { cn } from '@/lib/utils/cn'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: FieldError
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, htmlFor, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-600" role="alert">
          {error.message}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

export const inputClassName =
  'w-full rounded-xl border border-amber-200/80 bg-white/80 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 focus:outline-none disabled:opacity-50'

export const inputErrorClassName = 'border-rose-300 focus:border-rose-400 focus:ring-rose-200/60'
