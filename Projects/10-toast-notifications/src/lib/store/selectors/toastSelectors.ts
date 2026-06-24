import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

export const selectVisibleToasts = (state: RootState) => state.toast.visible
export const selectPendingToasts = (state: RootState) => state.toast.pending
export const selectToastEvents = (state: RootState) => state.toast.events

export const selectToastCounts = createSelector(
  [selectVisibleToasts, selectPendingToasts],
  (visible, pending) => ({
    visible: visible.length,
    pending: pending.length,
    total: visible.length + pending.length,
  }),
)
