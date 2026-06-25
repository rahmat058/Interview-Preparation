# CartPulse — Shopping Cart

**React Machine Coding Project #9** — e-commerce cart with **add/remove**, **quantity updates**, a **pure pricing pipeline** via Redux selectors, plus an **advanced catalog** with filtering, variants, and a slide-out cart drawer.

![CartPulse — Shopping Cart](../Projects-Images/09-shoping-cart.png)

**[🔗 Live Demo](https://shopping-cart-mocha-five.vercel.app/)**

## Features

| Feature | Implementation |
| --- | --- |
| **Add / remove** | `addItem`, `removeItem`, `clearCart` reducers |
| **Quantity updates** | +/- stepper, direct input, stock clamping |
| **Price calculation** | Pure `calculateCartPricing()` + memoized selectors |
| **Normalized state** | `itemsById` keyed by `productId` or `productId:variantId` |
| **Color variants** | `ProductVariant` on detail page; cart lines store `variantId` |
| **Promo codes** | `SAVE10` (10% off), `FREESHIP` (free shipping) |
| **Shipping rules** | Free over $75, else $5.99 flat |
| **Tax** | 8% on discounted subtotal |
| **Persistence** | Cart + promo saved to `localStorage` |
| **Cart Demo (`/`)** | Inline catalog + sticky cart panel |
| **Advanced Catalog (`/catalog`)** | Filters, grid/list view, floating cart + drawer |
| **Product detail (`/products/:id`)** | Full description + `ColorVariantPicker` |
| **Design** | Commerce Jade palette (teal → cyan → sky) |

## Routes

| Path | Page | Description |
| --- | --- | --- |
| `/` | `ShopApp` | Original interview demo — category filter, inline cart |
| `/catalog` | `AdvancedCatalogPage` | Price range, sort, rating, availability, grid/list |
| `/products/:productId` | `ProductDetailPage` | Variant picker, add-to-cart per color |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Build | Vite 7 |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Routing | React Router 7 |
| State | Redux Toolkit + `createSelector` |
| Motion | Framer Motion |
| Persistence | localStorage |

## Getting Started

**Prerequisites:** Node.js **24.11.0**

```bash
cd Projects/09-shopping-cart
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

- **`/`** — add items, change quantities, apply `SAVE10`, refresh to see cart restore
- **`/catalog`** — use filters, toggle grid/list, open cart via floating button
- **`/products/prd_009`** — pick a color variant, add to cart

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run generate:data` | Regenerate `products.json` |

## State Shape (Interview Focus)

```typescript
itemsById: {
  prd_001: { productId: 'prd_001', quantity: 2 },
  'prd_009:prd_009_navy': { productId: 'prd_009', variantId: 'prd_009_navy', quantity: 1 },
}
productsById: Record<string, Product>
promoCode: 'SAVE10' | null
categoryFilter: ProductCategory
advancedFilters: {
  priceMin, priceMax, minRating, inStockOnly, freeDeliveryOnly, sortBy, viewMode
}
```

**Derived (never stored):** subtotal, tax, shipping, total — computed in `selectCartPricing`.

**Cart line keys:** `getCartLineKey(productId, variantId)` → `productId` or `productId:variantId`.

## Pricing Pipeline

```
itemsById + productsById + promoCode
  → calculateCartPricing()
  → { subtotal, discount, tax, shipping, total }
```

## Promo Codes

| Code | Effect |
| --- | --- |
| `SAVE10` | 10% off subtotal |
| `FREESHIP` | Waive shipping fee |

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — state design, routing, selectors, catalog filters
- [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md) — interview Q&A
