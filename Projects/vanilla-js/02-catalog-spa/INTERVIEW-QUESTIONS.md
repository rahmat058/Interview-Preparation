# Interview Questions — Catalog SPA

### Q. Why build your own store instead of Redux?

To show you understand subscribe/notify and reducers. In production at scale → Redux Toolkit for DevTools, middleware, ecosystem.

### Q. Redux vs Zustand vs Context for this app?

| Tool | Fit |
| --- | --- |
| **Custom store** | Learning / tiny apps |
| **Zustand** | Medium apps, minimal boilerplate |
| **Redux Toolkit** | Large teams, complex middleware, time-travel |
| **Context** | Theme/locale only — cart + catalog would over-re-render |

### Q. How would you add SSR in Next.js?

Fetch products in Server Component or `generateStaticParams`, pass as props/hydrate store. Cart stays client-only (`localStorage` after mount).

### Q. How do you handle race conditions on fetch?

`AbortController` per request; ignore `AbortError`. RTK Query does this with `signal` automatically.

### Q. Defend hash routing.

Zero server rewrite rules on static hosts. Trade-off: ugly URLs — use History API + server fallback in production.
