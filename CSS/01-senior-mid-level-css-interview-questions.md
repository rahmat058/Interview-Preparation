---
title: "Senior & Mid-Level CSS Interview Questions"
description: "CSS layout, specificity, Flexbox, Grid, responsive design, animations, performance, and modern features — with theory, examples, and interview answers."
tags:
  [
    "css",
    "frontend",
    "interview",
    "mid-level",
    "senior",
    "tailwind",
    "flexbox",
    "grid",
  ]
level: "Mid-Level to Senior (3–7+ years)"
---

# Senior & Mid-Level CSS Interview Questions

Practical CSS questions for **mid-level** and **senior frontend** roles. Each section includes **what they're testing**, a **one-line answer**, and a **code example** you can explain in a whiteboard or live coding round.

> Senior interviews go beyond syntax — they test **layout trade-offs**, **browser behavior**, **maintainability**, **accessibility**, and **performance at scale**.

---

## Table of Contents

### Fundamentals

1. [Box Model & `box-sizing`](#1-box-model--box-sizing)
2. [Specificity & Cascade](#2-specificity--cascade)
3. [`display: none` vs `visibility: hidden` vs `opacity`](#3-display-none-vs-visibility-hidden-vs-opacity)
4. [Positioning: static, relative, absolute, fixed, sticky](#4-positioning-static-relative-absolute-fixed-sticky)

### Layout Systems

5. [Flexbox vs Grid — when to use which](#5-flexbox-vs-grid--when-to-use-which)
6. [Centering an element (5 approaches)](#6-centering-an-element-5-approaches)
7. [Holy Grail / sidebar layouts](#7-holy-grail--sidebar-layouts)
8. [Container Queries vs Media Queries](#8-container-queries-vs-media-queries)

### Responsive & Modern CSS

9. [Mobile-first vs Desktop-first](#9-mobile-first-vs-desktop-first)
10. [CSS Custom Properties (variables)](#10-css-custom-properties-variables)
11. [`clamp()` for fluid typography](#11-clamp-for-fluid-typography)
12. [Logical properties (`margin-inline`, `padding-block`)](#12-logical-properties-margin-inline-padding-block)

### Architecture & Maintainability

13. [BEM naming convention](#13-bem-naming-convention)
14. [CSS Modules vs global CSS vs Tailwind](#14-css-modules-vs-global-css-vs-tailwind)
15. [`:is()`, `:where()`, `:has()`](#15-is-where-has)

### Animations & UX

16. [Transition vs Animation](#16-transition-vs-animation)
17. [`transform` vs animating `top`/`left`](#17-transform-vs-animating-topleft)
18. [`prefers-reduced-motion`](#18-prefers-reduced-motion)

### Performance & Debugging

19. [Critical CSS & render-blocking](#19-critical-css--render-blocking)
20. [Layout thrashing / forced reflow](#20-layout-thrashing--forced-reflow)
21. [Stacking context & `z-index`](#21-stacking-context--z-index)

### Accessibility

22. [Focus styles & `:focus-visible`](#22-focus-styles--focus-visible)
23. [Color contrast & not relying on color alone](#23-color-contrast--not-relying-on-color-alone)

### Senior Scenario Questions

24. [Design system tokens in CSS](#24-design-system-tokens-in-css)
25. [How would you migrate from CSS3 to Tailwind v4?](#25-how-would-you-migrate-from-css3-to-tailwind-v4)
26. [Cross-browser issues you've debugged](#26-cross-browser-issues-youve-debugged)

---

## Fundamentals

### 1. Box Model & `box-sizing`

**What they test:** Whether you understand why padding breaks fixed-width layouts.

**One-line answer:**

> `content-box` adds padding and border on top of width; `border-box` includes them inside the declared width — I set `box-sizing: border-box` globally for predictable layouts.

**Example:**

```css
/* Without border-box — width becomes 100% + 32px padding */
.card {
  width: 300px;
  padding: 16px;
  box-sizing: content-box; /* default */
}

/* With border-box — total width stays 300px */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 16px; /* included in 300px */
}
```

**Follow-up:** How does `min-width: 0` fix flex/grid overflow?  
Flex items default to `min-width: auto`, which prevents shrinking below content size. `min-width: 0` allows truncation/scroll inside flex children.

```css
.flex-row {
  display: flex;
}
.flex-row > .truncate-child {
  min-width: 0; /* allows text-overflow: ellipsis to work */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

### 2. Specificity & Cascade

**What they test:** Why styles don't apply and how you debug conflicts.

**One-line answer:**

> Specificity is (inline, IDs, classes/attributes/pseudo-classes, elements). Same specificity → last rule wins; `!important` overrides unless another `!important` is more specific.

**Example:**

```css
/* Specificity: 0,0,1,1 */
button.primary {
  color: blue;
}

/* Specificity: 0,0,2,1 — wins */
button.primary.active {
  color: green;
}

/* Specificity: 0,1,0,0 — ID beats classes */
#submit {
  color: red;
}
```

**Interview tip:** Prefer low-specificity patterns (single class, CSS variables) over chaining selectors — easier to override in component libraries.

```css
/* Hard to override */
.header nav ul li a.link {
  color: navy;
}

/* Better */
.nav-link {
  color: var(--color-link);
}
```

---

### 3. `display: none` vs `visibility: hidden` vs `opacity`

| Property             | In layout?           | Clickable?                          | Screen readers? |
| -------------------- | -------------------- | ----------------------------------- | --------------- |
| `display: none`      | No                   | No                                  | Hidden          |
| `visibility: hidden` | Yes (space reserved) | No                                  | Hidden          |
| `opacity: 0`         | Yes                  | Yes (unless `pointer-events: none`) | Still announced |

**One-line answer:**

> Use `display: none` to remove from layout; `visibility: hidden` to hide but keep space; `opacity: 0` for fade transitions — pair with `pointer-events: none` if it shouldn't receive clicks.

**Example (accessible skip link):**

```css
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  z-index: 100;
}
```

```html
<a href="#main" class="skip-link">Skip to content</a>
```

---

### 4. Positioning: static, relative, absolute, fixed, sticky

**One-line answer:**

> `absolute` positions relative to the nearest positioned ancestor; `fixed` to the viewport; `sticky` toggles between relative and fixed at a scroll threshold.

**Example — badge on avatar:**

```css
.avatar-wrap {
  position: relative;
  width: 48px;
  height: 48px;
}
.avatar-wrap .badge {
  position: absolute;
  top: -4px;
  right: -4px;
}
```

**Example — sticky table header:**

```css
.table-wrap {
  max-height: 400px;
  overflow: auto;
}
.table-wrap thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}
```

**Common trap:** `sticky` fails if any ancestor has `overflow: hidden`.

---

## Layout Systems

### 5. Flexbox vs Grid — when to use which

| Flexbox                             | Grid                                   |
| ----------------------------------- | -------------------------------------- |
| One-dimensional (row **or** column) | Two-dimensional (rows **and** columns) |
| Content-driven sizing               | Layout-driven tracks                   |
| Nav bars, toolbars, card footers    | Page layouts, dashboards, galleries    |

**One-line answer:**

> Flexbox for distributing items along a single axis; Grid when you need explicit rows and columns — often combined (Grid for page shell, Flex inside cells).

**Example — filter sidebar + content (from catalog patterns):**

```css
.catalog-layout {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .catalog-layout {
    grid-template-columns: 280px 1fr;
  }
}

.product-card {
  display: flex;
  flex-direction: column;
}
.product-card__footer {
  margin-top: auto; /* pushes button to bottom */
}
```

---

### 6. Centering an element (5 approaches)

**Interview answer:** Know multiple — context matters (unknown size, full viewport, flex child).

```css
/* 1. Flexbox on parent — most common */
.modal-backdrop {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
}

/* 2. Grid on parent */
.center-grid {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}

/* 3. Absolute + transform — fixed size or unknown */
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 4. Absolute + inset + margin auto */
.panel {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 320px;
  height: fit-content;
}

/* 5. Text center (inline content only) */
.hero {
  text-align: center;
}
```

**Native `<dialog>` centering** (used in vanilla CRUD modals):

```css
dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  border: none;
}
```

---

### 7. Holy Grail / sidebar layouts

**One-line answer:**

> Modern approach: CSS Grid with `grid-template-columns` and `minmax(0, 1fr)` to prevent overflow — no floats or negative margins.

```css
.app-shell {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100dvh;
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.main {
  grid-area: main;
  min-width: 0;
}
.footer {
  grid-area: footer;
}

@media (max-width: 767px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }
  .sidebar {
    display: none;
  }
}
```

---

### 8. Container Queries vs Media Queries

**One-line answer:**

> Media queries respond to **viewport**; container queries respond to a **parent's size** — better for reusable components (cards, tables) in variable-width sidebars.

**Example:**

```css
.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}

@container card-grid (min-width: 480px) {
  .product-card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}
```

**When to use viewport queries:** Global layout breakpoints (nav collapse, page padding).

---

## Responsive & Modern CSS

### 9. Mobile-first vs Desktop-first

**One-line answer:**

> Mobile-first writes base styles for small screens, then `min-width` media queries add complexity — fewer overrides, aligns with performance and progressive enhancement.

```css
/* Mobile-first */
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

### 10. CSS Custom Properties (variables)

**One-line answer:**

> Custom properties are live, inheritable, and runtime-updatable — ideal for design tokens and theming; Sass variables compile away.

```css
:root {
  --color-brand-600: #2563eb;
  --radius-lg: 0.75rem;
  --space-4: 1rem;
}

.button-primary {
  background: var(--color-brand-600);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

/* Dark theme — swap at root */
[data-theme="dark"] {
  --color-brand-600: #3b82f6;
  --surface: #0f172a;
}
```

**Tailwind v4 `@theme`:**

```css
@import "tailwindcss";

@theme inline {
  --color-brand-600: #2563eb;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

---

### 11. `clamp()` for fluid typography

**One-line answer:**

> `clamp(min, preferred, max)` scales between breakpoints without extra media queries — preferred is often a `vw`-based value.

```css
h1 {
  font-size: clamp(1.5rem, 2.5vw + 1rem, 2.25rem);
  line-height: 1.2;
}

.hero {
  padding: clamp(1rem, 5vw, 4rem);
}
```

---

### 12. Logical properties (`margin-inline`, `padding-block`)

**One-line answer:**

> Logical properties map to writing direction — `margin-inline-start` becomes left in LTR and right in RTL, so one stylesheet supports internationalization.

```css
/* Physical — breaks in RTL */
.card {
  margin-left: 1rem;
}

/* Logical — direction-aware */
.card {
  margin-inline-start: 1rem;
}
.toolbar {
  padding-block: 0.75rem;
  padding-inline: 1rem;
}
```

---

## Architecture & Maintainability

### 13. BEM naming convention

**Block · Element · Modifier**

**One-line answer:**

> BEM keeps specificity flat: `.card`, `.card__title`, `.card--featured` — no descendant selectors, easier to reason about in large codebases.

```html
<article class="product-card product-card--sale">
  <h3 class="product-card__title">Wireless Headphones</h3>
  <p class="product-card__price">$149</p>
</article>
```

```css
.product-card {
}
.product-card__title {
}
.product-card__price {
}
.product-card--sale .product-card__price {
  color: #dc2626;
}
```

---

### 14. CSS Modules vs global CSS vs Tailwind

| Approach        | Pros                             | Cons                                     |
| --------------- | -------------------------------- | ---------------------------------------- |
| **Global CSS**  | Simple, no build step            | Naming collisions, high specificity wars |
| **CSS Modules** | Scoped class names, co-located   | Verbose class strings in JSX             |
| **Tailwind**    | Fast iteration, consistent scale | HTML noise, learning curve               |

**One-line answer:**

> I pick based on team and scale: Tailwind for speed and design tokens at scale; CSS Modules when components need isolated styles without utility classes; global tokens for shared variables either way.

**Vanilla JS + Tailwind pattern** (from `02-catalog-spa`):

```javascript
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/20";
```

---

### 15. `:is()`, `:where()`, `:has()`

**One-line answer:**

> `:is()` groups selectors (takes highest specificity); `:where()` groups with zero specificity; `:has()` is the parent selector — style a card when it contains an image or invalid input.

```css
/* Group without specificity explosion */
:where(h1, h2, h3) {
  line-height: 1.2;
}

/* Parent selector — card with image gets layout */
.product-card:has(img) {
  display: grid;
  grid-template-columns: 80px 1fr;
}

/* Form validation styling */
.field:has(input:user-invalid) {
  border-color: #dc2626;
}
```

---

## Animations & UX

### 16. Transition vs Animation

| `transition`                | `@keyframes` / `animation`   |
| --------------------------- | ---------------------------- |
| A → B on property change    | Multi-step, looping, complex |
| Hover, focus, state toggles | Loaders, entrances, marquees |

```css
.button {
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;
}
.button:hover {
  background-color: #1d4ed8;
}
.button:active {
  transform: scale(0.98);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  animation: spin 0.8s linear infinite;
}
```

---

### 17. `transform` vs animating `top`/`left`

**One-line answer:**

> `transform` and `opacity` are compositor-friendly (GPU layer); animating `top`, `left`, `width`, `height` triggers layout/paint and causes jank — use `transform: translate()` for movement.

```css
/* Bad for 60fps — triggers layout every frame */
.panel {
  top: 0;
  transition: top 0.3s;
}
.panel.open {
  top: 100px;
}

/* Good — compositor only */
.drawer {
  transform: translateX(100%);
  transition: transform 0.3s ease;
}
.drawer.open {
  transform: translateX(0);
}
```

---

### 18. `prefers-reduced-motion`

**One-line answer:**

> Respect user OS settings — disable or shorten motion for vestibular disorders; never block critical UI.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance & Debugging

### 19. Critical CSS & render-blocking

**One-line answer:**

> CSS in `<head>` blocks first paint until parsed — inline critical above-the-fold styles, defer non-critical, split by route in SPAs, use `media` attribute for print/non-essential sheets.

```html
<link
  rel="stylesheet"
  href="/non-critical.css"
  media="print"
  onload="this.media='all'"
/>
```

---

### 20. Layout thrashing / forced reflow

**One-line answer:**

> Reading layout (`offsetHeight`, `getBoundingClientRect`) after writing styles forces synchronous reflow — batch reads, then writes, or use `requestAnimationFrame`.

```javascript
// Bad — interleaved read/write causes thrashing
elements.forEach((el) => {
  el.style.width = el.offsetWidth + 10 + "px"; // read then write per element
});

// Better — read all, then write all
const widths = elements.map((el) => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + "px";
});
```

---

### 21. Stacking context & `z-index`

**One-line answer:**

> `z-index` only compares within the same stacking context — new contexts come from `position` + `z-index`, `opacity < 1`, `transform`, `filter`, `isolation: isolate`.

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
}
.modal {
  position: fixed;
  z-index: 50; /* above backdrop — same root context */
}

/* Trap: child z-index: 9999 won't escape parent's lower context */
.sidebar {
  position: relative;
  z-index: 1;
  transform: translateZ(0); /* creates new stacking context */
}
```

**Fix for dropdowns in tables:** `isolation: isolate` on cell or portal dropdown to `document.body`.

---

## Accessibility

### 22. Focus styles & `:focus-visible`

**One-line answer:**

> `:focus` applies on click too (ugly rings); `:focus-visible` shows outline only for keyboard users — never remove focus indicators without a replacement.

```css
.button:focus {
  outline: none; /* only if focus-visible is defined */
}
.button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

---

### 23. Color contrast & not relying on color alone

**One-line answer:**

> WCAG AA requires 4.5:1 for normal text, 3:1 for large text — status badges need icon, label, or pattern in addition to color.

```html
<span class="badge badge--success">
  <span aria-hidden="true">●</span>
  Active
</span>
```

```css
.badge--success {
  background: #d1fae5;
  color: #065f46; /* check contrast ratio */
}
```

---

## Senior Scenario Questions

### 24. Design system tokens in CSS

**Question:** How do you structure tokens for a multi-product design system?

**Answer structure:**

1. **Primitive tokens** — raw values (`--blue-600: #2563eb`)
2. **Semantic tokens** — intent (`--color-action-primary: var(--blue-600)`)
3. **Component tokens** — scoped (`--button-bg: var(--color-action-primary)`)

```css
:root {
  --blue-600: #2563eb;
  --color-action-primary: var(--blue-600);
  --button-primary-bg: var(--color-action-primary);
}
```

Products override semantics, not every component:

```css
[data-product="checkout"] {
  --color-action-primary: #0d9488;
}
```

---

### 25. How would you migrate from CSS3 to Tailwind v4?

**Real example** (from `vanilla-js/02-catalog-spa` migration):

| Before (CSS3)                  | After (Tailwind v4)                            |
| ------------------------------ | ---------------------------------------------- |
| `.header { display: flex; … }` | `class="flex items-center justify-between …"`  |
| `:root { --teal: #0d9488 }`    | `@theme inline { --color-brand-600: #0d9488 }` |
| `app.css` 170 lines            | `app.css` ~30 lines (import + theme only)      |

**Steps:**

1. Add `@tailwindcss/vite` plugin
2. Replace `link` stylesheet with `import './styles/app.css'` in JS entry
3. Move layout/component styles to utility classes in templates
4. Keep minimal CSS for things Tailwind doesn't cover (`dialog` centering, `accent-color` on range inputs)
5. Extract repeated class strings to constants in vanilla JS

```javascript
const inputClass = "w-full rounded-xl border border-slate-200 …";
```

---

### 26. Cross-browser issues you've debugged

**Sample senior answer (STAR format):**

> **Situation:** Sticky filter sidebar jumped on iOS Safari.  
> **Cause:** Parent had `overflow: hidden`; `-webkit-overflow-scrolling` on wrong ancestor.  
> **Fix:** Removed overflow on wrapper, used `position: sticky; top: 6rem` on sidebar with explicit `align-self: start` in grid.  
> **Result:** Consistent behavior across Chrome and Safari.

**Other common topics:**

- Flex gap not supported in old Safari → margin fallback or `@supports`
- `100vh` mobile browser chrome → use `100dvh`
- Date input styling inconsistent → custom picker or accept platform UI

---

## Quick-Fire Round (30-second answers)

| Question                    | Answer                                                                    |
| --------------------------- | ------------------------------------------------------------------------- |
| `rem` vs `em`?              | `rem` = root font size (predictable); `em` = parent font size (compounds) |
| `inline` vs `inline-block`? | `inline-block` accepts width/height and vertical margin                   |
| `object-fit: cover`?        | Image fills box, crops overflow — avatars, cards                          |
| `aspect-ratio: 16/10`?      | Reserve space before image loads — reduces CLS                            |
| `will-change`?              | Hint compositor; remove after animation — don't overuse                   |
| `@layer` in CSS?            | Control cascade order: `@layer base, components, utilities`               |
| Tailwind `@apply`?          | Extract utilities to a class — use sparingly; prefer utilities in markup  |
| Print styles?               | `@media print { .no-print { display: none } }`                            |

---

## Live Coding Prompts (Practice)

1. **Build a responsive card grid** — 1 col mobile, 2 tablet, 3 desktop, equal-height cards with bottom-aligned CTA (Flexbox `margin-top: auto`).
2. **Style a data table** — sticky header, zebra rows, truncate long email with ellipsis (`min-width: 0` on cell).
3. **Dual-range price slider** — `accent-color`, custom thumb via `::-webkit-slider-thumb` or layered inputs.
4. **Modal** — centered `<dialog>`, backdrop blur, focus trap (native dialog handles this).
5. **Skeleton loader** — `animate-pulse` or `@keyframes shimmer` with `background-size` gradient.

---

## Map to This Repo

| Topic                | Where to demo                                               |
| -------------------- | ----------------------------------------------------------- |
| Tailwind v4 + tokens | `Projects/vanilla-js/02-catalog-spa`, `04-data-table`       |
| Flex/Grid layouts    | `04-data-table` filters + table, `09-shopping-cart` catalog |
| Custom range slider  | `09-shopping-cart` `DualRangeSlider` + `index.css`          |
| Modal / focus        | `04-data-table` `<dialog>`, `01-ui-component-kit` Modal     |
| Design tokens        | `01-ui-component-kit` `tokens.css`                          |
| Performance CSS      | `03-performance-patterns` lazy images, virtual list         |

---

## Recommended Study Order

1. **Mid-level:** Box model → Flexbox → Grid → responsive → specificity
2. **Senior:** Stacking contexts → performance → architecture (tokens, Tailwind vs modules) → a11y → container queries
3. **Practice:** Rebuild one layout from this repo without Tailwind, then explain why you'd choose utilities
