import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '@/lib/store'
import type { RootState } from '@/lib/store/types'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
