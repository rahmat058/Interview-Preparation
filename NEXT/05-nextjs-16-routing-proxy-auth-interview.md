---
title: "Next.js 16 Routing, Proxy & Auth Interview Guide"
description: "App Router patterns, proxy.ts, layouts, parallel routes, intercepting routes, and authentication for senior Next.js 16 interviews."
tags:
  ["nextjs", "routing", "proxy", "auth", "middleware", "interview", "senior"]
level: "Senior (4–5+ years)"
---

# Next.js 16 Routing, Proxy & Auth Interview Guide

Covers **App Router architecture**, **`proxy.ts`** (Next.js 16 network boundary), and **production auth patterns** for 4–5+ YOE roles.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [App Router mental model](#p1) |
| <span id="i2"></span>2 | [Layouts and nested routing](#p2) |
| <span id="i3"></span>3 | [Route groups `(folder)`](#p3) |
| <span id="i4"></span>4 | [Dynamic and catch-all segments](#p4) |
| <span id="i5"></span>5 | [Parallel routes `@slot`](#p5) |
| <span id="i6"></span>6 | [Intercepting routes `(.)` `(..)`](#p6) |
| <span id="i7"></span>7 | [`proxy.ts` — network boundary](#p7) |
| <span id="i8"></span>8 | [Proxy vs Server Component auth](#p8) |
| <span id="i9"></span>9 | [Protected routes pattern](#p9) |
| <span id="i10"></span>10 | [OAuth / session cookies](#p10) |
| <span id="i11"></span>11 | [Internationalization (i18n) routing](#p11) |
| <span id="i12"></span>12 | [Senior scenario: multi-tenant SaaS](#p12) |

---

<a id="p1"></a>

## 1. App Router mental model

### Theory

```
app/
├── layout.tsx          → wraps all routes
├── page.tsx            → /
├── dashboard/
│   ├── layout.tsx      → wraps /dashboard/*
│   └── page.tsx        → /dashboard
└── api/
    └── health/
        └── route.ts    → GET /api/health
```

- **Layouts** preserve state on navigation (sidebar stays mounted)
- **Pages** are unique per URL segment
- **Templates** re-mount on every navigation (enter/exit animations)

### Interview Answer

> App Router maps URLs to folders — layouts compose shared chrome, pages own route-specific data. I use nested layouts for dashboard shells that don't remount on every sub-route.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Layouts and nested routing

```tsx
// app/dashboard/layout.tsx
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

**Data in layouts:** Layouts can be async Server Components — fetch user/session once for all child pages.

```tsx
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  return (
    <div>
      <Header user={user} />
      {children}
    </div>
  );
}
```

### Interview Answer

> Shared session and nav live in layout — child pages don't re-fetch user on every navigation if I structure the data layer with React `cache()` for deduplication.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Route groups `(folder)`

Folders in parentheses **don't affect the URL** — organize code and apply different layouts.

```
app/
├── (marketing)/
│   ├── layout.tsx      → public nav
│   ├── page.tsx        → /
│   └── pricing/page.tsx
└── (app)/
    ├── layout.tsx      → authenticated shell
    └── dashboard/page.tsx
```

### Interview Answer

> Route groups separate marketing vs app shells without `/marketing` in the URL — clean for auth boundaries and different layouts.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Dynamic and catch-all segments

| Pattern       | URL                  | Folder                    |
| ------------- | -------------------- | ------------------------- |
| `[id]`        | `/posts/123`         | `posts/[id]/page.tsx`     |
| `[...slug]`   | `/docs/a/b/c`        | `docs/[...slug]/page.tsx` |
| `[[...slug]]` | `/docs` or `/docs/a` | optional catch-all        |

```tsx
export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug?.join("/") ?? "";
  return <DocViewer path={path} />;
}
```

### Interview Answer

> Dynamic segments are Promises in Next 16 — I await `params` and validate IDs server-side, returning `notFound()` for invalid slugs.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Parallel routes `@slot`

Render multiple pages in one layout simultaneously — slots for modals, side panels, analytics.

```
app/
├── @modal/
│   └── (.)photo/[id]/page.tsx
├── layout.tsx
└── photos/
    ├── page.tsx
    └── [id]/page.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

### Interview Answer

> Parallel routes power modal overlays — `/photos/1` opens a modal while `/photos` stays visible. `@modal` slot renders the intercepting route.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Intercepting routes `(.)` `(..)`

| Prefix     | Intercepts    |
| ---------- | ------------- |
| `(.)`      | Same level    |
| `(..)`     | One level up  |
| `(..)(..)` | Two levels up |

Use case: click photo thumbnail → modal; direct URL → full page.

### Interview Answer

> Intercepting routes improve UX for soft navigation — shareable URLs with modal experience on client navigation and full page on hard refresh.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. `proxy.ts` — network boundary

### Theory (Next.js 16)

Renamed from `middleware.ts` → **`proxy.ts`**, export **`proxy`** function.

| Responsibility        | ✅ In proxy | ❌ Not in proxy |
| --------------------- | ----------- | --------------- |
| Redirects / rewrites  | ✅          |                 |
| Cookie presence check | ✅          |                 |
| Geo / bot headers     | ✅          |                 |
| Heavy DB queries      |             | ❌              |
| Business logic        |             | ❌              |

```ts
// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    response.headers.set("x-request-id", crypto.randomUUID());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/dashboard/:path*"],
};
```

**Runtime:** Node.js by default in Next 16 (clearer than Edge-only middleware confusion).

### Pros & Cons

| Lightweight proxy           | Fat middleware                   |
| --------------------------- | -------------------------------- |
| ✅ Fast edge/network checks | ❌ Adds latency to every request |
| ✅ Clear separation         | ❌ Hard to test                  |

### Interview Answer

> Proxy is rename + clarity in Next 16 — cheap network checks only. I don't query the database on every static asset request.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Proxy vs Server Component auth

| Layer                 | Checks                               | Cost                         |
| --------------------- | ------------------------------------ | ---------------------------- |
| **Proxy**             | Cookie exists? Role in JWT?          | Runs on matched routes early |
| **Layout/Page (RSC)** | Full session validation, permissions | Runs when rendering          |
| **Server Action**     | Authorize mutation                   | Per action                   |

### Interview Answer

> Defense in depth: proxy for coarse "has session cookie", Server Component for real authorization before data fetch, Server Action for mutation checks. Never trust client-sent user IDs.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Protected routes pattern

```tsx
// app/(app)/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <>{children}</>;
}
```

**Role-based**

```tsx
const session = await getSession();
if (!session) redirect("/login");
if (session.role !== "admin") redirect("/unauthorized");
```

### Interview Answer

> Protected layout in `(app)` route group — unauthenticated users never reach child Server Components that fetch sensitive data.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. OAuth / session cookies

### Secure session pattern

1. OAuth callback Route Handler exchanges code for tokens **server-side**
2. Store **session ID** in httpOnly, `secure`, `sameSite=lax` cookie
3. Session data in DB or encrypted cookie — not raw JWT in `localStorage`
4. Rotate session on privilege change

```tsx
// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await createSessionFromOAuth(request);
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("session", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
```

### Interview Answer

> Sessions in httpOnly cookies, OAuth secrets only on server, CSRF protection on mutations. Auth.js or Clerk if I want speed; custom when compliance requires full control.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Internationalization (i18n) routing

### Pattern: `[locale]` segment

```
app/
└── [locale]/
    ├── layout.tsx
    └── page.tsx
```

```tsx
// proxy.ts — locale detection
export function proxy(request: NextRequest) {
  const locale = request.cookies.get("locale")?.value ?? "en";
  if (!request.nextUrl.pathname.startsWith(`/${locale}`)) {
    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}`, request.url),
    );
  }
  return NextResponse.next();
}
```

### Interview Answer

> I use a `[locale]` dynamic segment or proxy-based redirect, load dictionaries server-side in layout, and set `hreflang` in metadata for SEO.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Senior scenario: multi-tenant SaaS

### Requirements

- `acme.app.com` vs `beta.app.com` — tenant from subdomain
- Users must not see other tenant's data
- Public marketing on root domain

### Architecture

1. **Proxy:** parse subdomain → set `x-tenant-id` header
2. **Layout:** validate user belongs to tenant from session
3. **DB queries:** always filter by `tenantId` from server session — never from client props
4. **Route groups:** `(marketing)` on apex, `(tenant)` on subdomains

### Interview Answer

> Tenant ID comes from subdomain in proxy, validated against session in layout, enforced in every query server-side. Client never sends `tenantId` as trusted input.

---

## Quick Revision

```
Layouts = persistent chrome
Route groups = org without URL change
proxy.ts = cheap network gate (ex-middleware)
Auth = httpOnly cookie + RSC session check
params = Promise → await
Parallel + intercepting = modal UX
```

---

_Related: [01-senior-mid-level-nextjs-16-interview-guide.md](./01-senior-mid-level-nextjs-16-interview-guide.md)_


<p><a href="#i12">Back to index</a></p>
