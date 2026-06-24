import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'success' | 'danger' | 'warning'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600',
  secondary:
    'bg-gradient-to-r from-violet-400 to-indigo-400 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/60 hover:text-indigo-600',
  outline:
    'border border-indigo-200 bg-white/70 text-indigo-700 hover:border-indigo-300 hover:bg-white',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
