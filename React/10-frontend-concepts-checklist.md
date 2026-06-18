---
title: "Important Frontend Concepts Checklist"
description: "25 essential frontend topics — pagination, caching, rendering strategies, performance, testing, and architecture with theory, pros/cons, and real-life examples."
tags:
  ["frontend", "react", "performance", "architecture", "interview", "checklist"]
level: "All levels"
---

# Important Frontend Concepts Checklist

A complete reference for **25 essential frontend concepts** every developer should know — with **Theory**, **Pros & Cons**, and **Real-Life Examples**.

---

## Table of Contents

1. [Pagination](#1-pagination)
2. [Infinite Scroll](#2-infinite-scroll)
3. [Debouncing](#3-debouncing)
4. [WebSocket](#4-websocket)
5. [REST vs GraphQL APIs](#5-rest-vs-graphql-apis)
6. [Local Storage vs Cookies](#6-local-storage-vs-cookies)
7. [Authentication vs Authorization](#7-authentication-vs-authorization)
8. [Redux](#8-redux)
9. [Lazy Loading](#9-lazy-loading)
10. [Code Splitting](#10-code-splitting)
11. [Bundle Size Optimization](#11-bundle-size-optimization)
12. [Tree Shaking](#12-tree-shaking)
13. [Memoization (useMemo, useCallback)](#13-memoization-usememo-usecallback)
14. [Caching (Client + Server)](#14-caching-client--server)
15. [CSR vs SSR vs SSG vs ISR](#15-csr-vs-ssr-vs-ssg-vs-isr)
16. [Core Web Vitals (LCP, INP, CLS)](#16-core-web-vitals-lcp-inp-cls)
17. [Cross Browser Compatibility](#17-cross-browser-compatibility)
18. [Optimistic UI Updates](#18-optimistic-ui-updates)
19. [Suspense (React)](#19-suspense-react)
20. [Image Optimization (WebP, AVIF)](#20-image-optimization-webp-avif)
21. [Accessibility (a11y)](#21-accessibility-a11y)
22. [Webpack](#22-webpack)
23. [Micro-frontend Architecture](#23-micro-frontend-architecture)
24. [Testing — RTL, Jest, Playwright](#24-testing--rtl-jest-playwright)
25. [Polyfills & Babel](#25-polyfills--babel)

---

## 1. Pagination

### Theory

**Pagination** divides large datasets into discrete **pages**, fetching and displaying one chunk at a time. Users navigate with page numbers, next/previous buttons, or "load more."

Two common API patterns:

- **Offset-based:** `?page=2&limit=20` — simple but slow on deep pages
- **Cursor-based:** `?cursor=abc123&limit=20` — stable for large, changing datasets

### Pros & Cons

| Pagination                                | Infinite scroll                 |
| ----------------------------------------- | ------------------------------- |
| ✅ Predictable navigation, shareable URLs | ✅ Seamless browsing experience |
| ✅ Better for SEO (page URLs)             | ✅ Better for mobile feeds      |
| ✅ Lower memory — only one page in DOM    | ❌ Hard to reach footer         |
| ❌ Extra clicks for users                 | ❌ DOM grows unless virtualized |

### Real-Life Example

```tsx
function ProductList() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () =>
      fetch(`/api/products?page=${page}&limit=${limit}`).then((r) => r.json()),
    keepPreviousData: true, // show old page while loading next
  });

  return (
    <>
      <Grid products={data?.items ?? []} />
      <nav aria-label="Pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {data?.totalPages}
        </span>
        <button
          disabled={page >= data?.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </nav>
    </>
  );
}
```

```javascript
// Cursor-based — better for social feeds / orders
GET /api/orders?cursor=eyJpZCI6MTAwfQ&limit=20
// Response: { items: [...], nextCursor: "eyJpZCI6MTIwfQ", hasMore: true }
```

---

## 2. Infinite Scroll

### Theory

**Infinite scroll** automatically loads the next batch of data when the user scrolls near the bottom of the page. Typically uses **Intersection Observer** to detect when a sentinel element enters the viewport.

Combine with **virtualization** when lists exceed a few hundred DOM nodes.

### Pros & Cons

| Pros                           | Cons                                  |
| ------------------------------ | ------------------------------------- |
| Seamless UX for feeds          | Hard to access footer                 |
| No pagination clicks           | DOM grows without virtualization      |
| Great for mobile               | Back-button scroll position issues    |
| Prefetch before bottom reached | Accessibility concerns (no clear end) |

### Real-Life Example

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback } from "react";

function useInfiniteScroll(onLoadMore: () => void, hasMore: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node || !hasMore) return;
      observer.current = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && onLoadMore(),
        { rootMargin: "200px" }, // prefetch before visible
      );
      observer.current.observe(node);
    },
    [onLoadMore, hasMore],
  );
  return sentinelRef;
}

function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam }) =>
        fetch(`/api/feed?cursor=${pageParam ?? ""}`).then((r) => r.json()),
      getNextPageParam: (last) => last.nextCursor ?? undefined,
      initialPageParam: undefined as string | undefined,
    });

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, !!hasNextPage);

  return (
    <div>
      {items.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
      <div ref={sentinelRef} aria-hidden="true" />
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
```

---

## 3. Debouncing

### Theory

**Debouncing** delays function execution until after a pause in triggering events. If the event fires again before the delay expires, the timer resets. The function runs **once** after activity stops.

Classic use: search input, resize handlers, auto-save.

### Pros & Cons

| Pros                                         | Cons                                |
| -------------------------------------------- | ----------------------------------- |
| Minimizes API calls                          | Adds latency until pause            |
| Reduces server load                          | Can feel sluggish if delay too long |
| Prevents expensive recalc on every keystroke | Not suitable for scroll tracking    |

### Real-Life Example

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const searchProducts = debounce(async (query) => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  renderResults(await res.json());
}, 300);

searchInput.addEventListener("input", (e) => searchProducts(e.target.value));
```

```tsx
// Custom hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

---

## 4. WebSocket

### Theory

**WebSocket** provides a **persistent, full-duplex** connection between client and server over a single TCP connection. Unlike HTTP polling, the server can **push** data to the client instantly.

Use for: live chat, notifications, order tracking, stock tickers, collaborative editing.

Protocol: starts as HTTP upgrade request (`ws://` or `wss://`).

### Pros & Cons

| WebSocket                            | HTTP Polling                       |
| ------------------------------------ | ---------------------------------- |
| ✅ Real-time, low latency            | ✅ Simple, works everywhere        |
| ✅ Single connection — efficient     | ❌ Wasted requests when no updates |
| ✅ Bidirectional                     | ❌ Higher latency                  |
| ❌ Connection management complexity  | ❌ Server load at scale            |
| ❌ Doesn't work through some proxies |                                    |

### Real-Life Example

```tsx
function LiveOrderTracker({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState("preparing");
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/orders/${orderId}/live`);

    ws.onopen = () => ws.send(JSON.stringify({ type: "subscribe" }));

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "status_update") setStatus(msg.status);
      if (msg.type === "location_update") setDriverLocation(msg.location);
    };

    ws.onerror = () => setStatus("connection_error");
    ws.onclose = () => console.log("WebSocket closed");

    // Reconnect with exponential backoff in production
    return () => ws.close();
  }, [orderId]);

  return (
    <div>
      <OrderStatusBadge status={status} />
      {driverLocation && <LiveMap location={driverLocation} />}
    </div>
  );
}
```

```javascript
// Reconnection pattern
function connectWebSocket(url, { maxRetries = 5 } = {}) {
  let retries = 0;
  let ws;

  function connect() {
    ws = new WebSocket(url);
    ws.onclose = () => {
      if (retries < maxRetries) {
        setTimeout(connect, Math.min(1000 * 2 ** retries++, 30000));
      }
    };
  }
  connect();
  return () => ws?.close();
}
```

---

## 5. REST vs GraphQL APIs

### Theory

**REST** exposes multiple endpoints, each returning fixed data shapes. **GraphQL** exposes a single endpoint where the client specifies exactly what fields it needs.

|                | REST                           | GraphQL                      |
| -------------- | ------------------------------ | ---------------------------- |
| Endpoints      | Multiple (`/users`, `/orders`) | Single (`/graphql`)          |
| Data fetching  | Server defines response shape  | Client defines query shape   |
| Over-fetching  | Common                         | Avoided                      |
| Under-fetching | Needs multiple requests        | Single request               |
| Caching        | HTTP caching (simple)          | Complex (needs Apollo/Relay) |
| Tooling        | Universal                      | GraphQL schema, Playground   |

### Pros & Cons

| REST                           | GraphQL                            |
| ------------------------------ | ---------------------------------- |
| ✅ Simple, well-understood     | ✅ Fetch exactly what you need     |
| ✅ HTTP cache friendly         | ✅ Single request for related data |
| ✅ File upload straightforward | ✅ Strong typing via schema        |
| ❌ Over/under-fetching         | ❌ Caching harder                  |
| ❌ Multiple round trips        | ❌ N+1 query problem on server     |
|                                | ❌ Learning curve                  |

### Real-Life Example

```javascript
// REST — 3 requests for dashboard
const user = await fetch("/api/user/42").then((r) => r.json());
const orders = await fetch("/api/users/42/orders").then((r) => r.json());
const notifications = await fetch("/api/users/42/notifications").then((r) =>
  r.json(),
);

// GraphQL — 1 request, exact fields
const { data } = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `
      query Dashboard($userId: ID!) {
        user(id: $userId) { name email avatar }
        orders(userId: $userId, limit: 5) { id total status }
        notifications(userId: $userId, unread: true) { id message createdAt }
      }
    `,
    variables: { userId: "42" },
  }),
}).then((r) => r.json());
```

**When to choose:**

- **REST:** Simple CRUD, public APIs, CDN caching critical, small teams
- **GraphQL:** Mobile apps (bandwidth), complex dashboards, many clients with different data needs

---

## 6. Local Storage vs Cookies

### Theory

Both store data in the browser, but with different capabilities and security models.

|                    | localStorage          | Cookies                               |
| ------------------ | --------------------- | ------------------------------------- |
| Capacity           | ~5–10 MB              | ~4 KB per cookie                      |
| Sent with requests | No                    | Yes (every HTTP request to domain)    |
| Expiry             | Never (until cleared) | Set via `Expires` / `Max-Age`         |
| Accessible from JS | Yes                   | Yes (unless `httpOnly`)               |
| Secure for tokens  | ❌ XSS vulnerable     | ✅ `httpOnly` + `Secure` + `SameSite` |
| API                | Synchronous           | Document.cookie or server Set-Cookie  |

Also consider: **sessionStorage** (tab-scoped), **IndexedDB** (large structured data).

### Pros & Cons

| localStorage                        | httpOnly Cookies                      |
| ----------------------------------- | ------------------------------------- |
| ✅ Large capacity                   | ✅ Not accessible to JS — XSS safe    |
| ✅ Simple API                       | ✅ Auto-sent — good for auth          |
| ❌ XSS can steal data               | ❌ CSRF risk (mitigate with SameSite) |
| ❌ Synchronous — blocks main thread | ❌ 4KB limit                          |

### Real-Life Example

```javascript
// localStorage — user preferences (non-sensitive)
localStorage.setItem("theme", "dark");
localStorage.setItem("recentSearches", JSON.stringify(["react", "typescript"]));

const theme = localStorage.getItem("theme");

// ❌ NEVER store auth tokens in localStorage
localStorage.setItem("token", jwt); // XSS can steal this

// ✅ Auth via httpOnly cookie (set by server)
// Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/

// sessionStorage — form draft (cleared on tab close)
sessionStorage.setItem("draftOrder", JSON.stringify(cartItems));
```

```tsx
// Custom hook for localStorage
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}
```

---

## 7. Authentication vs Authorization

### Theory

- **Authentication (AuthN)** — **Who are you?** Verifying identity (login, OAuth, JWT, biometrics).
- **Authorization (AuthZ)** — **What can you do?** Checking permissions after identity is known (roles, ACLs, policies).

Authentication always comes **before** authorization. You can't authorize an unknown user.

### Pros & Cons

|               | Authentication          | Authorization                |
| ------------- | ----------------------- | ---------------------------- |
| Handles       | Identity verification   | Permission checking          |
| Examples      | Login, SSO, MFA         | RBAC, ACL, policy engine     |
| Frontend role | Login UI, token storage | Route guards, conditional UI |
| Backend role  | Validate credentials    | Enforce access rules         |

### Real-Life Example

```tsx
// Authentication — login flow
async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // Server sets httpOnly cookie — frontend never sees raw token
  return res.ok;
}

// Authorization — role-based UI (UX only — backend MUST enforce)
function AdminPanel() {
  const { user } = useAuth(); // authenticated user

  // Authorization check
  if (!user?.roles.includes("admin")) {
    return <Navigate to="/unauthorized" />;
  }

  return <AdminDashboard />;
}

// Backend always validates — frontend guards are UX only
// DELETE /api/users/99 → 403 Forbidden if not admin
// regardless of what frontend shows
```

| Layer    | Authentication            | Authorization                         |
| -------- | ------------------------- | ------------------------------------- |
| Frontend | Login form, session check | Hide/show buttons, route guards       |
| Backend  | Validate JWT/session      | Check role on every API call          |
| Token    | JWT with `sub` (user ID)  | JWT with `roles`/`permissions` claims |

---

## 8. Redux

### Theory

**Redux** is a predictable state container for JavaScript apps. State lives in a single **store**, updated only through **actions** processed by **reducers** (pure functions).

**Redux Toolkit (RTK)** is the modern standard — slices, Immer, `createAsyncThunk`.

Use Redux for **complex client-side global state**. Use TanStack Query for **server state**.

### Pros & Cons

| Pros                        | Cons                             |
| --------------------------- | -------------------------------- |
| Single source of truth      | Boilerplate (reduced with RTK)   |
| Predictable updates         | Overkill for simple apps         |
| Redux DevTools time-travel  | Learning curve                   |
| Middleware (logging, async) | Can cause unnecessary re-renders |

### Real-Life Example

```tsx
// store/cartSlice.ts
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[] },
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

// Component
function CartBadge() {
  const count = useAppSelector((s) => s.cart.items.length);
  const dispatch = useAppDispatch();
  return (
    <button onClick={() => dispatch(addItem(product))}>Cart ({count})</button>
  );
}
```

**Flow:** `dispatch(action)` → `reducer(state, action)` → `new state` → `useSelector` → re-render

---

## 9. Lazy Loading

### Theory

**Lazy loading** defers loading of resources until they're needed — components, images, routes, or scripts. Reduces initial bundle size and speeds up first paint.

In React: `React.lazy()` + `<Suspense>` for components. Native: `loading="lazy"` for images.

### Pros & Cons

| Pros                          | Cons                                      |
| ----------------------------- | ----------------------------------------- |
| Faster initial load           | Brief loading flash without good fallback |
| Less bandwidth on first visit | User waits when navigating to lazy route  |
| Better Core Web Vitals        | Slightly more complex code                |

### Real-Life Example

```tsx
import { lazy, Suspense } from "react";

const Analytics = lazy(() => import("./pages/Analytics"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}

// Image lazy loading
<img src="product.webp" alt="Product" loading="lazy" width={400} height={300} />

// Prefetch on hover
<Link to="/analytics" onMouseEnter={() => import("./pages/Analytics")}>
  Analytics
</Link>
```

---

## 10. Code Splitting

### Theory

**Code splitting** breaks your JavaScript bundle into smaller **chunks** loaded on demand. The bundler (Webpack, Vite) creates separate files per dynamic import or entry point.

Split strategies:

- **Route-based** — each page is a chunk (biggest win)
- **Component-based** — heavy widgets loaded when needed
- **Vendor splitting** — separate chunk for `node_modules`

### Pros & Cons

| Pros                                 | Cons                                     |
| ------------------------------------ | ---------------------------------------- |
| Smaller initial bundle               | More HTTP requests (mitigated by HTTP/2) |
| Parallel chunk loading               | Requires Suspense/error boundaries       |
| Cache-friendly (vendor chunk stable) | Complexity in configuration              |

### Real-Life Example

```tsx
// Route-based splitting (automatic with lazy)
const routes = [
  { path: "/", component: lazy(() => import("./Home")) },
  { path: "/dashboard", component: lazy(() => import("./Dashboard")) },
];

// Webpack magic comment — named chunk
const HeavyChart = lazy(
  () => import(/* webpackChunkName: "charts" */ "./HeavyChart"),
);

// Vite — automatic code splitting on dynamic import
const module = await import("./heavy-module.js");
```

```javascript
// webpack.config.js — split vendor
optimization: {
  splitChunks: {
    chunks: "all",
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        chunks: "all",
      },
    },
  },
},
```

---

## 11. Bundle Size Optimization

### Theory

Smaller bundles = faster download, parse, and execute. Target **< 200 KB gzipped** for initial JS.

Strategies: code splitting, tree shaking, analyze bundle, replace heavy libraries, dynamic imports, remove unused code.

### Pros & Cons

| Optimized bundle            | Large bundle              |
| --------------------------- | ------------------------- |
| ✅ Faster TTI and LCP       | ❌ Slow on 3G/4G          |
| ✅ Better mobile experience | ❌ Higher bounce rate     |
| ✅ Lower CDN costs          | ❌ Poor Lighthouse scores |

### Real-Life Example

```bash
# Analyze bundle
npx vite-bundle-visualizer
npx source-map-explorer dist/assets/*.js

# Find heavy imports
npm install -D webpack-bundle-analyzer
```

```javascript
// ❌ Imports entire library (70KB)
import _ from "lodash";
_.debounce(fn, 300);

// ✅ Import only what you need (2KB)
import debounce from "lodash/debounce";

// ❌ Import all icons
import * as Icons from "lucide-react";

// ✅ Import specific icon
import { Search, Cart } from "lucide-react";

// Replace moment.js (300KB) with date-fns (tree-shakeable)
import { format } from "date-fns";
```

| Technique                              | Savings                         |
| -------------------------------------- | ------------------------------- |
| Route code splitting                   | 40–70% initial bundle reduction |
| lodash → lodash-es + per-method import | ~65 KB                          |
| moment → date-fns                      | ~280 KB                         |
| Remove unused dependencies             | Varies                          |

---

## 12. Tree Shaking

### Theory

**Tree shaking** is dead code elimination — the bundler removes exported modules that are never imported. Requires **ES modules** (`import`/`export`) and **side-effect-free** packages.

Works at build time. Mark packages as side-effect-free in `package.json`:

```json
{ "sideEffects": false }
```

### Pros & Cons

| Pros                         | Cons                                  |
| ---------------------------- | ------------------------------------- |
| Automatic size reduction     | Only works with ESM                   |
| No runtime cost              | CommonJS modules can't be tree-shaken |
| Encourages modular libraries | Side effects prevent shaking          |

### Real-Life Example

```javascript
// utils/math.js
export function add(a, b) {
  return a + b;
}
export function multiply(a, b) {
  return a * b;
}
export function divide(a, b) {
  return a / b;
}

// app.js — only imports add
import { add } from "./utils/math";
console.log(add(2, 3));

// After tree shaking: multiply and divide removed from bundle
```

```javascript
// ❌ CommonJS — no tree shaking
const _ = require("lodash");

// ✅ ESM — tree shakeable
import debounce from "lodash-es/debounce";

// package.json of your library
{
  "sideEffects": ["*.css"], // only CSS has side effects
  "module": "dist/index.esm.js"
}
```

---

## 13. Memoization (useMemo, useCallback)

### Theory

| Hook          | Memoizes               | Use when                         |
| ------------- | ---------------------- | -------------------------------- |
| `useMemo`     | Computed **value**     | Expensive calculations           |
| `useCallback` | **Function** reference | Stable ref for memoized children |
| `React.memo`  | Component **render**   | Props unchanged → skip re-render |

React compares with `Object.is` (shallow equality). Profile before optimizing.

### Pros & Cons

| Pros                           | Cons                                |
| ------------------------------ | ----------------------------------- |
| Skips expensive recalculations | Memory overhead for cached values   |
| Prevents child re-renders      | Shallow compare misses deep changes |
| Essential for virtualization   | Overuse adds complexity             |

### Real-Life Example

```tsx
function DataTable({ rows, filters }) {
  const filtered = useMemo(
    () => rows.filter((r) => matchesFilters(r, filters)),
    [rows, filters],
  );

  const handleEdit = useCallback((id: string) => {
    openEditor(id);
  }, []);

  return filtered.map((row) => (
    <MemoRow key={row.id} row={row} onEdit={handleEdit} />
  ));
}

const MemoRow = React.memo(function MemoRow({ row, onEdit }) {
  return (
    <tr onClick={() => onEdit(row.id)}>
      <td>{row.name}</td>
    </tr>
  );
});
```

**Rule:** Profile first → optimize hot paths only.

---

## 14. Caching (Client + Server)

### Theory

Caching stores responses to avoid redundant network requests and computation.

**Client-side layers:**

- **HTTP cache** — browser cache via `Cache-Control` headers
- **Service Worker** — offline cache (PWA)
- **React Query / SWR** — in-memory cache with stale-while-revalidate
- **localStorage / IndexedDB** — persistent client cache

**Server-side layers:**

- **CDN** — edge cache for static assets and SSR pages
- **Redis / Memcached** — API response cache
- **ISR** — regenerate static pages on interval

### Pros & Cons

| Aggressive caching               | No caching                   |
| -------------------------------- | ---------------------------- |
| ✅ Fast repeat visits            | ❌ Every request hits server |
| ✅ Lower server load             | ❌ Poor UX on slow networks  |
| ❌ Stale data risk               | ❌ Higher CDN/API costs      |
| ❌ Cache invalidation complexity |                              |

### Real-Life Example

```javascript
// HTTP cache headers (server)
// Static assets — immutable
Cache-Control: public, max-age=31536000, immutable

// API — short TTL
Cache-Control: private, max-age=60, stale-while-revalidate=30
```

```tsx
// React Query — client cache
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // fresh for 5 min
      gcTime: 30 * 60 * 1000, // garbage collect after 30 min
      refetchOnWindowFocus: true,
    },
  },
});

// Prefetch on hover
function ProductLink({ id }) {
  const qc = useQueryClient();
  return (
    <Link
      to={`/product/${id}`}
      onMouseEnter={() =>
        qc.prefetchQuery({
          queryKey: ["product", id],
          queryFn: () => fetchProduct(id),
        })
      }
    >
      View Product
    </Link>
  );
}
```

```javascript
// Service Worker — stale-while-revalidate
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open("api-v1").then((cache) =>
        cache.match(event.request).then((cached) => {
          const network = fetch(event.request).then((res) => {
            cache.put(event.request, res.clone());
            return res;
          });
          return cached || network;
        }),
      ),
    );
  }
});
```

---

## 15. CSR vs SSR vs SSG vs ISR

### Theory

Four rendering strategies for web applications:

|                        | CSR          | SSR                | SSG                 | ISR                |
| ---------------------- | ------------ | ------------------ | ------------------- | ------------------ |
| **When rendered**      | Browser      | Server per request | Build time          | Build + revalidate |
| **HTML on first load** | Empty shell  | Full HTML          | Full HTML           | Full HTML (cached) |
| **SEO**                | Poor         | Excellent          | Excellent           | Excellent          |
| **TTFB**               | Fast         | Slower             | Fast (CDN)          | Fast (CDN)         |
| **Data freshness**     | Client fetch | Always fresh       | Stale until rebuild | Configurable TTL   |
| **Server cost**        | Low          | High               | Low                 | Low                |

### Pros & Cons

| Strategy | Best for                                 |
| -------- | ---------------------------------------- |
| CSR      | Dashboards, authenticated apps           |
| SSR      | Personalized, SEO-critical, always-fresh |
| SSG      | Blogs, marketing, docs                   |
| ISR      | E-commerce listings, large catalogs      |

### Real-Life Example

```tsx
// CSR — Create React App / Vite SPA
// index.html: <div id="root"></div>
// JS downloads → React renders in browser

// SSR — Next.js getServerSideProps
export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.id);
  return { props: { product } };
}

// SSG — Next.js getStaticProps (build time)
export async function getStaticProps() {
  const posts = await fetchAllPosts();
  return { props: { posts } };
}

// ISR — revalidate every 60 seconds
export async function getStaticProps() {
  const products = await fetchProducts();
  return { props: { products }, revalidate: 60 };
}
```

```
Decision tree:
  Need SEO? → No → CSR
  Need SEO? → Yes → Data changes frequently? → Yes → SSR or ISR
                                      → No → SSG
```

---

## 16. Core Web Vitals (LCP, INP, CLS)

### Theory

Google's **Core Web Vitals** measure real-user experience:

| Metric                              | Measures                          | Good    |
| ----------------------------------- | --------------------------------- | ------- |
| **LCP** (Largest Contentful Paint)  | Loading — largest visible element | ≤ 2.5s  |
| **INP** (Interaction to Next Paint) | Responsiveness (replaced FID)     | ≤ 200ms |
| **CLS** (Cumulative Layout Shift)   | Visual stability                  | ≤ 0.1   |

### Pros & Cons

| Monitoring Web Vitals           | Ignoring them                         |
| ------------------------------- | ------------------------------------- |
| ✅ SEO ranking factor           | ❌ Higher bounce rates                |
| ✅ Data-driven optimization     | ❌ Poor mobile UX                     |
| ✅ RUM catches real user issues | ❌ Lighthouse lab scores ≠ field data |

### Real-Life Example

```javascript
// Measure in production
import { onLCP, onINP, onCLS } from "web-vitals";

function sendToAnalytics({ name, value, id }) {
  gtag("event", name, { value: Math.round(value), event_id: id });
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

```tsx
// LCP — preload hero image
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
<img src="/hero.webp" width={1200} height={600} alt="Hero" fetchpriority="high" />

// CLS — reserve space
.product-card img { aspect-ratio: 4/3; width: 100%; }

// INP — defer heavy work
import { useTransition } from "react";
const [isPending, startTransition] = useTransition();
startTransition(() => setFilteredProducts(heavyFilter(allProducts)));
```

---

## 17. Cross Browser Compatibility

### Theory

Different browsers (Chrome, Firefox, Safari, Edge) and versions implement web standards with varying support. **Cross-browser compatibility** ensures your app works consistently across target browsers.

Tools: **Can I Use**, **Autoprefixer**, **Polyfills**, **Babel**, **Normalized CSS**.

### Pros & Cons

| Supporting older browsers    | Modern-only                      |
| ---------------------------- | -------------------------------- |
| ✅ Wider audience            | ✅ Smaller bundles, modern APIs  |
| ❌ Polyfills increase bundle | ❌ Excludes IE/old Android users |
| ❌ More testing surface      | ❌ May lose enterprise clients   |

### Real-Life Example

```css
/* Autoprefixer adds vendor prefixes automatically */
.grid {
  display: grid;
  /* Autoprefixer outputs: */
  /* display: -ms-grid; */
  /* display: grid; */
}

.card {
  user-select: none;
  /* → -webkit-user-select: none; */
  /* → user-select: none; */
}
```

```javascript
// Feature detection — not browser detection
if ("IntersectionObserver" in window) {
  setupInfiniteScroll();
} else {
  setupPagination(); // fallback
}

// browserslist in package.json
{
  "browserslist": [">0.2%", "not dead", "not op_mini all"]
}
```

```tsx
// CSS @supports fallback
@supports (display: grid) {
  .layout { display: grid; }
}
@supports not (display: grid) {
  .layout { display: flex; flex-wrap: wrap; }
}
```

---

## 18. Optimistic UI Updates

### Theory

**Optimistic UI** updates the interface **immediately** before the server confirms the action. If the server request fails, the UI **rolls back** to the previous state.

Use for: likes, cart add/remove, todo toggle, message send — actions where success is likely and instant feedback matters.

### Pros & Cons

| Pros                       | Cons                                  |
| -------------------------- | ------------------------------------- |
| Instant perceived response | Rollback UX can confuse users         |
| Better UX on slow networks | Complex state management              |
| Feels native/app-like      | Wrong for critical actions (payments) |

### Real-Life Example

```tsx
function LikeButton({ postId, initialLiked, initialCount }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked: boolean) =>
      fetch(`/api/posts/${postId}/like`, {
        method: liked ? "POST" : "DELETE",
      }),

    // Optimistic update — before server responds
    onMutate: async (liked) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previous = queryClient.getQueryData(["post", postId]);

      queryClient.setQueryData(["post", postId], (old: Post) => ({
        ...old,
        liked,
        likeCount: old.likeCount + (liked ? 1 : -1),
      }));

      return { previous }; // snapshot for rollback
    },

    // Rollback on error
    onError: (_err, _liked, context) => {
      queryClient.setQueryData(["post", postId], context?.previous);
      toast.error("Failed to update like");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  return (
    <button onClick={() => mutation.mutate(!initialLiked)}>
      {initialLiked ? "❤️" : "🤍"} {initialCount}
    </button>
  );
}
```

---

## 19. Suspense (React)

### Theory

**Suspense** lets components **wait** for something (lazy-loaded code, async data) before rendering, showing a **fallback** UI in the meantime. It enables declarative loading states instead of manual `isLoading` flags.

Current uses:

- **`React.lazy`** — code splitting fallback
- **React 19+ / frameworks** — async data fetching with Suspense
- **Streaming SSR** — send HTML progressively

### Pros & Cons

| Pros                              | Cons                                            |
| --------------------------------- | ----------------------------------------------- |
| Declarative loading states        | Data fetching Suspense needs framework support  |
| Enables streaming SSR             | Error handling needs Error Boundaries alongside |
| Composable fallbacks at any level | Learning curve                                  |

### Real-Life Example

```tsx
import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("./Dashboard"));
const Settings = lazy(() => import("./Settings"));

function App() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<SettingsSkeleton />}>
              <Settings />
            </Suspense>
          }
        />
      </Routes>
    </Suspense>
  );
}

// Nested Suspense — granular loading
function Page() {
  return (
    <div>
      <Header /> {/* renders immediately */}
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar /> {/* lazy */}
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>
        <MainContent /> {/* lazy + async data */}
      </Suspense>
    </div>
  );
}
```

---

## 20. Image Optimization (WebP, AVIF)

### Theory

Images are often the **largest page weight**. Modern formats compress better than JPEG/PNG:

| Format   | vs JPEG         | Browser support             |
| -------- | --------------- | --------------------------- |
| **WebP** | ~25–35% smaller | Universal (2024+)           |
| **AVIF** | ~50% smaller    | Chrome, Firefox, Safari 16+ |
| **JPEG** | Baseline        | Universal                   |

Also use: responsive `srcset`, lazy loading, explicit dimensions (CLS), CDN image optimization.

### Pros & Cons

| Modern formats (WebP/AVIF)        | Legacy JPEG/PNG only      |
| --------------------------------- | ------------------------- |
| ✅ 25–50% smaller files           | ❌ Slower LCP             |
| ✅ Better quality at same size    | ❌ Higher bandwidth costs |
| ❌ Need fallback for old browsers |                           |

### Real-Life Example

```html
<!-- Picture element — AVIF → WebP → JPEG fallback -->
<picture>
  <source srcset="/images/hero.avif" type="image/avif" />
  <source srcset="/images/hero.webp" type="image/webp" />
  <img
    src="/images/hero.jpg"
    alt="Team collaboration"
    width="1200"
    height="600"
    loading="lazy"
    decoding="async"
  />
</picture>

<!-- Responsive srcset -->
<img
  src="/product-400.webp"
  srcset="
    /product-400.webp   400w,
    /product-800.webp   800w,
    /product-1200.webp 1200w
  "
  sizes="(max-width: 600px) 100vw, 400px"
  alt="Product"
  width="400"
  height="300"
/>
```

```tsx
// Next.js Image — automatic optimization
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={blurDataUrl}
  priority={isAboveFold}
/>;
```

---

## 21. Accessibility (a11y)

### Theory

**Accessibility** ensures apps are usable by everyone — screen reader users, keyboard-only users, people with motor/cognitive disabilities. Standard: **WCAG 2.1 AA**.

Principles (**POUR**): Perceivable, Operable, Understandable, Robust.

### Pros & Cons

| Accessible apps         | Ignoring a11y               |
| ----------------------- | --------------------------- |
| ✅ 15%+ larger audience | ❌ Legal liability          |
| ✅ Better SEO           | ❌ Fails enterprise RFPs    |
| ✅ Better UX for all    | ❌ Lighthouse score penalty |

### Real-Life Example

```tsx
// Semantic, keyboard-accessible form
<form onSubmit={handleSubmit} aria-labelledby="form-title">
  <h2 id="form-title">Contact Us</h2>

  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    required
    aria-describedby="email-error"
    aria-invalid={!!errors.email}
  />
  {errors.email && (
    <p id="email-error" role="alert">{errors.email}</p>
  )}

  <button type="submit">Send</button>
</form>

// Skip link
<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>

// Live region for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## 22. Webpack

### Theory

**Webpack** is a module bundler that takes JavaScript modules (and assets) and bundles them for the browser. It supports code splitting, tree shaking, loaders (CSS, images), and plugins.

Key concepts: **entry**, **output**, **loaders**, **plugins**, **chunks**, **HMR** (Hot Module Replacement).

Modern alternatives: **Vite** (esbuild dev + Rollup prod), **Turbopack** (Next.js), **Rollup**, **esbuild**.

### Pros & Cons

| Webpack                          | Vite                              |
| -------------------------------- | --------------------------------- |
| ✅ Mature, huge plugin ecosystem | ✅ Faster dev server (native ESM) |
| ✅ Highly configurable           | ✅ Simpler config                 |
| ❌ Slow dev server on large apps | ❌ Less mature plugin ecosystem   |
| ❌ Complex configuration         | ✅ Better DX for new projects     |

### Real-Life Example

```javascript
// webpack.config.js — simplified
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js", // cache busting
    clean: true,
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      { test: /\.(png|svg|jpg)$/, type: "asset/resource" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
  ],
  optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: "single",
  },
  devServer: { hot: true, port: 3000 },
};
```

---

## 23. Micro-frontend Architecture

### Theory

**Micro-frontends** split a large frontend into **independently deployable applications** owned by different teams. Each handles a business domain (search, checkout, profile).

Integration: **Module Federation**, **iframes**, **Web Components**, **single-spa**.

### Pros & Cons

| Pros                                | Cons                                      |
| ----------------------------------- | ----------------------------------------- |
| Team autonomy — independent deploys | Inconsistent UX across teams              |
| Technology flexibility              | Shared state / routing complexity         |
| Incremental migration               | Performance overhead (multiple bundles)   |
| Fault isolation                     | Dependency duplication without federation |

### Real-Life Example

```
Shell App (routing, auth, layout)
├── Search MFE      (Team A — React)
├── Checkout MFE    (Team B — React)
├── Profile MFE     (Team C — Vue)
└── Analytics MFE   (Team D — React)

Integration via Module Federation:
```

```javascript
// Remote — checkout team exposes widget
new ModuleFederationPlugin({
  name: "checkout",
  filename: "remoteEntry.js",
  exposes: { "./CheckoutWidget": "./src/CheckoutWidget" },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});

// Host — shell app consumes
const CheckoutWidget = lazy(() => import("checkout/CheckoutWidget"));
```

---

## 24. Testing — RTL, Jest, Playwright

### Theory

Frontend testing pyramid:

| Layer         | Tool                        | Tests                           |
| ------------- | --------------------------- | ------------------------------- |
| **Unit**      | Jest / Vitest               | Pure functions, reducers, utils |
| **Component** | React Testing Library (RTL) | User behavior, rendering        |
| **E2E**       | Playwright / Cypress        | Full user flows in browser      |

**RTL philosophy:** Test how users interact — query by role, label, text. Not implementation details.

### Pros & Cons

| Tool       | Best for                     | Avoid for     |
| ---------- | ---------------------------- | ------------- |
| Jest       | Unit tests, snapshots, mocks | Visual layout |
| RTL        | Component behavior           | E2E flows     |
| Playwright | Cross-browser E2E, CI        | Unit logic    |

### Real-Life Example

```tsx
// Jest + RTL — component test
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("shows error on invalid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "wrong@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid/i);
    });
  });
});

// Jest — reducer unit test
describe("cartReducer", () => {
  it("adds item to cart", () => {
    const state = cartReducer(
      undefined,
      addItem({ id: "1", name: "Biryani", price: 299 }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe("Biryani");
  });
});
```

```typescript
// Playwright — E2E test
import { test, expect } from "@playwright/test";

test("user can complete checkout", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("button", { name: "Add to Cart" }).first().click();
  await page.getByRole("link", { name: "Cart" }).click();
  await expect(page.getByText("1 item")).toBeVisible();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByLabel("Card number").fill("4242424242424242");
  await page.getByRole("button", { name: "Pay" }).click();
  await expect(page.getByText("Order confirmed")).toBeVisible();
});
```

---

## 25. Polyfills & Babel

### Theory

**Babel** is a JavaScript **compiler/transpiler** that converts modern JS (ES2022+) into code that older browsers understand. It handles syntax transformation (arrow functions, classes, async/await).

**Polyfills** add **missing API implementations** at runtime (e.g., `Promise`, `Array.prototype.flat`, `fetch`). Babel handles syntax; polyfills handle APIs.

`@babel/preset-env` uses **browserslist** to determine which transforms and polyfills are needed.

### Pros & Cons

| Babel + polyfills          | Ship modern JS only        |
| -------------------------- | -------------------------- |
| ✅ Works on older browsers | ✅ Smaller bundle          |
| ✅ Use latest syntax today | ❌ Breaks on IE/old Safari |
| ❌ Increases bundle size   | ❌ Limits API usage        |
| ❌ Build step required     |                            |

### Real-Life Example

```javascript
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",  // auto-import only needed polyfills
      "corejs": 3
    }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

```javascript
// Modern code you write
const greet = async (name) => {
  const data = await fetch(`/api/users/${name}`).then((r) => r.json());
  return data.items?.flat() ?? [];
};

// Babel transforms syntax (async/await → regenerator)
// core-js polyfills: Promise, Array.prototype.flat, optional chaining
```

```javascript
// Manual polyfill example — Promise.all
if (!Promise.all) {
  Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
      const results = [];
      let done = 0;
      promises.forEach((p, i) => {
        Promise.resolve(p)
          .then((v) => {
            results[i] = v;
            if (++done === promises.length) resolve(results);
          })
          .catch(reject);
      });
    });
  };
}
```

```json
// browserslist — controls Babel output
{
  "browserslist": [">0.2%", "not dead", "not ie 11"]
}
```

**Babel vs Polyfill:**

|         | Babel                                           | Polyfill                               |
| ------- | ----------------------------------------------- | -------------------------------------- |
| Handles | Syntax (arrow, class, async)                    | Missing APIs (Promise, fetch, flat)    |
| When    | Build time                                      | Runtime                                |
| Example | `const fn = () => {}` → `var fn = function(){}` | Adds `Array.prototype.flat` if missing |

---

# Quick Revision Cheat Sheet

| #   | Topic                   | One-liner                                           |
| --- | ----------------------- | --------------------------------------------------- |
| 1   | Pagination              | Offset or cursor; shareable pages                   |
| 2   | Infinite scroll         | Intersection Observer + cursor API                  |
| 3   | Debouncing              | Wait for pause before executing                     |
| 4   | WebSocket               | Persistent bidirectional real-time connection       |
| 5   | REST vs GraphQL         | Fixed endpoints vs client-defined queries           |
| 6   | localStorage vs Cookies | 5MB client-only vs 4KB auto-sent; httpOnly for auth |
| 7   | AuthN vs AuthZ          | Who are you? vs What can you do?                    |
| 8   | Redux                   | dispatch → reducer → store → UI                     |
| 9   | Lazy loading            | Defer until needed — lazy(), loading="lazy"         |
| 10  | Code splitting          | Dynamic import → separate chunks                    |
| 11  | Bundle optimization     | Analyze, split, import selectively, <200KB          |
| 12  | Tree shaking            | ESM dead code elimination at build time             |
| 13  | Memoization             | useMemo=value, useCallback=fn, memo=component       |
| 14  | Caching                 | HTTP headers, CDN, React Query, Service Worker      |
| 15  | CSR/SSR/SSG/ISR         | Browser / server / build / build+revalidate         |
| 16  | Web Vitals              | LCP≤2.5s, INP≤200ms, CLS≤0.1                        |
| 17  | Cross-browser           | Can I Use, Autoprefixer, polyfills, browserslist    |
| 18  | Optimistic UI           | Update immediately, rollback on failure             |
| 19  | Suspense                | Declarative fallback while loading                  |
| 20  | Images                  | AVIF → WebP → JPEG; srcset, lazy, dimensions        |
| 21  | a11y                    | Semantic HTML, ARIA, keyboard, WCAG AA              |
| 22  | Webpack                 | Module bundler — entry, loaders, plugins, chunks    |
| 23  | Micro-frontends         | Independent deployable frontend apps                |
| 24  | Testing                 | Jest=unit, RTL=component, Playwright=E2E            |
| 25  | Babel/Polyfills         | Babel=syntax transform; polyfill=missing APIs       |

---

_These 25 concepts cover the full frontend stack — from network layer to rendering, performance, testing, and architecture. Use this as a revision checklist before interviews._
