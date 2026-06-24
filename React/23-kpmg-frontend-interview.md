---
title: "KPMG Frontend Interview — Round 2 & Round 4"
description: "KPMG Round 2 React — internals, virtualized infinite feed, React vs Vue, Intersection Observer. Round 4 — hiring manager behavioral."
tags:
  [
    "react",
    "vue",
    "kpmg",
    "interview",
    "virtualization",
    "intersection-observer",
    "behavioral",
  ]
level: "2–5 years"
company: "KPMG"
---

# KPMG Frontend Interview — Round 2 & Round 4

| Round       | Duration | Focus                                                                  |
| ----------- | -------- | ---------------------------------------------------------------------- |
| **Round 2** | 60 mins  | React internals, virtualized feed, React vs Vue, Intersection Observer |
| **Round 4** | —        | Hiring Manager — systems built, codebases, collaboration, ownership    |

**Other rounds:** [Round 1 — JavaScript](../Javascript/kpmg-round-1-vanilla-javascript-interview.md) · [Round 3 — File Upload System Design](../System%20Design/04-file-upload-system-design.md)

---

## Table of Contents

### Round 2 — ReactJS

1. [React Internals & Rendering Lifecycle](#1-react-internals--rendering-lifecycle)
2. [Virtual DOM, Hydration, Reconciliation & Scheduling](#2-virtual-dom-hydration-reconciliation--scheduling)
3. [Design: Virtualized Infinite Feed](#3-design--implement-a-virtualized-infinite-feed)
4. [React vs Vue — Architecture & Performance](#4-react-vs-vue--architecture--performance-tradeoffs)
5. [Intersection Observer & Rendering Optimizations](#5-intersection-observer--rendering-optimizations)

### Round 4 — Hiring Manager

6. [Largest Frontend Systems Built](#6-largest-frontend-systems-built)
7. [Handling Complex Codebases](#7-handling-complex-codebases)
8. [Team Collaboration & Conflict Resolution](#8-team-collaboration--conflict-resolution)
9. [Engineering Quality & Ownership](#9-engineering-quality--ownership)

10. [Quick Revision Cheat Sheet](#10-quick-revision-cheat-sheet)

---

# Round 2 — ReactJS

## 1. React Internals & Rendering Lifecycle

### Theory

When state changes, React runs a **render pass** (pure, can be interrupted) and a **commit pass** (DOM updates, synchronous).

```
Trigger (setState, dispatch, parent re-render)
    ↓
Render phase (Fiber work loop — interruptible)
  → Call component functions / hooks
  → Build new element tree
  → Diff with previous tree (reconciliation)
    ↓
Commit phase (synchronous)
  → Apply DOM mutations
  → useLayoutEffect
    ↓
Browser paint
    ↓
useEffect (passive, after paint)
```

**Class component lifecycle (still asked)**

| Phase   | Methods                                        |
| ------- | ---------------------------------------------- |
| Mount   | `constructor` → `render` → `componentDidMount` |
| Update  | `render` → `componentDidUpdate`                |
| Unmount | `componentWillUnmount`                         |

**Hooks equivalent**

| Class                   | Hooks                                |
| ----------------------- | ------------------------------------ |
| `componentDidMount`     | `useEffect(() => {}, [])`            |
| `componentDidUpdate`    | `useEffect(() => {}, [deps])`        |
| `componentWillUnmount`  | `useEffect(() => () => cleanup, [])` |
| `shouldComponentUpdate` | `React.memo`, `useMemo`              |

### Real Example — Lifecycle in hooks

```tsx
function LiveOrderMap({ orderId }: { orderId: string }) {
  const [location, setLocation] = useState<Coords | null>(null);

  // Mount + update when orderId changes
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/orders/${orderId}/location`);

    ws.onmessage = (e) => setLocation(JSON.parse(e.data));

    // Unmount cleanup
    return () => ws.close();
  }, [orderId]);

  // Runs after DOM update, before paint — measure DOM
  useLayoutEffect(() => {
    if (!location) return;
    centerMapOn(location);
  }, [location]);

  return <MapMarker coords={location} />;
}
```

### Interview Answer

> React separates render (compute next UI, diff) from commit (apply DOM). Hooks map to lifecycle: mount/update/unmount via `useEffect`, layout reads via `useLayoutEffect`. Fiber makes rendering interruptible so urgent updates aren't blocked.

---

## 2. Virtual DOM, Hydration, Reconciliation & Scheduling

### Theory

| Concept            | What it is                                                         |
| ------------------ | ------------------------------------------------------------------ |
| **Virtual DOM**    | Lightweight JS representation of UI (React elements / Fiber nodes) |
| **Reconciliation** | Diffing old vs new tree; keys identify stable identity in lists    |
| **Hydration**      | Attaching event listeners to server-rendered HTML (SSR)            |
| **Scheduling**     | Priority lanes — user input > transitions > idle work              |

**Reconciliation rules (simplified)**

- Same component type → update props, recurse children
- Different type → unmount old, mount new
- Lists → use **stable `key`** (not index if list reorders)

**Hydration mismatch** — server HTML ≠ client first render → React warns and may re-render client-side.

### Real Example — Keys and reconciliation

```tsx
// ❌ Index keys — reordering breaks state
{
  items.map((item, i) => <Row key={i} item={item} />);
}

// ✅ Stable id keys
{
  items.map((item) => <Row key={item.id} item={item} />);
}
```

**React 18 scheduling — `startTransition`**

```tsx
import { useState, useTransition } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value); // urgent — input stays responsive

    startTransition(() => {
      setResults(filterHeavyList(value)); // low priority
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating…</span>}
      <ResultList items={results} />
    </>
  );
}
```

**Hydration (Next.js / SSR)**

```tsx
// ❌ Mismatch — Date.now() differs server vs client
function Bad() {
  return <p>{Date.now()}</p>;
}

// ✅ Client-only value after mount
function Good() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  return <p>{now ?? "—"}</p>;
}
```

### Interview Answer

> Virtual DOM lets React diff and apply minimal DOM updates. Reconciliation uses element type and keys; hydration wires SSR HTML to client handlers and must match server output. React 18 schedules urgent vs transition updates separately.

---

## 3. Design & Implement a Virtualized Infinite Feed

### Description

**KPMG machine coding ask:** Build a feed (like Twitter/LinkedIn) that loads more items on scroll **without rendering 10,000 DOM nodes**.

### Theory

| Approach                       | Idea                                                   |
| ------------------------------ | ------------------------------------------------------ |
| **Windowing / virtualization** | Only render visible rows + overscan buffer             |
| **Infinite scroll**            | Fetch next page when sentinel enters viewport          |
| **Intersection Observer**      | Detect when sentinel is visible (no scroll event spam) |

Libraries: `@tanstack/react-virtual`, `react-window`, `react-virtuoso`.

### Pros & Cons

| Virtualized list                 | Render all items                |
| -------------------------------- | ------------------------------- |
| ✅ Constant DOM size             | ✅ Simpler code                 |
| ✅ Smooth scroll on 100K items   | ❌ Memory + paint cost explodes |
| ❌ Variable row height is harder | ❌ Mobile browsers crash        |

### Real Example — Virtualized infinite feed

```tsx
"use client";

import { useRef, useCallback, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInfiniteQuery } from "@tanstack/react-query";

type FeedItem = { id: string; author: string; text: string };

async function fetchFeedPage({ pageParam = 0 }) {
  const res = await fetch(`/api/feed?cursor=${pageParam}`);
  return res.json() as Promise<{
    items: FeedItem[];
    nextCursor: number | null;
  }>;
}

export function VirtualizedFeed() {
  const parentRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: fetchFeedPage,
      getNextPageParam: (last) => last.nextCursor ?? undefined,
    });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  // Infinite load when sentinel visible
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  if (status === "pending") return <FeedSkeleton />;

  return (
    <div ref={parentRef} className="h-[80vh] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const item = items[row.index];
          return (
            <article
              key={item.id}
              className="feed-card"
              style={{
                position: "absolute",
                top: 0,
                transform: `translateY(${row.start}px)`,
                height: `${row.size}px`,
              }}
            >
              <strong>{item.author}</strong>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
      <div ref={sentinelRef} aria-hidden className="h-1" />
      {isFetchingNextPage && <p>Loading more…</p>}
    </div>
  );
}
```

**What to explain while coding**

1. Virtualizer computes visible range from scroll offset
2. Only ~15–20 DOM nodes exist regardless of total items
3. Sentinel + Intersection Observer triggers `fetchNextPage`
4. `key={item.id}` for stable reconciliation
5. `overscan` reduces blank flashes on fast scroll

### Interview Answer

> I'd virtualize the list with TanStack Virtual so only visible rows mount, use React Query infinite queries for pagination, and Intersection Observer on a sentinel to load more — keeping DOM size constant and scroll performant on large feeds.

---

## 4. React vs Vue — Architecture & Performance Tradeoffs

### Theory

| Area                   | React                                     | Vue                             |
| ---------------------- | ----------------------------------------- | ------------------------------- |
| **UI model**           | JSX — JS everywhere                       | Templates + optional JSX        |
| **Reactivity**         | Immutable state + rerender                | Proxy-based tracking (Vue 3)    |
| **Update granularity** | Component-level rerender (memo to narrow) | Fine-grained by default         |
| **State**              | useState, Context, Redux, Zustand         | ref/reactive, Pinia             |
| **SSR framework**      | Next.js                                   | Nuxt                            |
| **Learning curve**     | Hooks + ecosystem choices                 | Gentler defaults, more built-in |

### Pros & Cons

| Choose React                            | Choose Vue                                      |
| --------------------------------------- | ----------------------------------------------- |
| ✅ Largest ecosystem, hiring pool       | ✅ Faster onboarding, less boilerplate          |
| ✅ React Native for mobile              | ✅ Built-in transitions, directives             |
| ✅ Flexibility (library not framework)  | ✅ SFC colocation (style/template/script)       |
| ❌ More decisions (router, state, data) | ❌ Smaller enterprise footprint in some regions |

### Performance tradeoffs

| React                                                      | Vue                                                        |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| Re-renders whole component on state change unless memoized | Compiler + proxies track deps — skip unaffected components |
| Virtual DOM diff every update                              | Patch only tracked dependencies                            |
| `useMemo` / `React.memo` manual opt-in                     | `computed` auto-caches                                     |
| Fiber scheduling for concurrent features                   | Vue 3 scheduler + async component boundaries               |

### Real Example — Same counter

```tsx
// React — explicit state triggers component rerender
function ReactCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

```vue
<!-- Vue — ref tracked automatically -->
<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

### Interview Answer

> React rerenders components when state changes and relies on Virtual DOM diffing plus manual memoization for hot paths. Vue 3 tracks dependencies at compile/runtime for finer updates. I'd pick React for ecosystem and cross-platform; Vue for faster delivery with opinionated defaults — both perform well when lists are virtualized and state is colocated.

---

## 5. Intersection Observer & Rendering Optimizations

### Theory

**Intersection Observer** asynchronously reports when an element enters/leaves a viewport (or scroll container). Better than `scroll` listeners — no main-thread firing on every pixel.

**Rendering optimizations checklist**

| Technique                  | When                                                      |
| -------------------------- | --------------------------------------------------------- |
| `React.memo`               | Pure child re-renders from parent                         |
| `useMemo` / `useCallback`  | Expensive compute / stable callbacks to memoized children |
| Code splitting             | `React.lazy` + `Suspense`                                 |
| Virtualization             | Long lists                                                |
| Intersection Observer      | Lazy images, infinite scroll, analytics impressions       |
| `content-visibility: auto` | CSS native offscreen skip (modern browsers)               |
| Debounce resize handlers   | Layout-heavy components                                   |

### Real Example — Lazy image + impression tracking

```tsx
function LazyFeedImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = src;
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={loaded ? "opacity-100" : "opacity-0"}
      width={400}
      height={225}
    />
  );
}
```

```tsx
// Memoize heavy child
const ChartPanel = React.memo(function ChartPanel({ data }: { data: Point[] }) {
  return <ExpensiveChart data={data} />;
});

function Dashboard({ raw }: { raw: RawRow[] }) {
  const chartData = useMemo(() => aggregate(raw), [raw]);
  return <ChartPanel data={chartData} />;
}
```

### Interview Answer

> I use Intersection Observer for lazy loading and infinite scroll instead of scroll listeners, combine virtualization for long lists, and apply `React.memo` / `useMemo` only where profiling shows unnecessary rerenders — not everywhere by default.

---

# Round 4 — Hiring Manager

Behavioral round — use **STAR** (Situation, Task, Action, Result). Keep answers 2–3 minutes.

---

## 6. Largest Frontend Systems Built

### What they're assessing

Scale (users, teams, code volume), your **role** (lead vs contributor), and **impact**.

### Framework

```text
Situation — product, users, team size
Task      — your ownership area
Action    — architecture, migrations, standards you drove
Result    — metrics (LCP, crash rate, delivery speed, revenue)
```

### Sample answer skeleton

> "I worked on a **multi-tenant audit dashboard** used by **2,000+ consultants** across **12 regions**. I owned the **React + TypeScript** shell, design system, and **module federation** for team micro-frontends. I introduced **route-based code splitting** and **React Query** for server state, cutting initial load from **4.2s to 1.8s LCP**. I also set up **CI visual regression** and **ESLint boundaries** so five squads could ship without breaking shared contracts. Result: **40% fewer production incidents** and **2× release frequency**."

### Topics to mention if true for you

- Micro-frontends / monorepo (Nx, Turborepo)
- Design system at scale
- Auth (SSO, RBAC)
- Accessibility compliance (WCAG)
- Cross-browser / legacy IE migration

### Interview Answer

> Lead with user scale and business domain, then your specific ownership, one technical decision you drove, and a measurable outcome — not a list of technologies.

---

## 7. Handling Complex Codebases

### What they're assessing

Navigation, refactoring courage, documentation, and pragmatism.

### Strategies to describe

| Strategy                | Example                                                  |
| ----------------------- | -------------------------------------------------------- |
| **Map before change**   | Dependency graph, feature flags, strangler fig migration |
| **Thin slices**         | Refactor one route/module per sprint                     |
| **Tests as safety net** | Characterization tests before big moves                  |
| **Conventions**         | ADRs, folder structure, CODEOWNERS                       |
| **Tooling**             | TypeScript strict mode, knip for dead code               |

### Sample answer skeleton

> "On a **180K-line React codebase** with mixed JS/TS, I started with a **dependency-cruiser** audit to find circular imports. We adopted a **feature-folder** structure and **barrel export limits**. I migrated the **highest-traffic checkout flow** to TypeScript first with **RTL tests**, behind a **feature flag**. We didn't freeze the product — every sprint delivered user value while **tech debt ratio** dropped in SonarQube from **35% to 18%** over two quarters."

### Interview Answer

> I understand complex codebases by mapping dependencies and hot paths first, then improve through small, tested slices — feature flags, typing, and clear ownership — not big-bang rewrites.

---

## 8. Team Collaboration & Conflict Resolution

### Common questions

- Disagreement with a senior engineer on architecture?
- Missed deadline — what did you do?
- Code review feedback that felt unfair?
- Working with backend/design on conflicting priorities?

### STAR example — Technical disagreement

```text
Situation: Team split on Redux vs React Query for server state.
Task:      Unblock sprint planning without endless debate.
Action:    Proposed a 1-week spike — same feature both ways; measured bundle size,
           lines of code, and cache behavior. Documented in a short ADR.
           Team voted with data; chose React Query + Zustand for UI state.
Result:    Decision in 3 days; team bought in; pattern documented for other squads.
```

### Conflict principles KPMG cares about

- **Professional services mindset** — client delivery, clarity, documentation
- **Escalate early** with facts, not emotion
- **Assume positive intent** in code review
- **Write it down** — ADR, RFC, meeting notes

### Interview Answer

> I resolve technical conflicts with data and time-boxed experiments, document decisions in ADRs, and escalate early when deadlines or quality are at risk — always separating people from problems.

---

## 9. Engineering Quality & Ownership

### What they're assessing

Testing, monitoring, on-call mindset, production responsibility.

### Ownership signals

| Signal                  | Example phrase                                  |
| ----------------------- | ----------------------------------------------- |
| **Prevent regressions** | "I added E2E for critical paths in CI"          |
| **Monitor production**  | "Dashboards for error rate and Core Web Vitals" |
| **Postmortems**         | "Blameless RCA after checkout outage"           |
| **Mentorship**          | "Pairing juniors on hooks and testing"          |
| **Security**            | "OWASP review on file upload flow"              |

### Sample answer — Ownership

> "I treat merged code as **my responsibility until it's stable in production**. For a **payment widget**, I added **unit + integration tests**, **Sentry** alerts on JS errors, and **feature flags** for rollback. When error rate spiked after a release, I **rolled back within 12 minutes**, led a **blameless postmortem**, and added a **missing null check** plus a test that would have caught it. I don't hand off to QA and disappear."

### Interview Answer

> Quality means tests on critical paths, observability in production, and owning incidents end-to-end — fix, learn, and harden the system so the same class of bug can't recur.

---

## 10. Quick Revision Cheat Sheet

### Round 2 — React

| Topic                 | Key point                                       |
| --------------------- | ----------------------------------------------- |
| Lifecycle             | Render → commit → paint → useEffect             |
| Reconciliation        | Keys, same element type                         |
| Hydration             | Server HTML must match client first paint       |
| Virtualized feed      | TanStack Virtual + infinite query + IO sentinel |
| React vs Vue          | Rerender + VDOM vs proxy tracking               |
| Intersection Observer | Lazy load / infinite scroll without scroll spam |

### Round 4 — Behavioral

| Question         | Structure                                      |
| ---------------- | ---------------------------------------------- |
| Largest system   | Scale → your role → decision → metric          |
| Complex codebase | Map → thin slices → tests → flags              |
| Conflict         | STAR + ADR/spike                               |
| Ownership        | Ship → monitor → incident → prevent recurrence |

---

**Next:** [Round 3 — File Upload System Design](../System%20Design/04-file-upload-system-design.md)
