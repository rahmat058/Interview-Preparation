# Interview Questions — Autocomplete Search

Questions commonly asked when you present this project in a React machine-coding or frontend interview.

---

## Fundamentals

### Q1. What is debouncing and why use it in autocomplete?

**Theory:** Debouncing delays executing a function until the user stops triggering it for a set time (here, 300ms).

**Why:** Without debounce, every keystroke fires an API call — wasteful, slow, and can cause race conditions.

**In this project:** `useDebouncedSearch` updates `debouncedQuery` 300ms after `query` stops changing. Only `debouncedQuery` triggers `fetchSearchResults`.

**Interview Answer:** "Debounce waits until typing pauses before searching — reduces API load and prevents out-of-order responses."

---

### Q2. How do you prevent stale API responses?

**Theory:** When request B finishes after request A, you must not show A's results for query B.

**Solutions:**

1. **AbortController** — cancel in-flight request (used via RTK `signal`)
2. **Request ID** — ignore responses whose ID doesn't match latest
3. **React Query / SWR** — built-in deduplication

**In this project:** `fetchSearchResults` passes `signal` to `searchApi`. New debounced query aborts the previous thunk.

**Interview Answer:** "Abort the previous fetch when a new query starts — RTK async thunks expose `signal` for exactly this."

---

### Q3. Explain controlled vs uncontrolled inputs.

**Theory:**

- **Controlled:** React state is the single source of truth (`value` + `onChange`)
- **Uncontrolled:** DOM holds state (`ref` + `defaultValue`)

**In this project:** Controlled — `query` lives in Redux, input reflects `state.search.query`.

**Interview Answer:** "Autocomplete needs controlled input so debounce, clear, and selection all sync with Redux."

---

## Component Design

### Q4. How would you structure an autocomplete component?

**Recommended split:**

| Component            | Responsibility                      |
| -------------------- | ----------------------------------- |
| `AutocompleteSearch` | Combobox wrapper, keyboard handlers |
| `SearchDropdown`     | Panel, loading/empty/error          |
| `SearchResultItem`   | Single row, highlight match         |
| `useDebouncedSearch` | Side effect: debounce + fetch       |

**Interview Answer:** "Container handles keyboard and ARIA; dropdown handles states; items are presentational — easy to test in isolation."

---

### Q5. What ARIA roles does an autocomplete need?

| Element       | Role / Attribute                                                   |
| ------------- | ------------------------------------------------------------------ |
| Input wrapper | `role="combobox"` `aria-expanded` `aria-haspopup="listbox"`        |
| Input         | `aria-autocomplete="list"` `aria-controls` `aria-activedescendant` |
| Dropdown list | `role="listbox"`                                                   |
| Each option   | `role="option"` `aria-selected`                                    |

**Interview Answer:** "Combobox + listbox pattern per WAI-ARIA — `activedescendant` tracks keyboard highlight without moving DOM focus."

---

### Q6. How do you implement keyboard navigation?

| Key       | Handler                           |
| --------- | --------------------------------- |
| ArrowDown | `highlightedIndex++` (wrap)       |
| ArrowUp   | `highlightedIndex--` (wrap)       |
| Enter     | Select item at `highlightedIndex` |
| Escape    | Close dropdown                    |

**Gotcha:** Call `e.preventDefault()` on arrows so cursor doesn't jump in input.

**Interview Answer:** "Track highlight index in state, preventDefault on arrows, select on Enter — same pattern as native `<select>`."

---

## State Management

### Q7. Redux vs useState for autocomplete?

| useState/useReducer | Redux                |
| ------------------- | -------------------- |
| Single component    | Shared across app    |
| Simpler             | DevTools, middleware |
| Less boilerplate    | Interview signal     |

**Interview Answer:** "For one input, local state is fine. Redux here demonstrates production patterns and keeps API status debuggable."

---

### Q8. What goes in Redux vs local state?

| Redux                        | Local                   |
| ---------------------------- | ----------------------- |
| `query`, `results`, `status` | —                       |
| `highlightedIndex`           | Could be local          |
| `selectedItem`               | If only parent needs it |

**Interview Answer:** "Server-derived data and user intent (query, selection) in Redux; ephemeral UI like hover could stay local."

---

## Performance

### Q9. How would you optimize for 10,000+ results?

1. **Server-side search** — never send 10k rows to client
2. **Pagination / limit** — return top 8–20 matches
3. **Virtualization** — `react-window` if showing many rows
4. **Web Worker** — client-side index for offline
5. **Memoization** — `React.memo` on `SearchResultItem`

**Interview Answer:** "Autocomplete should never load all rows — server ranks and limits; client virtualizes only if showing a large dropdown."

---

### Q10. What is the difference between debounce and throttle?

|          | Debounce     | Throttle                  |
| -------- | ------------ | ------------------------- |
| Fires    | After pause  | At most once per interval |
| Use case | Search input | Scroll, resize            |

**Interview Answer:** "Debounce waits for typing to stop; throttle fires on a fixed schedule — search uses debounce."

---

## API & Data

### Q11. How is mock data structured for real DB migration?

Each `SearchIndexItem` maps 1:1 to a `search_index` row:

- Prefixed IDs (`prd_`, `cty_`, `usr_`)
- `entityType` → `entity_type` ENUM
- `metadata` JSONB for polymorphic fields
- `isActive` → soft delete
- ISO timestamps

**Interview Answer:** "Mock fields match the production schema so swapping mock for API is a one-line env change."

---

### Q12. How would you implement the backend search?

**Options:**

1. **PostgreSQL** — `to_tsvector` + `ts_rank`
2. **Elasticsearch** — inverted index, fuzzy match
3. **Algolia / Typesense** — managed search SaaS

**Ranking factors:** prefix match > contains > tag match > popularity score.

**Interview Answer:** "Postgres full-text for MVP; Elasticsearch when you need fuzzy search, facets, and sub-50ms at scale."

---

## UX

### Q13. What loading states should autocomplete show?

1. **Debouncing** — subtle spinner in input (user still typing)
2. **Fetching** — spinner + "Searching…"
3. **Empty** — friendly message + suggestions
4. **Error** — retry option
5. **Min length** — "Type at least 2 characters"

**Interview Answer:** "Distinguish debouncing from fetching — users should know the app is waiting for them vs the server."

---

### Q14. When should the dropdown close?

- Click outside
- Escape
- Tab away
- Item selected
- Input cleared

**Interview Answer:** "Close on select, escape, and outside click — keep open while navigating with arrows."

---

## Advanced / Senior

### Q15. How would you add recent searches?

1. `localStorage` array of `{ query, timestamp }`
2. Show when input focused and `query === ''`
3. Dedupe, cap at 5, clear option

**Interview Answer:** "Persist recents in localStorage, show on focus before typing — no API needed."

---

### Q16. How would you test this in an interview?

```typescript
// Vitest — reducer
expect(searchReducer(state, setQuery("sony")).query).toBe("sony");

// RTL — keyboard
fireEvent.keyDown(input, { key: "ArrowDown" });
fireEvent.keyDown(input, { key: "Enter" });
expect(screen.getByText("Selected result")).toBeInTheDocument();
```

**Interview Answer:** "Unit test reducers and debounce; integration test keyboard + selection with Testing Library."

---

### Q17. Trade-offs of Framer Motion here?

| Pros                       | Cons                      |
| -------------------------- | ------------------------- |
| Declarative animations     | Bundle size (~30kb)       |
| `AnimatePresence` for exit | Overkill for tiny widgets |
| Stagger children           | CSS can do simple fades   |

**Interview Answer:** "Framer Motion for dropdown enter/exit and list stagger — for production at scale, consider CSS for simple cases."

---

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria                  | What to demonstrate in **QueryLens**                    | Example from this project                            |
| ------------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| **Component structure**   | Combobox + list split; container vs presentational      | `AutocompleteSearch` vs `SearchResultItem`           |
| **State management**      | Async thunk + abort; debounced vs raw query             | `fetchSearchResults` aborts when query changes       |
| **Code readability**      | Debounce hook reusable; clear naming                    | `useDebouncedSearch(300)` — single responsibility    |
| **Edge cases**            | Stale responses, empty query, min length, rapid typing  | AbortController + `query.length < 2` guard           |
| **Performance awareness** | Debounce, limit rendered results, avoid re-render storm | Only search on `debouncedQuery`, not every keystroke |

**Strong signal:** You mention race conditions before the interviewer does.

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **QueryLens**:

### Virtualization

**Ask:** "Index returns 2,000 matches."

Cap API at 50 results **and** virtualize dropdown with `@tanstack/react-virtual` — render ~10 DOM nodes regardless of total.

**Interview Answer:** "I'd cap server results and virtualize the dropdown list so only visible rows mount. Search logic stays the same — virtualization is a render-layer fix."

**Example:** Search `"react"` → API returns 50 matches → dropdown mounts **~8 `<li>` nodes** at a time, not 50.

---

### Optimistic updates

**Ask:** "Show selection immediately while detail panel loads."

Set `selectedItem` from list data instantly; fetch full record in background and merge.

**Interview Answer:** "List items already have enough for the panel — dispatch `setSelectedItem` immediately, then merge API fields when the detail fetch resolves. Roll back selection if fetch fails."

**Example:** Click **John Smith** in results → side panel shows name + email instantly → full bio appears 200ms later when detail API returns.

---

### Undo functionality

**Ask:** "User cleared search accidentally."

`Cmd+Z` restores last query from ref, or toast: "Search cleared — Undo".

**Interview Answer:** "Keep `lastQuery` in a ref before clear. Either restore on Undo toast or keyboard shortcut — no need to re-fetch if results are still cached in Redux."

**Example:** User clears `"typescript hooks"` → toast **"Search cleared — Undo"** → Undo restores query + cached results without a new API call.

---

### Accessibility support

**Ask:** "Make it WCAG compliant."

WAI-ARIA combobox pattern (partially implemented): `aria-activedescendant`, `aria-expanded`, active option `aria-selected`. Test with VoiceOver — arrow keys must move focus _and_ highlight.

**Interview Answer:** "Follow the WAI-ARIA combobox pattern: input has `role=combobox`, list `role=listbox`, options `role=option`. Keyboard and screen reader must stay in sync — test with VoiceOver, not just visual highlight."

**Example:** Press ↓ three times → VoiceOver reads **option 3** — blue highlight and spoken label always match.

---

### Performance constraints

**Ask:** "Debounce too slow for power users."

Adaptive debounce: 150ms after first char, 300ms after pause. Or cancel debounce on Enter — search immediately.

**Interview Answer:** "I'd shorten debounce after the first character or flush immediately on Enter. Wrap `SearchResultItem` in `React.memo` with stable `onSelect` from `useCallback` to avoid re-rendering the full list every keystroke."

**Example:** Type `"react"` quickly → one search fires on pause at `"react"`, not on `"r"`, `"re"`, `"rea"`, `"reac"`.

**Ask:** "Re-render entire list every keystroke?"

`React.memo(SearchResultItem)` with stable `onSelect` via `useCallback`.

**Interview Answer:** "Memo list items and stabilize callbacks — highlight index changes should only re-render the previously active and newly active rows if props are compared narrowly."

**Example:** Highlight moves row 2 → row 3 → only those **two** `SearchResultItem` components re-render, not all 50.

---

## Quick Revision Checklist

- [ ] Debounce 300ms
- [ ] Abort stale requests
- [ ] combobox + listbox ARIA
- [ ] Arrow / Enter / Esc keyboard
- [ ] Loading, empty, error states
- [ ] Mock API → real API swap via env
- [ ] DB-shaped mock data
- [ ] Click outside to close

---

## One-Liner Answers (rapid fire)

| Question          | Answer                                                          |
| ----------------- | --------------------------------------------------------------- |
| Min query length? | 2 chars — avoids noisy single-letter queries                    |
| Debounce delay?   | 300ms — balance responsiveness vs API load                      |
| Why Redux?        | Demonstrates global state + DevTools; swappable with useReducer |
| Ranking?          | Prefix > contains > tags > popularity                           |
| Accessibility?    | WAI-ARIA combobox pattern + keyboard parity                     |
