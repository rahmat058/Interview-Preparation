import type { KanbanCard, KanbanColumn } from '@/lib/types/kanban'

export function findColumnByCardId(columns: KanbanColumn[], cardId: string): KanbanColumn | undefined {
  return columns.find((column) => column.cardIds.includes(cardId))
}

export function findColumnById(columns: KanbanColumn[], columnId: string): KanbanColumn | undefined {
  return columns.find((column) => column.id === columnId)
}

export function resolveDropColumnId(
  columns: KanbanColumn[],
  overId: string,
): { columnId: string; index: number } | null {
  const directColumn = findColumnById(columns, overId)
  if (directColumn) {
    return { columnId: directColumn.id, index: directColumn.cardIds.length }
  }

  const parentColumn = findColumnByCardId(columns, overId)
  if (!parentColumn) return null

  const index = parentColumn.cardIds.indexOf(overId)
  return { columnId: parentColumn.id, index: index === -1 ? parentColumn.cardIds.length : index }
}

export function getCardCount(columns: KanbanColumn[]): number {
  return columns.reduce((sum, column) => sum + column.cardIds.length, 0)
}

export function getPriorityStyles(priority: KanbanCard['priority']) {
  switch (priority) {
    case 'high':
      return { badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' }
    case 'medium':
      return { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' }
    default:
      return { badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' }
  }
}

export function getColumnAccent(accent: string) {
  switch (accent) {
    case 'violet':
      return { header: 'from-violet-500 to-purple-500', ring: 'ring-violet-200', bg: 'bg-violet-50/50' }
    case 'fuchsia':
      return { header: 'from-fuchsia-500 to-pink-500', ring: 'ring-fuchsia-200', bg: 'bg-fuchsia-50/50' }
    case 'emerald':
      return { header: 'from-emerald-500 to-teal-500', ring: 'ring-emerald-200', bg: 'bg-emerald-50/50' }
    default:
      return { header: 'from-slate-500 to-slate-600', ring: 'ring-slate-200', bg: 'bg-slate-50/50' }
  }
}
