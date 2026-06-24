import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMemo } from 'react'
import { KanbanColumnView } from '@/components/kanban/KanbanColumn'
import { KanbanCardOverlay } from '@/components/kanban/KanbanCard'
import { useKanbanDragDrop } from '@/hooks/useKanbanDragDrop'
import { useAppSelector } from '@/lib/store/hooks'

export function KanbanBoard() {
  const { columns, cardsById, activeCardId } = useAppSelector((state) => state.kanban)
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel } = useKanbanDragDrop()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const activeCard = activeCardId ? cardsById[activeCardId] : null

  const columnsWithCards = useMemo(
    () =>
      columns.map((column) => ({
        column,
        cards: column.cardIds
          .map((id) => cardsById[id])
          .filter((card): card is NonNullable<typeof card> => Boolean(card)),
      })),
    [columns, cardsById],
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="kanban-scroll flex gap-4 overflow-x-auto pb-2">
        {columnsWithCards.map(({ column, cards }) => (
          <KanbanColumnView key={column.id} column={column} cards={cards} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeCard ? <KanbanCardOverlay card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
