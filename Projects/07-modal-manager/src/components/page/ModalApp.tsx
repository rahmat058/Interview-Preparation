import { motion } from 'framer-motion'
import {
  FileText,
  HelpCircle,
  Layers,
  ShieldAlert,
  Trash2,
  UserRound,
} from 'lucide-react'
import { useModal } from '@/hooks/useModal'
import { useAppSelector } from '@/lib/store/hooks'
import { Button } from '@/components/ui/Button'
import { ModalEventLog } from '@/components/modal/ModalEventLog'

const DEMO_MODALS = [
  {
    type: 'info' as const,
    label: 'Info modal',
    icon: FileText,
    title: 'Release notes',
    payload: {
      message:
        'LayerForge v1.2 ships with stacked modal support, focus traps, and centralized Escape handling.',
    },
  },
  {
    type: 'confirm' as const,
    label: 'Confirm dialog',
    icon: HelpCircle,
    title: 'Publish changes?',
    payload: {
      message: 'Your draft will go live immediately. You can revert within 24 hours.',
    },
  },
  {
    type: 'form' as const,
    label: 'Form modal',
    icon: UserRound,
    title: 'Edit profile',
  },
  {
    type: 'delete' as const,
    label: 'Delete modal',
    icon: Trash2,
    title: 'Delete project',
    payload: { itemName: 'SkyRoute API' },
  },
  {
    type: 'nested-demo' as const,
    label: 'Nested stack',
    icon: Layers,
    title: 'Nested layer 1',
    payload: { depth: 1, maxDepth: 3 },
  },
]

const TIPS = [
  { icon: ShieldAlert, text: 'Focus trap on top dialog' },
  { icon: Layers, text: 'Esc peels one layer at a time' },
  { icon: HelpCircle, text: 'Trigger focus restored on close' },
]

export function ModalApp() {
  const { open, closeAll } = useModal()
  const stackSize = useAppSelector((state) => state.modal.stack.length)

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Modal Manager
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
          Stackable dialogs with Escape handling, nested layers, focus management, and a live event
          log.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="glass-card mt-8 p-5 sm:p-8"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-700">Open a demo dialog</p>
          {stackSize > 0 && (
            <Button variant="outline" size="sm" onClick={closeAll}>
              Close all ({stackSize})
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {DEMO_MODALS.map((demo) => {
            const Icon = demo.icon
            return (
              <button
                key={demo.type}
                type="button"
                onClick={(event) =>
                  open({
                    type: demo.type,
                    title: demo.title,
                    payload: demo.payload,
                    trigger: event.currentTarget,
                  })
                }
                className="group flex items-center gap-3 rounded-xl border border-violet-100/80 bg-white/70 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/25 transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{demo.label}</p>
                  <p className="text-xs text-slate-400">{demo.title}</p>
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      <ModalEventLog />

      <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5 text-violet-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  )
}
