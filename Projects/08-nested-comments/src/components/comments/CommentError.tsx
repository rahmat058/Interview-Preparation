import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CommentErrorProps {
  message: string
  onRetry?: () => void
}

export function CommentError({ message, onRetry }: CommentErrorProps) {
  return (
    <div className="glass-card flex flex-col items-center gap-3 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
        <AlertCircle className="h-6 w-6 text-rose-500" />
      </div>
      <p className="text-sm text-slate-600">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
