import kanbanPayload from '@/data/kanban-board.json'
import type { KanbanBoardResponse } from '@/lib/types/kanban'

const typedPayload = kanbanPayload as KanbanBoardResponse

export function getMockKanbanBoard(): KanbanBoardResponse {
  return typedPayload
}
