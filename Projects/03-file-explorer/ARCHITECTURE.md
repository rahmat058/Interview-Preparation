# Architecture — File Explorer (TreeScope)

## Overview

TreeScope demonstrates **recursive tree rendering** — the same pattern VS Code, Windows Explorer, and Figma layers use. The architecture separates **tree data**, **expand/collapse state**, **row presentation**, and **recursion** so each layer can be tested and swapped independently.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Vite SPA)                       │
├─────────────────────────────────────────────────────────────────┤
│  ExplorerApp                                                     │
│    ├── ExplorerToolbar (filter · expand all · collapse all)     │
│    ├── FileTree (role="tree" · keyboard nav)                    │
│    │     └── TreeNode ──► TreeNode ──► TreeNode  (recursive)    │
│    │           └── TreeRow (presentation only)                  │
│    └── FileDetailPanel (selected node metadata)                 │
├─────────────────────────────────────────────────────────────────┤
│  Redux explorer slice                                            │
│    tree · expandedPaths · selectedPath · filterQuery · status   │
├─────────────────────────────────────────────────────────────────┤
│  explorerApi.ts                                                  │
│    MOCK: load JSON + artificial latency                         │
│    REAL: fetch GET /api/explorer/tree                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

This project is designed for **component architecture interviews**. The split is intentional:

| Component        | Responsibility                          | Recursive? |
| ---------------- | --------------------------------------- | ---------- |
| `ExplorerApp`    | Layout, data fetch on mount             | No         |
| `ExplorerToolbar`| Filter input, bulk expand/collapse      | No         |
| `FileTree`       | Root render, keyboard navigation        | No         |
| **`TreeNode`**   | One node + children when expanded       | **Yes**    |
| `TreeRow`        | Row UI (icon, chevron, indent, click)   | No         |
| `FileIcon`       | Extension-aware icon mapping            | No         |
| `FileDetailPanel`| Selected node metadata panel            | No         |

### Recursive pattern

```tsx
// TreeNode.tsx — simplified
function TreeNode({ node, depth }) {
  const isExpanded = expandedPaths[node.path]

  return (
    <>
      <TreeRow node={node} depth={depth} ... />
      {node.type === 'folder' && isExpanded && (
        <div role="group">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  )
}
```

**Why separate `TreeRow` from `TreeNode`?**

- `TreeRow` is a leaf presenter — easy to unit test styling and clicks
- `TreeNode` owns recursion — interviewers can ask you to draw this on a whiteboard
- State dispatch stays in `TreeNode`; `TreeRow` receives callbacks (presentational)

---

## Data Model

Mock data lives in **`src/data/file-tree.json`** (86 nodes).

### JSON file structure

```json
{
  "meta": {
    "schemaVersion": "1.0.0",
    "collection": "file_system_tree",
    "rootPath": "/react-interview-prep",
    "totalNodes": 86,
    "totalFolders": 22,
    "totalFiles": 64
  },
  "data": {
    "id": "dir_001",
    "name": "react-interview-prep",
    "type": "folder",
    "path": "/react-interview-prep",
    "children": [ /* nested FileSystemNode[] */ ]
  }
}
```

### `file_system_nodes` (conceptual schema)

| Column        | Type          | Description                    |
| ------------- | ------------- | ------------------------------ |
| `id`          | `VARCHAR` PK  | `dir_001`, `file_042`          |
| `name`        | `VARCHAR`     | Display name                   |
| `type`        | `ENUM`        | `folder` \| `file`             |
| `path`        | `VARCHAR` UK  | Absolute path key              |
| `extension`   | `VARCHAR` NULL| `tsx`, `json`, `md` (files)    |
| `size_bytes`  | `INT` NULL    | File size (files only)         |
| `modified_at` | `TIMESTAMPTZ` | Last modified                  |
| `parent_path` | `VARCHAR` FK  | Implicit via nesting in JSON   |

---

## API Contract

### `GET /api/explorer/tree`

Returns the full nested tree in one response (eager load). For very large trees, see **Lazy Load Extension** below.

**Response `200 OK`**

```json
{
  "meta": { "totalNodes": 86, "totalFolders": 22, "totalFiles": 64, ... },
  "data": { "id": "...", "type": "folder", "children": [...] }
}
```

---

## State Design

### `expandedPaths: Record<string, boolean>`

- Key = folder `path` (e.g. `/react-interview-prep/src`)
- Value = whether that folder is open
- **Why not store expanded IDs in the tree data?** Keeps server payload immutable; UI state stays client-side

### `selectedPath: string | null`

- Single selection (VS Code default)
- Multi-select would use `Set<string>` — common follow-up question

### Initial expansion

On load, three paths pre-expand so the demo feels alive:

```ts
['/react-interview-prep', '/react-interview-prep/src', '/react-interview-prep/src/components']
```

---

## Data Flow

```
1. ExplorerApp mounts
2. dispatch(loadFileTree())
3. explorerApi → mock delay → JSON parse
4. Redux: tree + meta + default expandedPaths
5. FileTree renders root TreeNode
6. User clicks folder row
   → toggleExpanded(path) in Redux
   → TreeNode re-renders children block
7. User selects file
   → setSelectedPath(path)
   → FileDetailPanel reads via findNodeByPath()
```

---

## Tree Utilities (`treeHelpers.ts`)

| Function           | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `findNodeByPath`   | DFS lookup for detail panel                    |
| `collectFolderPaths` | All folder paths for Expand All            |
| `filterTree`       | Returns pruned tree matching filter query    |
| `getVisibleNodes`  | Flat list of visible rows for keyboard nav   |
| `countTreeNodes`   | Total node count                             |

---

## Keyboard Navigation

Implemented in `FileTree.tsx` using a flattened visible-node list:

| Key          | Action                              |
| ------------ | ----------------------------------- |
| `ArrowDown`  | Select next visible row             |
| `ArrowUp`    | Select previous visible row         |
| `ArrowRight` | Expand folder                       |
| `ArrowLeft`  | Collapse folder                     |
| `Enter` / `Space` | Toggle folder expand/collapse  |

Uses WAI-ARIA `role="tree"` / `role="treeitem"` / `aria-expanded`.

---

## Filter Strategy

`filterTree()` recursively prunes branches:

- **File matches** → include file node
- **Folder has matching descendant** → include folder with filtered children
- **No match** → exclude branch

When filtering, consider auto-expanding matched folders (extension point — not implemented to keep scope minimal).

---

## Performance Considerations

| Concern              | Current approach              | Scale-up                          |
| -------------------- | ----------------------------- | --------------------------------- |
| Deep trees           | Full tree in memory (86 nodes)  | Lazy load children per folder     |
| Re-renders on toggle | Redux path record update      | `React.memo(TreeNode)` + selector |
| Very long lists      | Native scroll in panel        | Virtualization (`react-window`)   |
| Filter               | Client-side tree clone        | Server-side search API            |

### Lazy Load Extension (documented, not implemented)

```ts
// GET /api/explorer/children?path=/src/components
export async function fetchChildren(path: string): Promise<FileSystemNode[]>
```

`TreeNode` would dispatch `loadChildren(path)` on first expand if `children` is undefined.

---

## Accessibility

- `role="tree"` on container, `role="treeitem"` on rows
- `aria-expanded` on folders
- `aria-selected` on active row
- Roving `tabIndex` (0 on focused row, -1 on others)
- Chevron + folder name both clickable

---

## Swapping Mock → Real API

1. Set `VITE_USE_MOCK_API=false`
2. Implement `GET /api/explorer/tree` returning `FileTreeResponse`
3. Optional: add `GET /api/explorer/children?path=` for lazy loading
4. No component changes required — only `explorerApi.ts`

---

## File Map

```
src/
├── api/explorerApi.ts
├── components/explorer/
│   ├── TreeNode.tsx       ★ recursive
│   ├── TreeRow.tsx
│   ├── FileTree.tsx
│   ├── FileIcon.tsx
│   ├── FileDetailPanel.tsx
│   ├── ExplorerToolbar.tsx
│   ├── ExplorerSkeleton.tsx
│   └── ExplorerError.tsx
├── lib/
│   ├── types/explorer.ts
│   ├── utils/treeHelpers.ts
│   └── store/slices/explorerSlice.ts
└── data/file-tree.json
```
