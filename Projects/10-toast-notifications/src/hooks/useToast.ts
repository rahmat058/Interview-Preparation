import { useCallback } from 'react'
import { useAppDispatch } from '@/lib/store/hooks'
import { enqueueToast } from '@/lib/store/slices/toastSlice'
import type { EnqueueToastOptions, ToastType } from '@/lib/types/toast'

type ToastInput = string | EnqueueToastOptions

function normalizeOptions(input: ToastInput, type: ToastType): EnqueueToastOptions & { id: string } {
  if (typeof input === 'string') {
    return { id: crypto.randomUUID(), type, title: input }
  }
  return { id: crypto.randomUUID(), type, ...input }
}

export function useToast() {
  const dispatch = useAppDispatch()

  const push = useCallback(
    (options: EnqueueToastOptions & { id: string }) => {
      dispatch(enqueueToast(options))
      return options.id
    },
    [dispatch],
  )

  const success = useCallback(
    (input: ToastInput) => push(normalizeOptions(input, 'success')),
    [push],
  )

  const error = useCallback(
    (input: ToastInput) => push(normalizeOptions(input, 'error')),
    [push],
  )

  const warning = useCallback(
    (input: ToastInput) => push(normalizeOptions(input, 'warning')),
    [push],
  )

  const info = useCallback(
    (input: ToastInput) => push(normalizeOptions(input, 'info')),
    [push],
  )

  const custom = useCallback(
    (options: EnqueueToastOptions) => push({ id: crypto.randomUUID(), ...options }),
    [push],
  )

  return { success, error, warning, info, custom }
}
