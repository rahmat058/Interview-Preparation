---
title: "React At a Glance — Senior & Mid-Level"
description: "35 unique high-value React interview questions distilled from all React guides — no repeats, one-line answers + key examples."
tags: ["react", "interview", "at-a-glance", "senior", "mid-level"]
level: "Mid-Level to Senior (4–5+ years)"
format: "Consolidated Q&A"
---

# React At a Glance — Senior & Mid-Level

**35 unique questions** picked from [React/](../React/) guides (Top 30/50, senior JS, company rounds, best practices, real-world). **No duplicates** — each topic appears once.

> Format: **Question** → **Interview Answer** (spoken) → **Key point / snippet** when useful.

---

## Table of Contents

1. [Core & Rendering (1–8)](#core--rendering-18)
2. [Hooks (9–18)](#hooks-918)
3. [State & Data (19–25)](#state--data-1925)
4. [Performance & Patterns (26–30)](#performance--patterns-2630)
5. [Senior & Production (31–35)](#senior--production-3135)

---

## Core & Rendering (1–8)

### 1. What is React and why use it?

**Interview Answer:** React is a library for building UIs with components. It uses a virtual DOM and reconciliation to update the real DOM efficiently — I use it for component reuse, predictable data flow, and a huge ecosystem.

**Key point:** Component model + declarative UI + one-way data flow.

---

### 2. What is JSX?

**Interview Answer:** JSX is syntax sugar for `React.createElement` — it mixes markup and logic but compiles to plain JavaScript function calls.

```jsx
const el = <h1 className="title">Hi</h1>;
// → React.createElement('h1', { className: 'title' }, 'Hi')
```

---

### 3. Virtual DOM and reconciliation?

**Interview Answer:** React keeps a lightweight tree in memory, diffs it on updates, and applies minimal DOM changes. Reconciliation is that diffing process — keyed by element type and `key` on lists.

**Key point:** O(n) heuristic diff — same type → update props; different type → replace subtree.

---

### 4. What is React Fiber?

**Interview Answer:** Fiber is React's reconciliation engine that splits work into units, can pause/resume, and prioritizes urgent updates (input) over slow ones (data fetch UI) — foundation for Concurrent React.

---

### 5. Why are keys important in lists?

**Interview Answer:** Keys tell React which item moved, was added, or removed. Index keys break when list order changes — use stable IDs.

```jsx
// ❌ reorder loses input focus/state
items.map((item, i) => <Row key={i} />);
// ✅
items.map((item) => <Row key={item.id} />);
```

---

### 6. CSR vs SSR vs SSG vs hydration?

**Interview Answer:** CSR renders in the browser — slow first paint. SSR sends HTML from server per request. SSG pre-builds HTML at build time. Hydration attaches React event listeners to server HTML — mismatch causes hydration errors.

| Model | First paint    | Data freshness |
| ----- | -------------- | -------------- |
| CSR   | After JS loads | Client fetch   |
| SSR   | Server HTML    | Per request    |
| SSG   | Pre-built HTML | Rebuild / ISR  |

---

### 7. Controlled vs uncontrolled components?

**Interview Answer:** Controlled — React state is source of truth (`value` + `onChange`). Uncontrolled — DOM holds state via `ref`. I default to controlled for forms with validation; uncontrolled for simple file inputs or integrating non-React libs.

---

### 8. Error boundaries — what catches what?

**Interview Answer:** Class component (or library) with `componentDidCatch` / `getDerivedStateFromError` catches render errors in children — not event handlers, async code, or SSR. Use per-route or widget boundaries.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <Fallback /> : this.props.children;
  }
}
```

---

## Hooks (9–18)

### 9. Rules of Hooks?

**Interview Answer:** Only call hooks at the top level of React functions — not in loops, conditions, or nested functions. Only from React components or custom hooks.

---

### 10. `useState` — functional updates?

**Interview Answer:** When new state depends on previous, use the updater form `setCount(c => c + 1)` to avoid stale closures in async callbacks.

---

### 11. `useEffect` — what is it for?

**Interview Answer:** Sync React state with external systems — subscriptions, timers, manual DOM, logging. Not for deriving state from props (compute during render) or for event handlers (put logic in handler).

---

### 12. Dependency array — `[]`, omitted, `[a,b]`?

**Interview Answer:** `[]` runs once after mount. Omitted runs every render (rare). `[deps]` runs when deps change. ESLint `exhaustive-deps` catches stale bugs — I follow it unless there's a documented exception with cleanup.

---

### 13. `useMemo` vs `useCallback`?

**Interview Answer:** `useMemo` caches a **computed value**; `useCallback` caches a **function reference**. Both help when passing stable refs to memoized children — don't sprinkle everywhere; profile first.

```jsx
const sorted = useMemo(() => heavySort(items), [items]);
const onSelect = useCallback((id) => setSelected(id), []);
```

---

### 14. When NOT to use `useMemo` / `useCallback`?

**Interview Answer:** When children aren't memoized, work is cheap, or deps change every render anyway — the memoization cost exceeds benefit.

---

### 15. `useRef` vs `useState`?

**Interview Answer:** `useRef` holds mutable value without re-render — DOM nodes, timer IDs, previous value. `useState` triggers re-render when UI must update.

---

### 16. `useReducer` — when over `useState`?

**Interview Answer:** Complex state transitions, multiple sub-values, or next state depends on previous in intricate ways — cart, wizards, reducers test well.

---

### 17. Custom hooks — what makes a good one?

**Interview Answer:** Extract stateful logic reused across components — `useFetch`, `useDebounce`, `useLocalStorage`. Name starts with `use`; can compose other hooks.

---

### 18. `useContext` — when and pitfalls?

**Interview Answer:** Share tree-wide data without prop drilling — theme, locale, auth. Pitfall: every consumer re-renders when context value changes — split contexts or memoize provider value.

---

## State & Data (19–25)

### 19. Prop drilling vs Context vs global store?

**Interview Answer:** Props for 1–2 levels. Context for low-frequency broad data (theme). Redux/Zustand/Pinia when many components update shared transactional state (cart, filters) with devtools and middleware.

---

### 20. Redux data flow (RTK)?

**Interview Answer:** UI dispatches action → reducer updates immutable state in store → selectors derive data → components re-render. RTK simplifies with `createSlice`, Immer, and `configureStore`.

```tsx
dispatch(addItem({ productId, qty }));
const total = useSelector(selectCartTotal);
```

---

### 21. Redux vs TanStack Query?

**Interview Answer:** Redux for client-owned UI state. React Query for **server state** — caching, dedup, background refetch, stale-while-revalidate. Most apps use both.

---

### 22. Lifting state up?

**Interview Answer:** Move shared state to closest common ancestor; pass data down, callbacks up — keeps single source of truth.

---

### 23. React Router — protected routes?

**Interview Answer:** Layout route that checks auth and `<Navigate to="/login" />` or loader-based redirect in v6.4+. Keep auth check before rendering children that fetch sensitive data.

---

### 24. Fetching data — `useEffect` vs React Query?

**Interview Answer:** Raw `useEffect` + fetch works but duplicates loading/error logic. React Query gives cache, retry, dedup, and invalidation — default for production data fetching.

---

### 25. Forms — React Hook Form + Zod?

**Interview Answer:** RHF minimizes re-renders with uncontrolled registration; Zod validates schema server-side and client-side. Pair with Server Actions in Next.js for progressive enhancement.

---

## Performance & Patterns (26–30)

### 26. `React.memo` — when?

**Interview Answer:** When a component re-renders often with same props and render is expensive — pure list rows, chart wrappers. Use with stable props (`useCallback`/`useMemo`) or memo is useless.

---

### 27. Code splitting & `lazy`?

**Interview Answer:** Split bundles by route or heavy feature — `React.lazy` + `Suspense` fallback. Reduces initial JS for dashboards with admin-only modules.

```jsx
const Admin = lazy(() => import("./Admin"));
<Suspense fallback={<Spinner />}>
  <Admin />
</Suspense>;
```

---

### 28. `useTransition` / `useDeferredValue`?

**Interview Answer:** Mark non-urgent updates (filter large list) as transitions so typing stays responsive — Concurrent React keeps UI snappy during expensive re-renders.

---

### 29. HOC vs custom hooks?

**Interview Answer:** Hooks replaced most HOCs — logic reuse without wrapper hell. HOCs still valid for cross-cutting inject props (rare) or third-party APIs.

---

### 30. React Strict Mode — why double invoke?

**Interview Answer:** Dev-only double render/effect to surface impure side effects and missing cleanup — not a production bug.

---

## Senior & Production (31–35)

### 31. React Server Components (RSC) — advantage?

**Interview Answer:** Run on server, zero client bundle for that code, direct DB access, compose with Client islands. Trade-off: serialization boundaries and no hooks in server components.

---

### 32. Scalable folder structure?

**Interview Answer:** Feature-based (`features/cart/`) over type-based (`components/`) at scale — colocate components, hooks, API, types per domain. Shared UI in `components/ui/`.

---

### 33. Core Web Vitals — React levers?

**Interview Answer:** LCP — server HTML, priority images, less client blocking. INP — smaller client trees, transitions. CLS — image dimensions, font fallbacks, skeleton sizes.

---

### 34. Frontend caching layers?

**Interview Answer:** HTTP cache headers, CDN, React Query client cache, service worker for offline, `localStorage` for preferences — invalidate on mutation with tags or version keys.

---

### 35. State management in large apps — decision framework?

**Interview Answer:** Categorize state — server (Query), URL (router), local UI (`useState`), global client (Zustand/Redux), form (RHF). Don't put everything in Redux.

| State type     | Tool                    |
| -------------- | ----------------------- |
| Server API     | TanStack Query          |
| URL filters    | `searchParams` / router |
| Theme          | Context                 |
| Cart / complex | Redux Toolkit           |
| Form           | React Hook Form         |

---

## Quick Revision (60 seconds)

```
Reconciliation + keys + Fiber
Hooks: rules, deps, memo when profiled
Redux = client state; Query = server state
RSC = server default in Next App Router
Performance = memo + lazy + transitions + measure CWV
```

---

_Deep dives: [React/17-top-50-react-interview-questions.md](../React/17-top-50-react-interview-questions.md) · [React/13-senior-react-javascript-interview.md](../React/13-senior-react-javascript-interview.md) · [Projects/](../Projects/)_
