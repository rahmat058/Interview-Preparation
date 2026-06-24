---
title: "Next.js Scenario-Based Interview Questions"
description: "10 real-world Next.js interview scenarios — slow pages, live data, bundle size, caching, 10K blog posts, lazy charts, file uploads, API scale, SPA migration, and A/B testing."
tags: ["nextjs", "react", "ssr", "ssg", "performance", "caching", "interview"]
level: "Mid to Senior"
---

# Next.js Scenario-Based Interview Questions

Real interview scenarios for **Next.js 13+ (App Router)** with **Theory**, **Description**, **Pros & Cons**, **Real Examples**, and **Interview Answers**.

Assumed stack: **Next.js 14/15**, **App Router**, **React Server Components**, **Route Handlers**, **Vercel** or similar deployment.

---

## Table of Contents

1. [Slow page — multiple API fetches](#1-a-nextjs-page-is-loading-slowly-because-it-fetches-data-from-multiple-apis-how-would-you-optimize-the-page-performance)
2. [Stock market data — SSR vs SSG vs CSR](#2-you-need-to-display-frequently-changing-stock-market-data-on-a-page-would-you-use-ssr-ssg-or-csr-why)
3. [Large JavaScript bundle](#3-your-nextjs-application-has-a-large-javascript-bundle-size-affecting-performance-how-would-you-reduce-it)
4. [Server-side caching](#4-you-need-to-implement-server-side-caching-to-reduce-api-calls-how-would-you-approach-it)
5. [10,000 blog posts](#5-your-application-has-10000-blog-posts-how-would-you-generate-and-serve-these-pages-efficiently)
6. [Heavy chart library — lazy load](#6-a-page-contains-a-heavy-chart-library-that-is-only-needed-after-user-interaction-how-would-you-optimize-the-loading-strategy)
7. [Large file upload to cloud storage](#7-you-need-to-upload-large-files-from-the-frontend-to-a-cloud-storage-service-how-would-you-implement-the-flow-in-nextjs)
8. [High-volume API routes](#8-your-api-routes-are-receiving-a-high-volume-of-requests-how-would-you-improve-scalability-and-performance)
9. [Migrating React SPA to Next.js](#9-you-are-migrating-a-react-spa-to-nextjs-what-challenges-would-you-expect-and-how-would-you-handle-them)
10. [A/B testing](#10-how-would-you-implement-ab-testing-in-a-nextjs-application)
11. [Quick Revision Cheat Sheet](#11-quick-revision-cheat-sheet)

---

## 1. A Next.js page is loading slowly because it fetches data from multiple APIs. How would you optimize the page performance?

### Description

The page blocks on **sequential** or **waterfall** API calls — each request waits for the previous one. Time to first byte (TTFB) and Largest Contentful Paint (LCP) suffer when the server or client chains 4–5 fetches.

### Theory

In the App Router, **Server Components** fetch on the server by default. The main levers are:

| Technique                | What it does                                                             |
| ------------------------ | ------------------------------------------------------------------------ |
| **Parallel fetching**    | `Promise.all` — independent APIs run at the same time                    |
| **Streaming + Suspense** | Ship shell HTML first; slow sections stream in                           |
| **Colocate data**        | Fetch in the component that needs it (automatic dedup via `fetch` cache) |
| **Move to edge**         | `export const runtime = 'edge'` for low-latency reads                    |
| **Reduce payload**       | Return only fields the page needs                                        |
| **Cache stable data**    | `fetch(url, { next: { revalidate: 60 } })`                               |

**Waterfall (slow)**

```text
User → Page → API A (400ms) → API B (300ms) → API C (350ms) = 1050ms
```

**Parallel (fast)**

```text
User → Page → API A ─┐
              API B ─┼→ merge → 400ms (longest call)
              API C ─┘
```

### Pros & Cons

| Parallel + streaming             | One giant blocking fetch           |
| -------------------------------- | ---------------------------------- |
| ✅ Faster perceived load         | ❌ More complex loading UI         |
| ✅ Better Core Web Vitals        | ❌ Harder to debug race conditions |
| ✅ Partial content visible early | ❌ Needs Suspense boundaries       |

### Real Example — Dashboard with user, orders, and notifications

```tsx
// app/dashboard/page.tsx — Server Component
import { Suspense } from "react";
import { UserHeader } from "./user-header";
import { OrdersPanel } from "./orders-panel";
import { NotificationsPanel } from "./notifications-panel";
import { PanelSkeleton } from "@/components/panel-skeleton";

// Independent parallel fetches inside each child — no waterfall
export default function DashboardPage() {
  return (
    <main>
      <Suspense fallback={<PanelSkeleton />}>
        <UserHeader />
      </Suspense>
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<PanelSkeleton />}>
          <OrdersPanel />
        </Suspense>
        <Suspense fallback={<PanelSkeleton />}>
          <NotificationsPanel />
        </Suspense>
      </div>
    </main>
  );
}
```

```tsx
// app/dashboard/orders-panel.tsx
async function getOrders(userId: string) {
  const res = await fetch(`${process.env.API_URL}/orders?userId=${userId}`, {
    next: { revalidate: 30, tags: ["orders"] },
  });
  return res.json();
}

export async function OrdersPanel() {
  const session = await getSession(); // deduped if same fetch elsewhere
  const orders = await getOrders(session.userId);
  return <OrderList orders={orders} />;
}
```

```tsx
// When you MUST combine in one file — parallel, not sequential
export async function AnalyticsPage() {
  const [revenue, users, churn] = await Promise.all([
    fetchRevenue(),
    fetchUsers(),
    fetchChurn(),
  ]);

  return <Analytics revenue={revenue} users={users} churn={churn} />;
}
```

**Also apply**

- `loading.tsx` for route-level skeleton
- React Query / SWR on **client** islands only for interactive refetch
- Measure with Lighthouse + Next.js Speed Insights

### Interview Answer

> I'd eliminate request waterfalls by parallelizing independent fetches with `Promise.all`, split the page into Server Components with Suspense boundaries for streaming, cache semi-static API responses with `revalidate`, and measure TTFB and LCP before and after.

---

## 2. You need to display frequently changing stock market data on a page. Would you use SSR, SSG, or CSR? Why?

### Description

Stock prices change **every second** (or faster). Pre-rendered HTML from build time (SSG) is stale immediately. The choice depends on **freshness vs SEO vs interactivity**.

### Theory

| Strategy   | Freshness                         | Best for stock data?                           |
| ---------- | --------------------------------- | ---------------------------------------------- |
| **SSG**    | Stale until rebuild               | ❌ Wrong for live prices                       |
| **SSR**    | Fresh per request                 | ⚠️ OK for initial snapshot, expensive at scale |
| **CSR**    | Fresh via client fetch/WebSocket  | ✅ Best for live ticks                         |
| **Hybrid** | SSR shell + CSR/WebSocket updates | ✅ **Recommended**                             |

**Recommended pattern:** SSR (or static shell) for layout + SEO metadata, then **client-side polling or WebSocket** for live quotes.

### Pros & Cons

| Hybrid (SSR shell + client stream) | Pure SSR every tick                      |
| ---------------------------------- | ---------------------------------------- |
| ✅ Fast first paint, live updates  | ❌ Server hammered on every price change |
| ✅ Scales via CDN for static parts | ❌ High TTFB under load                  |
| ❌ Client JS required for numbers  | ❌ No benefit over WebSocket             |

### Real Example — NSE / trading dashboard

```tsx
// app/markets/page.tsx — Server Component: static shell + initial snapshot
export const dynamic = "force-dynamic"; // or short revalidate

async function getMarketSnapshot() {
  const res = await fetch(`${process.env.API_URL}/quotes/snapshot`, {
    cache: "no-store", // always fresh on each page load
  });
  return res.json();
}

export default async function MarketsPage() {
  const snapshot = await getMarketSnapshot();

  return (
    <main>
      <h1>Live Markets</h1>
      {/* Client island — WebSocket updates after hydration */}
      <LiveTicker initialQuotes={snapshot.quotes} />
    </main>
  );
}
```

```tsx
// components/live-ticker.tsx — Client Component
"use client";

import { useEffect, useState } from "react";

export function LiveTicker({ initialQuotes }) {
  const [quotes, setQuotes] = useState(initialQuotes);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setQuotes((prev) => mergeQuote(prev, update));
    };

    return () => ws.close();
  }, []);

  return (
    <table>
      <tbody>
        {quotes.map((q) => (
          <tr key={q.symbol}>
            <td>{q.symbol}</td>
            <td>{q.price}</td>
            <td className={q.change >= 0 ? "text-green" : "text-red"}>
              {q.changePercent}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Why not SSG?** Build-time prices are wrong the moment the user opens the page.

**Why not pure CSR?** You lose fast meaningful HTML and SEO for `/markets` landing.

### Interview Answer

> I'd use a hybrid: SSR or dynamic rendering for the initial snapshot and page shell, then WebSocket or short-interval client polling for live ticks — not SSG, and not SSR on every price change.

---

## 3. Your Next.js application has a large JavaScript bundle size affecting performance. How would you reduce it?

### Description

Large bundles increase **download, parse, and execute** time — hurting LCP and Interaction to Next Paint (INP). Next.js helps by default with Server Components, but client islands and dependencies can still bloat the bundle.

### Theory

| Technique                    | Impact                                                 |
| ---------------------------- | ------------------------------------------------------ |
| **Server Components**        | Keep heavy logic/libraries on server — zero client JS  |
| **`next/dynamic`**           | Lazy-load client components                            |
| **`optimizePackageImports`** | Tree-shake barrel files (lodash, MUI, etc.)            |
| **Analyze bundle**           | `@next/bundle-analyzer`                                |
| **Replace heavy libs**       | `date-fns` over `moment`, `recharts` only where needed |
| **`next/image`**             | Avoid shipping image processing to client              |
| **Route-based splitting**    | Automatic per-route chunks in App Router               |

### Pros & Cons

| Aggressive code splitting        | Single large bundle     |
| -------------------------------- | ----------------------- |
| ✅ Faster initial load           | ✅ Simpler imports      |
| ✅ Better mobile performance     | ❌ Poor Core Web Vitals |
| ❌ More loading states to design | ❌ Higher bounce rate   |

### Real Example

```js
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  experimental: {
    optimizePackageImports: ["lodash-es", "@mui/material", "lucide-react"],
  },
});
```

```tsx
// ❌ Heavy chart in main bundle
import { LineChart } from "recharts";

// ✅ Lazy load only when tab opens
import dynamic from "next/dynamic";

const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
```

```tsx
// Prefer Server Component for data — no client JS for fetch logic
// app/reports/page.tsx
import { HeavyDataTable } from "./heavy-data-table"; // Server Component

export default async function ReportsPage() {
  const data = await getReportData(); // runs on server only
  return <HeavyDataTable rows={data} />;
}
```

```bash
# Find what's heavy
ANALYZE=true npm run build
```

**Targets (rule of thumb)**

- First-load JS shared chunk: **< 100–150 KB** gzipped where possible
- Audit `import` from package roots — use direct paths or `optimizePackageImports`

### Interview Answer

> I'd analyze the bundle with `@next/bundle-analyzer`, push data fetching and non-interactive UI to Server Components, dynamically import heavy client libraries, enable `optimizePackageImports`, and replace or defer dependencies that don't need to be in the critical path.

---

## 4. You need to implement server-side caching to reduce API calls. How would you approach it?

### Description

Repeated identical upstream API calls waste latency and cost. Next.js offers **multiple cache layers** — choosing the right one depends on how often data changes and whether it's per-user or global.

### Theory

| Layer                   | Mechanism                              | Scope                     |
| ----------------------- | -------------------------------------- | ------------------------- |
| **Request memoization** | Same `fetch` in one render tree        | Single request            |
| **Data Cache**          | `fetch` with `cache` / `revalidate`    | Cross-request, persistent |
| **Full Route Cache**    | Static pages at build time             | Static routes             |
| **Router Cache**        | Client-side RSC payload cache          | Navigation                |
| **Redis / CDN**         | External cache in Route Handler or BFF | Production scale          |

**`revalidate` options**

```tsx
fetch(url, { cache: "force-cache" }); // default — cache until invalidated
fetch(url, { next: { revalidate: 60 } }); // ISR — refresh every 60s
fetch(url, { cache: "no-store" }); // never cache
fetch(url, { next: { tags: ["products"] } }); // on-demand invalidation
```

### Pros & Cons

| Cached reads                      | Always fresh (`no-store`)     |
| --------------------------------- | ----------------------------- |
| ✅ Lower latency, fewer API bills | ✅ Simplest mental model      |
| ✅ Survives traffic spikes        | ❌ Upstream overload at scale |
| ❌ Stale data risk                | ❌ Slower every request       |

### Real Example — Product catalog BFF

```tsx
// lib/products.ts
export async function getProducts() {
  const res = await fetch(`${process.env.CATALOG_API}/products`, {
    next: { revalidate: 300, tags: ["products"] }, // 5 min ISR
  });

  if (!res.ok) throw new Error("Catalog unavailable");
  return res.json();
}
```

```tsx
// app/api/revalidate/route.ts — on-demand after CMS publish
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("products");
  return Response.json({ revalidated: true });
}
```

```tsx
// Redis layer for hot per-user data (Route Handler)
// app/api/dashboard/route.ts
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(req: Request) {
  const userId = await getUserId(req);
  const cacheKey = `dashboard:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return Response.json(cached);

  const data = await fetchDashboardFromUpstream(userId);
  await redis.setex(cacheKey, 60, data); // 60s TTL

  return Response.json(data);
}
```

### Interview Answer

> I'd use Next.js Data Cache with `revalidate` and cache tags for shared data, `no-store` only for user-specific or real-time data, and add Redis at the Route Handler layer when upstream rate limits or cross-instance consistency require it — with webhooks calling `revalidateTag` on content updates.

---

## 5. Your application has 10,000 blog posts. How would you generate and serve these pages efficiently?

### Description

Rendering 10,000 pages at **every build** can be slow. You need a strategy that balances **SEO**, **build time**, and **freshness** — typically **SSG + ISR** or **dynamic SSR with caching**, not 10K blocking builds on every deploy.

### Theory

| Approach                         | When to use                                            |
| -------------------------------- | ------------------------------------------------------ |
| **SSG all 10K at build**         | OK if build pipeline handles it (~minutes)             |
| **ISR + `generateStaticParams`** | Pre-render popular posts; generate rest on first visit |
| **On-demand ISR**                | CMS webhook triggers `revalidatePath`                  |
| **Pagination + SSG listing**     | List pages static; detail on demand                    |

**`generateStaticParams`** — pre-build top N; others generated at runtime.

### Pros & Cons

| ISR (incremental)                     | Full SSG every deploy                 |
| ------------------------------------- | ------------------------------------- |
| ✅ Fast deploys                       | ✅ All pages instantly cached at edge |
| ✅ Scales to millions of pages        | ❌ Build time grows linearly          |
| ❌ First visitor pays generation cost | ❌ Rebuild all 10K for one typo fix   |

### Real Example — Blog with 10,000 posts

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export const revalidate = 3600; // ISR — revalidate every hour

// Pre-build top 500 posts; rest on-demand
export async function generateStaticParams() {
  const posts = await fetch(`${process.env.API_URL}/posts?top=500`).then((r) =>
    r.json(),
  );

  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

async function getPost(slug: string) {
  const res = await fetch(`${process.env.API_URL}/posts/${slug}`, {
    next: { tags: [`post-${slug}`] },
  });
  if (res.status === 404) return null;
  return res.json();
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
```

```tsx
// app/blog/page.tsx — paginated listing (SSG per page)
export async function generateStaticParams() {
  const { totalPages } = await getPostCount(); // e.g. 400 pages × 25 posts
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}
```

```tsx
// CMS webhook — revalidate single post
// app/api/revalidate/post/route.ts
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const { slug, secret } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(`post-${slug}`);
  revalidatePath("/blog");
  return Response.json({ ok: true });
}
```

**Serving:** Deploy to Vercel/Cloudflare — static HTML at edge CDN; ISR regenerates in background.

### Interview Answer

> I'd use `generateStaticParams` to pre-render high-traffic posts, ISR with `revalidate` for the long tail of 10K pages, paginated static listing routes, and on-demand revalidation from the CMS so deploys stay fast and content updates don't require full rebuilds.

---

## 6. A page contains a heavy chart library that is only needed after user interaction. How would you optimize the loading strategy?

### Description

Chart libraries (Recharts, Chart.js, D3) can add **100–300+ KB** to the client bundle. If the chart appears only after "View analytics" or tab click, it should **not** load on initial page visit.

### Theory

| Strategy                          | Use case                                               |
| --------------------------------- | ------------------------------------------------------ |
| **`next/dynamic` + `ssr: false`** | Chart needs `window`; load on mount                    |
| **Dynamic import on click**       | User must click before download starts                 |
| **Server Component for data**     | Fetch aggregates on server; pass props to chart island |
| **Suspense fallback**             | Skeleton while chunk loads                             |

### Pros & Cons

| Load on interaction          | Bundle in main page                       |
| ---------------------------- | ----------------------------------------- |
| ✅ Smaller initial JS        | ❌ Slower first load                      |
| ✅ Better INP / LCP          | ❌ Wasted bytes if user never opens chart |
| ❌ Brief delay on first open | ❌ Mobile users suffer                    |

### Real Example — Analytics tab with Recharts

```tsx
// app/sales/page.tsx — Server Component
import { SalesSummary } from "./sales-summary";
import { SalesChartLoader } from "./sales-chart-loader";

export default async function SalesPage() {
  const summary = await getSalesSummary(); // server — no chart lib

  return (
    <main>
      <SalesSummary data={summary} />
      <SalesChartLoader chartData={summary.byMonth} />
    </main>
  );
}
```

```tsx
// app/sales/sales-chart-loader.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SalesChart = dynamic(() => import("./sales-chart"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});

export function SalesChartLoader({ chartData }) {
  const [showChart, setShowChart] = useState(false);

  if (!showChart) {
    return (
      <button
        type="button"
        onClick={() => setShowChart(true)}
        className="btn-primary"
      >
        View chart
      </button>
    );
  }

  return <SalesChart data={chartData} />;
}
```

```tsx
// app/sales/sales-chart.tsx — only loaded after button click
"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function SalesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Line type="monotone" dataKey="revenue" stroke="#2563eb" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Interview Answer

> I'd keep data fetching in a Server Component, load the chart library with `next/dynamic` and `ssr: false`, and defer the import until the user clicks — so the heavy dependency never hits the initial bundle.

---

## 7. You need to upload large files from the frontend to a cloud storage service. How would you implement the flow in Next.js?

### Description

Uploading multi-GB files **through** your Next.js server wastes memory, hits body-size limits, and times out on serverless. The standard pattern is **presigned URLs** — client uploads **directly to S3/R2/GCS**.

### Theory

| Flow                            | Pros                       | Cons                               |
| ------------------------------- | -------------------------- | ---------------------------------- |
| **Direct to cloud (presigned)** | Scalable, no server memory | Need CORS config on bucket         |
| **Through Next.js API**         | Simple for small files     | Breaks on large files / serverless |
| **Multipart upload**            | Resumable, parallel chunks | More client logic                  |

**Steps:** Client requests presigned URL → Next.js Route Handler validates auth + file metadata → returns signed PUT URL → client uploads directly → client notifies app to save metadata.

### Pros & Cons

| Presigned direct upload         | Proxy through API route            |
| ------------------------------- | ---------------------------------- |
| ✅ Handles large files          | ✅ Full server control             |
| ✅ No serverless timeout        | ❌ 4.5 MB limits on many platforms |
| ❌ Must validate before signing | ❌ Server RAM bottleneck           |

### Real Example — S3 presigned upload (500 MB video)

```tsx
// app/api/uploads/presign/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const MAX_SIZE = 500 * 1024 * 1024; // 500 MB
const ALLOWED_TYPES = ["video/mp4", "application/pdf"];

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { fileName, fileType, fileSize } = await req.json();

  if (!ALLOWED_TYPES.includes(fileType) || fileSize > MAX_SIZE) {
    return Response.json({ error: "Invalid file" }, { status: 400 });
  }

  const key = `uploads/${session.userId}/${crypto.randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return Response.json({ uploadUrl, key });
}
```

```tsx
// components/file-uploader.tsx
"use client";

export function FileUploader() {
  async function handleUpload(file: File) {
    const presign = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    }).then((r) => r.json());

    await fetch(presign.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    await fetch("/api/uploads/complete", {
      method: "POST",
      body: JSON.stringify({ key: presign.key, size: file.size }),
    });
  }

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
  );
}
```

**Large files:** Use S3 multipart upload API from the client (or library like `tus` / `@aws-sdk/lib-storage`).

### Interview Answer

> I wouldn't stream large files through Next.js. I'd use a Route Handler to authenticate the user and return a presigned S3 URL, let the client upload directly with progress UI, then call a completion endpoint to store metadata — multipart upload for very large files.

---

## 8. Your API routes are receiving a high volume of requests. How would you improve scalability and performance?

### Description

Route Handlers (`app/api/...`) become bottlenecks under spike traffic without **caching**, **rate limiting**, **horizontal scale**, and **offloading work** to queues.

### Theory

| Layer             | Tactic                                              |
| ----------------- | --------------------------------------------------- |
| **Edge**          | Move read-heavy, low-compute routes to Edge Runtime |
| **Cache**         | CDN cache GET responses; Redis for computed results |
| **Rate limiting** | Token bucket per IP/user (Upstash, middleware)      |
| **Queue**         | POST returns 202; worker processes async            |
| **DB**            | Connection pooling (PgBouncer), read replicas       |
| **Stateless**     | Scale serverless instances horizontally             |

### Pros & Cons

| Rate limit + cache + queue | Raw handlers hitting DB every time  |
| -------------------------- | ----------------------------------- |
| ✅ Survives viral traffic  | ❌ DB connection exhaustion         |
| ✅ Predictable cost        | ❌ Cascading 503 errors             |
| ❌ More infrastructure     | ❌ Hard to scale past single region |

### Real Example — High-traffic search API

```tsx
// middleware.ts — rate limit at edge
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 req/min per IP
});

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();

  const ip = req.ip ?? "127.0.0.1";
  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(reset) } },
    );
  }

  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
```

```tsx
// app/api/search/route.ts
export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const res = await fetch(
    `${process.env.SEARCH_SERVICE}/q=${encodeURIComponent(q)}`,
    {
      next: { revalidate: 30 },
    },
  );

  const data = await res.json();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
```

```tsx
// Heavy writes — queue instead of blocking
// app/api/orders/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  await queue.publish("order.created", body); // SQS / Kafka / BullMQ
  return Response.json({ status: "accepted" }, { status: 202 });
}
```

### Interview Answer

> I'd add edge rate limiting in middleware, cache GET route responses at CDN with `s-maxage`, move heavy work to async queues, use connection pooling for the database, and deploy stateless Route Handlers so they scale horizontally under load.

---

## 9. You are migrating a React SPA to Next.js. What challenges would you expect and how would you handle them?

### Description

SPAs rely on **client-side routing**, **browser-only APIs**, and often a single `index.html`. Next.js introduces **file-based routing**, **Server Components**, and **different data-fetching** semantics.

### Theory

| SPA habit                                 | Next.js change                                                  |
| ----------------------------------------- | --------------------------------------------------------------- |
| `react-router`                            | App Router file system (`app/page.tsx`)                         |
| `useEffect` + fetch                       | Server Component `async` fetch or React Query in client islands |
| `window` / `localStorage` on first render | `'use client'` + `useEffect`, or dynamic `ssr: false`           |
| Env vars `REACT_APP_*`                    | `NEXT_PUBLIC_*` (client) vs server-only env                     |
| Global CSS in `index.js`                  | `app/layout.tsx` imports                                        |
| Auth in context only                      | Middleware + cookies for SSR session                            |

### Pros & Cons

| Incremental migration (Next + existing SPA routes) | Big-bang rewrite           |
| -------------------------------------------------- | -------------------------- |
| ✅ Ship value per route                            | ❌ Long freeze, high risk  |
| ✅ Learn App Router gradually                      | ❌ Hard to test everything |
| ❌ Temporary dual patterns                         | ❌ Regression bugs         |

### Real Example — Incremental migration plan

**Phase 1 — Shell**

```text
next.config.js → redirects old paths
app/layout.tsx → shared providers (only client wrappers where needed)
Migrate /marketing and /blog first (SSG wins)
```

**Phase 2 — Auth**

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
```

**Phase 3 — Replace react-router**

```tsx
// ❌ SPA
<Route path="/products/:id" element={<ProductPage />} />;

// ✅ App Router
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}
```

**Phase 4 — Client-only widgets**

```tsx
// Map, charts, rich text editor — mark client, dynamic import
"use client";
// or dynamic(() => import('./map'), { ssr: false })
```

**Common pitfalls**

| Problem                  | Fix                                                             |
| ------------------------ | --------------------------------------------------------------- |
| Hydration mismatch       | Don't use `Date.now()` or random IDs in SSR HTML                |
| Double data fetch        | Trust Server Components; don't refetch same data in `useEffect` |
| `localStorage` in render | Move to `useEffect` or client-only component                    |
| SEO still missing        | Ensure marketing pages are Server/SSG, not client-only          |

### Interview Answer

> I'd migrate incrementally: file-based routes instead of react-router, move data fetching to Server Components, wrap browser-only code in `'use client'` or dynamic imports, handle auth in middleware with cookies, and fix hydration mismatches by not rendering client-only values on the server.

---

## 10. How would you implement A/B testing in a Next.js application?

### Description

A/B tests split users into **variants** to compare metrics (CTR, conversion). Implementation must assign users **consistently** (same variant on return visits) without flicker and without hurting SEO.

### Theory

| Approach                                    | How it works                                         |
| ------------------------------------------- | ---------------------------------------------------- |
| **Middleware + cookie**                     | Assign variant on first visit; edge-fast             |
| **Feature flags (LaunchDarkly, Flagsmith)** | Remote config, gradual rollouts                      |
| **Vercel Flags / Edge Config**              | Low-latency variant lookup                           |
| **Client-only**                             | Simple but causes flicker — avoid for hero CTA tests |

**Best practice:** Assign variant in **middleware**, store in cookie, render correct variant on server.

### Pros & Cons

| Server-side assignment (middleware) | Client-side random on mount |
| ----------------------------------- | --------------------------- |
| ✅ No flicker                       | ❌ Flash of wrong variant   |
| ✅ SEO sees stable content          | ❌ Skews analytics          |
| ❌ Needs cookie consent in EU       | ✅ Easier to prototype      |

### Real Example — Homepage CTA A/B test

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VARIANTS = ["control", "variant-b"] as const;

function pickVariant(): string {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  let variant = req.cookies.get("ab-cta")?.value;

  if (!variant || !VARIANTS.includes(variant as (typeof VARIANTS)[number])) {
    variant = pickVariant();
    res.cookies.set("ab-cta", variant, {
      maxAge: 60 * 60 * 24 * 30, // 30 days — consistent experience
      path: "/",
    });
  }

  res.headers.set("x-ab-cta", variant);
  return res;
}
```

```tsx
// app/page.tsx
import { cookies } from "next/headers";
import { HeroCTA } from "@/components/hero-cta";

export default function HomePage() {
  const variant = cookies().get("ab-cta")?.value ?? "control";

  return (
    <main>
      <h1>Welcome</h1>
      <HeroCTA variant={variant} />
    </main>
  );
}
```

```tsx
// components/hero-cta.tsx
"use client";

import { trackEvent } from "@/lib/analytics";

export function HeroCTA({ variant }: { variant: string }) {
  const isB = variant === "variant-b";

  function handleClick() {
    trackEvent("cta_click", { variant, page: "home" });
  }

  return (
    <a
      href="/signup"
      onClick={handleClick}
      className={isB ? "btn-green" : "btn-blue"}
    >
      {isB ? "Start free trial" : "Sign up"}
    </a>
  );
}
```

**Analytics:** Send `variant` with every conversion event; analyze in Amplitude/Mixpanel/GA4.

**Feature flag provider (production scale)**

```tsx
import { getFlag } from "@/lib/flags";

export default async function PricingPage() {
  const showAnnual = await getFlag("pricing-annual-default", false);
  return <PricingTable defaultTab={showAnnual ? "annual" : "monthly"} />;
}
```

### Interview Answer

> I'd assign variants in middleware with a persistent cookie, pass the variant into Server Components to avoid flicker, track exposure and conversion with the variant ID in analytics, and use a feature-flag service for rollouts beyond simple A/B tests.

---

## 11. Quick Revision Cheat Sheet

| #   | Scenario                   | Core answer                                                                  |
| --- | -------------------------- | ---------------------------------------------------------------------------- |
| 1   | Slow multi-API page        | `Promise.all`, Suspense streaming, cache with `revalidate`                   |
| 2   | Live stock data            | Hybrid: dynamic SSR snapshot + WebSocket/polling on client — not SSG         |
| 3   | Large bundle               | Server Components, `next/dynamic`, bundle analyzer, `optimizePackageImports` |
| 4   | Server caching             | `fetch` cache + tags, ISR, Redis for hot paths, `revalidateTag`              |
| 5   | 10K blog posts             | `generateStaticParams` + ISR + on-demand revalidation from CMS               |
| 6   | Heavy chart on interaction | `dynamic(..., { ssr: false })`, import on click                              |
| 7   | Large file upload          | Presigned URL → direct S3 upload → completion webhook                        |
| 8   | High-volume API routes     | Rate limit, CDN cache, edge runtime, async queues                            |
| 9   | SPA → Next.js              | Incremental routes, middleware auth, fix hydration, client islands           |
| 10  | A/B testing                | Middleware cookie assignment, server render variant, track in analytics      |

---

**Related guides in this repo**

- [10-frontend-concepts-checklist.md](./10-frontend-concepts-checklist.md) — CSR vs SSR vs SSG vs ISR
- [06-react-best-practices-project-guide.md](./06-react-best-practices-project-guide.md) — code splitting, performance
- [20-senior-frontend-real-world-interview.md](./20-senior-frontend-real-world-interview.md) — production engineering topics
