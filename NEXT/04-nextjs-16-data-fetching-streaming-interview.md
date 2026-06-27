---
title: "Next.js 16 Data Fetching & Streaming Interview Guide"
description: "Parallel fetching, Suspense, loading.tsx, error boundaries, Server Actions, Route Handlers, and async request APIs for senior interviews."
tags:
  [
    "nextjs",
    "data-fetching",
    "suspense",
    "streaming",
    "server-actions",
    "interview",
    "senior",
  ]
level: "Senior (4–5+ years)"
---

# Next.js 16 Data Fetching & Streaming Interview Guide

Senior Next.js interviews often present a **slow dashboard** or **waterfall page** — this guide covers how to fix them in Next.js 16.

---

## Table of Contents

1. [Data fetching in Server Components](#1-data-fetching-in-server-components)
2. [Parallel vs sequential fetching](#2-parallel-vs-sequential-fetching)
3. [Streaming with Suspense](#3-streaming-with-suspense)
4. [`loading.tsx` vs inline Suspense](#4-loadingtsx-vs-inline-suspense)
5. [Error boundaries: `error.tsx`](#5-error-boundaries-errortsx)
6. [Server Actions deep dive](#6-server-actions-deep-dive)
7. [Route Handlers (`route.ts`)](#7-route-handlers-routets)
8. [Async `params` and `searchParams`](#8-async-params-and-searchparams)
9. [Async `cookies()` and `headers()`](#9-async-cookies-and-headers)
10. [Colocation vs data layer](#10-colocation-vs-data-layer)
11. [Senior scenario: fix a waterfall page](#11-senior-scenario-fix-a-waterfall-page)

---

## 1. Data fetching in Server Components

### Theory

Server Components can `await` data directly — no `useEffect`.

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch(`${process.env.API_URL}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}
```

**Next.js 16:** `fetch` is **not cached by default**. Use `"use cache"` or cache helpers for static reads.

### Interview Answer

> I colocate fetch with the component that needs the data. In Next 16 I explicitly cache stable reads — dynamic fetch is the default.

---

## 2. Parallel vs sequential fetching

### Waterfall (bad)

```tsx
export default async function Page() {
  const user = await getUser(); // 300ms
  const orders = await getOrders(); // 300ms — didn't need to wait for user
  const stats = await getStats(); // 300ms
  // Total: 900ms
}
```

### Parallel (good)

```tsx
export default async function Page() {
  const [user, orders, stats] = await Promise.all([
    getUser(),
    getOrders(),
    getStats(),
  ]);
  // Total: ~300ms (longest call)
}
```

### Dependent data (sequential when required)

```tsx
const user = await getUser();
const permissions = await getPermissions(user.id); // needs user.id
```

### Interview Answer

> I parallelize independent fetches with `Promise.all` and only sequence when there's a true data dependency. Waterfalls are the #1 Next.js performance smell in code review.

---

## 3. Streaming with Suspense

### Theory

Send HTML shell first; slow components stream when ready.

```tsx
import { Suspense } from "react";
import { UserHeader } from "./user-header";
import { OrdersTable } from "./orders-table";
import { TableSkeleton } from "@/components/skeletons";

export default function DashboardPage() {
  return (
    <main>
      <Suspense fallback={<TableSkeleton rows={3} />}>
        <UserHeader />
      </Suspense>
      <Suspense fallback={<TableSkeleton rows={10} />}>
        <OrdersTable />
      </Suspense>
    </main>
  );
}
```

### Pros & Cons

| Streaming                      | Single blocking await                     |
| ------------------------------ | ----------------------------------------- |
| ✅ Better LCP / perceived perf | ✅ Simpler code                           |
| ✅ Partial failure isolation   | ❌ User sees nothing until all data loads |

### Interview Answer

> Suspense boundaries are my perceived-performance tool — ship layout and fast widgets first, stream slow tables after.

---

## 4. `loading.tsx` vs inline Suspense

|                 | `loading.tsx`           | Inline `<Suspense>`          |
| --------------- | ----------------------- | ---------------------------- |
| Scope           | Entire route segment    | Granular within page         |
| File convention | Automatic boundary      | Manual control               |
| Use when        | Full-page loading state | Multiple independent widgets |

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
```

### Interview Answer

> `loading.tsx` for route-level spinners; inline Suspense when one page has fast and slow regions with different skeletons.

---

## 5. Error boundaries: `error.tsx`

```tsx
// app/dashboard/error.tsx
"use client"; // required for error boundaries

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

- `reset()` re-renders the segment
- Log `error.digest` server-side for correlation
- Use `notFound()` for 404 — not error boundary

### Interview Answer

> `error.tsx` is segment-scoped — a failing orders widget doesn't crash the whole dashboard if boundaries are split with Suspense + nested error files.

---

## 6. Server Actions deep dive

```tsx
// app/actions/cart.ts
"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCart(formData: FormData) {
  const productId = formData.get("productId") as string;
  const session = await getSession();
  await db.cart.addItem(session.userId, productId);
  updateTag(`cart-${session.userId}`);
}

export async function checkout() {
  await processCheckout();
  redirect("/order/success");
}
```

**Form integration (progressive enhancement)**

```tsx
import { addToCart } from "@/app/actions/cart";

export function AddToCartForm({ productId }: { productId: string }) {
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to cart</button>
    </form>
  );
}
```

### Interview Answer

> Server Actions give me mutations without API boilerplate, built-in POST semantics, and cache invalidation via `updateTag`. Forms work without JS — that's progressive enhancement.

---

## 7. Route Handlers (`route.ts`)

```tsx
// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  // handle event
  return NextResponse.json({ received: true });
}
```

| Server Action | Route Handler                  |
| ------------- | ------------------------------ |
| UI mutations  | Webhooks, REST, mobile clients |
| Form-centric  | Custom HTTP semantics          |

### Interview Answer

> Stripe webhooks and mobile apps consume Route Handlers; my React UI uses Server Actions. I don't expose actions as generic REST.

---

## 8. Async `params` and `searchParams`

### Breaking change (Next.js 15+ / 16)

Route props are **Promises** — must `await`.

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const product = await getProduct(id);
  return <ProductDetail product={product} activeTab={tab ?? "overview"} />;
}
```

### Interview Answer

> In Next 16 I always type `params` and `searchParams` as Promises and await them — sync access throws at runtime. Codemods handle migration from older codebases.

---

## 9. Async `cookies()` and `headers()`

```tsx
import { cookies, headers } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const hdrs = await headers();
  const country = hdrs.get("x-vercel-ip-country");
  // ...
}
```

**Dynamic APIs** — using these opts the route into dynamic rendering unless wrapped in cached segments that don't depend on them.

### Interview Answer

> `cookies()` and `headers()` are async and mark routes dynamic — I read session server-side and avoid calling them inside `"use cache"` segments.

---

## 10. Colocation vs data layer

| Approach                              | When                                             |
| ------------------------------------- | ------------------------------------------------ |
| **Colocated fetch** in page/component | Small/medium apps, clear ownership               |
| **`lib/data/` repository**            | Large teams, shared queries, testing             |
| **TanStack Query on client**          | Realtime, polling, optimistic UI after hydration |

### Interview Answer

> I start colocated, extract to `lib/data` when the same query appears in three places. Client-side React Query is for after-hydration interactivity — not a replacement for server fetch on public pages.

---

## 11. Senior scenario: fix a waterfall page

### Problem

Dashboard loads in 2.4s — sequential: user → teams → projects → activity.

### Solution

1. `Promise.all([getUser(), getTeams(), getActivity()])` for independent data
2. Projects fetched inside `ProjectsPanel` with own Suspense boundary
3. `"use cache"` on activity feed with 60s `cacheLife` if acceptable
4. Move date filter to client; pass `searchParams` to server refetch

### Interview Answer

> I'd profile server timings, parallelize independent calls, split slow panels into Suspense boundaries, and cache what's business-acceptable stale — target sub-800ms TTFB for the shell.

---

## Quick Revision

```
Parallel: Promise.all for independent fetches
Stream: Suspense per slow widget
Mutate: Server Actions + updateTag
External HTTP: Route Handlers
await params, searchParams, cookies(), headers()
fetch = dynamic by default in Next 16
```

---

_Related: [02-nextjs-16-cache-components-interview.md](./02-nextjs-16-cache-components-interview.md)_
