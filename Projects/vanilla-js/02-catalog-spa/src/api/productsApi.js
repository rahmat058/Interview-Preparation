/**
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('../store/index.js').Product[]>}
 */
export async function fetchProducts(signal) {
  const response = await fetch('/data/products.json', { signal })
  if (!response.ok) throw new Error(`Failed to load catalog (${response.status})`)
  await delay(400, signal)
  const json = await response.json()
  return json.data
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}
