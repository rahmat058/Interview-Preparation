import { configureStore } from '@reduxjs/toolkit'
import explorerReducer from '@/lib/store/slices/explorerSlice'

export const store = configureStore({
  reducer: {
    explorer: explorerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
