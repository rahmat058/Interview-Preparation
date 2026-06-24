import { ShoppingBag } from 'lucide-react'

export function CartEmpty() {
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
