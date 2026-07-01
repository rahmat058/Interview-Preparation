---
title: "Senior Frontend Interview — Fundamentals vs Real-World Engineering"
description: "Flatten array (still asked at 5 YOE) plus the skills that actually matter — Web Vitals, state at scale, React Query, TypeScript, architecture, and production debugging."
tags:
  [
    "react",
    "frontend",
    "senior",
    "interview",
    "web-vitals",
    "typescript",
    "architecture",
  ]
level: "Senior (5+ years)"
format: "Real-world + fundamentals"
---

# Senior Frontend Interview — Fundamentals vs Real-World Engineering

At **5 years into frontend**, you might get asked: _"How do you flatten an array?"_ — and pause, not because you don't know, but because it feels disconnected from what you actually ship.

**Both matter.** Interviews still test fundamentals. Production rewards Web Vitals, state architecture, and debugging skills. This guide covers **both sides** so you can answer the puzzle _and_ demonstrate senior engineering depth.

---

<a id="quick-index"></a>

## Quick index


### Part A — The Question They Still Ask

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [How Do You Flatten an Array?](#p1) |

### Part B — What Actually Matters at 5 YOE

| # | Section |
| --- | --- |
| <span id="i2"></span>2 | [Component Performance — LCP, CLS, INP](#p2) |
| <span id="i3"></span>3 | [State Management at Scale](#p3) |
| <span id="i4"></span>4 | [Async Data Handling — React Query & Caching](#p4) |
| <span id="i5"></span>5 | [TypeScript in Large Codebases](#p5) |
| <span id="i6"></span>6 | [Web Vitals & Production Monitoring](#p6) |
| <span id="i7"></span>7 | [Scalable, Maintainable Architecture](#p7) |
| <span id="i8"></span>8 | [Debugging Real-World Performance Issues](#p8) |

### Part C — Interview Strategy

| # | Section |
| --- | --- |
| <span id="i9"></span>9 | [Bridging Fundamentals and Real Engineering](#p9) |

---
# Part A — The Question They Still Ask

<a id="p1"></a>

## 1. How Do You Flatten an Array?

### Theory

**Flattening** converts a nested array into a single-level array.

```javascript
[1, [2, [3, 4]], 5]  →  [1, 2, 3, 4, 5]
```

Interviewers test: recursion, iteration, built-in knowledge, edge cases (empty arrays, non-array items, depth limit).

### One-Line Interview Answer

> For shallow flatten I use flat(1) or concat with spread. For deep nested arrays I use flat(Infinity) in modern JS, or recursive reduce/for-loop when they ask for no built-ins.

### Built-in Methods

```javascript
const nested = [1, [2, [3, 4]], 5];

// Shallow — one level
nested.flat(); // [1, 2, [3, 4], 5]
nested.flat(1); // same

// Deep — all levels
nested.flat(Infinity); // [1, 2, 3, 4, 5]

// Alternative
[].concat(...nested); // [1, [2, [3, 4]], 5] — shallow only
```

### Recursive — No Built-ins

```javascript
function flatten(arr) {
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

flatten([1, [2, [3, 4]], 5]); // [1, 2, 3, 4, 5]
```

### reduce

```javascript
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    [],
  );
}
```

### Iterative — Stack (no recursion)

```javascript
function flattenIterative(arr) {
  const stack = [...arr].reverse();
  const result = [];

  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item.reverse());
    } else {
      result.push(item);
    }
  }

  return result;
}
```

### With Depth Limit

```javascript
function flattenDepth(arr, depth = 1) {
  if (depth <= 0) return arr.slice();

  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flattenDepth(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

flattenDepth([1, [2, [3]]], 1); // [1, 2, [3]]
flattenDepth([1, [2, [3]]], 2); // [1, 2, 3]
```

### Senior Touch — Connect to Real Work

> "In production I'd use `flat(Infinity)` or a utility from lodash if we're looking for battle-tested edge cases. The recursive version matters when transforming nested API responses — like flattening nested categories into a select dropdown options list."

```javascript
// Real-world: flatten nested categories for a filter dropdown
const categories = [
  {
    id: 1,
    name: "Electronics",
    children: [
      { id: 2, name: "Phones", children: [] },
      { id: 3, name: "Laptops", children: [] },
    ],
  },
];

function flattenCategories(nodes, result = []) {
  for (const node of nodes) {
    result.push({ id: node.id, name: node.name });
    if (node.children?.length) flattenCategories(node.children, result);
  }
  return result;
}
```

---

# Part B — What Actually Matters at 5 YOE


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Component Performance — LCP, CLS, INP

### Theory

**Core Web Vitals** are Google's user-centric metrics. They directly affect SEO, conversion, and how users perceive your app.

| Metric                              | What it measures                            | Good threshold |
| ----------------------------------- | ------------------------------------------- | -------------- |
| **LCP** (Largest Contentful Paint)  | When main content appears                   | ≤ 2.5s         |
| **CLS** (Cumulative Layout Shift)   | Visual stability — unexpected jumps         | ≤ 0.1          |
| **INP** (Interaction to Next Paint) | Responsiveness to user input (replaced FID) | ≤ 200ms        |

Other important: **FCP** (First Contentful Paint), **TTFB** (Time to First Byte), **TBT** (Total Blocking Time).

### Pros & Cons — Optimization Approaches

| Approach                              | Helps             | Trade-off                 |
| ------------------------------------- | ----------------- | ------------------------- |
| Code splitting                        | LCP, TBT          | More chunks to manage     |
| Image optimization (next/image, WebP) | LCP               | Build pipeline complexity |
| Font preload + font-display: swap     | LCP, CLS          | FOUT if not tuned         |
| Skeleton + reserved dimensions        | CLS               | Extra CSS                 |
| defer non-critical JS                 | TBT, INP          | Delayed interactivity     |
| Virtualization                        | INP on long lists | Scroll complexity         |

### One-Line Interview Answer

> LCP is about getting meaningful content on screen fast — optimize hero images, fonts, and critical path JS. CLS means reserving space so nothing jumps. INP is input responsiveness — reduce main-thread work, split long tasks, and defer heavy renders with startTransition.

### LCP Optimization

```jsx
// ❌ LCP killer — unoptimized hero image, render-blocking font
<img src="/hero-4mb.jpg" />
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />

// ✅ Optimized
import Image from "next/image";

<Image
  src="/hero.webp"
  alt="Product showcase"
  priority          // preload LCP candidate
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, 1200px"
/>

// Preload LCP image in <head>
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
```

### CLS Prevention

```jsx
// ❌ CLS — image loads, page jumps
<img src={product.image} />

// ✅ Reserve space
<div style={{ aspectRatio: "16/9", width: "100%" }}>
  <img src={product.image} width={640} height={360} alt={product.name} />
</div>

// ✅ Skeleton with fixed height
function ProductCardSkeleton() {
  return <div className="card-skeleton" style={{ height: 320 }} />;
}
```

```css
/* Font loading — prevent invisible text then swap jump */
@font-face {
  font-family: "Inter";
  font-display: swap; /* or optional for less CLS */
  src: url("/fonts/inter.woff2") format("woff2");
}
```

### INP Optimization

```jsx
import { useTransition, memo, useDeferredValue } from "react";

// Defer expensive filter on search
function ProductSearch({ products }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () => filterProducts(products, deferredQuery),
    [products, deferredQuery],
  );

  return (
    <>
      <input onChange={(e) => setQuery(e.target.value)} />
      <ProductList products={filtered} />
    </>
  );
}

// Break up long tasks
function handleHeavyClick() {
  requestIdleCallback(() => processAnalytics(data));
  startTransition(() => setResults(computeExpensive()));
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. State Management at Scale

### Theory

At scale, state splits into categories — pick the right tool per category:

| State type              | Examples            | Tool                      |
| ----------------------- | ------------------- | ------------------------- |
| **Server state**        | API data, cache     | TanStack Query            |
| **URL state**           | Filters, pagination | React Router searchParams |
| **Global client state** | Auth, cart, theme   | Redux / Zustand / Jotai   |
| **Local UI state**      | Modal open, input   | useState                  |
| **Form state**          | Validation, dirty   | React Hook Form           |

### Library Comparison

|                | Redux (RTK)         | Zustand                 | Jotai                     |
| -------------- | ------------------- | ----------------------- | ------------------------- |
| Boilerplate    | Medium (RTK helps)  | Minimal                 | Minimal                   |
| DevTools       | Excellent           | Good plugin             | Limited                   |
| Middleware     | Thunks, listeners   | Custom                  | Atom effects              |
| Selectors      | useSelector         | subscribe with selector | useAtom                   |
| Best for       | Complex apps, teams | Simple global state     | Fine-grained atomic state |
| Learning curve | Higher              | Low                     | Low                       |

### One-Line Interview Answer

> Server state goes to TanStack Query. URL state stays in the router. Global client state — I pick Zustand for simplicity or Redux when we need middleware, DevTools, and predictable patterns across a large team. Local UI stays in useState.

### Redux at Scale (RTK)

```tsx
// features/cart/cartSlice.ts
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle" },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

// Selectors — prevent unnecessary re-renders
const selectCartItems = (state: RootState) => state.cart.items;
const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0),
);
```

### Zustand — Lightweight Global State

```tsx
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) => set((state) => ({ items: [...state.items, item] })),
        removeItem: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      }),
      { name: "cart-storage" },
    ),
  ),
);

// Component — subscribe to slice only
const items = useCartStore((s) => s.items);
const addItem = useCartStore((s) => s.addItem);
```

### Jotai — Atomic Fine-Grained State

```tsx
import { atom, useAtom, useAtomValue } from "jotai";

const cartItemsAtom = atom<CartItem[]>([]);
const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, i) => sum + i.price, 0),
);

function CartBadge() {
  const total = useAtomValue(cartTotalAtom); // only re-renders when total changes
  return <span>₹{total}</span>;
}
```

### Anti-Patterns at Scale

```tsx
// ❌ Everything in Context — all consumers re-render
<AppContext.Provider value={{ user, cart, theme, notifications, ... }}>

// ❌ Duplicating server data in Redux
dispatch(setUsers(apiResponse)); // TanStack Query already caches this

// ✅ Colocate state as low as possible
function Modal() {
  const [open, setOpen] = useState(false); // only Modal cares
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Async Data Handling — React Query & Caching

### Theory

**TanStack Query** manages **server state** — fetching, caching, background sync, deduplication, retries, stale-while-revalidate.

Key concepts:

- **queryKey** — unique cache identifier
- **staleTime** — how long data is fresh (no refetch)
- **gcTime** (cacheTime) — how long unused data stays in cache
- **invalidation** — mark cache stale after mutations

### Pros & Cons

| Pros                                          | Cons                          |
| --------------------------------------------- | ----------------------------- |
| Eliminates 80% of useEffect fetch boilerplate | Learning curve for cache keys |
| Background refetch, dedup                     | Over-fetching if keys wrong   |
| Optimistic updates built-in                   | SSR needs hydration setup     |

### One-Line Interview Answer

> TanStack Query owns server state — I define query keys hierarchically, set staleTime based on data freshness needs, invalidate after mutations, and use optimistic updates for snappy UX on cart and likes.

### Core Patterns

```tsx
// Hierarchical query keys — invalidate at any level
const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Filters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

function useProducts(filters: Filters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => api.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 min — product list doesn't change often
    gcTime: 30 * 60 * 1000,
  });
}

function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => api.getProduct(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}
```

### Mutation + Invalidation

```tsx
function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: CartItem) => api.addToCart(item),
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItem[]>(["cart"]);
      queryClient.setQueryData(["cart"], (old = []) => [...old, newItem]);
      return { previous };
    },
    onError: (_err, _item, context) => {
      queryClient.setQueryData(["cart"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
```

### Parallel + Dependent Queries

```tsx
// Parallel
const user = useQuery({ queryKey: ["user", id], queryFn: () => fetchUser(id) });
const orders = useQuery({
  queryKey: ["orders", id],
  queryFn: () => fetchOrders(id),
});

// Dependent — orders waits for user
const user = useQuery({ queryKey: ["user", id], queryFn: () => fetchUser(id) });
const orders = useQuery({
  queryKey: ["orders", user.data?.id],
  queryFn: () => fetchOrders(user.data!.id),
  enabled: !!user.data?.id,
});

// Parallel with useQueries
const results = useQueries({
  queries: ids.map((id) => ({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  })),
});
```

### Caching Strategy Table

| Data type              | staleTime        | Refetch on focus?      |
| ---------------------- | ---------------- | ---------------------- |
| User profile           | 5–10 min         | Yes                    |
| Product catalog        | 5 min            | Yes                    |
| Stock/inventory        | 30 sec           | Yes                    |
| Static CMS content     | 1 hour           | No                     |
| Real-time order status | 0 (always stale) | WebSocket + invalidate |

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. TypeScript in Large Codebases

### Theory

TypeScript at scale is about **boundaries**, **consistency**, and **maintainability** — not sprinkling `: any` everywhere.

Key practices:

- Strict mode (`strict: true`)
- Shared types between API and UI
- Discriminated unions for state machines
- Generic components with constraints
- Branded types for IDs
- Zod/io-ts for runtime validation at API boundary

### One-Line Interview Answer

> I enforce strict TypeScript, validate API responses at the boundary with Zod, use discriminated unions for async states, and share types via OpenAPI or a monorepo types package — never duplicate DTO definitions.

### API Boundary Validation

```tsx
import { z } from "zod";

const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(["electronics", "grocery", "pharmacy"]),
  inStock: z.boolean(),
});

type Product = z.infer<typeof ProductSchema>;

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  const json = await res.json();
  return ProductSchema.parse(json); // runtime + compile-time safety
}
```

### Discriminated Unions — Async State

```tsx
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function DataView<T>({ state }: { state: AsyncState<T> }) {
  switch (state.status) {
    case "idle":
      return null;
    case "loading":
      return <Spinner />;
    case "error":
      return <ErrorBanner error={state.error} />;
    case "success":
      return <Content data={state.data} />;
  }
}
```

### Generic Components

```tsx
interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <td key={col.key}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Branded Types — Prevent ID Mix-ups

```tsx
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function fetchOrders(userId: UserId): Promise<Order[]> {
  /* ... */
}

const userId = "abc" as UserId;
fetchOrders(userId); // ✅
fetchOrders("abc"); // ❌ Type error — plain string not assignable
```

### Large Codebase Rules

| Rule                               | Why                      |
| ---------------------------------- | ------------------------ |
| No `any` — use `unknown` + narrow  | Prevents silent bugs     |
| `satisfies` over `as`              | Preserves literal types  |
| Colocate types with features       | `features/cart/types.ts` |
| API types generated from OpenAPI   | Single source of truth   |
| ESLint `@typescript-eslint` strict | Catch issues in CI       |

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Web Vitals & Production Monitoring

### Theory

You can't optimize what you don't measure. Production monitoring connects **real user metrics** to code changes.

Tools:

- **web-vitals** library → send to analytics
- **Sentry** — errors + performance
- **Datadog RUM** — Real User Monitoring
- **Lighthouse CI** — PR-level regression checks
- **Chrome UX Report (CrUX)** — field data from Google

### One-Line Interview Answer

> I instrument LCP, CLS, and INP with the web-vitals library, send them to our analytics pipeline tagged by page and release, set Sentry performance budgets, and run Lighthouse CI on PRs to catch regressions before merge.

### Instrument Web Vitals

```tsx
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

function sendToAnalytics({ name, value, id, rating }) {
  // Google Analytics 4
  gtag("event", name, {
    event_category: "Web Vitals",
    event_label: id,
    value: Math.round(name === "CLS" ? value * 1000 : value),
    metric_rating: rating, // "good" | "needs-improvement" | "poor"
    non_interaction: true,
  });

  // Or custom endpoint
  navigator.sendBeacon(
    "/api/vitals",
    JSON.stringify({ name, value, page: location.pathname }),
  );
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### Sentry Performance

```tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Custom transaction for slow flows
function CheckoutPage() {
  useEffect(() => {
    const transaction = Sentry.startInactiveSpan({ name: "checkout-load" });
    loadCheckoutData().finally(() => transaction.end());
  }, []);
}
```

### Lighthouse CI in PRs

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://staging.example.com/
      https://staging.example.com/products
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "cumulative-layout-shift", "budget": 0.1 },
      { "metric": "interactive", "budget": 3500 }
    ]
  }
]
```

### Alerting Strategy

| Metric     | Alert when      | Action                                  |
| ---------- | --------------- | --------------------------------------- |
| LCP p75    | > 3s for 1 hour | Check deploy, CDN, image regression     |
| CLS p75    | > 0.15          | Find layout shift source in RUM         |
| INP p75    | > 300ms         | Profile long tasks, check new JS bundle |
| Error rate | > 1% spike      | Rollback, check Sentry                  |

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Scalable, Maintainable Architecture

### Theory

Scalable frontend architecture optimizes for **team velocity** and **change isolation** — not premature abstraction.

Principles:

- **Feature-based folders** — colocate everything a feature needs
- **Unidirectional data flow** — predictable state
- **API layer separation** — components never call fetch directly
- **Design system** — shared UI primitives
- **Barrel exports sparingly** — avoid circular deps and bundle bloat
- **Module boundaries** — features don't import from sibling features

### One-Line Interview Answer

> Feature-based architecture with a shared design system, API services layer, TanStack Query for server state, and strict import boundaries — each feature owns its components, hooks, and types.

### Folder Structure

```
src/
├── app/                        # Shell, router, providers
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types.ts
│   │   └── index.ts            # public API only
│   ├── cart/
│   ├── catalog/
│   └── checkout/
├── shared/
│   ├── components/             # Button, Modal, DataTable
│   ├── hooks/
│   ├── utils/
│   └── types/
├── services/
│   └── httpClient.ts           # Axios instance, interceptors
└── design-system/
    ├── tokens/
    └── primitives/
```

### API Layer

```tsx
// services/httpClient.ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401)
      await refreshTokenAndRetry(error.config);
    return Promise.reject(error);
  },
);

// features/catalog/api/products.ts
export const productApi = {
  getAll: (filters: ProductFilters) =>
    api.get<Product[]>("/products", { params: filters }).then((r) => r.data),
  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),
};
```

### Import Boundaries (ESLint)

```javascript
// eslint.config.js
{
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [
        {
          group: ["../features/*/*"],
          message: "Import from feature public API (index.ts), not internals",
        },
        {
          group: ["features/cart/**"],
          from: "features/checkout",
          message: "Checkout cannot import cart internals directly",
        },
      ],
    }],
  },
}
```

### Composition Over Configuration

```tsx
// ❌ God component with 20 props
<DataTable sortable filterable exportable paginated virtualized ... />

// ✅ Composable
<DataTable data={products}>
  <DataTable.Toolbar>
    <SearchFilter />
    <ExportButton />
  </DataTable.Toolbar>
  <DataTable.Columns columns={productColumns} />
  <DataTable.Pagination pageSize={20} />
</DataTable>
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Debugging Real-World Performance Issues

### Theory

Production performance bugs rarely announce themselves. Systematic debugging:

1. **Reproduce** — RUM data, user report, Sentry trace
2. **Measure** — Chrome DevTools Performance tab
3. **Identify** — long tasks, layout thrashing, memory leaks
4. **Fix** — targeted, not premature optimization
5. **Verify** — before/after vitals in staging

### One-Line Interview Answer

> I start with RUM data and Sentry traces to find the slow page and long tasks, reproduce in Chrome Performance panel, identify whether it's network, render, or JS blocking, fix with evidence, and verify with Lighthouse before/after.

### Debugging Checklist

| Symptom                | Likely cause                          | Tool                                  |
| ---------------------- | ------------------------------------- | ------------------------------------- |
| Slow first load        | Large JS bundle, no code split        | Coverage tab, webpack analyzer        |
| Page jumps on load     | Images/fonts without dimensions       | Layout Shift regions in Performance   |
| Scroll jank            | Too many DOM nodes, no virtualization | Performance → Frames                  |
| Input lag (bad INP)    | Long tasks on main thread             | Performance → Main thread flame chart |
| Memory grows over time | Leaked listeners, intervals, closures | Memory tab → heap snapshots           |
| API feels slow         | Waterfall, no parallelization         | Network tab                           |
| Re-render storm        | Context value, missing memo           | React DevTools Profiler               |

### React DevTools Profiler

```jsx
// Find unnecessary re-renders
// 1. Record interaction in Profiler
// 2. Look for components that re-rendered but props didn't change
// 3. Fix: memo, useMemo, split context, move state down

// Common fix — unstable reference
// ❌ New object every render
<Child config={{ theme: "dark", size: "lg" }} />;

// ✅ Stable reference
const config = useMemo(() => ({ theme: "dark", size: "lg" }), []);
<Child config={config} />;
```

### Long Task Detection

```javascript
// Observe long tasks in production
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      sendToAnalytics({
        type: "long-task",
        duration: entry.duration,
        page: location.pathname,
      });
    }
  }
});
observer.observe({ type: "longtask", buffered: true });
```

### Memory Leak Pattern

```jsx
// ❌ Leak — listener not removed
useEffect(() => {
  window.addEventListener("scroll", handleScroll);
}, []);

// ✅ Cleanup
useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [handleScroll]);

// ❌ Leak — interval in module scope
setInterval(pollStatus, 1000);

// ✅ Cleanup + AbortController for fetch
useEffect(() => {
  const id = setInterval(pollStatus, 1000);
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => {
    clearInterval(id);
    controller.abort();
  };
}, []);
```

### Case Study — Slow Product List

```
Problem:  LCP 4.2s on /products, INP 450ms on filter
RUM:      80% users on mobile 3G
Step 1:   Network — 1.2MB JS bundle (main culprit)
Fix 1:    Route-level code splitting → bundle 380KB
Step 2:   LCP element — unoptimized category hero image
Fix 2:    WebP + priority preload → LCP 2.1s
Step 3:   Filter input — re-renders 500-item list every keystroke
Fix 3:    useDeferredValue + memo ProductCard → INP 120ms
Verify:   Lighthouse CI passed, RUM p75 LCP < 2.5s after 48h
```

---

# Part C — Interview Strategy


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Bridging Fundamentals and Real Engineering

### The Disconnect Is Real

Interviewers ask flatten arrays. You ship Web Vitals budgets. **Both can coexist** — the trick is answering the puzzle quickly, then pivoting to depth.

### The "Answer + Pivot" Technique

**Interviewer:** "How do you flatten an array?"

**You:**

> "Shallow — `flat(1)` or spread with concat. Deep — recursive loop or `flat(Infinity)`. If no built-ins, I'd use a stack-based iterative approach to avoid recursion depth limits.
>
> In production I've applied similar tree-walking when flattening nested category trees from our CMS into filter options — same pattern, different domain."

You answered the puzzle in 20 seconds and showed senior thinking in 10 more.

### When They Ask "What Do You Actually Work On?"

Have **3 prepared stories**:

| Story                           | Demonstrates                                  |
| ------------------------------- | --------------------------------------------- |
| **Performance win**             | LCP/INP improvement with before/after metrics |
| **State/architecture decision** | Why Zustand vs Redux, TanStack Query adoption |
| **Production incident**         | How you debugged and fixed a real bug         |

### Questions to Ask Interviewers

Surface whether the role matches real engineering:

- "How do you measure Core Web Vitals in production?"
- "What's your approach to server state — Redux, React Query, or both?"
- "What does your frontend architecture look like at scale?"
- "How do frontend engineers participate in on-call or incident response?"

Their answers tell you if the team cares about what you've actually been doing for 5 years.

### Quick Map — Puzzle → Real Skill

| Interview puzzle | Real-world parallel                        |
| ---------------- | ------------------------------------------ |
| Flatten array    | Nested API/CMS tree traversal              |
| Debounce         | Search input, auto-save                    |
| Event loop       | Async UI update ordering                   |
| Deep clone       | Immutable state updates                    |
| Two sum          | Finding duplicate cart items, matching IDs |
| LRU cache        | TanStack Query cache eviction              |

---

# Quick Revision Cheat Sheet

| Topic          | One-liner                                                  |
| -------------- | ---------------------------------------------------------- |
| Flatten array  | `flat(Infinity)`, recursive, or stack iterative            |
| LCP            | Fast meaningful content — images, fonts, critical JS       |
| CLS            | Reserve space — dimensions, skeletons, font-display        |
| INP            | Responsive input — defer heavy work, startTransition       |
| State at scale | Query for server, Zustand/Redux for global, useState local |
| React Query    | Hierarchical keys, staleTime, invalidate on mutation       |
| TypeScript     | Strict, Zod at boundary, discriminated unions              |
| Monitoring     | web-vitals → analytics, Sentry, Lighthouse CI              |
| Architecture   | Feature folders, API layer, import boundaries              |
| Debugging      | RUM → reproduce → Profile → fix → verify                   |

---

_Fundamentals get you through the screen. Real engineering skills — Web Vitals, state architecture, production debugging — get you the offer and the job. Prepare for both._


<p><a href="#i9">Back to index</a></p>
