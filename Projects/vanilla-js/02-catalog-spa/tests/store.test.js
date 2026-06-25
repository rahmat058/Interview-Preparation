import { describe, expect, it } from 'vitest'
import { createStore } from '../src/store/createStore.js'

describe('createStore', () => {
  it('updates state via reducer', () => {
    const store = createStore({ count: 0 }, (state, action) => {
      if (action.type === 'inc') return { count: state.count + 1 }
      return state
    })
    store.dispatch({ type: 'inc' })
    expect(store.getState().count).toBe(1)
  })

  it('notifies subscribers', () => {
    const store = createStore({ n: 1 }, (s) => s)
    let seen = 0
    store.subscribe((state) => { seen = state.n })
    store.dispatch({ type: 'noop' })
    expect(seen).toBe(1)
  })
})
