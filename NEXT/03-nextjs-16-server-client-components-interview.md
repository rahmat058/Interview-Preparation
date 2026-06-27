---
title: "Next.js 16 Server & Client Components Interview Guide"
description: "RSC vs Client Components, composition patterns, serialization, children pattern, and senior boundary decisions for Next.js 16."
tags:
  ["nextjs", "rsc", "server-components", "use-client", "interview", "senior"]
level: "Mid-Level to Senior (4–5+ years)"
---

# Next.js 16 Server & Client Components Interview Guide

**Server Components (RSC)** are the default in the App Router. Senior interviews focus on **where you draw boundaries**, not whether you can define RSC.

---

## Table of Contents

1. [What is a Server Component?](#1-what-is-a-server-component)
2. [What is a Client Component?](#2-what-is-a-client-component)
3. [The children pattern (server wraps client)](#3-the-children-pattern-server-wraps-client)
4. [Import rules between server and client](#4-import-rules-between-server-and-client)
5. [Serialization constraints](#5-serialization-constraints)
6. [Context providers in App Router](#6-context-providers-in-app-router)
7. [Third-party libraries: server vs client](#7-third-party-libraries-server-vs-client)
8. [Fetching in Server vs Client Components](#8-fetching-in-server-vs-client-components)
9. [Security: secrets and data leaks](#9-security-secrets-and-data-leaks)
10. [Testing Server vs Client Components](#10-testing-server-vs-client-components)
11. [Senior scenario: dashboard with widgets](#11-senior-scenario-dashboard-with-widgets)

---

## 1. What is a Server Component?

### Theory

- Executes **only on the server** (build time or per request)
- Output is a **serializable component tree** sent to the client
- Can be `async` — `await` DB/API directly
- **Not** included in the client JavaScript bundle

### Real Example

```tsx
// app/users/page.tsx — Server Component (no directive needed)
import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany({ take: 50 });
  return (
    <table>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Interview Answer

> Server Components are zero-bundle-cost React — they run where my data lives, support async/await in the component body, and never expose DB credentials to the browser.

---

## 2. What is a Client Component?

### Theory

- Marked with `"use client"` at file top
- Hydrates in the browser — hooks and events work
- Still **pre-rendered on server** (SSR) for first paint, then hydrates

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### Interview Answer

> Client Components are for interactivity. The mistake at senior level isn't using them — it's using them at the root so the entire tree ships to the client.

---

## 3. The children pattern (server wraps client)

### Theory

A Server Component can pass **server-rendered children** into a Client Component slot — the client receives already-rendered HTML/RSC payload, not the server child's source.

```tsx
// components/modal-shell.tsx
"use client";

import { useState, type ReactNode } from "react";

export function ModalShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <div className="modal">{children}</div>}
    </>
  );
}

// app/page.tsx — Server Component
import { ModalShell } from "@/components/modal-shell";
import { HeavyServerContent } from "@/components/heavy-server-content";

export default function Page() {
  return (
    <ModalShell>
      <HeavyServerContent /> {/* stays server — not bundled to client */}
    </ModalShell>
  );
}
```

### Pros & Cons

| Children pattern                 | Client wrapper imports server child |
| -------------------------------- | ----------------------------------- |
| ✅ Keeps heavy logic server-side | ❌ Forces client boundary up        |
| ✅ Smaller client bundle         |                                     |

### Interview Answer

> I pass server-rendered children into client shells — modals, tabs, accordions — so only the interactive chrome hydrates, not the heavy content inside.

---

## 4. Import rules between server and client

| Import direction | Allowed?                                   |
| ---------------- | ------------------------------------------ |
| Server → Client  | ✅ Yes                                     |
| Client → Server  | ❌ No (would pull server code into bundle) |
| Server → Server  | ✅ Yes                                     |
| Client → Client  | ✅ Yes                                     |

**Workaround:** Move shared types/utils to a neutral `lib/` file with no server-only imports.

### Interview Answer

> Client files cannot import Server Components — that's how secrets leak into bundles. Shared pure functions live in `lib/` with no `next/headers` or DB imports.

---

## 5. Serialization constraints

### Serializable

- `string`, `number`, `boolean`, `null`
- Plain objects and arrays of serializable values
- `ReactNode` as **children** (special case)

### Not serializable

- Functions, classes, symbols
- `Date` → pass ISO string
- `Map`/`Set` → convert to array/object
- ORM models with methods → map to DTOs

```tsx
// ❌ Bad
<ClientChart formatTooltip={(v) => `$${v}`} />

// ✅ Good — format inside client component
<ClientChart data={plainData} />
```

### Interview Answer

> Props crossing the server/client boundary are JSON-serializable. I map DB entities to DTOs on the server before passing them down.

---

## 6. Context providers in App Router

### Theory

React Context only works in Client Components. Pattern: thin client provider wrapper in root layout.

```tsx
// components/theme-provider.tsx
"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}

// app/layout.tsx — Server Component
import { Providers } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Interview Answer

> Context requires client — I use a single `Providers` wrapper in root layout and keep everything else server by default.

---

## 7. Third-party libraries: server vs client

| Library type                  | Where                   |
| ----------------------------- | ----------------------- |
| `recharts`, `mapbox`, editors | Client (`"use client"`) |
| `date-fns` format (pure)      | Either                  |
| ORM, `fs`, `crypto`           | Server only             |
| `next/image`                  | Server or Client        |

**Pattern:** Dynamic import client-only libs

```tsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./chart"), {
  ssr: false,
  loading: () => <Skeleton />,
});
```

### Interview Answer

> I check if a library touches `window` or hooks — if yes, it lives in a client leaf, often with `dynamic(..., { ssr: false })` for chart libs that break SSR.

---

## 8. Fetching in Server vs Client Components

|                 | Server Component                 | Client Component        |
| --------------- | -------------------------------- | ----------------------- |
| When fetch runs | Per request (or cached)          | After hydration         |
| Waterfall risk  | Parallel `Promise.all` on server | `useEffect` chains      |
| Loading UI      | `Suspense` + `loading.tsx`       | Local `isLoading` state |
| Secrets in URL  | ✅ Server env                    | ❌ Exposed              |

```tsx
// Parallel server fetch — no waterfall
export default async function Page() {
  const [user, orders] = await Promise.all([getUser(), getOrders()]);
  return <Dashboard user={user} orders={orders} />;
}
```

### Interview Answer

> Default fetch is on the server with parallel awaits and Suspense boundaries — client fetch is for user-driven search after hydration or realtime polling.

---

## 9. Security: secrets and data leaks

### Anti-patterns

```tsx
"use client";
// ❌ NEVER — exposed in bundle
const apiKey = process.env.SECRET_API_KEY;

// ❌ Passing full user with passwordHash to client
<Profile user={dbUser} />;
```

### Correct

```tsx
// Server Component
const user = await getSession();
return <Profile name={user.name} avatar={user.avatarUrl} />;
```

### Interview Answer

> Only `NEXT_PUBLIC_` env vars are client-safe. I strip sensitive fields on the server before passing props — same principle as API response shaping.

---

## 10. Testing Server vs Client Components

| Type           | Tooling                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| Client         | Vitest + React Testing Library                                              |
| Server         | Integration tests hitting rendered HTML; or extract pure logic to unit test |
| Server Actions | Call action directly in test with mocked DB                                 |

### Interview Answer

> I unit-test pure functions and integration-test Server Components via request-level tests. Client interactions use RTL. I don't over-mock RSC — I test behavior at the HTTP boundary.

---

## 11. Senior scenario: dashboard with widgets

### Requirements

- KPI cards (DB aggregates, refresh every 30s)
- Interactive date filter (client)
- Export CSV button (client triggers Server Action)

### Boundary design

```
layout.tsx (server)
├── DashboardHeader (server, cached KPIs with "use cache")
├── DateFilter (client)
├── WidgetGrid (server children per widget)
│   ├── RevenueWidget (server + Suspense)
│   └── ActiveUsers (server, dynamic)
└── ExportButton (client → Server Action)
```

### Interview Answer

> KPIs and widgets stay server-side with Suspense per widget; only the date picker and export button are client islands. Export calls a Server Action so CSV generation never ships logic to the browser.

---

## Quick Revision

| Rule           | Detail                                    |
| -------------- | ----------------------------------------- |
| Default        | Server Component                          |
| `"use client"` | Leaves only — hooks, events, browser APIs |
| Import         | Server → Client ✅; Client → Server ❌    |
| Props          | Serializable DTOs                         |
| Children       | Server content through client shells      |
| Context        | Client provider wrapper in layout         |

---

_Related: [04-nextjs-16-data-fetching-streaming-interview.md](./04-nextjs-16-data-fetching-streaming-interview.md)_
