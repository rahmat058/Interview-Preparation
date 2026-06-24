# Architecture — Kanban Board (FlowBoard)

## Overview

FlowBoard demonstrates **multi-container drag-and-drop** with **complex Redux state updates** — the pattern behind Jira, Trello, and Linear boards. State is **normalized** (columns hold ID arrays, cards live in a lookup map) so moving a card between columns is a surgical update, not a full tree clone.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Vite SPA)                       │
├─────────────────────────────────────────────────────────────────┤
│  BoardApp → KanbanBoard (DndContext)                            │
│    ├── KanbanColumn × 4 (useDroppable + SortableContext)        │
│    │     └── KanbanCard × N (useSortable)                       │
│    └── DragOverlay (floating card preview)                      │
├─────────────────────────────────────────────────────────────────┤
│  useKanbanDragDrop                                               │
│    onDragStart → setActiveCardId                                │
│    onDragOver  → moveCard (cross-column only)                   │
│    onDragEnd   → moveCard (same-column reorder)                 │
├─────────────────────────────────────────────────────────────────┤
│  Redux kanban slice                                              │
│    columns[] · cardsById{} · activeCardId · status              │
│    moveCard reducer → applyMoveCard()                           │
├─────────────────────────────────────────────────────────────────┤
│  kanbanApi.ts                                                    │
│    MOCK: JSON + latency · REAL: GET /api/kanban/board           │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Design (Normalized)

```typescript
{
  columns: [
    { id: 'col_todo', title: 'To Do', cardIds: ['card_001', 'card_002'] },
    { id: 'col_progress', title: 'In Progress', cardIds: ['card_003'] },
  ],
  cardsById: {
    'card_001': { id: 'card_001', columnId: 'col_todo', title: '...', ... },
  }
}
```

### Why normalize?

| Nested (bad at scale)     | Normalized (this project)        |
| ------------------------- | -------------------------------- |
| Clone entire board on move | Update 2 column arrays + 1 card  |
| Duplicate card data       | Single source of truth in map    |
| Hard to PATCH one card    | O(1) lookup by `cardId`          |

**Interview answer:** "Columns store ordered ID lists. Cards live in `cardsById`. Moving a card splices IDs between columns and updates `card.columnId`."

---

## The `moveCard` Reducer

Single reducer handles **both** reorder scenarios:

```typescript
function applyMoveCard(state, { cardId, sourceColumnId, destinationColumnId, destinationIndex }) {
  // 1. Find source & destination columns
  // 2. Same column → arrayMove (from @dnd-kit/sortable)
  // 3. Different column → splice out, splice in, update card.columnId
}
```

### Same-column reorder

Uses `arrayMove` from `@dnd-kit/sortable` — same utility dnd-kit recommends.

### Cross-column move

1. Remove `cardId` from `sourceColumn.cardIds`
2. Insert at `destinationIndex` in `destinationColumn.cardIds`
3. Set `cardsById[cardId].columnId = destinationColumnId`
4. Bump `updatedAt` timestamp

---

## Drag & Drop Flow (@dnd-kit)

### Libraries

| Package              | Role                              |
| -------------------- | --------------------------------- |
| `@dnd-kit/core`      | DndContext, sensors, drag overlay |
| `@dnd-kit/sortable`  | useSortable, SortableContext      |
| `@dnd-kit/utilities` | CSS transform helpers             |

### Event split

| Event        | Handler        | Purpose                          |
| ------------ | -------------- | -------------------------------- |
| `dragStart`  | set active ID  | Show DragOverlay                 |
| `dragOver`   | `moveCard`     | Live cross-column preview        |
| `dragEnd`    | `moveCard`     | Final same-column reorder        |
| `dragCancel` | clear active   | Escape key / cancelled drag      |

**Why split dragOver vs dragEnd?**
- Cross-column: update on `dragOver` so cards jump columns while dragging
- Same-column: update on `dragEnd` to avoid thrashing on every pixel

### Sensors

```typescript
PointerSensor({ activationConstraint: { distance: 6 } })  // prevent accidental drags
KeyboardSensor({ coordinateGetter: sortableKeyboardCoordinates })  // a11y
```

---

## Component Responsibilities

| Component          | dnd-kit Hook     | Role                           |
| ------------------ | ---------------- | ------------------------------ |
| `KanbanBoard`      | `DndContext`     | Global drag context            |
| `KanbanColumnView` | `useDroppable`   | Column drop zone               |
|                  | `SortableContext`| Ordered card list per column   |
| `KanbanCard`       | `useSortable`    | Draggable card                 |
| `KanbanCardOverlay`| none             | Floating preview (no sortable) |

---

## Data Model

Mock data in **`src/data/kanban-board.json`**.

### Columns

| Field     | Type       | Description              |
| --------- | ---------- | ------------------------ |
| `id`      | string PK  | `col_todo`               |
| `title`   | string     | Display name             |
| `accent`  | string     | Theme color key          |
| `cardIds` | string[]   | Ordered card IDs         |

### Cards

| Field          | Type     | Description           |
| -------------- | -------- | --------------------- |
| `id`           | string PK| `card_001`            |
| `columnId`     | string FK| Current column        |
| `title`        | string   | Task title            |
| `description`  | string   | Body text             |
| `priority`     | enum     | low / medium / high   |
| `assigneeName` | string   | Denormalized          |
| `assigneeColor`| string   | Avatar color          |
| `labels`       | string[] | Tags                  |
| `storyPoints`  | number   | Estimate              |

---

## API Contract

### `GET /api/kanban/board`

Returns full board state (columns + cardsById).

### `PATCH /api/kanban/cards/:id/move` (real backend)

```json
{
  "sourceColumnId": "col_todo",
  "destinationColumnId": "col_progress",
  "destinationIndex": 2
}
```

Client dispatches `moveCard` optimistically, then PATCH. Rollback on failure.

---

## Performance

| Concern              | Approach                          |
| -------------------- | --------------------------------- |
| Re-renders on drag   | Redux Immer — only changed slices |
| Large boards         | Virtualize columns or cards       |
| Persist              | debounced localStorage or API     |
| Undo                 | Action history stack (extension)  |

---

## File Map

```
src/
├── hooks/useKanbanDragDrop.ts
├── lib/store/slices/kanbanSlice.ts   ★ moveCard
├── lib/utils/kanbanHelpers.ts
├── components/kanban/
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── KanbanCard.tsx
│   └── KanbanCardContent.tsx
└── data/kanban-board.json
```
