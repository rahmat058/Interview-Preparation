import type { Comment, CommentSort } from '@/lib/types/comments'

export function countDescendants(comment: Comment): number {
  if (!comment.replies?.length) return 0
  return comment.replies.reduce(
    (sum, child) => sum + 1 + countDescendants(child),
    0,
  )
}

export function collectBranchIds(comment: Comment): string[] {
  const ids = [comment.id]
  for (const child of comment.replies ?? []) {
    ids.push(...collectBranchIds(child))
  }
  return ids
}

export function collectIdsWithReplies(comments: Comment[]): string[] {
  const ids: string[] = []
  for (const comment of comments) {
    if (comment.replies?.length) {
      ids.push(comment.id, ...collectIdsWithReplies(comment.replies))
    }
  }
  return ids
}

export function findCommentById(comments: Comment[], id: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === id) return comment
    if (comment.replies?.length) {
      const found = findCommentById(comment.replies, id)
      if (found) return found
    }
  }
  return null
}

export function addReplyToTree(
  comments: Comment[],
  parentId: string,
  reply: Comment,
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      const replies = [...(comment.replies ?? []), reply]
      return {
        ...comment,
        replies,
        replyCount: countDescendants({ ...comment, replies }),
      }
    }

    if (comment.replies?.length) {
      const nextReplies = addReplyToTree(comment.replies, parentId, reply)
      if (nextReplies !== comment.replies) {
        return {
          ...comment,
          replies: nextReplies,
          replyCount: countDescendants({ ...comment, replies: nextReplies }),
        }
      }
    }

    return comment
  })
}

export function sortTopLevelComments(comments: Comment[], sortBy: CommentSort): Comment[] {
  const sorted = [...comments]
  if (sortBy === 'top') {
    sorted.sort((a, b) => b.score - a.score)
  } else {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return sorted
}

export function buildDefaultExpanded(comments: Comment[], maxDepth = 2): Record<string, boolean> {
  const expanded: Record<string, boolean> = {}

  function walk(nodes: Comment[], depth: number) {
    for (const node of nodes) {
      if (node.replies?.length) {
        expanded[node.id] = depth < maxDepth
        walk(node.replies, depth + 1)
      }
    }
  }

  walk(comments, 0)
  return expanded
}

/** Flat list → nested tree (interview utility — mirrors production DB shape) */
export function buildCommentTree(flat: Comment[]): Comment[] {
  const map = new Map<string, Comment>()
  const roots: Comment[] = []

  for (const item of flat) {
    map.set(item.id, { ...item, replies: [] })
  }

  for (const item of flat) {
    const node = map.get(item.id)!
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.replies!.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}
