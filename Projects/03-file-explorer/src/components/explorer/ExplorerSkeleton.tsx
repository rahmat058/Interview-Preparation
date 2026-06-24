export function ExplorerSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="glass-card p-5 sm:p-6">
        <div className="mb-4 h-10 animate-pulse rounded-xl bg-emerald-100/60" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-8 animate-pulse rounded-lg bg-emerald-50"
              style={{ marginLeft: `${(index % 3) * 16}px` }}
            />
          ))}
        </div>
      </div>
      <div className="glass-card min-h-[20rem] animate-pulse bg-emerald-50/40 p-6" />
    </div>
  )
}
