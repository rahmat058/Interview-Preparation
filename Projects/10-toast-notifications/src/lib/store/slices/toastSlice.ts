import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  EnqueueToastOptions,
  Toast,
  ToastDismissReason,
  ToastEvent,
  ToastEventType,
  ToastType,
} from '@/lib/types/toast'
import {
  MAX_EVENT_LOG,
  MAX_VISIBLE_TOASTS,
  TOAST_TYPE_META,
} from '@/lib/types/toast'

interface ToastState {
  visible: Toast[]
  pending: Toast[]
  events: ToastEvent[]
}

const initialState: ToastState = {
  visible: [],
  pending: [],
  events: [],
}

function createEvent(
  event: ToastEventType,
  toast: Toast,
  extras?: { reason?: ToastDismissReason; queueDepth?: number },
): ToastEvent {
  return {
    id: crypto.randomUUID(),
    event,
    toastId: toast.id,
    toastType: toast.type,
    timestamp: Date.now(),
    reason: extras?.reason,
    queueDepth: extras?.queueDepth,
  }
}

function appendEvent(state: ToastState, next: ToastEvent) {
  state.events = [next, ...state.events].slice(0, MAX_EVENT_LOG)
}

function promoteNext(state: ToastState) {
  if (state.visible.length >= MAX_VISIBLE_TOASTS) return
  const next = state.pending.shift()
  if (!next) return
  state.visible.push(next)
  appendEvent(state, createEvent('promote', next, { queueDepth: state.pending.length }))
}

function buildToast(options: EnqueueToastOptions & { id: string }): Toast {
  const type = options.type ?? 'info'
  const defaultDuration = TOAST_TYPE_META[type].defaultDuration
  return {
    id: options.id,
    type,
    title: options.title,
    message: options.message,
    duration: options.duration ?? defaultDuration,
    createdAt: Date.now(),
  }
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    enqueueToast: (state, action: PayloadAction<EnqueueToastOptions & { id: string }>) => {
      const toast = buildToast(action.payload)

      appendEvent(
        state,
        createEvent('enqueue', toast, {
          queueDepth: state.pending.length + (state.visible.length >= MAX_VISIBLE_TOASTS ? 1 : 0),
        }),
      )

      if (state.visible.length < MAX_VISIBLE_TOASTS) {
        state.visible.push(toast)
      } else {
        state.pending.push(toast)
      }
    },
    dismissToast: (
      state,
      action: PayloadAction<{ id: string; reason: ToastDismissReason }>,
    ) => {
      const { id, reason } = action.payload
      const visibleIndex = state.visible.findIndex((toast) => toast.id === id)
      if (visibleIndex === -1) return

      const toast = state.visible[visibleIndex]
      const eventType: ToastEventType = reason === 'auto' ? 'auto-dismiss' : 'dismiss'
      appendEvent(state, createEvent(eventType, toast, { reason }))

      state.visible.splice(visibleIndex, 1)
      promoteNext(state)
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.pending = state.pending.filter((toast) => toast.id !== action.payload)
    },
    dismissAll: (state) => {
      for (const toast of state.visible) {
        appendEvent(state, createEvent('dismiss', toast, { reason: 'clear-all' }))
      }
      state.visible = []
      state.pending = []
      appendEvent(state, {
        id: crypto.randomUUID(),
        event: 'clear-all',
        toastId: 'system',
        toastType: 'info' as ToastType,
        timestamp: Date.now(),
      })
    },
    logTimerEvent: (
      state,
      action: PayloadAction<{ toastId: string; toastType: ToastType; event: 'pause' | 'resume' }>,
    ) => {
      appendEvent(state, {
        id: crypto.randomUUID(),
        event: action.payload.event,
        toastId: action.payload.toastId,
        toastType: action.payload.toastType,
        timestamp: Date.now(),
      })
    },
    clearEventLog: (state) => {
      state.events = []
    },
  },
})

export const {
  enqueueToast,
  dismissToast,
  removeFromQueue,
  dismissAll,
  logTimerEvent,
  clearEventLog,
} = toastSlice.actions

export default toastSlice.reducer
