import { motion } from 'framer-motion'
import { Activity, Eraser } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { clearEventLog } from '@/lib/store/slices/toastSlice'
import { selectToastCounts } from '@/lib/store/selectors/toastSelectors'
import { cn } from '@/lib/utils/cn'

const EVENT_LABELS: Record<string, string> = {
  enqueue: 'Enqueued',
  promote: 'Promoted',
  dismiss: 'Dismissed',
  'auto-dismiss': 'Auto-dismiss',
  pause: 'Timer paused',
  resume: 'Timer resumed',
  'clear-all': 'Clear all',
}

const EVENT_COLORS: Record<string, string> = {
  enqueue: 'bg-indigo-100 text-indigo-700',
  promote: 'bg-violet-100 text-violet-700',
  dismiss: 'bg-slate-100 text-slate-600',
  'auto-dismiss': 'bg-emerald-100 text-emerald-700',
  pause: 'bg-amber-100 text-amber-800',
  resume: 'bg-cyan-100 text-cyan-700',
  'clear-all': 'bg-rose-100 text-rose-700',
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function ToastEventLog() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.toast.events)
  const counts = useAppSelector(selectToastCounts)

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="glass-card mt-6 p-4 sm:p-5"
      aria-label="Toast event log"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-800">Event log</h3>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
            {counts.visible} visible · {counts.pending} queued
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(clearEventLog())}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Eraser className="h-3 w-3" />
          Clear
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-slate-400">
          Trigger toasts to see enqueue, promote, auto-dismiss, pause, and resume events.
        </p>
      ) : (
        <ul className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
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
                  {event.toastType}
                  {event.queueDepth !== undefined ? ` · queue ${event.queueDepth}` : ''}
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
