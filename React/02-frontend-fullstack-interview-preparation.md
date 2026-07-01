---
title: "Frontend Full-Stack Interview Preparation (1.5 Hour Round)"
description: "React, Advanced JavaScript, C++, and DSA — theory and practical examples for modern frontend interviews."
tags: ["react", "javascript", "cpp", "dsa", "interview"]
level: "4+ years"
duration: "90 minutes"
---

# Frontend Full-Stack Interview Preparation (1.5 Hour Round)

Modern frontend interviews now span **React internals**, **advanced JavaScript**, **C++ fundamentals**, and **DSA**. This guide covers every question from a recent 90-minute interview — with theory, code, and interview-ready answers.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [How does React decide whether a component should re-render?](#p1) |
| <span id="i2"></span>2 | [Explain React Fiber Architecture](#p2) |
| <span id="i3"></span>3 | [Difference between Server Components and Client Components](#p3) |
| <span id="i4"></span>4 | [How would you optimize a React application with thousands of rows?](#p4) |
| <span id="i5"></span>5 | [Explain React's rendering lifecycle from state update to DOM update](#p5) |
| <span id="i6"></span>6 | [When should you avoid Context API?](#p6) |
| <span id="i7"></span>7 | [Difference between `useMemo`, `useCallback`, and `React.memo`](#p7) |
| <span id="i8"></span>8 | [How do you handle race conditions in API calls?](#p8) |
| <span id="i9"></span>9 | [Explain code splitting and lazy loading](#p9) |
| <span id="i10"></span>10 | [What happens internally when a state update is triggered?](#p10) |
| <span id="i11"></span>11 | [How would you design a reusable component library?](#p11) |
| <span id="i1"></span>1 | [Implement your own version of `Promise.all()`](#p1) |
| <span id="i2"></span>2 | [What are `WeakMap` and `WeakSet`?](#p2) |
| <span id="i3"></span>3 | [Explain event delegation with a practical example](#p3) |
| <span id="i4"></span>4 | [Difference between Deep Copy and Shallow Copy](#p4) |
| <span id="i5"></span>5 | [How does garbage collection work in JavaScript?](#p5) |
| <span id="i6"></span>6 | [Explain lexical scope and closure in detail](#p6) |
| <span id="i7"></span>7 | [What is the difference between synchronous and asynchronous iteration?](#p7) |
| <span id="i8"></span>8 | [Polyfill for `Array.map()`](#p8) |
| <span id="i9"></span>9 | [Polyfill for `Function.bind()`](#p9) |
| <span id="i10"></span>10 | [Explain currying and function composition](#p10) |
| <span id="i11"></span>11 | [What happens behind the scenes when `async/await` executes?](#p11) |
| <span id="i1"></span>1 | [What are Smart Pointers?](#p1) |
| <span id="i2"></span>2 | [Difference between `unique_ptr` and `shared_ptr`](#p2) |
| <span id="i3"></span>3 | [Explain move semantics](#p3) |
| <span id="i4"></span>4 | [What is RAII?](#p4) |
| <span id="i5"></span>5 | [Difference between `vector` and `list`](#p5) |
| <span id="i6"></span>6 | [What happens during object construction and destruction?](#p6) |
| <span id="i7"></span>7 | [Explain copy constructor and move constructor](#p7) |
| <span id="i8"></span>8 | [How does virtual table (vtable) work?](#p8) |
| <span id="i1"></span>1 | [Find the First Non-Repeating Character in a string](#p1) |
| <span id="i2"></span>2 | [Two Sum Problem](#p2) |
| <span id="i3"></span>3 | [Debounce and Throttle implementation](#p3) |
| <span id="i4"></span>4 | [Flatten a Nested Array](#p4) |

---
# React JS

<a id="p1"></a>

## 1. How does React decide whether a component should re-render?

### Theory

A component re-renders when React schedules an update for it. Triggers include:

| Trigger              | Example                                              |
| -------------------- | ---------------------------------------------------- |
| **State change**     | `setState`, `useState` setter, `useReducer` dispatch |
| **Parent re-render** | Child re-renders by default (unless memoized)        |
| **Context change**   | Consumer re-renders when context value changes       |
| **Force update**     | `forceUpdate` (class) — rarely used                  |
| **External store**   | `useSyncExternalStore` subscription fires            |

React does **not** re-render when:

- Props are the same reference and state unchanged (for memoized components)
- State update is **bailed out** because `Object.is(oldState, newState)` is true

### Re-render vs DOM update

Re-render = React calls your component function again and diffs the output.
DOM update = Only happens if the diff produces changes (commit phase).

### Practical Example

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <Child name="Amit" /> {/* re-renders on every Parent render */}
      <MemoChild name="Rahul" /> {/* skips if props unchanged */}
    </>
  );
}

const MemoChild = React.memo(function MemoChild({ name }) {
  console.log("MemoChild render");
  return <p>{name}</p>;
});
```

### Bailout conditions

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(0); // React bails out — state already 0, no re-render
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

### Interview answer

> React re-renders when state, context, or parent updates change. By default children re-render with parents. Use `React.memo`, `useMemo`, and `useCallback` selectively — not everywhere — to skip unnecessary work. Re-rendering is cheap; committing DOM changes is the expensive part.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Explain React Fiber Architecture

### Theory

**Fiber** is React's reconciliation engine (React 16+). Each component, DOM node, or hook has a **Fiber node** — a JS object representing a unit of work.

### Why Fiber replaced the old stack reconciler

| Old Stack Reconciler   | Fiber                               |
| ---------------------- | ----------------------------------- |
| Synchronous, recursive | Incremental, interruptible          |
| Blocks main thread     | Can pause and resume                |
| No prioritization      | Priority lanes (urgent vs deferred) |

### Fiber node structure (simplified)

```javascript
{
  type: 'div',           // component type
  stateNode: domNode,    // real DOM node (for host components)
  child: Fiber,          // first child
  sibling: Fiber,        // next sibling
  return: Fiber,         // parent
  alternate: Fiber,      // previous version (double buffering)
  pendingProps: {},
  memoizedState: {},     // hooks linked list lives here
  flags: Placement,      // side effects to commit
}
```

### Two phases

```
┌─────────────────────────────────────────────────────────┐
│  RENDER PHASE (interruptible)                           │
│  - Walk Fiber tree                                      │
│  - Call component functions                             │
│  - Diff children                                        │
│  - Mark effects (Placement, Update, Deletion)           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  COMMIT PHASE (synchronous, cannot interrupt)           │
│  1. Before mutation (getSnapshotBeforeUpdate)           │
│  2. Mutation (apply DOM changes)                        │
│  3. Layout (useLayoutEffect)                            │
│  → then passive effects (useEffect) run async           │
└─────────────────────────────────────────────────────────┘
```

### Concurrent features enabled by Fiber

- **Time slicing** — split work across frames
- **`useTransition`** — mark updates as low priority
- **`Suspense`** — pause rendering while data loads
- **Offscreen / Activity** — hide UI without unmounting

### Interview answer

> Fiber models the UI as a linked list of work units. The render phase is interruptible so React can prioritize user input. The commit phase applies DOM changes synchronously. Double buffering via `alternate` lets React compare old and new trees efficiently.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Difference between Server Components and Client Components

### Theory

|                              | Server Component      | Client Component                    |
| ---------------------------- | --------------------- | ----------------------------------- |
| Directive                    | Default in App Router | `"use client"` at top of file       |
| Runs on                      | Server only           | Server (SSR) + Browser              |
| JS sent to browser           | None for RSC itself   | Full component bundle               |
| Can use hooks (`useState`)   | No                    | Yes                                 |
| Can use browser APIs         | No                    | Yes                                 |
| Can access DB/secrets        | Yes                   | No                                  |
| Can import Client Components | Yes (as children)     | Yes                                 |
| Can import Server Components | No                    | No (only receive as props/children) |

### Composition pattern

```tsx
// app/page.tsx — Server Component
import ClientCounter from "./ClientCounter";

export default async function Page() {
  const data = await fetchFromDB(); // runs on server

  return (
    <main>
      <h1>Dashboard</h1>
      <ClientCounter initialCount={data.count} />
    </main>
  );
}
```

```tsx
// ClientCounter.tsx
"use client";

import { useState } from "react";

export default function ClientCounter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### When to use each

- **Server:** Static content, data fetching, heavy libraries, SEO-critical markup
- **Client:** Interactivity, effects, browser APIs, animations, form state

### Interview answer

> Server Components run on the server, never ship their logic to the client, and can access backend resources directly. Client Components handle interactivity. The boundary is `"use client"` — pass serializable props from server to client, never import server components into client files.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. How would you optimize a React application with thousands of rows?

### Strategy checklist

| Technique                          | Purpose                                          |
| ---------------------------------- | ------------------------------------------------ |
| **Virtualization**                 | Render only visible rows (~20 instead of 10,000) |
| **Stable keys**                    | Prevent unnecessary unmount/remount              |
| **Memoization**                    | `React.memo` on row components                   |
| **Pagination / infinite scroll**   | Load data in chunks                              |
| **Web Workers**                    | Offload sorting/filtering from main thread       |
| **Avoid inline objects/functions** | Prevent memo breakage                            |

### Practical Example — Virtual list with TanStack Virtual

```tsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualTable({ rows }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={row.id}
              style={{
                position: "absolute",
                top: virtualRow.start,
                height: virtualRow.size,
                width: "100%",
              }}
            >
              <Row item={row} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Row = React.memo(function Row({ item }) {
  return <div className="row">{item.name}</div>;
});
```

### Additional optimizations

```tsx
// Debounce search filter
const debouncedFilter = useDeferredValue(searchQuery);

// Sort in worker or server, not on every keystroke in main thread
const filtered = useMemo(
  () => rows.filter((r) => r.name.includes(debouncedFilter)),
  [rows, debouncedFilter],
);
```

### Interview answer

> For thousands of rows, virtualization is non-negotiable — only mount visible DOM nodes. Combine with cursor pagination, memoized row components, `useDeferredValue` for filters, and optionally Web Workers for heavy transforms. Measure with React DevTools Profiler before optimizing.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Explain React's rendering lifecycle from state update to DOM update

### Full flow

```
1. Event handler calls setState / dispatch
         ↓
2. Update enqueued on Fiber (priority lane assigned)
         ↓
3. RENDER PHASE begins
   - React calls component function
   - Hooks run (useState returns new value)
   - Children reconciled (diff algorithm)
   - Effect flags marked (Placement, Update, Deletion)
         ↓
4. COMMIT PHASE
   a. Before Mutation: getSnapshotBeforeUpdate (class)
   b. Mutation: apply DOM insert/update/delete
   c. Layout: flushSync useLayoutEffect callbacks
         ↓
5. Browser paints screen
         ↓
6. Passive effects: useEffect callbacks run (async, after paint)
```

### Practical Example — Effect order

```jsx
function Demo() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    console.log("1: layout effect — runs after DOM update, before paint");
  }, [count]);

  useEffect(() => {
    console.log("2: passive effect — runs after paint");
  }, [count]);

  console.log("3: render");

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}

// Click output:
// 3: render
// 1: layout effect
// (browser paints)
// 2: passive effect
```

### Class component lifecycle mapping

| Class                     | Hooks equivalent        |
| ------------------------- | ----------------------- |
| `render`                  | Function body           |
| `componentDidMount`       | `useEffect(fn, [])`     |
| `componentDidUpdate`      | `useEffect(fn, [deps])` |
| `componentWillUnmount`    | `useEffect` cleanup     |
| `getSnapshotBeforeUpdate` | `useLayoutEffect`       |

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. When should you avoid Context API?

### Avoid Context when:

| Situation                      | Why                                       | Alternative                    |
| ------------------------------ | ----------------------------------------- | ------------------------------ |
| **Frequently changing values** | All consumers re-render                   | Zustand, Jotai, external store |
| **Large app-wide state**       | Provider hell, hard to trace              | Redux Toolkit, Zustand         |
| **Performance-critical lists** | Context in parent re-renders all children | Colocate state, composition    |
| **Server data**                | No caching, dedup, stale handling         | TanStack Query / SWR           |
| **Form state**                 | Too granular for context                  | React Hook Form                |
| **URL-shareable state**        | Not in URL                                | Router search params           |

### The re-render problem

```jsx
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  // ❌ New object every render → ALL consumers re-render
  const value = { user, setUser, theme, setTheme };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

### Fix — split contexts or memoize

```jsx
const UserContext = createContext();
const ThemeContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <UserContext.Provider value={userValue}>
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

### When Context IS appropriate

- Theme (changes rarely)
- Locale / i18n
- Auth session (read-heavy, changes infrequently)
- Design system tokens

### Interview answer

> Context is great for low-frequency, broadly needed data like theme or locale. Avoid it for fast-changing or fine-grained state — every consumer re-renders when the value changes. Split contexts, use selectors (Zustand), or reach for a proper state library.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Difference between `useMemo`, `useCallback`, and `React.memo`

### Theory

| Hook/HOC      | What it memoizes       | When it helps                                       |
| ------------- | ---------------------- | --------------------------------------------------- |
| `useMemo`     | **Computed value**     | Expensive calculations                              |
| `useCallback` | **Function reference** | Stable ref for memoized children / effect deps      |
| `React.memo`  | **Component render**   | Skip re-render if props unchanged (shallow compare) |

### Practical Example

```jsx
function ProductList({ products, onSelect }) {
  // useMemo — cache expensive filter/sort result
  const sorted = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products],
  );

  // useCallback — stable function reference for memoized child
  const handleSelect = useCallback((id) => onSelect(id), [onSelect]);

  return sorted.map((p) => (
    <ProductRow key={p.id} product={p} onSelect={handleSelect} />
  ));
}

const ProductRow = React.memo(function ProductRow({ product, onSelect }) {
  return (
    <div onClick={() => onSelect(product.id)}>
      {product.name} — ₹{product.price}
    </div>
  );
});
```

### Common mistake

```jsx
// ❌ useMemo on cheap operations — adds overhead, no benefit
const doubled = useMemo(() => count * 2, [count]);

// ❌ useCallback without React.memo child — pointless
const fn = useCallback(() => doThing(), []);
return <RegularChild onClick={fn} />; // RegularChild always re-renders anyway
```

### Interview answer

> `useMemo` caches values, `useCallback` caches functions, `React.memo` skips component re-renders. Use them when profiling shows a problem — not preemptively. They have their own memory and comparison cost.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. How do you handle race conditions in API calls?

### The problem

User navigates quickly → Request A starts → Request B starts → B finishes first → A finishes last → **stale data overwrites fresh data**.

### Solutions

| Approach               | How                             |
| ---------------------- | ------------------------------- |
| **AbortController**    | Cancel previous request         |
| **Ignore flag**        | Track latest request ID         |
| **React Query / SWR**  | Built-in stale request handling |
| **Axios cancel token** | Legacy cancel pattern           |

### Practical Example — AbortController

```jsx
function useSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    let cancelled = false;

    async function search() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!cancelled) setResults(data);
      } catch (err) {
        if (err.name !== "AbortError" && !cancelled) {
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    search();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [query]);

  return { results, loading };
}
```

### Practical Example — Request ID pattern

```jsx
function useLatestFetch(url) {
  const [data, setData] = useState(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const id = ++requestIdRef.current;

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (id === requestIdRef.current) setData(json);
      });
  }, [url]);

  return data;
}
```

### Interview answer

> Abort the previous request on dependency change using AbortController, or ignore stale responses with a request counter. In production I use TanStack Query which handles deduplication, cancellation, and cache invalidation out of the box.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Explain code splitting and lazy loading

### Theory

**Code splitting** breaks your bundle into smaller chunks loaded on demand.
**Lazy loading** defers loading a chunk until it's needed (route, modal, heavy component).

### Route-based splitting

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Component-level splitting

```jsx
const HeavyChart = lazy(() => import("./HeavyChart"));

function Analytics() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(true)}>Show Chart</button>
      {show && (
        <Suspense fallback={<Spinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </>
  );
}
```

### Webpack / Vite magic comments

```javascript
const Admin = lazy(() => import(/* webpackChunkName: "admin" */ "./Admin"));
```

### Best practices

- Split by **route** first (biggest wins)
- Prefetch on hover: `import("./Dashboard")` in `onMouseEnter`
- Always wrap lazy components in `<Suspense>`
- Monitor bundle size with `webpack-bundle-analyzer` or `rollup-plugin-visualizer`

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. What happens internally when a state update is triggered?

### Step-by-step internals

```javascript
// You write:
setCount(count + 1);

// Internally (simplified):
```

1. **Update object created** — `{ lane: SyncLane, action: (c) => c + 1, eagerState: ... }`
2. **Enqueued on Fiber** — attached to `fiber.updateQueue` (circular linked list)
3. **Eager evaluation** — React may compute new state immediately for bailout check
4. **Bailout?** — If `Object.is(oldState, newState)`, skip scheduling
5. **Schedule work** — `scheduleUpdateOnFiber(root, fiber, lane)`
6. **Render scheduled** — `requestUpdateLane` → `ensureRootIsScheduled`
7. **Work loop runs** — `workLoopConcurrent` or `workLoopSync`
8. **Component re-executed** — hooks read updated `memoizedState`
9. **Reconciliation** — diff old vs new child elements
10. **Commit** — DOM patched if diff has changes

### Batching behavior

```jsx
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React 18+: both batched → single re-render
}

// Also batched in timeouts and native events (React 18+)
setTimeout(() => {
  setCount(1);
  setFlag(true);
}, 1000); // single re-render
```

### `flushSync` — opt out of batching

```jsx
import { flushSync } from "react-dom";

flushSync(() => {
  setCount(1);
});
// DOM updated synchronously here
setFlag(true); // separate render
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. How would you design a reusable component library?

### Architecture

```
packages/
├── tokens/          # Colors, spacing, typography (JSON / CSS vars)
├── primitives/      # Button, Input, Checkbox (unstyled logic)
├── components/      # Composed UI (DatePicker, Modal)
├── icons/
└── docs/            # Storybook
```

### Design principles

| Principle          | Implementation                                              |
| ------------------ | ----------------------------------------------------------- |
| **Composable**     | Compound components (`<Select><Select.Trigger /></Select>`) |
| **Accessible**     | WAI-ARIA, keyboard nav, focus management                    |
| **Themeable**      | CSS variables or Tailwind preset                            |
| **Typed**          | TypeScript with strict prop types                           |
| **Tree-shakeable** | ESM, per-component exports                                  |
| **Versioned**      | Semver, changelog, codemods for breaking changes            |

### Button example

```tsx
// packages/components/src/Button/Button.tsx
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./Button.module.css";

const buttonVariants = cva(styles.base, {
  variants: {
    variant: {
      primary: styles.primary,
      ghost: styles.ghost,
      danger: styles.danger,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild,
      loading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </Comp>
    );
  },
);
```

### Tooling stack

- **Storybook** — documentation + visual testing
- **Chromatic** — visual regression CI
- **Changesets** — versioning and publishing
- **Vitest + Testing Library** — unit/a11y tests
- **ESLint plugin** — enforce import boundaries

### Interview answer

> Start with design tokens, build accessible primitives, compose into higher-level components. Use TypeScript, compound component patterns, CSS variables for theming, Storybook for docs, and publish as tree-shakeable ESM packages with semver and visual regression tests in CI.

---

# Advanced JavaScript


<p><a href="#i11">Back to index</a></p>

<a id="p1"></a>

## 1. Implement your own version of `Promise.all()`

### Theory

`Promise.all(iterable)` returns a single promise that:

- Resolves with an **array of results** when all input promises resolve (order preserved)
- Rejects **immediately** when any input promise rejects

### Implementation

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let completed = 0;
    const len = promises.length;

    if (len === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise) // handles non-promise values
        .then((value) => {
          results[index] = value; // preserve order
          completed++;
          if (completed === len) resolve(results);
        })
        .catch(reject); // fail fast
    });
  });
}

// Tests
promiseAll([Promise.resolve(1), 42, Promise.resolve(3)]).then(console.log); // [1, 42, 3]

promiseAll([Promise.resolve(1), Promise.reject("error")]).catch(console.log); // "error"
```

### Edge cases to mention

- Empty array → resolves `[]`
- Non-promise values are wrapped via `Promise.resolve()`
- Order of results matches input order, not completion order

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What are `WeakMap` and `WeakSet`?

### Theory

|               | `Map` / `Set`                  | `WeakMap` / `WeakSet`                  |
| ------------- | ------------------------------ | -------------------------------------- |
| Keys          | Any type                       | **Objects only**                       |
| GC            | Strong references — prevent GC | **Weak references** — don't prevent GC |
| Iterable      | Yes                            | No                                     |
| Size property | Yes                            | No                                     |

### WeakMap

```javascript
const wm = new WeakMap();

let user = { id: 1, name: "Amit" };
wm.set(user, { lastLogin: Date.now() });

console.log(wm.get(user)); // { lastLogin: ... }

user = null; // object can now be garbage collected
// WeakMap entry disappears automatically
```

### WeakSet

```javascript
const visited = new WeakSet();

function processNode(node) {
  if (visited.has(node)) return;
  visited.add(node);
  // process...
}
```

### Practical use cases

```javascript
// 1. Private data associated with DOM nodes
const privateData = new WeakMap();

class Component {
  constructor(el) {
    privateData.set(el, { listeners: [] });
  }
}

// 2. Caching metadata without memory leaks
const cache = new WeakMap();

function getMetadata(obj) {
  if (!cache.has(obj)) {
    cache.set(obj, computeExpensiveMetadata(obj));
  }
  return cache.get(obj);
}

// 3. Track processed objects in recursive algorithms
const seen = new WeakSet();
function deepTraverse(obj) {
  if (seen.has(obj)) return;
  seen.add(obj);
  // ...
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Explain event delegation with a practical example

### Theory

**Event delegation** attaches a single listener to a **parent** element instead of many listeners on each child. Events bubble up — the parent handles them using `event.target`.

### Benefits

- Fewer listeners → better memory and performance
- Works for dynamically added children
- Simpler cleanup

### Practical Example

```html
<ul id="menu">
  <li data-action="edit">Edit</li>
  <li data-action="delete">Delete</li>
  <li data-action="share">Share</li>
</ul>
```

```javascript
const menu = document.getElementById("menu");

// ✅ One listener instead of three
menu.addEventListener("click", (event) => {
  const item = event.target.closest("li[data-action]");
  if (!item || !menu.contains(item)) return;

  const action = item.dataset.action;

  switch (action) {
    case "edit":
      console.log("Edit clicked");
      break;
    case "delete":
      console.log("Delete clicked");
      break;
    case "share":
      console.log("Share clicked");
      break;
  }
});

// Dynamically added items work automatically
const newItem = document.createElement("li");
newItem.dataset.action = "archive";
newItem.textContent = "Archive";
menu.appendChild(newItem);
```

### When NOT to delegate

- Events that don't bubble (`focus`, `blur`, `scroll`) — use capture phase or direct binding
- Very deep trees where `closest()` traversal is costly (rare)

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Difference between Deep Copy and Shallow Copy

### Theory

|                | Shallow Copy                                      | Deep Copy                                               |
| -------------- | ------------------------------------------------- | ------------------------------------------------------- |
| Top-level      | New reference                                     | New reference                                           |
| Nested objects | **Shared reference**                              | **New references**                                      |
| Methods        | `Object.assign`, spread `{...obj}`, `Array.slice` | `structuredClone`, recursive fn, `JSON.parse/stringify` |

### Practical Example

```javascript
const original = {
  name: "Amit",
  address: { city: "Delhi", pin: 110001 },
  hobbies: ["cricket", "coding"],
};

// Shallow copy
const shallow = { ...original };
shallow.address.city = "Mumbai";
console.log(original.address.city); // "Mumbai" — nested object shared!

// Deep copy — structuredClone (modern)
const deep = structuredClone(original);
deep.address.city = "Bangalore";
console.log(original.address.city); // "Delhi" — unchanged

// Deep copy — JSON trick (limitations: no Date, Map, undefined, functions)
const jsonDeep = JSON.parse(JSON.stringify(original));
```

### Manual deep copy function

```javascript
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value); // handle circular refs

  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value);

  const clone = Array.isArray(value) ? [] : {};
  seen.set(value, clone);

  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone(value[key], seen);
  }

  return clone;
}
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. How does garbage collection work in JavaScript?

### Theory

JS uses **automatic garbage collection** — memory for unreachable objects is reclaimed.

### Primary algorithm: Mark-and-Sweep

```
1. GC roots: global object, call stack variables, closures
2. Mark: traverse all reachable objects from roots
3. Sweep: free memory of unmarked (unreachable) objects
```

### Generational GC (V8)

| Generation          | Characteristics                  | Collection frequency               |
| ------------------- | -------------------------------- | ---------------------------------- |
| **Young (nursery)** | Short-lived objects              | Frequent (Scavenge)                |
| **Old**             | Long-lived, survived collections | Less frequent (Mark-Sweep-Compact) |

Objects that survive two Scavenge cycles are **promoted** to old generation.

### What causes memory leaks

```javascript
// 1. Global variables
window.cache = hugeArray;

// 2. Forgotten timers
setInterval(() => {
  /* holds closure ref */
}, 1000);

// 3. Detached DOM nodes still referenced
const el = document.getElementById("btn");
document.body.removeChild(el);
// el still in memory if referenced in JS

// 4. Closures holding large objects
function createHandler() {
  const bigData = new Array(1e6).fill("x");
  return () => console.log(bigData.length); // bigData never freed
}

// 5. Event listeners not removed
element.addEventListener("click", handler);
// forgot removeEventListener on cleanup
```

### WeakMap/WeakSet help avoid leaks by not preventing GC of keys.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Explain lexical scope and closure in detail

### Lexical scope

Scope is determined by **where code is written** (lexical position), not where it is called.

```javascript
const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    console.log(globalVar); // accessible
    console.log(outerVar); // accessible
    console.log(innerVar); // accessible
  }

  return inner;
}

const fn = outer();
fn(); // still accesses outerVar — closure
```

### Scope chain

```
inner scope → outer scope → global scope
```

### Closure — formal definition

A closure is a function bundled together with its **lexical environment** (scope). The environment records all local variables at the time the function was created.

```javascript
function makeMultiplier(factor) {
  // `factor` is closed over
  return function (number) {
    return number * factor;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
// Each closure has its own `factor`
```

### Module pattern (classic closure use)

```javascript
const bankAccount = (function () {
  let balance = 0; // private via closure

  return {
    deposit(amount) {
      balance += amount;
    },
    getBalance() {
      return balance;
    },
  };
})();

bankAccount.deposit(100);
console.log(bankAccount.getBalance()); // 100
// balance is not accessible directly
```

### Loop + closure classic fix

```javascript
// Problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Fix with let (block scope per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// Fix with IIFE closure
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. What is the difference between synchronous and asynchronous iteration?

### Synchronous iteration

Works with **iterable** objects (`Array`, `Map`, `Set`, strings).

```javascript
const arr = [1, 2, 3];

// for...of
for (const item of arr) {
  console.log(item);
}

// Iterator protocol
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### Asynchronous iteration

Works with **async iterables** — objects with `[Symbol.asyncIterator]()`.

```javascript
async function* asyncGenerator() {
  yield await fetchData(1);
  yield await fetchData(2);
  yield await fetchData(3);
}

// for await...of
async function main() {
  for await (const chunk of asyncGenerator()) {
    console.log(chunk);
  }
}
```

### Comparison

|          | Sync              | Async                               |
| -------- | ----------------- | ----------------------------------- |
| Protocol | `Symbol.iterator` | `Symbol.asyncIterator`              |
| Loop     | `for...of`        | `for await...of`                    |
| Return   | `{ value, done }` | `Promise<{ value, done }>`          |
| Use case | In-memory data    | Streams, paginated APIs, file reads |

### Practical async iterable — paginated API

```javascript
const paginatedFetch = {
  async *[Symbol.asyncIterator]() {
    let cursor = null;

    do {
      const res = await fetch(`/api/items?cursor=${cursor ?? ""}`);
      const { items, nextCursor } = await res.json();

      for (const item of items) yield item;
      cursor = nextCursor;
    } while (cursor);
  },
};

for await (const item of paginatedFetch) {
  console.log(item);
}
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Polyfill for `Array.map()`

```javascript
Array.prototype.myMap = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Array.prototype.myMap called on null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const array = Object(this);
  const len = array.length >>> 0;
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in array) {
      result[i] = callback.call(thisArg, array[i], i, array);
    }
  }

  return result;
};

// Test
console.log([1, 2, 3].myMap((x) => x * 2)); // [2, 4, 6]
console.log([1, , 3].myMap((x) => x * 2)); // [2, empty, 6] — sparse handled
```

### Key details

- Handle `this` being array-like (not just arrays)
- Use `>>> 0` for length (handles negatives)
- Check `i in array` for sparse arrays
- Don't mutate original array

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Polyfill for `Function.bind()`

```javascript
Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const fn = this;

  if (typeof fn !== "function") {
    throw new TypeError("Bind must be called on a function");
  }

  const boundFunction = function (...callArgs) {
    // If called with `new`, `this` should be the new instance
    const isNew = this instanceof boundFunction;
    return fn.apply(isNew ? this : thisArg, boundArgs.concat(callArgs));
  };

  // Preserve prototype for `new` calls
  if (fn.prototype) {
    boundFunction.prototype = Object.create(fn.prototype);
  }

  return boundFunction;
};

// Test
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "Amit" };
const boundGreet = greet.myBind(person, "Hello");
console.log(boundGreet("!")); // "Hello, Amit!"

// Constructor case
function Person(name) {
  this.name = name;
}
const BoundPerson = Person.myBind(null);
const p = new BoundPerson("Rahul");
console.log(p.name); // "Rahul"
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Explain currying and function composition

### Currying

Transform a function with multiple arguments into a chain of functions each taking one argument.

```javascript
// Regular
function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3); // 6

// Curried
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
curriedAdd(1)(2)(3); // 6

// Generic curry utility
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried(...args, ...more);
  };
}

const multiply = (a, b, c) => a * b * c;
const curriedMultiply = curry(multiply);
curriedMultiply(2)(3)(4); // 24
curriedMultiply(2, 3)(4); // 24
curriedMultiply(2)(3, 4); // 24
```

### Function composition

Combine functions so output of one feeds into the next: `compose(f, g)(x) === f(g(x))`.

```javascript
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

const trim = (s) => s.trim();
const toLower = (s) => s.toLowerCase();
const removeSpaces = (s) => s.replace(/\s+/g, "-");

const slugify = compose(removeSpaces, toLower, trim);
console.log(slugify("  Hello World  ")); // "hello-world"

const slugifyPipe = pipe(trim, toLower, removeSpaces);
console.log(slugifyPipe("  Hello World  ")); // "hello-world"
```

### Real-world use

```javascript
// Currying — partial application for reusable handlers
const log = curry((level, message) => console[level](message));
const logError = log("error");
const logInfo = log("info");

logError("Something failed");
logInfo("App started");
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. What happens behind the scenes when `async/await` executes?

### Syntax sugar over Promises + Generators

```javascript
async function fetchUser() {
  const res = await fetch("/api/user");
  const data = await res.json();
  return data;
}

// Roughly equivalent to:
function fetchUser() {
  return fetch("/api/user").then((res) => res.json());
}
```

### Execution flow

```
1. async function ALWAYS returns a Promise

2. Code before first `await` runs synchronously

3. At `await`:
   - Expression is evaluated
   - If not a Promise, wrapped in Promise.resolve()
   - Execution of async function PAUSES
   - Control returns to caller
   - `.then()` handler registered on the promise

4. When awaited promise resolves:
   - Function resumes after await
   - Resolved value assigned to variable
   - Runs on microtask queue

5. If awaited promise rejects:
   - Function throws (unless try/catch)
   - Returned promise rejects
```

### Microtask queue demonstration

```javascript
console.log("1");

async function demo() {
  console.log("2");
  await Promise.resolve();
  console.log("3"); // microtask — after sync code
}

demo();
console.log("4");

// Output: 1, 2, 4, 3
```

### Error handling

```javascript
async function risky() {
  try {
    const data = await fetch("/api").then((r) => {
      if (!r.ok) throw new Error("HTTP error");
      return r.json();
    });
    return data;
  } catch (err) {
    console.error("Caught:", err.message);
    throw err; // re-throw to caller
  }
}
```

### Interview answer

> `async/await` is syntactic sugar over Promises. An async function returns a Promise. Each `await` pauses execution, registers a microtask, and resumes when the promise settles. Code before the first await runs synchronously; code after runs in the microtask queue.

---

# C++


<p><a href="#i11">Back to index</a></p>

<a id="p1"></a>

## 1. What are Smart Pointers?

### Theory

Smart pointers are **RAII wrappers** around raw pointers that automatically manage memory — they delete the object when no longer needed.

| Type         | Ownership           | Copyable |
| ------------ | ------------------- | -------- |
| `unique_ptr` | Exclusive           | No       |
| `shared_ptr` | Shared (ref count)  | Yes      |
| `weak_ptr`   | Non-owning observer | Yes      |

```cpp
#include <memory>

void demo() {
  // Raw pointer — manual delete, leak-prone
  int* raw = new int(42);
  delete raw;

  // Smart pointer — automatic cleanup
  auto smart = std::make_unique<int>(42);
  // deleted when `smart` goes out of scope
}
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Difference between `unique_ptr` and `shared_ptr`

### `unique_ptr` — exclusive ownership

```cpp
#include <memory>

auto ptr1 = std::make_unique<int>(10);
// auto ptr2 = ptr1;              // ❌ compile error — not copyable
auto ptr2 = std::move(ptr1);      // ✅ transfer ownership
// ptr1 is now nullptr
```

- Zero overhead vs raw pointer (no ref counting)
- Cannot be copied, only moved
- Use by default

### `shared_ptr` — shared ownership

```cpp
auto sp1 = std::make_shared<int>(20);
auto sp2 = sp1; // ref count = 2

{
  auto sp3 = sp1; // ref count = 3
} // sp3 destroyed, ref count = 2

// Memory freed when ref count hits 0
```

- Reference counted — thread-safe ref count increment/decrement
- Slight overhead (control block)
- Risk of **circular references** → use `weak_ptr` to break cycles

### When to use which

| Scenario                        | Choice       |
| ------------------------------- | ------------ |
| Single owner                    | `unique_ptr` |
| Shared ownership (cache, graph) | `shared_ptr` |
| Observer (break cycles)         | `weak_ptr`   |
| Factory returns ownership       | `unique_ptr` |

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Explain move semantics

### Theory

**Move semantics** (C++11) transfer resources from a source object to a destination **without copying** — the source is left in a valid but unspecified state.

### Why needed

```cpp
std::vector<int> createLargeVector() {
  std::vector<int> v(1'000'000, 42);
  return v; // move, not copy (RVO/NRVO or move constructor)
}
```

Without move semantics, returning large objects copies all elements.

### Move vs Copy

```cpp
std::string a = "hello";
std::string b = a;            // copy — both own their data
std::string c = std::move(a); // move — c steals a's buffer, a is empty

std::cout << a; // "" (valid but empty)
std::cout << c; // "hello"
```

### `std::move` is a cast

```cpp
// std::move doesn't move anything — it casts to rvalue reference
// enabling move constructor/assignment to be called
void process(std::string&& s); // accepts rvalue

std::string name = "Amit";
process(std::move(name)); // explicitly treat as rvalue
```

### Move constructor example

```cpp
class Buffer {
  int* data;
  size_t size;

public:
  // Move constructor
  Buffer(Buffer&& other) noexcept
    : data(other.data), size(other.size) {
    other.data = nullptr;
    other.size = 0;
  }

  // Move assignment
  Buffer& operator=(Buffer&& other) noexcept {
    if (this != &other) {
      delete[] data;
      data = other.data;
      size = other.size;
      other.data = nullptr;
      other.size = 0;
    }
    return *this;
  }
};
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is RAII?

### Theory

**Resource Acquisition Is Initialization** — bind resource lifetime to object lifetime. Acquire in constructor, release in destructor.

```cpp
class FileHandle {
  FILE* file;

public:
  FileHandle(const char* path) : file(fopen(path, "r")) {
    if (!file) throw std::runtime_error("Cannot open file");
  }

  ~FileHandle() {
    if (file) fclose(file); // always called, even on exception
  }

  // delete copy, allow move...
};

void readConfig() {
  FileHandle f("config.txt");
  // use f...
} // destructor closes file automatically — no leak
```

### RAII in standard library

| Resource | RAII wrapper                |
| -------- | --------------------------- |
| Memory   | `unique_ptr`, `shared_ptr`  |
| File     | `fstream`                   |
| Mutex    | `lock_guard`, `unique_lock` |
| Socket   | custom RAII class           |

### Interview answer

> RAII ties resource management to scope. Constructors acquire, destructors release. This guarantees cleanup even when exceptions are thrown — the core idea behind smart pointers and `lock_guard`.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Difference between `vector` and `list`

| Feature               | `std::vector`           | `std::list`                  |
| --------------------- | ----------------------- | ---------------------------- |
| Memory                | Contiguous array        | Doubly linked nodes          |
| Random access         | O(1) `operator[]`       | O(n)                         |
| Insert at end         | O(1) amortized          | O(1)                         |
| Insert in middle      | O(n) — shift elements   | O(1) with iterator           |
| Cache locality        | Excellent               | Poor (pointer chasing)       |
| Memory overhead       | Low                     | High (two pointers per node) |
| Iterator invalidation | On reallocation / erase | Only erased element          |

### When to use

```cpp
// vector — default choice (cache-friendly, fast iteration)
std::vector<int> nums = {1, 2, 3, 4, 5};
nums.push_back(6);           // fast
int x = nums[2];             // O(1) random access

// list — frequent middle insert/erase, no reallocation needed
std::list<int> lst = {1, 2, 3};
auto it = std::next(lst.begin());
lst.insert(it, 99);          // O(1), no invalidation of other iterators
```

> In practice, `vector` wins most of the time due to cache locality — even insert-in-middle can be faster on vector for small/medium sizes.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. What happens during object construction and destruction?

### Construction order

```
1. Base class constructors (in declaration order)
2. Member variables (in declaration order, not initializer list order)
3. Constructor body executes
```

```cpp
class Base {
public:
  Base() { std::cout << "Base ctor\n"; }
  ~Base() { std::cout << "Base dtor\n"; }
};

class Derived : public Base {
  int a;
  std::string b;
public:
  Derived() : a(1), b("hello") {
    std::cout << "Derived ctor body\n";
  }
  ~Derived() { std::cout << "Derived dtor\n"; }
};

// Output on creation:
// Base ctor
// Derived ctor body

// Output on destruction (reverse order):
// Derived dtor
// Base dtor
```

### Destruction order (reverse of construction)

1. Derived destructor body
2. Derived member destructors (reverse declaration order)
3. Base class destructor

### Virtual destructor rule

```cpp
class Base {
public:
  virtual ~Base() = default; // REQUIRED if deleting via base pointer
};

class Derived : public Base { /* ... */ };

Base* ptr = new Derived();
delete ptr; // calls Derived::~Derived then Base::~Base
// Without virtual ~Base, only Base destructor runs → leak
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Explain copy constructor and move constructor

### Copy constructor — deep copy

```cpp
class String {
  char* data;
  size_t len;

public:
  String(const char* s) : len(strlen(s)), data(new char[len + 1]) {
    strcpy(data, s);
  }

  // Copy constructor
  String(const String& other) : len(other.len), data(new char[other.len + 1]) {
    strcpy(data, other.data); // deep copy
    std::cout << "Copy ctor\n";
  }

  ~String() { delete[] data; }
};
```

### Move constructor — steal resources

```cpp
  // Move constructor
  String(String&& other) noexcept
    : data(other.data), len(other.len) {
    other.data = nullptr;
    other.len = 0;
    std::cout << "Move ctor\n";
  }
```

### Rule of Five

If you define any of these, consider defining all:

1. Destructor
2. Copy constructor
3. Copy assignment operator
4. Move constructor
5. Move assignment operator

```cpp
String& operator=(const String& other) { /* copy assign */ }
String& operator=(String&& other) noexcept { /* move assign */ }
```

### `= default` and `= delete`

```cpp
class NonCopyable {
  NonCopyable() = default;
  NonCopyable(const NonCopyable&) = delete;
  NonCopyable& operator=(const NonCopyable&) = delete;
};
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. How does virtual table (vtable) work?

### Theory

Enables **runtime polymorphism** — call the correct overridden function through a base pointer.

### Mechanism

```
Each class with virtual functions has a vtable (array of function pointers)
Each object has a vptr (hidden pointer to its class's vtable)

class Animal {
  virtual void speak() { cout << "..."; }
};

class Dog : public Animal {
  void speak() override { cout << "Woof"; }
};

Animal* a = new Dog();
a->speak(); // "Woof" — resolved via vtable at runtime
```

### Memory layout (simplified)

```
Dog object:
┌──────────┐
│  vptr    │ ──→ Dog vtable: [ speak → Dog::speak, dtor → Dog::~Dog ]
├──────────┤
│  data... │
└──────────┘
```

### Cost of virtual functions

- Extra memory: vptr per object + vtable per class
- Indirect function call (cannot inline easily)
- Prevents some optimizations

### Pure virtual — abstract class

```cpp
class Shape {
public:
  virtual double area() const = 0; // pure virtual
  virtual ~Shape() = default;
};

class Circle : public Shape {
  double radius;
public:
  double area() const override { return 3.14159 * radius * radius; }
};
```

### Interview answer

> Virtual functions use a vtable per class and a vptr per object. When calling through a base pointer, the vptr indexes into the vtable to find the correct derived implementation at runtime. Always declare virtual destructors in polymorphic base classes.

---

# DSA Questions


<p><a href="#i8">Back to index</a></p>

<a id="p1"></a>

## 1. Find the First Non-Repeating Character in a string

### Theory

Count character frequencies, then find the first character with count 1.

### Approach 1 — Two passes with hash map

```javascript
function firstNonRepeating(s) {
  const freq = new Map();

  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  for (const char of s) {
    if (freq.get(char) === 1) return char;
  }

  return null; // or -1 if no such character
}

console.log(firstNonRepeating("leetcode")); // "l"
console.log(firstNonRepeating("aabbcc")); // null
console.log(firstNonRepeating("swiss")); // "w"
```

### Complexity

|               | Time | Space                       |
| ------------- | ---- | --------------------------- |
| Hash map      | O(n) | O(k) where k = unique chars |
| Array (ASCII) | O(n) | O(1) — fixed 26 or 128 size |

### ASCII-optimized version

```javascript
function firstNonRepeatingASCII(s) {
  const freq = new Array(26).fill(0);

  for (const char of s) {
    freq[char.charCodeAt(0) - 97]++;
  }

  for (const char of s) {
    if (freq[char.charCodeAt(0) - 97] === 1) return char;
  }

  return null;
}
```

### C++ version

```cpp
#include <string>
#include <unordered_map>

char firstNonRepeating(const std::string& s) {
  std::unordered_map<char, int> freq;
  for (char c : s) freq[c]++;

  for (char c : s) {
    if (freq[c] == 1) return c;
  }
  return '\0';
}
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Two Sum Problem

### Theory

Given an array and a target, return indices of two numbers that add up to target.

### Approach 1 — Brute force O(n²)

```javascript
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}
```

### Approach 2 — Hash map O(n) ✅

```javascript
function twoSum(nums, target) {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
```

### C++ version

```cpp
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
  std::unordered_map<int, int> seen;

  for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (seen.count(complement)) {
      return {seen[complement], i};
    }
    seen[nums[i]] = i;
  }
  return {};
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Debounce and Throttle implementation

### Debounce — execute after pause in events

Waits until the user **stops** triggering for `delay` ms, then runs once.

```javascript
function debounce(fn, delay) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: search input — API call only after user stops typing
const search = debounce((query) => {
  console.log("Searching:", query);
}, 300);
```

### Throttle — execute at most once per interval

Runs immediately, then **ignores** subsequent calls for `limit` ms.

```javascript
function throttle(fn, limit) {
  let inThrottle = false;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage: scroll handler — fire at most every 100ms
const onScroll = throttle(() => {
  console.log("Scroll position:", window.scrollY);
}, 100);
```

### Leading + trailing debounce (advanced)

```javascript
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timerId;
  let lastArgs;
  let lastThis;

  return function (...args) {
    lastArgs = args;
    lastThis = this;

    const callNow = leading && !timerId;

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && !callNow) fn.apply(lastThis, lastArgs);
    }, delay);

    if (callNow) fn.apply(this, args);
  };
}
```

### When to use which

| Pattern      | Use case                                   |
| ------------ | ------------------------------------------ |
| **Debounce** | Search input, resize end, form validation  |
| **Throttle** | Scroll, mouse move, button spam prevention |

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Flatten a Nested Array

### Theory

Convert `[[1, [2, 3]], 4]` → `[1, 2, 3, 4]`.

### Approach 1 — Recursive

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

console.log(flatten([1, [2, [3, 4]], 5])); // [1, 2, 3, 4, 5]
```

### Approach 2 — Iterative with stack

```javascript
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }

  return result.reverse(); // stack reverses order
}
```

### Approach 3 — Built-in (ES2019)

```javascript
const flat = [1, [2, [3, 4]], 5].flat(Infinity);
```

### Flatten with depth control

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

console.log(flattenDepth([1, [2, [3]]], 1)); // [1, 2, [3]]
console.log(flattenDepth([1, [2, [3]]], 2)); // [1, 2, 3]
```

### C++ version (recursive)

```cpp
#include <vector>
#include <variant>

// For vector of variants (int or nested vector) — simplified:
std::vector<int> flatten(const std::vector<std::vector<int>>& nested) {
  std::vector<int> result;
  for (const auto& inner : nested) {
    result.insert(result.end(), inner.begin(), inner.end());
  }
  return result;
}
```

---

# Quick Revision Cheat Sheet

## React

| Topic                        | One-liner                                                           |
| ---------------------------- | ------------------------------------------------------------------- |
| Re-render triggers           | State, context, parent update                                       |
| Fiber                        | Interruptible work units; render + commit phases                    |
| RSC vs Client                | Server = no client JS; Client = `"use client"` + hooks              |
| Thousands of rows            | Virtualization + memo + pagination                                  |
| Lifecycle                    | setState → render → commit DOM → layout effects → paint → useEffect |
| Avoid Context                | Fast-changing / granular state                                      |
| useMemo / useCallback / memo | Value / function / component memoization                            |
| Race conditions              | AbortController or request ID                                       |
| Code splitting               | `React.lazy` + `Suspense` per route                                 |
| State update internals       | Enqueue → batch → reconcile → commit                                |
| Component library            | Tokens, primitives, a11y, Storybook, semver                         |

## JavaScript

| Topic            | One-liner                                     |
| ---------------- | --------------------------------------------- |
| Promise.all      | All resolve or first reject; preserve order   |
| WeakMap/WeakSet  | Weak refs; keys are objects only              |
| Event delegation | One parent listener + `event.target`          |
| Shallow vs deep  | Nested refs shared vs `structuredClone`       |
| GC               | Mark-and-sweep from roots; generational in V8 |
| Closure          | Function + lexical environment                |
| Async iteration  | `Symbol.asyncIterator` + `for await...of`     |
| async/await      | Promise sugar; pauses on microtask queue      |

## C++

| Topic             | One-liner                                       |
| ----------------- | ----------------------------------------------- |
| Smart pointers    | RAII auto memory management                     |
| unique vs shared  | Exclusive vs ref-counted shared ownership       |
| Move semantics    | Transfer resources; `std::move` casts to rvalue |
| RAII              | Acquire in ctor, release in dtor                |
| vector vs list    | Contiguous/cache-friendly vs linked/flexible    |
| ctor/dtor order   | Base → members → body; reverse for destruction  |
| Copy vs move ctor | Deep copy vs steal resources                    |
| vtable            | vptr → function pointer array for polymorphism  |

## DSA

| Problem                  | Approach                             |
| ------------------------ | ------------------------------------ |
| First non-repeating char | Frequency map + second pass          |
| Two Sum                  | Hash map complement lookup O(n)      |
| Debounce                 | Reset timer on each call             |
| Throttle                 | Flag + cooldown window               |
| Flatten array            | Recursion or stack; `flat(Infinity)` |

---

_Practice explaining trade-offs aloud. Senior interviews reward depth, judgment, and real-world context — not just memorized answers._


<p><a href="#i4">Back to index</a></p>
