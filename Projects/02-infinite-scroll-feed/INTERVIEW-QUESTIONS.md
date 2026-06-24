# Interview Questions — Infinite Scroll Feed

---

## Fundamentals

### Q1. How does infinite scroll differ from pagination?

| Pagination                   | Infinite Scroll         |
| ---------------------------- | ----------------------- |
| User clicks "Next page"      | Auto-loads on scroll    |
| Clear page boundaries        | Seamless stream         |
| Better for SEO/accessibility | Better for mobile feeds |

**Interview Answer:** "Infinite scroll appends the next page when a sentinel enters the viewport — same API, different trigger."

---

### Q2. Why use Intersection Observer instead of scroll events?

**Scroll events:**

- Fire on every pixel scrolled (throttled but still heavy)
- Require manual `getBoundingClientRect` math
- Can cause jank on low-end devices

**Intersection Observer:**

- Browser-native, efficient
- `rootMargin` prefetches before bottom
- Decoupled from scroll frequency

**Interview Answer:** "Intersection Observer is the modern standard — no scroll listener thrashing, built-in prefetch margin."

---

### Q3. How do you prevent duplicate API calls?

1. **Guard in handler:** `if (!hasMore || isLoading) return`
2. **Redux status:** separate `loading` vs `loadingMore`
3. **AbortController:** cancel in-flight on unmount
4. **Dedupe on append:** filter by `id` before merging

**In this project:** All four patterns are used.

---

## State Management

### Q4. Why separate `loading` and `loadingMore`?

| State         | UI                                           |
| ------------- | -------------------------------------------- |
| `loading`     | Full skeleton list (first page)              |
| `loadingMore` | Small spinner at bottom, keep existing posts |

**Interview Answer:** "Different UX for first paint vs append — users should never lose already-loaded content."

---

### Q5. What happens when load-more fails?

- Existing `posts` array is **preserved**
- `status` → `failed`, `error` set
- Inline `FeedError` with retry button
- Retry calls `loadMoreFeed` again (same page)

**Interview Answer:** "Fail gracefully — show retry inline, never wipe the feed."

---

## API & Pagination

### Q6. Offset vs cursor pagination?

| Offset (`page=3`)          | Cursor (`cursor=post_123`) |
| -------------------------- | -------------------------- |
| Simple                     | Scales better              |
| Slow on large tables       | Consistent with inserts    |
| Page drift if data changes | No skipped/duplicate rows  |

**Interview Answer:** "Offset for demos and small datasets; cursor for production feeds at scale."

---

### Q7. How is mock data structured?

60 posts in `feed-posts.json` with DB-shaped fields:

- Prefixed IDs (`post_01FF001`)
- Denormalized author fields (feed optimization)
- Engagement counts, timestamps, tags
- Wrapper `meta` object with `count` and `pageSize`

---

## Performance

### Q8. When does infinite scroll break down?

Around **500–1000 DOM nodes** without virtualization:

- Slow scroll
- High memory
- Layout thrashing

**Fix:** `react-virtuoso` or `@tanstack/react-virtual`

**Interview Answer:** "Infinite scroll controls data fetching; virtualization controls rendering — you need both at scale."

---

### Q9. What is `rootMargin: '200px'`?

Expands the observer's root box by 200px before the sentinel is visible — **prefetches** the next page early.

**Interview Answer:** "Prefetch margin — user never sees a spinner if network is fast enough."

---

### Q10. How would you optimize FeedCard re-renders?

```typescript
export const FeedCard = React.memo(function FeedCard({ post }: Props) {
  // ...
});
```

Plus stable `key={post.id}` and avoid inline functions in parent.

---

## UX

### Q11. What loading states should a feed have?

1. **Initial** — skeleton cards
2. **Load more** — bottom spinner + `aria-live="polite"`
3. **End of feed** — "You're all caught up!"
4. **Error** — retry button
5. **Empty** — no posts message (not needed here with 60 items)

---

### Q12. Accessibility concerns with infinite scroll?

- Announce "Loading more" to screen readers (`aria-live`)
- Provide "Load more" button fallback
- Keyboard users may miss content below fold
- No focus trap issues (unlike modals)

**Interview Answer:** "Add aria-live on load-more and consider a manual 'Load more' button for a11y compliance."

---

## Advanced / Senior

### Q13. How would you add pull-to-refresh?

1. Touch events or library (`react-pull-to-refresh`)
2. On refresh: `dispatch(resetFeed())` then `loadInitialFeed()`
3. Scroll to top

---

### Q14. Race condition: page 2 returns before page 1?

**Solutions:**

1. Abort previous request (RTK `signal`)
2. Sequence number — ignore stale responses
3. Only allow one in-flight request (`isLoading` guard)

---

### Q15. How would you test infinite scroll?

```typescript
// Mock IntersectionObserver
// Dispatch loadInitialFeed → assert 10 cards
// Trigger observer callback → assert 20 cards
// Mock API failure on page 3 → assert retry button
```

Use Playwright: scroll to bottom, wait for new cards.

---

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria                  | What to demonstrate in **FlowFeed**              | Example from this project                              |
| ------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| **Component structure**   | Feed list vs card vs load-more sentinel          | `FeedList` → `FeedCard` + `FeedLoadMore`               |
| **State management**      | Pagination meta separate from posts array        | `feedSlice`: `posts`, `page`, `hasMore`, `loadingMore` |
| **Code readability**      | Custom hook hides Observer boilerplate           | `useInfiniteScroll` — one place for IO logic           |
| **Edge cases**            | Double fetch, end of list, error mid-pagination  | `hasMore` guard; retry without clearing posts          |
| **Performance awareness** | Don't render 10k nodes; prefetch with rootMargin | 10 posts/page; `rootMargin` triggers early load        |

**Strong signal:** You explain why infinite scroll ≠ render everything, and how `loading` vs `loadingMore` differ.

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **FlowFeed**:

### Virtualization

**Ask:** "User scrolled 500 pages — DOM is huge."

Replace naive map with `@tanstack/react-virtual` or `react-window`. Keep scroll position + IO sentinel at list bottom. **This project** appends DOM nodes — senior fix is virtual list.

**Interview Answer:** "Infinite scroll controls _data_ loading; virtualization controls _DOM_ size. I'd virtualize the feed list while keeping the same pagination API — only ~15 card nodes exist regardless of scroll depth."

**Example:** User loaded 50 pages (500 posts = 500 DOM nodes) → virtual list keeps **~12 cards** mounted → scroll stays smooth at 60fps.

---

### Optimistic updates

**Ask:** "Like button should feel instant."

```typescript
dispatch(optimisticLike(postId));
try {
  await api.like(postId);
} catch {
  dispatch(revertLike(postId));
}
```

**Interview Answer:** "Update like count in Redux immediately, PATCH in background, revert on failure. User sees instant feedback — same pattern as Twitter hearts."

**Example:** Heart turns red, count **42 → 43** instantly → PATCH fails → heart grays out and count reverts to 42.

---

### Undo functionality

**Ask:** "Accidental hide post."

Toast with Undo within 5s — restore post to feed from snapshot ref.

**Interview Answer:** "Snapshot the removed post in a ref, remove from list, show toast with Undo that re-inserts at the same index within 5 seconds."

**Example:** Hide post at index 7 → toast **"Post hidden — Undo"** → Undo puts it back at **exactly index 7** within 5s.

---

### Accessibility support

**Ask:** "Announce new posts to screen readers."

`aria-live="polite"` on feed region: "12 more posts loaded". Ensure focus doesn't jump on append.

**Interview Answer:** "Add an `aria-live=polite` region that announces new batch count. Don't move focus on append — screen reader users lose their place if focus jumps to the top."

**Example:** Page 6 loads → screen reader hears **"10 more posts loaded"** — keyboard focus stays on the post the user was reading.

---

### Performance constraints

**Ask:** "Images tank scroll performance."

`loading="lazy"`, fixed aspect-ratio placeholders, optional blur hash. Dedupe posts by `id` on append (implemented pattern).

**Interview Answer:** "Lazy-load images, reserve height to prevent layout shift, dedupe by id on append. If jank persists, virtualize rows — images then only load for visible cards."

**Example:** 200px-tall gray placeholder → real image lazy-loads on scroll-in → no layout jump (CLS stays near 0).

---

## Quick Revision Checklist

- [ ] Intersection Observer + sentinel
- [ ] `loading` vs `loadingMore` states
- [ ] `hasMore` guard prevents extra fetches
- [ ] Dedupe on append
- [ ] Error retry preserves posts
- [ ] 60 JSON posts, 10 per page
- [ ] `rootMargin` prefetch
- [ ] Lazy images (`loading="lazy"`)

---

## One-Liner Answers

| Question               | Answer                                           |
| ---------------------- | ------------------------------------------------ |
| Page size?             | 10 posts per request                             |
| Total mock data?       | 60 posts in JSON                                 |
| Scroll trigger?        | Intersection Observer on sentinel div            |
| Why Redux?             | Global feed state, DevTools, interview pattern   |
| Production pagination? | Cursor-based with `created_at` + `id` tiebreaker |
