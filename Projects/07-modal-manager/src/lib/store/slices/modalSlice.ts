import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  ModalCloseReason,
  ModalEvent,
  ModalEventType,
  ModalStackEntry,
  OpenModalOptions,
} from '@/lib/types/modal'
import { MODAL_DEFAULTS } from '@/lib/types/modal'

const MAX_EVENT_LOG = 24

interface ModalState {
  stack: ModalStackEntry[]
  events: ModalEvent[]
}

const initialState: ModalState = {
  stack: [],
  events: [],
}

function createEvent(
  event: ModalEventType,
  entry: ModalStackEntry,
  depth: number,
  reason?: ModalCloseReason,
): ModalEvent {
  return {
    id: crypto.randomUUID(),
    event,
    modalId: entry.id,
    modalType: entry.type,
    depth,
    timestamp: Date.now(),
    reason,
  }
}

function appendEvent(state: ModalState, next: ModalEvent) {
  state.events = [next, ...state.events].slice(0, MAX_EVENT_LOG)
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<OpenModalOptions & { id: string }>) => {
      const { id, type, title, payload, closeOnEscape, closeOnBackdrop } = action.payload
      const entry: ModalStackEntry = {
        id,
        type,
        title,
        payload,
        closeOnEscape: closeOnEscape ?? MODAL_DEFAULTS.closeOnEscape,
        closeOnBackdrop: closeOnBackdrop ?? MODAL_DEFAULTS.closeOnBackdrop,
      }

      const depth = state.stack.length
      const eventType: ModalEventType = depth > 0 ? 'nested-open' : 'open'
      appendEvent(state, createEvent(eventType, entry, depth + 1))
      state.stack.push(entry)
    },
    closeModal: (
      state,
      action: PayloadAction<{ id?: string; reason: ModalCloseReason }>,
    ) => {
      const { id, reason } = action.payload
      if (state.stack.length === 0) return

      const topIndex = state.stack.length - 1
      const index =
        id === undefined ? topIndex : state.stack.findIndex((entry) => entry.id === id)

      if (index === -1 || index !== topIndex) return

      const entry = state.stack[topIndex]
      const depth = topIndex + 1
      const eventType: ModalEventType =
        reason === 'escape' ? 'escape' : reason === 'backdrop' ? 'backdrop' : 'close'

      appendEvent(state, createEvent(eventType, entry, depth, reason))
      state.stack.pop()
    },
    closeAllModals: (state) => {
      while (state.stack.length > 0) {
        const entry = state.stack.pop()!
        appendEvent(
          state,
          createEvent('close', entry, state.stack.length + 1, 'programmatic'),
        )
      }
    },
    clearEventLog: (state) => {
      state.events = []
    },
  },
})

export const { openModal, closeModal, closeAllModals, clearEventLog } = modalSlice.actions
export default modalSlice.reducer
