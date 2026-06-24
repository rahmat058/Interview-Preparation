import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppDispatch } from '@/lib/store/hooks'
import { closeModal } from '@/lib/store/slices/modalSlice'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { getInitialFocusElement } from '@/lib/utils/focusable'
import { restoreModalFocus } from '@/lib/utils/modalFocusRegistry'
import { cn } from '@/lib/utils/cn'
import type { ModalStackEntry } from '@/lib/types/modal'
import { ModalContent } from '@/components/modal/ModalContent'

interface ModalLayerProps {
  entry: ModalStackEntry
  depth: number
  isTop: boolean
  stackSize: number
}

const BASE_Z_INDEX = 1000

export function ModalLayer({ entry, depth, isTop, stackSize }: ModalLayerProps) {
  const dispatch = useAppDispatch()
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const zIndex = BASE_Z_INDEX + depth * 10

  useFocusTrap(dialogRef, isTop)

  useEffect(() => {
    if (!isTop || !dialogRef.current) return

    const focusTarget = getInitialFocusElement(dialogRef.current)
    focusTarget?.focus()
  }, [isTop])

  function handleClose(reason: 'button' | 'backdrop') {
    dispatch(closeModal({ id: entry.id, reason }))
    requestAnimationFrame(() => restoreModalFocus(entry.id))
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    if (!isTop || !entry.closeOnBackdrop) return
    handleClose('backdrop')
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={entry.id}
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
        style={{ zIndex }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onMouseDown={handleBackdropClick}
        aria-hidden={!isTop}
      >
        <motion.div
          role="presentation"
          className={cn(
            'absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]',
            isTop ? 'opacity-100' : 'opacity-60',
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isTop ? 1 : 0.6 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          aria-hidden={!isTop}
          inert={!isTop ? true : undefined}
          className={cn(
            'relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-2xl shadow-violet-500/15 backdrop-blur-xl',
            !isTop && 'pointer-events-none',
          )}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <ModalContent
            entry={entry}
            titleId={titleId}
            descriptionId={descriptionId}
            depth={depth}
            stackSize={stackSize}
            isTop={isTop}
            onClose={() => handleClose('button')}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
