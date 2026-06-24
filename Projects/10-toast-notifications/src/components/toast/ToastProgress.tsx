import { cn } from '@/lib/utils/cn'

interface ToastProgressProps {
  duration: number
  isPaused: boolean
  barClassName: string
}

export function ToastProgress({ duration, isPaused, barClassName }: ToastProgressProps) {
  if (duration <= 0) return null

  return (
    <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-xl bg-black/5">
      <div
        className={cn('h-full origin-left opacity-80', barClassName)}
        style={{
          animation: `toast-shrink ${duration}ms linear forwards`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      />
    </div>
  )
}
