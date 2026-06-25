# Interview Questions — Shopping Cart

---

## State Management Basics

### Q1. Why use `itemsById` instead of an array?

| Array | Normalized map |
| --- | --- |
| O(n) find by productId | O(1) lookup |
| Duplicate product data risk | Single source in `productsById` |
| Harder merge on add | Increment quantity in place |

**Interview Answer:** "Key cart lines by `productId` (or `productId:variantId` for colors). Catalog lives separately. Same pattern as Redux docs for relational data."

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
2. Resolve stock via `getProductStock(product, variantId)`
3. If no stock, return early
4. Build `lineKey` with `getCartLineKey(productId, variantId)`
5. If line exists → `quantity + 1`, clamp to stock
6. Else → `{ productId, variantId?, quantity: 1 }`

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

Memoizes output. If `itemsById` reference unchanged, skip recalculation — important when unrelated state (e.g. `categoryFilter` or `viewMode`) updates.

---

## Catalog & Filtering

### Q8. How does the advanced catalog filter pipeline work?

```
productsById
  → filter by category
  → filter by price range, rating, in-stock, free delivery
  → sort (name, price, rating)
  → render grid or list
```

All filter state lives in `advancedFilters` on the cart slice. Selectors compose — UI never stores filtered product arrays.

**Interview Answer:** "Filters are facts in Redux; the product list is always derived. `createSelector` chains category → advanced filters → sort so the grid only recalculates when inputs change."

---

### Q9. Why two catalog pages (`/` vs `/catalog`)?

| Route | Purpose |
| --- | --- |
| `/` | Minimal interview demo — category + inline cart |
| `/catalog` | Production-style UX — filters, drawer cart, grid/list |

Same Redux store, same cart. Different layout components.

**Interview Answer:** "One store, two views. Cart Demo proves normalized state + pricing. Advanced Catalog adds filter composition and drawer UX without duplicating cart logic."

---

### Q10. How do color variants affect the cart?

- Line key: `prd_009:prd_009_navy` (not just `prd_009`)
- Same product, two colors = two cart lines
- Stock clamped per variant via `getProductStock(product, variantId)`

**Interview Answer:** "Variants are a composite key problem. I store `variantId` on the line item and key `itemsById` by `productId:variantId` so navy and charcoal are separate rows."

---

## Real-World Patterns

### Q11. localStorage cart — pitfalls?

| Pitfall | Fix |
| --- | --- |
| Stale prices | Re-fetch catalog, recalc on load |
| Invalid product ids | Prune on catalog load |
| Over-stock qty | Clamp to `getProductStock()` |
| Schema changes | Version key (`cartpulse-cart-v1`) |
| Variant key migration | Parse old `productId`-only keys on hydrate |

---

### Q12. How would you sync cart after login?

1. Fetch server cart
2. Merge with local (max quantity? server wins?)
3. POST merged cart
4. Clear localStorage

---

### Q13. Promo code validation?

Client: quick UX check against known codes.

Production: **always re-validate on server** at checkout — client codes are hints only.

---

## Redux Specifics

### Q14. Why one `cart` slice for catalog + cart?

Could split at scale:

- `catalogSlice` — filters, `productsById`, load status
- `cartSlice` — `itemsById`, promo, persistence

This project keeps one slice for interview simplicity — mention you'd split when filter state or catalog API grows independently.

---

### Q15. Why explicit `RootState` in `types.ts`?

`hooks.ts` imports `RootState` from the store. If `RootState = ReturnType<typeof store.getState>` is in the same file that loads reducers, circular imports can make `state.cart` type as `unknown` in the IDE.

**Interview Answer:** "I define `RootState` explicitly with `cart: CartState` in a types file. Hooks import from there; no cycle with the store initializer."

---

### Q16. Immutability with nested updates?

RTK + Immer allows:

```typescript
state.itemsById[lineKey].quantity += 1
```

Under the hood it's immutable. Without Immer, spread at each level.

---

## UI Patterns

### Q17. Inline cart vs drawer cart — when to use which?

| Pattern | Best for |
| --- | --- |
| **Inline panel** (`CartPanel`) | Desktop checkout flows, always-visible summary |
| **Drawer** (`CartDrawer`) | Catalog-heavy pages — maximize product grid width |
| **Floating button** | Mobile-friendly cart access without permanent chrome |

**Interview Answer:** "Advanced catalog uses a drawer so filters + grid get full width. Cart Demo keeps inline panel to show selectors updating live — both share `CartContent`."

---

### Q18. Dual-range price slider — implementation notes?

Two overlapping `<input type="range">` on one track:

- Gray track = full bounds
- Teal fill = active range between thumbs
- Custom CSS thumbs (bullseye style)
- Min/max text inputs commit on blur

**Interview Answer:** "Native range inputs don't support dual thumbs in one element, so I stack two transparent ranges and paint the active segment with a div. Values sync to Redux `priceMin` / `priceMax`."

---

## Whiteboard Drills

### Q19. Implement cart reducer in 10 minutes

Minimum:

- `ADD_ITEM`
- `REMOVE_ITEM`
- `SET_QTY`
- Selector: `subtotal = sum(price * qty)`

---

### Q20. Bug: total doesn't update on qty change

Common causes:

- Mutating state outside Immer
- Storing total in state instead of selector
- Selector not reading updated `itemsById`

---

### Q21. Bug: filtered products don't update when price slider moves

Common causes:

- Storing filtered list in component state instead of selector
- `advancedFilters` mutated without Immer
- Selector not including `priceMin` / `priceMax` as inputs

---

## Rapid Fire

| Question | Short answer |
| --- | --- |
| Single source of truth for price? | `productsById[id].price` |
| Same product, two colors in cart? | Two keys: `id:variantA`, `id:variantB` |
| Free shipping threshold? | Derived in pricing fn ($75) |
| Test pricing? | Pure function unit tests |
| Context vs Redux for cart? | Redux for interview scale + DevTools |
| Grid vs list view state? | `advancedFilters.viewMode` |
| Sort in sidebar or top bar? | Sidebar — keeps results bar for count + view toggle |

---

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria | What to demonstrate in **CartPulse** | Example from this project |
| --- | --- | --- |
| **Component structure** | Catalog vs cart split; shared cart content | `CartContent` used by `CartPanel` and `CartDrawer` |
| **State management** | Normalized cart; derived totals never stored | `itemsById` + `selectCartPricing` |
| **Code readability** | Pure pricing + filter functions testable without React | `calculateCartPricing()`, `applyAdvancedFilters()` |
| **Edge cases** | Stock limits, variants, stale localStorage | `getProductStock`, `getCartLineKey`, prune on load |
| **Performance awareness** | Memoized selector chains | Pricing skips recalc when only `viewMode` changes |

**Strong signal:** You explain _why_ totals are derived, how variant keys work, and walk through a filter selector pipeline without being asked.

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **CartPulse**:

### Virtualization

**Ask:** "Catalog has 5,000 SKUs."

Use `@tanstack/react-virtual` on `AdvancedProductGrid` — only render visible rows.

**Interview Answer:** "Virtualize the product grid — cart panel stays O(items). Normalized `itemsById` unchanged; only render strategy changes."

---

### Optimistic updates

**Ask:** "Add to cart should feel instant before stock API confirms."

```typescript
dispatch(addItem({ productId, variantId }))
try {
  await reserveStock(productId, variantId)
} catch {
  dispatch(removeItem(lineKey))
  toast.error('Out of stock')
}
```

---

### Undo functionality

**Ask:** "User accidentally removed an item."

Snapshot `{ lineKey, productId, variantId, quantity }` before `removeItem`; toast Undo calls restore within 5s.

---

### URL-synced filters

**Ask:** "Shareable catalog links with filters."

```typescript
// /catalog?category=electronics&min=50&max=200&sort=price-asc
const [params, setParams] = useSearchParams()
useEffect(() => dispatch(setCategoryFilter(params.get('category'))), [params])
```

---

### Accessibility support

**Ask:** "Screen reader should announce cart changes."

Add `aria-live="polite"` region; drawer uses `role="dialog"` + Escape to close (implemented on `CartDrawer`).

---

### Performance constraints

**Ask:** "Recalc on every keystroke in qty input?"

Commit `setQuantity` on blur. Keep `createSelector` for pricing.

**Ask:** "100 line items in cart?"

Virtualize cart list; pricing loop is O(n) — acceptable until ~500 lines.

---

## Cross-Project Links

| Project | Shared pattern |
| --- | --- |
| #5 Data Table | Pure query pipeline, derived data |
| #4 Kanban | Normalized `cardsById` map |
| #6 Multi-Step Form | localStorage persistence |
| #8 Nested Comments | Selector composition, tree filtering |
