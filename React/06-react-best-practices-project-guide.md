---
title: "React Key Points Every Developer Must Remember While Building a Project"
description: "20 essential React practices for scalable, maintainable, and performant applications — with theory, pros/cons, and real-life examples."
tags: ["react", "best-practices", "architecture", "performance", "interview"]
level: "All levels"
---

# React Key Points Every Developer Must Remember While Building a Project

Whether you're a beginner or an experienced React developer, these concepts make applications **more scalable, maintainable, and performant**. Each point includes **Theory**, **Pros & Cons**, and a **Real-Life Example**.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Keep components small and reusable](#p1) |
| <span id="i2"></span>2 | [Lift state up only when required](#p2) |
| <span id="i3"></span>3 | [Use custom hooks to avoid duplicate logic](#p3) |
| <span id="i4"></span>4 | [Never mutate state directly](#p4) |
| <span id="i5"></span>5 | [Use unique keys while rendering lists](#p5) |
| <span id="i6"></span>6 | [Understand when components re-render](#p6) |
| <span id="i7"></span>7 | [Use useMemo and useCallback only when necessary](#p7) |
| <span id="i8"></span>8 | [Optimize API calls and handle loading/error states](#p8) |
| <span id="i9"></span>9 | [Use React.lazy() and code splitting](#p9) |
| <span id="i10"></span>10 | [Keep business logic separate from UI](#p10) |
| <span id="i11"></span>11 | [Follow a proper folder structure](#p11) |
| <span id="i12"></span>12 | [Use Error Boundaries](#p12) |
| <span id="i13"></span>13 | [Avoid unnecessary prop drilling](#p13) |
| <span id="i14"></span>14 | [Clean up subscriptions in useEffect](#p14) |
| <span id="i15"></span>15 | [Write unit tests for critical functionality](#p15) |
| <span id="i16"></span>16 | [Focus on accessibility](#p16) |
| <span id="i17"></span>17 | [Implement responsive design from the beginning](#p17) |
| <span id="i18"></span>18 | [Use environment variables](#p18) |
| <span id="i19"></span>19 | [Keep dependencies updated](#p19) |
| <span id="i20"></span>20 | [Measure performance](#p20) |

---

<a id="p1"></a>

## 1. Keep components small and reusable

### Theory

A React component should do **one thing well**. Small components are easier to read, test, reuse, and debug. The Single Responsibility Principle applies here — a `ProductCard` displays a product; it shouldn't also handle cart logic, API calls, and modal state.

**Rule of thumb:** If a component exceeds ~150 lines or has more than one reason to change, split it.

### Pros & Cons

| Small components             | Large monolithic components   |
| ---------------------------- | ----------------------------- |
| ✅ Easy to test in isolation | ❌ Hard to reason about       |
| ✅ Reusable across pages     | ❌ Copy-paste duplication     |
| ✅ Faster to review in PRs   | ❌ One bug affects everything |
| ✅ Clear prop contracts      | ❌ Hidden side effects        |

### Real-Life Example

```tsx
// ❌ Bad — one giant component doing everything
function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  // ... 200 more lines of fetch, filter, render, modal logic
}

// ✅ Good — composed from small, focused components
function OrderPage() {
  const { orders, loading, error } = useOrders();
  const [filter, setFilter] = useState("all");

  if (loading) return <OrderListSkeleton />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <OrderFilter value={filter} onChange={setFilter} />
      <OrderList orders={filterOrders(orders, filter)} />
    </div>
  );
}

function OrderList({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
}

function OrderCard({ order }) {
  return (
    <li className="order-card">
      <OrderStatusBadge status={order.status} />
      <span>{order.itemName}</span>
      <span>₹{order.total}</span>
    </li>
  );
}
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Lift state up only when required

### Theory

**Lifting state up** means moving shared state to the closest common ancestor of components that need it. Only lift when **siblings need to share data** or a **parent must coordinate** children.

Don't lift state prematurely — colocate state as close as possible to where it's used. Local state that only one component needs should stay local.

### Pros & Cons

| Lift when needed          | Lift too early                                     |
| ------------------------- | -------------------------------------------------- |
| ✅ Siblings stay in sync  | ❌ Unnecessary re-renders of parent tree           |
| ✅ Single source of truth | ❌ Props passed through components that don't care |
| ✅ Predictable data flow  | ❌ Harder to refactor later                        |

### Real-Life Example

```tsx
// ❌ Over-lifted — theme in App when only Settings page needs it
function App() {
  const [fontSize, setFontSize] = useState(16); // only Settings uses this
  return (
    <>
      <Header fontSize={fontSize} />
      <Settings fontSize={fontSize} setFontSize={setFontSize} />
    </>
  );
}

// ✅ Colocated — state lives where it's used
function Settings() {
  const [fontSize, setFontSize] = useState(16);
  return <FontSizeSlider value={fontSize} onChange={setFontSize} />;
}

// ✅ Correctly lifted — two siblings share selected tab
function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <TabPanel activeTab={activeTab} />
    </>
  );
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Use custom hooks to avoid duplicate logic

### Theory

**Custom hooks** extract reusable stateful logic into functions prefixed with `use`. They let you share behavior — data fetching, form handling, debouncing, local storage — across components without copy-pasting `useState` + `useEffect` blocks.

A custom hook is not a component — it doesn't render UI. It returns data and functions.

### Pros & Cons

| Custom hooks                        | Duplicate logic in components          |
| ----------------------------------- | -------------------------------------- |
| ✅ DRY — write once, use everywhere | ❌ Bug fixes needed in multiple places |
| ✅ Testable in isolation            | ❌ Inconsistent behavior across pages  |
| ✅ Readable component code          | ❌ Components become bloated           |
| ✅ Composable (hooks calling hooks) | —                                      |

### Real-Life Example

```tsx
// Custom hook — reusable across the app
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

// Usage — clean components
function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    "recent",
    [],
  );

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return <SearchInput value={query} onChange={setQuery} compact={isMobile} />;
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Never mutate state directly

### Theory

React detects state changes by **reference comparison** (`Object.is`). Mutating an object or array in place doesn't change its reference, so React won't re-render — and even if you force a re-render, other components holding the old reference see stale data.

Always create **new objects/arrays** when updating state. React 18's `useState` setter does not auto-clone your data.

### Pros & Cons

| Immutable updates              | Direct mutation                         |
| ------------------------------ | --------------------------------------- |
| ✅ Predictable re-renders      | ❌ Silent bugs — UI doesn't update      |
| ✅ Time-travel debugging works | ❌ Stale references in child components |
| ✅ Easier change detection     | ❌ Breaks React.memo comparisons        |
| ✅ Safer concurrent rendering  | —                                       |

### Real-Life Example

```tsx
function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // ❌ WRONG — mutates state directly
  const addItemBad = (item: CartItem) => {
    items.push(item); // mutates array in place
    setItems(items); // same reference → React may skip re-render
  };

  // ✅ CORRECT — new array reference
  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  // ✅ Update nested object
  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
    );
  };

  // ✅ Remove item
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartList items={items} onUpdate={updateQuantity} onRemove={removeItem} />
  );
}
```

```tsx
// Redux Toolkit uses Immer internally — looks like mutation but is safe
const cartSlice = createSlice({
  name: "cart",
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload); // Immer creates draft — safe
    },
  },
});
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Use unique keys while rendering lists

### Theory

**Keys** give React a stable identity for list items across re-renders. They help React match, move, insert, or delete elements efficiently without destroying component state.

Use **stable, unique IDs from your data** (database ID, UUID). Avoid array index as key when the list can change order, insert, or delete items.

### Pros & Cons

| Stable unique keys                      | Index keys                                |
| --------------------------------------- | ----------------------------------------- |
| ✅ Preserves component state on reorder | ❌ State "slides" to wrong item on delete |
| ✅ Efficient DOM moves                  | ❌ Unnecessary re-renders                 |
| ✅ Correct animations                   | ❌ Broken enter/exit transitions          |

### Real-Life Example

```tsx
// ❌ Index keys on mutable list
function TodoList({ todos, onDelete }) {
  return todos.map((todo, index) => (
    <TodoItem key={index} todo={todo} onDelete={() => onDelete(index)} />
  ));
  // Delete first item → all keys shift → every item re-mounts with wrong state
}

// ✅ Stable ID keys
function TodoList({ todos, onDelete }) {
  return todos.map((todo) => (
    <TodoItem key={todo.id} todo={todo} onDelete={() => onDelete(todo.id)} />
  ));
}

// When index keys ARE acceptable:
// - Static list that never reorders
// - No local state inside list items
// - No animations
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Understand when components re-render

### Theory

A component re-renders when:

1. Its **own state** changes (`useState`, `useReducer`)
2. Its **parent re-renders** (children re-render by default)
3. **Context** it consumes changes
4. **Props change** (for `React.memo` components — shallow compare)

Re-render ≠ DOM update. React may re-run your component but skip DOM changes if output is identical.

### Pros & Cons

| Understanding re-renders     | Ignoring re-render causes           |
| ---------------------------- | ----------------------------------- |
| ✅ Targeted optimization     | ❌ Random `React.memo` everywhere   |
| ✅ Fewer performance bugs    | ❌ Unnecessary API calls in effects |
| ✅ Correct dependency arrays | ❌ Stale UI state                   |

### Real-Life Example

```tsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <ExpensiveChild name="Dashboard" />{" "}
      {/* re-renders on every count click! */}
    </>
  );
}

// Fix — memoize child that doesn't depend on count
const ExpensiveChild = React.memo(function ExpensiveChild({ name }) {
  console.log("ExpensiveChild rendered");
  return <div>{name}</div>;
});

// Debug re-renders in development
function DebugRender({ name }) {
  useEffect(() => {
    console.log(`${name} rendered at`, new Date().toISOString());
  });
  return null;
}
```

**Re-render triggers cheat sheet:**

| Trigger          | Example                                         |
| ---------------- | ----------------------------------------------- |
| State update     | `setCount(1)`                                   |
| Parent re-render | Parent state changes → all children re-render   |
| Context change   | Theme context value changes                     |
| Force update     | `key` prop change forces remount                |
| No re-render     | `setCount(0)` when count is already 0 (bailout) |

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Use useMemo and useCallback only when necessary

### Theory

`useMemo` caches a **computed value**. `useCallback` caches a **function reference**. Both have memory and comparison overhead — use them only when profiling shows a real problem or when passing callbacks to `React.memo` children.

**Don't optimize prematurely.** Simple components with cheap computations don't benefit.

### Pros & Cons

| When to use                           | When to skip                             |
| ------------------------------------- | ---------------------------------------- |
| Expensive filter/sort on large arrays | `count * 2`                              |
| Stable ref for memoized children      | Child isn't wrapped in `React.memo`      |
| Referential equality for effect deps  | Function only used inside same component |
| Virtualized list item callbacks       | Components that always re-render anyway  |

### Real-Life Example

```tsx
function ProductCatalog({ products, filters }) {
  // ✅ useMemo — filtering 10,000 products is expensive
  const filtered = useMemo(() => {
    return products
      .filter((p) => matchesFilters(p, filters))
      .sort((a, b) => b.rating - a.rating);
  }, [products, filters]);

  // ✅ useCallback — ProductRow is memoized
  const handleAddToCart = useCallback((productId: string) => {
    addToCart(productId);
  }, []);

  return filtered.map((p) => (
    <ProductRow key={p.id} product={p} onAdd={handleAddToCart} />
  ));
}

// ❌ Unnecessary memoization
function Greeting({ name }) {
  const greeting = useMemo(() => `Hello, ${name}`, [name]); // pointless
  const onClick = useCallback(() => alert(name), [name]); // pointless
  return <p onClick={onClick}>{greeting}</p>;
}
```

**Rule:** Profile first with React DevTools Profiler → identify slow renders → then add memoization.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Optimize API calls and handle loading/error states properly

### Theory

Every API call in a UI should handle three states: **loading**, **success**, and **error**. Optimize by: deduplicating requests, caching responses, aborting stale requests, and using libraries like TanStack Query or SWR.

Never leave users staring at a blank screen or show stale data from a previous query.

### Pros & Cons

| TanStack Query / SWR            | Manual fetch in useEffect                  |
| ------------------------------- | ------------------------------------------ |
| ✅ Auto caching, dedup, refetch | ❌ Boilerplate for every endpoint          |
| ✅ Stale-while-revalidate       | ❌ Race conditions without AbortController |
| ✅ Loading/error built-in       | ❌ No background refetch                   |
| ✅ DevTools                     | ❌ Cache invalidation is manual            |

### Real-Life Example

```tsx
// ✅ With TanStack Query — production pattern
function RestaurantList({ city }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["restaurants", city],
    queryFn: () => api.get(`/restaurants?city=${city}`).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) return <RestaurantListSkeleton count={6} />;
  if (isError) return <ErrorBanner message={error.message} onRetry={refetch} />;
  if (!data?.length) return <EmptyState message="No restaurants found" />;

  return data.map((r) => <RestaurantCard key={r.id} restaurant={r} />);
}

// Manual pattern — when you can't use a library
function useFetch<T>(url: string) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Use React.lazy() and code splitting for better performance

### Theory

**Code splitting** breaks your JavaScript bundle into smaller chunks loaded on demand. `React.lazy()` dynamically imports a component, and `<Suspense>` shows a fallback while the chunk loads.

Split by **route** first (biggest impact), then by heavy components (charts, editors, maps).

### Pros & Cons

| Code splitting                               | Single bundle                                     |
| -------------------------------------------- | ------------------------------------------------- |
| ✅ Faster initial page load                  | ❌ User downloads code for pages they never visit |
| ✅ Better Core Web Vitals (LCP, TTI)         | ❌ Longer time-to-interactive on slow networks    |
| ✅ Parallel chunk loading                    | —                                                 |
| ❌ Brief loading flash without good fallback | —                                                 |

### Real-Life Example

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Route-level splitting — each page is a separate chunk
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics")); // heavy chart library
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Component-level splitting — load heavy widget only when needed
const RichTextEditor = lazy(() => import("./RichTextEditor"));

function BlogEditor() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <>
      <button onClick={() => setShowEditor(true)}>Write Post</button>
      {showEditor && (
        <Suspense fallback={<Spinner />}>
          <RichTextEditor />
        </Suspense>
      )}
    </>
  );
}

// Prefetch on hover for instant navigation
<Link to="/analytics" onMouseEnter={() => import("./pages/Analytics")}>
  Analytics
</Link>;
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Keep business logic separate from UI components

### Theory

**UI components** render markup and handle user interaction. **Business logic** handles rules, calculations, validations, and data transformations. Mixing them makes components hard to test and reuse.

Separate into: **services** (API calls), **utils** (pure functions), **hooks** (stateful logic), and **components** (presentation).

### Pros & Cons

| Separated logic                           | Mixed logic in components       |
| ----------------------------------------- | ------------------------------- |
| ✅ Test business rules without rendering  | ❌ Can't unit test calculations |
| ✅ Reuse logic in CLI, mobile, server     | ❌ 300-line components          |
| ✅ Designers can work on UI independently | ❌ Bug fixes risk breaking UI   |
| ✅ Easier to swap UI framework            | —                               |

### Real-Life Example

```tsx
// utils/pricing.ts — pure business logic, no React
export function calculateOrderTotal(
  items: CartItem[],
  coupon?: Coupon,
): OrderTotal {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = coupon ? applyCoupon(subtotal, coupon) : 0;
  const tax = (subtotal - discount) * 0.05;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  return {
    subtotal,
    discount,
    tax,
    deliveryFee,
    total: subtotal - discount + tax + deliveryFee,
  };
}

// services/orderService.ts — API layer
export const orderService = {
  placeOrder: (payload: OrderPayload) => api.post("/orders", payload),
  cancelOrder: (id: string) =>
    api.patch(`/orders/${id}`, { status: "cancelled" }),
};

// hooks/useCheckout.ts — stateful orchestration
function useCheckout() {
  const [items] = useCart();
  const total = useMemo(() => calculateOrderTotal(items), [items]);

  const placeOrder = async () => {
    const result = await orderService.placeOrder({ items, total });
    return result;
  };

  return { items, total, placeOrder };
}

// components/CheckoutSummary.tsx — UI only
function CheckoutSummary() {
  const { items, total, placeOrder } = useCheckout();

  return (
    <div>
      <ItemList items={items} />
      <PriceBreakdown total={total} />
      <button onClick={placeOrder}>Place Order — ₹{total.total}</button>
    </div>
  );
}
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Follow a proper folder structure

### Theory

A good folder structure groups code by **feature** (domain) rather than by **file type**. Colocate components, hooks, API calls, types, and tests for each feature. Shared code lives in a `shared/` or `common/` directory.

### Pros & Cons

| Feature-based structure                  | Type-based structure                            |
| ---------------------------------------- | ----------------------------------------------- |
| ✅ Everything for a feature in one place | ❌ Jump between 5 folders to change one feature |
| ✅ Easy to delete/move features          | ❌ Grows unwieldy at scale                      |
| ✅ Team ownership per feature            | ❌ Merge conflicts across teams                 |
| ✅ Scales with micro-frontends           | —                                               |

### Real-Life Example

```
src/
├── app/                        # App shell
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx           # QueryClient, Theme, Auth providers
│
├── features/                   # Feature modules (preferred)
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── api/
│   │   │   └── authService.ts
│   │   └── types.ts
│   │
│   ├── restaurants/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   │
│   └── cart/
│       ├── components/
│       ├── hooks/
│       ├── store/              # cartSlice if using Redux
│       └── types.ts
│
├── shared/                     # Cross-feature reusables
│   ├── components/             # Button, Input, Modal, Spinner
│   ├── hooks/                  # useDebounce, useMediaQuery
│   ├── utils/                  # formatPrice, dateHelpers
│   └── types/                  # Global types
│
├── assets/                     # Images, fonts, icons
└── styles/                     # Global CSS, tokens, variables
```

**Rules:**

- Import from features → shared ✅
- Import from feature A → feature B ❌ (creates coupling)
- Each feature exports a public API via `index.ts`

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Use Error Boundaries to handle unexpected UI crashes

### Theory

**Error Boundaries** are React components that catch JavaScript errors in their child tree during rendering and display a fallback UI instead of crashing the entire app. They do **not** catch errors in event handlers, async code, or SSR.

Use them at route level, around risky third-party widgets, and around data-heavy sections.

### Pros & Cons

| Error Boundaries                           | No error handling            |
| ------------------------------------------ | ---------------------------- |
| ✅ App stays usable when one section fails | ❌ White screen of death     |
| ✅ Log errors to Sentry/Datadog            | ❌ User has no recovery path |
| ✅ Per-feature isolation                   | ❌ One bug kills entire app  |
| ❌ Class components only (for now)         | —                            |

### Real-Life Example

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logToSentry(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert">
            <h2>Something went wrong</h2>
            <button onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// Wrap each route independently
function App() {
  return (
    <Routes>
      <Route
        path="/orders"
        element={
          <ErrorBoundary fallback={<OrdersErrorPage />}>
            <OrdersPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/profile"
        element={
          <ErrorBoundary fallback={<ProfileErrorPage />}>
            <ProfilePage />
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Avoid unnecessary prop drilling

### Theory

**Prop drilling** is passing data through intermediate components that don't need it. One-to-two levels is fine and explicit. Beyond that, use **Context API**, **component composition**, or a **state library** (Zustand, Redux).

Choose the simplest solution that fits:

- Theme/locale → Context
- Auth session → Context or Zustand
- Complex global state → Redux Toolkit
- Layout slots → Component composition

### Pros & Cons

| Context / Zustand                      | Deep prop drilling                       |
| -------------------------------------- | ---------------------------------------- |
| ✅ Any depth access                    | ❌ Fragile — rename breaks chain         |
| ✅ Cleaner intermediate components     | ❌ Hard to trace data flow               |
| ❌ All consumers re-render on change\* | ✅ Explicit and easy to follow (shallow) |

\*Mitigate with split contexts or Zustand selectors.

### Real-Life Example

```tsx
// ✅ Composition — pass JSX directly, skip intermediates
function App() {
  const [user, setUser] = useState(null);
  return (
    <Layout
      header={<Header user={user} />}
      sidebar={<Sidebar />}
      content={<Dashboard user={user} />}
    />
  );
}

// ✅ Context — theme used deep in tree
const ThemeContext = createContext<"light" | "dark">("light");

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function DeepNestedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button className={theme === "dark" ? "btn-dark" : "btn-light"}>
      Click
    </button>
  );
}
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Clean up subscriptions, timers, and event listeners inside useEffect

### Theory

Effects that create **subscriptions**, **timers**, **WebSockets**, or **event listeners** must return a **cleanup function**. Without cleanup, you get memory leaks, stale state updates on unmounted components, and duplicate listeners.

Cleanup runs: (1) before the effect re-runs when deps change, (2) when the component unmounts.

### Pros & Cons

| With cleanup                                     | Without cleanup                             |
| ------------------------------------------------ | ------------------------------------------- |
| ✅ No memory leaks                               | ❌ WebSocket stays open after navigate away |
| ✅ No "setState on unmounted component" warnings | ❌ Duplicate event listeners on re-render   |
| ✅ Aborted stale API responses                   | ❌ Timers fire after unmount                |

### Real-Life Example

```tsx
function LiveOrderTracker({ orderId }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    // WebSocket
    const ws = new WebSocket(`wss://api.example.com/orders/${orderId}`);
    ws.onmessage = (e) => setStatus(JSON.parse(e.data).status);

    // Timer
    const pollInterval = setInterval(() => {
      fetch(`/api/orders/${orderId}/status`)
        .then((r) => r.json())
        .then((data) => setStatus(data.status));
    }, 5000);

    // Window event
    const handleVisibility = () => {
      if (document.visibilityState === "visible") ws.send("ping");
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Cleanup everything
    return () => {
      ws.close();
      clearInterval(pollInterval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [orderId]);

  return <StatusBadge status={status} />;
}
```

**Cleanup checklist:**

| Resource                     | Cleanup                          |
| ---------------------------- | -------------------------------- |
| `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| `addEventListener`           | `removeEventListener`            |
| WebSocket                    | `ws.close()`                     |
| `fetch` / Axios              | `AbortController.abort()`        |
| `subscribe()` (RxJS, store)  | `unsubscribe()`                  |

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Write unit tests for critical functionality

### Theory

Test **behavior**, not implementation. Focus on critical paths: authentication, payments, form validation, data transformations, and user-facing interactions. Use **React Testing Library** — query by role/label (how users see the UI), not by CSS class or internal state.

**Testing trophy:** More integration tests, fewer shallow unit tests, some E2E (Playwright/Cypress).

### Pros & Cons

| Testing critical paths             | No tests                                |
| ---------------------------------- | --------------------------------------- |
| ✅ Catch regressions before deploy | ❌ Production bugs cost more to fix     |
| ✅ Confidence to refactor          | ❌ Fear of changing code                |
| ✅ Living documentation            | ❌ Manual QA only — slow and incomplete |
| ❌ Initial time investment         | —                                       |

### Real-Life Example

```tsx
// utils/pricing.test.ts — pure logic, fast tests
import { calculateOrderTotal } from "./pricing";

describe("calculateOrderTotal", () => {
  it("applies free delivery above ₹500", () => {
    const items = [{ price: 300, quantity: 2 }]; // subtotal = 600
    const result = calculateOrderTotal(items);
    expect(result.deliveryFee).toBe(0);
  });

  it("charges ₹40 delivery below ₹500", () => {
    const items = [{ price: 200, quantity: 1 }];
    const result = calculateOrderTotal(items);
    expect(result.deliveryFee).toBe(40);
  });
});
```

```tsx
// components/LoginForm.test.tsx — user behavior
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("shows error on invalid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText(/email/i), "wrong@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /invalid credentials/i,
      );
    });
  });

  it("disables submit while loading", async () => {
    render(<LoginForm onSubmit={() => new Promise(() => {})} />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
  });
});
```

**What to test vs skip:**

| Test ✅                        | Skip ❌                                       |
| ------------------------------ | --------------------------------------------- |
| Payment/checkout flow          | Third-party library internals                 |
| Form validation rules          | CSS styling (use visual regression)           |
| Auth guards / protected routes | Every trivial render                          |
| Business logic (utils)         | Implementation details (state variable names) |

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Focus on accessibility

### Theory

**Accessibility (a11y)** ensures your app is usable by everyone — screen reader users, keyboard-only users, people with motor impairments, and users on slow connections. It's also a legal requirement in many countries (ADA, WCAG 2.1).

Key practices: semantic HTML, ARIA attributes where needed, keyboard navigation, focus management, color contrast, and alt text.

### Pros & Cons

| Accessible apps                       | Ignoring a11y              |
| ------------------------------------- | -------------------------- |
| ✅ Larger user base                   | ❌ Legal risk              |
| ✅ Better SEO (semantic HTML)         | ❌ Excludes disabled users |
| ✅ Better keyboard UX for power users | ❌ Fails automated audits  |
| ✅ Required by enterprise clients     | —                          |

### Real-Life Example

```tsx
// ❌ Inaccessible
<div onClick={handleSubmit}>Submit</div>
<input placeholder="Search" />
<div className="modal">...</div>

// ✅ Accessible
<button type="submit" onClick={handleSubmit}>Submit</button>

<label htmlFor="search-input" className="sr-only">Search restaurants</label>
<input
  id="search-input"
  type="search"
  placeholder="Search restaurants"
  aria-describedby="search-hint"
/>
<span id="search-hint" className="sr-only">Type to search by name or cuisine</span>

<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  ref={modalRef}
  tabIndex={-1}
>
  <h2 id="modal-title">Confirm Order</h2>
  ...
</div>
```

**Accessibility checklist:**

| Practice       | Example                                           |
| -------------- | ------------------------------------------------- |
| Semantic HTML  | `<button>`, `<nav>`, `<main>`, `<article>`        |
| Labels         | `<label htmlFor="email">` or `aria-label`         |
| Keyboard       | All actions reachable via Tab + Enter/Space       |
| Focus trap     | Modal keeps focus inside until closed             |
| Color contrast | 4.5:1 ratio for text (WCAG AA)                    |
| Alt text       | `<img alt="Chicken Biryani from Spice Garden" />` |
| Skip link      | "Skip to main content" for screen readers         |
| Live regions   | `aria-live="polite"` for dynamic status updates   |

```bash
# Audit tools
npm install -D @axe-core/react eslint-plugin-jsx-a11y
npx playwright test --grep a11y
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Implement responsive design from the beginning

### Theory

**Responsive design** ensures your UI works across mobile, tablet, and desktop. Build mobile-first (start with small screens, add breakpoints up) using CSS Grid, Flexbox, relative units (`rem`, `%`, `vw`), and container queries.

Don't treat responsive as an afterthought — retrofitting is expensive.

### Pros & Cons

| Mobile-first responsive             | Desktop-only then retrofit  |
| ----------------------------------- | --------------------------- |
| ✅ Works on 60%+ mobile traffic     | ❌ Expensive rework         |
| ✅ Forces content prioritization    | ❌ Broken layouts on phones |
| ✅ Better Core Web Vitals on mobile | ❌ Lost users on mobile     |

### Real-Life Example

```css
/* Mobile-first — base styles for small screens */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 2rem;
  }
}
```

```tsx
// React — responsive with custom hook
function ProductPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="product-page">
      {isMobile ? <MobileProductLayout /> : <DesktopProductLayout />}
    </div>
  );
}

// Tailwind example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
  {products.map((p) => (
    <ProductCard key={p.id} product={p} />
  ))}
</div>;
```

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. Use environment variables for configuration values

### Theory

**Environment variables** store configuration that changes between environments (development, staging, production) — API URLs, feature flags, public keys. Never hardcode URLs or commit secrets to git.

In Vite: `VITE_` prefix. In Create React App: `REACT_APP_` prefix. Only variables with these prefixes are exposed to the browser bundle.

### Pros & Cons

| Environment variables                 | Hardcoded values                        |
| ------------------------------------- | --------------------------------------- |
| ✅ Different config per environment   | ❌ Must change code to deploy           |
| ✅ No secrets in source code          | ❌ Risk of committing API keys          |
| ✅ CI/CD friendly                     | ❌ Same build can't serve multiple envs |
| ❌ Public in bundled JS (VITE\_ vars) | —                                       |

### Real-Life Example

```bash
# .env.development
VITE_API_URL=http://localhost:3001/api
VITE_ENABLE_MOCK=true
VITE_APP_NAME=MyApp (Dev)

# .env.production
VITE_API_URL=https://api.production.com
VITE_ENABLE_MOCK=false
VITE_APP_NAME=MyApp
```

```typescript
// config/env.ts — typed, centralized
export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  enableMock: import.meta.env.VITE_ENABLE_MOCK === "true",
  appName: import.meta.env.VITE_APP_NAME as string,
} as const;

// Usage
const apiClient = axios.create({ baseURL: env.apiUrl });
```

```gitignore
# .gitignore — NEVER commit these
.env
.env.local
.env.production
```

**Rules:**

- ✅ `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID` (public)
- ❌ `VITE_STRIPE_SECRET_KEY`, `VITE_DB_PASSWORD` (secrets belong on server only)

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Keep dependencies updated and remove unused packages

### Theory

Outdated dependencies carry **security vulnerabilities**, miss performance improvements, and create compatibility issues. Unused packages bloat your bundle and increase attack surface.

Maintain a regular update cadence: weekly `npm audit`, monthly minor updates, careful major version upgrades with changelog review.

### Pros & Cons

| Updated dependencies                           | Neglected dependencies      |
| ---------------------------------------------- | --------------------------- |
| ✅ Security patches applied                    | ❌ Known CVEs in production |
| ✅ Smaller bundles (tree-shaking improvements) | ❌ Breaking changes pile up |
| ✅ New features and bug fixes                  | ❌ Harder to upgrade later  |
| ❌ Update time / testing cost                  | —                           |

### Real-Life Example

```bash
# Check for vulnerabilities
npm audit
npm audit fix

# Find outdated packages
npm outdated

# Remove unused dependencies
npx depcheck

# Analyze bundle size
npx source-map-explorer build/static/js/*.js

# Safe update workflow
npm update                    # minor/patch updates
npx npm-check-updates -u      # see major updates available
npm install                   # apply
npm test                      # verify nothing broke
```

```json
// package.json — CI scripts
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "depcheck": "depcheck",
    "analyze": "source-map-explorer build/static/js/*.js"
  }
}
```

**Dependency hygiene checklist:**

| Action                                    | Frequency         |
| ----------------------------------------- | ----------------- |
| `npm audit`                               | Every PR / weekly |
| Remove unused packages                    | Monthly           |
| Update patch/minor versions               | Monthly           |
| Review major version changelogs           | Quarterly         |
| Lock file committed (`package-lock.json`) | Always            |
| Dependabot / Renovate in CI               | Automated         |

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. Measure performance using React DevTools and Lighthouse

### Theory

You can't optimize what you don't measure. Use **React DevTools Profiler** for component render performance and **Lighthouse** for overall web vitals (LCP, INP, CLS, TTI, bundle size).

Set **performance budgets** and enforce them in CI to prevent regressions.

### Pros & Cons

| Measuring performance       | Guessing performance                |
| --------------------------- | ----------------------------------- |
| ✅ Data-driven optimization | ❌ Premature memoization everywhere |
| ✅ Catch regressions in CI  | ❌ Users report slowness first      |
| ✅ Prioritize biggest wins  | ❌ Waste time on non-issues         |
| ❌ Tooling setup time       | —                                   |

### Real-Life Example

#### React DevTools Profiler

```
1. Install React DevTools browser extension
2. Open Profiler tab → click Record
3. Interact with your app (navigate, type, scroll)
4. Stop recording → analyze:
   - Flame chart: which components rendered and how long
   - Ranked chart: slowest components first
   - "Why did this render?" (React 19+)
```

```tsx
// Programmatic profiling in development
import { Profiler } from "react";

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
) {
  if (actualDuration > 16) {
    // slower than 1 frame at 60fps
    console.warn(`[Profiler] ${id} (${phase}): ${actualDuration.toFixed(1)}ms`);
  }
}

<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList products={products} />
</Profiler>;
```

#### Lighthouse

```bash
# CLI audit
npx lighthouse https://your-app.com --view

# CI integration
npm install -D @lhci/cli
# lighthouserc.js — fail CI if scores drop below threshold
```

#### Web Vitals in production

```tsx
import { onLCP, onINP, onCLS } from "web-vitals";

function sendToAnalytics(metric) {
  // Google Analytics, Datadog, Sentry
  analytics.track(metric.name, {
    value: metric.value,
    page: window.location.pathname,
  });
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

**Performance budget example:**

| Metric            | Budget           |
| ----------------- | ---------------- |
| Initial JS bundle | < 200 KB gzipped |
| LCP               | < 2.5s           |
| INP               | < 200ms          |
| CLS               | < 0.1            |
| Component render  | < 16ms (60fps)   |

---

# Quick Revision Cheat Sheet

| #   | Practice          | One-liner                                      |
| --- | ----------------- | ---------------------------------------------- |
| 1   | Small components  | One responsibility, ~150 lines max             |
| 2   | Lift state wisely | Colocate first; lift only for shared siblings  |
| 3   | Custom hooks      | Extract duplicate stateful logic               |
| 4   | Immutable state   | Always new reference: spread, map, filter      |
| 5   | Unique keys       | Stable IDs from data, not index                |
| 6   | Re-renders        | State, parent, context trigger renders         |
| 7   | Memoization       | Profile first; useMemo/useCallback when needed |
| 8   | API states        | Always handle loading, error, empty, success   |
| 9   | Code splitting    | React.lazy per route + Suspense fallback       |
| 10  | Separate logic    | utils + services + hooks + UI components       |
| 11  | Folder structure  | Feature-based, not type-based                  |
| 12  | Error Boundaries  | Per-route fallback, log to Sentry              |
| 13  | Prop drilling     | Context/composition/Zustand when >2 levels     |
| 14  | useEffect cleanup | Close WS, clear timers, abort fetch            |
| 15  | Unit tests        | Test behavior, critical paths, RTL             |
| 16  | Accessibility     | Semantic HTML, ARIA, keyboard, contrast        |
| 17  | Responsive        | Mobile-first, Grid/Flexbox, breakpoints        |
| 18  | Env variables     | VITE\_ prefix, never secrets in frontend       |
| 19  | Dependencies      | npm audit, depcheck, regular updates           |
| 20  | Performance       | React Profiler + Lighthouse + Web Vitals RUM   |

---

_These 20 practices form the foundation of production-grade React development. Apply them from day one of a project — retrofitting is always harder than building right._


<p><a href="#i20">Back to index</a></p>
