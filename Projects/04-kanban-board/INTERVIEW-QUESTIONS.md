# Interview Questions — Kanban Board

---

## Fundamentals

### Q1. Why use @dnd-kit over react-beautiful-dnd?

| @dnd-kit              | react-beautiful-dnd        |
| --------------------- | -------------------------- |
| Actively maintained   | Deprecated by Atlassian    |
| Modular packages      | Monolithic                 |
| React 18/19 compatible| Strict mode issues         |
| Built-in keyboard a11y| Good but unmaintained      |

**Interview Answer:** "@dnd-kit is the modern standard — modular, maintained, and works with current React. hello-pangea/dnd is a valid fork of rbd if the team already uses that API."

---

### Q2. How does drag-and-drop kanban differ from a sortable list?

| Sortable list     | Kanban board                    |
| ----------------- | ------------------------------- |
| Single container  | Multiple columns (containers)   |
| Reorder only      | Reorder + move between columns  |
| One SortableContext | One per column + droppable  |

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
  {cards.map(card => <KanbanCard key={card.id} card={card} />)}
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
if (destColumn.id === 'col_progress' && destColumn.cardIds.length >= 3) return
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

| Redux Toolkit        | Zustand              |
| -------------------- | -------------------- |
| DevTools, middleware | Lighter boilerplate  |
| Interview standard   | Fine for side projects |
| Time-travel undo     | Manual history       |

**Interview Answer:** "Redux for interview demos — shows you know normalized state and reducers. Zustand is fine if the team prefers it."

---

## Whiteboard Checklist

1. Normalized state: `columns[].cardIds` + `cardsById`
2. @dnd-kit: DndContext → SortableContext per column → useSortable per card
3. useDroppable on column for empty drops
4. `moveCard` reducer with same/cross-column paths
5. dragOver for cross-column, dragEnd for same-column
6. DragOverlay for floating preview
7. Optimistic update + PATCH for production story
