---
title: "Next.js 16 Performance & Turbopack Interview Guide"
description: "Turbopack, bundle optimization, Core Web Vitals, images, fonts, React Compiler, and production deployment for senior Next.js interviews."
tags:
  [
    "nextjs",
    "performance",
    "turbopack",
    "core-web-vitals",
    "interview",
    "senior",
  ]
level: "Senior (4–5+ years)"
---

# Next.js 16 Performance & Turbopack Interview Guide

Senior frontend interviews expect you to connect **Next.js architecture** to **measurable Core Web Vitals** — not just list optimization buzzwords.

---

## Table of Contents

1. [Turbopack as default bundler](#1-turbopack-as-default-bundler)
2. [Measuring: Lighthouse vs RUM](#2-measuring-lighthouse-vs-rum)
3. [Core Web Vitals in Next.js](#3-core-web-vitals-in-nextjs)
4. [Reducing JavaScript bundle size](#4-reducing-javascript-bundle-size)
5. [`next/dynamic` and code splitting](#5-nextdynamic-and-code-splitting)
6. [`next/image` optimization](#6-nextimage-optimization)
7. [Font optimization (`next/font`)](#7-font-optimization-nextfont)
8. [Layout deduplication & prefetching (Next 16)](#8-layout-deduplication--prefetching-next-16)
9. [React Compiler (opt-in)](#9-react-compiler-opt-in)
10. [Edge vs Node runtime trade-offs](#10-edge-vs-node-runtime-trade-offs)
11. [Production deployment patterns](#11-production-deployment-patterns)
12. [Senior scenario: LCP regression after migration](#12-senior-scenario-lcp-regression-after-migration)

---

## 1. Turbopack as default bundler

### Theory

Next.js 16 uses **Turbopack** for `next dev` and `next build` by default.

| Metric             | Typical improvement          |
| ------------------ | ---------------------------- |
| Fast Refresh       | Up to 10× faster             |
| Production build   | 2–5× faster                  |
| `next dev` startup | Significantly faster (16.2+) |

**Opt out:** `next build --webpack` when a custom webpack plugin isn't Turbopack-compatible yet.

```json
{
  "scripts": {
    "build": "next build",
    "build:webpack": "next build --webpack"
  }
}
```

### Interview Answer

> Turbopack is default in 16 — faster CI and dev loops. I only use `--webpack` for a blocking plugin issue, and track Turbopack compatibility in dependencies.

---

## 2. Measuring: Lighthouse vs RUM

| Tool                              | What it tells you                    |
| --------------------------------- | ------------------------------------ |
| **Lighthouse (lab)**              | Reproducible audits, local debugging |
| **Vercel Analytics / web-vitals** | Real user LCP, INP, CLS              |
| **Bundle Analyzer**               | What's in the client JS              |

### Interview Answer

> Lighthouse finds low-hanging fruit in dev; production decisions use RUM — p75 LCP and INP by route and device class.

---

## 3. Core Web Vitals in Next.js

| Metric  | Target  | Next.js levers                                        |
| ------- | ------- | ----------------------------------------------------- |
| **LCP** | ≤ 2.5s  | Server HTML, `next/image`, priority images, streaming |
| **INP** | ≤ 200ms | Small client islands, `useTransition`, defer heavy JS |
| **CLS** | ≤ 0.1   | Image dimensions, font fallbacks, skeleton sizes      |

```tsx
// LCP image — above the fold
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority
  placeholder="blur"
  blurDataURL={blurData}
/>;
```

### Interview Answer

> LCP is usually hero image or largest text block — I server-render it, use `priority` on `next/image`, and avoid client-only rendering for above-the-fold content.

---

## 4. Reducing JavaScript bundle size

### Strategies

| Strategy                     | Impact                               |
| ---------------------------- | ------------------------------------ |
| Server Components by default | Large reduction — logic stays server |
| Leaf `"use client"`          | Only interactive parts hydrate       |
| Tree-shake icon libs         | Import single icons, not whole sets  |
| Replace moment.js            | `date-fns` or `Intl`                 |
| Analyze bundle               | `@next/bundle-analyzer`              |

```js
// next.config.ts
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
  /* config */
});
```

### Interview Answer

> Biggest win is architectural — Server Components — then dynamic import for charts/editors, then dependency audit. I run bundle analyzer on every major feature.

---

## 5. `next/dynamic` and code splitting

```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/heavy-chart"), {
  loading: () => <ChartSkeleton />,
  ssr: false, // client-only libs (maps, charts)
});

export function AnalyticsSection() {
  return (
    <section>
      <h2>Analytics</h2>
      <HeavyChart />
    </section>
  );
}
```

### Interview Answer

> Dynamic import for heavy client-only libs — load after interaction or below fold. I pair with Suspense skeletons so CLS stays low.

---

## 6. `next/image` optimization

### Features

- Automatic WebP/AVIF negotiation
- Responsive `srcset`
- Lazy load (default) vs `priority` for LCP
- Remote patterns in config

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.example.com" }],
  },
};
```

### Interview Answer

> `next/image` handles responsive sizes and modern formats — I always set width/height or `fill` with aspect container to prevent CLS.

---

## 7. Font optimization (`next/font`)

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- Self-hosts font — no Google CDN round trip
- `display: swap` reduces invisible text (FOIT)

### Interview Answer

> `next/font` eliminates layout shift from web fonts — self-hosted, subsetted, with swap. I avoid loading 6 weights when 2 suffice.

---

## 8. Layout deduplication & prefetching (Next 16)

### Theory

Next.js 16 routing improvements:

- **Layout deduplication:** Prefetching multiple links with shared layout downloads layout once
- **Incremental prefetching:** Only fetches parts not already cached

### Interview Answer

> Next 16 prefetch is smarter — less duplicate layout JS on hover. I still use `<Link prefetch={false}>` for rarely visited admin routes to save bandwidth.

---

## 9. React Compiler (opt-in)

### Theory

React Compiler automatically memoizes — reduces need for manual `useMemo`/`useCallback`.

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};
```

### Pros & Cons

| Compiler            | Manual memo                   |
| ------------------- | ----------------------------- |
| ✅ Less boilerplate | ✅ Explicit control           |
| ❌ Build time cost  | ❌ Easy to over/under memoize |

### Interview Answer

> Compiler is opt-in stable in Next 16 — I'd trial it on a high-rerender client dashboard and measure INP before rolling out.

---

## 10. Edge vs Node runtime trade-offs

```ts
// app/api/geo/route.ts
export const runtime = "edge";

export async function GET() {
  return Response.json({ region: process.env.VERCEL_REGION });
}
```

| Runtime  | Pros                  | Cons                              |
| -------- | --------------------- | --------------------------------- |
| **Node** | Full APIs, DB drivers | Higher cold start in some regions |
| **Edge** | Low latency globally  | Limited Node APIs, smaller CPU    |

### Interview Answer

> Edge for geo redirects and auth cookie parsing; Node for DB-heavy Route Handlers and Server Actions with ORMs.

---

## 11. Production deployment patterns

### Standalone Docker

```js
const nextConfig = { output: "standalone" };
```

See [Docker/nextjs/README.md](../Docker/nextjs/README.md)

### Checklist

| Item                       | Why                             |
| -------------------------- | ------------------------------- |
| `standalone` output        | Minimal Docker image            |
| Health check route         | `/api/health` for load balancer |
| Env secrets in platform    | Not in image layers             |
| CDN for static assets      | `_next/static` long cache       |
| Cache tags on public pages | `"use cache"` + CDN             |

### Interview Answer

> Production is `standalone` in Docker or Vercel with env secrets outside the image. I separate static asset CDN caching from dynamic HTML caching strategy.

---

## 12. Senior scenario: LCP regression after migration

### Symptom

LCP went from 1.8s → 3.4s after moving from Pages Router to App Router.

### Investigation

1. **Client page wrapper** — entire page was `"use client"` → fix: server page
2. **Hero image** — raw `<img>` without dimensions → `next/image` + `priority`
3. **Waterfall** — sequential awaits → `Promise.all` + Suspense
4. **Font** — external CSS blocking → `next/font`

### Interview Answer

> I'd compare filmstrip in WebPageTest, check if LCP element is client-rendered, fix server boundary, prioritize hero image, parallelize fetches — re-measure p75 LCP in RUM.

---

## Quick Revision

```
Turbopack = default bundler
LCP = server HTML + priority image
Bundle = RSC first, dynamic import second
Fonts = next/font + swap
Deploy = standalone + health check
Measure RUM, not just Lighthouse
```

---

_Related: [04-nextjs-16-data-fetching-streaming-interview.md](./04-nextjs-16-data-fetching-streaming-interview.md) · [Docker/nextjs](../Docker/nextjs/)_
