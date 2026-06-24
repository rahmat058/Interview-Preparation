# Interview Questions — Nested Comments

---

## Fundamentals

### Q1. Why use a recursive component for nested comments?

Comments are **self-similar**: every reply can have its own replies. The same `CommentNode` renders at every depth — identical to a file tree or DOM tree.

**Interview Answer:** "`CommentNode` renders one `CommentRow`, then maps `replies` to `<CommentNode />`. Base case: no replies or collapsed. Recursive case: expanded + children."

---

### Q2. Nested JSON vs flat list with `parentId`?

| Approach             | When                                  |
| -------------------- | ------------------------------------- |
| Nested JSON          | Mock APIs, read-heavy, simple render  |
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
    (sum, child) => sum + 1 + countDescendants(child),
    0,
  );
}
```

Or cache `replyCount` on write — this project updates it in `addReplyToTree`.

---

## Component Architecture

### Q7. Why split `CommentNode` and `CommentRow`?

| Component     | Role                                    |
| ------------- | --------------------------------------- |
| `CommentNode` | Recursion, expand, reply form placement |
| `CommentRow`  | Avatar, body, vote, action buttons      |

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
  const map = new Map(flat.map((c) => [c.id, { ...c, replies: [] }]));
  const roots = [];
  for (const c of flat) {
    if (c.parentId && map.has(c.parentId))
      map.get(c.parentId).replies.push(map.get(c.id));
    else roots.push(map.get(c.id));
  }
  return roots;
}
```

---

### Q14. Max depth / depth limit?

Track `depth` prop. Refuse render or flatten visually when `depth > MAX` with "continue thread" link — prevents DOM depth issues and matches Reddit's "continue this thread" pages.

---

## Rapid Fire

| Question        | Short answer                                  |
| --------------- | --------------------------------------------- |
| Base case?      | No replies, or collapsed branch               |
| Key prop?       | `comment.id` — never index                    |
| Thread line?    | `border-l` + `margin-left` per depth          |
| Delete comment? | Remove from parent's `replies` immutably      |
| Edit comment?   | `updateInTree(id, patch)` same walk as insert |

---

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria                  | What to demonstrate in **ThreadNest**                 | Example from this project                                  |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| **Component structure**   | Recursion + row split (same as file tree)             | `CommentNode` → `CommentRow`                               |
| **State management**      | Tree immutable; `expandedIds` separate                | `addReplyToTree` — don't mutate API payload                |
| **Code readability**      | Tree utils testable without React                     | `buildCommentTree`, `countDescendants` in `commentTree.ts` |
| **Edge cases**            | Deep threads, collapse mid-reply, sort vs reply order | Top-level sort only; nested order stable                   |
| **Performance awareness** | Don't render collapsed subtrees                       | `AnimatePresence` + `isExpanded` gate                      |

**Strong signal:** You compare nested JSON vs flat `parentId` + `buildTree()` unprompted.

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **ThreadNest**:

### Virtualization

**Ask:** "Thread has 2,000 replies."

Flatten visible comments to list (respecting collapse) → virtual scroll. Reddit uses "Continue this thread" at max depth — valid alternative.

**Interview Answer:** "DFS flatten expanded nodes to `{ id, depth, comment }[]`, virtualize that list. Collapse state stays in Redux — recursion moves from JSX to a utility, same as file explorer at scale."

**Example:** Thread with 2,000 replies, 40 expanded → flat list virtualizes **12 visible rows** — collapse state still lives in Redux.

---

### Optimistic updates

**Ask:** "Reply appears instantly."

Push reply to tree with temp id before `submitReply` resolves; replace id or remove on failure (partially async today — call out as upgrade).

**Interview Answer:** "Call `addReplyToTree` with a temp id immediately, show pending styling, swap id when API returns. On failure, prune that branch — `commentTree.ts` already returns immutable paths."

**Example:** Post reply → gray **"Sending…"** bubble with temp id `tmp-9` → API returns real id `c-991` → styling turns solid.

---

### Undo functionality

**Ask:** "Delete comment."

Soft-delete with Undo toast for 5s before API commit. Or collapse instead of delete for moderation UIs.

**Interview Answer:** "Mark comment `pendingDelete` in tree, toast Undo clears flag. After 5s dispatch real delete. Moderation UIs often collapse instead — less destructive, same UX pattern."

**Example:** Delete comment → fades + toast **Undo** → no click within 5s → permanent delete fires; Undo clears `pendingDelete` flag instantly.

---

### Accessibility support

**Ask:** "Navigate thread by keyboard."

Focus management on Reply open; `aria-level` for depth optional. Announce "3 replies collapsed" on toggle.

**Interview Answer:** "Focus textarea when Reply opens, return focus to Reply button on cancel. Live region on collapse toggle: '3 replies hidden'. Optional `aria-level` mirrors visual indent."

**Example:** Click **Reply** → focus jumps to textarea → **Cancel** → focus returns to **Reply** button, not lost to `<body>`.

---

### Performance constraints

**Ask:** "Re-render whole tree on one vote?"

`React.memo(CommentNode)` + stable handlers. Normalized store `{ commentsById, childrenIds }` at scale instead of deep nested objects.

**Interview Answer:** "Memo `CommentNode`, stabilize `onToggle` with `useCallback`. At Reddit scale, normalize to `{ commentsById, childrenIds }` — vote updates one node, not a deep clone path."

**Example:** Upvote one comment in a 500-reply thread → only that **`CommentNode`** re-renders, not all 500 siblings.

---

## Cross-Project Links

| Project          | Shared pattern                          |
| ---------------- | --------------------------------------- |
| #3 File Explorer | `TreeNode` recursion, `expandedPaths`   |
| #7 Modal Manager | Layered UI state, focus on active layer |
| #5 Data Table    | Immutable data transforms               |
