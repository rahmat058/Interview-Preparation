# CartPulse — Shopping Cart

**React Machine Coding Project #9** — e-commerce cart with **add/remove**, **quantity updates**, and a **pure pricing pipeline** via Redux selectors.

![CartPulse — Shopping Cart](../Projects-Images/09-shoping-cart.png)

## Features

| Feature               | Implementation                                     |
| --------------------- | -------------------------------------------------- |
| **Add / remove**      | `addItem`, `removeItem`, `clearCart` reducers      |
| **Quantity updates**  | +/- stepper, direct input, stock clamping          |
| **Price calculation** | Pure `calculateCartPricing()` + memoized selectors |
| **Normalized state**  | `itemsById` map keyed by `productId`               |
| **Promo codes**       | `SAVE10` (10% off), `FREESHIP` (free shipping)     |
| **Shipping rules**    | Free over $75, else $5.99 flat                     |
| **Tax**               | 8% on discounted subtotal                          |
| **Persistence**       | Cart + promo saved to `localStorage`               |
| **Catalog**           | 12 products, category filter, stock limits         |
| **Design**            | Commerce Jade palette (teal → cyan → sky)          |

## Tech Stack

| Layer       | Technology                       |
| ----------- | -------------------------------- |
| Build       | Vite 7                           |
| UI          | React 19, TypeScript             |
| State       | Redux Toolkit + `createSelector` |
| Motion      | Framer Motion                    |
| Persistence | localStorage                     |

## Getting Started

**Prerequisites:** Node.js **24.11.0**

```bash
cd Projects/09-shopping-cart
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — add items, change quantities, apply `SAVE10`, refresh to see cart restore.

## Scripts

| Command                 | Description                   |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start dev server              |
| `npm run build`         | Type-check + production build |
| `npm run preview`       | Preview production build      |
| `npm run lint`          | Run ESLint                    |
| `npm run generate:data` | Regenerate `products.json`    |

## State Shape (Interview Focus)

```typescript
itemsById: {
  prd_001: { productId: 'prd_001', quantity: 2 },
  prd_004: { productId: 'prd_004', quantity: 1 },
}
productsById: Record<string, Product>  // from catalog API
promoCode: 'SAVE10' | null
```

**Derived (never stored):** subtotal, tax, shipping, total — computed in `selectCartPricing`.

## Pricing Pipeline

```
itemsById + productsById + promoCode
  → calculateCartPricing()
  → { subtotal, discount, tax, shipping, total }
```

## Promo Codes

| Code       | Effect             |
| ---------- | ------------------ |
| `SAVE10`   | 10% off subtotal   |
| `FREESHIP` | Waive shipping fee |

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — state design, selectors, pricing rules
- [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md) — interview Q&A
