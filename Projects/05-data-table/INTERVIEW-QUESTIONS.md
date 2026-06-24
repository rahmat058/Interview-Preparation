# Interview Questions — Data Table

---

## Fundamentals

### Q1. What order should search, filter, sort, and pagination run in?

1. **Search** — broad text match
2. **Filter** — exact column matches
3. **Sort** — order the filtered set
4. **Paginate** — slice for current page

**Interview Answer:** "Filter before paginate — otherwise page 2 might show wrong rows after a filter change. Sort the full filtered set, then slice."

---

### Q2. Why reset page to 1 when search/filter/sort changes?

User on page 5 filters to 3 results → page 5 is empty.

**Interview Answer:** "Any query change that shrinks the result set should reset page to 1 — standard UX and prevents empty pages."

---

### Q3. Client-side vs server-side table logic?

| Client (≤1000 rows)     | Server (large datasets)   |
| ----------------------- | ------------------------- |
| Full dataset in memory  | DB indexes + SQL ORDER BY |
| Instant filter feel     | Network round-trip        |
| Same pure functions     | Same query param contract |

**Interview Answer:** "This project uses client-side mock with server-style API contract — production swaps the executor to SQL but keeps the same query params."

---

## Data Manipulation

### Q4. How do you implement multi-column sort?

**Single column (this project):** `sortBy` + `sortOrder` in query state.

**Multi-column:** `sorts: [{ column, order }]` — stable sort applying comparators in reverse priority order.

---

### Q5. How does global search work?

```typescript
rows.filter(row =>
  SEARCHABLE_FIELDS.some(field =>
    String(row[field]).toLowerCase().includes(term)
  )
)
```

**Interview Answer:** "Search across a whitelist of fields — never `JSON.stringify(row)` (security + noise)."

---

### Q6. How do you sort numbers vs strings?

```typescript
if (typeof a === 'number' && typeof b === 'number') return a - b
return String(a).localeCompare(String(b))
```

Salary must numeric-sort (`90000` before `100000`), not lexicographic (`"100000"` before `"90000"`).

---

### Q7. Write the pagination slice logic.

```typescript
const start = (page - 1) * pageSize
return rows.slice(start, start + pageSize)
```

```typescript
totalPages = Math.ceil(filteredTotal / pageSize)
```

---

## State Management

### Q8. Why store query params in Redux, not just local state?

- Single source of truth for API calls
- DevTools visibility
- Easy to sync URL query string (`?page=2&sort=name`)
- Thunk reads full query atomically

---

### Q9. Why debounce search but not filters?

Search fires on every keystroke. Dropdown filters fire once per selection.

**Interview Answer:** "300ms debounce on search — filters are discrete events, no debounce needed."

---

### Q10. How do you prevent race conditions on fast query changes?

1. **AbortController** on fetch (signal from RTK thunk)
2. Ignore stale responses (compare request ID)
3. RTK `condition` to cancel pending thunk

**In this project:** AbortController via thunk `signal`.

---

## UI / UX

### Q11. What accessibility attributes does a sortable table need?

- `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`
- `aria-sort="ascending|descending|none"` on sort buttons
- `aria-current="page"` on pagination
- `role="searchbox"` on search input

---

### Q12. How do you show loading without losing context?

- **Initial load:** full skeleton
- **Query change:** keep rows, add `opacity-60` overlay (this project)
- Never blank the table on refetch if old data is still valid

---

## Advanced

### Q13. How would you sync table state to the URL?

```typescript
// On query change:
navigate(`?${buildQueryString(query)}`, { replace: true })

// On mount:
dispatch(setQuery(parseSearchParams(location.search)))
```

Enables shareable filtered views.

---

### Q14. How would you add column-specific search?

Extend filters: `filters: { name: '', email: '', ... }` or `columnFilters: Record<string, string>`.

Apply per-column before global search.

---

### Q15. How would you virtualize a large table?

`@tanstack/react-virtual` on `<tbody>` rows — only render visible rows.

Sorting/filtering still runs on full dataset (or server). Virtualization is render-only.

---

### Q16. SQL equivalent of this pipeline?

```sql
SELECT * FROM employees
WHERE (name ILIKE '%term%' OR email ILIKE '%term%' ...)
  AND department = $dept
ORDER BY salary DESC
LIMIT 10 OFFSET 20;
```

**Interview Answer:** "Mock pipeline mirrors SQL clause order — WHERE, ORDER BY, LIMIT/OFFSET."

---

## Whiteboard Checklist

1. Query object: search, filters, sort, page, pageSize
2. Pipeline order: search → filter → sort → paginate
3. Reset page on query change (except page nav)
4. Debounce search
5. Pure functions for each step (unit testable)
6. `filteredTotal` vs `total` in meta
7. AbortController for in-flight requests
