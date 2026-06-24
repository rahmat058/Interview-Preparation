# Architecture — Autocomplete Search (QueryLens)

## Overview

QueryLens is a client-side autocomplete search demo designed for **interview machine-coding rounds** and as a **production-ready scaffold**. The architecture separates UI, state, API contract, and mock data so you can swap the mock layer for a real backend without rewriting components.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Vite SPA)                       │
├─────────────────────────────────────────────────────────────────┤
│  SearchApp                                                       │
│    ├── EntityTypeFilter ──► Redux (entityTypeFilter)            │
│    ├── AutocompleteSearch                                        │
│    │     ├── SearchInput (controlled by Redux query)            │
│    │     └── SearchDropdown (results + keyboard nav)            │
│    └── SelectedItemPanel (on select)                            │
├─────────────────────────────────────────────────────────────────┤
│  useDebouncedSearch hook                                         │
│    query ──[300ms debounce]──► debouncedQuery                   │
│    debouncedQuery ──► fetchSearchResults (RTK async thunk)      │
├─────────────────────────────────────────────────────────────────┤
│  searchApi.ts                                                    │
│    MOCK: filter + rank + artificial latency                     │
│    REAL: fetch GET /api/search?...                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Future: Express / Next API      │
              │  PostgreSQL + Elasticsearch    │
              └───────────────────────────────┘
```

---

## Data Model

Mock data lives in **`src/data/search-index.json`** (55 records) and mirrors a production DB export.

### JSON file structure

```json
{
  "meta": {
    "schemaVersion": "1.0.0",
    "collection": "search_index",
    "count": 55,
    "breakdown": { "product": 20, "city": 18, "user": 17 },
    "lastUpdated": "2026-06-24T..."
  },
  "data": [
    /* SearchIndexItem[] */
  ]
}
```

- **Loader:** `src/data/mockSearchIndex.ts` imports the JSON and exports `MOCK_SEARCH_INDEX`
- **Regenerate:** `npm run generate:data` → `scripts/generate-search-index.mjs`

Mock data mirrors a production `search_index` table. Each row is polymorphic by `entity_type`.

### `search_index` (conceptual schema)

| Column             | Type             | Description                            |
| ------------------ | ---------------- | -------------------------------------- |
| `id`               | `VARCHAR` PK     | Prefixed UUID (`prd_`, `cty_`, `usr_`) |
| `entity_type`      | `ENUM`           | `product` \| `city` \| `user`          |
| `title`            | `VARCHAR`        | Display name (indexed for full-text)   |
| `slug`             | `VARCHAR` UNIQUE | URL-safe identifier                    |
| `description`      | `TEXT`           | Longer searchable text                 |
| `category`         | `VARCHAR`        | Grouping label                         |
| `tags`             | `TEXT[]`         | Keyword array for matching             |
| `popularity_score` | `INT`            | Ranking boost (0–100)                  |
| `is_active`        | `BOOLEAN`        | Soft-delete flag                       |
| `thumbnail_url`    | `VARCHAR` NULL   | Optional image                         |
| `metadata`         | `JSONB`          | Entity-specific fields                 |
| `created_at`       | `TIMESTAMPTZ`    | Record creation                        |
| `updated_at`       | `TIMESTAMPTZ`    | Last index update                      |

### Metadata by entity type

**Product (`metadata`)**

```json
{
  "sku": "SNY-XM5-BLK",
  "price": 349.99,
  "currency": "USD",
  "stockQuantity": 142,
  "brand": "Sony"
}
```

**City (`metadata`)**

```json
{
  "countryCode": "US",
  "countryName": "United States",
  "region": "New York",
  "population": 8336817,
  "timezone": "America/New_York",
  "iataCode": "NYC"
}
```

**User (`metadata`)**

```json
{
  "email": "sarah.chen@querylens.io",
  "username": "sarahchen",
  "role": "editor",
  "department": "Engineering",
  "avatarUrl": null
}
```

TypeScript definitions live in `src/lib/types/search.ts`.

---

## API Contract

### `GET /api/search`

**Query parameters**

| Param        | Type   | Default  | Description                                |
| ------------ | ------ | -------- | ------------------------------------------ |
| `q`          | string | required | Search query (min 2 chars client-side)     |
| `limit`      | number | 8        | Max results per page                       |
| `offset`     | number | 0        | Pagination offset                          |
| `entityType` | string | all      | Filter: `product`, `city`, `user`, or omit |

**Response `200 OK`**

```json
{
  "data": [
    /* SearchIndexItem[] */
  ],
  "meta": {
    "query": "sony",
    "total": 1,
    "limit": 8,
    "offset": 0,
    "tookMs": 42,
    "hasMore": false
  }
}
```

**Mock behaviour**

- Latency: 250–650ms random delay
- Ranking: title prefix > title contains > tags > description + popularity boost
- Only `isActive: true` rows returned

**Swap point:** `src/api/searchApi.ts` — set `VITE_USE_MOCK_API=false`.

---

## State Management (Redux)

### `search` slice

| Field              | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `query`            | Live input value (immediate)                   |
| `debouncedQuery`   | Value after 300ms debounce (triggers fetch)    |
| `results`          | Current suggestion list                        |
| `meta`             | API metadata (total, tookMs)                   |
| `status`           | `idle` \| `loading` \| `succeeded` \| `failed` |
| `isDropdownOpen`   | Panel visibility                               |
| `highlightedIndex` | Keyboard focus index (-1 = none)               |
| `selectedItem`     | User's chosen result                           |
| `entityTypeFilter` | Client filter sent to API                      |

### Async thunk: `fetchSearchResults`

- Uses RTK `signal` for **request cancellation** on rapid typing
- Aborted requests do not flip state to `failed`

### Why Redux here?

Interviewers often ask to demonstrate global state. For a single autocomplete, `useState` + `useReducer` would suffice — Redux shows familiarity with production patterns and makes DevTools debugging easy.

---

## Component Hierarchy

```
App
├── Header
├── SearchApp
│   ├── EntityTypeFilter
│   ├── AutocompleteSearch
│   │   ├── [input + clear button]
│   │   └── SearchDropdown
│   │       └── SearchResultItem × N
│   └── SelectedItemPanel (conditional)
└── Footer
```

---

## Key UX Flows

### 1. Typing flow

```
User types "s"     → query updated, dropdown opens, "type 2 chars" hint
User types "so"    → debounce starts
300ms passes       → debouncedQuery = "so", fetch pending, spinner
API returns        → results render with stagger animation, index 0 highlighted
```

### 2. Keyboard flow

| Key     | Action                      |
| ------- | --------------------------- |
| `↓`     | Move highlight down (wraps) |
| `↑`     | Move highlight up (wraps)   |
| `Enter` | Select highlighted item     |
| `Esc`   | Close dropdown, blur input  |
| `Tab`   | Close dropdown              |

### 3. Selection flow

```
Click or Enter on item → selectedItem set, query = item.title, dropdown closes
SelectedItemPanel animates in with full record details
```

---

## Performance Considerations

| Concern             | Solution                                                      |
| ------------------- | ------------------------------------------------------------- |
| Excessive API calls | 300ms debounce                                                |
| Stale responses     | AbortController via RTK thunk `signal`                        |
| Re-renders          | Redux selectors; memoize ranking server-side in production    |
| Large lists         | Client limits to 8; production uses pagination + virtual list |
| Bundle size         | Tree-shake lucide icons; lazy-load Lottie if added later      |

### Production upgrades

1. **Elasticsearch / Algolia** for fuzzy search and typo tolerance
2. **Redis cache** keyed by `q + entityType` (TTL 60s)
3. **CDN** for static assets
4. **Rate limiting** on `/api/search` (e.g. 30 req/min per IP)

---

## Folder Conventions

| Path                     | Responsibility                  |
| ------------------------ | ------------------------------- |
| `src/api/`               | HTTP layer only — no UI imports |
| `src/data/`              | Mock seed data                  |
| `src/lib/types/`         | Shared contracts                |
| `src/lib/store/`         | Redux store + slices            |
| `src/hooks/`             | Reusable React hooks            |
| `src/components/search/` | Feature components              |
| `src/components/ui/`     | Generic primitives              |

---

## Environment Variables

| Variable            | Default | Description                |
| ------------------- | ------- | -------------------------- |
| `VITE_USE_MOCK_API` | `true`  | Use in-memory mock service |
| `VITE_API_BASE_URL` | `/api`  | Backend base URL           |

---

## Future Backend Sketch (Express + PostgreSQL)

```sql
CREATE TYPE entity_type AS ENUM ('product', 'city', 'user');

CREATE TABLE search_index (
  id            VARCHAR(32) PRIMARY KEY,
  entity_type   entity_type NOT NULL,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  description   TEXT,
  category      VARCHAR(100),
  tags          TEXT[] DEFAULT '{}',
  popularity_score INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  thumbnail_url VARCHAR(512),
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_title ON search_index USING gin(to_tsvector('english', title));
CREATE INDEX idx_search_tags ON search_index USING gin(tags);
CREATE INDEX idx_search_entity ON search_index (entity_type) WHERE is_active = true;
```

---

## Testing Strategy (recommended additions)

| Layer     | Tool       | What to test                        |
| --------- | ---------- | ----------------------------------- |
| Unit      | Vitest     | `scoreItem`, debounce, reducers     |
| Component | RTL        | keyboard nav, loading, empty states |
| E2E       | Playwright | full search → select flow           |

---

## Interview Answer (one-liner)

> "Autocomplete is a debounced async search with request cancellation, keyboard-accessible listbox semantics, and a clear API contract — mock today, Elasticsearch or Postgres full-text tomorrow."
