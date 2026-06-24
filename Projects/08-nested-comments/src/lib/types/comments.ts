export interface CommentAuthor {
  id: string
  username: string
  avatarColor: string
}

export interface Comment {
  id: string
  parentId: string | null
  postId: string
  author: CommentAuthor
  body: string
  score: number
  createdAt: string
  replyCount: number
  replies?: Comment[]
}

export interface Post {
  id: string
  title: string
  subreddit: string
  author: CommentAuthor
  body: string
  score: number
  commentCount: number
  createdAt: string
}

export interface CommentsMeta {
  schemaVersion: string
  collection: string
  postId: string
  totalComments: number
  topLevelCount: number
  maxDepth: number
  generatedAt: string
}

export interface CommentsResponse {
  meta: CommentsMeta
  post: Post
  data: Comment[]
}

export type CommentsStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type CommentSort = 'top' | 'new'

export interface CommentsState {
  post: Post | null
  meta: CommentsMeta | null
  threads: Comment[]
  expandedIds: Record<string, boolean>
  replyingToId: string | null
  sortBy: CommentSort
  voteOverrides: Record<string, number>
  status: CommentsStatus
  error: string | null
}

export interface NewReplyInput {
  parentId: string
  body: string
  author: CommentAuthor
}
