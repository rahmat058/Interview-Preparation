/**
 * @param {Record<string, () => void>} routes key = hash path without #
 */
export function createHashRouter(routes) {
  const resolve = () => {
    const hash = location.hash.replace(/^#\/?/, '') || '/'
    const [path, id] = hash.split('/').filter(Boolean)
    const key = path === 'product' && id ? `product/:id` : `/${path || ''}`
    const handler = routes[key] ?? routes['404']
    handler?.(id)
  }

  window.addEventListener('hashchange', resolve)
  resolve()

  return {
    navigate(path) {
      location.hash = path
    },
  }
}

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.description
 * @param {Object} [options.jsonLd]
 */
export function updatePageMeta({ title, description, jsonLd }) {
  document.title = title
  let meta = document.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'description'
    document.head.appendChild(meta)
  }
  meta.content = description

  let script = document.querySelector('script[data-json-ld]')
  if (jsonLd) {
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-json-ld', 'true')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
  } else if (script) {
    script.remove()
  }
}
