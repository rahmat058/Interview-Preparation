import { createStore } from './createStore.js'
import { queryEmployees } from '../lib/tableQuery.js'

const STORAGE_KEY = 'vanilla-data-table-v1'

/** @typedef {Object} Employee
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} department
 * @property {string} role
 * @property {'active'|'inactive'|'on_leave'} status
 * @property {string} location
 * @property {number} salary
 * @property {string} joinDate
 * @property {number} performanceScore
 */

/** @typedef {Object} TableFilters
 * @property {string} department
 * @property {string} role
 * @property {string} status
 * @property {string} location
 */

/** @typedef {Object} TableQuery
 * @property {string} search
 * @property {import('../lib/tableQuery.js').SortableColumn} sortBy
 * @property {'asc'|'desc'} sortOrder
 * @property {TableFilters} filters
 * @property {number} page
 * @property {number} pageSize
 */

/** @typedef {Object} DatasetMeta
 * @property {string[]} departments
 * @property {string[]} roles
 * @property {string[]} statuses
 * @property {string[]} locations
 */

/** @typedef {Object} AppState
 * @property {Employee[]} employees
 * @property {DatasetMeta|null} datasetMeta
 * @property {TableQuery} query
 * @property {'idle'|'loading'|'ready'|'error'} status
 * @property {string|null} error
 * @property {{ mode: 'create'|'edit', employee?: Employee }|null} modal
 * @property {string|null} deleteId
 */

export const DEFAULT_QUERY = {
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
  filters: { department: '', role: '', status: '', location: '' },
  page: 1,
  pageSize: 10,
}

export const TABLE_COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'department', label: 'Department' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'location', label: 'Location' },
  { id: 'salary', label: 'Salary', align: 'right' },
  { id: 'joinDate', label: 'Joined', align: 'right' },
]

/** @returns {{ employees: Employee[], datasetMeta: DatasetMeta|null }} */
function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { employees: [], datasetMeta: null }
    const parsed = JSON.parse(raw)
    return {
      employees: Array.isArray(parsed.employees) ? parsed.employees : [],
      datasetMeta: parsed.datasetMeta ?? null,
    }
  } catch {
    return { employees: [], datasetMeta: null }
  }
}

/** @param {Employee[]} employees @param {DatasetMeta|null} datasetMeta */
function persist(employees, datasetMeta) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ employees, datasetMeta }))
}

/** @param {Partial<Employee>} input */
export function createEmployeeId(input) {
  const base = (input.email || input.name || 'emp')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 24)
  return `emp_${base}_${Date.now().toString(36)}`
}

/** @param {AppState} state */
function rootReducer(state, action) {
  switch (action.type) {
    case 'data/loading':
      return { ...state, status: 'loading', error: null }
    case 'data/success': {
      const persisted = loadPersisted()
      const payload = /** @type {{ employees: Employee[], datasetMeta: DatasetMeta }} */ (action.payload)
      const employees = persisted.employees.length ? persisted.employees : payload.employees
      const datasetMeta = persisted.datasetMeta ?? payload.datasetMeta
      if (!persisted.employees.length) persist(employees, datasetMeta)
      return { ...state, employees, datasetMeta, status: 'ready', error: null }
    }
    case 'data/error':
      return { ...state, status: 'error', error: String(action.payload) }

    case 'employees/create': {
      const employee = /** @type {Employee} */ (action.payload)
      const employees = [...state.employees, employee]
      persist(employees, state.datasetMeta)
      return { ...state, employees, modal: null, query: { ...state.query, page: 1 } }
    }
    case 'employees/update': {
      const employee = /** @type {Employee} */ (action.payload)
      const employees = state.employees.map((e) => (e.id === employee.id ? employee : e))
      persist(employees, state.datasetMeta)
      return { ...state, employees, modal: null }
    }
    case 'employees/delete': {
      const id = /** @type {string} */ (action.payload)
      const employees = state.employees.filter((e) => e.id !== id)
      persist(employees, state.datasetMeta)
      return { ...state, employees, deleteId: null }
    }

    case 'query/setSearch':
      return { ...state, query: { ...state.query, search: String(action.payload), page: 1 } }
    case 'query/setFilter': {
      const { key, value } = /** @type {{ key: keyof TableFilters, value: string }} */ (action.payload)
      return {
        ...state,
        query: {
          ...state.query,
          filters: { ...state.query.filters, [key]: value },
          page: 1,
        },
      }
    }
    case 'query/setSort': {
      const sortBy = /** @type {import('../lib/tableQuery.js').SortableColumn} */ (action.payload)
      const sortOrder =
        state.query.sortBy === sortBy && state.query.sortOrder === 'asc' ? 'desc' : 'asc'
      return { ...state, query: { ...state.query, sortBy, sortOrder, page: 1 } }
    }
    case 'query/setPage':
      return { ...state, query: { ...state.query, page: Number(action.payload) } }
    case 'query/setPageSize':
      return { ...state, query: { ...state.query, pageSize: Number(action.payload), page: 1 } }
    case 'query/clearFilters':
      return {
        ...state,
        query: {
          ...state.query,
          search: '',
          filters: { department: '', role: '', status: '', location: '' },
          page: 1,
        },
      }

    case 'ui/openCreate':
      return { ...state, modal: { mode: 'create' } }
    case 'ui/openEdit':
      return { ...state, modal: { mode: 'edit', employee: /** @type {Employee} */ (action.payload) } }
    case 'ui/closeModal':
      return { ...state, modal: null }
    case 'ui/confirmDelete':
      return { ...state, deleteId: String(action.payload) }
    case 'ui/cancelDelete':
      return { ...state, deleteId: null }

    default:
      return state
  }
}

const initialState = /** @type {AppState} */ ({
  employees: [],
  datasetMeta: null,
  query: DEFAULT_QUERY,
  status: 'idle',
  error: null,
  modal: null,
  deleteId: null,
})

export const store = createStore(initialState, rootReducer)

/** @param {AppState} state */
export function selectTableView(state) {
  return queryEmployees(state.employees, state.query)
}

/** @param {AppState} state */
export function selectEmployeeById(state, id) {
  return state.employees.find((e) => e.id === id) ?? null
}

export { persist }
