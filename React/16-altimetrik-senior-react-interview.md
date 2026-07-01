---
title: "Altimetrik Senior React Developer Interview Preparation"
description: "3-round Altimetrik interview — JavaScript, React internals, CSS, Redux, architecture, and live coding."
tags: ["react", "altimetrik", "senior", "interview", "javascript", "redux"]
level: "Senior (4+ years)"
company: "Altimetrik"
---

# Altimetrik Senior React Developer Interview Preparation

Questions from a **Senior React Developer** interview at Altimetrik — spanning **3 rounds**: Technical, Advanced JS, and Client round (React internals). Each topic includes **Theory**, **Pros & Cons**, **One-Line Interview Answer**, and **Real Examples**.

> Senior interviews test **JavaScript fundamentals**, **coding skills**, **React internals**, **CSS**, **architecture**, and **real project experience** — not just hooks.

---

<a id="quick-index"></a>

## Quick index


### 1st Round — Technical Interview

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Closure](#p1) |
| <span id="i2"></span>2 | [Event Loop](#p2) |
| <span id="i3"></span>3 | [Debouncing and Throttling](#p3) |
| <span id="i4"></span>4 | [Web Accessibility & Semantic Elements](#p4) |
| <span id="i5"></span>5 | [Flexbox vs Grid](#p5) |
| <span id="i6"></span>6 | [Find Missing Numbers in Array](#p6) |
| <span id="i7"></span>7 | [CSR vs SSR](#p7) |
| <span id="i8"></span>8 | [call(), apply(), bind()](#p8) |
| <span id="i9"></span>9 | [Star Rating Component (1–10)](#p9) |
| <span id="i10"></span>10 | [Deep Copy vs Shallow Copy](#p10) |
| <span id="i11"></span>11 | [Redux Workflow](#p11) |
| <span id="i12"></span>12 | [React Architecture](#p12) |

### 2nd Round — Advanced JavaScript

| # | Section |
| --- | --- |
| <span id="i13"></span>13 | [Objects in JavaScript](#p13) |
| <span id="i14"></span>14 | [Types of Objects & How to Define Them](#p14) |
| <span id="i15"></span>15 | [Normal vs Arrow Functions](#p15) |
| <span id="i16"></span>16 | [const vs let — When to Use Which](#p16) |
| <span id="i17"></span>17 | [Spread vs Rest Operator](#p17) |
| <span id="i18"></span>18 | [async/await](#p18) |
| <span id="i19"></span>19 | [CSS Specificity](#p19) |
| <span id="i20"></span>20 | [display: none vs visibility: hidden](#p20) |

### Client Round — React Internals

| # | Section |
| --- | --- |
| <span id="i21"></span>21 | [Hooks inside conditions?](#p21) |
| <span id="i22"></span>22 | [useEffect vs useMemo — execution order](#p22) |
| <span id="i23"></span>23 | [Render Phase vs Commit Phase](#p23) |
| <span id="i24"></span>24 | [Garbage Collection](#p24) |
| <span id="i25"></span>25 | [Batching in React](#p25) |
| <span id="i26"></span>26 | [Flatten Array without built-in methods](#p26) |

---
# 1st Round — Technical Interview

<a id="p1"></a>

## 1. Closure

### Theory

A **closure** is a function that retains access to variables from its **lexical scope** even after the outer function has returned. The inner function "closes over" the outer variables.

### Pros & Cons

| Pros | Cons |
|------|------|
| Data privacy / encapsulation | Memory — outer vars stay alive |
| Factory functions, memoization | Loop + var bugs without let |
| Module pattern | Debugging deep chains |

### One-Line Interview Answer

> A closure is a function bundled with its surrounding scope. The inner function accesses outer variables even after the outer function finishes — I use it for privacy, debouncing, and custom hooks.

### Real Example

```javascript
function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter(10);
counter.increment();
console.log(counter.getCount()); // 11
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Event Loop

### Theory

JavaScript is single-threaded. The **event loop** runs sync code first, drains all **microtasks** (Promises), then one **macrotask** (setTimeout), and repeats.

### One-Line Interview Answer

> Sync code runs first, then all microtasks like Promises, then one macrotask like setTimeout. That's why Promise.then runs before setTimeout.

### Real Example

```javascript
console.log("1");
setTimeout(() => console.log("4"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("2");
// 1 → 2 → 3 → 4
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Debouncing and Throttling

### Theory

| | Debounce | Throttle |
|--|----------|----------|
| **Behavior** | Wait for pause, run once | Run at most once per interval |
| **Use for** | Search input, auto-save | Scroll, resize, rate limiting |

### One-Line Interview Answer

> Debounce waits until activity stops — great for search. Throttle limits execution to once per interval — great for scroll handlers.

### Real Example

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Web Accessibility and Semantic Elements

### Theory

**Web Accessibility (a11y)** ensures apps are usable by everyone — screen readers, keyboard users, motor impairments. **Semantic HTML** uses meaningful tags (`<nav>`, `<main>`, `<article>`) instead of generic `<div>`.

WCAG principles: **Perceivable, Operable, Understandable, Robust**.

### Semantic elements

| Element | Purpose |
|---------|---------|
| `<header>` | Page/section header |
| `<nav>` | Navigation links |
| `<main>` | Primary content (one per page) |
| `<article>` | Self-contained content |
| `<section>` | Thematic grouping |
| `<aside>` | Sidebar, related content |
| `<footer>` | Footer info |
| `<button>` | Actions (not `<div onClick>`) |

### One-Line Interview Answer

> Accessibility means building for all users — semantic HTML, ARIA labels, keyboard navigation, and color contrast. Semantic elements give meaning to screen readers and improve SEO.

### Real Example

```jsx
// ❌ Inaccessible
<div onClick={submit}>Submit</div>
<div className="nav">...</div>

// ✅ Accessible
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
    </ul>
  </nav>
</header>
<main id="main-content">
  <article>
    <h1>Transaction History</h1>
    <button type="submit" onClick={submit}>Submit</button>
  </article>
</main>
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Flexbox vs Grid

### Theory

| | Flexbox | Grid |
|--|---------|------|
| **Dimension** | 1D (row OR column) | 2D (rows AND columns) |
| **Control** | Content-driven sizing | Layout-driven template |
| **Best for** | Navbars, card rows, alignment | Page layouts, dashboards |

### One-Line Interview Answer

> Flexbox is for one-dimensional layouts — aligning items in a row or column. Grid is for two-dimensional page layouts with precise row and column control.

### Real Example

```css
/* Flexbox — navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Grid — dashboard */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "sidebar main";
  gap: 1rem;
}
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Find Missing Numbers in Array

### Theory

Given `[1, 2, 3, 5, 7]`, find missing numbers in the sequence → `[4, 6]`.

Approaches: loop with expected counter, Set comparison, or math range filter.

### One-Line Interview Answer

> I iterate from min to max, check which numbers aren't in the array using a Set for O(1) lookup, and collect missing ones.

### Implementation

```javascript
function findMissingNumbers(arr) {
  if (!arr.length) return [];

  const set = new Set(arr);
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const missing = [];

  for (let i = min; i <= max; i++) {
    if (!set.has(i)) missing.push(i);
  }

  return missing;
}

console.log(findMissingNumbers([1, 2, 3, 5, 7])); // [4, 6]
console.log(findMissingNumbers([1, 3, 6, 10]));    // [2, 4, 5, 7, 8, 9]
```

```javascript
// Alternative — without Set (Altimetrik may ask no built-ins)
function findMissingNumbersLoop(arr) {
  const missing = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const diff = arr[i + 1] - arr[i];
    for (let j = 1; j < diff; j++) {
      missing.push(arr[i] + j);
    }
  }
  return missing;
}

console.log(findMissingNumbersLoop([1, 2, 3, 5, 7])); // [4, 6]
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. CSR vs SSR

### Theory

| | CSR | SSR |
|--|-----|-----|
| **Render location** | Browser | Server |
| **First HTML** | Empty shell + JS bundle | Full HTML with data |
| **SEO** | Poor without extra work | Excellent |
| **TTFB** | Fast | Slower (server work) |
| **Interactivity** | After JS loads | After hydration |
| **Best for** | Dashboards, auth apps | SEO pages, public content |

### One-Line Interview Answer

> CSR renders in the browser — fast shell but poor SEO. SSR renders on the server — full HTML on first load, better SEO, but higher server cost.

### Real Example

```jsx
// CSR — Vite/CRA SPA
// index.html: <div id="root"></div>
// User sees blank → JS downloads → React renders

// SSR — Next.js
export async function getServerSideProps() {
  const products = await fetchProducts();
  return { props: { products } };
}
export default function Page({ products }) {
  return <ProductList data={products} />; // HTML sent with data
}
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. call(), apply(), bind()

### Theory

| Method | Invokes? | Args | Returns |
|--------|----------|------|---------|
| `call` | Yes | Comma-separated | Result |
| `apply` | Yes | Array | Result |
| `bind` | No | Comma-separated | New function |

### One-Line Interview Answer

> call and apply invoke immediately with a specific this — apply takes args as array. bind returns a new function with this permanently bound.

### Real Example

```javascript
function format(currency, amount) {
  return `${currency}${amount}`;
}

format.call({ currency: "₹" }, "₹", 500);   // "₹500"
format.apply({ currency: "$" }, ["$", 49]);  // "$49"

const formatINR = format.bind(null, "₹");
formatINR(299); // "₹299"
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Star Rating Component (1–10)

### Theory

Build an interactive star rating from 1 to 10 — click to rate, hover preview, accessible with keyboard and ARIA.

### One-Line Interview Answer

> I render 10 star buttons, track hover and selected state, use aria-label for accessibility, and support keyboard navigation with arrow keys.

### React Implementation

```tsx
import { useState } from "react";

function StarRating({
  max = 10,
  value,
  onChange,
  readOnly = false,
}: {
  max?: number;
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(value ?? 0);
  const display = hover || selected;

  const handleClick = (rating: number) => {
    if (readOnly) return;
    setSelected(rating);
    onChange?.(rating);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (readOnly) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(rating);
    }
    if (e.key === "ArrowRight") handleClick(Math.min(rating + 1, max));
    if (e.key === "ArrowLeft") handleClick(Math.max(rating - 1, 1));
  };

  return (
    <div
      role="radiogroup"
      aria-label={`Rating out of ${max}`}
      onMouseLeave={() => !readOnly && setHover(0)}
    >
      {Array.from({ length: max }, (_, i) => {
        const rating = i + 1;
        const filled = rating <= display;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={selected === rating}
            aria-label={`${rating} out of ${max}`}
            disabled={readOnly}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !readOnly && setHover(rating)}
            onKeyDown={(e) => handleKeyDown(e, rating)}
            style={{
              background: "none",
              border: "none",
              cursor: readOnly ? "default" : "pointer",
              fontSize: "1.5rem",
              color: filled ? "#f59e0b" : "#d1d5db",
            }}
          >
            ★
          </button>
        );
      })}
      <span aria-live="polite">{selected > 0 ? `${selected}/${max}` : ""}</span>
    </div>
  );
}

// Usage
<StarRating max={10} onChange={(r) => console.log("Rated:", r)} />
```

### Vanilla JS Version

```javascript
function createStarRating(container, max = 10, onRate) {
  container.setAttribute("role", "radiogroup");
  container.innerHTML = "";

  for (let i = 1; i <= max; i++) {
    const star = document.createElement("button");
    star.textContent = "★";
    star.setAttribute("aria-label", `${i} out of ${max}`);
    star.style.cssText = "background:none;border:none;font-size:24px;cursor:pointer;color:#d1d5db";

    star.onmouseenter = () => highlight(i);
    star.onclick = () => { onRate?.(i); highlight(i, true); };
    container.appendChild(star);
  }

  container.onmouseleave = () => highlight(0);

  function highlight(upTo, persist = false) {
    container.querySelectorAll("button").forEach((btn, idx) => {
      btn.style.color = idx < upTo ? "#f59e0b" : "#d1d5db";
    });
  }
}
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Deep Copy vs Shallow Copy

### Theory

| | Shallow | Deep |
|--|---------|------|
| Top level | New ref | New ref |
| Nested | **Shared** | **Independent** |
| Methods | spread, Object.assign | structuredClone, recursive |

### One-Line Interview Answer

> Shallow copy shares nested references. Deep copy recursively clones everything — I use structuredClone in modern code.

### Real Example

```javascript
const original = { user: { name: "Amit" }, tags: ["react"] };

const shallow = { ...original };
shallow.user.name = "Rahul";
console.log(original.user.name); // "Rahul" — shared!

const deep = structuredClone(original);
deep.user.name = "Priya";
console.log(original.user.name); // "Amit" — unchanged
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Redux Workflow

### Theory

Redux flow: **UI → dispatch(action) → reducer(state, action) → new state → UI re-renders**

Components never mutate state directly. Reducers are pure functions.

### One-Line Interview Answer

> User action dispatches an action object, the reducer computes new state immutably, the store updates, and useSelector triggers re-render. RTK simplifies this with slices and createAsyncThunk.

### Real Example

```tsx
// 1. Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => { state.items.push(action.payload); },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

// 2. Store
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// 3. Provider
<Provider store={store}><App /></Provider>

// 4. Component
function Cart() {
  const items = useSelector((s) => s.cart.items);
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(addItem(product))}>
      Cart ({items.length})
    </button>
  );
}
```

```
Workflow:
Click "Add" → dispatch(addItem(product))
→ reducer runs → state.cart.items updated
→ useSelector detects change → Cart re-renders
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. React Architecture

### Theory

Production React architecture organizes code by **feature**, separates concerns, and scales with team size.

### Layers

```
┌─────────────────────────────────────┐
│  Presentation — Components, Pages   │
├─────────────────────────────────────┤
│  Application — Hooks, State, Router  │
├─────────────────────────────────────┤
│  Domain — Services, API, Business Logic│
├─────────────────────────────────────┤
│  Infrastructure — HTTP, Auth, Config │
└─────────────────────────────────────┘
```

### One-Line Interview Answer

> I use feature-based folders, separate UI from business logic via hooks and services, shared design system components, TanStack Query for server state, Redux for global client state, and lazy-loaded routes.

### Real Example

```
src/
├── app/                    # Router, providers, shell
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx       # QueryClient, Redux, Theme
├── features/
│   ├── auth/
│   │   ├── components/     # LoginForm, ProtectedRoute
│   │   ├── hooks/          # useAuth
│   │   ├── api/            # authService.ts
│   │   └── types.ts
│   ├── dashboard/
│   └── transactions/
├── shared/
│   ├── components/         # Button, Modal, StarRating
│   ├── hooks/
│   └── utils/
└── services/
    └── httpClient.ts       # Axios instance + interceptors
```

**Data flow:** Component → custom hook → service/API → TanStack Query cache → UI

---

# 2nd Round — Advanced JavaScript


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Objects in JavaScript

### Theory

In JavaScript, **almost everything is an object** (or can behave like one). Objects are collections of **key-value pairs** — properties and methods. Keys are strings or symbols; values can be any type.

Objects are **reference types** — assigned and compared by reference, not value.

### One-Line Interview Answer

> Objects store key-value pairs and are passed by reference. They're the foundation of JS — arrays, functions, and even primitives have object wrappers.

### Real Example

```javascript
const user = {
  id: "u_1",
  name: "Amit",
  role: "admin",
  greet() { return `Hello, ${this.name}`; },
};

user.greet(); // "Hello, Amit"
typeof user;  // "object"
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Types of Objects & How to Define Them

### Theory

| Type | How to create | Example |
|------|---------------|---------|
| **Object literal** | `{}` | `{ name: "Amit" }` |
| **Constructor** | `new Object()` | Rarely used |
| **Constructor function** | `new Person()` | Pre-ES6 classes |
| **Class** | `class Person {}` | ES6 syntactic sugar |
| **Object.create** | `Object.create(proto)` | Prototypal inheritance |
| **Factory function** | Function returning object | Closure-based |
| **Map** | `new Map()` | Any key type |
| **Set** | `new Set()` | Unique values |
| **Array** | `[]` | typeof "object" |
| **Function** | `function(){}` | Callable object |
| **Date, RegExp, Error** | Built-in constructors | Specialised objects |

### One-Line Interview Answer

> I define objects with literals for simple data, classes for reusable types, Object.create for prototypal inheritance, and Map/Set when keys aren't strings or I need uniqueness.

### Real Example

```javascript
// Literal
const config = { apiUrl: "/api", timeout: 5000 };

// Class
class Transaction {
  constructor(amount, type) {
    this.amount = amount;
    this.type = type;
  }
  getFormatted() { return `₹${this.amount}`; }
}

// Factory with closure
function createUser(name) {
  let loginCount = 0;
  return {
    name,
    login() { loginCount++; },
    getLoginCount: () => loginCount,
  };
}

// Object.create — inherit prototype
const animal = { breathe() { return "breathing"; } };
const dog = Object.create(animal);
dog.bark = () => "woof";

// Map — non-string keys
const cache = new Map();
cache.set({ id: 1 }, { data: "..." });
```

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Normal vs Arrow Functions

### Theory

| | Normal | Arrow |
|--|--------|-------|
| `this` | Dynamic | Lexical |
| `arguments` | Yes | No |
| `new` / constructor | Yes | No |
| Syntax | Verbose | Concise |

### One-Line Interview Answer

> Normal functions have dynamic this and can be constructors. Arrow functions inherit this lexically — ideal for callbacks, wrong for object methods.

### Real Example

```javascript
const service = {
  items: [1, 2, 3],
  sumRegular() { return this.items.reduce((a, b) => a + b, 0); }, // ✅
  sumArrow: () => this?.items?.reduce((a, b) => a + b, 0),       // ❌
};
```

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. const vs let

### Theory

Use **`const` by default**. Use **`let`** only when reassignment is needed. Never use **`var`**.

`const` prevents rebinding but allows object/array mutation.

### One-Line Interview Answer

> const is default — it signals intent that the binding won't change. let when I need reassignment like counters or loop variables. const objects can still be mutated.

### Real Example

```javascript
const API_URL = "/api/v2";        // never reassign
const user = { name: "Amit" };
user.name = "Rahul";              // ✅ mutation OK

let retryCount = 0;             // will reassign
retryCount++;

for (let i = 0; i < 3; i++) {   // block-scoped loop var
  setTimeout(() => console.log(i), 100);
}
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Spread vs Rest Operator

### Theory

Both use `...` syntax — opposite purposes:

| | Spread | Rest |
|--|--------|------|
| **Action** | Expands | Collects |
| **Context** | Arrays, objects, function calls | Function params, destructuring |

### One-Line Interview Answer

> Spread expands an iterable into elements — for copying and merging. Rest collects remaining elements into an array — in parameters and destructuring.

### Real Example

```javascript
// Spread
const merged = { ...defaults, ...userConfig };
const allItems = [...cartA, ...cartB];
Math.max(...numbers);

// Rest
function sum(...args) { return args.reduce((a, b) => a + b, 0); }
const [first, ...rest] = [1, 2, 3, 4]; // first=1, rest=[2,3,4]

// React immutable update
setUser((prev) => ({ ...prev, name: "New Name" }));
```

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. async/await

### Theory

**Promises** represent future values. **async/await** is syntactic sugar — `async` functions return Promises, `await` pauses until settlement.

### One-Line Interview Answer

> async/await makes asynchronous code read like synchronous. await pauses the function until the Promise resolves — errors handled with try/catch.

### Real Example

```javascript
async function loadDashboard(userId) {
  try {
    const [user, orders] = await Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetch(`/api/orders?userId=${userId}`).then((r) => r.json()),
    ]);
    return { user, orders };
  } catch (err) {
    console.error("Dashboard load failed:", err);
    throw err;
  }
}
```

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. CSS Specificity

### Theory

**Specificity** determines which CSS rule wins when multiple rules target the same element. Calculated as weights:

| Selector | Weight |
|----------|--------|
| Inline style | 1000 |
| `#id` | 100 |
| `.class`, `[attr]`, `:pseudo-class` | 10 |
| `element`, `::pseudo-element` | 1 |
| `*` (universal) | 0 |

`!important` overrides specificity (avoid in production).

### One-Line Interview Answer

> Specificity decides which CSS rule applies — inline beats ID beats class beats element. I avoid !important and keep selectors flat to prevent specificity wars.

### Real Example

```css
/* Specificity: 1 */
p { color: black; }

/* Specificity: 10 */
.text { color: blue; }

/* Specificity: 100 */
#main { color: green; }

/* Specificity: 11 — .text + p */
.text p { color: red; } /* wins over p and .text alone */

/* Specificity: 110 — #main + .text */
#main .text { color: purple; } /* wins */
```

```html
<p class="text" id="main">Color is purple (#main .text = 110)</p>
```

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. display: none vs visibility: hidden

### Theory

| | `display: none` | `visibility: hidden` |
|--|-----------------|----------------------|
| **Visible?** | No | No |
| **Takes space?** | No — removed from layout | Yes — blank space remains |
| **Accessibility** | Hidden from screen readers | Hidden from screen readers |
| **Triggers reflow?** | Yes | No |
| **Children visible?** | All hidden | Can override with `visible` on child |
| **Transitions?** | No smooth fade | Can animate opacity separately |

### One-Line Interview Answer

> display none removes the element from layout entirely. visibility hidden hides it but keeps its space. I use none for conditional UI, visibility for layout-preserving hide or animations.

### Real Example

```css
/* Remove from layout — modals closed, mobile menu hidden */
.modal-closed { display: none; }

/* Hide but preserve space — skeleton placeholders, accessibility */
.sr-only-hidden { visibility: hidden; height: 0; width: 0; }

/* Toggle menu */
.nav-mobile { display: none; }
.nav-mobile.open { display: block; }

/* Collapse table column without reflow */
.col-hidden { visibility: hidden; }
```

---

# Client Round — React Internals


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

## 21. Can We Use Hooks inside Conditions?

### Theory

**No.** Hooks must be called at the **top level** of a React function — never inside `if`, `for`, loops, or nested functions.

**Why:** React stores hooks in a **linked list** on the Fiber node, indexed by call order. Conditional hooks change the order between renders, causing state to map to the wrong hook.

### One-Line Interview Answer

> No — hooks must run in the same order every render. Conditional hooks break React's internal linked list and cause state bugs. Use conditional logic inside the hook, not around it.

### Real Example

```jsx
// ❌ WRONG
function Bad({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // breaks rules!
  }
}

// ✅ CORRECT — hook always called, condition inside
function Good({ isLoggedIn }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser().then(setUser);
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);
}

// ✅ CORRECT — early return AFTER all hooks
function Dashboard({ isLoggedIn }) {
  const [data, setData] = useState(null);
  useEffect(() => { if (isLoggedIn) loadData(); }, [isLoggedIn]);

  if (!isLoggedIn) return <Login />; // OK — after hooks
  return <div>{data}</div>;
}
```

---


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

## 22. useEffect vs useMemo — Execution Order

### Theory

When both have the same dependency array and deps change:

1. **Component function runs** (render phase)
2. **`useMemo`** runs during render — computes cached value synchronously
3. **JSX returned** — React diffs virtual tree
4. **Commit phase** — DOM updated
5. **Browser paints**
6. **`useEffect`** runs — after paint (passive effect)

So **`useMemo` always runs before `useEffect`** — useMemo is part of render; useEffect is after commit.

### One-Line Interview Answer

> useMemo runs during the render phase when deps change — synchronously. useEffect runs after the browser paints. So useMemo always executes first.

### Real Example

```jsx
function Demo({ id }) {
  console.log("1: render start");

  const computed = useMemo(() => {
    console.log("2: useMemo running");
    return expensiveCalc(id);
  }, [id]);

  useEffect(() => {
    console.log("4: useEffect running");
  }, [id]);

  console.log("3: render end, computed =", computed);
  return <div>{computed}</div>;
}

// When id changes:
// 1: render start → 2: useMemo → 3: render end → (paint) → 4: useEffect
```

**Exception:** `useLayoutEffect` runs after DOM update but **before** paint — still after useMemo (which is during render).

---


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

## 23. Render Phase vs Commit Phase

### Theory

| | Render Phase | Commit Phase |
|--|--------------|--------------|
| **Interruptible?** | Yes (concurrent) | No — synchronous |
| **What happens** | Call components, run hooks, diff tree | Apply DOM mutations |
| **Effects** | Mark placement/update/deletion flags | Run useLayoutEffect |
| **After** | — | Browser paints → useEffect |

### One-Line Interview Answer

> Render phase calls components and diffs the tree — it can be interrupted. Commit phase applies DOM changes synchronously, runs layout effects, then the browser paints, then passive effects.

### Real Example

```
User clicks → setState
    ↓
RENDER PHASE (interruptible)
  - Call component function
  - useState returns new value
  - useMemo recalculates
  - Diff old vs new tree
    ↓
COMMIT PHASE (sync)
  - Apply DOM insert/update/delete
  - useLayoutEffect fires
    ↓
Browser paints screen
    ↓
useEffect fires (passive)
```

---


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

## 24. Garbage Collection

### Theory

JS uses **mark-and-sweep** GC — mark objects reachable from roots, sweep unreachable ones. V8 uses generational GC (young/old generations).

Common leaks: global vars, forgotten timers, event listeners, closures holding large data, detached DOM nodes.

### One-Line Interview Answer

> GC frees memory for unreachable objects. Leaks happen when we keep references accidentally — I always cleanup timers, listeners, and subscriptions in useEffect return.

### Real Example

```javascript
// ❌ Leak
useEffect(() => {
  const interval = setInterval(poll, 1000);
  // no cleanup!
}, []);

// ✅ Fixed
useEffect(() => {
  const interval = setInterval(poll, 1000);
  return () => clearInterval(interval);
}, []);
```

---


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

## 25. Batching in React

### Theory

**Batching** groups multiple state updates into a **single re-render** for performance.

**React 18 automatic batching:** All updates batch — inside events, timeouts, promises, native handlers.

`flushSync()` opts out — forces synchronous render.

### One-Line Interview Answer

> React batches multiple setState calls into one re-render. React 18 batches everywhere — events, timeouts, promises. use flushSync to force immediate render when needed.

### Real Example

```jsx
function Counter() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
    setA((x) => x + 1);
    setB((x) => x + 1);
    // React 18: ONE re-render, not two
  };

  // Also batched in async
  setTimeout(() => {
    setA(1);
    setB(2);
  }, 1000); // single re-render
}
```

```jsx
import { flushSync } from "react-dom";

flushSync(() => setA(1)); // renders immediately
setB(2);                  // separate render
```

---


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

## 26. Flatten Array without Built-in Methods

### Theory

Client round asked to flatten **without built-in array methods** (no `flat`, `reduce`, `concat`). Use manual loops and recursion.

Input: `[1, 2, [3, [4, 5]], 6]` → `[1, 2, 3, 4, 5, 6]`

### One-Line Interview Answer

> I recursively loop — if element is array, flatten it with a helper; otherwise push to result. Pure for-loop, no reduce or concat.

### Implementation

```javascript
function flatten(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      const nested = flatten(arr[i]);
      for (let j = 0; j < nested.length; j++) {
        result[result.length] = nested[j];
      }
    } else {
      result[result.length] = arr[i];
    }
  }

  return result;
}

console.log(flatten([1, 2, [3, [4, 5]], 6])); // [1, 2, 3, 4, 5, 6]
console.log(flatten([1, 2, 3, [4, 5, 6, [7, 8, [10, 11]]], 9]));
// [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 9]
```

```javascript
// Iterative — stack, no recursion
function flattenIterative(arr) {
  const stack = [];
  for (let i = arr.length - 1; i >= 0; i--) stack[stack.length] = arr[i];

  const result = [];

  while (stack.length > 0) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      for (let i = item.length - 1; i >= 0; i--) stack[stack.length] = item[i];
    } else {
      result[result.length] = item;
    }
  }

  return result;
}
```

---

# Quick Revision Cheat Sheet

| Round | Topic | One-liner |
|-------|-------|-----------|
| 1 | Closure | Function + remembered outer scope |
| 1 | Event loop | Sync → micro → macro |
| 1 | Debounce/throttle | Pause vs rate-limit |
| 1 | a11y | Semantic HTML, ARIA, keyboard |
| 1 | Flex vs Grid | 1D vs 2D layout |
| 1 | Missing numbers | Set + loop min to max |
| 1 | CSR vs SSR | Browser vs server render |
| 1 | call/apply/bind | Invoke now vs bind later |
| 1 | Star rating | 10 buttons, hover, ARIA radiogroup |
| 1 | Deep/shallow | structuredClone vs spread |
| 1 | Redux | dispatch → reducer → store |
| 1 | Architecture | Feature folders, layers |
| 2 | Objects | Literals, class, Map, factory |
| 2 | const vs let | const default, let to reassign |
| 2 | Spread/rest | Expand vs collect |
| 2 | Specificity | inline > id > class > element |
| 2 | none vs hidden | Remove layout vs hide in place |
| Client | Hooks in if | Never — same order required |
| Client | useMemo vs effect | useMemo in render, effect after paint |
| Client | Render vs commit | Diff vs DOM update |
| Client | Batching | Multiple setState → one render |
| Client | Flatten no built-ins | for-loop + recursion |

---

*Altimetrik tests breadth across 3 rounds — JS, CSS, live coding, and React internals. The client round especially probes whether you understand how React works under the hood.*


<p><a href="#i26">Back to index</a></p>
