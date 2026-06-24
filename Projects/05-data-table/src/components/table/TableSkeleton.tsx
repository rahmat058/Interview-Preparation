export function TableSkeleton() {
  return (
    <div className="glass-card p-5 sm:p-6">
      <div className="mb-4 h-10 max-w-md animate-pulse rounded-xl bg-blue-100/60" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-blue-50" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-blue-50/80" />
        ))}
      </div>
    </div>
  )
}
