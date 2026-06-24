import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, MessageSquare, MessagesSquare } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { loadComments } from '@/lib/store/slices/commentsSlice'
import { CommentToolbar } from '@/components/comments/CommentToolbar'
import { CommentThread } from '@/components/comments/CommentThread'
import { PostCard } from '@/components/comments/PostCard'
import { CommentSkeleton } from '@/components/comments/CommentSkeleton'
import { CommentError } from '@/components/comments/CommentError'

const TIPS = [
  { icon: GitBranch, text: 'Recursive CommentNode' },
  { icon: MessagesSquare, text: 'Expand / collapse threads' },
  { icon: MessageSquare, text: 'Inline reply + tree insert' },
]

export function CommentsApp() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.comments)

  useEffect(() => {
    const promise = dispatch(loadComments())
    return () => {
      promise.abort()
    }
  }, [dispatch])

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-gradient-to-r from-orange-600 via-orange-500 to-rose-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Nested Comments
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 sm:text-base">
          Reddit-style threads with recursive rendering, inline replies, and expand/collapse.
        </p>
      </motion.div>

      {status === 'loading' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
          <div className="glass-card p-5 sm:p-6">
            <CommentSkeleton />
          </div>
        </motion.div>
      )}

      {status === 'failed' && error && (
        <div className="mt-8">
          <CommentError message={error} onRetry={() => dispatch(loadComments())} />
        </div>
      )}

      {status === 'succeeded' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-8"
        >
          <PostCard />

          <section className="glass-card p-5 sm:p-6" aria-label="Comment thread">
            <CommentToolbar />
            <div className="mt-4">
              <CommentThread />
            </div>
          </section>
        </motion.div>
      )}

      <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5 text-orange-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  )
}
