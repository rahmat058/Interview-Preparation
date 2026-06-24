import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/store/hooks'
import { loadTableData } from '@/lib/store/slices/tableSlice'

export function useTableQueryLoader(deps: unknown[]) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const promise = dispatch(loadTableData())
    return () => {
      promise.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
