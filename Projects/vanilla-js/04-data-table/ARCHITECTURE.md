# Architecture — Data Table (Vanilla JS)

## Layers

```
main.js
  └── views/render.js     # DOM rendering + event binding
  └── store/index.js      # State + CRUD reducers + localStorage
  └── lib/tableQuery.js   # Pure query pipeline (testable)
  └── api/employeesApi.js # Simulated fetch with latency
```

## Query pipeline

```
all employees
  → applySearch(search)
  → applyFilters(filters)
  → applySort(sortBy, sortOrder)
  → paginateRows(page, pageSize)
```

Selectors run on every `store.subscribe` — same pattern as Redux reselect without memoization (fine for ~100 rows).

## CRUD flow

| Action | Store type | Persistence |
| --- | --- | --- |
| Create | `employees/create` | `localStorage` immediately |
| Update | `employees/update` | `localStorage` immediately |
| Delete | `employees/delete` | `localStorage` immediately |

Initial load reads JSON once; if `localStorage` has data, it wins (user mutations preserved across refresh).

## UI patterns

- **`<dialog>`** for create/edit and delete confirmation (native focus trap)
- **Debounced search** — 300ms, same as React GridLens
- **Incremental paint** — toolbar, head, body, pagination repainted on state change

## Scaling to React / Next.js

- `tableQuery.js` → shared package or copy to `lib/utils/tableQuery.ts`
- Store → Redux Toolkit slice or Zustand with immer
- `render.js` → `DataTable.tsx` + React Testing Library
- API → Server Actions or `fetch` in Route Handlers with real pagination at DB level
