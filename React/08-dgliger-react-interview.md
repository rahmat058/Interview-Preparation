---
title: "DGLiger ReactJS Developer Interview Preparation"
description: "Web accessibility, CSS layout, JavaScript execution, React HOC, array methods, and traffic light coding — theory, pros/cons, and real-life examples."
tags: ["react", "javascript", "css", "accessibility", "dgliger", "interview"]
level: "2–5 years"
company: "DGLiger"
---

# DGLiger ReactJS Developer Interview Preparation

Questions from a recent DGLiger ReactJS Developer interview — testing **fundamentals**, **concept clarity**, and **real-world coding logic**. Each topic includes **Theory**, **Pros & Cons**, and a **Real-Life Example**.

---

## Table of Contents

1. [What is Web Accessibility?](#1-what-is-web-accessibility)
2. [position: relative, absolute, fixed, static](#2-difference-between-position-relative-absolute-fixed-and-static)
3. [Flexbox vs Grid](#3-flexbox-vs-grid--key-differences)
4. [JavaScript code execution](#4-how-does-javascript-code-execution-work)
5. [undefined vs not defined](#5-difference-between-undefined-and-not-defined)
6. [Hoisting in JavaScript](#6-what-is-hoisting-in-javascript)
7. [Temporal Dead Zone (TDZ)](#7-what-is-temporal-dead-zone-tdz)
8. [Higher Order Component (HOC)](#8-what-is-higher-order-component-hoc-give-example)
9. [map, filter, and reduce](#9-explain-map-filter-and-reduce-with-examples)
10. [Traffic light system in React](#10-build-a-traffic-light-system-in-react)
11. [Output-based tricky JS questions](#11-output-based-tricky-js-questions-bonus)

---

## 1. What is Web Accessibility?

### Theory

**Web Accessibility (a11y)** means designing and building websites so that **everyone** can use them — including people with visual, auditory, motor, cognitive, and neurological disabilities. It also benefits users on slow networks, mobile devices, and older browsers.

Standards are defined by **WCAG (Web Content Accessibility Guidelines)** with levels A, AA, and AAA. Most companies target **WCAG 2.1 AA**.

Core principles (**POUR**):

- **Perceivable** — content available to all senses (alt text, captions)
- **Operable** — keyboard navigation, no seizure triggers
- **Understandable** — clear language, predictable behavior
- **Robust** — works with assistive technologies (screen readers)

### Pros & Cons

| Accessible apps                              | Ignoring accessibility             |
| -------------------------------------------- | ---------------------------------- |
| ✅ Larger user base (15%+ have disabilities) | ❌ Legal risk (ADA, EAA, RPwD Act) |
| ✅ Better SEO (semantic HTML)                | ❌ Lost enterprise contracts       |
| ✅ Better UX for everyone                    | ❌ Fails Lighthouse a11y audits    |
| ✅ Required by many clients                  | ❌ Keyboard users can't navigate   |

### Real-Life Example

```tsx
// ❌ Inaccessible
<div onClick={submitOrder}>Place Order</div>
<input placeholder="Email" />
<div className="error">Invalid email</div>

// ✅ Accessible
<button type="submit" onClick={submitOrder}>
  Place Order
</button>

<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint email-error"
  aria-invalid={hasError}
  autoComplete="email"
/>
<span id="email-hint" className="sr-only">
  Enter your registered email address
</span>
{hasError && (
  <p id="email-error" role="alert">
    Please enter a valid email address
  </p>
)}
```

```tsx
// Modal — focus trap + ARIA
function ConfirmModal({ isOpen, onClose, onConfirm, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    modalRef.current?.focus();
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="overlay" role="presentation" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
```

**Quick checklist:**

| Practice       | Example                                            |
| -------------- | -------------------------------------------------- |
| Semantic HTML  | `<nav>`, `<main>`, `<button>`, not `<div onClick>` |
| Alt text       | `<img alt="Chicken Biryani from Spice Garden" />`  |
| Keyboard       | Tab through all interactive elements               |
| Focus visible  | `:focus-visible` outline styles                    |
| Color contrast | 4.5:1 for normal text (WCAG AA)                    |
| Skip link      | "Skip to main content"                             |
| Live regions   | `aria-live="polite"` for status updates            |

```bash
# Audit tools
npm install -D eslint-plugin-jsx-a11y @axe-core/react
```

### Interview answer (concise)

> Web accessibility ensures apps are usable by people with disabilities and assistive technologies. I use semantic HTML, ARIA where needed, keyboard navigation, focus management, color contrast, and screen reader labels. It's both a legal requirement and better UX for everyone.

---

## 2. Difference between position: relative, absolute, fixed, and static

### Theory

The CSS `position` property controls how an element is placed in the document and whether it's removed from normal flow.

| Value      | Removed from flow? | Positioned relative to                        | Scroll behavior       |
| ---------- | ------------------ | --------------------------------------------- | --------------------- |
| `static`   | No (default)       | Normal document flow                          | Scrolls with page     |
| `relative` | No                 | **Its own original position**                 | Scrolls with page     |
| `absolute` | Yes                | **Nearest positioned ancestor** (or viewport) | Scrolls with ancestor |
| `fixed`    | Yes                | **Viewport**                                  | Stays fixed on screen |

`top`, `right`, `bottom`, `left`, and `z-index` only work when `position` is **not** `static`.

### Pros & Cons

| Position   | Best for                                                            | Avoid when                                  |
| ---------- | ------------------------------------------------------------------- | ------------------------------------------- |
| `static`   | Normal layout                                                       | You need offset control                     |
| `relative` | Offset without leaving flow, containing block for absolute children | Full-page overlays                          |
| `absolute` | Tooltips, badges, dropdowns inside a container                      | Main page layout                            |
| `fixed`    | Sticky headers, modals, FAB buttons                                 | Inside scrollable containers (use `sticky`) |

### Real-Life Example

```css
/* static — default, no offset */
.card {
  position: static;
}

/* relative — nudge element, create positioning context */
.card-badge {
  position: relative;
  top: -8px; /* visual offset, space still reserved in flow */
}

.product-card {
  position: relative; /* containing block for absolute children */
}

/* absolute — positioned inside .product-card */
.sale-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: red;
  color: white;
  padding: 4px 8px;
}

/* fixed — stays on screen while scrolling */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.floating-cart-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
}
```

```html
<!-- Visual hierarchy -->
<div class="product-card" style="position: relative">
  <img src="biryani.jpg" alt="Biryani" />
  <span class="sale-tag" style="position: absolute; top: 8px; right: 8px">
    20% OFF
  </span>
</div>
```

```
Document flow with absolute:

┌─ .product-card (relative) ─────────┐
│  ┌ SALE TAG (absolute) ┐           │
│  │  top:8 right:8     │           │
│  └────────────────────┘           │
│  [Product Image]                   │
│  Product Name — ₹299               │
└────────────────────────────────────┘
```

**Bonus — `position: sticky`:** Acts as relative until scroll threshold, then fixed within its container. Great for table headers and section nav.

---

## 3. Flexbox vs Grid — key differences

### Theory

Both are CSS layout systems, but they solve different problems:

- **Flexbox** — one-dimensional layout (row **or** column). Content-driven sizing.
- **Grid** — two-dimensional layout (rows **and** columns). Layout-driven sizing.

### Comparison

| Feature         | Flexbox                          | Grid                                |
| --------------- | -------------------------------- | ----------------------------------- |
| Dimensions      | 1D (row or column)               | 2D (rows + columns)                 |
| Control         | Content dictates space           | Template dictates space             |
| Alignment       | Excellent for distributing items | Excellent for page layouts          |
| Gap support     | `gap`                            | `gap`                               |
| Best for        | Navbars, card rows, centering    | Page layouts, dashboards, galleries |
| Item stretching | `flex: 1`                        | `1fr`                               |

### Pros & Cons

| Flexbox                              | Grid                                    |
| ------------------------------------ | --------------------------------------- |
| ✅ Simple for component-level layout | ✅ Powerful for full page structure     |
| ✅ Great for unknown item count      | ✅ Precise column/row control           |
| ❌ Awkward for complex 2D layouts    | ❌ Overkill for a single row of buttons |
|                                      | ❌ Steeper learning curve               |

### Real-Life Example

```css
/* Flexbox — navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

/* Flexbox — center a modal */
.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Flexbox — card with footer pushed to bottom */
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.product-card .footer {
  margin-top: auto; /* pushes footer down */
}
```

```css
/* Grid — dashboard layout */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  min-height: 100vh;
}

.sidebar {
  grid-area: sidebar;
}
.header {
  grid-area: header;
}
.main {
  grid-area: main;
}

/* Grid — responsive product gallery */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

/* Grid — form with aligned labels */
.form-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.5rem 1rem;
  align-items: center;
}
```

```tsx
// When to use which — decision guide
// Flexbox: toolbar, button group, horizontal list, vertical card stack
// Grid: page shell, image gallery, data table layout, complex forms
// Both together: Grid for page, Flexbox inside each grid cell
```

### Interview answer (concise)

> Flexbox is for one-dimensional layouts — navbars, aligning items in a row or column. Grid is for two-dimensional layouts — page shells, dashboards, responsive galleries. Use Flexbox for components, Grid for page structure. Often combine both.

---

## 4. How does JavaScript code execution work?

### Theory

JavaScript execution follows a structured pipeline:

```
1. Parsing
   Source code → Tokens → AST (Abstract Syntax Tree)

2. Compilation (V8)
   AST → Bytecode (Ignition interpreter) → Optimized machine code (TurboFan)

3. Execution
   Global Execution Context created
   → Memory heap (variables, objects)
   → Call stack (function calls)

4. Runtime
   Event loop coordinates sync code, microtasks, macrotasks
```

**Execution Context** contains:

- **Variable Environment** — `var`, function declarations, `let`/`const`
- **Lexical Environment** — scope chain for lookups
- **`this` binding**

**Phases of execution context:**

1. **Creation phase** — hoist variables, create scope chain, set `this`
2. **Execution phase** — run code line by line

### Pros & Cons

| Understanding execution model | Ignoring it                   |
| ----------------------------- | ----------------------------- |
| ✅ Predict async behavior     | ❌ Surprised by hoisting bugs |
| ✅ Debug closure/TDZ issues   | ❌ Block UI with sync code    |
| ✅ Write performant hot paths | ❌ Memory leaks from closures |

### Real-Life Example

```javascript
// Execution order walkthrough
const API_URL = "https://api.example.com"; // global context

function initApp() {
  const userId = getUserId(); // execution context for initApp
  fetchOrders(userId);
}

function fetchOrders(userId) {
  const endpoint = `/orders/${userId}`; // new execution context
  return fetch(`${API_URL}${endpoint}`)
    .then((res) => res.json()) // callback → microtask queue
    .then(renderOrders);
}

initApp();
// 1. Global context created
// 2. initApp() pushed to call stack
// 3. fetchOrders() pushed to call stack
// 4. fetch() handed to Web API, fetchOrders pops off stack
// 5. initApp pops off stack
// 6. fetch resolves → .then callback → microtask queue
// 7. renderOrders runs
```

```javascript
// Call stack overflow
function recurse() {
  recurse(); // RangeError: Maximum call stack size exceeded
}

// Event loop — non-blocking
console.log("1");
setTimeout(() => console.log("3"), 0);
Promise.resolve().then(() => console.log("2"));
console.log("1b");
// 1 → 1b → 2 → 3
```

---

## 5. Difference between undefined and not defined

### Theory

These are often confused but mean different things:

|                   | `undefined`                                                                    | Not defined                                               |
| ----------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| **Meaning**       | Variable **exists** but has no assigned value                                  | Variable **does not exist** in scope                      |
| **Error?**        | No error when accessed                                                         | `ReferenceError`                                          |
| **typeof**        | `"undefined"`                                                                  | `ReferenceError` (can't use typeof on undeclared)         |
| **Common causes** | Declared but not initialized, missing object property, function with no return | Typo in variable name, accessing before declaration (TDZ) |

### Pros & Cons

| Knowing the difference          | Confusing them                             |
| ------------------------------- | ------------------------------------------ |
| ✅ Faster debugging             | ❌ Misdiagnose ReferenceError as undefined |
| ✅ Correct typeof checks        | ❌ Use `== null` incorrectly               |
| ✅ Understand optional chaining |                                            |

### Real-Life Example

```javascript
// undefined — variable exists, no value
let username;
console.log(username); // undefined
console.log(typeof username); // "undefined"

const user = { name: "Amit" };
console.log(user.age); // undefined (property doesn't exist)
console.log(typeof user.age); // "undefined"

function getDiscount() {
  // no return statement
}
console.log(getDiscount()); // undefined

// Not defined — variable doesn't exist
console.log(usrname); // ReferenceError: usrname is not defined (typo)

console.log(notDeclared); // ReferenceError

// TDZ — technically "not defined" until declaration line
// console.log(count);        // ReferenceError (TDZ, not undefined)
let count = 5;
```

```javascript
// Safe checks in production
if (user.email !== undefined) {
  /* has email field */
}
if (user.email == null) {
  /* null OR undefined */
}
const email = user.email ?? "guest@example.com"; // nullish coalescing

// Optional chaining
const city = user?.address?.city; // undefined if any part missing, no error
```

### Interview answer (concise)

> `undefined` means the variable exists but has no value — declared but not assigned, missing property, or function with no return. "Not defined" means the variable was never declared — you get a ReferenceError. A typo like `usrname` instead of `username` is not defined; `let x; console.log(x)` is undefined.

---

## 6. What is Hoisting in JavaScript?

### Theory

**Hoisting** is JavaScript's behavior of processing declarations before executing code. During the **creation phase** of an execution context, the engine registers variable and function declarations in memory — before the first line runs.

**Important:** Only **declarations** are hoisted, not **initializations**.

| Declaration             | Hoisted as             |
| ----------------------- | ---------------------- |
| `var x`                 | `undefined`            |
| `let x` / `const x`     | uninitialized (TDZ)    |
| `function foo(){}`      | full function          |
| `var fn = function(){}` | `var fn` → `undefined` |
| `class MyClass`         | uninitialized (TDZ)    |

### Pros & Cons

| Pros                                             | Cons                                     |
| ------------------------------------------------ | ---------------------------------------- |
| Function declarations callable before definition | `var` hoisting causes subtle bugs        |
| Flexible code organization                       | Misleading mental model ("moved to top") |
|                                                  | Easy to use variables before assignment  |

### Real-Life Example

```javascript
// var hoisting
console.log(status); // undefined (not ReferenceError)
var status = "active";

// Equivalent to:
// var status;
// console.log(status);
// status = "active";

// Function declaration — fully hoisted
authenticate();
function authenticate() {
  console.log("User authenticated");
}

// Function expression — only var hoisted
// processOrder(); // TypeError: processOrder is not a function
var processOrder = function () {
  console.log("Processing...");
};

// let/const — hoisted but TDZ
// console.log(theme); // ReferenceError
let theme = "dark";
```

```javascript
// Classic interview trap
var price = 100;
function getPrice() {
  console.log(price); // undefined (not 100!)
  var price = 200;
  return price;
}
getPrice(); // logs undefined, returns 200
```

---

## 7. What is Temporal Dead Zone (TDZ)?

### Theory

The **Temporal Dead Zone** is the period between entering a scope and the line where a `let` or `const` variable is **declared**. During TDZ, the variable exists in the lexical environment but is **not initialized** — accessing it throws `ReferenceError`.

`var` does not have a TDZ — it's initialized as `undefined` when hoisted.

TDZ exists to:

- Catch errors from using variables before declaration
- Make `let`/`const` behave more predictably than `var`
- Prevent issues with `class` and `const` before initialization

### Pros & Cons

| TDZ (let/const)                     | No TDZ (var)                    |
| ----------------------------------- | ------------------------------- |
| ✅ Catches bugs early               | ❌ Returns `undefined` silently |
| ✅ Enforces declare-before-use      | ❌ Hoisting confusion           |
| ❌ ReferenceError if accessed early | ✅ "Forgiving" but dangerous    |

### Real-Life Example

```javascript
// TDZ demonstration
{
  // TDZ for `value` starts here (scope entry)
  // console.log(value); // ReferenceError — in TDZ

  let value = 42; // TDZ ends here
  console.log(value); // 42
}

// typeof and TDZ
typeof undeclaredVar; // "undefined" (safe — no ReferenceError)
// typeof tdzVar;         // ReferenceError — tdzVar is in TDZ
let tdzVar = 10;

// TDZ with const
const API_KEY = import.meta.env.VITE_API_KEY;
// Must be declared before use — cannot access before line

// Class TDZ
// const instance = new Service(); // ReferenceError — class in TDZ
class Service {
  connect() {
    return "connected";
  }
}
const instance = new Service(); // OK
```

```javascript
// Why TDZ matters — prevents this bug with var
function init() {
  console.log(config); // undefined (var) — silent bug
  var config = { debug: true };
}

function initSafe() {
  // console.log(config); // ReferenceError (let) — caught immediately
  let config = { debug: true };
}
```

### Interview answer (concise)

> TDZ is the time between entering a block and the `let`/`const` declaration line. The variable is hoisted but uninitialized — accessing it throws ReferenceError. `var` has no TDZ; it's initialized as undefined. TDZ helps catch use-before-declare bugs.

---

## 8. What is Higher Order Component (HOC)? Give example

### Theory

A **Higher Order Component** is a function that takes a component and returns a **new enhanced component** with additional props, behavior, or UI wrapping. Pattern: `const Enhanced = withFeature(WrappedComponent)`.

HOCs solve cross-cutting concerns: authentication, loading states, error handling, logging, and data fetching. They were the primary reuse pattern before Hooks (React 16.8).

### Pros & Cons

| Pros                             | Cons                             |
| -------------------------------- | -------------------------------- |
| Reusable logic across components | Wrapper hell in DevTools         |
| Separation of concerns           | Props naming collisions          |
| Works with class components      | Harder to trace than hooks       |
|                                  | **Custom hooks preferred today** |

### Real-Life Example

#### withAuth HOC

```tsx
import { Navigate } from "react-router-dom";

function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage
function Dashboard({ user }) {
  return <h1>Welcome, {user.name}</h1>;
}

export default withAuth(Dashboard);
```

#### withLoading HOC

```tsx
function withLoading(WrappedComponent, fetchFn) {
  return function WithLoadingComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchFn(props)
        .then(setData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [props.id]);

    if (loading) return <Spinner />;
    if (error) return <ErrorBanner message={error} />;
    return <WrappedComponent {...props} data={data} />;
  };
}

const RestaurantPage = withLoading(
  ({ data }) => <RestaurantDetail restaurant={data} />,
  (props) => fetch(`/api/restaurants/${props.id}`).then((r) => r.json()),
);
```

#### Modern alternative — custom hook (mention in interview)

```tsx
function useRequireAuth() {
  const { user, isLoading } = useAuth();
  if (!isLoading && !user) throw new RedirectToLogin();
  return { user, isLoading };
}

function Dashboard() {
  const { user, isLoading } = useRequireAuth();
  if (isLoading) return <Spinner />;
  return <h1>Welcome, {user.name}</h1>;
}
```

### Interview answer (concise)

> An HOC wraps a component to inject props or behavior. Example: `withAuth` checks login and passes `user` to the wrapped component. Know HOCs for legacy codebases, but prefer custom hooks for new React code — same reuse without wrapper nesting.

---

## 9. Explain map, filter, and reduce with examples

### Theory

Three essential **array methods** for immutable data transformation:

| Method   | Returns                   | Purpose                            |
| -------- | ------------------------- | ---------------------------------- |
| `map`    | New array (same length)   | Transform each element             |
| `filter` | New array (0 to n length) | Keep elements matching a condition |
| `reduce` | Single value (any type)   | Accumulate into one result         |

None mutate the original array.

### Pros & Cons

| Pros                     | Cons                                          |
| ------------------------ | --------------------------------------------- |
| Declarative and readable | Chaining creates intermediate arrays          |
| Immutable by default     | Can't `break` early (use `for...of`)          |
| Chainable                | Slightly slower than manual loop in hot paths |

### Real-Life Example

```javascript
const menuItems = [
  { id: 1, name: "Biryani", price: 299, category: "main", inStock: true },
  { id: 2, name: "Naan", price: 49, category: "bread", inStock: true },
  { id: 3, name: "Lassi", price: 79, category: "drink", inStock: false },
  { id: 4, name: "Kebab", price: 199, category: "main", inStock: true },
];

// map — transform for dropdown options
const options = menuItems.map((item) => ({
  label: `${item.name} — ₹${item.price}`,
  value: item.id,
}));
// [{ label: "Biryani — ₹299", value: 1 }, ...]

// filter — available main courses under ₹250
const affordableMains = menuItems.filter(
  (item) => item.category === "main" && item.inStock && item.price <= 250,
);
// [{ id: 4, name: "Kebab", price: 199, ... }]

// reduce — calculate total order value
const cart = [
  { id: 1, quantity: 2 },
  { id: 2, quantity: 4 },
];

const orderTotal = cart.reduce((total, cartItem) => {
  const product = menuItems.find((m) => m.id === cartItem.id);
  return total + product.price * cartItem.quantity;
}, 0);
// 299*2 + 49*4 = 794

// reduce — group by category
const byCategory = menuItems.reduce((groups, item) => {
  const cat = item.category;
  if (!groups[cat]) groups[cat] = [];
  groups[cat].push(item);
  return groups;
}, {});
// { main: [...], bread: [...], drink: [...] }

// Chaining all three
const summary = menuItems
  .filter((item) => item.inStock)
  .map((item) => item.name)
  .reduce((text, name, index, arr) => {
    return text + name + (index < arr.length - 1 ? ", " : "");
  }, "Available: ");
```

```jsx
// React — primary list rendering pattern
function MenuList({ items }) {
  return (
    <ul>
      {items
        .filter((item) => item.inStock)
        .map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
    </ul>
  );
}
```

---

## 10. Build a traffic light system in React

### Theory

This is a classic **state + timing** interview problem. Requirements:

- Cycle: **Red → Green → Yellow** (repeat)
- Durations: **Red = 5s**, **Green = 3s**, **Yellow = 2s**
- Use `useState` for current light
- Use `useEffect` + `setTimeout` for timing
- **Cleanup** timeout on unmount or state change to prevent memory leaks

### Pros & Cons of approaches

| setTimeout in useEffect       | setInterval                                         |
| ----------------------------- | --------------------------------------------------- |
| ✅ Precise per-state duration | ❌ Fixed interval — awkward for different durations |
| ✅ Easy cleanup               | ❌ Drift over time                                  |
| ✅ Clear state machine        |                                                     |

### Real-Life Example — Full solution

```tsx
import { useEffect, useState } from "react";

type Light = "red" | "green" | "yellow";

const LIGHT_CONFIG: Record<
  Light,
  { duration: number; next: Light; label: string }
> = {
  red: { duration: 5000, next: "green", label: "STOP" },
  green: { duration: 3000, next: "yellow", label: "GO" },
  yellow: { duration: 2000, next: "red", label: "SLOW" },
};

function TrafficLight() {
  const [activeLight, setActiveLight] = useState<Light>("red");
  const [countdown, setCountdown] = useState(LIGHT_CONFIG.red.duration / 1000);

  useEffect(() => {
    const { duration, next } = LIGHT_CONFIG[activeLight];
    const seconds = duration / 1000;

    setCountdown(seconds);

    // Countdown ticker (updates every second)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : seconds));
    }, 1000);

    // Switch to next light after duration
    const switchTimer = setTimeout(() => {
      setActiveLight(next);
    }, duration);

    // Cleanup — critical for interview points
    return () => {
      clearTimeout(switchTimer);
      clearInterval(countdownInterval);
    };
  }, [activeLight]);

  return (
    <div className="traffic-light-container">
      <h2>Traffic Light</h2>

      <div className="traffic-light" role="status" aria-live="polite">
        <LightBulb color="red" isActive={activeLight === "red"} />
        <LightBulb color="yellow" isActive={activeLight === "yellow"} />
        <LightBulb color="green" isActive={activeLight === "green"} />
      </div>

      <p className="status">
        {LIGHT_CONFIG[activeLight].label} — {countdown}s remaining
      </p>
    </div>
  );
}

function LightBulb({ color, isActive }: { color: Light; isActive: boolean }) {
  return (
    <div
      className={`bulb bulb--${color} ${isActive ? "bulb--active" : ""}`}
      aria-label={`${color} light ${isActive ? "on" : "off"}`}
    />
  );
}

export default TrafficLight;
```

```css
.traffic-light-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-family: system-ui, sans-serif;
}

.traffic-light {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #222;
  border-radius: 12px;
}

.bulb {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  opacity: 0.2;
  transition:
    opacity 0.3s,
    box-shadow 0.3s;
}

.bulb--red {
  background: #ff4444;
}
.bulb--yellow {
  background: #ffcc00;
}
.bulb--green {
  background: #44cc44;
}

.bulb--active {
  opacity: 1;
  box-shadow: 0 0 20px currentColor;
}

.bulb--red.bulb--active {
  box-shadow: 0 0 24px #ff4444;
}
.bulb--yellow.bulb--active {
  box-shadow: 0 0 24px #ffcc00;
}
.bulb--green.bulb--active {
  box-shadow: 0 0 24px #44cc44;
}

.status {
  font-size: 1.25rem;
  font-weight: 600;
}
```

#### Alternative — state machine with single effect (cleaner)

```tsx
import { useEffect, useReducer } from "react";

type Light = "red" | "green" | "yellow";

const SEQUENCE: { light: Light; duration: number }[] = [
  { light: "red", duration: 5000 },
  { light: "green", duration: 3000 },
  { light: "yellow", duration: 2000 },
];

function trafficReducer(state: number) {
  return (state + 1) % SEQUENCE.length;
}

function TrafficLightMachine() {
  const [index, dispatch] = useReducer(trafficReducer, 0);
  const { light, duration } = SEQUENCE[index];

  useEffect(() => {
    const timer = setTimeout(() => dispatch(), duration);
    return () => clearTimeout(timer);
  }, [index, duration]);

  const colors: Light[] = ["red", "green", "yellow"];

  return (
    <div className="traffic-light">
      {colors.map((c) => (
        <div
          key={c}
          className={`bulb bulb--${c} ${light === c ? "bulb--active" : ""}`}
        />
      ))}
      <p>
        Current: {light.toUpperCase()} ({duration / 1000}s)
      </p>
    </div>
  );
}
```

### What interviewers look for

| Checkpoint          | Why                                 |
| ------------------- | ----------------------------------- |
| Correct cycle order | Red → Green → Yellow                |
| Correct timings     | 5s, 3s, 2s                          |
| `useEffect` cleanup | `clearTimeout` on unmount           |
| Dependency array    | `[activeLight]` triggers next cycle |
| Accessible markup   | `aria-live`, `aria-label` on bulbs  |
| No memory leaks     | Don't stack timers without cleanup  |

### Cycle diagram

```
     ┌──────────────────────────────────────┐
     │                                      │
     ▼                                      │
  ┌──────┐  5s   ┌───────┐  3s   ┌────────┐ │
  │ RED  │ ───► │ GREEN │ ───► │ YELLOW │─┘
  └──────┘       └───────┘       └────────┘
                                      2s
```

---

## 11. Output-based tricky JS questions (Bonus)

### Theory

DGLiger interviews also test **output prediction** — hoisting, TDZ, closures, and event loop. Explain **why**, not just the answer.

### Real-Life Example — 8 snippets

#### Q1 — Hoisting + var

```javascript
console.log(a);
var a = 10;
console.log(a);
```

**Output:** `undefined` → `10`

---

#### Q2 — TDZ

```javascript
console.log(b);
let b = 20;
```

**Output:** `ReferenceError` (TDZ — not undefined)

---

#### Q3 — Closure + var in loop

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Output:** `3, 3, 3`

---

#### Q4 — Closure + let in loop

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Output:** `0, 1, 2`

---

#### Q5 — Event loop

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

**Output:** `A` → `D` → `C` → `B`

---

#### Q6 — typeof undeclared vs TDZ

```javascript
console.log(typeof notDeclared); // "undefined"
let x = 1;
// console.log(typeof y);      // ReferenceError — y in TDZ
let y = 2;
```

---

#### Q7 — undefined vs not defined

```javascript
let user;
console.log(user); // undefined
console.log(user.name); // TypeError (can't read property of undefined)
// console.log(profile);     // ReferenceError (not defined)
```

---

#### Q8 — this in arrow vs regular

```javascript
const obj = {
  name: "DGLiger",
  regular() {
    return this.name;
  },
  arrow: () => this?.name,
};
console.log(obj.regular()); // "DGLiger"
console.log(obj.arrow()); // undefined
```

---

# Preparation Focus Areas — Summary

| Area             | Topics in this guide                               |
| ---------------- | -------------------------------------------------- |
| JavaScript core  | Execution, hoisting, TDZ, undefined vs not defined |
| CSS layout       | position, Flexbox, Grid                            |
| React patterns   | HOC, traffic light state + timing                  |
| Array methods    | map, filter, reduce                                |
| Accessibility    | ARIA, semantic HTML, keyboard                      |
| Output questions | Hoisting, closure, event loop                      |

---

# Quick Revision Cheat Sheet

| #   | Topic                    | One-liner                                                       |
| --- | ------------------------ | --------------------------------------------------------------- |
| 1   | Web Accessibility        | WCAG, semantic HTML, keyboard, ARIA, contrast                   |
| 2   | CSS position             | static=flow, relative=offset, absolute=ancestor, fixed=viewport |
| 3   | Flexbox vs Grid          | 1D content-driven vs 2D layout-driven                           |
| 4   | JS execution             | Parse → compile → execute context → event loop                  |
| 5   | undefined vs not defined | Exists/no value vs never declared (ReferenceError)              |
| 6   | Hoisting                 | Declarations registered before execution; var=undefined         |
| 7   | TDZ                      | let/const hoisted but inaccessible until declaration line       |
| 8   | HOC                      | Function(Component) → EnhancedComponent; prefer hooks now       |
| 9   | map/filter/reduce        | Transform, select, accumulate — immutable                       |
| 10  | Traffic light            | useState + useEffect + setTimeout + cleanup; 5s/3s/2s           |

---

_DGLiger interviews balance concept clarity with hands-on coding. Practice the traffic light problem live, explain your cleanup logic, and connect JS fundamentals to React patterns._
