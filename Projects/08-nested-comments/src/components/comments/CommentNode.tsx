import { AnimatePresence, motion } from 'framer-motion'
import { useAppSelector } from '@/lib/store/hooks'
import { countDescendants } from '@/lib/utils/commentTree'
import { cn } from '@/lib/utils/cn'
import type { Comment } from '@/lib/types/comments'
import { CommentRow } from '@/components/comments/CommentRow'
import { CommentReplyForm } from '@/components/comments/CommentReplyForm'

interface CommentNodeProps {
  comment: Comment
  depth: number
}

/**
 * Recursive comment node — renders one row, then maps replies to itself when expanded.
 * Same self-similar tree pattern as File Explorer TreeNode (Project #3).
 */
export function CommentNode({ comment, depth }: CommentNodeProps) {
  const { expandedIds, replyingToId } = useAppSelector((state) => state.comments)

  const replies = comment.replies ?? []
  const hasReplies = replies.length > 0
  const isExpanded = expandedIds[comment.id] ?? false
  const replyCount = comment.replyCount || countDescendants(comment)
  const showReplyForm = replyingToId === comment.id

  return (
    <article aria-label={`Comment by ${comment.author.username}`}>
      <CommentRow
        comment={comment}
        depth={depth}
        hasReplies={hasReplies}
        isExpanded={isExpanded || !hasReplies}
        replyCount={replyCount}
      />

      <AnimatePresence>
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            <CommentReplyForm parentId={comment.id} depth={depth} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {hasReplies && isExpanded && (
          <motion.div
            key={`${comment.id}-replies`}
            role="group"
            aria-label="Replies"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className={cn('overflow-hidden border-l-2 border-orange-200/70', depth > 0 ? 'ml-6' : 'ml-4')}
          >
            {replies.map((child) => (
              <CommentNode key={child.id} comment={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
