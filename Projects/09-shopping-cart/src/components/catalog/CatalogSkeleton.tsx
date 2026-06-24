export function CatalogSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border border-teal-100 bg-white/70 p-4">
          <div className="mb-3 h-16 rounded-xl bg-teal-100" />
          <div className="mb-2 h-3 w-20 rounded bg-teal-50" />
          <div className="mb-1 h-4 w-full rounded bg-teal-100" />
          <div className="h-3 w-4/5 rounded bg-teal-50" />
        </div>
      ))}
    </div>
  )
}
