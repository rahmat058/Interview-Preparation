import commentsData from '@/data/comments.json'
import type { CommentsResponse } from '@/lib/types/comments'

export function getMockComments(): CommentsResponse {
  return commentsData as CommentsResponse
}
