# Architecture — Shopping Cart

## Overview

CartPulse demonstrates **normalized Redux state** for e-commerce carts — the pattern used by Shopify, Amazon frontends, and most checkout flows. Cart lines are keyed by `productId`; prices are **derived**, never duplicated in state.

---

## State Model

```typescript
interface CartState {
  productsById: Record<string, Product>   // catalog (from API)
  itemsById: Record<string, CartLineItem> // cart lines
  promoCode: string | null
  categoryFilter: ProductCategory
}
```

| Slice | Source | Mutable by user? |
| ----- | ------ | ---------------- |
| `productsById` | Catalog API | No |
| `itemsById` | User actions | Yes |
| `promoCode` | User input | Yes |

**Why normalized `itemsById`?**

- O(1) lookup: `itemsById[productId]`
- No duplicate product data in cart
- Adding same product = increment quantity, not new row
- Interviewers expect this over `cartItems: CartLine[]`

---

## Reducers

| Action | Behavior |
| ------ | -------- |
| `addItem(productId)` | Insert qty 1 or increment, clamp to stock |
| `removeItem(productId)` | Delete key from `itemsById` |
| `setQuantity({ productId, quantity })` | Clamp 1..stock; qty ≤ 0 removes |
| `incrementQuantity` / `decrementQuantity` | Stepper helpers |
| `clearCart` | Reset items + promo |
| `applyPromoCode` | Validate against `PROMO_CODES` map |

All reducers use Immer via RTK — safe "mutation" syntax.

---

## Derived State (Selectors)

**Never store `subtotal` or `total` in Redux.** They become stale when any input changes.

```typescript
export const selectCartPricing = createSelector(
  [selectItemsById, selectProductsById, selectPromoCode],
  (itemsById, productsById, promoCode) =>
    calculateCartPricing({ itemsById, productsById, promoCode }),
)
```

`createSelector` memoizes — recalculates only when inputs change.

### Pricing order

1. **Subtotal** — Σ (price × quantity)
2. **Discount** — percent promo on subtotal
3. **Tax** — 8% on (subtotal − discount)
4. **Shipping** — $5.99, free if subtotal ≥ $75 or FREESHIP promo
5. **Total** — subtotal − discount + tax + shipping

Pure function in `cartPricing.ts` — unit-testable without React.

---

## Persistence

```typescript
localStorage key: cartpulse-cart-v1
{ itemsById, promoCode, savedAt }
```

- Loaded in `initialState` before catalog fetch
- Saved via `useCartPersistence` hook on every cart change
- On catalog load: clamp quantities to current stock, remove invalid product ids

---

## UI Layout

```
ShopApp
├── Catalog (left)
│   ├── CategoryFilter
│   └── ProductGrid → ProductCard → dispatch(addItem)
└── CartPanel (right, sticky)
    ├── CartLineItem[] → quantity stepper, remove
    ├── ShippingProgress
    ├── PromoCodeInput
    ├── CartSummary ← selectCartPricing
    └── Checkout (CTA)
```

---

## Stock Enforcement

```typescript
clampQuantity(qty, stock) → Math.max(1, Math.min(qty, stock))
```

Applied on: add, setQuantity, increment, catalog hydration.

---

## Mock API

| Endpoint | File | Latency |
| -------- | ---- | ------- |
| `GET /products` | `cartApi.ts` | 300–600ms |
| 12 products | `products.json` | 4 categories |

Swap `fetchProducts` for real backend — cart logic unchanged.

---

## Extension Points

1. **Optimistic checkout** — async thunk + loading state on Checkout button
2. **Cart merge on login** — hydrate server cart + local cart
3. **Variant support** — key `itemsById` by `${productId}:${variantId}`
4. **Undo remove** — toast with 5s restore (like Gmail)

---

## File Map

```
src/
├── lib/store/slices/cartSlice.ts
├── lib/store/selectors/cartSelectors.ts
├── lib/utils/cartPricing.ts       ← pure pricing
├── lib/utils/cartPersistence.ts
├── hooks/useCartPersistence.ts
└── components/
    ├── catalog/ProductCard.tsx
    └── cart/CartPanel.tsx
```
