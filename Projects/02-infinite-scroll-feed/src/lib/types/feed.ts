export interface FeedPost {
  id: string
  authorId: string
  authorName: string
  authorUsername: string
  authorAvatarUrl: string | null
  authorDepartment: string
  content: string
  excerpt: string
  imageUrl: string | null
  category: string
  tags: string[]
  likesCount: number
  commentsCount: number
  sharesCount: number
  isPublished: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface FeedQueryParams {
  page?: number
  limit?: number
}

export interface FeedResponseMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
  tookMs: number
}

export interface FeedResponse {
  data: FeedPost[]
  meta: FeedResponseMeta
}

export type FeedStatus = 'idle' | 'loading' | 'loadingMore' | 'succeeded' | 'failed'

export interface FeedState {
  posts: FeedPost[]
  page: number
  limit: number
  meta: FeedResponseMeta | null
  status: FeedStatus
  error: string | null
}
