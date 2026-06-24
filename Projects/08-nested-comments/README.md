# ThreadNest — Nested Comments

**React Machine Coding Project #8** — Reddit-style comment threads with **recursive rendering**, **inline replies**, and **expand/collapse**.

![ThreadNest — Nested Comments](../Projects-Images/08-nested-comments.png)

**[🔗 Live Demo](https://nested-comments-eta.vercel.app/)**

## Features

| Feature                 | Implementation                                            |
| ----------------------- | --------------------------------------------------------- |
| **Recursive rendering** | `CommentNode` maps `replies` → `<CommentNode />`          |
| **Replies**             | Inline form + `addReplyToTree()` immutable insert         |
| **Expand / collapse**   | Per-thread `expandedIds` in Redux                         |
| **Collapsed preview**   | Reddit-style author + excerpt when collapsed              |
| **Sort**                | Top-level Top / New toggle                                |
| **Toolbar**             | Expand all / Collapse all                                 |
| **Tree utilities**      | `buildCommentTree`, `findCommentById`, `countDescendants` |
| **Mock API**            | 20+ nested comments, up to 4 levels deep                  |
| **Design**              | Ember Coral palette (orange → rust → rose)                |

## Tech Stack

| Layer  | Technology           |
| ------ | -------------------- |
| Build  | Vite 7               |
| UI     | React 19, TypeScript |
| State  | Redux Toolkit        |
| Motion | Framer Motion        |
| Icons  | lucide-react         |

## Getting Started

**Prerequisites:** Node.js **24.11.0**

```bash
cd Projects/08-nested-comments
npm install
npm run generate:data   # optional — regenerates comments.json
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — expand threads, post a reply, try Collapse all.

## Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start dev server                    |
| `npm run build`         | Type-check + production build       |
| `npm run preview`       | Preview production build            |
| `npm run lint`          | Run ESLint                          |
| `npm run generate:data` | Regenerate `src/data/comments.json` |

## Component Architecture (Interview Focus)

```
CommentThread
└── CommentNode (recursive)
    ├── CommentRow (presentation — vote, reply, collapse)
    ├── CommentReplyForm (when replyingToId matches)
    └── replies.map → CommentNode (depth + 1)
```

**Split:** `CommentRow` = UI. `CommentNode` = recursion + expand state. Same pattern as `TreeRow` / `TreeNode` in Project #3.

## Tree Utilities

| Function                                   | Purpose                    |
| ------------------------------------------ | -------------------------- |
| `buildCommentTree(flat)`                   | Flat DB rows → nested tree |
| `addReplyToTree(threads, parentId, reply)` | Immutable insert           |
| `findCommentById(threads, id)`             | O(n) lookup for interviews |
| `countDescendants(comment)`                | Total reply count          |
| `buildDefaultExpanded(threads, 2)`         | Auto-expand first 2 levels |

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — data model, tree ops, state split
- [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md) — interview Q&A
