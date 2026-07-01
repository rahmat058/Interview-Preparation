---
title: "Next.js 16 Migration & Breaking Changes"
description: "Migrate from Next.js 15 to 16 — async APIs, proxy.ts, cache components, revalidateTag, Turbopack, and codemods for senior interviews."
tags:
  [
    "nextjs",
    "migration",
    "breaking-changes",
    "nextjs-16",
    "interview",
    "senior",
  ]
level: "Senior (4–5+ years)"
---

# Next.js 16 Migration & Breaking Changes Interview Guide

Lead and senior rounds ask: **"How would you upgrade a production app to Next.js 16?"** This guide covers breaking changes, codemods, and rollout strategy.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Next.js 16 headline changes](#p1) |
| <span id="i2"></span>2 | [Prerequisites & upgrade command](#p2) |
| <span id="i3"></span>3 | [Async request APIs](#p3) |
| <span id="i4"></span>4 | [`middleware.ts` → `proxy.ts`](#p4) |
| <span id="i5"></span>5 | [Caching model migration](#p5) |
| <span id="i6"></span>6 | [`revalidateTag` signature change](#p6) |
| <span id="i7"></span>7 | [Turbopack as default](#p7) |
| <span id="i8"></span>8 | [`next lint` removal](#p8) |
| <span id="i9"></span>9 | [Removed / deprecated APIs](#p9) |
| <span id="i10"></span>10 | [Rollout strategy for production](#p10) |
| <span id="i11"></span>11 | [Interview scenario: lead the upgrade](#p11) |

---

<a id="p1"></a>

## 1. Next.js 16 headline changes

| Change                            | Impact                                             |
| --------------------------------- | -------------------------------------------------- |
| **Cache Components**              | `"use cache"` replaces implicit `fetch` cache      |
| **Turbopack default**             | Builds use Turbopack unless `--webpack`            |
| **`proxy.ts`**                    | Renamed from `middleware.ts`                       |
| **Async request APIs**            | `params`, `searchParams`, `cookies()`, `headers()` |
| **`revalidateTag(tag, profile)`** | Second argument required                           |
| **`updateTag()`**                 | New — read-your-writes in Server Actions           |
| **Node 20.9+**                    | Minimum Node version                               |
| **React 19.2**                    | View Transitions, `useEffectEvent`                 |

### Interview Answer

> Next 16 is the explicit caching release — dynamic by default, opt-in `"use cache"`, plus async request APIs and proxy rename. I treat it as a mental model migration, not just a version bump.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Prerequisites & upgrade command

### Prerequisites

- Node.js **20.9.0+** (22 LTS recommended)
- React **19.x**
- TypeScript **5.1+**

### Upgrade

```bash
npx @next/codemod@latest upgrade latest
```

Or manual:

```bash
npm install next@latest react@latest react-dom@latest
```

### Interview Answer

> I run the official codemod in a branch, fix TypeScript errors from async APIs, then run E2E on critical flows before staging.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Async request APIs

### Before (sync — breaks in 16)

```tsx
export default function Page({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
}
```

### After

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
}
```

**Also async:**

```tsx
import { cookies, headers } from "next/headers";

const cookieStore = await cookies();
const hdrs = await headers();
```

### Interview Answer

> Every page and layout using `params`, `searchParams`, `cookies`, or `headers` gets awaited — the codemod handles most, I grep for stragglers in `generateMetadata` and route handlers.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. `middleware.ts` → `proxy.ts`

### Migration

```diff
- // middleware.ts
- export function middleware(request: NextRequest) {
+ // proxy.ts
+ export function proxy(request: NextRequest) {
    return NextResponse.next();
  }
```

- Rename file: `middleware.ts` → `proxy.ts`
- Rename export: `middleware` → `proxy`
- Default runtime: **Node.js** (was often Edge for middleware)

### Interview Answer

> Rename file and export — behavior stays similar but the name reflects "network boundary." I audit matchers so we don't run proxy on static assets unnecessarily.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Caching model migration

### Before (Next 14/15 mental model)

```tsx
// Implicit cache
const res = await fetch(url, { next: { revalidate: 60 } });

// unstable_cache
import { unstable_cache } from "next/cache";
const getData = unstable_cache(fetchData, ["key"], { revalidate: 60 });
```

### After (Next 16)

```ts
// next.config.ts
export default { cacheComponents: true };
```

```tsx
"use cache";

import { cacheLife, cacheTag } from "next/cache";

export async function getCatalog() {
  cacheLife("minutes");
  cacheTag("catalog");
  return db.product.findMany();
}
```

### Mapping table

| Old                                    | New                                 |
| -------------------------------------- | ----------------------------------- |
| `fetch` + `revalidate`                 | `"use cache"` + `cacheLife`         |
| `unstable_cache`                       | `"use cache"` on function           |
| `cache: 'no-store'` default workaround | Default dynamic — no opt-out needed |
| PPR `experimental.ppr`                 | `cacheComponents: true`             |

### Interview Answer

> I enable `cacheComponents`, convert cached routes to `"use cache"` with tags, and remove `unstable_cache` — then verify admin publish still invalidates correctly.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. `revalidateTag` signature change

### Before

```tsx
revalidateTag("products");
```

### After

```tsx
revalidateTag("products", "max");
```

Single-argument form → **TypeScript error** in Next 16.

### Interview Answer

> Grep for `revalidateTag(` and add the cache profile second argument — usually `'max'`. Miss this and CI fails on types, which is good.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Turbopack as default

### If build fails

1. Check incompatible webpack plugins (custom loaders, odd aliases)
2. Temporary: `next build --webpack`
3. Fix root cause or open issue upstream

```json
{
  "scripts": {
    "build": "next build",
    "build:webpack": "next build --webpack"
  }
}
```

### Interview Answer

> CI switches to Turbopack first — if a plugin blocks us, `--webpack` is a temporary bridge with a ticket to remove it.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. `next lint` removal

### Before

```json
{ "scripts": { "lint": "next lint" } }
```

### After

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

Codemod migrates scripts to ESLint or Biome directly.

### Interview Answer

> `next lint` is gone — we run ESLint directly in CI. Same rules, one less indirection.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Removed / deprecated APIs

| Removed / changed         | Replacement       |
| ------------------------- | ----------------- |
| Implicit `fetch` cache    | `"use cache"`     |
| `unstable_cache`          | `"use cache"`     |
| `experimental.ppr`        | `cacheComponents` |
| AMP support               | Remove AMP routes |
| Sync `params` / `cookies` | `await`           |
| `middleware` export name  | `proxy`           |

### Interview Answer

> I read the official upgrade guide and grep for deprecated APIs — `unstable_cache`, sync params, single-arg `revalidateTag`, AMP config.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Rollout strategy for production

### Phased rollout

| Phase | Action                                              |
| ----- | --------------------------------------------------- |
| 1     | Upgrade on feature branch + codemod                 |
| 2     | Fix TS errors, run unit + E2E tests                 |
| 3     | Staging deploy, smoke auth/checkout/CMS             |
| 4     | Enable `cacheComponents` on read-heavy routes first |
| 5     | Canary 5% traffic (if platform supports)            |
| 6     | Monitor errors, p75 LCP, cache hit rate             |
| 7     | Full rollout                                        |

### Rollback plan

- Pin `next@15.x` in package.json
- Feature flag `cacheComponents` off
- `--webpack` fallback for build

### Interview Answer

> I never big-bang production — staging first, canary if available, monitor error rate and LCP for 48 hours. Rollback is pinned Next 15 + webpack build script kept for one sprint.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Interview scenario: lead the upgrade

### Question

_"You have 200 routes on Next 15, 4 engineers, 2-week sprint. Plan the Next 16 upgrade."_

### Sample answer structure

1. **Week 1:** Codemod + async APIs + proxy rename on branch; CI green
2. **Parallel:** One engineer audits `revalidateTag` and caching; one runs Turbopack build
3. **Week 2:** `cacheComponents` on marketing + catalog only; keep dashboard dynamic
4. **Risk:** Auth flows and checkout E2E — full regression
5. **Docs:** Internal migration note for team
6. **Success metrics:** Build time ↓, no auth regression, cache invalidation tests pass

### Interview Answer

> I'd timebox discovery to two days, automate with codemods, migrate caching incrementally by route segment, and gate release on auth/checkout E2E — build time improvement is a bonus, not the primary success criterion.

---

## Quick Revision Checklist

```
□ Node 20.9+
□ npx @next/codemod upgrade latest
□ await params, searchParams, cookies(), headers()
□ middleware.ts → proxy.ts
□ cacheComponents: true
□ "use cache" replaces unstable_cache / implicit fetch cache
□ revalidateTag(tag, profile)
□ eslint . instead of next lint
□ Turbopack default — test build
□ E2E on auth, mutations, cache invalidation
```

---

_Related: [02-nextjs-16-cache-components-interview.md](./02-nextjs-16-cache-components-interview.md)_


<p><a href="#i11">Back to index</a></p>
