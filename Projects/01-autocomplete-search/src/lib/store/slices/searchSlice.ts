import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { searchItems } from '@/api/searchApi'
import type { EntityType, SearchIndexItem, SearchState } from '@/lib/types/search'

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

const initialState: SearchState = {
  query: '',
  debouncedQuery: '',
  results: [],
  meta: null,
  status: 'idle',
  error: null,
  isDropdownOpen: false,
  highlightedIndex: -1,
  selectedItem: null,
  entityTypeFilter: 'all',
}

export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async (query: string, { getState, signal }) => {
    const state = getState() as { search: SearchState }
    const entityType = state.search.entityTypeFilter

    if (query.trim().length < MIN_QUERY_LENGTH) {
      return {
        data: [] as SearchIndexItem[],
        meta: {
          query,
          total: 0,
          limit: 8,
          offset: 0,
          tookMs: 0,
          hasMore: false,
        },
      }
    }

    return searchItems({ q: query, limit: 8, entityType }, signal)
  },
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      const newQuery = action.payload

      if (state.selectedItem && newQuery !== state.selectedItem.title) {
        state.selectedItem = null
      }

      state.query = newQuery
      state.isDropdownOpen =
        newQuery.length > 0 && !(state.selectedItem && newQuery === state.selectedItem.title)

      if (newQuery.length === 0) {
        state.results = []
        state.meta = null
        state.status = 'idle'
        state.highlightedIndex = -1
        state.error = null
      }
    },
    setDebouncedQuery(state, action: PayloadAction<string>) {
      state.debouncedQuery = action.payload
    },
    setEntityTypeFilter(state, action: PayloadAction<EntityType | 'all'>) {
      state.entityTypeFilter = action.payload
    },
    openDropdown(state) {
      if (state.query.length === 0) return
      if (state.selectedItem && state.query === state.selectedItem.title) return
      state.isDropdownOpen = true
    },
    closeDropdown(state) {
      state.isDropdownOpen = false
      state.highlightedIndex = -1
    },
    setHighlightedIndex(state, action: PayloadAction<number>) {
      const max = state.results.length - 1
      if (max < 0) {
        state.highlightedIndex = -1
        return
      }
      state.highlightedIndex = Math.max(-1, Math.min(action.payload, max))
    },
    moveHighlightUp(state) {
      if (state.results.length === 0) return
      if (state.highlightedIndex <= 0) {
        state.highlightedIndex = state.results.length - 1
      } else {
        state.highlightedIndex -= 1
      }
    },
    moveHighlightDown(state) {
      if (state.results.length === 0) return
      if (state.highlightedIndex >= state.results.length - 1) {
        state.highlightedIndex = 0
      } else {
        state.highlightedIndex += 1
      }
    },
    selectHighlighted(state) {
      if (state.highlightedIndex >= 0 && state.results[state.highlightedIndex]) {
        state.selectedItem = state.results[state.highlightedIndex]
        state.query = state.selectedItem.title
        state.isDropdownOpen = false
        state.highlightedIndex = -1
        state.results = []
        state.meta = null
      }
    },
    selectItem(state, action: PayloadAction<SearchIndexItem>) {
      state.selectedItem = action.payload
      state.query = action.payload.title
      state.isDropdownOpen = false
      state.highlightedIndex = -1
      state.results = []
      state.meta = null
    },
    clearSelection(state) {
      state.selectedItem = null
      state.query = ''
      state.debouncedQuery = ''
      state.results = []
      state.meta = null
      state.status = 'idle'
      state.highlightedIndex = -1
      state.isDropdownOpen = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        if (state.debouncedQuery.trim().length >= MIN_QUERY_LENGTH) {
          state.status = 'loading'
          state.error = null
        }
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.results = action.payload.data
        state.meta = action.payload.meta
        state.highlightedIndex = action.payload.data.length > 0 ? 0 : -1
        state.error = null

        // Keep dropdown closed when viewing a committed selection
        if (state.selectedItem && state.query === state.selectedItem.title) {
          state.isDropdownOpen = false
        }
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.status = 'failed'
        state.error = action.error.message ?? 'Search failed'
        state.results = []
        state.meta = null
        state.highlightedIndex = -1
      })
  },
})

export const {
  setQuery,
  setDebouncedQuery,
  setEntityTypeFilter,
  openDropdown,
  closeDropdown,
  setHighlightedIndex,
  moveHighlightUp,
  moveHighlightDown,
  selectHighlighted,
  selectItem,
  clearSelection,
} = searchSlice.actions

export { DEBOUNCE_MS, MIN_QUERY_LENGTH }
export default searchSlice.reducer
