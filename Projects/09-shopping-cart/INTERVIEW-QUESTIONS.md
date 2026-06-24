# Interview Questions — Shopping Cart

---

## State Management Basics

### Q1. Why use `itemsById` instead of an array?

| Array                       | Normalized map                  |
| --------------------------- | ------------------------------- |
| O(n) find by productId      | O(1) lookup                     |
| Duplicate product data risk | Single source in `productsById` |
| Harder merge on add         | Increment quantity in place     |

**Interview Answer:** "Key cart lines by `productId`. Catalog lives separately. Same pattern as Redux docs for relational data."

---

### Q2. Where should total price live?

**Nowhere in Redux state** — it's derived.

```typescript
const pricing = useAppSelector(selectCartPricing);
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

| Pitfall             | Fix                               |
| ------------------- | --------------------------------- |
| Stale prices        | Re-fetch catalog, recalc on load  |
| Invalid product ids | Prune on catalog load             |
| Over-stock qty      | Clamp to `product.stock`          |
| Schema changes      | Version key (`cartpulse-cart-v1`) |

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
state.itemsById[productId].quantity += 1;
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

| Question                          | Short answer                         |
| --------------------------------- | ------------------------------------ |
| Single source of truth for price? | `productsById[id].price`             |
| Duplicate product in cart?        | Same key → increment qty             |
| Free shipping threshold?          | Derived in pricing fn                |
| Test pricing?                     | Pure function unit tests             |
| Context vs Redux for cart?        | Redux for interview scale + DevTools |

---

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria                  | What to demonstrate in **CartPulse**                  | Example from this project                                         |
| ------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| **Component structure**   | Catalog vs cart split; presentational line items      | `ProductCard` dispatches; `CartLineItem` receives props only      |
| **State management**      | Normalized cart; derived totals never stored          | `itemsById` + `selectCartPricing` — not `total` in Redux          |
| **Code readability**      | Pure pricing function testable without React          | `calculateCartPricing()` in `cartPricing.ts`                      |
| **Edge cases**            | Stock limits, stale localStorage, invalid product ids | `clampQuantity`, prune on catalog load, qty 0 removes line        |
| **Performance awareness** | Memoized selectors; no recalc on filter change        | `createSelector` skips pricing when only `categoryFilter` changes |

**Strong signal:** You explain _why_ totals are derived and walk through a stock-clamp edge case without being asked.

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **CartPulse**:

### Virtualization

**Ask:** "Catalog has 5,000 SKUs."

Use `@tanstack/react-virtual` on `ProductGrid` — only render visible rows. Cart panel stays small (no virtualization needed).

```typescript
// Pseudocode
const virtualizer = useVirtualizer({
  count: products.length,
  estimateSize: () => 180,
});
```

**Interview Answer:** "Virtualize `ProductGrid` — cart panel is O(items) and stays small. Normalized `itemsById` unchanged; only catalog render strategy changes."

**Example:** 5,000 products in grid → **~8 product cards** in DOM; cart with 4 items needs no virtualization at all.

---

### Optimistic updates

**Ask:** "Add to cart should feel instant before stock API confirms."

```typescript
dispatch(addItem(productId)); // immediate
try {
  await reserveStock(productId);
} catch {
  dispatch(removeItem(productId));
  toast.error("Out of stock");
}
```

**Interview Answer:** "Dispatch `addItem` immediately — qty clamp runs in reducer. Reserve stock async; on 409, remove line and toast error. User sees cart update before network round-trip."

**Example:** Click **Add Sony headphones** → cart shows qty **1** instantly → stock API returns 409 → item removed + **"Out of stock"** toast.

---

### Undo functionality

**Ask:** "User accidentally removed an item."

Keep last removed line in ref for 5 seconds; show toast with Undo:

```typescript
toast.custom({
  title: "Removed Sony headphones",
  action: { label: "Undo", onClick: () => dispatch(addItemWithQty(saved)) },
});
```

This project removes immediately — mention undo as production follow-up.

**Interview Answer:** "Snapshot `{ productId, quantity }` in a ref before `removeItem`, toast Undo calls `addItemWithQty`. Five-second window — same pattern as Gmail undo send."

**Example:** Remove Sony headphones (qty 2) → toast **Undo** → `addItemWithQty({ id, qty: 2 })` within 5s restores exact line.

---

### Accessibility support

**Ask:** "Screen reader should announce cart changes."

Add `aria-live="polite"` region in `CartPanel`:

```tsx
<div aria-live="polite" className="sr-only">
  {itemCount} items, total {formatCurrency(pricing.total)}
</div>
```

Quantity steppers already need `aria-label` (implemented on +/- buttons).

**Interview Answer:** "Polite live region reads item count and total from `selectCartPricing` — updates when qty changes. Stepper buttons already have `aria-label`; add live region for aggregate announcements."

**Example:** Change qty **2 → 3** → live region announces: **"3 items, total $147.50"** without reading every line item.

---

### Performance constraints

**Ask:** "Recalc on every keystroke in qty input?"

Debounce `setQuantity` on direct input, or only commit on blur. Keep `createSelector` for pricing — never store `subtotal` in state.

**Ask:** "100 line items in cart?"

Virtualize `CartPanel` list; pricing loop is O(n) — acceptable until ~500 lines, then server-side cart.

**Interview Answer:** "Commit qty on blur or debounce 300ms — reducer still clamps to stock. `createSelector` memoizes pricing; never store totals in Redux. Virtualize cart list only above ~100 lines."

**Example:** Type `"12"` in qty input → commits on **blur** (not every keystroke) → `selectCartPricing` recalcs once, not 2 times for `"1"` and `"12"`.

---

## Cross-Project Links

| Project            | Shared pattern                    |
| ------------------ | --------------------------------- |
| #5 Data Table      | Pure query pipeline, derived data |
| #4 Kanban          | Normalized `cardsById` map        |
| #6 Multi-Step Form | localStorage persistence          |
