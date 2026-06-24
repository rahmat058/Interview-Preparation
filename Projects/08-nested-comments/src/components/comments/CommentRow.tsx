import { ChevronDown, ChevronRight, MessageCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setReplyingTo, toggleExpanded, voteComment } from '@/lib/store/slices/commentsSlice'
import {
  formatRelativeTime,
  formatScore,
  getAuthorInitials,
  getDisplayScore,
} from '@/lib/utils/commentHelpers'
import { cn } from '@/lib/utils/cn'
import type { Comment } from '@/lib/types/comments'

interface CommentRowProps {
  comment: Comment
  depth: number
  hasReplies: boolean
  isExpanded: boolean
  replyCount: number
}

export function CommentRow({
  comment,
  depth,
  hasReplies,
  isExpanded,
  replyCount,
}: CommentRowProps) {
  const dispatch = useAppDispatch()
  const { replyingToId, voteOverrides } = useAppSelector((state) => state.comments)
  const displayScore = getDisplayScore(comment, voteOverrides[comment.id])
  const isReplying = replyingToId === comment.id

  return (
    <div className="group flex gap-3 py-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: comment.author.avatarColor }}
        aria-hidden
      >
        {getAuthorInitials(comment.author.username)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-slate-800">u/{comment.author.username}</span>
          <span className="text-xs text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
          {depth > 0 && (
            <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
              depth {depth}
            </span>
          )}
        </div>

        {!isExpanded && hasReplies ? (
          <button
            type="button"
            onClick={() => dispatch(toggleExpanded(comment.id))}
            className="mt-1 flex items-center gap-1 text-left text-sm text-slate-500 hover:text-orange-600"
          >
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">u/{comment.author.username}</span>
            <span className="truncate">· {comment.body.slice(0, 60)}…</span>
            <span className="shrink-0 text-orange-600">({replyCount} replies)</span>
          </button>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{comment.body}</p>
        )}

        {isExpanded && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <div className="flex items-center rounded-lg border border-orange-100 bg-white/80">
              <button
                type="button"
                onClick={() => dispatch(voteComment({ id: comment.id, delta: 1 }))}
                className="rounded-l-lg px-2 py-1 text-xs font-bold text-orange-600 hover:bg-orange-50"
                aria-label="Upvote"
              >
                ▲
              </button>
              <span className="min-w-[2ch] px-1 text-center text-xs font-semibold tabular-nums text-slate-700">
                {formatScore(displayScore)}
              </span>
              <button
                type="button"
                onClick={() => dispatch(voteComment({ id: comment.id, delta: -1 }))}
                className="rounded-r-lg px-2 py-1 text-xs font-bold text-slate-400 hover:bg-slate-50"
                aria-label="Downvote"
              >
                ▼
              </button>
            </div>

            <button
              type="button"
              onClick={() => dispatch(setReplyingTo(isReplying ? null : comment.id))}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
                isReplying
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600',
              )}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Reply
            </button>

            {hasReplies && (
              <button
                type="button"
                onClick={() => dispatch(toggleExpanded(comment.id))}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                {isExpanded ? (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-3.5 w-3.5" />
                    {replyCount} replies
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
