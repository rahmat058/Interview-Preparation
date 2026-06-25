import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '@/lib/store/slices/cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})

export type { RootState } from '@/lib/store/types'
export type AppDispatch = typeof store.dispatch
