import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { KanbanCardContent } from '@/components/kanban/KanbanCardContent'
import type { KanbanCard as KanbanCardType } from '@/lib/types/kanban'

interface KanbanCardProps {
  card: KanbanCardType
}

export function KanbanCard({ card }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: 'card', columnId: card.columnId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <KanbanCardContent
        card={card}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

export function KanbanCardOverlay({ card }: KanbanCardProps) {
  return <KanbanCardContent card={card} isOverlay dragHandleProps={{ tabIndex: -1 }} />
}
