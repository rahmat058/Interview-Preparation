import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useAppSelector } from '@/lib/store/hooks'
import { selectPendingToasts, selectVisibleToasts } from '@/lib/store/selectors/toastSelectors'
import { ToastItem } from '@/components/toast/ToastItem'

export function ToastViewport() {
  const visible = useAppSelector(selectVisibleToasts)
  const pending = useAppSelector(selectPendingToasts)

  return createPortal(
    <div
      className="pointer-events-none fixed right-4 top-20 z-[2000] flex w-full max-w-sm flex-col gap-3 sm:right-6"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {visible.map((toast, index) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} index={index} />
          </div>
        ))}
      </AnimatePresence>

      {pending.length > 0 && (
        <p className="pointer-events-none rounded-lg bg-slate-900/75 px-3 py-1.5 text-center text-[10px] font-medium text-white backdrop-blur-sm">
          +{pending.length} queued
        </p>
      )}
    </div>,
    document.body,
  )
}
