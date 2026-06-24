import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchFeedPage } from '@/api/feedApi'
import type { FeedState } from '@/lib/types/feed'

const PAGE_SIZE = 10

const initialState: FeedState = {
  posts: [],
  page: 0,
  limit: PAGE_SIZE,
  meta: null,
  status: 'idle',
  error: null,
}

export const loadInitialFeed = createAsyncThunk('feed/loadInitial', async (_, { signal }) => {
  return fetchFeedPage({ page: 1, limit: PAGE_SIZE }, signal)
})

export const loadMoreFeed = createAsyncThunk(
  'feed/loadMore',
  async (_, { getState, signal }) => {
    const { feed } = getState() as { feed: FeedState }
    const nextPage = feed.page + 1
    return fetchFeedPage({ page: nextPage, limit: feed.limit }, signal)
  },
)

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    resetFeed(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInitialFeed.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadInitialFeed.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = action.payload.data
        state.page = action.payload.meta.page
        state.meta = action.payload.meta
        state.error = null
      })
      .addCase(loadInitialFeed.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load feed'
      })
      .addCase(loadMoreFeed.pending, (state) => {
        state.status = 'loadingMore'
        state.error = null
      })
      .addCase(loadMoreFeed.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const existingIds = new Set(state.posts.map((p) => p.id))
        const newPosts = action.payload.data.filter((p) => !existingIds.has(p.id))
        state.posts = [...state.posts, ...newPosts]
        state.page = action.payload.meta.page
        state.meta = action.payload.meta
        state.error = null
      })
      .addCase(loadMoreFeed.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load more posts'
      })
  },
})

export const { resetFeed } = feedSlice.actions
export { PAGE_SIZE }
export default feedSlice.reducer
