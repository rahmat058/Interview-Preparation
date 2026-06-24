import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useAppDispatch } from '@/lib/store/hooks'
import { dismissToast } from '@/lib/store/slices/toastSlice'
import { useAutoDismiss } from '@/hooks/useAutoDismiss'
import { cn } from '@/lib/utils/cn'
import type { Toast, ToastType } from '@/lib/types/toast'
import { ToastProgress } from '@/components/toast/ToastProgress'

interface ToastItemProps {
  toast: Toast
  index: number
}

const TYPE_STYLES: Record<
  ToastType,
  { icon: typeof Info; bar: string; ring: string; text: string }
> = {
  success: {
    icon: CheckCircle2,
    bar: 'bg-emerald-500',
    ring: 'border-emerald-200/80',
    text: 'text-emerald-800',
  },
  error: {
    icon: XCircle,
    bar: 'bg-rose-500',
    ring: 'border-rose-200/80',
    text: 'text-rose-800',
  },
  warning: {
    icon: AlertTriangle,
    bar: 'bg-amber-500',
    ring: 'border-amber-200/80',
    text: 'text-amber-900',
  },
  info: {
    icon: Info,
    bar: 'bg-indigo-500',
    ring: 'border-indigo-200/80',
    text: 'text-indigo-800',
  },
}

export function ToastItem({ toast, index }: ToastItemProps) {
  const dispatch = useAppDispatch()
  const styles = TYPE_STYLES[toast.type]
  const Icon = styles.icon
  const { handleMouseEnter, handleMouseLeave, isPaused } = useAutoDismiss({ toast })

  return (
    <motion.li
      layout
      role="status"
      aria-live="polite"
      aria-atomic="true"
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1], delay: index * 0.04 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative w-full overflow-hidden rounded-xl border bg-white/95 shadow-lg shadow-indigo-500/10 backdrop-blur-xl',
        styles.ring,
      )}
    >
      <div className="flex gap-3 p-4 pr-10">
        <div className={cn('mt-0.5 shrink-0', styles.text)}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-semibold', styles.text)}>{toast.title}</p>
          {toast.message && <p className="mt-0.5 text-xs text-slate-500">{toast.message}</p>}
          {toast.duration <= 0 && (
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Persistent · dismiss manually
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => dispatch(dismissToast({ id: toast.id, reason: 'manual' }))}
        className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>

      <ToastProgress duration={toast.duration} isPaused={isPaused} barClassName={styles.bar} />
    </motion.li>
  )
}
