import { useAppSelector } from '@/lib/store/hooks'
import { formatRelativeTime, formatScore, getAuthorInitials } from '@/lib/utils/commentHelpers'

export function PostCard() {
  const post = useAppSelector((state) => state.comments.post)
  if (!post) return null

  return (
    <article className="glass-card mb-6 p-5 sm:p-6">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-orange-600">{post.subreddit}</span>
        <span>·</span>
        <span>Posted by u/{post.author.username}</span>
        <span>·</span>
        <time>{formatRelativeTime(post.createdAt)}</time>
      </div>
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{post.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{post.body}</p>
      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: post.author.avatarColor }}
          >
            {getAuthorInitials(post.author.username)}
          </span>
          ▲ {formatScore(post.score)}
        </span>
        <span>{post.commentCount} comments</span>
      </div>
    </article>
  )
}
