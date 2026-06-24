export function CommentSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-orange-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 rounded bg-orange-100" />
            <div className="h-3 w-full rounded bg-orange-50" />
            <div className="h-3 w-4/5 rounded bg-orange-50" />
          </div>
        </div>
      ))}
    </div>
  )
}
