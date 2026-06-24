import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 hover:shadow-indigo-500/40',
  secondary:
    'bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-cyan-600',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/60 hover:text-indigo-600',
  outline: 'border border-indigo-200 bg-white/70 text-indigo-700 hover:border-indigo-300 hover:bg-white',
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
