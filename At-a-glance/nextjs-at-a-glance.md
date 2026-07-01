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

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Architecture (1–8)](#p1) |
| <span id="i2"></span>2 | [Server & Client (9–14)](#p2) |
| <span id="i3"></span>3 | [Caching & Data (15–22)](#p3) |
| <span id="i4"></span>4 | [Routing, Auth & Deploy (23–28)](#p4) |
| <span id="i5"></span>5 | [Next 16 & Migration (29–32)](#p5) |

---
## Architecture (1–8)

<a id="p1"></a>

### 1. Why Next.js over Vite SPA?

**Interview Answer:** When I need SEO, server-rendered HTML, colocated data fetching, and built-in routing/deploy — Next.js. Internal tools with no SEO can stay Vite SPA.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

### 2. App Router vs Pages Router?

**Interview Answer:** App Router for all new work — Server Components, nested layouts, Cache Components. Pages Router for legacy; migrate incrementally.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

### 3. `layout.tsx` vs `page.tsx` vs `template.tsx`?

**Interview Answer:** Layout persists across child navigations. Page is the URL segment UI. Template remounts every navigation — use for enter/exit animations.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

### 4. Rendering: static, dynamic, PPR?

**Interview Answer:** Static/cached shell via `"use cache"`; dynamic holes stream per request. PPR = fast shell + streamed personalized parts.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

### 5. File conventions quick map?

**Interview Answer:** `page` = route UI, `layout` = wrapper, `loading` = Suspense fallback, `error` = error boundary, `route.ts` = API handler, `(group)` = org without URL change.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

### 6. Route groups — why?

**Interview Answer:** `(marketing)` vs `(app)` — different layouts and auth boundaries without `/marketing` in the URL.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

### 7. Parallel routes `@modal`?

**Interview Answer:** Render multiple pages in one layout — modal slot over list for shareable URLs with soft navigation UX.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

### 8. Intercepting routes?

**Interview Answer:** `(.)photo/[id]` shows modal on client nav from `/photos`, full page on hard refresh — better UX with same URL.

---

## Server & Client (9–14)


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

### 9. Server Component default — what can it do?

**Interview Answer:** `async/await`, DB/API on server, no client bundle for logic — no hooks, no `onClick`.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

### 10. When `"use client"`?

**Interview Answer:** Hooks, events, browser APIs, most third-party interactive libs — at the **leaves**, not page root.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

### 11. Children pattern?

**Interview Answer:** Server page passes server-rendered children into client shell — modal chrome is client, heavy content stays server.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

### 12. Serialization across boundary?

**Interview Answer:** Props must be JSON-serializable — DTOs not ORM models; no functions across boundary.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

### 13. Server Actions vs Route Handlers?

**Interview Answer:** Actions for UI mutations (forms). Route Handlers for webhooks, mobile REST, custom HTTP.

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

### 14. Context in App Router?

**Interview Answer:** Thin `"use client"` `Providers` wrapper in root layout — theme, query client — rest stays server.

---

## Caching & Data (15–22)


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

### 15. Is `fetch` cached by default in Next 16?

**Interview Answer:** **No** — dynamic at request time. Opt in with `"use cache"`.

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

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


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

### 17. `cacheLife` vs `cacheTag`?

**Interview Answer:** `cacheLife` = how long stale is OK. `cacheTag` = name for invalidation.

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

### 18. `revalidateTag` vs `updateTag`?

**Interview Answer:** `updateTag` in Server Actions — user sees their write immediately. `revalidateTag(tag, profile)` — eventual consistency for bulk/admin updates.

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

### 19. `revalidatePath` vs tags?

**Interview Answer:** Path invalidates URL subtree. Tags invalidate data used across many routes — prefer tags at scale.

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

### 20. Avoid fetch waterfalls?

**Interview Answer:** `Promise.all` for independent server fetches; Suspense per slow widget; don't chain unrelated awaits.

---


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

### 21. `loading.tsx` vs Suspense?

**Interview Answer:** `loading.tsx` = whole route segment. Inline Suspense = granular skeletons on one page.

---


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

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


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

### 23. What is `proxy.ts`?

**Interview Answer:** Renamed middleware — network boundary for redirects, rewrites, coarse cookie checks. No heavy DB in proxy.

---


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

### 24. Protected routes pattern?

**Interview Answer:** Auth check in `(app)` layout Server Component — `redirect('/login')` before children fetch sensitive data.

---


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

### 25. Where to store session?

**Interview Answer:** httpOnly secure cookie — never JWT in `localStorage`. OAuth token exchange only on server.

---


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

### 26. `generateMetadata`?

**Interview Answer:** Server async SEO per route — title, OG images — can use cached product data.

---


<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

### 27. `NEXT_PUBLIC_` env vars?

**Interview Answer:** Only prefix exposed to browser bundle — secrets stay server-only.

---


<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

### 28. Docker / production deploy?

**Interview Answer:** `output: 'standalone'`, multi-stage Docker, `node server.js` — see [Docker/nextjs](../Docker/nextjs/).

---

## Next 16 & Migration (29–32)


<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

### 29. Turbopack?

**Interview Answer:** Default bundler in 16 — faster dev and CI. `--webpack` fallback if plugin incompatible.

---


<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

### 30. Edge vs Node runtime?

**Interview Answer:** Edge for light geo/latency handlers. Node for ORM, filesystem, most Server Actions.

---


<p><a href="#i30">Back to index</a></p>

<a id="p31"></a>

### 31. Migrate 15 → 16 checklist?

**Interview Answer:** Codemod → await request APIs → `middleware` → `proxy` → `cacheComponents: true` → `revalidateTag(tag, profile)` → E2E auth/checkout.

---


<p><a href="#i31">Back to index</a></p>

<a id="p32"></a>

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


<p><a href="#i32">Back to index</a></p>
