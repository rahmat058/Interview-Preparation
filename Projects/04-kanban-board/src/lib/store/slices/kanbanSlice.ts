import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { arrayMove } from '@dnd-kit/sortable'
import { fetchKanbanBoard } from '@/api/kanbanApi'
import type { KanbanState, MoveCardPayload } from '@/lib/types/kanban'
import { findColumnById } from '@/lib/utils/kanbanHelpers'

const initialState: KanbanState = {
  meta: null,
  columns: [],
  cardsById: {},
  activeCardId: null,
  status: 'idle',
  error: null,
}

export const loadKanbanBoard = createAsyncThunk('kanban/loadBoard', async (_, { signal }) => {
  return fetchKanbanBoard(signal)
})

function applyMoveCard(state: KanbanState, payload: MoveCardPayload) {
  const { cardId, sourceColumnId, destinationColumnId, destinationIndex } = payload

  const sourceColumn = findColumnById(state.columns, sourceColumnId)
  const destinationColumn = findColumnById(state.columns, destinationColumnId)
  const card = state.cardsById[cardId]

  if (!sourceColumn || !destinationColumn || !card) return

  const sourceIndex = sourceColumn.cardIds.indexOf(cardId)
  if (sourceIndex === -1) return

  if (sourceColumnId === destinationColumnId) {
    if (sourceIndex === destinationIndex) return
    sourceColumn.cardIds = arrayMove(sourceColumn.cardIds, sourceIndex, destinationIndex)
    return
  }

  sourceColumn.cardIds.splice(sourceIndex, 1)

  let insertIndex = destinationIndex
  if (insertIndex > destinationColumn.cardIds.length) {
    insertIndex = destinationColumn.cardIds.length
  }

  destinationColumn.cardIds.splice(insertIndex, 0, cardId)
  card.columnId = destinationColumnId
  card.updatedAt = new Date().toISOString()
}

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setActiveCardId(state, action: PayloadAction<string | null>) {
      state.activeCardId = action.payload
    },
    moveCard(state, action: PayloadAction<MoveCardPayload>) {
      applyMoveCard(state, action.payload)
    },
    resetKanban(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadKanbanBoard.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadKanbanBoard.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.meta = action.payload.meta
        state.columns = action.payload.data.columns
        state.cardsById = action.payload.data.cardsById
        state.error = null
      })
      .addCase(loadKanbanBoard.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load kanban board'
      })
  },
})

export const { setActiveCardId, moveCard, resetKanban } = kanbanSlice.actions
export default kanbanSlice.reducer
