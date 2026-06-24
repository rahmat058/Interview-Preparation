export function BoardSkeleton() {
  return (
    <div className="kanban-scroll flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 4 }).map((_, columnIndex) => (
        <div key={columnIndex} className="glass-card w-72 shrink-0 p-4">
          <div className="mb-4 h-5 w-24 animate-pulse rounded-lg bg-violet-100" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((__, cardIndex) => (
              <div key={cardIndex} className="h-28 animate-pulse rounded-xl bg-violet-50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
