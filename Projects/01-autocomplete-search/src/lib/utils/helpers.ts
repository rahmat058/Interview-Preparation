export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delayMs)
  }

  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }

  return debounced
}

export function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function highlightMatch(text: string, query: string) {
  if (!query.trim()) return [{ text, match: false }]

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return parts.filter(Boolean).map((part) => ({
    text: part,
    match: part.toLowerCase() === query.toLowerCase(),
  }))
}
