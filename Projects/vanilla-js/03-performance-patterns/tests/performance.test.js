import { describe, expect, it, vi } from 'vitest'
import { computeVirtualWindow, debounce } from '../src/lib/performance.js'

describe('computeVirtualWindow', () => {
  const items = Array.from({ length: 100 }, (_, i) => i)

  it('returns only visible slice', () => {
    const result = computeVirtualWindow(items, 40, 200, 0, 0)
    expect(result.visible.length).toBeLessThanOrEqual(6)
    expect(result.totalHeight).toBe(4000)
  })

  it('offsets window based on scroll', () => {
    const result = computeVirtualWindow(items, 40, 200, 400, 0)
    expect(result.startIndex).toBe(10)
    expect(result.offsetY).toBe(400)
  })
})

describe('debounce', () => {
  it('delays invocation', async () => {
    vi.useFakeTimers()
    let count = 0
    const fn = debounce(() => { count += 1 }, 200)
    fn()
    fn()
    expect(count).toBe(0)
    vi.advanceTimersByTime(200)
    expect(count).toBe(1)
    vi.useRealTimers()
  })
})
