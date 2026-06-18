---
title: "Encora Senior React Developer Interview Preparation"
description: "Encora 1st round — live coding (counter, useFetch, object merge) and React fundamentals (useDeferredValue, Context, custom hooks, debouncing)."
tags: ["react", "encora", "senior", "interview", "hooks", "coding"]
level: "Senior (4+ years)"
company: "Encora"
---

# Encora Senior React Developer Interview Preparation

Questions from a **Senior React Developer** interview at **Encora** — **1st round** covering **live coding** and **React fundamentals**. Each topic includes **Theory**, **Pros & Cons**, **One-Line Interview Answer**, and **Real Examples**.

> Encora tests whether you can **build working React code on the spot** — counters, custom hooks, object manipulation — plus **modern React concepts** like `useDeferredValue` and Context.

---

## Table of Contents

### 1st Round — Coding & Fundamentals
1. [Auto Increment/Decrement Counter](#1-auto-incrementdecrement-counter)
2. [Custom useFetch Hook](#2-custom-usefetch-hook)
3. [Join/Merge Objects from Object List](#3-joinmerge-objects-from-object-list)
4. [useDeferredValue Hook](#4-usedeferredvalue-hook)
5. [Context API](#5-context-api)
6. [Why Do We Use Custom Hooks?](#6-why-do-we-use-custom-hooks)
7. [Debouncing](#7-debouncing)

---

# 1st Round — Coding & Fundamentals

## 1. Auto Increment/Decrement Counter

### Theory

A counter is the classic **useState** exercise. Requirements:
- Click **Increment** → count increases by 1
- Click **Decrement** → count decreases by 1
- Use **functional updaters** `(prev) => prev + 1` to avoid stale closure bugs
- Optional senior touches: min/max bounds, disable buttons at limits, accessibility

### One-Line Interview Answer

> I use useState with functional updaters for increment and decrement, wire them to buttons, and optionally clamp the value or disable buttons at boundaries.

### Basic Implementation

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### Senior-Level Implementation

```jsx
import { useState, useCallback } from "react";

function Counter({ initial = 0, min = -Infinity, max = Infinity, step = 1 }) {
  const [count, setCount] = useState(initial);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + step, max));
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - step, min));
  }, [step, min]);

  const reset = useCallback(() => setCount(initial), [initial]);

  return (
    <div role="group" aria-label="Counter">
      <output aria-live="polite" aria-atomic="true">
        {count}
      </output>
      <button onClick={decrement} disabled={count <= min} aria-label="Decrement">
        −
      </button>
      <button onClick={increment} disabled={count >= max} aria-label="Increment">
        +
      </button>
      <button onClick={reset} aria-label="Reset counter">
        Reset
      </button>
    </div>
  );
}

// Usage
<Counter initial={0} min={0} max={10} step={1} />
```

### useReducer Variant (if interviewer asks)

```jsx
function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT": return state + 1;
    case "DECREMENT": return state - 1;
    case "RESET": return action.payload;
    default: return state;
  }
}

function Counter() {
  const [count, dispatch] = useReducer(counterReducer, 0);
  return (
    <>
      <p>{count}</p>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>−</button>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
    </>
  );
}
```

---

## 2. Custom useFetch Hook

### Theory

A **custom `useFetch` hook** encapsulates API call logic — loading, data, error — reusable across any endpoint. Senior expectations:
- **AbortController** cleanup on unmount / URL change
- Re-fetch when URL or deps change
- Handle HTTP errors (non-2xx)
- Optional: refetch function, enabled flag

### Pros & Cons

| Pros | Cons |
|------|------|
| DRY — one fetch pattern everywhere | For production, TanStack Query is better |
| Consistent loading/error handling | Manual cache invalidation |
| Easy to test in isolation | Can grow complex with auth/retry |

### One-Line Interview Answer

> useFetch wraps fetch with useState and useEffect — returns data, loading, and error, aborts in-flight requests on cleanup, and re-fetches when the URL changes.

### Full Implementation

```jsx
import { useState, useEffect, useCallback, useRef } from "react";

function useFetch(url, options = {}) {
  const { enabled = true, deps = [] } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options.fetchOptions,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message ?? "Something went wrong");
        setData(null);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [url, enabled, ...deps]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, loading, error, refetch };
}

export default useFetch;
```

### Usage Examples

```jsx
function UserList() {
  const { data, loading, error, refetch } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error} <button onClick={refetch}>Retry</button></p>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

function UserDetail({ userId }) {
  const { data, loading, error } = useFetch(
    userId ? `https://jsonplaceholder.typicode.com/users/${userId}` : null,
    { enabled: !!userId, deps: [userId] }
  );
  // ...
}
```

### Generic Version (any HTTP method + body)

```jsx
function useFetch(url, options = {}) {
  const { method = "GET", body, enabled = true } = options;
  const [state, setState] = useState({ data: null, loading: false, error: null });

  useEffect(() => {
    if (!enabled || !url) return;

    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url, method, enabled, JSON.stringify(body)]);

  return state;
}
```

### Interview Tip

Mention that in production you'd use **TanStack Query** for caching, deduplication, and stale-while-revalidate — but `useFetch` demonstrates hook composition and effect cleanup.

---

## 3. Join/Merge Objects from Object List

### Theory

Given an **array of objects**, merge them into **one object**. Common variants:

| Variant | Behavior |
|---------|----------|
| **Shallow merge** | Later keys overwrite earlier (`Object.assign` / spread) |
| **Deep merge** | Nested objects merged recursively |
| **Join by key** | Group array items by a property into `{ [key]: [...] }` |

Encora likely asks **shallow merge** or **deep merge** of an object array.

### One-Line Interview Answer

> I reduce the array with spread or Object.assign — later objects override earlier keys. For nested objects I recursively merge each key.

### Shallow Merge — Later Wins

```javascript
const list = [
  { a: 1, b: 2 },
  { b: 3, c: 4 },
  { c: 5, d: 6 },
];

function mergeObjects(list) {
  return list.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

console.log(mergeObjects(list));
// { a: 1, b: 3, c: 5, d: 6 }
```

```javascript
// Alternative — Object.assign
function mergeObjects(list) {
  return Object.assign({}, ...list);
}
```

### Deep Merge

```javascript
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }

  return result;
}

function mergeObjectList(list) {
  return list.reduce((acc, obj) => deepMerge(acc, obj), {});
}

const list = [
  { user: { name: "Amit", age: 28 }, role: "dev" },
  { user: { city: "Mumbai" }, role: "senior" },
  { tags: ["react", "ts"] },
];

console.log(mergeObjectList(list));
// {
//   user: { name: "Amit", age: 28, city: "Mumbai" },
//   role: "senior",
//   tags: ["react", "ts"]
// }
```

### Join/Group by Key (alternate interpretation)

```javascript
// Merge array of { id, ...fields } into { [id]: fields }
const users = [
  { id: "u1", name: "Amit", role: "dev" },
  { id: "u2", name: "Priya", role: "qa" },
  { id: "u1", team: "frontend" }, // same id — merge fields
];

function joinById(list, key = "id") {
  return list.reduce((acc, item) => {
    const id = item[key];
    const { [key]: _, ...rest } = item;
    acc[id] = { ...acc[id], ...rest };
    return acc;
  }, {});
}

console.log(joinById(users));
// { u1: { name: "Amit", role: "dev", team: "frontend" }, u2: { name: "Priya", role: "qa" } }
```

### React Usage

```jsx
function MergedConfig({ configSources }) {
  const merged = useMemo(
    () => configSources.reduce((acc, cfg) => ({ ...acc, ...cfg }), {}),
    [configSources]
  );

  return <AppSettings theme={merged.theme} apiUrl={merged.apiUrl} />;
}
```

---

## 4. useDeferredValue Hook

### Theory

`useDeferredValue(value)` returns a **deferred version** of a value that may **lag behind** during urgent updates. React treats updating the deferred value as **low priority** — keeps the UI responsive during expensive re-renders.

Part of **Concurrent React** (React 18+). Pairs with slow lists, search filters, heavy charts.

### Pros & Cons

| Pros | Cons |
|------|------|
| Keeps input responsive | Shows stale data briefly |
| No manual transition API | Only helps render performance |
| Built-in, declarative | Needs expensive child to matter |

### One-Line Interview Answer

> useDeferredValue delays updating a value until urgent work finishes — I use it when typing in search should stay smooth while a heavy list re-filters in the background.

### Real Example

```jsx
import { useState, useDeferredValue, memo } from "react";

const SlowList = memo(function SlowList({ query }) {
  const items = filterHugeList(allItems, query); // expensive
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <div style={{ opacity: isStale ? 0.6 : 1 }}>
        <SlowList query={deferredQuery} />
      </div>
    </>
  );
}
```

### useDeferredValue vs useTransition

| | useDeferredValue | useTransition |
|--|------------------|---------------|
| **Defer** | A value | A state update |
| **API** | `useDeferredValue(q)` | `startTransition(() => setQ())` |
| **Pending flag** | Compare `value !== deferred` | `isPending` boolean |
| **Use when** | Value passed to child | You control the setState |

```jsx
// useTransition alternative
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  setInput(e.target.value); // urgent
  startTransition(() => setQuery(e.target.value)); // deferred
};
```

---

## 5. Context API

### Theory

**Context API** shares data across the component tree **without passing props at every level**. Three steps:

1. `createContext(defaultValue)`
2. `<Provider value={...}>` wraps subtree
3. `useContext(MyContext)` consumes value

Best for **low-frequency global data**: theme, locale, authenticated user, feature flags.

### Pros & Cons

| Pros | Cons |
|------|------|
| Eliminates prop drilling | All consumers re-render on value change |
| Built into React | Easy to overuse as global store |
| Simple for theme/auth | No DevTools like Redux |

### One-Line Interview Answer

> Context shares data across the tree without prop drilling. I use it for theme, auth, and locale — not for frequently changing state like form inputs.

### Real Example

```jsx
import { createContext, useContext, useState, useMemo } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      login: (userData) => setUser(userData),
      logout: () => setUser(null),
      isAuthenticated: !!user,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// App setup
function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes />
    </AuthProvider>
  );
}

// Any deep child — no prop drilling
function ProfileMenu() {
  const { user, logout } = useAuth();
  return (
    <div>
      <span>{user?.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Performance Tip

Split contexts by update frequency — `ThemeContext` separate from `UserContext` so theme toggle doesn't re-render auth consumers.

---

## 6. Why Do We Use Custom Hooks?

### Theory

**Custom hooks** are functions starting with `use` that compose built-in hooks to extract **reusable stateful logic**. They share **logic**, not state — each call gets its own state.

### Why use them?

| Reason | Example |
|--------|---------|
| **Reuse logic** | `useFetch`, `useDebounce`, `useLocalStorage` |
| **Separate concerns** | UI component stays clean; logic in hook |
| **Testability** | Test hook with `@testing-library/react-hooks` |
| **Readability** | Component reads like a spec: `useAuth()`, `useCart()` |
| **Replace HOCs/render props** | Modern pattern for shared behavior |

### One-Line Interview Answer

> Custom hooks extract reusable stateful logic into functions — same hooks rules apply. They keep components focused on UI and let me share fetch, debounce, and auth logic across the app.

### Real Example

```jsx
// Custom hook — logic
function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const next = value instanceof Function ? value(stored) : value;
    setStored(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  return [stored, setValue];
}

// Component — UI only
function SettingsPage() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
```

### Rules Reminder

- Name must start with **`use`**
- Can call other hooks inside
- Same **Rules of Hooks** — top level only, no conditions

---

## 7. Debouncing

### Theory

**Debouncing** delays execution until the user **stops** an action for a specified time. Only the **last** call in a burst runs.

Common use: **search input** — wait until user stops typing before API call.

### Pros & Cons

| Pros | Cons |
|------|------|
| Reduces API calls / CPU work | Slight delay in response |
| Better UX for search | Wrong delay feels laggy |
| Prevents rate-limit errors | Needs cleanup on unmount |

### Debounce vs Throttle

| | Debounce | Throttle |
|--|----------|----------|
| **Runs** | After pause | Once per interval |
| **Use for** | Search, auto-save | Scroll, resize |

### One-Line Interview Answer

> Debouncing waits until the user stops typing before running the function — I use it on search inputs to avoid firing an API call on every keystroke.

### Debounce Utility

```javascript
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Custom useDebounce Hook

```jsx
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### Search with Debounce + useFetch

```jsx
function ProductSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { data, loading } = useFetch(
    debouncedQuery
      ? `https://api.example.com/products?q=${encodeURIComponent(debouncedQuery)}`
      : null,
    { enabled: debouncedQuery.length >= 2 }
  );

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
      />
      {loading && <span>Searching...</span>}
      <ProductList products={data ?? []} />
    </>
  );
}
```

### Debounced Callback Hook

```jsx
function useDebouncedCallback(callback, delay = 300) {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay]
  );
}

// Usage
const debouncedSave = useDebouncedCallback((text) => saveToApi(text), 500);
<input onChange={(e) => debouncedSave(e.target.value)} />
```

---

# Quick Revision Cheat Sheet

| # | Topic | One-liner |
|---|-------|-----------|
| 1 | Counter | useState + functional updaters, optional min/max |
| 2 | useFetch | useState + useEffect + AbortController cleanup |
| 3 | Merge objects | reduce + spread (shallow) or recursive deepMerge |
| 4 | useDeferredValue | Defer heavy re-renders; input stays responsive |
| 5 | Context API | createContext → Provider → useContext |
| 6 | Custom hooks | Reuse stateful logic; name with `use` |
| 7 | Debouncing | Wait for pause before executing — search inputs |

---

# Encora Interview Strategy

### Coding round
1. **Counter** — start simple, add bounds/accessibility if time allows
2. **useFetch** — always mention AbortController cleanup
3. **Merge objects** — clarify shallow vs deep with interviewer before coding

### Fundamentals round
- Connect **useDeferredValue** with **debouncing** — both optimize search UX differently
- Explain **Context vs custom hooks** — Context shares data; hooks share logic
- Mention **TanStack Query** as production upgrade over raw useFetch

---

*Encora's 1st round balances hands-on React coding with modern hook knowledge — practice building counters and hooks from scratch without copy-paste templates.*
