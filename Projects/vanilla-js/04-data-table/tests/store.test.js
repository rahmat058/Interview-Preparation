import { describe, expect, it } from 'vitest'
import { createStore } from '../src/store/createStore.js'
import { DEFAULT_QUERY } from '../src/store/index.js'

function tableReducer(state, action) {
  switch (action.type) {
    case 'employees/create':
      return { ...state, employees: [...state.employees, action.payload] }
    case 'employees/update':
      return {
        ...state,
        employees: state.employees.map((e) =>
          e.id === action.payload.id ? action.payload : e,
        ),
      }
    case 'employees/delete':
      return {
        ...state,
        employees: state.employees.filter((e) => e.id !== action.payload),
      }
    default:
      return state
  }
}

const seed = {
  id: 'emp_1',
  name: 'Test User',
  email: 'test@co.io',
  department: 'Engineering',
  role: 'Junior',
  status: 'active',
  location: 'Remote',
  salary: 50000,
  joinDate: '2024-01-01',
  performanceScore: 70,
}

describe('CRUD store actions', () => {
  it('creates an employee', () => {
    const store = createStore({ employees: [], query: DEFAULT_QUERY }, tableReducer)
    store.dispatch({ type: 'employees/create', payload: seed })
    expect(store.getState().employees).toHaveLength(1)
  })

  it('updates an employee', () => {
    const store = createStore({ employees: [seed], query: DEFAULT_QUERY }, tableReducer)
    store.dispatch({ type: 'employees/update', payload: { ...seed, name: 'Updated' } })
    expect(store.getState().employees[0].name).toBe('Updated')
  })

  it('deletes an employee', () => {
    const store = createStore({ employees: [seed], query: DEFAULT_QUERY }, tableReducer)
    store.dispatch({ type: 'employees/delete', payload: seed.id })
    expect(store.getState().employees).toHaveLength(0)
  })
})
