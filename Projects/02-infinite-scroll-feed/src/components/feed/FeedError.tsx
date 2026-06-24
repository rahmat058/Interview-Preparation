import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FeedErrorProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

export function FeedError({ message, onRetry, isRetrying = false }: FeedErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col items-center gap-4 p-8 text-center"
      role="alert">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
        <AlertCircle className="h-7 w-7 text-rose-500" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800">Something went wrong</h3>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} loading={isRetrying}>
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </motion.div>
  )
}
