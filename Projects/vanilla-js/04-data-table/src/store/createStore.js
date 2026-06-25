/**
 * @template S
 * @param {S} initialState
 * @param {(state: S, action: { type: string, payload?: unknown }) => S} reducer
 */
export function createStore(initialState, reducer) {
  let state = initialState
  /** @type {Set<(state: S) => void>} */
  const listeners = new Set()

  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action)
      listeners.forEach((listener) => listener(state))
      return action
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
