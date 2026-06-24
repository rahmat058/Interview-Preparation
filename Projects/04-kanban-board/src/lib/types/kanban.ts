export type CardPriority = 'low' | 'medium' | 'high'

export interface KanbanAssignee {
  id: string
  name: string
  color: string
}

export interface KanbanCard {
  id: string
  columnId: string
  title: string
  description: string
  priority: CardPriority
  assigneeId: string
  assigneeName: string
  assigneeColor: string
  labels: string[]
  storyPoints: number
  createdAt: string
  updatedAt: string
}

export interface KanbanColumn {
  id: string
  title: string
  accent: string
  cardIds: string[]
}

export interface KanbanBoardMeta {
  schemaVersion: string
  collection: string
  boardId: string
  boardTitle: string
  columnCount: number
  cardCount: number
  generatedAt: string
}

export interface KanbanBoardData {
  columns: KanbanColumn[]
  cardsById: Record<string, KanbanCard>
}

export interface KanbanBoardResponse {
  meta: KanbanBoardMeta
  data: KanbanBoardData
}

export type KanbanStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface KanbanState {
  meta: KanbanBoardMeta | null
  columns: KanbanColumn[]
  cardsById: Record<string, KanbanCard>
  activeCardId: string | null
  status: KanbanStatus
  error: string | null
}

export interface MoveCardPayload {
  cardId: string
  sourceColumnId: string
  destinationColumnId: string
  destinationIndex: number
}
