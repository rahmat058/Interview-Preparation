---
title: "Next.js 16 Cache Components Interview Guide"
description: "Deep dive on Cache Components — use cache, cacheLife, cacheTag, updateTag, revalidateTag, PPR, and invalidation strategies for senior interviews."
tags:
  ["nextjs", "nextjs-16", "caching", "ppr", "use-cache", "interview", "senior"]
level: "Senior (4–5+ years)"
---

# Next.js 16 Cache Components Interview Guide

Next.js 16 replaces **implicit fetch caching** with **explicit Cache Components**. This is the #1 topic senior interviewers ask after "explain Server Components."

Each section: **Theory** → **Pros & Cons** → **Real Example** → **Interview Answer**.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Why implicit caching failed](#p1) |
| <span id="i2"></span>2 | [Enabling Cache Components](#p2) |
| <span id="i3"></span>3 | [The `"use cache"` directive](#p3) |
| <span id="i4"></span>4 | [`cacheLife()` — TTL profiles](#p4) |
| <span id="i5"></span>5 | [`cacheTag()` — tagging cached output](#p5) |
| <span id="i6"></span>6 | [`revalidateTag(tag, profile)`](#p6) |
| <span id="i7"></span>7 | [`updateTag()` — read-your-writes](#p7) |
| <span id="i8"></span>8 | [`revalidatePath()` vs tag invalidation](#p8) |
| <span id="i9"></span>9 | [PPR: static shell + dynamic holes](#p9) |
| <span id="i10"></span>10 | [Caching anti-patterns](#p10) |
| <span id="i11"></span>11 | [Migration from `unstable_cache` / ISR](#p11) |
| <span id="i12"></span>12 | [Senior scenario: e-commerce catalog](#p12) |

---

<a id="p1"></a>

## 1. Why implicit caching failed

### Theory

In Next.js 13–15 App Router, `fetch()` in Server Components was cached by default unless you opted out with `{ cache: 'no-store' }`. Developers shipped bugs because:

- Stale dashboards after mutations
- Unpredictable behavior between dev and prod
- Hard to reason about what revalidated when

### Next.js 16 model

> **Dynamic at request time by default.** Opt in to caching with `"use cache"`.

### Interview Answer

> Implicit caching taught bad habits — teams didn't know if data was live or stale. Next 16 makes caching a deliberate design choice with `"use cache"`, tags, and profiles — same mental model as Redis or CDN cache keys.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Enabling Cache Components

### Theory

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

This activates:

- `"use cache"` directive support
- PPR-style static shell + dynamic streaming
- New cache invalidation APIs

### Interview Answer

> I enable `cacheComponents` in config and migrate route-by-route. It's the foundation for PPR and explicit caching in Next 16 — not an experimental flag anymore.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. The `"use cache"` directive

### Theory

Place at the top of a **page**, **layout**, or **async function** to mark it cacheable. The compiler generates cache keys from:

- Build ID
- Function/module identity
- Serializable arguments (for cached functions)

### Real Example — cached product list

```tsx
// app/products/cached-product-grid.tsx
"use cache";

import { cacheLife, cacheTag } from "next/cache";

async function getProducts(category: string) {
  cacheLife("hours");
  cacheTag("products", `category-${category}`);
  const res = await fetch(`${process.env.API_URL}/products?cat=${category}`);
  return res.json();
}

export async function CachedProductGrid({ category }: { category: string }) {
  const products = await getProducts(category);
  return (
    <ul>
      {products.map((p: { id: string; name: string }) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### Pros & Cons

| Explicit `"use cache"`    | No directive (dynamic)   |
| ------------------------- | ------------------------ |
| ✅ Fast repeat requests   | ✅ Always fresh          |
| ✅ CDN-friendly           | ✅ Simpler debugging     |
| ❌ Must plan invalidation | ❌ Higher TTFB / DB load |

### Interview Answer

> I add `"use cache"` only where staleness is acceptable and measurable — product catalogs, marketing copy, CMS content. User-specific dashboards stay dynamic.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. `cacheLife()` — TTL profiles

### Theory

`define cache lifetime` without magic numbers scattered in code.

```tsx
"use cache";

import { cacheLife } from "next/cache";

export async function BlogSidebar() {
  cacheLife("days"); // built-in profile
  // or custom:
  // cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  const tags = await getPopularTags();
  return <TagCloud tags={tags} />;
}
```

Built-in profiles (conceptual): `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`.

### Interview Answer

> `cacheLife` documents intent — "this can be stale for an hour" — better than anonymous `revalidate: 3600` on fetch. I align profiles with business SLAs.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. `cacheTag()` — tagging cached output

### Theory

Tags group cache entries for **targeted invalidation** instead of flushing entire paths.

```tsx
"use cache";

import { cacheTag } from "next/cache";

export async function getUserProfile(userId: string) {
  cacheTag("user", `user-${userId}`);
  return db.user.findUnique({ where: { id: userId } });
}
```

### Interview Answer

> Tags are my cache keys at the domain level — `products`, `product-123`, `category-shoes`. When an admin updates one SKU I invalidate `product-123`, not the whole site.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. `revalidateTag(tag, profile)`

### Theory

**Breaking change in Next.js 16:** `revalidateTag(tag)` requires a **second argument** — cache profile (e.g. `'max'`).

```tsx
"use server";

import { revalidateTag } from "next/cache";

export async function publishPost(postId: string) {
  await db.post.publish(postId);
  revalidateTag(`post-${postId}`, "max");
  revalidateTag("posts-list", "max");
}
```

| Behavior               | Meaning                                    |
| ---------------------- | ------------------------------------------ |
| Stale-while-revalidate | Users may see old content briefly          |
| Good for               | Bulk updates, CMS publishes, admin actions |

### Interview Answer

> `revalidateTag` with a profile is eventual consistency — fine for catalog updates. I always pass the profile argument; the single-arg form is a migration footgun in Next 16.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. `updateTag()` — read-your-writes

### Theory

**Server Actions only.** Immediately expires cache so the **same user** sees fresh data after a mutation — no stale flash.

```tsx
"use server";

import { updateTag } from "next/cache";

export async function saveUserSettings(formData: FormData) {
  const userId = await getSessionUserId();
  await db.user.update({ where: { id: userId }, data: { ... } });
  updateTag(`user-${userId}`);
}
```

|             | `updateTag`            | `revalidateTag`            |
| ----------- | ---------------------- | -------------------------- |
| Where       | Server Actions only    | Actions + Route Handlers   |
| Consistency | Read-your-writes       | Eventual                   |
| Use case    | User edits own profile | Admin updates many records |

### Interview Answer

> If the user saves settings and still sees old data, that's a trust bug — I use `updateTag`. For background jobs affecting thousands of rows, `revalidateTag` is enough.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. `revalidatePath()` vs tag invalidation

### Theory

| API                       | Granularity        | When                          |
| ------------------------- | ------------------ | ----------------------------- |
| `revalidatePath('/blog')` | Entire URL subtree | Simple apps, path-owned cache |
| `revalidateTag('post-1')` | Cross-route by tag | Shared data on many pages     |

```tsx
import { revalidatePath } from "next/cache";

export async function deleteComment() {
  await db.comment.delete(...);
  revalidatePath("/posts/[slug]", "page"); // optional type: layout | page
}
```

### Interview Answer

> I prefer tags when one entity appears on list + detail + search pages. `revalidatePath` is a hammer — fine for small apps, risky at scale.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. PPR: static shell + dynamic holes

### Theory

```
Request → CDN serves cached shell instantly
       → Server streams dynamic holes (Suspense)
       → Client hydrates interactive islands
```

With Cache Components:

- Cached layout/nav/footer via `"use cache"`
- Uncached `children` or explicit dynamic components stream in

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <CachedHeader /> {/* "use cache" */}
        {children} {/* may stream */}
        <CachedFooter />
      </body>
    </html>
  );
}
```

### Interview Answer

> PPR is the production pattern for "fast everywhere" — marketing shell from cache, personalized recommendations stream in. Next 16 makes that explicit instead of accidental.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Caching anti-patterns

| Anti-pattern                             | Why it's bad           | Fix                                     |
| ---------------------------------------- | ---------------------- | --------------------------------------- |
| Cache user-specific data with shared key | Data leak across users | Keep dynamic or key by `userId`         |
| `"use cache"` on auth/session            | Stale auth state       | Dynamic session reads                   |
| No invalidation strategy                 | Silent stale UI        | Tags + `updateTag` on writes            |
| Cache in Client Component                | Not supported          | Server-side cache only                  |
| Proxy + full DB auth on every request    | Latency                | Session in edge cookie; validate in RSC |

### Interview Answer

> The worst bug is caching personalized data without user-scoped keys — I audit cache keys in code review the same way I audit SQL queries.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Migration from `unstable_cache` / ISR

### Mapping

| Old (13–15)                                | New (16)                           |
| ------------------------------------------ | ---------------------------------- |
| `fetch(url, { next: { revalidate: 60 } })` | `"use cache"` + `cacheLife`        |
| `unstable_cache(fn, keys, opts)`           | `"use cache"` on async function    |
| `revalidateTag('tag')` one arg             | `revalidateTag('tag', 'max')`      |
| Implicit static pages                      | Explicit `"use cache"` on segments |

### Interview Answer

> I run the Next 16 codemod, enable `cacheComponents`, replace `unstable_cache` with `"use cache"`, and fix `revalidateTag` call sites — then verify with integration tests on publish flows.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Senior scenario: e-commerce catalog

### Description

10k SKUs, admin updates prices hourly, users need accurate cart totals, catalog can be 5 minutes stale.

### Architecture

| Segment               | Strategy                                                |
| --------------------- | ------------------------------------------------------- |
| Category nav          | `"use cache"` + `cacheLife("hours")`                    |
| Product grid          | `"use cache"` + tag `products` + `cacheLife("minutes")` |
| Cart / checkout       | Fully dynamic                                           |
| Admin price update    | `revalidateTag('products', 'max')`                      |
| User changes quantity | `updateTag` on `cart-{userId}` via Server Action        |

### Interview Answer

> I'd cache the catalog with tags and minute-level TTL, keep cart/checkout dynamic, use `revalidateTag` when admin bulk-updates prices, and `updateTag` when the user mutates their cart so they never see wrong totals.

---

## Quick Revision

```
Dynamic by default → "use cache" to opt in
cacheLife() → TTL
cacheTag() → invalidation groups
updateTag() → user just wrote data (Server Actions)
revalidateTag(tag, profile) → eventual consistency
Never cache auth/session without user-scoped keys
```

---

_Related: [04-nextjs-16-data-fetching-streaming-interview.md](./04-nextjs-16-data-fetching-streaming-interview.md)_


<p><a href="#i12">Back to index</a></p>
