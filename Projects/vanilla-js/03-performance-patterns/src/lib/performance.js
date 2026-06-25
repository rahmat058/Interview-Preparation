/**
 * @param {T} value
 * @param {number} waitMs
 * @returns {(arg: T) => void}
 * @template T
 */
export function debounce(fn, waitMs) {
  let timer = 0
  return (arg) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => fn(arg), waitMs)
  }
}

/**
 * @param {T[]} items
 * @param {number} rowHeight
 * @param {number} viewportHeight
 * @param {number} scrollTop
 * @param {number} [overscan]
 */
export function computeVirtualWindow(items, rowHeight, viewportHeight, scrollTop, overscan = 3) {
  const totalHeight = items.length * rowHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2
  const endIndex = Math.min(items.length, startIndex + visibleCount)
  return {
    totalHeight,
    startIndex,
    endIndex,
    offsetY: startIndex * rowHeight,
    visible: items.slice(startIndex, endIndex),
  }
}

/**
 * @param {string} label
 * @param {() => void} fn
 */
export function measure(label, fn) {
  performance.mark(`${label}-start`)
  fn()
  performance.mark(`${label}-end`)
  performance.measure(label, `${label}-start`, `${label}-end`)
  const entry = performance.getEntriesByName(label).pop()
  return entry?.duration ?? 0
}
