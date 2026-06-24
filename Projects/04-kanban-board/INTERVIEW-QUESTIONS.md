# Interview Questions — Kanban Board

---

## Fundamentals

### Q1. Why use @dnd-kit over react-beautiful-dnd?

| @dnd-kit               | react-beautiful-dnd     |
| ---------------------- | ----------------------- |
| Actively maintained    | Deprecated by Atlassian |
| Modular packages       | Monolithic              |
| React 18/19 compatible | Strict mode issues      |
| Built-in keyboard a11y | Good but unmaintained   |

**Interview Answer:** "@dnd-kit is the modern standard — modular, maintained, and works with current React. hello-pangea/dnd is a valid fork of rbd if the team already uses that API."

---

### Q2. How does drag-and-drop kanban differ from a sortable list?

| Sortable list       | Kanban board                   |
| ------------------- | ------------------------------ |
| Single container    | Multiple columns (containers)  |
| Reorder only        | Reorder + move between columns |
| One SortableContext | One per column + droppable     |

**Interview Answer:** "Kanban is multi-container sortable. Each column is a SortableContext AND a droppable zone. Cards move within and across columns."

---

## State Management

### Q3. Why normalize kanban state?

```typescript
// ❌ Nested — clone entire board on every move
{ columns: [{ cards: [{ id, title, ... }] }] }

// ✅ Normalized — surgical updates
{ columns: [{ cardIds: ['a','b'] }], cardsById: { a: {...} } }
```

**Interview Answer:** "Normalized state lets you splice card IDs between columns without deep cloning. Card data lives once in `cardsById`."

---

### Q4. Walk through the `moveCard` reducer.

1. Find source column → get `sourceIndex`
2. **Same column:** `arrayMove(cardIds, sourceIndex, destIndex)`
3. **Different column:**
   - `sourceColumn.cardIds.splice(sourceIndex, 1)`
   - `destColumn.cardIds.splice(destIndex, 0, cardId)`
   - `cardsById[cardId].columnId = destColumnId`

**Interview Answer:** "One reducer, two paths. Same column uses arrayMove. Cross-column splices IDs and updates the card's columnId FK."

---

### Q5. Why handle dragOver AND dragEnd separately?

- **dragOver:** Cross-column live preview (card jumps columns while dragging)
- **dragEnd:** Same-column final reorder (avoid thrashing every pixel)

**Interview Answer:** "Splitting events prevents double-updates and gives Trello-like cross-column feedback during drag."

---

### Q6. How do you prevent duplicate cards after a move?

1. Remove from source **before** inserting into destination
2. Guard: `if (sourceIndex === destIndex) return`
3. Use `cardId` as unique key — never duplicate IDs in arrays

**Interview Answer:** "Always splice out first, then splice in. Immer makes this safe in Redux Toolkit."

---

## @dnd-kit Specifics

### Q7. What is `SortableContext`?

Wraps a list of sortable items. Provides shared context for `useSortable` hooks inside.

```tsx
<SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
  {cards.map((card) => (
    <KanbanCard key={card.id} card={card} />
  ))}
</SortableContext>
```

**Interview Answer:** "Each column gets its own SortableContext with that column's card IDs. Cards use useSortable with matching IDs."

---

### Q8. What is `useDroppable` for?

Makes empty columns (or column bodies) valid drop targets when they have no cards.

**Interview Answer:** "Sortable handles card-on-card drops. useDroppable on the column container handles drops on empty space."

---

### Q9. Why `activationConstraint: { distance: 6 }`?

Prevents accidental drags when the user intended to click or scroll.

**Interview Answer:** "Pointer must move 6px before drag starts — separates click from drag intent."

---

## Complex Updates

### Q10. How would you add optimistic updates with API persistence?

```typescript
// 1. dispatch(moveCard(...)) immediately
// 2. PATCH /api/kanban/cards/:id/move
// 3. On failure: dispatch(revertMove(...)) or reload board
```

**Interview Answer:** "Optimistic Redux update first, PATCH in background, rollback on 4xx/5xx."

---

### Q11. How would you implement undo?

Keep a history stack of board snapshots or inverse move actions:

```typescript
{ past: KanbanState[], present: KanbanState, future: KanbanState[] }
```

**Interview Answer:** "Store inverse move payloads `{ cardId, from, to, fromIndex }` — undo dispatches the reverse move."

---

### Q12. How would you add WIP limits (e.g. max 3 in Progress)?

In `applyMoveCard`, before insert:

```typescript
if (destColumn.id === "col_progress" && destColumn.cardIds.length >= 3) return;
```

Show toast if blocked.

---

## Accessibility

### Q13. Does @dnd-kit support keyboard drag?

Yes — `KeyboardSensor` + `sortableKeyboardCoordinates`.

**Interview Answer:** "Enable KeyboardSensor on DndContext. Users can focus a card and use space/arrows to move — important for a11y interviews."

---

## Advanced

### Q14. When would you virtualize a kanban board?

100+ cards per column → `@tanstack/react-virtual` on card list.

**Interview Answer:** "Virtualize the card list inside each column. DnD still works — dnd-kit supports virtual lists with measured items."

---

### Q15. Redux vs Zustand for kanban?

| Redux Toolkit        | Zustand                |
| -------------------- | ---------------------- |
| DevTools, middleware | Lighter boilerplate    |
| Interview standard   | Fine for side projects |
| Time-travel undo     | Manual history         |

**Interview Answer:** "Redux for interview demos — shows you know normalized state and reducers. Zustand is fine if the team prefers it."

---

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria                  | What to demonstrate in **FlowBoard**                   | Example from this project                           |
| ------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| **Component structure**   | Board → column → card; DnD hook isolated               | `useKanbanDragDrop` owns drag logic                 |
| **State management**      | Normalized `cardsById` + column `cardIds`              | Single `moveCard` reducer — no duplicated card data |
| **Code readability**      | `applyMoveCard` handles same/cross column              | One function, two code paths clearly named          |
| **Edge cases**            | Drop on empty column, drag to same index, invalid over | `resolveDropColumnId`, early return if same index   |
| **Performance awareness** | O(1) card lookup; DragOverlay not full re-render       | `cardsById[cardId]` — not find in array             |

**Strong signal:** You draw normalized state on whiteboard before touching @dnd-kit.

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **FlowBoard**:

### Virtualization

**Ask:** "Column has 200 cards."

Virtualize card list per column with `@dnd-kit` + virtual list integration — measure item height, drag still works with sortable virtual items.

**Interview Answer:** "Use `@tanstack/react-virtual` inside each column with fixed or measured card height. @dnd-kit supports virtual sortables — drag overlay stays the same. Normalized state unchanged."

**Example:** **Done** column has 200 cards → only **~10 card DOM nodes** exist → drag overlay still previews the full card on drop.

---

### Optimistic updates

**Ask:** "Move card before API confirms."

Apply `moveCard` on `dragEnd` immediately (already local). Production: PATCH in background, revert on 409 conflict.

**Interview Answer:** "This project already moves optimistically in Redux on drop. Production adds PATCH async — on 409 conflict, revert with inverse `moveCard` and show error toast."

**Example:** Drop **"Fix login bug"** into **Review** → card moves instantly → PATCH returns 409 → card snaps back to **Todo** + error toast.

---

### Undo functionality

**Ask:** "Undo last drag."

Store `{ cardId, fromCol, fromIndex, toCol, toIndex }` in ref; `Cmd+Z` or toast Undo dispatches inverse `moveCard`.

**Interview Answer:** "Keep last move payload in a ref. Undo dispatches the reverse move — same reducer, swapped source/destination. Toast gives non-power-users a visible affordance."

**Example:** Drag card from **Todo index 2** → **Done** → toast **Undo** → inverse `moveCard` puts it back at **Todo index 2**.

---

### Accessibility support

**Ask:** "Keyboard-only reorder."

@dnd-kit KeyboardSensor (partially used). Announce moves: `aria-live` "Card X moved to In Progress". Focus card after drop.

**Interview Answer:** "Enable KeyboardSensor, focus the dropped card after dragEnd, announce column change via `aria-live`. Provide non-drag alternative: 'Move to…' menu for accessibility compliance."

**Example:** Keyboard user picks card, presses **Space**, arrows to **In Progress** → live region: **"Fix login bug moved to In Progress"**.

---

### Performance constraints

**Ask:** "dragOver fires 60 times/sec."

Throttle `handleDragOver` cross-column updates, or only commit on `dragEnd` for same-column (this project updates on dragOver for cross-column — mention trade-off).

**Interview Answer:** "Cross-column preview needs dragOver updates but I'd throttle to rAF or only update when `over` column changes. Same-column reorder can wait until dragEnd to reduce reducer churn."

**Example:** Drag across 3 columns → reducer fires only when `over.id` **changes column**, not all 60 dragOver events per second.

---

## Whiteboard Checklist

1. Normalized state: `columns[].cardIds` + `cardsById`
2. @dnd-kit: DndContext → SortableContext per column → useSortable per card
3. useDroppable on column for empty drops
4. `moveCard` reducer with same/cross-column paths
5. dragOver for cross-column, dragEnd for same-column
6. DragOverlay for floating preview
7. Optimistic update + PATCH for production story
