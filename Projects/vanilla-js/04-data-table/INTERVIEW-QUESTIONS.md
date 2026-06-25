# Interview Questions — Data Table

## CRUD & API design

**Q: How would you expose this CRUD over HTTP?**  
`GET /employees?search=&department=&page=1`, `POST /employees`, `PATCH /employees/:id`, `DELETE /employees/:id`. Validate on server; return updated row + list meta.

**Q: Optimistic updates vs pessimistic?**  
Optimistic for delete/edit (rollback on error); pessimistic for create if ID is server-generated.

## State & data flow

**Q: Why a central store instead of mutating the DOM directly?**  
Single source of truth; filters/sort/page stay in sync after CRUD; same pattern as Redux/Zustand.

**Q: When does localStorage make sense vs a backend?**  
Demos, offline-first drafts, user preferences — not authoritative business data at scale.

## Table UX

**Q: How do you keep sorting accessible?**  
`aria-sort` on headers, keyboard-focusable sort buttons, visible sort direction.

**Q: Server-side vs client-side pagination?**  
Client-side for small datasets (< few thousand rows); server-side when query + count are expensive.

## Testing

**Q: What do you unit test here?**  
`tableQuery.js` (pure), reducer CRUD cases, optionally integration tests for modal submit.

## Vanilla vs React

**Q: What's harder without React?**  
Coordinating partial DOM updates — we repaint sections on every store change; React diffs automatically.

**Q: What did you prove by building this in vanilla JS?**  
You understand the data pipeline and DOM contracts that React abstracts.
