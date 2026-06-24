# Interview Questions — Shopping Cart

---

## State Management Basics

### Q1. Why use `itemsById` instead of an array?

| Array | Normalized map |
| ----- | -------------- |
| O(n) find by productId | O(1) lookup |
| Duplicate product data risk | Single source in `productsById` |
| Harder merge on add | Increment quantity in place |

**Interview Answer:** "Key cart lines by `productId`. Catalog lives separately. Same pattern as Redux docs for relational data."

---

### Q2. Where should total price live?

**Nowhere in Redux state** — it's derived.

```typescript
const pricing = useAppSelector(selectCartPricing)
```

**Interview Answer:** "Store facts (items, promo). Derive totals with a pure function + memoized selector. Storing total causes sync bugs."

---

### Q3. Walk through `addItem`.

1. Look up product in `productsById`
2. If no stock, return early
3. If line exists → `quantity + 1`, clamp to stock
4. Else → `{ productId, quantity: 1 }`

---

### Q4. What happens when quantity hits 0?

Two valid patterns:

- **This project:** `decrement` at qty 1 removes line; `setQuantity(0)` also removes
- **Alternative:** disable decrement at 1, require explicit Remove

Mention your choice and why.

---

## Price Calculation

### Q5. Order of operations for checkout total?

1. Subtotal (line items)
2. Discounts (promo)
3. Tax (on discounted subtotal — jurisdiction-dependent)
4. Shipping
5. Total

**Interview Answer:** "Tax base varies by region. I apply discount before tax; shipping usually not taxed for demos."

---

### Q6. Why pure `calculateCartPricing()`?

- Unit test without Redux
- Same logic on client and server validation
- Selector stays thin — just wires inputs

---

### Q7. How does `createSelector` help?

Memoizes output. If `itemsById` reference unchanged, skip recalculation — important when unrelated state (e.g. `categoryFilter`) updates.

---

## Real-World Patterns

### Q8. localStorage cart — pitfalls?

| Pitfall | Fix |
| ------- | --- |
| Stale prices | Re-fetch catalog, recalc on load |
| Invalid product ids | Prune on catalog load |
| Over-stock qty | Clamp to `product.stock` |
| Schema changes | Version key (`cartpulse-cart-v1`) |

---

### Q9. How would you sync cart after login?

1. Fetch server cart
2. Merge with local (max quantity? server wins?)
3. POST merged cart
4. Clear localStorage

---

### Q10. Promo code validation?

Client: quick UX check against known codes.

Production: **always re-validate on server** at checkout — client codes are hints only.

---

## Redux Specifics

### Q11. Why separate catalog and cart slices?

Could be one slice for small apps. Split when:

- Catalog loaded once, cart updated often
- Different API endpoints
- Cart persists, catalog doesn't

This project uses one `cart` slice with both for interview simplicity — mention you'd split at scale.

---

### Q12. Immutability with nested updates?

RTK + Immer allows:

```typescript
state.itemsById[productId].quantity += 1
```

Under the hood it's immutable. Without Immer, spread at each level.

---

## Whiteboard Drills

### Q13. Implement cart reducer in 10 minutes

Minimum:

- `ADD_ITEM`
- `REMOVE_ITEM`
- `SET_QTY`
- Selector: `subtotal = sum(price * qty)`

---

### Q14. Bug: total doesn't update on qty change

Common causes:

- Mutating state outside Immer
- Storing total in state instead of selector
- Selector not reading updated `itemsById`

---

## Rapid Fire

| Question | Short answer |
| -------- | ------------ |
| Single source of truth for price? | `productsById[id].price` |
| Duplicate product in cart? | Same key → increment qty |
| Free shipping threshold? | Derived in pricing fn |
| Test pricing? | Pure function unit tests |
| Context vs Redux for cart? | Redux for interview scale + DevTools |

---

## Cross-Project Links

| Project | Shared pattern |
| ------- | -------------- |
| #5 Data Table | Pure query pipeline, derived data |
| #4 Kanban | Normalized `cardsById` map |
| #6 Multi-Step Form | localStorage persistence |
