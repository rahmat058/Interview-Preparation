import { CheckCircle2, Loader2 } from 'lucide-react'

interface FeedLoadMoreProps {
  isLoading: boolean
  hasMore: boolean
}

/** Fixed-height footer — prevents layout shift / scroll jump when loading toggles */
export function FeedLoadMore({ isLoading, hasMore }: FeedLoadMoreProps) {
  if (!hasMore && !isLoading) {
    return (
      <div
        className="flex h-14 items-center justify-center gap-2 text-sm text-slate-500"
        role="status">
        <CheckCircle2 className="h-4 w-4 text-amber-500" />
        You&apos;re all caught up!
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className="flex h-14 items-center justify-center gap-3 text-sm text-slate-600"
        role="status"
        aria-live="polite"
        aria-busy="true">
        <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
        Loading more posts…
      </div>
    )
  }

  return <div className="h-14" aria-hidden />
}
