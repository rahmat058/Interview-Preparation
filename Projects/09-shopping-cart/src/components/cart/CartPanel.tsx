import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { clearCart } from '@/lib/store/slices/cartSlice'
import { selectCartLines } from '@/lib/store/selectors/cartSelectors'
import { Button } from '@/components/ui/Button'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { CartEmpty } from '@/components/cart/CartEmpty'
import { CartSummary } from '@/components/cart/CartSummary'
import { PromoCodeInput } from '@/components/cart/PromoCodeInput'
import { ShippingProgress } from '@/components/cart/ShippingProgress'

export function CartPanel() {
  const dispatch = useAppDispatch()
  const lines = useAppSelector(selectCartLines)

  return (
    <aside className="glass-card flex flex-col p-5 sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]" aria-label="Shopping cart">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Your cart</h2>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="text-xs font-medium text-slate-400 hover:text-rose-500"
          >
            Clear all
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto pr-1">
            {lines.map((line) => (
              <CartLineItem
                key={line.productId}
                productId={line.productId}
                quantity={line.quantity}
                product={line.product}
              />
            ))}
          </ul>

          <div className="mt-4 space-y-3">
            <ShippingProgress />
            <PromoCodeInput />
            <CartSummary />
            <Button className="w-full" size="lg">
              Checkout
            </Button>
          </div>
        </>
      )}
    </aside>
  )
}
