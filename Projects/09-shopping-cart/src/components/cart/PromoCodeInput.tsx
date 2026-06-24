import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { applyPromoCode, clearPromoCode } from '@/lib/store/slices/cartSlice'
import { PROMO_CODES } from '@/lib/types/cart'
import { Button } from '@/components/ui/Button'

export function PromoCodeInput() {
  const dispatch = useAppDispatch()
  const promoCode = useAppSelector((state) => state.cart.promoCode)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleApply(event: React.FormEvent) {
    event.preventDefault()
    const code = input.trim().toUpperCase()
    if (!PROMO_CODES[code]) {
      setError('Invalid code — try SAVE10 or FREESHIP')
      return
    }
    setError(null)
    dispatch(applyPromoCode(code))
    setInput('')
  }

  if (promoCode) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-teal-50 px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-teal-700">
          <Tag className="h-3.5 w-3.5" />
          {promoCode} — {PROMO_CODES[promoCode].label}
        </span>
        <button
          type="button"
          onClick={() => dispatch(clearPromoCode())}
          className="rounded p-1 text-teal-600 hover:bg-teal-100"
          aria-label="Remove promo code"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleApply} className="space-y-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
            setError(null)
          }}
          placeholder="Promo code"
          className="flex-1 rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
        />
        <Button type="submit" size="sm" variant="outline" disabled={!input.trim()}>
          Apply
        </Button>
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <p className="text-[10px] text-slate-400">Try SAVE10 (10% off) or FREESHIP</p>
    </form>
  )
}
