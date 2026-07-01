---
title: "Top 30 React.js Interview Q&A Cheat Sheet"
description: "Short, practical, interview-friendly answers — Basic, Intermediate, and Advanced — with one real example each."
tags: ["react", "interview", "cheat-sheet", "hooks", "frontend"]
level: "All levels"
format: "Short Q&A"
---

# Top 30 React.js Interview Q&A Cheat Sheet

Short, practical answers you can say **confidently in an interview** — not long textbook paragraphs. Each question includes **Theory**, **Pros & Cons** (where useful), a **One-Line Interview Answer**, and **One Real Example**.

Organized: **Basic → Intermediate → Advanced**

---

<a id="quick-index"></a>

## Quick index


### Basic (1–10)

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is React?](#p1) |
| <span id="i2"></span>2 | [What is JSX?](#p2) |
| <span id="i3"></span>3 | [Components in React](#p3) |
| <span id="i4"></span>4 | [Functional vs Class Components](#p4) |
| <span id="i5"></span>5 | [Props in React](#p5) |
| <span id="i6"></span>6 | [State in React](#p6) |
| <span id="i7"></span>7 | [State vs Props](#p7) |
| <span id="i8"></span>8 | [Virtual DOM](#p8) |
| <span id="i9"></span>9 | [React Router](#p9) |
| <span id="i10"></span>10 | [Conditional Rendering](#p10) |

### Intermediate (11–20)

| # | Section |
| --- | --- |
| <span id="i11"></span>11 | [useEffect Hook](#p11) |
| <span id="i12"></span>12 | [Dependency Array](#p12) |
| <span id="i13"></span>13 | [useState Hook](#p13) |
| <span id="i14"></span>14 | [useContext Hook](#p14) |
| <span id="i15"></span>15 | [Context API](#p15) |
| <span id="i16"></span>16 | [Custom Hooks](#p16) |
| <span id="i17"></span>17 | [Keys in React Lists](#p17) |
| <span id="i18"></span>18 | [React.memo](#p18) |
| <span id="i19"></span>19 | [useRef Hook](#p19) |
| <span id="i20"></span>20 | [useRef vs useState](#p20) |

### Advanced (21–30)

| # | Section |
| --- | --- |
| <span id="i21"></span>21 | [Code Splitting](#p21) |
| <span id="i22"></span>22 | [Lazy Loading](#p22) |
| <span id="i23"></span>23 | [Suspense](#p23) |
| <span id="i24"></span>24 | [Error Boundaries](#p24) |
| <span id="i25"></span>25 | [Controlled vs Uncontrolled Components](#p25) |
| <span id="i26"></span>26 | [Higher Order Components (HOC)](#p26) |
| <span id="i27"></span>27 | [Prop Drilling](#p27) |
| <span id="i28"></span>28 | [Reconciliation](#p28) |
| <span id="i29"></span>29 | [Strict Mode](#p29) |
| <span id="i30"></span>30 | [Best Practices in React](#p30) |

---
# Basic

<a id="p1"></a>

## 1. What is React?

### Theory

React is a **JavaScript library** for building user interfaces using **reusable components**. You describe UI as a function of state — when state changes, React updates the screen efficiently.

It is **not** a full framework (no built-in routing or API layer). It focuses on the **view layer**.

### Pros & Cons

| Pros                            | Cons                                  |
| ------------------------------- | ------------------------------------- |
| Component reusability           | Needs extra libraries (router, state) |
| Virtual DOM — efficient updates | JSX learning curve                    |
| Huge ecosystem and job market   | Fast-moving ecosystem                 |

### One-Line Interview Answer

> React is a component-based UI library. You build reusable pieces, declare what the UI should look like for a given state, and React handles updating the DOM efficiently.

### Real Example

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
// Reuse anywhere: <Welcome name="Amit" />
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What is JSX?

### Theory

**JSX** (JavaScript XML) is syntax that lets you write HTML-like markup inside JavaScript. It is **not** HTML — it compiles to `React.createElement()` calls via Babel.

Rules: one parent element (or Fragment), camelCase attributes (`className`, `onClick`), expressions in `{}`.

### Pros & Cons

| Pros                           | Cons                                |
| ------------------------------ | ----------------------------------- |
| Readable, visual UI code       | Can confuse HTML vs JSX differences |
| Catches errors at compile time | Needs build step (Babel)            |

### One-Line Interview Answer

> JSX is syntactic sugar that lets me write UI markup in JavaScript. Babel converts it to `React.createElement` calls at build time.

### Real Example

```jsx
// JSX
const element = (
  <button className="btn" onClick={handleClick}>
    Pay ₹{amount}
  </button>
);

// Compiles to:
const element = React.createElement(
  "button",
  { className: "btn", onClick: handleClick },
  "Pay ₹",
  amount,
);
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Components in React

### Theory

A **component** is an independent, reusable piece of UI. Components accept **props**, manage **state**, and return JSX. They can be nested — `<App>` contains `<Header>`, `<Sidebar>`, `<Main>`.

Two types: **function components** (modern standard) and **class components** (legacy).

### Pros & Cons

| Small focused components  | Large monolithic components    |
| ------------------------- | ------------------------------ |
| ✅ Easy to test and reuse | ❌ Hard to maintain            |
| ✅ Clear responsibility   | ❌ Bug in one place breaks all |

### One-Line Interview Answer

> Components are reusable UI building blocks. Each component encapsulates its own markup and logic and can be composed together to build full pages.

### Real Example

```jsx
function App() {
  return (
    <>
      <Header />
      <ProductList />
      <Footer />
    </>
  );
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Functional vs Class Components

### Theory

|           | Functional               | Class                                |
| --------- | ------------------------ | ------------------------------------ |
| Syntax    | `function Comp() {}`     | `class Comp extends React.Component` |
| State     | `useState`, `useReducer` | `this.state`, `this.setState`        |
| Lifecycle | `useEffect`              | `componentDidMount`, etc.            |
| `this`    | Not needed               | Required                             |
| Status    | **Modern standard**      | Legacy, still in old codebases       |

Hooks (React 16.8+) made function components fully capable.

### One-Line Interview Answer

> Function components with hooks are the modern standard — simpler syntax, no `this`, easier to test. Class components still exist in legacy code but I use functions for all new code.

### Real Example

```jsx
// Functional (modern)
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}

// Class (legacy)
class Counter extends React.Component {
  state = { count: 0 };
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Props in React

### Theory

**Props** (properties) pass data from **parent to child**. They are **read-only** — a child must never mutate props. Props make components reusable with different data.

### Pros & Cons

| Pros                               | Cons                          |
| ---------------------------------- | ----------------------------- |
| Explicit data flow                 | Prop drilling at depth        |
| Easy to test with different inputs | Many props → hard to maintain |

### One-Line Interview Answer

> Props are read-only inputs passed from parent to child. They let me reuse the same component with different data.

### Real Example

```jsx
function ProductCard({ name, price, onAddToCart }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>₹{price}</p>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  );
}

<ProductCard
  name="Biryani"
  price={299}
  onAddToCart={() => addItem("biryani")}
/>;
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. State in React

### Theory

**State** is data that **changes over time** inside a component. When state updates, React re-renders the component. State is **private** to the component that owns it (unless lifted up or shared via context).

Managed with `useState` or `useReducer`.

### Pros & Cons

| Local state                | Global state for everything |
| -------------------------- | --------------------------- |
| ✅ Colocated, simple       | ❌ Over-engineering         |
| ✅ Component owns its data | ❌ Hard to trace changes    |

### One-Line Interview Answer

> State is mutable data owned by a component. When it changes, React re-renders. I use `useState` for simple values and lift state up when siblings need to share it.

### Real Example

```jsx
function SearchBar() {
  const [query, setQuery] = useState("");
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. State vs Props

### Theory

|          | Props               | State                     |
| -------- | ------------------- | ------------------------- |
| Source   | Parent              | Component itself          |
| Mutable? | No (read-only)      | Yes (via setter)          |
| Purpose  | Configure component | Track changing data       |
| Analogy  | Function arguments  | Variables inside function |

### One-Line Interview Answer

> Props are passed in from outside and are read-only. State is owned internally and changes over time. Props configure a component; state tracks its live data.

### Real Example

```jsx
function Counter({ initialCount }) {
  // prop — set once by parent
  const [count, setCount] = useState(initialCount); // state — changes on click
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Virtual DOM

### Theory

The **Virtual DOM** is a lightweight JavaScript copy of the real DOM. On each state change, React builds a new VDOM tree, **compares** it with the previous one (diffing), and updates only the **changed parts** of the real DOM.

This is faster than rewriting the entire page.

### Pros & Cons

| Pros                                          | Cons                                  |
| --------------------------------------------- | ------------------------------------- |
| Efficient batched updates                     | CPU cost for diffing                  |
| Declarative — you describe state, not DOM ops | Not always faster than hand-tuned DOM |

### One-Line Interview Answer

> The Virtual DOM is a JS representation of the UI. React diffs the new tree against the old one and applies only the minimum DOM changes needed.

### Real Example

```jsx
// You write:
<p className={isActive ? "active" : ""}>{count}</p>

// React diffs: only className and text node update — rest of page untouched
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. React Router

### Theory

**React Router** maps URLs to components in a Single Page Application — no full page reload. Core pieces (v6): `BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`, `useParams`.

### Pros & Cons

| SPA routing           | Full page reload               |
| --------------------- | ------------------------------ |
| ✅ Instant navigation | ❌ Slower perceived navigation |
| ✅ App-like UX        | ❌ Needs SSR for SEO           |

### One-Line Interview Answer

> React Router handles client-side navigation — it maps URL paths to components without reloading the page, giving an app-like experience.

### Real Example

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Conditional Rendering

### Theory

Show different UI based on conditions — using `if/else`, ternary `? :`, logical `&&`, or early return.

### One-Line Interview Answer

> Conditional rendering means showing different UI based on state — I use ternary for two options, `&&` for show/hide, and early return for loading or error states.

### Real Example

```jsx
function OrderStatus({ order }) {
  if (!order) return <Spinner />;
  if (order.error) return <ErrorBanner message={order.error} />;

  return (
    <div>
      <h2>Order #{order.id}</h2>
      {order.status === "delivered" ? (
        <DeliveredBadge />
      ) : (
        <TrackingTimeline steps={order.steps} />
      )}
      {order.canCancel && <button onClick={cancelOrder}>Cancel</button>}
    </div>
  );
}
```

---

# Intermediate


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. useEffect Hook

### Theory

`useEffect` runs **side effects** after render — API calls, subscriptions, timers, DOM manipulation. It replaces class lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).

Returns an optional **cleanup function** that runs before re-run or unmount.

### Pros & Cons

| Pros                          | Cons                          |
| ----------------------------- | ----------------------------- |
| One hook for all side effects | Easy to create infinite loops |
| Cleanup built-in              | Can become a "god effect"     |

### One-Line Interview Answer

> `useEffect` handles side effects after render — fetching data, subscriptions, timers. I return a cleanup function to avoid memory leaks.

### Real Example

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]); // re-fetch when userId changes

  return user ? <ProfileCard user={user} /> : <Spinner />;
}
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Dependency Array

### Theory

The second argument of `useEffect` controls **when it re-runs**:

| Array    | Behavior                                |
| -------- | --------------------------------------- |
| Omitted  | Runs after **every** render             |
| `[]`     | Runs **once** on mount                  |
| `[a, b]` | Runs on mount + when `a` or `b` changes |

React compares deps with `Object.is` (shallow equality).

### Pros & Cons

| Correct deps                | Missing/wrong deps             |
| --------------------------- | ------------------------------ |
| ✅ Synced with latest state | ❌ Stale closures              |
| ✅ Predictable behavior     | ❌ Infinite loops with objects |

### One-Line Interview Answer

> The dependency array tells React when to re-run the effect. Empty array means mount only; listing values means re-run when they change. Missing deps cause stale bugs.

### Real Example

```jsx
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer); // cleanup
}, []); // mount only — empty array

useEffect(() => {
  fetchOrders(userId);
}, [userId]); // re-run when userId changes
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. useState Hook

### Theory

`useState` adds **local state** to function components. Returns `[value, setter]`. Updates are **async** and **batched**. Use functional updater `setCount(c => c + 1)` when new state depends on old.

### One-Line Interview Answer

> `useState` gives a component local state. It returns the current value and a setter. Updates trigger a re-render and are batched for performance.

### Real Example

```jsx
function Cart() {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems((prev) => [...prev, product]); // functional update — safe
  };

  return <p>{items.length} items in cart</p>;
}
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. useContext Hook

### Theory

`useContext` reads the **nearest value** from a Context Provider. It avoids passing props through every level — any descendant can access shared data directly.

### Pros & Cons

| Pros             | Cons                                    |
| ---------------- | --------------------------------------- |
| No prop drilling | All consumers re-render on value change |
| Clean API        | Not for frequently changing data        |

### One-Line Interview Answer

> `useContext` lets any component read shared data from a Provider without prop drilling — I use it for theme, auth, or locale.

### Real Example

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  return <header className={`header-${theme}`}>Logo</header>;
}
```

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Context API

### Theory

The **Context API** creates a global data channel. `createContext()` → `Provider` wraps tree → consumers use `useContext`. Best for **low-frequency** shared data: theme, language, auth session.

Avoid for fast-changing or fine-grained state — causes mass re-renders.

### One-Line Interview Answer

> Context shares data across the tree without prop drilling. I use it for theme and auth, not for fast-changing data — I'd use Zustand or Redux for that.

### Real Example

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(
    () => ({ user, login: setUser, logout: () => setUser(null) }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Custom Hooks

### Theory

A **custom hook** is a function starting with `use` that encapsulates reusable stateful logic. It can call other hooks. It is **not** a component — it returns data and functions.

### Pros & Cons

| Pros                                | Cons                             |
| ----------------------------------- | -------------------------------- |
| DRY — share logic across components | Must follow Rules of Hooks       |
| Keeps components clean              | Over-abstraction if too granular |

### One-Line Interview Answer

> Custom hooks extract reusable stateful logic — fetch, debounce, localStorage — into a `use` function shared across components.

### Real Example

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
}

// Usage
function ProductPage() {
  const { data, loading } = useFetch("/api/products");
  if (loading) return <Spinner />;
  return <ProductList products={data} />;
}
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Keys in React Lists

### Theory

**Keys** give list items a **stable identity** across re-renders. React uses keys to match, move, insert, or delete efficiently. Use **unique IDs from data** — not array index for mutable lists.

### Pros & Cons

| Stable ID keys               | Index keys                        |
| ---------------------------- | --------------------------------- |
| ✅ Preserves component state | ❌ State slides on delete/reorder |
| ✅ Efficient DOM moves       | ❌ Unnecessary re-renders         |

### One-Line Interview Answer

> Keys help React identify list items across renders. I use stable unique IDs from data — never index keys on lists that can change order or delete items.

### Real Example

```jsx
// ✅ Good
{
  todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);
}

// ❌ Bad — index keys on mutable list
{
  todos.map((todo, i) => <TodoItem key={i} todo={todo} />);
}
```

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. React.memo

### Theory

`React.memo` wraps a component and **skips re-render** if props haven't changed (shallow compare). Use when a component re-renders often with the same props — especially expensive child components.

### Pros & Cons

| Pros                      | Cons                                       |
| ------------------------- | ------------------------------------------ |
| Skips unnecessary renders | Shallow compare misses deep object changes |
| Pairs with useCallback    | Overuse adds comparison overhead           |

### One-Line Interview Answer

> `React.memo` memoizes a component — it skips re-render if props are shallowly equal. I use it on expensive list items after profiling shows unnecessary renders.

### Real Example

```jsx
const ProductRow = React.memo(function ProductRow({ product, onSelect }) {
  return (
    <tr onClick={() => onSelect(product.id)}>
      <td>{product.name}</td>
      <td>₹{product.price}</td>
    </tr>
  );
});
```

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. useRef Hook

### Theory

`useRef` returns a **mutable object** `{ current: value }` that persists across renders **without causing re-renders** when changed. Uses: DOM references, storing previous values, timers, mutable flags.

### One-Line Interview Answer

> `useRef` holds a mutable value that persists across renders without triggering re-renders. I use it for DOM access, timers, and values that don't need to be in state.

### Real Example

```jsx
function SearchInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus(); // DOM access
  }, []);

  return <input ref={inputRef} type="search" />;
}
```

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. useRef vs useState

### Theory

|                     | useState                    | useRef                        |
| ------------------- | --------------------------- | ----------------------------- |
| Triggers re-render? | Yes                         | No                            |
| Value access        | Direct `count`              | `ref.current`                 |
| Use for             | UI data that affects render | DOM refs, timers, prev values |
| Async updates       | Batched                     | Synchronous                   |

### One-Line Interview Answer

> `useState` triggers re-renders when changed — use it for UI data. `useRef` persists without re-rendering — use it for DOM refs and values that shouldn't affect the UI.

### Real Example

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null); // no re-render needed for timer ID

  const start = () => {
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stop = () => clearInterval(intervalRef.current);

  return (
    <>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

---

# Advanced


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

## 21. Code Splitting

### Theory

**Code splitting** breaks your JavaScript bundle into smaller **chunks** loaded on demand. Reduces initial download size. Achieved via dynamic `import()` — bundler (Webpack/Vite) creates separate files per chunk.

Split by **route** first for biggest impact.

### Pros & Cons

| Pros                | Cons                                  |
| ------------------- | ------------------------------------- |
| Faster initial load | More HTTP requests (HTTP/2 mitigates) |
| Better TTI          | Needs Suspense/error handling         |

### One-Line Interview Answer

> Code splitting divides the bundle into chunks loaded on demand. I split by route so users only download code for the page they visit.

### Real Example

```jsx
// Dynamic import — creates separate chunk
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
```

---


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

## 22. Lazy Loading

### Theory

**Lazy loading** defers loading a resource until needed. In React: `React.lazy()` for components. For images: native `loading="lazy"`. Often paired with code splitting.

### One-Line Interview Answer

> Lazy loading defers loading until needed — `React.lazy` for components, `loading="lazy"` for images — so the initial page loads faster.

### Real Example

```jsx
const AdminPanel = lazy(() => import("./AdminPanel"));

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  return (
    <>
      <button onClick={() => setShowAdmin(true)}>Admin</button>
      {showAdmin && (
        <Suspense fallback={<Spinner />}>
          <AdminPanel />
        </Suspense>
      )}
    </>
  );
}
```

---


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

## 23. Suspense

### Theory

**Suspense** shows a **fallback UI** while children are loading — typically lazy-loaded components or async data (React 19+). Declarative alternative to manual `isLoading` flags.

### Pros & Cons

| Pros                       | Cons                                  |
| -------------------------- | ------------------------------------- |
| Declarative loading states | Needs Error Boundary alongside        |
| Composable at any level    | Data Suspense needs framework support |

### One-Line Interview Answer

> Suspense displays a fallback while lazy components or async data load — it replaces manual loading spinners with declarative boundaries.

### Real Example

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/analytics" element={<Analytics />} />
  </Routes>
</Suspense>
```

---


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

## 24. Error Boundaries

### Theory

**Error Boundaries** catch JavaScript errors in child components during **rendering** and show fallback UI instead of crashing the app. Class components only (for now). Do **not** catch event handlers or async errors.

### Pros & Cons

| Pros              | Cons                       |
| ----------------- | -------------------------- |
| Isolates failures | Class component only       |
| Better UX         | No async/event error catch |

### One-Line Interview Answer

> Error Boundaries catch render errors in child trees and show fallback UI — I wrap each route or feature section so one bug doesn't crash the whole app.

### Real Example

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError)
      return (
        <p>
          Something went wrong.{" "}
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </p>
      );
    return this.props.children;
  }
}

<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>;
```

---


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

## 25. Controlled vs Uncontrolled Components

### Theory

|              | Controlled               | Uncontrolled        |
| ------------ | ------------------------ | ------------------- |
| Value source | React state              | DOM itself          |
| Updates      | `onChange` + `setState`  | `ref.current.value` |
| Validation   | Real-time in React       | On submit only      |
| Preferred?   | **Yes — React standard** | Legacy, file inputs |

### One-Line Interview Answer

> Controlled components store input value in React state — React is the single source of truth. Uncontrolled components let the DOM hold the value and we read it via ref on submit.

### Real Example

```jsx
// Controlled — preferred
function LoginForm() {
  const [email, setEmail] = useState("");
  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}

// Uncontrolled — ref on submit
function LoginFormUncontrolled() {
  const emailRef = useRef(null);
  const submit = () => console.log(emailRef.current.value);
  return <input ref={emailRef} defaultValue="" />;
}
```

---


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

## 26. Higher Order Components (HOC)

### Theory

A **HOC** is a function that takes a component and returns an **enhanced component** with extra props or behavior: `const Enhanced = withAuth(Wrapped)`.

Legacy pattern — **custom hooks** are preferred today for the same reuse without wrapper nesting.

### One-Line Interview Answer

> An HOC wraps a component to inject behavior or data — like `withAuth`. I know them for legacy code, but prefer custom hooks for new projects.

### Real Example

```jsx
function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}

export default withAuth(Dashboard);
```

---


<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

## 27. Prop Drilling

### Theory

**Prop drilling** is passing props through many intermediate components that don't use them, just to reach a deep child. Fix with **Context**, **component composition**, or **state library** (Zustand).

One-to-two levels of drilling is fine and explicit.

### One-Line Interview Answer

> Prop drilling is passing props through components that don't need them. I fix it with Context for global data, composition for layout slots, or Zustand when state is complex.

### Real Example

```jsx
// ❌ Drilling — theme through 3 levels
<App theme={theme}><Layout theme={theme}><Button theme={theme} /></Layout></App>

// ✅ Context
<ThemeProvider value={theme}><Layout /></ThemeProvider>
// Button reads theme via useContext — no drilling
```

---


<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

## 28. Reconciliation

### Theory

**Reconciliation** is React's process of comparing the new element tree with the previous one and computing the minimum DOM updates. Uses **Fiber** architecture — diff heuristics: different type replaces subtree, same type updates props, **keys** match list items.

Two phases: **Render** (interruptible) → **Commit** (sync DOM update).

### One-Line Interview Answer

> Reconciliation diffs the new virtual tree against the old one and applies minimal DOM changes. Keys help match list items; different element types replace the entire subtree.

### Real Example

```jsx
// Same key "a" — React moves node, preserves state
// Before: [<Item key="a" />, <Item key="b" />]
// After:  [<Item key="b" />, <Item key="a" />]
// Only DOM reorder — no unmount/remount
```

---


<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

## 29. Strict Mode

### Theory

`<StrictMode>` is a development-only wrapper that **double-invokes** certain functions (render, effects, state initializers) to expose side effects and impure code. It does **not** run in production.

Helps catch: missing cleanup, unsafe lifecycles, deprecated APIs.

### Pros & Cons

| Pros                          | Cons                                 |
| ----------------------------- | ------------------------------------ |
| Catches bugs early            | Double effects confuse beginners     |
| Prepares for Concurrent React | Not a bug — intentional dev behavior |

### One-Line Interview Answer

> Strict Mode is a dev-only tool that double-runs renders and effects to expose impure code and missing cleanups. It has no effect in production builds.

### Real Example

```jsx
// main.jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// useEffect runs twice in dev — if you see duplicate API calls,
// your cleanup is missing or effect has no abort logic
```

---


<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

## 30. Best Practices in React

### Theory

Production React follows consistent patterns for maintainability, performance, and reliability.

### Core practices checklist

| Practice                                    | Why                          |
| ------------------------------------------- | ---------------------------- |
| `const` by default, immutable state updates | Predictable renders          |
| Colocate state, lift only when needed       | Less re-renders              |
| Custom hooks for shared logic               | DRY                          |
| Keys from stable IDs                        | List performance + state     |
| Error Boundaries per route/feature          | Fault isolation              |
| Code split by route                         | Faster initial load          |
| Profile before memoizing                    | Avoid premature optimization |
| Separate UI from business logic             | Testability                  |
| TypeScript for large apps                   | Catch bugs early             |
| Cleanup in useEffect                        | No memory leaks              |

### One-Line Interview Answer

> I keep components small, state colocated, effects cleaned up, keys stable, routes code-split, and I profile before optimizing. Business logic lives in hooks and services, not in JSX.

### Real Example — folder structure

```
src/
├── features/
│   └── checkout/
│       ├── components/   # UI only
│       ├── hooks/        # useCheckout
│       ├── api/          # checkoutService
│       └── types.ts
├── shared/
│   └── components/       # Button, Modal
└── app/
    └── router.tsx
```

---

# Quick Revision — All 30 in One Table

| #   | Topic                      | One-Line Answer                               |
| --- | -------------------------- | --------------------------------------------- |
| 1   | React                      | Component-based UI library; state drives view |
| 2   | JSX                        | HTML-like syntax compiled to createElement    |
| 3   | Components                 | Reusable UI building blocks                   |
| 4   | Functional vs Class        | Functions + hooks = modern standard           |
| 5   | Props                      | Read-only inputs from parent                  |
| 6   | State                      | Mutable internal data; triggers re-render     |
| 7   | State vs Props             | Internal vs external; mutable vs read-only    |
| 8   | Virtual DOM                | JS tree + diff → minimal DOM updates          |
| 9   | React Router               | URL → component, no page reload               |
| 10  | Conditional rendering      | Ternary, &&, early return                     |
| 11  | useEffect                  | Side effects after render + cleanup           |
| 12  | Dependency array           | Controls when effect re-runs                  |
| 13  | useState                   | Local state + setter                          |
| 14  | useContext                 | Read context without drilling                 |
| 15  | Context API                | Share theme/auth across tree                  |
| 16  | Custom hooks               | Reusable stateful logic                       |
| 17  | Keys                       | Stable IDs for list identity                  |
| 18  | React.memo                 | Skip render if props equal                    |
| 19  | useRef                     | Mutable ref, no re-render                     |
| 20  | useRef vs useState         | No re-render vs triggers re-render            |
| 21  | Code splitting             | Bundle chunks on demand                       |
| 22  | Lazy loading               | Defer until needed                            |
| 23  | Suspense                   | Fallback while loading                        |
| 24  | Error Boundaries           | Catch render errors, show fallback            |
| 25  | Controlled vs Uncontrolled | State-driven input vs DOM ref                 |
| 26  | HOC                        | Wrap component for reuse; prefer hooks        |
| 27  | Prop drilling              | Fix with Context/composition                  |
| 28  | Reconciliation             | Diff + minimal DOM patch                      |
| 29  | Strict Mode                | Dev double-invoke for bug detection           |
| 30  | Best practices             | Small components, cleanup, split, profile     |

---

# How to Answer in Interviews

Use this **3-step pattern** for any React question:

1. **One sentence definition** — what it is
2. **One sentence why it matters** — when you'd use it
3. **One real example** — from a project or simple code

**Example for useEffect:**

> "`useEffect` runs side effects after render — things like API calls or subscriptions that shouldn't happen during render. I always return a cleanup function to prevent memory leaks. In my last project, I used it to fetch user profile on mount and abort the fetch if the user navigated away."

---

_Don't memorize paragraphs. Understand the concept, then explain it simply with one example. That is what interviewers remember._


<p><a href="#i30">Back to index</a></p>
