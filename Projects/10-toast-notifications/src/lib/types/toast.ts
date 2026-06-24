export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastDismissReason = 'manual' | 'auto' | 'clear-all'

export type ToastEventType =
  | 'enqueue'
  | 'promote'
  | 'dismiss'
  | 'auto-dismiss'
  | 'pause'
  | 'resume'
  | 'clear-all'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration: number
  createdAt: number
}

export interface ToastEvent {
  id: string
  event: ToastEventType
  toastId: string
  toastType: ToastType
  timestamp: number
  reason?: ToastDismissReason
  queueDepth?: number
}

export interface EnqueueToastOptions {
  type?: ToastType
  title: string
  message?: string
  duration?: number
}

export const MAX_VISIBLE_TOASTS = 3
export const DEFAULT_TOAST_DURATION = 5000
export const MAX_EVENT_LOG = 30

export const TOAST_TYPE_META: Record<
  ToastType,
  { label: string; defaultDuration: number }
> = {
  success: { label: 'Success', defaultDuration: 4000 },
  error: { label: 'Error', defaultDuration: 7000 },
  warning: { label: 'Warning', defaultDuration: 6000 },
  info: { label: 'Info', defaultDuration: 5000 },
}
