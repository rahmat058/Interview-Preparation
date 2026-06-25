/**
 * @param {(...args: T[]) => void} fn
 * @param {number} waitMs
 * @template T
 */
export function debounce(fn, waitMs) {
  let timer = 0
  return (...args) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => fn(...args), waitMs)
  }
}
