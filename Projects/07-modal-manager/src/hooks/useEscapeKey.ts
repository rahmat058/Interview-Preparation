import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { closeModal } from '@/lib/store/slices/modalSlice'
import { restoreModalFocus } from '@/lib/utils/modalFocusRegistry'

export function useGlobalEscapeKey() {
  const dispatch = useAppDispatch()
  const stack = useAppSelector((state) => state.modal.stack)

  useEffect(() => {
    if (stack.length === 0) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return

      const top = stack[stack.length - 1]
      if (!top?.closeOnEscape) return

      event.preventDefault()
      event.stopPropagation()
      dispatch(closeModal({ id: top.id, reason: 'escape' }))
      requestAnimationFrame(() => restoreModalFocus(top.id))
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [dispatch, stack])
}
