import { ShoppingBag } from 'lucide-react'

interface CartEmptyProps {
  variant?: 'panel' | 'drawer'
}

export function CartEmpty({ variant = 'panel' }: CartEmptyProps) {
  if (variant === 'drawer') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-base font-medium text-slate-600">Your shopping cart is empty!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <p className="text-sm font-medium text-slate-700">Your cart is empty</p>
      <p className="max-w-xs text-xs text-slate-400">
        Add items from the catalog. Cart persists in localStorage when you refresh.
      </p>
    </div>
  )
}
