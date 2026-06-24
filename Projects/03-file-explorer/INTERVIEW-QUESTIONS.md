# Interview Questions — File Explorer

---

## Fundamentals

### Q1. Why use a recursive component for a file tree?

A file tree is **self-similar**: every folder contains items that look identical to the root — a row plus optional children. Recursion maps naturally to the data structure.

**Interview Answer:** "`TreeNode` renders one row, then maps `children` back to `<TreeNode />`. The base case is a file (leaf node with no children). Same pattern VS Code and Windows Explorer use internally."

---

### Q2. What is the base case vs recursive case?

| Case       | Condition                    | Renders                    |
| ---------- | ---------------------------- | -------------------------- |
| **Base**   | `type === 'file'`            | `TreeRow` only             |
| **Recursive** | `type === 'folder' && expanded` | `TreeRow` + child `TreeNode`s |

**Interview Answer:** "Files stop recursion. Folders continue only when expanded — collapsed folders don't mount child components."

---

### Q3. Should expand/collapse state live in the tree data or separately?

**In tree data (bad for interviews at scale):**
- Mutates server payload
- Hard to reset UI without refetch

**Separate `expandedPaths` map (this project):**
- Immutable tree from API
- Easy expand all / collapse all
- Clear separation: data vs UI state

**Interview Answer:** "Keep server tree immutable. Track `expandedPaths` as client UI state keyed by path."

---

## Component Architecture

### Q4. Why split `TreeNode` and `TreeRow`?

| Component  | Role                                      |
| ---------- | ----------------------------------------- |
| `TreeNode` | Recursion, expand logic, Redux dispatch   |
| `TreeRow`  | Presentation: indent, icon, chevron, click |

**Interview Answer:** "Container/presenter split. `TreeRow` is easy to test and style. `TreeNode` owns the recursive structure — interviewers often ask you to whiteboard exactly this split."

---

### Q5. How would you avoid prop drilling in a deep tree?

Options (in order of interview preference):

1. **Redux / Context** for `expandedPaths`, `selectedPath` (used here)
2. **React Context** scoped to `FileTree` for lighter apps
3. **Compound components** with context for library-style APIs

**Interview Answer:** "Global UI state in Redux — any depth reads the same slice. Children only receive `node` and `depth` as props."

---

### Q6. What props does `TreeNode` actually need?

Minimal recursive props:

```ts
interface TreeNodeProps {
  node: FileSystemNode
  depth: number
}
```

Everything else (expanded, selected, handlers) can come from Redux or context.

**In this project:** keyboard focus adds `focusedPath` + callbacks — acceptable for roving tabindex without over-prop-drilling state.

---

## State & Performance

### Q7. What happens to the DOM when you collapse a folder?

**Current (AnimatePresence):** Children unmount — DOM nodes removed, memory freed.

**Alternative:** CSS `display: none` — faster re-expand, higher memory.

**Interview Answer:** "Unmount on collapse keeps DOM lean for deep trees. For huge trees, add virtualization. For fast toggle UX, keep mounted but hidden — tradeoff question."

---

### Q8. How do you optimize re-renders when one folder toggles?

1. **`React.memo(TreeNode)`** — re-render only if `node` or relevant slice changes
2. **Reselect / memoized selectors** — `expandedPaths[path]` per node
3. **Normalize tree to flat map** — O(1) lookups (overkill for 86 nodes)

**Interview Answer:** "Memoize `TreeNode`. With Redux, only nodes whose `expanded` ancestor changed need updates — for interviews, mention `React.memo` + stable keys (`node.id`)."

---

### Q9. When would you virtualize the tree?

- 1,000+ visible rows
- Flatten visible nodes → feed to `react-window` or `@tanstack/react-virtual`
- Indent becomes `style.paddingLeft` on virtual rows

**Interview Answer:** "Virtualize when visible row count hurts layout — flatten expanded tree to a list, virtualize that list. Recursion stays in data; rendering becomes flat."

---

## Data & API

### Q10. Eager load vs lazy load children?

| Strategy    | Pros                          | Cons                        |
| ----------- | ----------------------------- | --------------------------- |
| **Eager**   | Simple recursion, offline OK  | Slow initial load for huge repos |
| **Lazy**    | Fast first paint              | Loading spinners per folder, complex state |

**Interview Answer:** "This project eager-loads 86 nodes. Production file explorers lazy-fetch `GET /children?path=` on first expand and cache in Redux."

---

### Q11. How do you model the tree in TypeScript?

```ts
interface FileSystemNode {
  id: string
  name: string
  type: 'folder' | 'file'
  path: string
  children?: FileSystemNode[]  // folders only
}
```

**Interview Answer:** "Discriminated union optional — `type` field drives rendering. `children` only on folders. `path` is the stable key for expand/selection state."

---

### Q12. How does tree filtering work?

Recursive prune:

1. File matches query → keep
2. Folder name matches → keep with all children OR pruned children
3. Any descendant matches → keep folder with matching subtree only

**In this project:** `filterTree()` in `treeHelpers.ts`.

---

## Accessibility & UX

### Q13. What ARIA roles does a tree need?

```html
<div role="tree">
  <button role="treeitem" aria-expanded="true" aria-selected="true">
  <div role="group"> <!-- children --> </div>
</div>
```

**Interview Answer:** "`role=tree` on container, `treeitem` on rows, `group` on child lists, `aria-expanded` on folders, roving tabindex for keyboard."

---

### Q14. How do arrow keys work in a tree?

Build **visible flat list** from tree + `expandedPaths`:

- ↓ → next visible node
- ↑ → previous visible node
- → → expand folder
- ← → collapse folder

**Interview Answer:** "Trees aren't flat DOM — keyboard nav needs a computed visible-node list. `getVisibleNodes()` DFS respects expanded state."

---

## Advanced / Follow-ups

### Q15. How would you add multi-select?

- Change `selectedPath: string` → `selectedPaths: Set<string>`
- Shift+click range select on visible list
- Ctrl+click toggle individual

**Interview Answer:** "Upgrade selection to a Set. Range select operates on the flattened visible list, not the raw tree."

---

### Q16. How would you add drag-and-drop reorder?

- `@dnd-kit/core` or HTML5 DnD
- Only allow drop on folders
- Optimistic UI + `PATCH /move` API

**Interview Answer:** "DnD is orthogonal to recursion — wrap `TreeRow` in draggable, validate drop target is folder, update tree immutably in Redux."

---

### Q17. Compare this to a flat list + `parentId` model

| Nested JSON       | Flat + parentId        |
| ----------------- | ---------------------- |
| Natural recursion | Build tree in selector |
| Easy mock         | DB-normalized          |
| Hard to patch one node | Easy PATCH by id   |

**Interview Answer:** "APIs often return flat lists with `parentId`; use a `buildTree(flat)` utility once, then same recursive `TreeNode` renders it."

---

## Quick Whiteboard Checklist

When asked to **build a file explorer from scratch**, mention:

1. `FileSystemNode` type with `children?`
2. Recursive `TreeNode` + presentational `TreeRow`
3. `expandedPaths` map (not in tree data)
4. `node.id` or `node.path` as React key
5. DFS `findNodeByPath` for detail panel
6. Visible-list keyboard nav
7. Lazy load as scale-up story
