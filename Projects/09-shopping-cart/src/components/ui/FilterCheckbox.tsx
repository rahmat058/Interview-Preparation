import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface FilterCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  icon?: LucideIcon
  description?: string
}

export function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
  icon: Icon,
  description,
}: FilterCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'group flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200',
        checked
          ? 'border-teal-300 bg-teal-50/90 shadow-sm shadow-teal-500/10'
          : 'border-slate-200/90 bg-white/80 hover:border-teal-200 hover:bg-teal-50/40',
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />

      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
          checked
            ? 'border-teal-500 bg-linear-to-br from-teal-500 to-cyan-500 text-white shadow-sm shadow-teal-500/30'
            : 'border-slate-300 bg-white group-hover:border-teal-400',
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          {Icon && (
            <Icon
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                checked ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-500',
              )}
            />
          )}
          <span
            className={cn(
              'text-sm font-medium',
              checked ? 'text-teal-800' : 'text-slate-700',
            )}
          >
            {label}
          </span>
        </span>
        {description && (
          <span className="mt-0.5 block text-[11px] text-slate-400">{description}</span>
        )}
      </span>
    </label>
  )
}
