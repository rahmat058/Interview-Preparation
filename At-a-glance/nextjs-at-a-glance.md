---
title: "Next.js 16 At a Glance — Senior & Mid-Level"
description: "32 unique Next.js 16 interview questions distilled from all NEXT guides — no repeats, one-line answers + key snippets."
tags: ["nextjs", "nextjs-16", "interview", "at-a-glance", "senior"]
level: "Mid-Level to Senior (4–5+ years)"
format: "Consolidated Q&A"
---

# Next.js 16 At a Glance — Senior & Mid-Level

**32 unique questions** from [NEXT/](../NEXT/) guides — consolidated, **no duplicates**. Covers App Router, Cache Components, proxy, Turbopack, and production patterns.

> Format: **Question** → **Interview Answer** → **Key snippet** when useful.

---

## Table of Contents

1. [Architecture (1–8)](#architecture-18)
2. [Server & Client (9–14)](#server--client-914)
3. [Caching & Data (15–22)](#caching--data-1522)
4. [Routing, Auth & Deploy (23–28)](#routing-auth--deploy-2328)
5. [Next 16 & Migration (29–32)](#next-16--migration-2932)

---

## Architecture (1–8)

### 1. Why Next.js over Vite SPA?

**Interview Answer:** When I need SEO, server-rendered HTML, colocated data fetching, and built-in routing/deploy — Next.js. Internal tools with no SEO can stay Vite SPA.

---

### 2. App Router vs Pages Router?

**Interview Answer:** App Router for all new work — Server Components, nested layouts, Cache Components. Pages Router for legacy; migrate incrementally.

---

### 3. `layout.tsx` vs `page.tsx` vs `template.tsx`?

**Interview Answer:** Layout persists across child navigations. Page is the URL segment UI. Template remounts every navigation — use for enter/exit animations.

---

### 4. Rendering: static, dynamic, PPR?

**Interview Answer:** Static/cached shell via `"use cache"`; dynamic holes stream per request. PPR = fast shell + streamed personalized parts.

---

### 5. File conventions quick map?

**Interview Answer:** `page` = route UI, `layout` = wrapper, `loading` = Suspense fallback, `error` = error boundary, `route.ts` = API handler, `(group)` = org without URL change.

---

### 6. Route groups — why?

**Interview Answer:** `(marketing)` vs `(app)` — different layouts and auth boundaries without `/marketing` in the URL.

---

### 7. Parallel routes `@modal`?

**Interview Answer:** Render multiple pages in one layout — modal slot over list for shareable URLs with soft navigation UX.

---

### 8. Intercepting routes?

**Interview Answer:** `(.)photo/[id]` shows modal on client nav from `/photos`, full page on hard refresh — better UX with same URL.

---

## Server & Client (9–14)

### 9. Server Component default — what can it do?

**Interview Answer:** `async/await`, DB/API on server, no client bundle for logic — no hooks, no `onClick`.

---

### 10. When `"use client"`?

**Interview Answer:** Hooks, events, browser APIs, most third-party interactive libs — at the **leaves**, not page root.

---

### 11. Children pattern?

**Interview Answer:** Server page passes server-rendered children into client shell — modal chrome is client, heavy content stays server.

---

### 12. Serialization across boundary?

**Interview Answer:** Props must be JSON-serializable — DTOs not ORM models; no functions across boundary.

---

### 13. Server Actions vs Route Handlers?

**Interview Answer:** Actions for UI mutations (forms). Route Handlers for webhooks, mobile REST, custom HTTP.

---

### 14. Context in App Router?

**Interview Answer:** Thin `"use client"` `Providers` wrapper in root layout — theme, query client — rest stays server.

---

## Caching & Data (15–22)

### 15. Is `fetch` cached by default in Next 16?

**Interview Answer:** **No** — dynamic at request time. Opt in with `"use cache"`.

---

### 16. What is `"use cache"`?

**Interview Answer:** Directive on page/layout/function to cache output — replaces implicit fetch cache and `unstable_cache`.

```tsx
"use cache";
import { cacheLife, cacheTag } from "next/cache";

export async function ProductList() {
  cacheLife("minutes");
  cacheTag("products");
  return /* ... */;
}
```

---

### 17. `cacheLife` vs `cacheTag`?

**Interview Answer:** `cacheLife` = how long stale is OK. `cacheTag` = name for invalidation.

---

### 18. `revalidateTag` vs `updateTag`?

**Interview Answer:** `updateTag` in Server Actions — user sees their write immediately. `revalidateTag(tag, profile)` — eventual consistency for bulk/admin updates.

---

### 19. `revalidatePath` vs tags?

**Interview Answer:** Path invalidates URL subtree. Tags invalidate data used across many routes — prefer tags at scale.

---

### 20. Avoid fetch waterfalls?

**Interview Answer:** `Promise.all` for independent server fetches; Suspense per slow widget; don't chain unrelated awaits.

---

### 21. `loading.tsx` vs Suspense?

**Interview Answer:** `loading.tsx` = whole route segment. Inline Suspense = granular skeletons on one page.

---

### 22. Async `params`, `cookies()`, `headers()`?

**Interview Answer:** All are **Promises** in Next 16 — always `await`. Sync access throws.

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}
```

---

## Routing, Auth & Deploy (23–28)

### 23. What is `proxy.ts`?

**Interview Answer:** Renamed middleware — network boundary for redirects, rewrites, coarse cookie checks. No heavy DB in proxy.

---

### 24. Protected routes pattern?

**Interview Answer:** Auth check in `(app)` layout Server Component — `redirect('/login')` before children fetch sensitive data.

---

### 25. Where to store session?

**Interview Answer:** httpOnly secure cookie — never JWT in `localStorage`. OAuth token exchange only on server.

---

### 26. `generateMetadata`?

**Interview Answer:** Server async SEO per route — title, OG images — can use cached product data.

---

### 27. `NEXT_PUBLIC_` env vars?

**Interview Answer:** Only prefix exposed to browser bundle — secrets stay server-only.

---

### 28. Docker / production deploy?

**Interview Answer:** `output: 'standalone'`, multi-stage Docker, `node server.js` — see [Docker/nextjs](../Docker/nextjs/).

---

## Next 16 & Migration (29–32)

### 29. Turbopack?

**Interview Answer:** Default bundler in 16 — faster dev and CI. `--webpack` fallback if plugin incompatible.

---

### 30. Edge vs Node runtime?

**Interview Answer:** Edge for light geo/latency handlers. Node for ORM, filesystem, most Server Actions.

---

### 31. Migrate 15 → 16 checklist?

**Interview Answer:** Codemod → await request APIs → `middleware` → `proxy` → `cacheComponents: true` → `revalidateTag(tag, profile)` → E2E auth/checkout.

---

### 32. When NOT Next.js?

**Interview Answer:** Pure static (Astro), heavy client-only realtime app, team won't adopt RSC boundaries — pick simpler tool.

---

## Quick Revision (60 seconds)

```
Server default · "use client" at leaves
Dynamic by default · "use cache" to opt in
updateTag = read-your-writes · revalidateTag = eventual
proxy.ts = cheap edge checks
await params, cookies, headers
Turbopack default · standalone Docker
```

---

_Deep dives: [NEXT/01-senior-mid-level-nextjs-16-interview-guide.md](../NEXT/01-senior-mid-level-nextjs-16-interview-guide.md) · [NEXT/02-nextjs-16-cache-components-interview.md](../NEXT/02-nextjs-16-cache-components-interview.md) · [React/22-nextjs-scenario-based-interview.md](../React/22-nextjs-scenario-based-interview.md)_
