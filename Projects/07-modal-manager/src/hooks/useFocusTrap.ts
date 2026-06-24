import { useEffect, type RefObject } from 'react'
import { getFocusableElements } from '@/lib/utils/focusable'

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !containerRef.current) return

      const focusables = getFocusableElements(containerRef.current)
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement

      if (event.shiftKey) {
        if (active === first || !containerRef.current.contains(active)) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, enabled])
}
