import { GripVertical, Hash } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { getPriorityStyles } from '@/lib/utils/kanbanHelpers'
import type { KanbanCard as KanbanCardType } from '@/lib/types/kanban'

interface KanbanCardContentProps {
  card: KanbanCardType
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  isDragging?: boolean
  isOverlay?: boolean
}

export function KanbanCardContent({
  card,
  dragHandleProps,
  isDragging = false,
  isOverlay = false,
}: KanbanCardContentProps) {
  const priorityStyles = getPriorityStyles(card.priority)

  return (
    <article
      className={cn(
        'glass-card group rounded-xl border border-white/70 p-3.5 shadow-sm transition-shadow',
        isDragging && !isOverlay && 'opacity-40',
        isOverlay && 'scale-[1.02] rotate-1 shadow-xl ring-2 ring-violet-300/60',
        !isOverlay && 'hover:shadow-md',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm leading-snug font-semibold text-slate-800">{card.title}</h4>
        <button
          type="button"
          className={cn(
            'shrink-0 rounded-md p-0.5 text-slate-300 outline-none hover:bg-violet-50 hover:text-violet-500',
            isOverlay ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing',
          )}
          aria-label={`Drag ${card.title}`}
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-slate-500">{card.description}</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {card.labels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-violet-100/80 px-2 py-0.5 text-[10px] font-medium text-violet-700 uppercase"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
            priorityStyles.badge,
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', priorityStyles.dot)} />
          {card.priority}
        </span>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-slate-400">
            <Hash className="h-3 w-3" />
            {card.storyPoints}
          </span>
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: card.assigneeColor }}
            title={card.assigneeName}
          >
            {card.assigneeName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
        </div>
      </div>
    </article>
  )
}
