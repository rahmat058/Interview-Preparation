import { motion } from 'framer-motion'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { Button } from '@/components/ui/Button'

interface WizardSuccessProps {
  onStartOver: () => void
}

export function WizardSuccess({ onStartOver }: WizardSuccessProps) {
  const { submissionId } = useAppSelector((state) => state.wizard)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col items-center px-6 py-12 text-center"
    >
      <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-500" />
      <h3 className="text-xl font-bold text-slate-800">Application submitted!</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Your onboarding form has been received. We&apos;ll send a confirmation to your email shortly.
      </p>
      {submissionId && (
        <p className="mt-3 rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs text-emerald-800">
          {submissionId}
        </p>
      )}
      <Button type="button" variant="outline" className="mt-8" onClick={onStartOver}>
        <RotateCcw className="h-4 w-4" />
        Start new application
      </Button>
    </motion.div>
  )
}
