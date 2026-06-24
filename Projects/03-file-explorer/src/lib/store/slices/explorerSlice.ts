import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchFileTree } from '@/api/explorerApi'
import type { ExplorerState } from '@/lib/types/explorer'
import { collectFolderPaths } from '@/lib/utils/treeHelpers'

const DEFAULT_EXPANDED = ['/react-interview-prep', '/react-interview-prep/src', '/react-interview-prep/src/components']

const initialState: ExplorerState = {
  tree: null,
  meta: null,
  expandedPaths: {},
  selectedPath: null,
  filterQuery: '',
  status: 'idle',
  error: null,
}

export const loadFileTree = createAsyncThunk('explorer/loadTree', async (_, { signal }) => {
  return fetchFileTree(signal)
})

const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    toggleExpanded(state, action: PayloadAction<string>) {
      const path = action.payload
      state.expandedPaths[path] = !state.expandedPaths[path]
    },
    setExpanded(state, action: PayloadAction<{ path: string; expanded: boolean }>) {
      state.expandedPaths[action.payload.path] = action.payload.expanded
    },
    expandAll(state) {
      if (!state.tree) return
      for (const path of collectFolderPaths(state.tree)) {
        state.expandedPaths[path] = true
      }
    },
    collapseAll(state) {
      state.expandedPaths = state.tree ? { [state.tree.path]: true } : {}
    },
    setSelectedPath(state, action: PayloadAction<string | null>) {
      state.selectedPath = action.payload
    },
    setFilterQuery(state, action: PayloadAction<string>) {
      state.filterQuery = action.payload
    },
    resetExplorer(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFileTree.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadFileTree.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.tree = action.payload.data
        state.meta = action.payload.meta
        state.error = null

        const expanded: Record<string, boolean> = {}
        for (const path of DEFAULT_EXPANDED) {
          expanded[path] = true
        }
        expanded[action.payload.data.path] = true
        state.expandedPaths = expanded
        state.selectedPath = action.payload.data.path
      })
      .addCase(loadFileTree.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load file tree'
      })
  },
})

export const {
  toggleExpanded,
  setExpanded,
  expandAll,
  collapseAll,
  setSelectedPath,
  setFilterQuery,
  resetExplorer,
} = explorerSlice.actions

export default explorerSlice.reducer
