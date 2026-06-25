import {
  store,
  selectTableView,
  selectEmployeeById,
  TABLE_COLUMNS,
  createEmployeeId,
} from '../store/index.js'
import {
  countActiveFilters,
  formatJoinDate,
  formatSalary,
  formatStatusLabel,
  getStatusStyles,
} from '../lib/tableQuery.js'
import { debounce } from '../lib/debounce.js'

const app = document.getElementById('app')
let abortController = null

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20'

const selectClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20'

export function renderApp() {
  app.innerHTML = `
    <div class="min-h-dvh bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-cyan-500 text-lg text-white shadow-sm">⊞</span>
            <div>
              <h1 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">GridLens</h1>
              <p class="text-xs text-slate-500">Employee data table · full CRUD</p>
            </div>
          </div>
          <button
            type="button"
            id="btn-add"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md"
          >
            <span aria-hidden="true">+</span> Add employee
          </button>
        </div>
      </header>

      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div id="status-banner"></div>
        <section class="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5" aria-label="Table filters">
          <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <label class="sm:col-span-2 xl:col-span-1">
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search</span>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input id="filter-search" type="search" placeholder="Name, email, dept…" class="${inputClass} pl-10" />
                </div>
              </label>
              <label>
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Department</span>
                <select id="filter-department" class="${selectClass}"><option value="">All</option></select>
              </label>
              <label>
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Role</span>
                <select id="filter-role" class="${selectClass}"><option value="">All</option></select>
              </label>
              <label>
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span>
                <select id="filter-status" class="${selectClass}"><option value="">All</option></select>
              </label>
              <label>
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Location</span>
                <select id="filter-location" class="${selectClass}"><option value="">All</option></select>
              </label>
            </div>
            <button
              type="button"
              id="btn-clear-filters"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        </section>

        <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div id="table-toolbar" class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5"></div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead id="table-head" class="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500"></thead>
              <tbody id="table-body"></tbody>
            </table>
          </div>
          <div id="table-pagination" class="border-t border-slate-100 px-4 py-3 sm:px-5"></div>
        </section>
      </main>

      <dialog id="employee-modal" class="w-[min(calc(100vw-2rem),32rem)] overflow-hidden rounded-2xl p-0 shadow-2xl ring-1 ring-white/20">
        <form id="employee-form" method="dialog" class="flex max-h-[90dvh] flex-col"></form>
      </dialog>

      <dialog id="delete-modal" class="w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-2xl p-0 shadow-2xl ring-1 ring-white/20">
        <div class="bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 px-6 py-4 text-white">
          <h2 class="text-lg font-bold">Delete employee?</h2>
        </div>
        <div class="bg-gradient-to-b from-white to-rose-50/40 p-6">
          <p id="delete-message" class="text-sm text-slate-600"></p>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" id="delete-cancel" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="button" id="delete-confirm" class="rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-rose-700 hover:to-orange-600">Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  `

  bindStaticEvents()
  store.subscribe(() => paint())
  loadData()
}

function bindStaticEvents() {
  document.getElementById('btn-add').addEventListener('click', () => {
    store.dispatch({ type: 'ui/openCreate' })
  })

  const debouncedSearch = debounce((value) => {
    store.dispatch({ type: 'query/setSearch', payload: value })
  }, 300)

  document.getElementById('filter-search').addEventListener('input', (e) => {
    debouncedSearch(e.target.value)
  })

  ;['department', 'role', 'status', 'location'].forEach((key) => {
    document.getElementById(`filter-${key}`).addEventListener('change', (e) => {
      store.dispatch({ type: 'query/setFilter', payload: { key, value: e.target.value } })
    })
  })

  document.getElementById('btn-clear-filters').addEventListener('click', () => {
    store.dispatch({ type: 'query/clearFilters' })
    document.getElementById('filter-search').value = ''
  })

  document.getElementById('delete-cancel').addEventListener('click', () => {
    store.dispatch({ type: 'ui/cancelDelete' })
  })

  document.getElementById('delete-confirm').addEventListener('click', () => {
    const id = store.getState().deleteId
    if (id) store.dispatch({ type: 'employees/delete', payload: id })
  })
}

async function loadData() {
  const state = store.getState()
  if (state.employees.length > 0 && state.status === 'ready') {
    paint()
    return
  }

  store.dispatch({ type: 'data/loading' })
  abortController?.abort()
  abortController = new AbortController()

  try {
    const { fetchEmployees } = await import('../api/employeesApi.js')
    const data = await fetchEmployees(abortController.signal)
    store.dispatch({ type: 'data/success', payload: data })
  } catch (error) {
    if (error?.name === 'AbortError') return
    store.dispatch({ type: 'data/error', payload: error.message })
  }
}

function paint() {
  const state = store.getState()
  paintStatus(state)
  paintFilterOptions(state)
  syncFilterControls(state)
  paintToolbar(state)
  paintHead(state)
  paintBody(state)
  paintPagination(state)
  paintEmployeeModal(state)
  paintDeleteModal(state)
}

function paintStatus(state) {
  const el = document.getElementById('status-banner')
  if (!el) return
  if (state.status === 'loading') {
    el.innerHTML = `
      <div class="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"></span>
        Loading employees…
      </div>`
  } else if (state.status === 'error') {
    el.innerHTML = `
      <div class="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
        ${state.error}
        <button type="button" id="retry-load" class="ml-2 font-semibold underline">Retry</button>
      </div>`
    document.getElementById('retry-load')?.addEventListener('click', loadData)
  } else {
    el.innerHTML = ''
  }
}

function paintFilterOptions(state) {
  if (!state.datasetMeta) return
  const { departments, roles, statuses, locations } = state.datasetMeta
  fillSelect('filter-department', departments)
  fillSelect('filter-role', roles)
  fillSelect('filter-status', statuses, formatStatusLabel)
  fillSelect('filter-location', locations)
}

function fillSelect(id, options, labelFn = (v) => v) {
  const el = document.getElementById(id)
  if (!el || el.dataset.filled === '1') return
  el.innerHTML =
    '<option value="">All</option>' +
    options.map((o) => `<option value="${o}">${labelFn(o)}</option>`).join('')
  el.dataset.filled = '1'
}

function syncFilterControls(state) {
  const search = document.getElementById('filter-search')
  if (search && document.activeElement !== search) search.value = state.query.search
  ;['department', 'role', 'status', 'location'].forEach((key) => {
    const el = document.getElementById(`filter-${key}`)
    if (el) el.value = state.query.filters[key]
  })
}

function paintToolbar(state) {
  const el = document.getElementById('table-toolbar')
  if (!el) return
  const { meta } = selectTableView(state)
  const active = countActiveFilters(state.query.filters) + (state.query.search ? 1 : 0)

  el.innerHTML = `
    <p class="text-sm text-slate-600">
      Showing <span class="font-semibold text-slate-900">${meta.filteredTotal}</span>
      of <span class="font-semibold text-slate-900">${meta.total}</span> employees
      ${active ? `<span class="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">${active} filter${active > 1 ? 's' : ''}</span>` : ''}
    </p>
    <label class="flex items-center gap-2 text-sm text-slate-600">
      <span>Rows</span>
      <select id="page-size" class="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm">
        ${[10, 25, 50].map((n) => `<option value="${n}" ${state.query.pageSize === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select>
    </label>
  `

  document.getElementById('page-size')?.addEventListener('change', (e) => {
    store.dispatch({ type: 'query/setPageSize', payload: Number(e.target.value) })
  })
}

function sortIcon(column, state) {
  if (state.query.sortBy !== column) return '<span class="text-slate-300">↕</span>'
  return state.query.sortOrder === 'asc'
    ? '<span class="text-brand-600">↑</span>'
    : '<span class="text-brand-600">↓</span>'
}

function paintHead(state) {
  const el = document.getElementById('table-head')
  if (!el) return
  el.innerHTML = `
    <tr>
      ${TABLE_COLUMNS.map(
        (col) => `
        <th scope="col" class="px-4 py-3 sm:px-5 ${col.align === 'right' ? 'text-right' : ''}">
          <button
            type="button"
            data-sort="${col.id}"
            class="inline-flex items-center gap-1.5 font-semibold transition hover:text-brand-600"
            aria-sort="${state.query.sortBy === col.id ? (state.query.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}"
          >
            ${col.label} ${sortIcon(col.id, state)}
          </button>
        </th>`,
      ).join('')}
      <th scope="col" class="px-4 py-3 text-right sm:px-5">Actions</th>
    </tr>
  `

  el.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.dispatch({ type: 'query/setSort', payload: btn.getAttribute('data-sort') })
    })
  })
}

function paintBody(state) {
  const el = document.getElementById('table-body')
  if (!el) return

  if (state.status === 'loading') {
    el.innerHTML = Array.from({ length: 5 })
      .map(
        () => `
      <tr class="border-t border-slate-100">
        ${TABLE_COLUMNS.map(() => `<td class="px-4 py-4 sm:px-5"><div class="h-4 animate-pulse rounded bg-slate-100"></div></td>`).join('')}
        <td class="px-4 py-4 sm:px-5"><div class="h-4 w-16 animate-pulse rounded bg-slate-100"></div></td>
      </tr>`,
      )
      .join('')
    return
  }

  const { rows } = selectTableView(state)

  if (rows.length === 0) {
    el.innerHTML = `
      <tr>
        <td colspan="${TABLE_COLUMNS.length + 1}" class="px-4 py-16 text-center sm:px-5">
          <p class="text-4xl">📋</p>
          <p class="mt-2 font-medium text-slate-700">No employees found</p>
          <p class="mt-1 text-sm text-slate-500">Try adjusting filters or add a new record.</p>
        </td>
      </tr>`
    return
  }

  el.innerHTML = rows
    .map(
      (row) => `
    <tr class="border-t border-slate-100 transition hover:bg-slate-50/80">
      <td class="px-4 py-3.5 font-medium text-slate-900 sm:px-5">${row.name}</td>
      <td class="px-4 py-3.5 text-slate-600 sm:px-5">${row.email}</td>
      <td class="px-4 py-3.5 sm:px-5"><span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">${row.department}</span></td>
      <td class="px-4 py-3.5 text-slate-600 sm:px-5">${row.role}</td>
      <td class="px-4 py-3.5 sm:px-5">
        <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyles(row.status)}">
          ${formatStatusLabel(row.status)}
        </span>
      </td>
      <td class="px-4 py-3.5 text-slate-600 sm:px-5">${row.location}</td>
      <td class="px-4 py-3.5 text-right font-medium text-slate-900 sm:px-5">${formatSalary(row.salary)}</td>
      <td class="px-4 py-3.5 text-right text-slate-600 sm:px-5">${formatJoinDate(row.joinDate)}</td>
      <td class="px-4 py-3.5 text-right sm:px-5">
        <div class="inline-flex gap-1">
          <button type="button" data-edit="${row.id}" class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50">Edit</button>
          <button type="button" data-delete="${row.id}" class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
        </div>
      </td>
    </tr>`,
    )
    .join('')

  el.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const employee = selectEmployeeById(store.getState(), btn.getAttribute('data-edit'))
      if (employee) store.dispatch({ type: 'ui/openEdit', payload: employee })
    })
  })

  el.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.dispatch({ type: 'ui/confirmDelete', payload: btn.getAttribute('data-delete') })
    })
  })
}

function paintPagination(state) {
  const el = document.getElementById('table-pagination')
  if (!el) return
  const { meta } = selectTableView(state)
  const pages = buildPageList(meta.page, meta.totalPages)

  el.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-slate-500">Page ${meta.page} of ${meta.totalPages}</p>
      <div class="flex flex-wrap items-center gap-1">
        <button type="button" data-page="prev" ${meta.page <= 1 ? 'disabled' : ''} class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Prev</button>
        ${pages
          .map((p) =>
            p === '…'
              ? `<span class="px-2 text-slate-400">…</span>`
              : `<button type="button" data-page="${p}" class="min-w-9 rounded-lg px-2 py-1.5 text-sm font-medium ${p === meta.page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">${p}</button>`,
          )
          .join('')}
        <button type="button" data-page="next" ${meta.page >= meta.totalPages ? 'disabled' : ''} class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
      </div>
    </div>
  `

  el.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-page')
      if (value === 'prev') store.dispatch({ type: 'query/setPage', payload: meta.page - 1 })
      else if (value === 'next') store.dispatch({ type: 'query/setPage', payload: meta.page + 1 })
      else store.dispatch({ type: 'query/setPage', payload: Number(value) })
    })
  })
}

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
    pages.push(p)
  }
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

function paintEmployeeModal(state) {
  const dialog = document.getElementById('employee-modal')
  const form = document.getElementById('employee-form')
  if (!dialog || !form) return

  if (!state.modal) {
    if (dialog.open) dialog.close()
    return
  }

  const isEdit = state.modal.mode === 'edit'
  const emp = state.modal.employee
  const meta = state.datasetMeta

  form.innerHTML = `
    <div class="relative shrink-0 bg-gradient-to-br from-brand-600 via-blue-600 to-cyan-500 px-6 py-5 text-white">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_55%)]"></div>
      <div class="relative flex items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold tracking-tight">${isEdit ? 'Edit employee' : 'Add employee'}</h2>
          <p class="mt-0.5 text-sm text-blue-100">${isEdit ? 'Update record fields below.' : 'Create a new employee record.'}</p>
        </div>
        <button type="button" id="modal-close" class="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close">✕</button>
      </div>
    </div>
    <div class="overflow-y-auto bg-gradient-to-b from-white via-brand-50/30 to-cyan-50/40 px-6 py-5">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="sm:col-span-2">
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Full name</span>
          <input name="name" required class="${inputClass}" value="${emp?.name ?? ''}" />
        </label>
        <label class="sm:col-span-2">
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Email</span>
          <input name="email" type="email" required class="${inputClass}" value="${emp?.email ?? ''}" />
        </label>
        <label>
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Department</span>
          <select name="department" required class="${selectClass}">
            ${(meta?.departments ?? []).map((d) => `<option value="${d}" ${emp?.department === d ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </label>
        <label>
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Role</span>
          <select name="role" required class="${selectClass}">
            ${(meta?.roles ?? []).map((r) => `<option value="${r}" ${emp?.role === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </label>
        <label>
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Status</span>
          <select name="status" required class="${selectClass}">
            ${(meta?.statuses ?? ['active', 'inactive', 'on_leave']).map((s) => `<option value="${s}" ${emp?.status === s ? 'selected' : ''}>${formatStatusLabel(s)}</option>`).join('')}
          </select>
        </label>
        <label>
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Location</span>
          <select name="location" required class="${selectClass}">
            ${(meta?.locations ?? []).map((l) => `<option value="${l}" ${emp?.location === l ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </label>
        <label>
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Salary (USD)</span>
          <input name="salary" type="number" min="0" step="500" required class="${inputClass}" value="${emp?.salary ?? 60000}" />
        </label>
        <label>
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Join date</span>
          <input name="joinDate" type="date" required class="${inputClass}" value="${emp?.joinDate ?? new Date().toISOString().slice(0, 10)}" />
        </label>
        <label>
          <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">Performance score</span>
          <input name="performanceScore" type="number" min="0" max="100" required class="${inputClass}" value="${emp?.performanceScore ?? 75}" />
        </label>
      </div>
    </div>
    <div class="flex shrink-0 justify-end gap-3 border-t border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-sm">
      <button type="button" id="modal-cancel" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50">Cancel</button>
      <button type="submit" class="rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-brand-700 hover:to-cyan-600 hover:shadow-lg">${isEdit ? 'Save changes' : 'Create employee'}</button>
    </div>
  `

  if (!dialog.open) dialog.showModal()

  document.getElementById('modal-close').addEventListener('click', () => {
    store.dispatch({ type: 'ui/closeModal' })
  })
  document.getElementById('modal-cancel').addEventListener('click', () => {
    store.dispatch({ type: 'ui/closeModal' })
  })

  form.onsubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name')).trim(),
      email: String(fd.get('email')).trim(),
      department: String(fd.get('department')),
      role: String(fd.get('role')),
      status: /** @type {Employee['status']} */ (String(fd.get('status'))),
      location: String(fd.get('location')),
      salary: Number(fd.get('salary')),
      joinDate: String(fd.get('joinDate')),
      performanceScore: Number(fd.get('performanceScore')),
    }

    if (isEdit && emp) {
      store.dispatch({ type: 'employees/update', payload: { ...emp, ...payload } })
    } else {
      store.dispatch({
        type: 'employees/create',
        payload: { id: createEmployeeId(payload), ...payload },
      })
    }
  }
}

function paintDeleteModal(state) {
  const dialog = document.getElementById('delete-modal')
  const message = document.getElementById('delete-message')
  if (!dialog || !message) return

  if (!state.deleteId) {
    if (dialog.open) dialog.close()
    return
  }

  const employee = selectEmployeeById(state, state.deleteId)
  message.textContent = employee
    ? `Remove ${employee.name} (${employee.email})? This cannot be undone.`
    : 'Remove this employee? This cannot be undone.'

  if (!dialog.open) dialog.showModal()
}
