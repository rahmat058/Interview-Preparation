# Architecture — Catalog SPA

## Data flow

```
User action → dispatch(action) → rootReducer → subscribers → render*()
Fetch      → dispatch loading/success/error → paint DOM
```

Unidirectional flow matches Redux; no time-travel DevTools unless you add middleware.

## Store design

| Slice | Responsibility |
| --- | --- |
| `catalog` | products[], status, filters |
| `cart` | `{ [productId]: { productId, qty } }` |

Selectors (`selectFilteredProducts`, `selectCartTotal`) are pure functions — same role as Reselect.

## Routing

Hash routing avoids server config for static hosting. In production Next.js you'd use file-based routes; CSR vs SSR is an interview talking point:

| Strategy | When |
| --- | --- |
| **CSR** (this demo) | Dashboards, authenticated apps |
| **SSR** | SEO-critical catalog, personalized first paint |
| **SSG/ISR** | Marketing, product pages with stable data |

## SEO in CSR

`updatePageMeta()` mutates `<title>`, description, and injects JSON-LD. Crawlers that execute JS will index; for critical SEO use SSR/SSG in Next.js.

## API layer

`productsApi.js` simulates latency and supports `AbortSignal` for navigation-away cancellation.
