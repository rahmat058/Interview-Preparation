import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setPriceRange } from '@/lib/store/slices/cartSlice'
import { selectAdvancedFilters, selectCatalogPriceBounds } from '@/lib/store/selectors/cartSelectors'
import { formatCurrency } from '@/lib/utils/cartPricing'
import { DualRangeSlider } from '@/components/catalog/DualRangeSlider'
import { cn } from '@/lib/utils/cn'

function parsePriceInput(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  if (!cleaned) return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : null
}

export function PriceRangeFilter() {
  const dispatch = useAppDispatch()
  const { priceMin, priceMax } = useAppSelector(selectAdvancedFilters)
  const bounds = useAppSelector(selectCatalogPriceBounds)

  const [activeField, setActiveField] = useState<'min' | 'max' | null>(null)
  const [draft, setDraft] = useState('')

  const minDisplay = activeField === 'min' ? draft : String(priceMin)
  const maxDisplay = activeField === 'max' ? draft : String(priceMax)

  const commitRange = (min: number, max: number) => {
    const nextMin = Math.max(bounds.min, Math.min(min, max))
    const nextMax = Math.min(bounds.max, Math.max(min, max))
    dispatch(setPriceRange({ min: nextMin, max: nextMax }))
  }

  const handleSliderChange = (min: number, max: number) => {
    dispatch(setPriceRange({ min, max }))
    if (activeField === 'min') setActiveField(null)
    if (activeField === 'max') setActiveField(null)
  }

  const handleMinFocus = () => {
    setActiveField('min')
    setDraft(String(priceMin))
  }

  const handleMaxFocus = () => {
    setActiveField('max')
    setDraft(String(priceMax))
  }

  const handleMinBlur = () => {
    const parsed = parsePriceInput(activeField === 'min' ? draft : String(priceMin))
    setActiveField(null)
    if (parsed === null) return
    commitRange(parsed, priceMax)
  }

  const handleMaxBlur = () => {
    const parsed = parsePriceInput(activeField === 'max' ? draft : String(priceMax))
    setActiveField(null)
    if (parsed === null) return
    commitRange(priceMin, parsed)
  }

  return (
    <div className="space-y-4">
      <DualRangeSlider
        min={bounds.min}
        max={bounds.max}
        valueMin={priceMin}
        valueMax={priceMax}
        onChange={handleSliderChange}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="price-min-input" className="sr-only">
            Minimum price
          </label>
          <input
            id="price-min-input"
            type="text"
            inputMode="decimal"
            value={minDisplay}
            onChange={(event) => {
              setActiveField('min')
              setDraft(event.target.value)
            }}
            onFocus={handleMinFocus}
            onBlur={handleMinBlur}
            onKeyDown={(event) => event.key === 'Enter' && handleMinBlur()}
            className={cn(
              'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium',
              'text-slate-800 tabular-nums outline-none transition-colors',
              'focus:border-teal-400 focus:ring-2 focus:ring-teal-100',
            )}
            aria-label="Minimum price value"
          />
        </div>
        <div>
          <label htmlFor="price-max-input" className="sr-only">
            Maximum price
          </label>
          <input
            id="price-max-input"
            type="text"
            inputMode="decimal"
            value={maxDisplay}
            onChange={(event) => {
              setActiveField('max')
              setDraft(event.target.value)
            }}
            onFocus={handleMaxFocus}
            onBlur={handleMaxBlur}
            onKeyDown={(event) => event.key === 'Enter' && handleMaxBlur()}
            className={cn(
              'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium',
              'text-slate-800 tabular-nums outline-none transition-colors',
              'focus:border-teal-400 focus:ring-2 focus:ring-teal-100',
            )}
            aria-label="Maximum price value"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>{formatCurrency(bounds.min)}</span>
        <span className="text-teal-600">
          {formatCurrency(priceMin)} – {formatCurrency(priceMax)}
        </span>
        <span>{formatCurrency(bounds.max)}</span>
      </div>
    </div>
  )
}
