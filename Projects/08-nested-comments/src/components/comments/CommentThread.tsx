import { useAppSelector } from '@/lib/store/hooks'
import { selectSortedThreads } from '@/lib/store/slices/commentsSlice'
import { CommentNode } from '@/components/comments/CommentNode'

export function CommentThread() {
  const threads = useAppSelector(selectSortedThreads)

  if (threads.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">No comments yet. Be the first to reply.</p>
    )
  }

  return (
    <div className="divide-y divide-orange-100/60">
      {threads.map((comment) => (
        <CommentNode key={comment.id} comment={comment} depth={0} />
      ))}
    </div>
  )
}
