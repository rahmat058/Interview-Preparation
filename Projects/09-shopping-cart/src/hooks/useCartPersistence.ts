import { useEffect } from 'react'
import { useAppSelector } from '@/lib/store/hooks'
import { savePersistedCart } from '@/lib/utils/cartPersistence'

export function useCartPersistence() {
  const itemsById = useAppSelector((state) => state.cart.itemsById)
  const promoCode = useAppSelector((state) => state.cart.promoCode)
  const catalogStatus = useAppSelector((state) => state.cart.catalogStatus)

  useEffect(() => {
    if (catalogStatus !== 'succeeded') return
    savePersistedCart(itemsById, promoCode)
  }, [itemsById, promoCode, catalogStatus])
}
