import { useCallback } from 'react'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { moveCard, setActiveCardId } from '@/lib/store/slices/kanbanSlice'
import {
  findColumnByCardId,
  resolveDropColumnId,
} from '@/lib/utils/kanbanHelpers'

export function useKanbanDragDrop() {
  const dispatch = useAppDispatch()
  const columns = useAppSelector((state) => state.kanban.columns)

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      dispatch(setActiveCardId(String(event.active.id)))
    },
    [dispatch],
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = String(active.id)
      const overId = String(over.id)

      const sourceColumn = findColumnByCardId(columns, activeId)
      const dropTarget = resolveDropColumnId(columns, overId)

      if (!sourceColumn || !dropTarget) return

      const { columnId: destinationColumnId, index: destinationIndex } = dropTarget

      if (sourceColumn.id === destinationColumnId) return

      dispatch(
        moveCard({
          cardId: activeId,
          sourceColumnId: sourceColumn.id,
          destinationColumnId,
          destinationIndex,
        }),
      )
    },
    [columns, dispatch],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      dispatch(setActiveCardId(null))

      if (!over) return

      const activeId = String(active.id)
      const overId = String(over.id)

      const sourceColumn = findColumnByCardId(columns, activeId)
      const dropTarget = resolveDropColumnId(columns, overId)

      if (!sourceColumn || !dropTarget) return

      const { columnId: destinationColumnId, index: rawIndex } = dropTarget

      if (sourceColumn.id !== destinationColumnId) return

      const activeIndex = sourceColumn.cardIds.indexOf(activeId)
      let destinationIndex = rawIndex

      if (activeIndex < rawIndex) {
        destinationIndex = rawIndex - 1
      }

      if (activeIndex === destinationIndex) return

      dispatch(
        moveCard({
          cardId: activeId,
          sourceColumnId: sourceColumn.id,
          destinationColumnId,
          destinationIndex,
        }),
      )
    },
    [columns, dispatch],
  )

  const handleDragCancel = useCallback(() => {
    dispatch(setActiveCardId(null))
  }, [dispatch])

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  }
}
