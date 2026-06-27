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

## Table of Contents

### Fundamentals (1–10)

### App Router & RSC (11–20)

### Caching & Data (21–25)

### Production & Next 16 (26–30)

---

## Fundamentals (1–10)

### 1. What is Next.js?

**Interview Answer:** Next.js is a full-stack React framework with file-based routing, Server Components, and built-in optimizations for SSR, streaming, caching, and deployment — I use it when SEO and server data colocation matter.

---

### 2. App Router vs Pages Router?

**Interview Answer:** App Router is the default for new apps — Server Components, nested layouts, and Cache Components. Pages Router still works for legacy code; I'd migrate incrementally, not rewrite everything at once.

---

### 3. What is a Server Component?

**Interview Answer:** A component that runs only on the server, can be async, accesses DB/secrets directly, and doesn't ship its logic in the client bundle — it's the App Router default.

---

### 4. What is a Client Component?

**Interview Answer:** A component marked `"use client"` that hydrates in the browser — needed for hooks, events, and browser APIs. I keep it at the leaves, not the root.

---

### 5. When do you add `"use client"`?

**Interview Answer:** When I need state, effects, event handlers, or browser APIs — otherwise I stay on the server.

---

### 6. CSR vs SSR vs SSG in Next.js 16?

**Interview Answer:** I think in cache boundaries now — static segments use `"use cache"`, personalized pages stay dynamic, and heavy interactivity is client islands after server HTML streams.

---

### 7. What is PPR (Partial Pre-rendering)?

**Interview Answer:** Ship a cached static shell instantly and stream dynamic holes — in Next 16 that's explicit via Cache Components and `"use cache"`, not accidental fetch caching.

---

### 8. `layout.tsx` vs `page.tsx`?

**Interview Answer:** Layout wraps child routes and persists on navigation; page is the unique UI for that URL segment and owns route-specific data.

---

### 9. What are Server Actions?

**Interview Answer:** Server functions invoked from the UI — usually forms — for mutations with progressive enhancement, CSRF protection, and cache invalidation via `updateTag`.

---

### 10. Server Actions vs Route Handlers?

**Interview Answer:** Server Actions for UI mutations; Route Handlers for webhooks, mobile clients, and custom HTTP APIs.

---

## App Router & RSC (11–20)

### 11. Can a Client Component import a Server Component?

**Interview Answer:** No — that would pull server code into the client bundle. Server Components can import Client Components, and pass server-rendered children into client shells.

---

### 12. What props can cross the server/client boundary?

**Interview Answer:** Serializable data only — plain objects, strings, numbers — no functions, class instances, or secrets. I map DB entities to DTOs on the server.

---

### 13. How do you handle loading states?

**Interview Answer:** `loading.tsx` for route-level UI, or granular `<Suspense fallback={...}>` per slow widget — streaming beats one giant spinner.

---

### 14. How do you handle errors?

**Interview Answer:** `error.tsx` per segment with `reset()` — client component boundary. Use `notFound()` for 404, not the error boundary.

---

### 15. What is `generateMetadata`?

**Interview Answer:** Async server function per route for SEO — title, description, Open Graph — runs on the server with access to cached or dynamic data.

---

### 16. How do route groups work?

**Interview Answer:** Folders in parentheses like `(marketing)` organize code and layouts without affecting the URL — great for separate auth shells.

---

### 17. What are parallel routes?

**Interview Answer:** `@slot` folders render multiple pages in one layout simultaneously — common pattern for modals alongside a list page.

---

### 18. What is `proxy.ts` in Next.js 16?

**Interview Answer:** Renamed middleware — the network boundary for redirects, rewrites, and coarse auth checks. Cheap operations only, not heavy DB logic.

---

### 19. How do you protect routes?

**Interview Answer:** Protected layout in a route group that reads session server-side and `redirect()` if unauthenticated — plus Server Action authorization on mutations.

---

### 20. Where do you store auth tokens?

**Interview Answer:** httpOnly secure cookies for session IDs — never JWT in localStorage. OAuth token exchange happens only in Route Handlers or Server Actions.

---

## Caching & Data (21–25)

### 21. Is `fetch` cached by default in Next.js 16?

**Interview Answer:** No — dynamic at request time by default. I opt in with `"use cache"` when staleness is acceptable.

---

### 22. What is `"use cache"`?

**Interview Answer:** Compiler directive marking a page, layout, or function as cacheable — replaces implicit fetch caching and `unstable_cache`.

---

### 23. `cacheLife` vs `cacheTag`?

**Interview Answer:** `cacheLife` sets how long cached output is valid; `cacheTag` names it for invalidation — TTL vs identity.

---

### 24. `revalidateTag` vs `updateTag`?

**Interview Answer:** `updateTag` in Server Actions for read-your-writes after user mutations; `revalidateTag(tag, profile)` for eventual consistency like admin bulk updates.

---

### 25. How do you avoid fetch waterfalls?

**Interview Answer:** `Promise.all` for independent server fetches, Suspense per slow segment, and colocate fetch where data is used.

---

## Production & Next 16 (26–30)

### 26. What changed with `params` in Next.js 16?

**Interview Answer:** `params` and `searchParams` are Promises — I `await` them in pages, layouts, and `generateMetadata`.

---

### 27. What is Turbopack?

**Interview Answer:** Default bundler in Next 16 — faster dev refresh and production builds. I use `--webpack` only if a plugin blocks Turbopack.

---

### 28. How do you deploy Next.js in Docker?

**Interview Answer:** `output: 'standalone'` in config, multi-stage Docker build, run `node server.js` — see our Docker/nextjs template.

---

### 29. Edge vs Node runtime?

**Interview Answer:** Edge for low-latency light handlers; Node for ORMs, file system, and full npm ecosystem — most Server Actions stay on Node.

---

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
