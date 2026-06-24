# Interview Questions — Nested Comments

---

## Fundamentals

### Q1. Why use a recursive component for nested comments?

Comments are **self-similar**: every reply can have its own replies. The same `CommentNode` renders at every depth — identical to a file tree or DOM tree.

**Interview Answer:** "`CommentNode` renders one `CommentRow`, then maps `replies` to `<CommentNode />`. Base case: no replies or collapsed. Recursive case: expanded + children."

---

### Q2. Nested JSON vs flat list with `parentId`?

| Approach | When |
| -------- | ---- |
| Nested JSON | Mock APIs, read-heavy, simple render |
| Flat + `buildTree()` | SQL/NoSQL storage, pagination, writes |

**Interview Answer:** "Production stores flat rows. On fetch, `buildCommentTree()` groups by `parentId`. For inserts, append flat row then patch tree or rebuild subtree."

---

### Q3. Where should expand/collapse state live?

**Not in comment data from server** — that couples UI to API payload.

**In `expandedIds: Record<string, boolean>`** — client UI state keyed by comment id.

**Interview Answer:** "Same lesson as file explorer `expandedPaths`. Immutable server tree + separate UI map."

---

## Tree Structures

### Q4. How do you insert a reply immutably?

Walk the tree with `map`. When `comment.id === parentId`, append to `replies`. Otherwise recurse into children.

See `addReplyToTree()` in `commentTree.ts`.

**Interview Answer:** "Never mutate `comment.replies.push()`. Return new objects at every level on the path to the parent."

---

### Q5. Time complexity of `findCommentById`?

**O(n)** — visit every node once. Production uses `Map<id, Comment>` for O(1) lookup.

**Interview Answer:** "For interview scale, DFS is fine. Mention you'd denormalize to a Map at scale."

---

### Q6. How do you count total replies on a comment?

```typescript
function countDescendants(c) {
  return (c.replies ?? []).reduce(
    (sum, child) => sum + 1 + countDescendants(child), 0
  )
}
```

Or cache `replyCount` on write — this project updates it in `addReplyToTree`.

---

## Component Architecture

### Q7. Why split `CommentNode` and `CommentRow`?

| Component | Role |
| --------- | ---- |
| `CommentNode` | Recursion, expand, reply form placement |
| `CommentRow` | Avatar, body, vote, action buttons |

**Interview Answer:** "Container/presenter split — same as TreeNode/TreeRow in Project #3. Row is easy to style; Node owns tree structure."

---

### Q8. How does collapse work visually?

When `expandedIds[id] === false` and comment has replies:

- Hide full body + actions
- Show single-line preview: `u/author · excerpt… (N replies)`
- Click → `toggleExpanded(id)`

Reddit calls this "collapsed thread by /u/author".

---

### Q9. Should sorting re-order nested replies?

**No** — sort only top-level threads. Nested order stays stable (chronological). Re-sorting all depths on vote would confuse users and cost O(n log n) per vote.

---

## State & Data

### Q10. How would you paginate "load more replies"?

1. Flat API: `GET /comments?parentId=x&cursor=...`
2. Append to `parent.replies` without refetching whole tree
3. Or flatten to virtual list for 10k+ comments (advanced)

---

### Q11. Optimistic reply insert?

1. Generate temp id, push to tree immediately
2. API call in background
3. On failure: remove temp node + show error
4. On success: replace temp id with server id

This project waits for mock API — mention optimistic as extension.

---

### Q12. Prevent re-render of entire tree on every keystroke?

- `replyingToId` + local form state (only one form mounts)
- `React.memo(CommentNode)` with stable `comment` refs
- Normalized store: each id subscribes to its slice (advanced)

---

## Whiteboard Drills

### Q13. Implement `buildCommentTree` in 5 minutes

```typescript
function buildTree(flat) {
  const map = new Map(flat.map(c => [c.id, { ...c, replies: [] }]))
  const roots = []
  for (const c of flat) {
    if (c.parentId && map.has(c.parentId))
      map.get(c.parentId).replies.push(map.get(c.id))
    else roots.push(map.get(c.id))
  }
  return roots
}
```

---

### Q14. Max depth / depth limit?

Track `depth` prop. Refuse render or flatten visually when `depth > MAX` with "continue thread" link — prevents DOM depth issues and matches Reddit's "continue this thread" pages.

---

## Rapid Fire

| Question | Short answer |
| -------- | ------------ |
| Base case? | No replies, or collapsed branch |
| Key prop? | `comment.id` — never index |
| Thread line? | `border-l` + `margin-left` per depth |
| Delete comment? | Remove from parent's `replies` immutably |
| Edit comment? | `updateInTree(id, patch)` same walk as insert |

---

## Cross-Project Links

| Project | Shared pattern |
| ------- | -------------- |
| #3 File Explorer | `TreeNode` recursion, `expandedPaths` |
| #7 Modal Manager | Layered UI state, focus on active layer |
| #5 Data Table | Immutable data transforms |
