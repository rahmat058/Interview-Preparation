import './styles/app.css'
import { createHashRouter } from './router.js'
import {
  renderShell,
  renderCatalog,
  renderProductDetail,
  renderCart,
  renderNotFound,
} from './views/render.js'
import { store, selectCartCount } from './store/index.js'

renderShell()

const router = createHashRouter({
  '/': () => renderCatalog(),
  'product/:id': (id) => renderProductDetail(id),
  '/cart': () => renderCart(),
  '404': () => renderNotFound(),
})

store.subscribe(() => {
  const countEl = document.getElementById('cart-count')
  if (countEl) countEl.textContent = String(selectCartCount(store.getState()))
})

export { store, router }
