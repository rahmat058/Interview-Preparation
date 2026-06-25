import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { clearCart } from '@/lib/store/slices/cartSlice'
import { selectCartLines, selectCartPricing } from '@/lib/store/selectors/cartSelectors'
import { formatCurrency } from '@/lib/utils/cartPricing'
import { Button } from '@/components/ui/Button'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { CartEmpty } from '@/components/cart/CartEmpty'
import { CartSummary } from '@/components/cart/CartSummary'
import { PromoCodeInput } from '@/components/cart/PromoCodeInput'
import { ShippingProgress } from '@/components/cart/ShippingProgress'

interface CartContentProps {
  variant?: 'panel' | 'drawer'
  onClose?: () => void
}

export function CartContent({ variant = 'panel' }: CartContentProps) {
  const dispatch = useAppDispatch()
  const lines = useAppSelector(selectCartLines)
  const pricing = useAppSelector(selectCartPricing)
  const isDrawer = variant === 'drawer'
  const isEmpty = lines.length === 0

  return (
    <div className={isDrawer ? 'flex min-h-0 flex-1 flex-col' : undefined}>
      {!isDrawer && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Your cart</h2>
          {!isEmpty && (
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="text-xs font-medium text-slate-400 hover:text-rose-500"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div className={isDrawer ? 'flex flex-1 flex-col overflow-hidden' : ''}>
        {isEmpty ? (
          <CartEmpty variant={isDrawer ? 'drawer' : 'panel'} />
        ) : (
          <ul className={isDrawer ? 'flex-1 overflow-y-auto px-5 py-2' : 'flex-1 overflow-y-auto pr-1'}>
            {lines.map((line) => (
              <CartLineItem
                key={line.lineKey}
                lineKey={line.lineKey}
                productId={line.productId}
                variantId={line.variantId}
                quantity={line.quantity}
                product={line.product}
                variant={line.variant}
              />
            ))}
          </ul>
        )}
      </div>

      <div className={isDrawer ? 'border-t border-slate-200 bg-slate-50 p-5' : 'mt-4 space-y-3'}>
        {isDrawer ? (
          <>
            <PromoCodeInput />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Sub-Total</span>
                <span className="tabular-nums font-medium">{formatCurrency(pricing.subtotal)}</span>
              </div>
              {!isEmpty && pricing.discount > 0 && (
                <div className="flex justify-between text-teal-600">
                  <span>{pricing.discountLabel}</span>
                  <span className="tabular-nums">−{formatCurrency(pricing.discount)}</span>
                </div>
              )}
              {!isEmpty && pricing.shipping > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="tabular-nums">{formatCurrency(pricing.shipping)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="tabular-nums text-teal-700">{formatCurrency(pricing.total)}</span>
              </div>
            </div>
            {!isEmpty && (
              <Button className="mt-4 w-full" size="lg">
                Checkout
              </Button>
            )}
          </>
        ) : (
          <>
            <ShippingProgress />
            <PromoCodeInput />
            <CartSummary />
            <Button className="w-full" size="lg">
              Checkout
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
