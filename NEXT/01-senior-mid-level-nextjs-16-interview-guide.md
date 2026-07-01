---
title: "Senior & Mid-Level Next.js 16 Interview Guide"
description: "20 Next.js 16 topics for 4–5+ YOE — App Router, rendering models, RSC, caching overview, proxy, Turbopack, auth, and production patterns."
tags:
  [
    "nextjs",
    "nextjs-16",
    "app-router",
    "rsc",
    "interview",
    "senior",
    "mid-level",
  ]
level: "Mid-Level to Senior (4–5+ years)"
---

# Senior & Mid-Level Next.js 16 Interview Guide

Practical Next.js questions for **mid-level** and **senior frontend/full-stack** roles (4–5+ years). Each section includes **what they're testing**, **theory**, **pros & cons**, a **real example**, and a **spoken interview answer**.

> Senior rounds go beyond "what is SSR" — they test **caching trade-offs**, **RSC boundaries**, **migration from Pages Router**, **production debugging**, and **when not to use Next.js**.

**Stack assumed:** Next.js **16.x**, App Router, React **19.2**, TypeScript, Turbopack.

---

<a id="quick-index"></a>

## Quick index


### Architecture & Rendering

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Why Next.js over CRA or Vite SPA?](#p1) |
| <span id="i2"></span>2 | [App Router vs Pages Router](#p2) |
| <span id="i3"></span>3 | [Rendering models: static, dynamic, PPR](#p3) |
| <span id="i4"></span>4 | [CSR vs SSR vs SSG in Next.js 16](#p4) |
| <span id="i5"></span>5 | [File-based routing conventions](#p5) |

### Server & Client Model

| # | Section |
| --- | --- |
| <span id="i6"></span>6 | [Server Components vs Client Components](#p6) |
| <span id="i7"></span>7 | [When to add `"use client"`](#p7) |
| <span id="i8"></span>8 | [Passing data from Server to Client Components](#p8) |
| <span id="i9"></span>9 | [Server Actions overview](#p9) |
| <span id="i10"></span>10 | [Route Handlers vs Server Actions](#p10) |

### Caching & Data (Next.js 16)

| # | Section |
| --- | --- |
| <span id="i11"></span>11 | [Dynamic by default in Next.js 16](#p11) |
| <span id="i12"></span>12 | [Cache Components at a high level](#p12) |
| <span id="i13"></span>13 | [`revalidateTag` vs `updateTag`](#p13) |

### Routing, Auth & Infra

| # | Section |
| --- | --- |
| <span id="i14"></span>14 | [`proxy.ts` (formerly middleware)](#p14) |
| <span id="i15"></span>15 | [Authentication patterns in App Router](#p15) |
| <span id="i16"></span>16 | [Metadata API & SEO](#p16) |
| <span id="i17"></span>17 | [Environment variables: server vs client](#p17) |

### Performance & Production

| # | Section |
| --- | --- |
| <span id="i18"></span>18 | [Turbopack in Next.js 16](#p18) |
| <span id="i19"></span>19 | [Deployment: standalone, Docker, edge](#p19) |
| <span id="i20"></span>20 | [When would you not choose Next.js?](#p20) |

---
## Architecture & Rendering

<a id="p1"></a>

### 1. Why Next.js over CRA or Vite SPA?

**What they test:** Whether you understand **full-stack React** trade-offs, not just framework hype.

**Theory**

| Concern           | Vite SPA                             | Next.js 16                               |
| ----------------- | ------------------------------------ | ---------------------------------------- |
| First paint / SEO | Client renders; poor SEO without SSR | Server HTML + streaming                  |
| Data fetching     | Client waterfalls common             | Colocated server fetch, parallel streams |
| Routing           | React Router (client)                | File-based App Router + layouts          |
| API layer         | Separate backend required            | Route Handlers + Server Actions          |
| Caching           | CDN for static assets only           | Explicit cache components + CDN          |
| Bundle to browser | Entire app JS                        | Server Components stay on server         |

**Pros & Cons**

| Next.js                             | Pure SPA                                    |
| ----------------------------------- | ------------------------------------------- |
| ✅ Better LCP, SEO, social previews | ✅ Simpler mental model                     |
| ✅ Unified deploy (Vercel, Node)    | ✅ No server runtime cost for static sites  |
| ✅ Progressive enhancement          | ❌ SEO needs extra work (prerender service) |
| ❌ Caching/rendering complexity     | ❌ Larger client bundles at scale           |

**Real Example**

E-commerce product listing: Next.js Server Component fetches catalog on the server, streams grid HTML, hydrates only the filter sidebar (`"use client"`). A Vite SPA would ship a blank shell until JS loads and fires `useEffect` fetches.

**Interview Answer**

> I pick Next.js when SEO, time-to-first-byte, and colocated server data matter — dashboards behind auth can stay more client-heavy, but public marketing and catalog pages benefit from Server Components and streaming. For a purely internal admin tool with no SEO, Vite SPA is still valid if the team wants less framework surface area.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

### 2. App Router vs Pages Router

**What they test:** Migration experience and whether you know **which router to use in 2026**.

**Theory**

| Feature           | Pages Router (`pages/`)                | App Router (`app/`)                                  |
| ----------------- | -------------------------------------- | ---------------------------------------------------- |
| Default component | Client (unless `getServerSideProps`)   | **Server Component**                                 |
| Layouts           | `_app.tsx` only                        | Nested `layout.tsx`                                  |
| Data fetching     | `getStaticProps`, `getServerSideProps` | `async` Server Components, `fetch`, cache directives |
| Loading UI        | Manual                                 | `loading.tsx`, Suspense                              |
| Errors            | `_error.tsx`                           | `error.tsx`, `global-error.tsx`                      |
| Status in Next 16 | Maintained, not default for new apps   | **Recommended**                                      |

**Interview Answer**

> New projects should use App Router — Server Components, layouts, and Cache Components are the investment path. Pages Router is fine for legacy apps; I'd migrate incrementally with route groups, not a big-bang rewrite. In interviews I explain the mental shift: pages default to client thinking; app defaults to server thinking.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

### 3. Rendering models: static, dynamic, PPR

**What they test:** Can you design a page for **mixed static + live** content?

**Theory**

```
Static shell (instant CDN) + dynamic holes (streamed at request time) = PPR
```

In Next.js 16 with `cacheComponents: true`:

- Uncached code runs **at request time** by default
- `"use cache"` opts **portions** into cached static output
- PPR ships the cached shell immediately; dynamic segments stream in

**Real Example — Product page**

```tsx
// app/products/[slug]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main>
      <CachedProductDetails slug={slug} /> {/* "use cache" */}
      <LiveInventory slug={slug} /> {/* dynamic hole */}
      <Reviews slug={slug} /> {/* Suspense stream */}
    </main>
  );
}
```

**Interview Answer**

> PPR is how I serve fast shells for marketing and product chrome while stock price or inventory streams in. In Next 16 that's explicit — I mark stable parts with `"use cache"` and leave live data uncached or behind Suspense.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

### 4. CSR vs SSR vs SSG in Next.js 16

**What they test:** Mapping business requirements to rendering — still asked even in RSC era.

| Model        | When                        | Next.js 16 mechanism                     |
| ------------ | --------------------------- | ---------------------------------------- |
| **SSG**      | Content rarely changes      | `"use cache"` + long `cacheLife`         |
| **SSR**      | Personalized / per-request  | No cache directive; dynamic fetch        |
| **CSR**      | Heavy interactivity, no SEO | Client Component + browser fetch         |
| **ISR-like** | Periodic refresh            | `cacheLife({ revalidate: 3600 })` + tags |

**Interview Answer**

> I don't think in Pages Router terms anymore — I ask "can this segment be cached, for how long, and how do I invalidate it?" Public blog posts get `"use cache"` with tags; account settings stay fully dynamic; charts and editors are Client Components with CSR after hydration.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

### 5. File-based routing conventions

**What they test:** Can you structure a real app without a routing cheat sheet?

| File            | Purpose                                    |
| --------------- | ------------------------------------------ |
| `page.tsx`      | Route UI (required for URL)                |
| `layout.tsx`    | Shared chrome, persists on navigation      |
| `loading.tsx`   | Instant loading UI (Suspense boundary)     |
| `error.tsx`     | Segment error boundary                     |
| `not-found.tsx` | 404 for segment                            |
| `route.ts`      | API Route Handler                          |
| `template.tsx`  | Re-mounts on navigation (animations)       |
| `(group)/`      | Organize without affecting URL             |
| `@modal/`       | Parallel routes (e.g. intercepting modals) |

**Interview Answer**

> Layouts own providers and nav; pages own route data. I use route groups for `(marketing)` vs `(dashboard)` auth boundaries, and parallel routes when I need a modal overlay URL like `/photos/123` while keeping `/photos` in the background.

---

## Server & Client Model


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

### 6. Server Components vs Client Components

**Theory**

|                            | Server Component       | Client Component              |
| -------------------------- | ---------------------- | ----------------------------- |
| Runs on                    | Server only            | Server (SSR) + browser        |
| Can use hooks              | ❌                     | ✅                            |
| Can use browser APIs       | ❌                     | ✅                            |
| Bundle impact              | **Not sent to client** | Sent to client                |
| `async/await` in component | ✅                     | ❌ (fetch in effects/actions) |

**Interview Answer**

> Server Components are the default — they access DB and secrets directly and don't bloat the bundle. Client Components are for interactivity: clicks, forms, subscriptions, browser APIs. Senior mistake: marking the whole tree `"use client"` and losing RSC benefits.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

### 7. When to add `"use client"`

**Checklist — add `"use client"` when you need:**

- `useState`, `useEffect`, `useReducer`, any hook
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`, `IntersectionObserver`)
- Third-party libs that use hooks internally

**Keep on server when:**

- Reading DB / calling internal APIs
- Rendering static or cacheable markup
- Composing children that are Client Components (server can import client)

**Interview Answer**

> I push `"use client"` to the leaves — a `AddToCartButton` client island inside a server `ProductCard`, not a client wrapper around the entire page.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

### 8. Passing data from Server to Client Components

**What they test:** Serialization rules — a common senior trap.

**Rules**

- Props must be **serializable** (JSON-like): no functions, class instances, `Date` (use ISO string), `Map`/`Set` (convert)
- Server → Client: pass plain objects
- Client → Server: Server Actions or Route Handlers (FormData / JSON)

```tsx
// app/products/product-card-client.tsx
"use client";

export function AddToCart({
  productId,
  price,
}: {
  productId: string;
  price: number;
}) {
  return <button onClick={() => addToCart(productId)}>Add — ${price}</button>;
}

// app/products/page.tsx — Server Component
import { AddToCart } from "./product-card-client";

export default async function Page() {
  const product = await getProduct("sku-1");
  return <AddToCart productId={product.id} price={product.price} />;
}
```

**Interview Answer**

> Only serializable props cross the boundary. I don't pass ORM models with methods — I map to DTOs on the server. For mutations I use Server Actions instead of callback props.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

### 9. Server Actions overview

**Theory**

- Async functions marked `"use server"` (file or inline)
- Run on server; invoked from forms or `startTransition`
- Integrate with `revalidatePath`, `revalidateTag`, `updateTag`
- CSRF protection built in (POST + origin checks)

```tsx
"use server";

import { revalidateTag } from "next/cache";

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  await db.user.update({ name });
  revalidateTag("profile", "max");
}
```

**Interview Answer**

> Server Actions are my default for mutations from the UI — less boilerplate than API routes, progressive enhancement with forms, and they pair with `updateTag` for read-your-writes. For public webhooks or mobile clients I still use Route Handlers.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

### 10. Route Handlers vs Server Actions

| Use Route Handler (`route.ts`)    | Use Server Action                          |
| --------------------------------- | ------------------------------------------ |
| REST API for mobile/third parties | Form mutations from your UI                |
| Webhooks (Stripe, GitHub)         | Colocated with the page that triggers them |
| Custom headers/status codes       | Revalidation after DB write                |
| GET endpoints consumed externally | Progressive enhancement                    |

**Interview Answer**

> Route Handlers are my HTTP surface area; Server Actions are my UI mutation layer. I don't expose Server Actions as a generic REST API.

---

## Caching & Data (Next.js 16)


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

### 11. Dynamic by default in Next.js 16

**What they test:** Understanding the **biggest mental model shift** from Next 13–15.

**Before (implicit):** `fetch()` in Server Components cached by default — surprised developers.

**Next.js 16:** All dynamic code runs at **request time** unless you opt in with `"use cache"`.

**Interview Answer**

> Next 16 aligns with developer intuition: dynamic unless I explicitly cache. I use `"use cache"` on stable reads and tags for invalidation — no more guessing whether `fetch` cached.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

### 12. Cache Components at a high level

See deep dive: [02-nextjs-16-cache-components-interview.md](./02-nextjs-16-cache-components-interview.md)

**Interview Answer**

> Cache Components let me cache pages, layouts, or async functions with `"use cache"`, `cacheLife` for TTL, and `cacheTag` for targeted invalidation — it's explicit PPR for production.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

### 13. `revalidateTag` vs `updateTag`

| API                           | Where                          | Behavior                                            |
| ----------------------------- | ------------------------------ | --------------------------------------------------- |
| `revalidateTag(tag, profile)` | Server Actions, Route Handlers | Marks cache stale; **eventual** consistency         |
| `updateTag(tag)`              | **Server Actions only**        | **Read-your-writes** — user sees update immediately |

**Interview Answer**

> After a user saves their profile I use `updateTag` so they don't hit stale cache. For admin bulk imports I use `revalidateTag` with a cache profile — eventual consistency is fine.

---

## Routing, Auth & Infra


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

### 14. `proxy.ts` (formerly middleware)

**Theory (Next.js 16)**

- `middleware.ts` renamed to **`proxy.ts`**
- Export `proxy` instead of `middleware`
- Runs on **Node.js** by default (clearer network boundary)
- Use for: redirects, rewrites, auth gating, geo headers — **not** heavy business logic

```ts
// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("session");
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

**Interview Answer**

> Proxy is the network edge of my app — cheap checks only. Session validation that hits the DB on every asset request is an anti-pattern; I do auth in layouts or Server Components for data routes.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

### 15. Authentication patterns in App Router

**Patterns**

| Approach                                  | Pros                             | Cons                             |
| ----------------------------------------- | -------------------------------- | -------------------------------- |
| **Auth.js (NextAuth)**                    | Sessions, OAuth, well documented | Config learning curve            |
| **Clerk / Auth0**                         | Hosted, fast setup               | Vendor lock-in                   |
| **Custom JWT + httpOnly cookie**          | Full control                     | You own rotation, CSRF           |
| **Proxy gate + Server Component session** | Simple apps                      | Must avoid client token exposure |

**Senior pattern**

1. httpOnly session cookie (no JWT in `localStorage`)
2. Read session in **Server Component** or Server Action
3. Proxy for coarse redirect; fine-grained RBAC in layout/page

**Interview Answer**

> I never put access tokens in Client Components. Session lives in httpOnly cookies, I read it server-side, and proxy only handles coarse redirects. RBAC checks happen where data is fetched.

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

### 16. Metadata API & SEO

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverUrl] },
  };
}
```

**Interview Answer**

> `generateMetadata` runs on the server per route — I use it for OG tags and Twitter cards. For thousands of pages I combine cached post data with `"use cache"` so metadata generation doesn't hammer the DB.

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

### 17. Environment variables: server vs client

| Prefix         | Exposed to browser | Use for                         |
| -------------- | ------------------ | ------------------------------- |
| None           | ❌ Server only     | DB URLs, API secrets            |
| `NEXT_PUBLIC_` | ✅                 | Public analytics keys, CDN URLs |

**Interview Answer**

> Only `NEXT_PUBLIC_` vars ship to the client bundle — I audit env usage in CI. Secrets stay in server components, Server Actions, and Route Handlers.

---

## Performance & Production


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

### 18. Turbopack in Next.js 16

**Theory**

- **Default** bundler for `next dev` and `next build`
- 2–5× faster production builds; faster Fast Refresh
- Opt out: `next build --webpack` if a plugin requires webpack

**Interview Answer**

> Turbopack is default in 16 — I'd only fall back to webpack for an incompatible custom plugin. For teams, the win is CI build time and dev feedback loops.

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

### 19. Deployment: standalone, Docker, edge

```js
// next.config.ts
const nextConfig = {
  output: "standalone", // minimal Node server for Docker/K8s
};
```

| Target                | When                                      |
| --------------------- | ----------------------------------------- |
| **Vercel**            | Zero-config, edge cache, previews         |
| **standalone Docker** | AWS ECS, Railway, on-prem                 |
| **Edge runtime**      | Low-latency geo reads — limited Node APIs |

**Interview Answer**

> Production Docker uses `output: 'standalone'` — copies only needed `node_modules`. I run Node for full APIs; edge is for latency-sensitive, IO-light handlers only.

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

### 20. When would you not choose Next.js?

**Strong signals to avoid or limit Next.js**

- Pure static site with no SSR needs → Astro, plain HTML
- Heavy real-time canvas/game → Vite SPA
- Team only knows Pages Router and won't adopt RSC
- Micro-frontend federation with incompatible boundaries

**Interview Answer**

> Next.js isn't free — caching and RSC boundaries have a learning cost. For a static docs site I'd pick Astro; for an internal realtime tool, Vite + React might ship faster. I choose Next when SSR, SEO, and unified full-stack React justify that complexity.

---

## Quick Revision Cheat Sheet

| Topic             | One line                                    |
| ----------------- | ------------------------------------------- |
| Default component | Server Component                            |
| Caching           | Dynamic by default; `"use cache"` to opt in |
| Mutations         | Server Actions + `updateTag`                |
| Public API        | Route Handlers                              |
| Edge redirect     | `proxy.ts`                                  |
| Bundler           | Turbopack (default)                         |
| Deploy            | `output: 'standalone'` for Docker           |
| Params/cookies    | `await` them (async)                        |

---

_Next: [02-nextjs-16-cache-components-interview.md](./02-nextjs-16-cache-components-interview.md) for caching deep dive._


<p><a href="#i20">Back to index</a></p>
