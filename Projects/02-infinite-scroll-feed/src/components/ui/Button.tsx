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
    'bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400 text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:via-rose-600 hover:to-amber-500',
  secondary:
    'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25 hover:from-amber-500 hover:to-orange-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/60 hover:text-rose-600',
  outline: 'border border-orange-200 bg-white/70 text-rose-700 hover:border-orange-300 hover:bg-white',
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
