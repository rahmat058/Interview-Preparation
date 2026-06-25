import {
  store,
  selectFilteredProducts,
  selectCartCount,
  selectCartTotal,
} from '../store/index.js'
import { updatePageMeta } from '../router.js'

const app = document.getElementById('app')
let abortController = null

const categoryBadge = {
  electronics: 'bg-sky-100 text-sky-700 ring-sky-200',
  books: 'bg-amber-100 text-amber-800 ring-amber-200',
  home: 'bg-orange-100 text-orange-800 ring-orange-200',
  fashion: 'bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200',
}

function badgeClass(category) {
  return categoryBadge[category] ?? 'bg-slate-100 text-slate-700 ring-slate-200'
}

export function renderShell() {
  app.innerHTML = `
    <div class="min-h-dvh bg-gradient-to-b from-white via-brand-50/40 to-cyan-50/60">
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:ring-brand-500"
      >
        Skip to content
      </a>
      <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#/" class="flex items-center gap-2 text-lg font-bold tracking-tight text-brand-700 transition hover:text-brand-600">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 text-sm text-white shadow-sm">C</span>
            CatalogSPA
          </a>
          <nav aria-label="Main" class="flex items-center gap-2 sm:gap-3">
            <a
              href="#/"
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Catalog
            </a>
            <a
              href="#/cart"
              class="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart (<span id="cart-count">0</span>)
            </a>
          </nav>
        </div>
      </header>
      <main id="main" class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"></main>
    </div>
  `
  store.subscribe(() => {
    const countEl = document.getElementById('cart-count')
    if (countEl) countEl.textContent = String(selectCartCount(store.getState()))
  })
}

export async function renderCatalog() {
  const main = document.getElementById('main')
  const state = store.getState()
  const productCount = selectFilteredProducts(state).length

  updatePageMeta({
    title: 'Product Catalog — Vanilla SPA',
    description: 'Browse electronics, books, home, and fashion. Filter by category and price.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Product Catalog',
      description: 'Vanilla JS catalog demo',
    },
  })

  main.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Shop the catalog</h1>
      <p class="mt-1 text-sm text-slate-500">Filter by category, price, and sort — all client-side.</p>
    </div>
    <div class="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
      <aside
        class="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-24"
        aria-label="Filters"
      >
        <div class="mb-5 flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </span>
          <h2 class="text-base font-semibold text-slate-900">Filters</h2>
        </div>
        <label class="mb-5 block">
          <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</span>
          <select
            id="filter-category"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All categories</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="home">Home</option>
            <option value="fashion">Fashion</option>
          </select>
        </label>
        <label class="mb-5 block">
          <span class="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Max price</span>
            <span id="price-label" class="rounded-md bg-brand-100 px-2 py-0.5 text-brand-700">$${state.catalog.priceMax}</span>
          </span>
          <input
            id="filter-price"
            type="range"
            min="30"
            max="200"
            step="1"
            value="${state.catalog.priceMax}"
            class="h-2 w-full cursor-pointer"
          />
          <div class="mt-1 flex justify-between text-xs text-slate-400">
            <span>$30</span>
            <span>$200</span>
          </div>
        </label>
        <label class="block">
          <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sort by</span>
          <select
            id="filter-sort"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="name-asc">Name A–Z</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </aside>
      <section class="min-w-0">
        <div id="catalog-status"></div>
        <div class="mb-4 flex items-center justify-between gap-3">
          <p class="text-sm text-slate-500">
            <span class="font-semibold text-slate-800">${productCount}</span>
            ${productCount === 1 ? 'product' : 'products'}
          </p>
        </div>
        <div id="product-grid" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"></div>
      </section>
    </div>
  `

  document.getElementById('filter-category').value = state.catalog.category
  document.getElementById('filter-sort').value = state.catalog.sort

  document.getElementById('filter-category').addEventListener('change', (e) => {
    store.dispatch({ type: 'catalog/setCategory', payload: e.target.value })
    paintProducts()
    updateProductCount()
  })
  document.getElementById('filter-sort').addEventListener('change', (e) => {
    store.dispatch({ type: 'catalog/setSort', payload: e.target.value })
    paintProducts()
  })
  document.getElementById('filter-price').addEventListener('input', (e) => {
    const value = Number(e.target.value)
    document.getElementById('price-label').textContent = `$${value}`
    store.dispatch({ type: 'catalog/setPriceMax', payload: value })
    paintProducts()
    updateProductCount()
  })

  if (state.catalog.status === 'idle') {
    await loadCatalog()
  } else {
    paintStatus()
    paintProducts()
  }
}

function updateProductCount() {
  const count = selectFilteredProducts(store.getState()).length
  const label = document.querySelector('#main .font-semibold.text-slate-800')
  if (label) label.textContent = String(count)
}

async function loadCatalog() {
  paintStatus()
  abortController?.abort()
  abortController = new AbortController()
  store.dispatch({ type: 'catalog/loading' })
  paintStatus()
  try {
    const { fetchProducts } = await import('../api/productsApi.js')
    const products = await fetchProducts(abortController.signal)
    store.dispatch({ type: 'catalog/success', payload: products })
  } catch (error) {
    if (error?.name === 'AbortError') return
    store.dispatch({ type: 'catalog/error', payload: error.message })
  }
  paintStatus()
  paintProducts()
  updateProductCount()
}

function paintStatus() {
  const el = document.getElementById('catalog-status')
  if (!el) return
  const { status, error } = store.getState().catalog
  if (status === 'loading') {
    el.innerHTML = `
      <div class="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"></span>
        Loading products…
      </div>
    `
  } else if (status === 'error') {
    el.innerHTML = `
      <div class="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
        <span>${error}</span>
        <button type="button" id="retry-btn" class="font-semibold text-rose-800 underline underline-offset-2 hover:text-rose-900">Retry</button>
      </div>
    `
    document.getElementById('retry-btn')?.addEventListener('click', loadCatalog)
  } else {
    el.innerHTML = ''
  }
}

function paintProducts() {
  const grid = document.getElementById('product-grid')
  if (!grid) return
  const products = selectFilteredProducts(store.getState())
  if (products.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
        <p class="text-4xl">🔍</p>
        <p class="mt-3 font-medium text-slate-700">No products match your filters</p>
        <p class="mt-1 text-sm text-slate-500">Try widening the price range or choosing a different category.</p>
      </div>
    `
    return
  }
  grid.innerHTML = products
    .map(
      (p) => `
      <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg">
        <a href="#/product/${p.id}" class="block flex-1 p-4 no-underline">
          <div class="mb-4 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-brand-50/50 text-5xl transition group-hover:from-brand-50 group-hover:to-cyan-50">
            ${p.emoji}
          </div>
          <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${badgeClass(p.category)}">
            ${p.category}
          </span>
          <h3 class="mt-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-brand-700">${p.name}</h3>
          <div class="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <span class="text-amber-500">★</span>
            <span>${p.rating}</span>
            <span class="text-slate-300">·</span>
            <span>${p.stock} in stock</span>
          </div>
          <p class="mt-3 text-xl font-bold text-brand-600">$${p.price.toFixed(2)}</p>
        </a>
        <div class="border-t border-slate-100 p-4 pt-3">
          <button
            type="button"
            data-add="${p.id}"
            class="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md active:scale-[0.98]"
          >
            Add to cart
          </button>
        </div>
      </article>
    `,
    )
    .join('')

  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-add')
      const product = store.getState().catalog.products.find((p) => p.id === id)
      if (!product) return
      store.dispatch({ type: 'cart/add', payload: { productId: id, stock: product.stock } })
      btn.textContent = 'Added ✓'
      btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700')
      btn.classList.remove('bg-brand-600', 'hover:bg-brand-700')
      setTimeout(() => {
        btn.textContent = 'Add to cart'
        btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700')
        btn.classList.add('bg-brand-600', 'hover:bg-brand-700')
      }, 1200)
    })
  })
}

export function renderProductDetail(productId) {
  const main = document.getElementById('main')
  const product = store.getState().catalog.products.find((p) => p.id === productId)

  if (!product) {
    main.innerHTML = `
      <div class="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <p class="text-lg font-medium text-slate-700">Product not found</p>
        <a href="#/" class="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">← Back to catalog</a>
      </div>
    `
    return
  }

  updatePageMeta({
    title: `${product.name} — Catalog SPA`,
    description: `Buy ${product.name} for $${product.price}. ${product.category} category.`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD' },
    },
  })

  main.innerHTML = `
    <article class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-5 py-4 sm:px-8">
        <a href="#/" class="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition hover:text-brand-700">
          <span aria-hidden="true">←</span> Back to catalog
        </a>
      </div>
      <div class="grid gap-8 p-5 sm:p-8 md:grid-cols-2">
        <div class="flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 via-brand-50/60 to-cyan-50 p-12 text-8xl sm:text-9xl">
          ${product.emoji}
        </div>
        <div class="flex flex-col justify-center">
          <span class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${badgeClass(product.category)}">
            ${product.category}
          </span>
          <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">${product.name}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span class="inline-flex items-center gap-1">
              <span class="text-amber-500">★</span> ${product.rating} rating
            </span>
            <span class="h-1 w-1 rounded-full bg-slate-300"></span>
            <span class="${product.stock > 5 ? 'text-emerald-600' : 'text-amber-600'} font-medium">${product.stock} in stock</span>
          </div>
          <p class="mt-6 text-4xl font-bold text-brand-600">$${product.price.toFixed(2)}</p>
          <p class="mt-2 text-sm text-slate-500">Free delivery on orders over $50. Ships in 2–3 business days.</p>
          <button
            type="button"
            id="detail-add"
            class="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-700 hover:shadow-lg active:scale-[0.99] sm:w-auto"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  `

  document.getElementById('detail-add').addEventListener('click', (e) => {
    store.dispatch({
      type: 'cart/add',
      payload: { productId: product.id, stock: product.stock },
    })
    const btn = e.currentTarget
    btn.textContent = 'Added to cart ✓'
    btn.classList.replace('bg-brand-600', 'bg-emerald-600')
    btn.classList.replace('hover:bg-brand-700', 'hover:bg-emerald-700')
  })
}

export function renderCart() {
  const main = document.getElementById('main')
  const state = store.getState()
  const byId = Object.fromEntries(state.catalog.products.map((p) => [p.id, p]))
  const lines = Object.values(state.cart)
  const total = selectCartTotal(state)

  updatePageMeta({
    title: 'Your Cart — Catalog SPA',
    description: 'Review items in your shopping cart.',
  })

  if (lines.length === 0) {
    main.innerHTML = `
      <div class="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
        <p class="text-5xl">🛒</p>
        <h1 class="mt-4 text-xl font-bold text-slate-900">Your cart is empty</h1>
        <p class="mt-2 text-sm text-slate-500">Add something from the catalog to get started.</p>
        <a
          href="#/"
          class="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Browse catalog
        </a>
      </div>
    `
    return
  }

  main.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Your cart</h1>
      <p class="mt-1 text-sm text-slate-500">${lines.length} ${lines.length === 1 ? 'item' : 'items'} ready for checkout</p>
    </div>
    <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <ul class="divide-y divide-slate-100">
          ${lines
            .map((line) => {
              const p = byId[line.productId]
              if (!p) return ''
              return `
                <li class="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-brand-50 text-2xl">
                    ${p.emoji}
                  </div>
                  <div class="min-w-0 flex-1">
                    <a href="#/product/${p.id}" class="font-semibold text-slate-900 no-underline hover:text-brand-700">${p.name}</a>
                    <p class="text-sm text-slate-500">$${p.price.toFixed(2)} each</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-slate-500">Qty ${line.qty}</p>
                    <p class="font-bold text-brand-600">$${(p.price * line.qty).toFixed(2)}</p>
                  </div>
                </li>
              `
            })
            .join('')}
        </ul>
      </section>
      <aside class="h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Order summary</h2>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between text-slate-600">
            <dt>Subtotal</dt>
            <dd class="font-medium text-slate-900">$${total.toFixed(2)}</dd>
          </div>
          <div class="flex justify-between text-slate-600">
            <dt>Shipping</dt>
            <dd class="font-medium text-emerald-600">${total >= 50 ? 'Free' : '$5.99'}</dd>
          </div>
        </dl>
        <div class="mt-4 border-t border-slate-100 pt-4">
          <div class="flex justify-between">
            <span class="text-base font-semibold text-slate-900">Total</span>
            <span class="text-xl font-bold text-brand-600">$${(total + (total >= 50 ? 0 : 5.99)).toFixed(2)}</span>
          </div>
        </div>
        <button
          type="button"
          class="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700"
        >
          Proceed to checkout
        </button>
        <button
          type="button"
          id="clear-cart"
          class="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Clear cart
        </button>
      </aside>
    </div>
  `

  document.getElementById('clear-cart').addEventListener('click', () => {
    store.dispatch({ type: 'cart/clear' })
    renderCart()
  })
}

export function renderNotFound() {
  document.getElementById('main').innerHTML = `
    <div class="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <p class="text-4xl">🧭</p>
      <p class="mt-3 text-lg font-medium text-slate-700">Page not found</p>
      <a href="#/" class="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">Go home</a>
    </div>
  `
}
