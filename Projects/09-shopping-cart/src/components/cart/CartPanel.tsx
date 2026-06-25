import { CartContent } from '@/components/cart/CartContent'

export function CartPanel() {
  return (
    <aside
      className="glass-card flex flex-col p-5 sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]"
      aria-label="Shopping cart"
    >
      <CartContent variant="panel" />
    </aside>
  )
}
