import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from '@/components/kanban/KanbanCard'
import { cn } from '@/lib/utils/cn'
import { getColumnAccent } from '@/lib/utils/kanbanHelpers'
import type { KanbanCard as KanbanCardType, KanbanColumn } from '@/lib/types/kanban'

interface KanbanColumnProps {
  column: KanbanColumn
  cards: KanbanCardType[]
}

export function KanbanColumnView({ column, cards }: KanbanColumnProps) {
  const accent = getColumnAccent(column.accent)
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  })

  return (
    <section
      className={cn(
        'glass-card flex min-h-[28rem] w-[min(100%,18rem)] shrink-0 flex-col overflow-hidden sm:w-72',
        accent.bg,
        isOver && 'ring-2 ring-violet-300/70',
      )}
    >
      <header className="border-b border-white/60 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full bg-gradient-to-r', accent.header)} />
            <h3 className="text-sm font-semibold text-slate-800">{column.title}</h3>
          </div>
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-500 tabular-nums">
            {column.cardIds.length}
          </span>
        </div>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          'kanban-scroll flex flex-1 flex-col gap-3 overflow-y-auto p-3',
          isOver && accent.ring,
        )}
      >
        <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200/80 bg-white/40 px-4 py-8 text-center text-xs text-slate-400">
            Drop cards here
          </div>
        )}
      </div>
    </section>
  )
}
