# Architecture — Nested Comments

## Overview

ThreadNest models Reddit-style discussions as a **nested comment tree**. Each `Comment` may contain a `replies[]` array; `CommentNode` renders itself recursively when a branch is expanded.

---

## Data Model

```typescript
interface Comment {
  id: string
  parentId: string | null   // denormalized for flat-list builds
  postId: string
  author: CommentAuthor
  body: string
  score: number
  createdAt: string
  replyCount: number        // cached descendant count
  replies?: Comment[]
}
```

### Nested vs flat API shapes

| Shape | Pros | Cons |
| ----- | ---- | ---- |
| **Nested JSON** (this mock) | Trivial recursive render | Harder to paginate "load more" |
| **Flat list** + `parentId` | DB-friendly, easy inserts | Need `buildCommentTree()` before render |

`buildCommentTree()` in `commentTree.ts` demonstrates the flat → nested transform interviewers often ask you to whiteboard.

---

## State Split

| State | Location | Why |
| ----- | -------- | --- |
| Comment tree | Redux `threads` | Source of truth from API + local replies |
| `expandedIds` | Redux | UI-only — never mutate server payload |
| `replyingToId` | Redux | Which inline form is open |
| `sortBy` | Redux | Top-level sort only |
| `voteOverrides` | Redux | Optimistic score deltas |

**Rule:** Server tree stays immutable except via explicit reducers (`addReplyToTree`, `submitReply.fulfilled`).

---

## Recursive Rendering

```
CommentNode(comment, depth)
│
├─ CommentRow          ← presentation
├─ CommentReplyForm?   ← if replyingToId === comment.id
└─ if expanded && replies.length
     └─ border-l thread line
          └─ replies.map(child =>
               CommentNode(child, depth + 1)  ← recursion
             )
```

| Case | Condition | Renders |
| ---- | --------- | ------- |
| **Base** | `replies` empty | Row only |
| **Recursive** | `replies.length && expanded` | Row + child `CommentNode`s |

---

## Tree Operations

### Insert reply — `addReplyToTree`

```typescript
// Immutable map at each level until parentId matches
comments.map(c =>
  c.id === parentId
    ? { ...c, replies: [...c.replies, reply], replyCount: updated }
    : c.replies ? { ...c, replies: addReplyToTree(c.replies, ...) } : c
)
```

**Complexity:** O(n) per insert where n = total nodes — fine for interview scale. Production Reddit uses flat store + Map.

### Expand / collapse

```typescript
expandedIds: Record<string, boolean>
toggleExpanded(id) → flip boolean
expandAll() → all ids with replies = true
collapseAll() → all = false
```

Default: `buildDefaultExpanded(threads, 2)` — first two levels open on load.

---

## Reply Flow

```
User clicks Reply
  → setReplyingTo(commentId)
  → CommentReplyForm mounts with data-autofocus

User submits
  → submitReply thunk (mock API latency)
  → fulfilled: addReplyToTree + expand parent + clear replyingToId
```

---

## Sorting

Only **top-level** threads re-sort (`top` by score, `new` by date). Reply order within a branch stays chronological — re-sorting nested siblings on every vote would reshuffle UX.

---

## Visual Depth

- `border-l-2 border-orange-200` thread line (Reddit pattern)
- `depth` badge on nested rows for interview demos
- Collapsed row: author + excerpt + "(N replies)" — click to expand

---

## Mock Data

`scripts/generate-comments.mjs` produces:

- 5 top-level threads
- 20 total comments
- Max depth 4
- React interview-themed discussion content

Run `npm run generate:data` to regenerate `src/data/comments.json`.

---

## File Map

```
src/
├── api/commentsApi.ts
├── data/comments.json
├── lib/utils/commentTree.ts    ← tree algorithms
├── lib/store/slices/commentsSlice.ts
└── components/comments/
    ├── CommentNode.tsx         ← recursive core
    ├── CommentRow.tsx          ← presentation
    ├── CommentReplyForm.tsx
    ├── CommentThread.tsx
    └── CommentToolbar.tsx
```
