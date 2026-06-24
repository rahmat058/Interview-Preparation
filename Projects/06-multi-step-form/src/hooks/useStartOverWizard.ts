import { useAppDispatch } from '@/lib/store/hooks'
import { resetWizard } from '@/lib/store/slices/wizardSlice'
import { clearPersistedWizard } from '@/lib/utils/wizardPersistence'

export function useStartOverWizard() {
  const dispatch = useAppDispatch()

  return () => {
    clearPersistedWizard()
    dispatch(resetWizard())
    window.location.reload()
  }
}
