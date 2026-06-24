import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/lib/store/hooks'
import { dismissToast, logTimerEvent } from '@/lib/store/slices/toastSlice'
import type { Toast } from '@/lib/types/toast'

interface UseAutoDismissOptions {
  toast: Toast
}

export function useAutoDismiss({ toast }: UseAutoDismissOptions) {
  const dispatch = useAppDispatch()
  const timeoutRef = useRef<number | null>(null)
  const remainingRef = useRef(toast.duration)
  const startedAtRef = useRef<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  function clearTimer() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  function scheduleDismiss(durationMs: number) {
    if (toast.duration <= 0) return
    clearTimer()
    remainingRef.current = durationMs
    startedAtRef.current = Date.now()
    timeoutRef.current = window.setTimeout(() => {
      dispatch(dismissToast({ id: toast.id, reason: 'auto' }))
    }, durationMs)
  }

  useEffect(() => {
    if (toast.duration <= 0) return

    clearTimer()
    remainingRef.current = toast.duration
    startedAtRef.current = Date.now()
    timeoutRef.current = window.setTimeout(() => {
      dispatch(dismissToast({ id: toast.id, reason: 'auto' }))
    }, toast.duration)

    return clearTimer
  }, [toast.id, toast.duration, dispatch])

  function handleMouseEnter() {
    if (toast.duration <= 0 || startedAtRef.current === null) return
    const elapsed = Date.now() - startedAtRef.current
    remainingRef.current = Math.max(0, remainingRef.current - elapsed)
    clearTimer()
    setIsPaused(true)
    dispatch(logTimerEvent({ toastId: toast.id, toastType: toast.type, event: 'pause' }))
  }

  function handleMouseLeave() {
    if (toast.duration <= 0 || remainingRef.current <= 0) return
    setIsPaused(false)
    dispatch(logTimerEvent({ toastId: toast.id, toastType: toast.type, event: 'resume' }))
    scheduleDismiss(remainingRef.current)
  }

  return { handleMouseEnter, handleMouseLeave, isPaused }
}
