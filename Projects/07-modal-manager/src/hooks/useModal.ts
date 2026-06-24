import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { closeModal, closeAllModals, openModal } from '@/lib/store/slices/modalSlice'
import {
  getModalTrigger,
  registerModalTrigger,
  restoreModalFocus,
  unregisterModalTrigger,
} from '@/lib/utils/modalFocusRegistry'
import type { ModalCloseReason, OpenModalOptions } from '@/lib/types/modal'

interface OpenModalParams extends OpenModalOptions {
  trigger?: HTMLElement | null
}

export function useModal() {
  const dispatch = useAppDispatch()
  const stack = useAppSelector((state) => state.modal.stack)

  const open = useCallback(
    (options: OpenModalParams) => {
      const { trigger, ...modalOptions } = options
      const id = crypto.randomUUID()
      if (trigger) {
        registerModalTrigger(id, trigger)
      }

      dispatch(openModal({ id, ...modalOptions }))
      return id
    },
    [dispatch],
  )

  const close = useCallback(
    (id?: string, reason: ModalCloseReason = 'programmatic') => {
      const topId = stack[stack.length - 1]?.id
      const closingId = id ?? topId
      dispatch(closeModal({ id, reason }))
      if (closingId) {
        requestAnimationFrame(() => restoreModalFocus(closingId))
      }
    },
    [dispatch, stack],
  )

  const closeAll = useCallback(() => {
    const bottomId = stack[0]?.id
    const bottomTrigger = bottomId ? getModalTrigger(bottomId) : undefined

    dispatch(closeAllModals())
    stack.forEach((entry) => unregisterModalTrigger(entry.id))

    if (bottomTrigger && document.contains(bottomTrigger)) {
      requestAnimationFrame(() => bottomTrigger.focus())
    }
  }, [dispatch, stack])

  return { open, close, closeAll }
}
