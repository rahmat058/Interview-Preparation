export type ModalType = 'info' | 'confirm' | 'form' | 'delete' | 'nested-demo'

export type ModalCloseReason = 'button' | 'escape' | 'backdrop' | 'programmatic'

export type ModalEventType = 'open' | 'close' | 'escape' | 'backdrop' | 'nested-open'

export interface ModalPayload {
  message?: string
  itemName?: string
  depth?: number
  maxDepth?: number
}

export interface ModalStackEntry {
  id: string
  type: ModalType
  title: string
  payload?: ModalPayload
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
}

export interface ModalEvent {
  id: string
  event: ModalEventType
  modalId: string
  modalType: ModalType
  depth: number
  timestamp: number
  reason?: ModalCloseReason
}

export interface OpenModalOptions {
  type: ModalType
  title: string
  payload?: ModalPayload
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
}

export const MODAL_DEFAULTS: Pick<ModalStackEntry, 'closeOnEscape' | 'closeOnBackdrop'> = {
  closeOnEscape: true,
  closeOnBackdrop: true,
}
