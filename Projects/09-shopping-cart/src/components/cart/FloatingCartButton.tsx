import { ShoppingBag } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { selectCartItemCount } from '@/lib/store/selectors/cartSelectors'
import { cn } from '@/lib/utils/cn'

interface FloatingCartButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingCartButton({ onClick, className }: FloatingCartButtonProps) {
  const itemCount = useAppSelector(selectCartItemCount)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1.5',
        className,
      )}
      aria-label={`Open cart (${itemCount} items)`}
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-teal-500 via-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/35 ring-2 ring-white/80 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
        <ShoppingBag className="h-6 w-6" />
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white tabular-nums">
          {itemCount}
        </span>
      </span>
      <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-teal-700 uppercase shadow-sm ring-1 ring-teal-100">
        Cart
      </span>
    </button>
  )
}
