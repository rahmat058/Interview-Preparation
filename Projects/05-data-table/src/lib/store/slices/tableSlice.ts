import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchDatasetMeta, fetchTableData } from '@/api/tableApi'
import type { SortableColumn, SortOrder, TableFilters, TableState } from '@/lib/types/table'
import { DEFAULT_QUERY } from '@/lib/types/table'

const initialState: TableState = {
  rows: [],
  resultMeta: null,
  datasetMeta: null,
  query: DEFAULT_QUERY,
  status: 'idle',
  error: null,
}

export const loadTableData = createAsyncThunk('table/loadData', async (_, { getState, signal }) => {
  const { table } = getState() as { table: TableState }
  return fetchTableData(table.query, signal)
})

export const loadDatasetMeta = createAsyncThunk('table/loadMeta', async (_, { signal }) => {
  return fetchDatasetMeta(signal)
})

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.query.search = action.payload
      state.query.page = 1
    },
    setSort(state, action: PayloadAction<{ sortBy: SortableColumn; sortOrder: SortOrder }>) {
      state.query.sortBy = action.payload.sortBy
      state.query.sortOrder = action.payload.sortOrder
      state.query.page = 1
    },
    toggleSort(state, action: PayloadAction<SortableColumn>) {
      const column = action.payload
      if (state.query.sortBy === column) {
        state.query.sortOrder = state.query.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        state.query.sortBy = column
        state.query.sortOrder = 'asc'
      }
      state.query.page = 1
    },
    setFilter(state, action: PayloadAction<{ key: keyof TableFilters; value: string }>) {
      state.query.filters[action.payload.key] = action.payload.value
      state.query.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.query.page = action.payload
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.query.pageSize = action.payload
      state.query.page = 1
    },
    resetFilters(state) {
      state.query.filters = { ...DEFAULT_QUERY.filters }
      state.query.search = ''
      state.query.page = 1
    },
    resetTable(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTableData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadTableData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.rows = action.payload.data
        state.resultMeta = action.payload.meta
        state.query.page = action.payload.meta.page
        state.error = null
      })
      .addCase(loadTableData.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load table data'
      })
      .addCase(loadDatasetMeta.fulfilled, (state, action) => {
        state.datasetMeta = action.payload
      })
  },
})

export const {
  setSearch,
  setSort,
  toggleSort,
  setFilter,
  setPage,
  setPageSize,
  resetFilters,
  resetTable,
} = tableSlice.actions

export default tableSlice.reducer
