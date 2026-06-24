import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600',
  secondary:
    'bg-gradient-to-r from-fuchsia-400 to-violet-400 text-white shadow-lg shadow-fuchsia-500/25 hover:from-fuchsia-500 hover:to-violet-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/60 hover:text-violet-600',
  outline:
    'border border-violet-200 bg-white/70 text-violet-700 hover:border-violet-300 hover:bg-white',
  danger:
    'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-red-600',
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
