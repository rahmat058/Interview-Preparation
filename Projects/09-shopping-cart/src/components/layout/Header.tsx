import { NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { selectCartItemCount, selectCartPricing } from '@/lib/store/selectors/cartSelectors'
import { formatCurrency } from '@/lib/utils/cartPricing'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { to: '/', label: 'Cart Demo' },
  { to: '/catalog', label: 'Advanced Catalog' },
]

export function Header() {
  const itemCount = useAppSelector(selectCartItemCount)
  const pricing = useAppSelector(selectCartPricing)
  const restored = useAppSelector((state) => state.cart.restoredFromStorage)

  return (
    <header className="sticky top-0 z-50 border-b border-teal-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="bg-linear-to-r from-teal-600 to-cyan-500 bg-clip-text text-lg font-bold text-transparent">
                CartPulse
              </h1>
              <p className="text-xs text-slate-500">Shopping Cart</p>
            </div>
          </NavLink>
        </div>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-teal-100 text-teal-800'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {restored && itemCount > 0 && (
            <span className="hidden rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-medium text-teal-800 sm:inline">
              Cart restored
            </span>
          )}
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 tabular-nums">
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </span>
          {itemCount > 0 && (
            <span className="hidden rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 tabular-nums sm:inline">
              {formatCurrency(pricing.total)}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
