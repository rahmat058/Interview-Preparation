import { motion } from 'framer-motion'
import { Bell, Clock, Layers3 } from 'lucide-react'
import { ToastDemoPanel } from '@/components/demo/ToastDemoPanel'
import { ToastEventLog } from '@/components/toast/ToastEventLog'

const TIPS = [
  { icon: Layers3, text: 'Visible + pending queue' },
  { icon: Clock, text: 'setTimeout auto-dismiss' },
  { icon: Bell, text: 'useToast() API' },
]

export function ToastApp() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Toast Notifications
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 sm:text-base">
          Queue management, auto-dismiss timers, pause-on-hover, and a live event log for component
          communication.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mt-8"
      >
        <ToastDemoPanel />
        <ToastEventLog />
      </motion.div>

      <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5 text-indigo-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  )
}
