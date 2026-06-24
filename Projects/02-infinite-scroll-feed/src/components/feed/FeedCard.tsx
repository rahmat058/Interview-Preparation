import { memo } from "react";
import { motion } from "framer-motion";
import type { FeedPost } from "@/lib/types/feed";
import { formatCount, formatRelativeTime } from "@/lib/utils/helpers";
import { cn } from "@/lib/utils/cn";
import { Heart, MessageCircle, Pin, Share2, User } from "lucide-react";

interface FeedCardProps {
  post: FeedPost;
  isNew: boolean;
  staggerIndex: number;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

export const FeedCard = memo(function FeedCard({
  post,
  isNew,
  staggerIndex,
}: FeedCardProps) {
  return (
    <motion.article
      layout={false}
      initial={isNew ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        isNew
          ? {
              duration: 0.45,
              delay: Math.min(staggerIndex * 0.055, 0.33),
              ease: EASE,
            }
          : { duration: 0 }
      }
      className={cn(
        "glass-card overflow-hidden p-0",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-orange-500/10",
      )}
      data-testid="feed-card"
    >
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-100 to-rose-100">
          <User className="h-5 w-5 text-rose-600" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-800">{post.authorName}</h3>
            <span className="text-sm text-slate-400">
              @{post.authorUsername}
            </span>
            {post.isPinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {post.authorDepartment} · {formatRelativeTime(post.createdAt)}
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
          {post.category}
        </span>
      </div>

      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed text-slate-700">{post.content}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {post.imageUrl && (
        <div className="aspect-2/1 overflow-hidden border-t border-slate-100/80 bg-slate-100">
          <img
            src={post.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-6 border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
        <Stat icon={Heart} value={post.likesCount} label="likes" />
        <Stat
          icon={MessageCircle}
          value={post.commentsCount}
          label="comments"
        />
        <Stat icon={Share2} value={post.sharesCount} label="shares" />
      </div>
    </motion.article>
  );
});

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Heart;
  value: number;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 transition-colors hover:text-rose-600">
      <Icon className="h-4 w-4" />
      <span className="font-medium">{formatCount(value)}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
