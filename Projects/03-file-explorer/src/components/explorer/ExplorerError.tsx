import { AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/lib/store/hooks'
import { loadFileTree } from '@/lib/store/slices/explorerSlice'
import { Button } from '@/components/ui/Button'

interface ExplorerErrorProps {
  message: string
}

export function ExplorerError({ message }: ExplorerErrorProps) {
  const dispatch = useAppDispatch()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card mx-auto flex max-w-md flex-col items-center px-6 py-10 text-center"
    >
      <AlertCircle className="mb-3 h-10 w-10 text-rose-500" />
      <h3 className="text-lg font-semibold text-slate-800">Failed to load file tree</h3>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <Button type="button" className="mt-6" onClick={() => dispatch(loadFileTree())}>
        Retry
      </Button>
    </motion.div>
  )
}
