# Architecture — Data Table (GridLens)

## Overview

GridLens demonstrates **server-style table queries** with client-side mock execution — the same pattern admin dashboards and HR systems use. Data manipulation is isolated in **pure functions** so sorting, filtering, and pagination are testable without React.

```
┌─────────────────────────────────────────────────────────────────┐
│  TableApp                                                        │
│    TableToolbar (debounced search)                              │
│    TableFilters (department, role, status, location)            │
│    DataTable → TableHeaderRow (sort) + TableRow × N             │
│    TablePagination (page + pageSize)                            │
├─────────────────────────────────────────────────────────────────┤
│  Redux table slice — query params + result rows                 │
│    loadTableData thunk → reads query from state                 │
├─────────────────────────────────────────────────────────────────┤
│  tableQuery.ts (pure pipeline)                                  │
│    applySearch → applyFilters → applySort → paginateRows        │
├─────────────────────────────────────────────────────────────────┤
│  tableApi.ts — MOCK runs pipeline · REAL GET /api/employees     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Query Pipeline

Order matters — each step narrows/transforms the dataset:

| Step | Function        | Input        | Output       |
| ---- | --------------- | ------------ | ------------ |
| 1    | `applySearch`   | 80 rows      | ~N rows      |
| 2    | `applyFilters`  | searched     | ~M rows      |
| 3    | `applySort`     | filtered     | sorted copy  |
| 4    | `paginateRows`  | sorted       | page slice   |

**Interview answer:** "Search first (broadest), then exact filters, then sort the filtered set, then slice for pagination. Never paginate before filter — you'd show wrong totals."

---

## State Design

```typescript
interface TableQuery {
  search: string
  sortBy: SortableColumn
  sortOrder: 'asc' | 'desc'
  filters: { department, role, status, location }
  page: number
  pageSize: number
}
```

### Reset rules

| Action           | Resets page to 1? |
| ---------------- | ----------------- |
| Search change    | ✅                |
| Filter change    | ✅                |
| Sort change      | ✅                |
| Page size change | ✅                |
| Page nav only    | ❌                |

---

## Redux Flow

```
User clicks "Department: Engineering"
  → dispatch(setFilter({ key: 'department', value: 'Engineering' }))
  → query.page = 1
  → useTableQueryLoader detects query change
  → dispatch(loadTableData())
  → tableApi.fetchTableData(query)
  → queryEmployees(allRows, query)
  → fulfilled: rows + resultMeta
```

### Debounced search

Local `searchInput` state → `useDebouncedValue(300ms)` → `dispatch(setSearch)` → triggers reload.

Prevents API call on every keystroke (same pattern as Project #1).

---

## API Contract

### `GET /api/employees`

| Param        | Type   | Description              |
| ------------ | ------ | ------------------------ |
| `page`       | number | 1-based page             |
| `pageSize`   | number | 10, 25, or 50            |
| `sortBy`     | string | Column key               |
| `sortOrder`  | string | `asc` \| `desc`          |
| `search`     | string | Global search term       |
| `department` | string | Exact match or empty     |
| `role`       | string | Exact match or empty     |
| `status`     | string | Exact match or empty     |
| `location`   | string | Exact match or empty     |

**Response `200 OK`**

```json
{
  "meta": {
    "total": 80,
    "filteredTotal": 12,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2,
    "sortBy": "name",
    "sortOrder": "asc"
  },
  "data": [ /* EmployeeRecord[] */ ]
}
```

---

## Sorting Implementation

- Header click → `toggleSort(column)`
- Same column: flip `asc` ↔ `desc`
- New column: set `sortBy`, reset to `asc`
- Numeric sort for `salary`; string `localeCompare` for text
- `aria-sort` on headers for accessibility

---

## Data Model

80 records in **`src/data/employees.json`**.

| Field              | Type    | Searchable | Filterable | Sortable |
| ------------------ | ------- | ---------- | ---------- | -------- |
| `name`             | string  | ✅         | —          | ✅       |
| `email`            | string  | ✅         | —          | ✅       |
| `department`       | string  | ✅         | ✅         | ✅       |
| `role`             | string  | ✅         | ✅         | ✅       |
| `status`           | enum    | —          | ✅         | ✅       |
| `location`         | string  | ✅         | ✅         | ✅       |
| `salary`           | number  | —          | —          | ✅       |
| `joinDate`         | date    | —          | —          | ✅       |
| `performanceScore` | number  | —          | —          | —        |

---

## Client vs Server

| Approach              | This project                         |
| --------------------- | ------------------------------------ |
| **Client-side**       | All 80 rows in JSON, pipeline in JS  |
| **Server-side (prod)**| Same query params, DB runs SQL       |

Mock API simulates latency so loading states are realistic. Swap `tableApi.ts` to real fetch — components unchanged.

---

## File Map

```
src/
├── lib/utils/tableQuery.ts      ★ pure data manipulation
├── lib/store/slices/tableSlice.ts
├── hooks/useDebouncedValue.ts
├── hooks/useTableQueryLoader.ts
├── api/tableApi.ts
└── components/table/
    ├── TableHeaderRow.tsx
    ├── TableFilters.tsx
    ├── TablePagination.tsx
    └── DataTable.tsx
```
