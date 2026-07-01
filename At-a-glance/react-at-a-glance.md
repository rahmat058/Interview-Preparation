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

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Core & Rendering (1–8)](#p1) |
| <span id="i2"></span>2 | [Hooks (9–18)](#p2) |
| <span id="i3"></span>3 | [State & Data (19–25)](#p3) |
| <span id="i4"></span>4 | [Performance & Patterns (26–30)](#p4) |
| <span id="i5"></span>5 | [Senior & Production (31–35)](#p5) |

---
## Core & Rendering (1–8)

<a id="p1"></a>

### 1. What is React and why use it?

**Interview Answer:** React is a library for building UIs with components. It uses a virtual DOM and reconciliation to update the real DOM efficiently — I use it for component reuse, predictable data flow, and a huge ecosystem.

**Key point:** Component model + declarative UI + one-way data flow.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

### 2. What is JSX?

**Interview Answer:** JSX is syntax sugar for `React.createElement` — it mixes markup and logic but compiles to plain JavaScript function calls.

```jsx
const el = <h1 className="title">Hi</h1>;
// → React.createElement('h1', { className: 'title' }, 'Hi')
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

### 3. Virtual DOM and reconciliation?

**Interview Answer:** React keeps a lightweight tree in memory, diffs it on updates, and applies minimal DOM changes. Reconciliation is that diffing process — keyed by element type and `key` on lists.

**Key point:** O(n) heuristic diff — same type → update props; different type → replace subtree.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

### 4. What is React Fiber?

**Interview Answer:** Fiber is React's reconciliation engine that splits work into units, can pause/resume, and prioritizes urgent updates (input) over slow ones (data fetch UI) — foundation for Concurrent React.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

### 5. Why are keys important in lists?

**Interview Answer:** Keys tell React which item moved, was added, or removed. Index keys break when list order changes — use stable IDs.

```jsx
// ❌ reorder loses input focus/state
items.map((item, i) => <Row key={i} />);
// ✅
items.map((item) => <Row key={item.id} />);
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

### 6. CSR vs SSR vs SSG vs hydration?

**Interview Answer:** CSR renders in the browser — slow first paint. SSR sends HTML from server per request. SSG pre-builds HTML at build time. Hydration attaches React event listeners to server HTML — mismatch causes hydration errors.

| Model | First paint    | Data freshness |
| ----- | -------------- | -------------- |
| CSR   | After JS loads | Client fetch   |
| SSR   | Server HTML    | Per request    |
| SSG   | Pre-built HTML | Rebuild / ISR  |

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

### 7. Controlled vs uncontrolled components?

**Interview Answer:** Controlled — React state is source of truth (`value` + `onChange`). Uncontrolled — DOM holds state via `ref`. I default to controlled for forms with validation; uncontrolled for simple file inputs or integrating non-React libs.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

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


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

### 9. Rules of Hooks?

**Interview Answer:** Only call hooks at the top level of React functions — not in loops, conditions, or nested functions. Only from React components or custom hooks.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

### 10. `useState` — functional updates?

**Interview Answer:** When new state depends on previous, use the updater form `setCount(c => c + 1)` to avoid stale closures in async callbacks.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

### 11. `useEffect` — what is it for?

**Interview Answer:** Sync React state with external systems — subscriptions, timers, manual DOM, logging. Not for deriving state from props (compute during render) or for event handlers (put logic in handler).

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

### 12. Dependency array — `[]`, omitted, `[a,b]`?

**Interview Answer:** `[]` runs once after mount. Omitted runs every render (rare). `[deps]` runs when deps change. ESLint `exhaustive-deps` catches stale bugs — I follow it unless there's a documented exception with cleanup.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

### 13. `useMemo` vs `useCallback`?

**Interview Answer:** `useMemo` caches a **computed value**; `useCallback` caches a **function reference**. Both help when passing stable refs to memoized children — don't sprinkle everywhere; profile first.

```jsx
const sorted = useMemo(() => heavySort(items), [items]);
const onSelect = useCallback((id) => setSelected(id), []);
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

### 14. When NOT to use `useMemo` / `useCallback`?

**Interview Answer:** When children aren't memoized, work is cheap, or deps change every render anyway — the memoization cost exceeds benefit.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

### 15. `useRef` vs `useState`?

**Interview Answer:** `useRef` holds mutable value without re-render — DOM nodes, timer IDs, previous value. `useState` triggers re-render when UI must update.

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

### 16. `useReducer` — when over `useState`?

**Interview Answer:** Complex state transitions, multiple sub-values, or next state depends on previous in intricate ways — cart, wizards, reducers test well.

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

### 17. Custom hooks — what makes a good one?

**Interview Answer:** Extract stateful logic reused across components — `useFetch`, `useDebounce`, `useLocalStorage`. Name starts with `use`; can compose other hooks.

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

### 18. `useContext` — when and pitfalls?

**Interview Answer:** Share tree-wide data without prop drilling — theme, locale, auth. Pitfall: every consumer re-renders when context value changes — split contexts or memoize provider value.

---

## State & Data (19–25)


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

### 19. Prop drilling vs Context vs global store?

**Interview Answer:** Props for 1–2 levels. Context for low-frequency broad data (theme). Redux/Zustand/Pinia when many components update shared transactional state (cart, filters) with devtools and middleware.

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

### 20. Redux data flow (RTK)?

**Interview Answer:** UI dispatches action → reducer updates immutable state in store → selectors derive data → components re-render. RTK simplifies with `createSlice`, Immer, and `configureStore`.

```tsx
dispatch(addItem({ productId, qty }));
const total = useSelector(selectCartTotal);
```

---


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

### 21. Redux vs TanStack Query?

**Interview Answer:** Redux for client-owned UI state. React Query for **server state** — caching, dedup, background refetch, stale-while-revalidate. Most apps use both.

---


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

### 22. Lifting state up?

**Interview Answer:** Move shared state to closest common ancestor; pass data down, callbacks up — keeps single source of truth.

---


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

### 23. React Router — protected routes?

**Interview Answer:** Layout route that checks auth and `<Navigate to="/login" />` or loader-based redirect in v6.4+. Keep auth check before rendering children that fetch sensitive data.

---


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

### 24. Fetching data — `useEffect` vs React Query?

**Interview Answer:** Raw `useEffect` + fetch works but duplicates loading/error logic. React Query gives cache, retry, dedup, and invalidation — default for production data fetching.

---


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

### 25. Forms — React Hook Form + Zod?

**Interview Answer:** RHF minimizes re-renders with uncontrolled registration; Zod validates schema server-side and client-side. Pair with Server Actions in Next.js for progressive enhancement.

---

## Performance & Patterns (26–30)


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

### 26. `React.memo` — when?

**Interview Answer:** When a component re-renders often with same props and render is expensive — pure list rows, chart wrappers. Use with stable props (`useCallback`/`useMemo`) or memo is useless.

---


<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

### 27. Code splitting & `lazy`?

**Interview Answer:** Split bundles by route or heavy feature — `React.lazy` + `Suspense` fallback. Reduces initial JS for dashboards with admin-only modules.

```jsx
const Admin = lazy(() => import("./Admin"));
<Suspense fallback={<Spinner />}>
  <Admin />
</Suspense>;
```

---


<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

### 28. `useTransition` / `useDeferredValue`?

**Interview Answer:** Mark non-urgent updates (filter large list) as transitions so typing stays responsive — Concurrent React keeps UI snappy during expensive re-renders.

---


<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

### 29. HOC vs custom hooks?

**Interview Answer:** Hooks replaced most HOCs — logic reuse without wrapper hell. HOCs still valid for cross-cutting inject props (rare) or third-party APIs.

---


<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

### 30. React Strict Mode — why double invoke?

**Interview Answer:** Dev-only double render/effect to surface impure side effects and missing cleanup — not a production bug.

---

## Senior & Production (31–35)


<p><a href="#i30">Back to index</a></p>

<a id="p31"></a>

### 31. React Server Components (RSC) — advantage?

**Interview Answer:** Run on server, zero client bundle for that code, direct DB access, compose with Client islands. Trade-off: serialization boundaries and no hooks in server components.

---


<p><a href="#i31">Back to index</a></p>

<a id="p32"></a>

### 32. Scalable folder structure?

**Interview Answer:** Feature-based (`features/cart/`) over type-based (`components/`) at scale — colocate components, hooks, API, types per domain. Shared UI in `components/ui/`.

---


<p><a href="#i32">Back to index</a></p>

<a id="p33"></a>

### 33. Core Web Vitals — React levers?

**Interview Answer:** LCP — server HTML, priority images, less client blocking. INP — smaller client trees, transitions. CLS — image dimensions, font fallbacks, skeleton sizes.

---


<p><a href="#i33">Back to index</a></p>

<a id="p34"></a>

### 34. Frontend caching layers?

**Interview Answer:** HTTP cache headers, CDN, React Query client cache, service worker for offline, `localStorage` for preferences — invalidate on mutation with tags or version keys.

---


<p><a href="#i34">Back to index</a></p>

<a id="p35"></a>

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


<p><a href="#i35">Back to index</a></p>
