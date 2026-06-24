import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-600 hover:via-teal-700 hover:to-cyan-600',
  secondary:
    'bg-gradient-to-r from-cyan-400 to-teal-400 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-500 hover:to-teal-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/60 hover:text-teal-600',
  outline:
    'border border-teal-200 bg-white/70 text-teal-700 hover:border-teal-300 hover:bg-white',
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
