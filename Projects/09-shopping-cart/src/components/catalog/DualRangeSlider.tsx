import { useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

interface DualRangeSliderProps {
  min: number
  max: number
  valueMin: number
  valueMax: number
  onChange: (min: number, max: number) => void
  className?: string
}

function clamp(value: number, low: number, high: number) {
  return Math.min(Math.max(value, low), high)
}

function toPercent(value: number, min: number, max: number) {
  if (max <= min) return 0
  return ((value - min) / (max - min)) * 100
}

export function DualRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  className,
}: DualRangeSliderProps) {
  const safeMin = clamp(valueMin, min, max)
  const safeMax = clamp(valueMax, min, max)
  const low = Math.min(safeMin, safeMax)
  const high = Math.max(safeMin, safeMax)

  const left = toPercent(low, min, max)
  const width = toPercent(high, min, max) - left

  const handleMinChange = useCallback(
    (nextMin: number) => {
      const clamped = clamp(nextMin, min, max)
      onChange(Math.min(clamped, high), high)
    },
    [min, max, high, onChange],
  )

  const handleMaxChange = useCallback(
    (nextMax: number) => {
      const clamped = clamp(nextMax, min, max)
      onChange(low, Math.max(clamped, low))
    },
    [min, max, low, onChange],
  )

  return (
    <div className={cn('dual-range-slider', className)}>
      <div className="relative mx-1 h-8">
        <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-linear-to-r from-teal-500 to-cyan-500 shadow-sm shadow-teal-500/25"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={low}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className="dual-range-input dual-range-input--min absolute inset-0 w-full"
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={low}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={high}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className="dual-range-input dual-range-input--max absolute inset-0 w-full"
          aria-label="Maximum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={high}
        />
      </div>
    </div>
  )
}
