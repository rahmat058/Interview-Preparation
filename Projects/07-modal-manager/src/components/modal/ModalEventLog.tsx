import { motion } from 'framer-motion'
import { Activity, Eraser } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { clearEventLog } from '@/lib/store/slices/modalSlice'
import { cn } from '@/lib/utils/cn'

const EVENT_LABELS: Record<string, string> = {
  open: 'Opened',
  close: 'Closed',
  escape: 'Escape',
  backdrop: 'Backdrop',
  'nested-open': 'Nested open',
}

const EVENT_COLORS: Record<string, string> = {
  open: 'bg-violet-100 text-violet-700',
  close: 'bg-slate-100 text-slate-600',
  escape: 'bg-fuchsia-100 text-fuchsia-700',
  backdrop: 'bg-pink-100 text-pink-700',
  'nested-open': 'bg-indigo-100 text-indigo-700',
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function ModalEventLog() {
  const dispatch = useAppDispatch()
  const { events, stack } = useAppSelector((state) => state.modal)

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="glass-card mt-6 p-4 sm:p-5"
      aria-label="Modal event log"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-slate-800">Event log</h3>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
            stack: {stack.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(clearEventLog())}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
        >
          <Eraser className="h-3 w-3" />
          Clear
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-slate-400">Open a modal to see events (open, escape, backdrop, nested).</p>
      ) : (
        <ul className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/60 px-2.5 py-1.5 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                    EVENT_COLORS[event.event],
                  )}
                >
                  {EVENT_LABELS[event.event]}
                </span>
                <span className="truncate text-slate-600">
                  {event.modalType} · depth {event.depth}
                </span>
              </div>
              <time className="shrink-0 tabular-nums text-slate-400">{formatTime(event.timestamp)}</time>
            </li>
          ))}
        </ul>
      )}
    </motion.aside>
  )
}
