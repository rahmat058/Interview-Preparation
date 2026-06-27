# Next.js 16 Interview Preparation

Interview prep guides for **Next.js 16** roles (4–5+ years) — mirroring the [React](../React/) and [Vue](../Vue/) folder structure.

Each file includes **Theory**, **Pros & Cons**, **Real Examples**, and **Interview Answer** — the same format used across this repo.

**Assumed stack:** Next.js **16.x**, **App Router**, **React 19.2**, **TypeScript**, **Turbopack** (default bundler), deployment on **Vercel** or **Node standalone** (Docker).

---

## File Index

| #   | File                                                                                                    | Focus                                                    |
| --- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 01  | [senior-mid-level-nextjs-16-interview-guide.md](./01-senior-mid-level-nextjs-16-interview-guide.md)     | Core Next.js 16 concepts — 20 senior/mid topics          |
| 02  | [nextjs-16-cache-components-interview.md](./02-nextjs-16-cache-components-interview.md)                 | `"use cache"`, `cacheLife`, `cacheTag`, `updateTag`, PPR |
| 03  | [nextjs-16-server-client-components-interview.md](./03-nextjs-16-server-client-components-interview.md) | RSC, `"use client"`, composition, boundaries             |
| 04  | [nextjs-16-data-fetching-streaming-interview.md](./04-nextjs-16-data-fetching-streaming-interview.md)   | Parallel fetch, Suspense, Server Actions, Route Handlers |
| 05  | [nextjs-16-routing-proxy-auth-interview.md](./05-nextjs-16-routing-proxy-auth-interview.md)             | App Router, `proxy.ts`, auth, middleware patterns        |
| 06  | [nextjs-16-performance-turbopack-interview.md](./06-nextjs-16-performance-turbopack-interview.md)       | Turbopack, bundle size, Core Web Vitals, deployment      |
| 07  | [nextjs-16-migration-breaking-changes.md](./07-nextjs-16-migration-breaking-changes.md)                 | 15 → 16 migration, async APIs, codemods                  |
| 08  | [nextjs-top-30-interview-qa.md](./08-nextjs-top-30-interview-qa.md)                                     | Top 30 quick Q&A cheat sheet                             |

---

## Related in This Repo

| Topic                              | Where                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Next.js scenarios (App Router)     | [React/22-nextjs-scenario-based-interview.md](../React/22-nextjs-scenario-based-interview.md)       |
| React SSR / hydration fundamentals | [React/17-top-50-react-interview-questions.md](../React/17-top-50-react-interview-questions.md)     |
| Docker Next.js template            | [Docker/nextjs/README.md](../Docker/nextjs/README.md)                                               |
| System design (file upload)        | [System Design/04-file-upload-system-design.md](../System%20Design/04-file-upload-system-design.md) |
| Full-stack MERN                    | [MERN/](../MERN/)                                                                                   |

---

## Recommended Study Path

### Mid-Level (3–4 years) → Senior ramp-up

1. **01** — App Router, RSC vs Client, rendering models
2. **08** — Top 30 quick Q&A
3. **04** — Data fetching + streaming
4. **03** — Server/Client boundaries

### Senior (4–5+ years)

5. **02** — Cache Components (key differentiator in Next.js 16)
6. **05** — `proxy.ts`, auth, protected routes
7. **06** — Performance, Turbopack, production deployment
8. **07** — Migration & breaking changes (lead/architect rounds)

### Interview week

9. Re-read **Interview Answer** sections in all files aloud
10. Pair with [React/22-nextjs-scenario-based-interview.md](../React/22-nextjs-scenario-based-interview.md) for whiteboard scenarios
11. Run [Docker/nextjs](../Docker/nextjs/) — explain `output: 'standalone'` in a deployment round

---

## Next.js 16 at a Glance

| Area             | What changed                                                                     |
| ---------------- | -------------------------------------------------------------------------------- |
| **Caching**      | Explicit `"use cache"` — dynamic by default; no implicit `fetch` cache           |
| **Bundler**      | Turbopack stable and default (`--webpack` to opt out)                            |
| **Network**      | `middleware.ts` → `proxy.ts` (Node.js runtime by default)                        |
| **Request APIs** | `params`, `searchParams`, `cookies()`, `headers()` are **async**                 |
| **Invalidation** | `updateTag()` (Server Actions, read-your-writes) + `revalidateTag(tag, profile)` |
| **React**        | 19.2 — View Transitions, `useEffectEvent`, Activity                              |
| **DX**           | `next lint` removed — ESLint/Biome directly; Node **20.9+** required             |

---

_Start with [01-senior-mid-level-nextjs-16-interview-guide.md](./01-senior-mid-level-nextjs-16-interview-guide.md) or [08-nextjs-top-30-interview-qa.md](./08-nextjs-top-30-interview-qa.md) for a quick ramp-up._
