import './styles/app.css'
import { debounce, computeVirtualWindow, measure } from './lib/performance.js'

const ROW_HEIGHT = 44
const ITEM_COUNT = 10000

const items = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  id: i + 1,
  label: `Row item #${i + 1}`,
}))

const app = document.getElementById('app')

app.innerHTML = `
  <div class="min-h-dvh bg-gradient-to-b from-white via-brand-50/40 to-cyan-50/60">
    <header class="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div class="flex items-start gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-lg text-white shadow-sm">⚡</span>
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Performance Patterns</h1>
            <p class="mt-1 text-sm text-slate-500">
              Virtual list (10k rows), debounced search, lazy images, and Performance API marks.
            </p>
          </div>
        </div>
        <dl class="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
          <div class="rounded-xl border border-slate-200/80 bg-white px-3 py-3 text-center shadow-sm sm:px-4">
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Dataset</dt>
            <dd class="mt-1 text-lg font-bold text-brand-600 sm:text-xl">${ITEM_COUNT.toLocaleString()}</dd>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-white px-3 py-3 text-center shadow-sm sm:px-4">
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Debounce</dt>
            <dd class="mt-1 text-lg font-bold text-brand-600 sm:text-xl">300ms</dd>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-white px-3 py-3 text-center shadow-sm sm:px-4">
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">DOM nodes</dt>
            <dd id="dom-nodes-stat" class="mt-1 text-lg font-bold text-brand-600 sm:text-xl">~10</dd>
          </div>
        </dl>
      </div>
    </header>

    <main class="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <section class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div class="mb-4 flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <h2 class="text-base font-semibold text-slate-900">Debounced search</h2>
        </div>
        <label class="block">
          <span class="sr-only">Search</span>
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search"
              type="search"
              placeholder="Type to filter rows (300ms debounce)…"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </label>
        <p id="search-meta" class="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500"></p>
      </section>

      <section class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
            <h2 class="text-base font-semibold text-slate-900">Virtual scroll</h2>
          </div>
          <span id="render-ms" class="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200/80"></span>
        </div>
        <p class="mb-3 text-xs text-slate-500">
          Only visible rows are mounted — scroll to see the window shift without rendering all ${ITEM_COUNT.toLocaleString()} items.
        </p>
        <div
          id="viewport"
          class="overflow-auto rounded-xl border border-slate-200 bg-slate-50/50 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          tabindex="0"
          role="list"
          aria-label="Virtual list"
        ></div>
      </section>

      <section class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div class="mb-4 flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <div>
            <h2 class="text-base font-semibold text-slate-900">Lazy images</h2>
            <p class="text-xs text-slate-500">IntersectionObserver + native <code class="rounded bg-slate-100 px-1 py-0.5 text-slate-600">loading="lazy"</code></p>
          </div>
        </div>
        <div id="lazy-grid" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
      </section>
    </main>
  </div>
`

function formatSearchMeta(count, ms) {
  const matchLabel = `${count.toLocaleString()} ${count === 1 ? 'match' : 'matches'}`
  if (ms == null) {
    return `<span class="font-medium text-slate-700">${matchLabel}</span>`
  }
  return `
    <span class="font-medium text-slate-700">${matchLabel}</span>
    <span class="text-slate-300">·</span>
    <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      filter ${ms.toFixed(2)}ms
    </span>
  `
}

// --- Debounced search ---
let filtered = items
const searchMeta = document.getElementById('search-meta')
const domNodesStat = document.getElementById('dom-nodes-stat')

const runSearch = debounce((query) => {
  const q = query.trim().toLowerCase()
  const ms = measure('search-filter', () => {
    filtered = q ? items.filter((item) => item.label.toLowerCase().includes(q)) : items
  })
  searchMeta.innerHTML = formatSearchMeta(filtered.length, ms)
  paintVirtualList()
}, 300)

document.getElementById('search').addEventListener('input', (e) => runSearch(e.target.value))

// --- Virtual list ---
const viewport = document.getElementById('viewport')
const renderMs = document.getElementById('render-ms')

function paintVirtualList() {
  const scrollTop = viewport.scrollTop
  const { totalHeight, offsetY, visible, startIndex } = computeVirtualWindow(
    filtered,
    ROW_HEIGHT,
    viewport.clientHeight,
    scrollTop,
  )

  const duration = measure('virtual-paint', () => {
    viewport.style.height = '320px'
    viewport.innerHTML = `
      <div class="relative" style="height:${totalHeight}px">
        <div class="absolute inset-x-0 top-0" style="transform:translateY(${offsetY}px)">
          ${visible
            .map((item, i) => {
              const index = startIndex + i
              const zebra = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'
              return `
            <div
              class="flex items-center border-b border-slate-100 px-4 text-sm text-slate-800 ${zebra}"
              role="listitem"
              style="height:${ROW_HEIGHT}px"
            >
              <span class="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-100 text-xs font-semibold text-brand-700">
                ${index + 1}
              </span>
              <span class="font-medium">${item.label}</span>
              <span class="ml-2 text-xs text-slate-400">index ${index}</span>
            </div>`
            })
            .join('')}
        </div>
      </div>
    `
  })

  renderMs.textContent = `${visible.length} DOM nodes · ${duration.toFixed(2)}ms`
  if (domNodesStat) domNodesStat.textContent = String(visible.length)
}

viewport.addEventListener('scroll', () => paintVirtualList(), { passive: true })
paintVirtualList()
searchMeta.innerHTML = formatSearchMeta(filtered.length)

// --- Lazy images ---
const lazyGrid = document.getElementById('lazy-grid')
lazyGrid.innerHTML = Array.from(
  { length: 12 },
  (_, i) => `
  <article class="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <div class="lazy-skeleton absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-100"></div>
      <img
        data-src="https://picsum.photos/seed/vanilla-${i}/640/400"
        alt="Lazy loaded sample ${i + 1}"
        width="640"
        height="400"
        loading="lazy"
        class="lazy-img relative h-full w-full object-cover opacity-0 transition duration-500"
      />
    </div>
    <div class="flex items-center justify-between px-3 py-2.5">
      <span class="text-sm font-medium text-slate-700">Image ${i + 1}</span>
      <span class="lazy-status rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">pending</span>
    </div>
  </article>
`,
).join('')

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const img = entry.target
      const src = img.getAttribute('data-src')
      const card = img.closest('article')
      const status = card?.querySelector('.lazy-status')
      if (src) {
        if (status) {
          status.textContent = 'loading'
          status.className =
            'lazy-status rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700'
        }
        img.addEventListener(
          'load',
          () => {
            img.classList.remove('opacity-0')
            img.classList.add('opacity-100')
            card?.querySelector('.lazy-skeleton')?.remove()
            if (status) {
              status.textContent = 'loaded'
              status.className =
                'lazy-status rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
            }
          },
          { once: true },
        )
        img.src = src
        img.removeAttribute('data-src')
      }
      observer.unobserve(img)
    })
  },
  { rootMargin: '100px' },
)

lazyGrid.querySelectorAll('.lazy-img').forEach((img) => observer.observe(img))
