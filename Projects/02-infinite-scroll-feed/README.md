# FlowFeed — Infinite Scroll Feed

**React Machine Coding Project #2** — paginated social feed with Intersection Observer lazy loading, Redux state, loading skeletons, and error retry.

![FlowFeed — Infinite Scroll Feed](../Projects-Images/02-infinite-scroll-feed.png)

## Features

| Feature                | Implementation                                               |
| ---------------------- | ------------------------------------------------------------ |
| **Pagination**         | Server-style pages (10 per page) via `page` + `limit` params |
| **Lazy loading**       | `IntersectionObserver` sentinel triggers `loadMoreFeed`      |
| **Loading indicators** | Skeleton cards (initial), spinner (load more), header count  |
| **Error handling**     | Full-page error + inline retry on failed load-more           |
| **Mock API**           | 60 JSON posts with simulated 300–800ms latency               |
| **Animations**         | Framer Motion card stagger + error/load-more transitions     |
| **Design**             | Soft Glass Aurora palette (matches Project #1)               |

## Tech Stack

| Layer   | Technology                  |
| ------- | --------------------------- |
| Build   | Vite 7                      |
| UI      | React 19, TypeScript        |
| Styling | Tailwind CSS 4              |
| State   | Redux Toolkit + React-Redux |
| Motion  | Framer Motion               |
| Icons   | lucide-react                |

## Getting Started

**Prerequisites:** Node.js **24.11.0**

```bash
cd Projects/02-infinite-scroll-feed
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and scroll down to load more posts.

## Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start dev server                      |
| `npm run build`         | Type-check + production build         |
| `npm run preview`       | Preview production build              |
| `npm run lint`          | Run ESLint                            |
| `npm run generate:data` | Regenerate `src/data/feed-posts.json` |

## Project Structure

```
02-infinite-scroll-feed/
├── src/
│   ├── api/feedApi.ts              # Mock ↔ real API swap point
│   ├── data/
│   │   ├── feed-posts.json         # 60 mock posts (JSON)
│   │   └── mockFeedPosts.ts        # Typed JSON loader
│   ├── hooks/useInfiniteScroll.ts  # Intersection Observer
│   ├── lib/store/slices/feedSlice.ts
│   └── components/feed/            # FeedCard, FeedList, skeletons
├── ARCHITECTURE.md
├── INTERVIEW-QUESTIONS.md
└── README.md
```

## Mock Data

- **60 posts** in `src/data/feed-posts.json`
- DB-shaped fields: `id`, `authorId`, `content`, `likesCount`, `createdAt`, etc.
- **10 posts per page** → 6 pages total

## Switching to a Real API

1. Copy `.env.example` → `.env`
2. Set `VITE_USE_MOCK_API=false`
3. Implement `GET /api/feed?page=&limit=`
4. Response must match `FeedResponse` in `src/lib/types/feed.ts`

## Demo Error State

Set `VITE_SIMULATE_FEED_ERROR=true` in `.env` to simulate a network error on page 4.

## Documentation

| File                                               | Purpose                                |
| -------------------------------------------------- | -------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)               | System design, data flow, API contract |
| [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md) | Interview Q&A                          |
