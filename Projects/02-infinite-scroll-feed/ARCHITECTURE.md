# Architecture — Infinite Scroll Feed (FlowFeed)

## Overview

FlowFeed demonstrates **cursor-free offset pagination** with **infinite scroll** — a pattern used by Twitter, Instagram, and LinkedIn feeds. The architecture separates data fetching, scroll detection, and presentation so each layer can be tested and swapped independently.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Vite SPA)                       │
├─────────────────────────────────────────────────────────────────┤
│  FeedApp → FeedList                                              │
│    ├── Initial load: loadInitialFeed (page 1)                   │
│    ├── Scroll sentinel: useInfiniteScroll (IntersectionObserver)  │
│    ├── Load more: loadMoreFeed (page N+1)                       │
│    └── FeedCard × N (React.memo candidate)                      │
├─────────────────────────────────────────────────────────────────┤
│  Redux feed slice                                                │
│    posts[] · page · meta.hasMore · status · error               │
├─────────────────────────────────────────────────────────────────┤
│  feedApi.ts                                                      │
│    MOCK: slice JSON array + artificial latency                  │
│    REAL: fetch GET /api/feed?page=&limit=                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model

Mock data lives in **`src/data/feed-posts.json`** (60 records).

### JSON file structure

```json
{
  "meta": {
    "schemaVersion": "1.0.0",
    "collection": "feed_posts",
    "count": 60,
    "pageSize": 10
  },
  "data": [ /* FeedPost[] */ ]
}
```

### `feed_posts` (conceptual schema)

| Column | Type | Description |
| ------ | ---- | ----------- |
| `id` | `VARCHAR` PK | `post_01FF001` |
| `author_id` | `VARCHAR` FK | References users table |
| `author_name` | `VARCHAR` | Denormalized for feed speed |
| `author_username` | `VARCHAR` | @handle |
| `content` | `TEXT` | Post body |
| `excerpt` | `VARCHAR` | Truncated preview |
| `image_url` | `VARCHAR` NULL | Optional media |
| `category` | `VARCHAR` | Tech, Design, etc. |
| `tags` | `TEXT[]` | Hashtags |
| `likes_count` | `INT` | Engagement metric |
| `comments_count` | `INT` | Engagement metric |
| `shares_count` | `INT` | Engagement metric |
| `is_published` | `BOOLEAN` | Soft visibility |
| `is_pinned` | `BOOLEAN` | Pinned to top |
| `created_at` | `TIMESTAMPTZ` | Sort key |
| `updated_at` | `TIMESTAMPTZ` | Last edit |

---

## API Contract

### `GET /api/feed`

| Param | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `page` | number | 1 | 1-based page index |
| `limit` | number | 10 | Items per page |

**Response `200 OK`**

```json
{
  "data": [/* FeedPost[] */],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 60,
    "totalPages": 6,
    "hasMore": true,
    "tookMs": 42
  }
}
```

**Mock behaviour**
- Sorts by `createdAt` descending
- Latency: 300–800ms
- Optional error on page 4 when `VITE_SIMULATE_FEED_ERROR=true`

---

## State Management (Redux)

### `feed` slice

| Field | Purpose |
| ----- | ------- |
| `posts` | Accumulated feed items (append on load more) |
| `page` | Current page number |
| `limit` | Page size (10) |
| `meta` | Pagination metadata from API |
| `status` | `idle` \| `loading` \| `loadingMore` \| `succeeded` \| `failed` |
| `error` | Error message for retry UI |

### Status flow

```
idle → loading → succeeded
                    ↓ (scroll to sentinel)
              loadingMore → succeeded (append)
                    ↓ (error)
                  failed → retry → loading / loadingMore
```

### Deduplication

`loadMoreFeed.fulfilled` filters out posts whose `id` already exists — prevents duplicates on retry or race conditions.

---

## Infinite Scroll Implementation

### `useInfiniteScroll` hook

Uses **Intersection Observer API** (not scroll events):

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !isLoading) {
      onLoadMore()
    }
  },
  { rootMargin: '200px' }  // prefetch before user hits bottom
)
```

**Why Intersection Observer?**
- No scroll listener thrashing
- Built-in `rootMargin` for prefetching
- Better performance on mobile

### Sentinel element

A 1px div at the bottom of the list is observed. When it enters the viewport (with 200px margin), `loadMoreFeed` dispatches.

---

## Component Hierarchy

```
App
├── Header (loaded count badge)
├── FeedApp
│   └── FeedList
│       ├── FeedSkeletonList (initial loading)
│       ├── FeedCard × N
│       ├── FeedError (retry)
│       ├── sentinel div (ref)
│       └── FeedLoadMore (spinner / end message)
└── Footer
```

---

## Performance Considerations

| Concern | Solution |
| ------- | -------- |
| Too many DOM nodes | Virtualize at 500+ items (`react-window`) |
| Duplicate fetches | Guard: `if (!hasMore \|\| isLoading) return` |
| Stale responses | RTK `signal` abort on unmount |
| Image bandwidth | `loading="lazy"` on post images |
| Re-renders | `React.memo(FeedCard)` in production |
| Scroll jank | Intersection Observer vs scroll events |

### Production upgrades

1. **Cursor pagination** — `?cursor=lastId` instead of offset
2. **Virtual list** — `react-virtuoso` for 10k+ posts
3. **Optimistic UI** — like/comment without waiting for API
4. **Service Worker** — offline cached feed pages

---

## Error Handling Strategy

| Scenario | UX |
| -------- | -- |
| Initial load fails | Full-page `FeedError` with retry |
| Load more fails | Inline error below posts, existing posts stay |
| Abort on unmount | Silent — no state update |

---

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `VITE_USE_MOCK_API` | `true` | Use JSON mock |
| `VITE_API_BASE_URL` | `/api` | Backend URL |
| `VITE_SIMULATE_FEED_ERROR` | `false` | Fail page 4 for demo |

---

## Future Backend Sketch

```sql
CREATE TABLE feed_posts (
  id            VARCHAR(32) PRIMARY KEY,
  author_id     VARCHAR(32) NOT NULL REFERENCES users(id),
  content       TEXT NOT NULL,
  image_url     VARCHAR(512),
  category      VARCHAR(50),
  tags          TEXT[] DEFAULT '{}',
  likes_count   INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count  INT DEFAULT 0,
  is_published  BOOLEAN DEFAULT true,
  is_pinned     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feed_created ON feed_posts (created_at DESC) WHERE is_published = true;
```

---

## Interview Answer (one-liner)

> "Infinite scroll is offset pagination triggered by an Intersection Observer sentinel — separate initial vs load-more states, dedupe on append, and retry without losing already-loaded posts."
