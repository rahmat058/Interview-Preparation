---
title: "Top 30 Next.js 16 Interview Q&A"
description: "Quick-reference cheat sheet — 30 Next.js 16 questions with one-line interview answers for mid/senior rounds (4–5+ years)."
tags: ["nextjs", "nextjs-16", "interview", "cheat-sheet", "senior", "mid-level"]
level: "Mid-Level to Senior (4–5+ years)"
format: "Quick Q&A"
---

# Top 30 Next.js 16 Interview Q&A

**30 high-frequency questions** for mid/senior Next.js interviews — each with a **spoken one-liner** you can use in live rounds.

> Deep dives: [01-senior-mid-level-nextjs-16-interview-guide.md](./01-senior-mid-level-nextjs-16-interview-guide.md) · [02-nextjs-16-cache-components-interview.md](./02-nextjs-16-cache-components-interview.md)

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is Next.js?](#p1) |
| <span id="i2"></span>2 | [App Router vs Pages Router?](#p2) |
| <span id="i3"></span>3 | [What is a Server Component?](#p3) |
| <span id="i4"></span>4 | [What is a Client Component?](#p4) |
| <span id="i5"></span>5 | [When do you add `"use client"`?](#p5) |
| <span id="i6"></span>6 | [CSR vs SSR vs SSG in Next.js 16?](#p6) |
| <span id="i7"></span>7 | [What is PPR (Partial Pre-rendering)?](#p7) |
| <span id="i8"></span>8 | [`layout.tsx` vs `page.tsx`?](#p8) |
| <span id="i9"></span>9 | [What are Server Actions?](#p9) |
| <span id="i10"></span>10 | [Server Actions vs Route Handlers?](#p10) |
| <span id="i11"></span>11 | [Can a Client Component import a Server Component?](#p11) |
| <span id="i12"></span>12 | [What props can cross the server/client boundary?](#p12) |
| <span id="i13"></span>13 | [How do you handle loading states?](#p13) |
| <span id="i14"></span>14 | [How do you handle errors?](#p14) |
| <span id="i15"></span>15 | [What is `generateMetadata`?](#p15) |
| <span id="i16"></span>16 | [How do route groups work?](#p16) |
| <span id="i17"></span>17 | [What are parallel routes?](#p17) |
| <span id="i18"></span>18 | [What is `proxy.ts` in Next.js 16?](#p18) |
| <span id="i19"></span>19 | [How do you protect routes?](#p19) |
| <span id="i20"></span>20 | [Where do you store auth tokens?](#p20) |
| <span id="i21"></span>21 | [Is `fetch` cached by default in Next.js 16?](#p21) |
| <span id="i22"></span>22 | [What is `"use cache"`?](#p22) |
| <span id="i23"></span>23 | [`cacheLife` vs `cacheTag`?](#p23) |
| <span id="i24"></span>24 | [`revalidateTag` vs `updateTag`?](#p24) |
| <span id="i25"></span>25 | [How do you avoid fetch waterfalls?](#p25) |
| <span id="i26"></span>26 | [What changed with `params` in Next.js 16?](#p26) |
| <span id="i27"></span>27 | [What is Turbopack?](#p27) |
| <span id="i28"></span>28 | [How do you deploy Next.js in Docker?](#p28) |
| <span id="i29"></span>29 | [Edge vs Node runtime?](#p29) |
| <span id="i30"></span>30 | [How would you migrate from Next 15 to 16?](#p30) |

---
## Fundamentals (1–10)

<a id="p1"></a>

### 1. What is Next.js?

**Interview Answer:** Next.js is a full-stack React framework with file-based routing, Server Components, and built-in optimizations for SSR, streaming, caching, and deployment — I use it when SEO and server data colocation matter.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

### 2. App Router vs Pages Router?

**Interview Answer:** App Router is the default for new apps — Server Components, nested layouts, and Cache Components. Pages Router still works for legacy code; I'd migrate incrementally, not rewrite everything at once.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

### 3. What is a Server Component?

**Interview Answer:** A component that runs only on the server, can be async, accesses DB/secrets directly, and doesn't ship its logic in the client bundle — it's the App Router default.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

### 4. What is a Client Component?

**Interview Answer:** A component marked `"use client"` that hydrates in the browser — needed for hooks, events, and browser APIs. I keep it at the leaves, not the root.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

### 5. When do you add `"use client"`?

**Interview Answer:** When I need state, effects, event handlers, or browser APIs — otherwise I stay on the server.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

### 6. CSR vs SSR vs SSG in Next.js 16?

**Interview Answer:** I think in cache boundaries now — static segments use `"use cache"`, personalized pages stay dynamic, and heavy interactivity is client islands after server HTML streams.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

### 7. What is PPR (Partial Pre-rendering)?

**Interview Answer:** Ship a cached static shell instantly and stream dynamic holes — in Next 16 that's explicit via Cache Components and `"use cache"`, not accidental fetch caching.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

### 8. `layout.tsx` vs `page.tsx`?

**Interview Answer:** Layout wraps child routes and persists on navigation; page is the unique UI for that URL segment and owns route-specific data.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

### 9. What are Server Actions?

**Interview Answer:** Server functions invoked from the UI — usually forms — for mutations with progressive enhancement, CSRF protection, and cache invalidation via `updateTag`.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

### 10. Server Actions vs Route Handlers?

**Interview Answer:** Server Actions for UI mutations; Route Handlers for webhooks, mobile clients, and custom HTTP APIs.

---

## App Router & RSC (11–20)


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

### 11. Can a Client Component import a Server Component?

**Interview Answer:** No — that would pull server code into the client bundle. Server Components can import Client Components, and pass server-rendered children into client shells.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

### 12. What props can cross the server/client boundary?

**Interview Answer:** Serializable data only — plain objects, strings, numbers — no functions, class instances, or secrets. I map DB entities to DTOs on the server.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

### 13. How do you handle loading states?

**Interview Answer:** `loading.tsx` for route-level UI, or granular `<Suspense fallback={...}>` per slow widget — streaming beats one giant spinner.

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

### 14. How do you handle errors?

**Interview Answer:** `error.tsx` per segment with `reset()` — client component boundary. Use `notFound()` for 404, not the error boundary.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

### 15. What is `generateMetadata`?

**Interview Answer:** Async server function per route for SEO — title, description, Open Graph — runs on the server with access to cached or dynamic data.

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

### 16. How do route groups work?

**Interview Answer:** Folders in parentheses like `(marketing)` organize code and layouts without affecting the URL — great for separate auth shells.

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

### 17. What are parallel routes?

**Interview Answer:** `@slot` folders render multiple pages in one layout simultaneously — common pattern for modals alongside a list page.

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

### 18. What is `proxy.ts` in Next.js 16?

**Interview Answer:** Renamed middleware — the network boundary for redirects, rewrites, and coarse auth checks. Cheap operations only, not heavy DB logic.

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

### 19. How do you protect routes?

**Interview Answer:** Protected layout in a route group that reads session server-side and `redirect()` if unauthenticated — plus Server Action authorization on mutations.

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

### 20. Where do you store auth tokens?

**Interview Answer:** httpOnly secure cookies for session IDs — never JWT in localStorage. OAuth token exchange happens only in Route Handlers or Server Actions.

---

## Caching & Data (21–25)


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

### 21. Is `fetch` cached by default in Next.js 16?

**Interview Answer:** No — dynamic at request time by default. I opt in with `"use cache"` when staleness is acceptable.

---


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

### 22. What is `"use cache"`?

**Interview Answer:** Compiler directive marking a page, layout, or function as cacheable — replaces implicit fetch caching and `unstable_cache`.

---


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

### 23. `cacheLife` vs `cacheTag`?

**Interview Answer:** `cacheLife` sets how long cached output is valid; `cacheTag` names it for invalidation — TTL vs identity.

---


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

### 24. `revalidateTag` vs `updateTag`?

**Interview Answer:** `updateTag` in Server Actions for read-your-writes after user mutations; `revalidateTag(tag, profile)` for eventual consistency like admin bulk updates.

---


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

### 25. How do you avoid fetch waterfalls?

**Interview Answer:** `Promise.all` for independent server fetches, Suspense per slow segment, and colocate fetch where data is used.

---

## Production & Next 16 (26–30)


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

### 26. What changed with `params` in Next.js 16?

**Interview Answer:** `params` and `searchParams` are Promises — I `await` them in pages, layouts, and `generateMetadata`.

---


<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

### 27. What is Turbopack?

**Interview Answer:** Default bundler in Next 16 — faster dev refresh and production builds. I use `--webpack` only if a plugin blocks Turbopack.

---


<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

### 28. How do you deploy Next.js in Docker?

**Interview Answer:** `output: 'standalone'` in config, multi-stage Docker build, run `node server.js` — see our Docker/nextjs template.

---


<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

### 29. Edge vs Node runtime?

**Interview Answer:** Edge for low-latency light handlers; Node for ORMs, file system, and full npm ecosystem — most Server Actions stay on Node.

---


<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

### 30. How would you migrate from Next 15 to 16?

**Interview Answer:** Run the codemod, await all request APIs, rename middleware to proxy, enable `cacheComponents`, fix `revalidateTag` to two args, test auth/checkout E2E, canary deploy.

---

## Bonus — Rapid Fire

| Question                     | One line                                                           |
| ---------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_` env?          | Only prefix safe in client bundle                                  |
| `redirect()` vs `useRouter`? | `redirect` in Server Components/Actions; client router for SPA nav |
| `notFound()`?                | Triggers `not-found.tsx` for segment                               |
| React 19.2 in Next 16?       | View Transitions, `useEffectEvent`, Activity                       |
| When not to use Next.js?     | Pure static site (Astro), heavy client-only realtime app           |
| `template.tsx` vs `layout`?  | Template remounts on navigation; layout persists                   |
| `next/image` why?            | Responsive images, modern formats, CLS prevention                  |
| `next/font` why?             | Self-hosted fonts, no layout shift                                 |
| `revalidatePath`?            | Invalidate by URL path — use tags when data spans routes           |
| Minimum Node for 16?         | 20.9.0+                                                            |

---

_Practice aloud — 30 answers × 30 seconds ≈ 15-minute verbal drill before an interview._


<p><a href="#i30">Back to index</a></p>
