export function FeedCardSkeleton() {
  return (
    <div className="glass-card animate-pulse overflow-hidden p-0" aria-hidden>
      <div className="flex items-start gap-3 p-5">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-3 w-24 rounded bg-slate-100" />
        </div>
        <div className="h-5 w-14 rounded bg-slate-100" />
      </div>
      <div className="space-y-2 px-5 pb-5">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="flex gap-6 border-t border-slate-100 px-5 py-3">
        <div className="h-4 w-12 rounded bg-slate-100" />
        <div className="h-4 w-12 rounded bg-slate-100" />
        <div className="h-4 w-12 rounded bg-slate-100" />
      </div>
    </div>
  )
}

export function FeedSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-label="Loading feed" role="status">
      {Array.from({ length: count }, (_, i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </div>
  )
}
