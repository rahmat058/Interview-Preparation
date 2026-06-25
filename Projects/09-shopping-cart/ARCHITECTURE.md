# Architecture — Shopping Cart

## Overview

CartPulse demonstrates **normalized Redux state** for e-commerce carts — the pattern used by Shopify, Amazon frontends, and most checkout flows. Cart lines are keyed by `productId` (or `productId:variantId` when a color is selected); prices are **derived**, never duplicated in state.

The app has two catalog experiences:

| Route | UX | Cart UI |
| --- | --- | --- |
| `/` | Simple category filter + name sort | Inline `CartPanel` (sticky sidebar) |
| `/catalog` | Advanced filters, grid/list toggle | `FloatingCartButton` → `CartDrawer` |

Product detail at `/products/:productId` supports **color variants** with per-variant stock.

---

## Routing

```
BrowserRouter (main.tsx)
└── App
    ├── Header (nav: Cart Demo | Advanced Catalog)
    ├── Routes
    │   ├── /              → ShopApp
    │   ├── /catalog       → AdvancedCatalogPage
    │   └── /products/:id  → ProductDetailPage
    └── Footer
```

Catalog data loads once via `loadProductCatalog` thunk; all routes share the same Redux store.

---

## State Model

```typescript
interface CartState {
  productsById: Record<string, Product>
  meta: ProductsMeta | null
  itemsById: Record<string, CartLineItem>
  promoCode: string | null
  categoryFilter: ProductCategory
  advancedFilters: AdvancedFilters
  catalogStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  catalogError: string | null
  restoredFromStorage: boolean
}

interface CartLineItem {
  productId: string
  variantId?: string
  quantity: number
}

interface AdvancedFilters {
  priceMin: number
  priceMax: number
  minRating: number
  inStockOnly: boolean
  freeDeliveryOnly: boolean
  sortBy: CatalogSortBy
  viewMode: 'grid' | 'list'
}
```

| Slice | Source | Mutable by user? |
| --- | --- | --- |
| `productsById` | Catalog API | No |
| `itemsById` | User actions | Yes |
| `promoCode` | User input | Yes |
| `categoryFilter` | Filter UI | Yes |
| `advancedFilters` | Advanced catalog UI | Yes |

**Why normalized `itemsById`?**

- O(1) lookup: `itemsById[lineKey]`
- No duplicate product data in cart
- Same product + different variant = separate lines
- Interviewers expect this over `cartItems: CartLine[]`

**Line key helper:**

```typescript
getCartLineKey(productId, variantId) // → 'prd_009' or 'prd_009:prd_009_navy'
```

---

## Reducers

| Action | Behavior |
| --- | --- |
| `addItem({ productId, variantId? })` | Insert qty 1 or increment, clamp to variant/product stock |
| `removeItem(lineKey)` | Delete key from `itemsById` |
| `setQuantity({ lineKey, productId, variantId?, quantity })` | Clamp 1..stock; qty ≤ 0 removes |
| `incrementQuantity` / `decrementQuantity` | Stepper helpers (pass `lineKey`) |
| `clearCart` | Reset items + promo |
| `applyPromoCode` | Validate against `PROMO_CODES` map |
| `setCategoryFilter` | Category pill / filter |
| `setPriceRange` | `{ min, max }` for advanced catalog |
| `setMinRating` / `setInStockOnly` / `setFreeDeliveryOnly` | Advanced filters |
| `setSortBy` / `setCatalogViewMode` | Sort + grid/list |
| `resetAdvancedFilters` | Reset filters + category to defaults |
| `loadProductCatalog` | Async fetch → normalize `productsById` |

All reducers use Immer via RTK — safe "mutation" syntax.

---

## Derived State (Selectors)

**Never store `subtotal` or `total` in Redux.**

```typescript
export const selectCartPricing = createSelector(
  [selectItemsById, selectProductsById, selectPromoCode],
  (itemsById, productsById, promoCode) =>
    calculateCartPricing({ itemsById, productsById, promoCode }),
)
```

### Catalog selector pipeline

```
selectProductsById
  → selectFilteredProducts          (category)
  → applyAdvancedFilters            (price, rating, stock, delivery)
  → sortProducts                    (sortBy)
  → selectAdvancedFilteredProducts
```

`RootState` is defined explicitly in `lib/store/types.ts` to avoid circular imports with typed hooks.

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

### Cart Demo (`/`)

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

### Advanced Catalog (`/catalog`)

```
AdvancedCatalogPage
├── CatalogToolbar (left, sticky)
│   ├── CategoryFilter (pills)
│   ├── PriceRangeFilter (dual-thumb slider + min/max inputs)
│   ├── SortSelect
│   ├── RatingFilter (pills)
│   └── InStockFilter (FilterCheckbox cards)
├── AdvancedProductGrid (right)
│   ├── CatalogResultsBar (count + grid/list toggle)
│   └── ProductCard (catalog-grid | catalog-list)
├── FloatingCartButton
└── CartDrawer (slide-over)
    └── CartContent (variant="drawer")
```

### Product Detail (`/products/:id`)

```
ProductDetailPage
├── Product image (emoji per variant)
├── ColorVariantPicker
├── Quantity stepper / Add to cart
└── Stock per selected variant via getProductStock()
```

---

## Variants

Products may include `variants[]` with per-color stock:

```typescript
interface ProductVariant {
  id: string
  color: string
  hex: string
  stock: number
}
```

- Detail page: user picks variant → `addItem({ productId, variantId })`
- Cart line: shows variant color name
- Stock clamping uses variant stock when `variantId` is set

---

## Stock Enforcement

```typescript
getProductStock(product, variantId?) // variant stock or product.stock
clampQuantity(qty, stock) → Math.max(1, Math.min(qty, stock))
```

Applied on: add, setQuantity, increment, catalog hydration.

---

## Mock API

| Endpoint | File | Latency |
| --- | --- | --- |
| `GET /products` | `cartApi.ts` | 300–600ms |
| 12 products | `products.json` | 4 categories, 5 with color variants |

Swap `fetchProducts` for real backend — cart logic unchanged.

---

## Extension Points

1. **Optimistic checkout** — async thunk + loading state on Checkout button
2. **Cart merge on login** — hydrate server cart + local cart
3. **URL-synced filters** — `useSearchParams` for category, price, sort on `/catalog`
4. **Undo remove** — toast with 5s restore (like Gmail)
5. **Separate catalog slice** — split `advancedFilters` from cart at scale

---

## File Map

```
src/
├── App.tsx                          # Routes
├── main.tsx                         # BrowserRouter + StoreProvider
├── lib/
│   ├── types/cart.ts                # Product, CartState, variants, filters
│   ├── store/
│   │   ├── index.ts
│   │   ├── types.ts                 # RootState (explicit, no circular deps)
│   │   ├── hooks.ts                 # useAppDispatch / useAppSelector
│   │   ├── slices/cartSlice.ts
│   │   └── selectors/cartSelectors.ts
│   └── utils/
│       ├── cartPricing.ts           # pure pricing
│       ├── cartPersistence.ts
│       ├── productCatalog.ts        # filter + sort helpers
│       └── productDisplay.ts        # promo badges, seller, delivery
├── hooks/
│   ├── useCartPersistence.ts
│   └── useCatalogLoader.ts
└── components/
    ├── page/
    │   ├── ShopApp.tsx
    │   ├── AdvancedCatalogPage.tsx
    │   └── ProductDetailPage.tsx
    ├── catalog/
    │   ├── CatalogToolbar.tsx
    │   ├── DualRangeSlider.tsx
    │   ├── CatalogViewToggle.tsx
    │   ├── ColorVariantPicker.tsx
    │   └── ProductCard.tsx
    ├── cart/
    │   ├── CartPanel.tsx            # inline (/)
    │   ├── CartDrawer.tsx           # slide-over (/catalog)
    │   ├── CartContent.tsx          # shared body
    │   └── FloatingCartButton.tsx
    └── ui/
        ├── Button.tsx
        └── FilterCheckbox.tsx
```
