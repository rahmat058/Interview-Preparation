import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchComments, postReply } from '@/api/commentsApi'
import type { Comment, CommentsState } from '@/lib/types/comments'
import {
  addReplyToTree,
  buildDefaultExpanded,
  collectBranchIds,
  collectIdsWithReplies,
  sortTopLevelComments,
} from '@/lib/utils/commentTree'

const CURRENT_USER: Comment['author'] = {
  id: 'usr_you',
  username: 'you',
  avatarColor: '#ea580c',
}

const initialState: CommentsState = {
  post: null,
  meta: null,
  threads: [],
  expandedIds: {},
  replyingToId: null,
  sortBy: 'top',
  voteOverrides: {},
  status: 'idle',
  error: null,
}

export const loadComments = createAsyncThunk('comments/load', async (_, { signal }) => {
  return fetchComments(signal)
})

export const submitReply = createAsyncThunk(
  'comments/submitReply',
  async ({ parentId, body }: { parentId: string; body: string }, { signal }) => {
    const result = await postReply(parentId, body, signal)
    return { parentId, body, id: result.id }
  },
)

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    toggleExpanded(state, action: PayloadAction<string>) {
      const id = action.payload
      state.expandedIds[id] = !state.expandedIds[id]
    },
    setExpanded(state, action: PayloadAction<{ id: string; expanded: boolean }>) {
      state.expandedIds[action.payload.id] = action.payload.expanded
    },
    expandAll(state) {
      for (const id of collectIdsWithReplies(state.threads)) {
        state.expandedIds[id] = true
      }
    },
    collapseAll(state) {
      for (const id of collectIdsWithReplies(state.threads)) {
        state.expandedIds[id] = false
      }
    },
    setReplyingTo(state, action: PayloadAction<string | null>) {
      state.replyingToId = action.payload
    },
    setSortBy(state, action: PayloadAction<CommentsState['sortBy']>) {
      state.sortBy = action.payload
    },
    voteComment(state, action: PayloadAction<{ id: string; delta: 1 | -1 }>) {
      const { id, delta } = action.payload
      const base =
        state.voteOverrides[id] ??
        (findInTree(state.threads, id)?.score ?? 0)
      state.voteOverrides[id] = base + delta
    },
    resetComments(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadComments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadComments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.post = action.payload.post
        state.meta = action.payload.meta
        state.threads = action.payload.data
        state.expandedIds = buildDefaultExpanded(action.payload.data, 2)
        state.error = null
      })
      .addCase(loadComments.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load comments'
      })
      .addCase(submitReply.fulfilled, (state, action) => {
        const { parentId, body, id } = action.payload
        const reply: Comment = {
          id,
          parentId,
          postId: state.post?.id ?? 'post_001',
          author: CURRENT_USER,
          body,
          score: 1,
          createdAt: new Date().toISOString(),
          replyCount: 0,
          replies: [],
        }

        state.threads = addReplyToTree(state.threads, parentId, reply)
        state.expandedIds[parentId] = true
        state.replyingToId = null

        if (state.post) {
          state.post.commentCount += 1
        }
        if (state.meta) {
          state.meta.totalComments += 1
        }
      })
  },
})

function findInTree(comments: Comment[], id: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === id) return comment
    if (comment.replies?.length) {
      const found = findInTree(comment.replies, id)
      if (found) return found
    }
  }
  return null
}

export const {
  toggleExpanded,
  setExpanded,
  expandAll,
  collapseAll,
  setReplyingTo,
  setSortBy,
  voteComment,
  resetComments,
} = commentsSlice.actions

export function selectSortedThreads(state: { comments: CommentsState }) {
  return sortTopLevelComments(state.comments.threads, state.comments.sortBy)
}

export { collectBranchIds }
export default commentsSlice.reducer
