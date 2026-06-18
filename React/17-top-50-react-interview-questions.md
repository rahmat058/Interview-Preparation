---
title: "Top 50 React Interview Questions — Pattern-Wise Guide"
description: "50 React interview questions organized by topic patterns — fundamentals, hooks, routing, API, performance, Redux, design patterns, and rendering."
tags: ["react", "interview", "hooks", "redux", "performance", "frontend"]
level: "All levels"
format: "Pattern-wise Q&A"
---

# Top 50 React Interview Questions — Pattern-Wise Guide

**50 questions organized by topic patterns** — not random practice. Each pattern builds on the last so you understand *why* concepts exist, not just *what* they are.

Every question includes **Theory**, **Pros & Cons** (where useful), a **One-Line Interview Answer**, and a **Real Example**.

> Preparing pattern-wise helps you connect related ideas — hooks with lifecycle, Context with prop drilling, memo with reconciliation — and answer follow-ups confidently.

---

## Table of Contents

### Pattern 1 — React Fundamentals & JSX (1–5)
1. [What is React?](#1-what-is-react)
2. [What is JSX?](#2-what-is-jsx)
3. [JSX vs HTML — Key Differences](#3-jsx-vs-html--key-differences)
4. [React Fragments](#4-react-fragments)
5. [Synthetic Events](#5-synthetic-events)

### Pattern 2 — Components, Props & State (6–10)
6. [Components in React](#6-components-in-react)
7. [Functional vs Class Components](#7-functional-vs-class-components)
8. [Props in React](#8-props-in-react)
9. [State in React](#9-state-in-react)
10. [State vs Props](#10-state-vs-props)

### Pattern 3 — Data Flow & Forms (11–14)
11. [Lifting State Up](#11-lifting-state-up)
12. [Conditional Rendering](#12-conditional-rendering)
13. [Controlled vs Uncontrolled Components](#13-controlled-vs-uncontrolled-components)
14. [Form Handling in React](#14-form-handling-in-react)

### Pattern 4 — Hooks (15–23)
15. [useState](#15-usestate)
16. [useEffect](#16-useeffect)
17. [Dependency Array](#17-dependency-array)
18. [useMemo](#18-usememo)
19. [useCallback](#19-usecallback)
20. [useRef & useRef vs useState](#20-useref--useref-vs-usestate)
21. [useReducer](#21-usereducer)
22. [Rules of Hooks](#22-rules-of-hooks)
23. [Custom Hooks](#23-custom-hooks)

### Pattern 5 — Virtual DOM, Reconciliation & Rendering (24–28)
24. [Virtual DOM](#24-virtual-dom)
25. [Reconciliation](#25-reconciliation)
26. [Keys in React Lists](#26-keys-in-react-lists)
27. [CSR vs SSR vs SSG & Hydration](#27-csr-vs-ssr-vs-ssg--hydration)
28. [React Fiber](#28-react-fiber)

### Pattern 6 — Context API (29–31)
29. [Context API](#29-context-api)
30. [useContext Hook](#30-usecontext-hook)
31. [Prop Drilling](#31-prop-drilling)

### Pattern 7 — React Router (32–35)
32. [React Router Basics](#32-react-router-basics)
33. [Dynamic Routes — useParams](#33-dynamic-routes--useparams)
34. [Navigation — useNavigate & useLocation](#34-navigation--usenavigate--uselocation)
35. [Protected Routes](#35-protected-routes)

### Pattern 8 — API Integration (36–39)
36. [Fetching Data with useEffect](#36-fetching-data-with-useeffect)
37. [Axios vs fetch in React](#37-axios-vs-fetch-in-react)
38. [TanStack Query (React Query)](#38-tanstack-query-react-query)
39. [Loading, Error & Empty States](#39-loading-error--empty-states)

### Pattern 9 — Performance Optimization (40–44)
40. [React.memo](#40-reactmemo)
41. [Code Splitting & Lazy Loading](#41-code-splitting--lazy-loading)
42. [Suspense](#42-suspense)
43. [useTransition & useDeferredValue](#43-usetransition--usedeferredvalue)
44. [React 18 Automatic Batching](#44-react-18-automatic-batching)

### Pattern 10 — Lifecycle Methods (45–46)
45. [Class Lifecycle Methods](#45-class-lifecycle-methods)
46. [useEffect as Lifecycle Replacement](#46-useeffect-as-lifecycle-replacement)

### Pattern 11 — Redux Basics (47–49)
47. [Redux — Store, Action, Reducer](#47-redux--store-action-reducer)
48. [Redux Toolkit (RTK)](#48-redux-toolkit-rtk)
49. [Redux vs Context API](#49-redux-vs-context-api)

### Pattern 12 — Error Handling & Design Patterns (50)
50. [Error Boundaries & Design Patterns](#50-error-boundaries--design-patterns)

---

# Pattern 1 — React Fundamentals & JSX

## 1. What is React?

### Theory

React is a **JavaScript library** for building user interfaces with **reusable components**. UI is a function of state — when state changes, React re-renders efficiently via the Virtual DOM.

It handles the **view layer only** — routing, global state, and API layers come from the ecosystem.

### Pros & Cons

| Pros | Cons |
|------|------|
| Component reusability | Needs companion libraries |
| Efficient DOM updates | JSX learning curve |
| Huge ecosystem | Fast-moving API changes |

### One-Line Interview Answer

> React is a component-based UI library. I describe what the UI should look like for a given state, and React updates the DOM efficiently when that state changes.

### Real Example

```jsx
function TransactionRow({ amount, status }) {
  return (
    <tr>
      <td>₹{amount}</td>
      <td className={status === "success" ? "green" : "red"}>{status}</td>
    </tr>
  );
}
```

---

## 2. What is JSX?

### Theory

**JSX** is syntax extension that lets you write HTML-like markup inside JavaScript. Babel compiles it to `React.createElement(type, props, ...children)`.

### One-Line Interview Answer

> JSX is syntactic sugar for React.createElement. It makes UI code readable and catches errors at compile time.

### Real Example

```jsx
// JSX
const btn = <button className="primary" onClick={pay}>Pay ₹{total}</button>;

// Compiled output
const btn = React.createElement("button", { className: "primary", onClick: pay }, "Pay ₹", total);
```

---

## 3. JSX vs HTML — Key Differences

### Theory

| JSX | HTML |
|-----|------|
| `className` | `class` |
| `htmlFor` | `for` |
| `onClick` (camelCase) | `onclick` (lowercase) |
| Self-closing required (`<img />`) | Optional in HTML5 |
| `style={{ color: "red" }}` (object) | `style="color: red"` (string) |
| `{}` for JavaScript expressions | Not available |
| One root element or Fragment | Multiple roots OK in HTML5 |

### One-Line Interview Answer

> JSX looks like HTML but uses camelCase attributes, className instead of class, JavaScript expressions in curly braces, and compiles to JavaScript — it's not parsed as HTML.

### Real Example

```jsx
// ❌ Invalid JSX
<div class="card" onclick={handleClick} style="color: blue">

// ✅ Valid JSX
<div className="card" onClick={handleClick} style={{ color: "blue" }}>
  {isLoggedIn ? <Dashboard /> : <Login />}
</div>
```

---

## 4. React Fragments

### Theory

**Fragments** (`<>...</>` or `<React.Fragment>`) let you group children **without adding an extra DOM node**. Useful when a component must return multiple siblings.

### Pros & Cons

| Pros | Cons |
|------|------|
| No wrapper div pollution | Can't style the fragment itself |
| Cleaner DOM | Named Fragment needs `React.Fragment` for keys |

### One-Line Interview Answer

> Fragments group multiple elements without an extra DOM node — I use them when returning sibling elements and a wrapper div would break layout or semantics.

### Real Example

```jsx
function TableRow({ name, email }) {
  return (
    <>
      <td>{name}</td>
      <td>{email}</td>
    </>
  );
}

// With key in a list — must use React.Fragment
items.map((item) => (
  <React.Fragment key={item.id}>
    <dt>{item.label}</dt>
    <dd>{item.value}</dd>
  </React.Fragment>
));
```

---

## 5. Synthetic Events

### Theory

React wraps native browser events in **SyntheticEvent** — a cross-browser normalized wrapper. React uses **event delegation** (events attached at root, not each node) for performance.

`e.persist()` is rarely needed in React 17+ (events no longer pooled).

### One-Line Interview Answer

> Synthetic events are React's cross-browser wrapper around native events. React delegates events at the root for performance — call preventDefault and stopPropagation normally.

### Real Example

```jsx
function SearchInput() {
  const handleSubmit = (e) => {
    e.preventDefault(); // works on SyntheticEvent
    fetchResults();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e) => setQuery(e.target.value)} />
    </form>
  );
}
```

---

# Pattern 2 — Components, Props & State

## 6. Components in React

### Theory

Components are **reusable UI building blocks** — functions (or classes) that accept input (props) and return JSX. They can be **presentational** (UI only) or **container** (data + logic).

Naming: **PascalCase** (`UserCard`, not `userCard`).

### One-Line Interview Answer

> Components are reusable functions that take props and return JSX. I split them into small, focused pieces — one responsibility per component.

### Real Example

```jsx
// Atomic design in practice
function Avatar({ src, alt }) { return <img src={src} alt={alt} className="avatar" />; }
function UserCard({ user }) {
  return (
    <div className="card">
      <Avatar src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  );
}
```

---

## 7. Functional vs Class Components

### Theory

| | Functional | Class |
|--|------------|-------|
| Syntax | Function + hooks | `class extends Component` |
| State | `useState` | `this.state` |
| Lifecycle | `useEffect` | `componentDidMount`, etc. |
| `this` | Not needed | Required |
| Modern standard | ✅ Yes | Legacy |

### One-Line Interview Answer

> Functional components with hooks are the modern standard — simpler, no this binding, easier to test. Class components still exist in legacy codebases.

### Real Example

```jsx
// Functional — modern
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}

// Class — legacy
class Counter extends React.Component {
  state = { count: 0 };
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count}</button>;
  }
}
```

---

## 8. Props in React

### Theory

**Props** (properties) are **read-only** inputs passed from parent to child. They flow **one way: down**. Never mutate props inside a child.

Spread props: `<Input {...fieldProps} />` for flexible composition.

### One-Line Interview Answer

> Props are read-only inputs from parent to child — one-way data flow. I destructure them in the function signature for clarity.

### Real Example

```jsx
function Button({ label, variant = "primary", disabled = false, onClick, ...rest }) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled} onClick={onClick} {...rest}>
      {label}
    </button>
  );
}

<Button label="Pay Now" variant="success" onClick={handlePay} aria-label="Pay now" />
```

---

## 9. State in React

### Theory

**State** is **mutable data owned by a component**. When state changes, React re-renders that component and its children. State updates are **asynchronous** and may be **batched**.

Always update state immutably — never mutate directly.

### One-Line Interview Answer

> State is local mutable data that triggers re-renders when it changes. I always update immutably — spread for objects, map/filter for arrays, functional updaters when depending on previous value.

### Real Example

```jsx
function Cart() {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems((prev) => [...prev, product]); // immutable
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
}
```

---

## 10. State vs Props

### Theory

| | State | Props |
|--|-------|-------|
| Owner | Component itself | Parent |
| Mutable? | Yes (via setState) | No — read-only |
| Purpose | Dynamic internal data | Configuration from parent |
| Changes | setState / dispatch | Parent re-renders with new props |

### One-Line Interview Answer

> Props are passed in from outside and are read-only. State is owned internally and changes over time. If multiple components need the same data, lift state up or use Context.

### Real Example

```jsx
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);
  return (
    <>
      <CelsiusInput value={celsius} onChange={setCelsius} />   {/* props down */}
      <FahrenheitDisplay celsius={celsius} />                   {/* derived via props */}
    </>
  );
}
```

---

# Pattern 3 — Data Flow & Forms

## 11. Lifting State Up

### Theory

When two sibling components need to share state, **lift it to their closest common parent**. Parent holds state and passes it down as props + callback to update.

This is React's primary pattern for shared local state before reaching for Context or Redux.

### One-Line Interview Answer

> When siblings need the same data, I lift state to their common parent and pass value plus setter as props — keeps a single source of truth.

### Real Example

```jsx
function App() {
  const [selectedId, setSelectedId] = useState(null);
  return (
    <>
      <ProductList selectedId={selectedId} onSelect={setSelectedId} />
      <ProductDetail id={selectedId} />
    </>
  );
}
```

---

## 12. Conditional Rendering

### Theory

Render different UI based on state or props using:
- `if/else` before return
- Ternary `condition ? <A /> : <B />`
- Logical AND `isLoggedIn && <Dashboard />`
- Early return for loading/error states

### One-Line Interview Answer

> I use early returns for loading and error states, ternary for two branches, and && for show/hide — always after all hooks are called.

### Real Example

```jsx
function UserProfile({ userId }) {
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState message="User not found" />;

  return (
    <div>
      <h1>{data.name}</h1>
      {data.isPremium && <PremiumBadge />}
    </div>
  );
}
```

---

## 13. Controlled vs Uncontrolled Components

### Theory

| | Controlled | Uncontrolled |
|--|------------|--------------|
| Value source | React state | DOM |
| Updates | `onChange` + `setState` | Ref to read DOM |
| Validation | Real-time in React | On submit |
| Best for | Forms, validation, dynamic UI | Simple inputs, file uploads |

### One-Line Interview Answer

> Controlled components bind input value to React state — I control every keystroke. Uncontrolled uses refs to read DOM values — simpler but less control.

### Real Example

```jsx
// Controlled
function ControlledInput() {
  const [email, setEmail] = useState("");
  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}

// Uncontrolled
function UncontrolledInput() {
  const ref = useRef(null);
  const submit = () => console.log(ref.current.value);
  return <input ref={ref} defaultValue="" />;
}
```

---

## 14. Form Handling in React

### Theory

React forms typically use **controlled components** with a single state object or libraries like **React Hook Form** / **Formik** for validation and performance.

Pattern: collect values on change, validate on blur/submit, prevent default on submit.

### One-Line Interview Answer

> I use controlled inputs with state or React Hook Form for performance. On submit I preventDefault, validate, then call the API — never rely on native form reload.

### Real Example

```jsx
function LoginForm({ onSubmit }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input name="email" value={form.email} onChange={handleChange} />
      {errors.email && <span>{errors.email}</span>}
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

# Pattern 4 — Hooks

## 15. useState

### Theory

`useState(initialValue)` returns `[value, setter]`. Initial value can be a function for lazy init: `useState(() => expensive())`.

Functional updates: `setCount(c => c + 1)` when new state depends on old.

### One-Line Interview Answer

> useState adds local state to functional components. I use functional updaters when the new value depends on the previous one.

### Real Example

```jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") ?? "null"));
setCount((prev) => prev + 1);
```

---

## 16. useEffect

### Theory

`useEffect(callback, deps)` runs **side effects** after render — API calls, subscriptions, DOM manipulation, timers.

Return a **cleanup function** to prevent leaks on unmount or before re-run.

### One-Line Interview Answer

> useEffect handles side effects after render. I always return a cleanup for subscriptions and timers, and specify deps to control when it re-runs.

### Real Example

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUser);
  return () => controller.abort();
}, [id]);
```

---

## 17. Dependency Array

### Theory

| Deps | Behavior |
|------|----------|
| `[a, b]` | Re-run when `a` or `b` changes |
| `[]` | Run once on mount |
| Omitted | Run after **every** render (avoid) |

ESLint `react-hooks/exhaustive-deps` catches missing deps.

### One-Line Interview Answer

> The dependency array controls when useEffect re-runs. Empty array means mount only. I include every value from the component scope that the effect reads.

### Real Example

```jsx
// ❌ Missing dep — stale closure
useEffect(() => { fetchData(userId); }, []);

// ✅ Correct
useEffect(() => { fetchData(userId); }, [userId]);
```

---

## 18. useMemo

### Theory

`useMemo(() => compute(a, b), [a, b])` **caches a computed value** between renders. Recomputes only when deps change. Runs during **render phase**.

Use for expensive calculations — not for every value (memoization has overhead).

### One-Line Interview Answer

> useMemo caches expensive computed values between renders. I use it when calculation cost exceeds memoization overhead — not for simple operations.

### Real Example

```jsx
function ProductList({ products, filter, sortBy }) {
  const filtered = useMemo(() => {
    return products
      .filter((p) => p.category === filter)
      .sort((a, b) => a[sortBy] - b[sortBy]);
  }, [products, filter, sortBy]);

  return filtered.map((p) => <ProductCard key={p.id} product={p} />);
}
```

---

## 19. useCallback

### Theory

`useCallback(fn, deps)` returns a **memoized function reference**. Prevents child re-renders when passing callbacks to `React.memo` children.

Pairs with `React.memo` — useless without memoized children.

### One-Line Interview Answer

> useCallback memoizes a function reference so React.memo children don't re-render unnecessarily. I only use it when passing callbacks to optimized children.

### Real Example

```jsx
const MemoRow = React.memo(function Row({ item, onDelete }) {
  return <tr><td>{item.name}</td><td><button onClick={() => onDelete(item.id)}>Delete</button></td></tr>;
});

function Table({ items }) {
  const handleDelete = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return items.map((item) => <MemoRow key={item.id} item={item} onDelete={handleDelete} />);
}
```

---

## 20. useRef & useRef vs useState

### Theory

`useRef(initial)` returns `{ current: value }` — **mutating `.current` does not trigger re-render**.

Uses: DOM refs, storing previous values, timers, mutable values across renders.

| | useRef | useState |
|--|--------|----------|
| Update triggers render? | No | Yes |
| Use for | DOM, timers, prev value | UI state |

### One-Line Interview Answer

> useRef holds a mutable value that persists across renders without causing re-renders — perfect for DOM refs and timer IDs. useState is for data that should update the UI.

### Real Example

```jsx
function AutoFocusInput() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current++;

  useEffect(() => { inputRef.current?.focus(); }, []);
  return <input ref={inputRef} />;
}
```

---

## 21. useReducer

### Theory

`useReducer(reducer, initialState)` manages **complex state** with predictable transitions — like Redux locally.

Pattern: `(state, action) => newState`. Good for forms, multi-step wizards, state machines.

### One-Line Interview Answer

> useReducer is useState for complex state — I dispatch actions to a reducer when state logic has multiple transitions or nested updates.

### Real Example

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "ADD": return { ...state, items: [...state.items, action.payload] };
    case "REMOVE": return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "SET_LOADING": return { ...state, loading: action.payload };
    default: return state;
  }
}

function Cart() {
  const [state, dispatch] = useReducer(reducer, { items: [], loading: false });
  return <button onClick={() => dispatch({ type: "ADD", payload: product })}>Add</button>;
}
```

---

## 22. Rules of Hooks

### Theory

1. **Only call hooks at the top level** — not inside conditions, loops, or nested functions
2. **Only call hooks from React functions** — components or custom hooks

Why: React stores hooks in a linked list indexed by call order. Conditional hooks break the order.

### One-Line Interview Answer

> Hooks must run in the same order every render — top level only, never inside if or loops. Put conditions inside the hook, not around it.

### Real Example

```jsx
// ❌ WRONG
if (loggedIn) { const [user, setUser] = useState(null); }

// ✅ CORRECT
const [user, setUser] = useState(null);
useEffect(() => {
  if (loggedIn) fetchUser().then(setUser);
  else setUser(null);
}, [loggedIn]);
```

---

## 23. Custom Hooks

### Theory

Custom hooks are **functions starting with `use`** that compose built-in hooks. They extract reusable **stateful logic** — not UI.

Same rules apply: only call other hooks at top level.

### One-Line Interview Answer

> Custom hooks extract reusable stateful logic — fetch, form, debounce. They share logic, not state, between components.

### Real Example

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const { data } = useSearch(debouncedQuery);
}
```

---

# Pattern 5 — Virtual DOM, Reconciliation & Rendering

## 24. Virtual DOM

### Theory

The **Virtual DOM** is a lightweight JavaScript object tree mirroring the real DOM. On state change, React builds a new virtual tree, **diffs** it against the previous one, and applies **minimal DOM updates**.

### Pros & Cons

| Pros | Cons |
|------|------|
| Efficient batched updates | Memory overhead |
| Declarative UI | Not always faster than direct DOM for tiny apps |

### One-Line Interview Answer

> The Virtual DOM is an in-memory representation of the UI. React diffs old vs new and updates only what changed — batching DOM writes for performance.

### Real Example

```jsx
// You write declarative UI
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((t) => <li key={t.id}>{t.text}</li>)}
    </ul>
  );
}
// React diffs and patches only changed <li> nodes — you never touch DOM directly
```

---

## 25. Reconciliation

### Theory

**Reconciliation** is React's diffing algorithm that compares virtual trees and decides what to update, insert, or delete.

Rules: different element **types** → tear down and rebuild. Same type → update props only. Lists use **keys** to match items.

### One-Line Interview Answer

> Reconciliation diffs the virtual DOM trees. Same component type gets prop updates; different types get replaced. Keys help React match list items correctly.

### Real Example

```jsx
// Type change: <div> → <span> — React destroys div subtree, builds span
{isBlock ? <div>Content</div> : <span>Content</span>}

// Same type, new props — React updates in place
<UserCard name="Amit" />  →  <UserCard name="Rahul" />
```

---

## 26. Keys in React Lists

### Theory

**Keys** help React identify which list items changed, were added, or removed. Must be **stable, unique among siblings** — prefer IDs over array index.

Index as key causes bugs with reorder, insert, or delete.

### One-Line Interview Answer

> Keys must be stable unique IDs — never array index when the list can reorder. Keys tell React which item is which during reconciliation.

### Real Example

```jsx
// ❌ Index key — bug on delete/reorder
{todos.map((t, i) => <TodoItem key={i} todo={t} />)}

// ✅ Stable ID
{todos.map((t) => <TodoItem key={t.id} todo={t} />)}
```

---

## 27. CSR vs SSR vs SSG & Hydration

### Theory

| | CSR | SSR | SSG |
|--|-----|-----|-----|
| Render | Browser | Server per request | Build time |
| First paint | Slow (JS first) | Fast (HTML first) | Fastest |
| SEO | Poor | Good | Good |
| Data freshness | Client fetch | Per request | Rebuild to update |

**Hydration**: SSR/SSG sends HTML; React **attaches** event listeners and state on the client without re-creating DOM.

### One-Line Interview Answer

> CSR renders in browser — good for dashboards. SSR renders per request — good for dynamic SEO pages. SSG pre-renders at build — good for blogs. Hydration makes server HTML interactive on the client.

### Real Example

```jsx
// Next.js SSR
export async function getServerSideProps() {
  const posts = await fetchPosts();
  return { props: { posts } };
}

// Next.js SSG
export async function getStaticProps() {
  const posts = await fetchPosts();
  return { props: { posts }, revalidate: 60 }; // ISR
}
```

---

## 28. React Fiber

### Theory

**Fiber** is React's reconciliation engine (React 16+). It enables:
- **Incremental rendering** — split work into units, pause/resume
- **Priority scheduling** — user input before background work
- **Concurrent features** — Suspense, transitions, useDeferredValue

Each fiber node represents a component instance with work-in-progress state.

### One-Line Interview Answer

> Fiber is React's internal architecture that enables incremental rendering and concurrent features — it can pause, prioritize, and resume work instead of blocking the main thread.

### Real Example

```jsx
// Concurrent features built on Fiber
const [isPending, startTransition] = useTransition();

function handleSearch(query) {
  setInput(query);                        // urgent — input stays responsive
  startTransition(() => setResults(search(query))); // low priority — can be interrupted
}
```

---

# Pattern 6 — Context API

## 29. Context API

### Theory

**Context** shares data across the component tree **without prop drilling**. Create with `createContext`, provide with `<Provider value>`, consume with `useContext`.

Best for **low-frequency updates**: theme, locale, auth user — not high-frequency state.

### Pros & Cons

| Pros | Cons |
|------|------|
| Eliminates prop drilling | All consumers re-render on value change |
| Built-in, no library | Can become a "god object" |

### One-Line Interview Answer

> Context shares data across the tree without passing props at every level. I use it for theme, auth, and locale — not for frequently changing data.

### Real Example

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Navbar />
      <Page />
    </ThemeContext.Provider>
  );
}
```

---

## 30. useContext Hook

### Theory

`useContext(MyContext)` reads the nearest Provider's value. Component **re-renders** when context value changes.

Optimize: split contexts (ThemeContext vs UserContext), memoize value object, or use selectors (Zustand/Redux).

### One-Line Interview Answer

> useContext reads context value from the nearest Provider. I split contexts by concern and memoize the value to avoid unnecessary re-renders.

### Real Example

```jsx
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button className={`btn-${theme}`} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle Theme
    </button>
  );
}
```

---

## 31. Prop Drilling

### Theory

**Prop drilling** is passing props through many intermediate components that don't use them — just to reach a deep child.

Solutions: Context API, component composition (children), state management (Redux/Zustand).

### One-Line Interview Answer

> Prop drilling is passing props through layers that don't need them. I fix it with Context for global data or component composition to skip middle layers.

### Real Example

```jsx
// ❌ Drilling user through 4 levels
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Avatar user={user} />

// ✅ Context
<UserProvider value={user}>
  <Layout><Sidebar><Avatar /></Sidebar></Layout>
</UserProvider>

// ✅ Composition — skip middle layers
<Layout sidebar={<Sidebar avatar={<Avatar user={user} />} />} />
```

---

# Pattern 7 — React Router

## 32. React Router Basics

### Theory

**React Router** enables client-side routing in SPAs. Core pieces:
- `BrowserRouter` — HTML5 history API
- `Routes` / `Route` — path-to-component mapping
- `Link` / `NavLink` — navigation without full reload
- `Outlet` — nested route rendering

### One-Line Interview Answer

> React Router maps URLs to components client-side. BrowserRouter wraps the app, Routes define path-component pairs, Link navigates without page reload.

### Real Example

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 33. Dynamic Routes — useParams

### Theory

Dynamic segments use `:param` in the path. `useParams()` reads them from the URL.

Nested routes use `<Outlet />` in the parent layout.

### One-Line Interview Answer

> Dynamic routes use :id in the path. useParams reads URL parameters — I use it to fetch data for detail pages.

### Real Example

```jsx
// Route: /products/:productId
function ProductDetail() {
  const { productId } = useParams();
  const { data, isLoading } = useProduct(productId);
  if (isLoading) return <Spinner />;
  return <h1>{data.name}</h1>;
}

<Route path="/products/:productId" element={<ProductDetail />} />
```

---

## 34. Navigation — useNavigate & useLocation

### Theory

- `useNavigate()` — programmatic navigation (`navigate("/dashboard")`, `navigate(-1)`)
- `useLocation()` — current location object (pathname, search, state)
- `useSearchParams()` — read/write URL query strings

### One-Line Interview Answer

> useNavigate for programmatic redirects after login or form submit. useLocation for reading current path or passed state. useSearchParams for query strings.

### Real Example

```jsx
function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async () => {
    await login(credentials);
    navigate(from, { replace: true });
  };
}

function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const setCategory = (cat) => setSearchParams({ category: cat });
}
```

---

## 35. Protected Routes

### Theory

**Protected routes** redirect unauthenticated users to login. Wrap route element in a guard component that checks auth state.

### One-Line Interview Answer

> I wrap protected routes in a guard component that checks auth — if not logged in, redirect to login with return URL in location state.

### Real Example

```jsx
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

---

# Pattern 8 — API Integration

## 36. Fetching Data with useEffect

### Theory

Classic pattern: `useEffect` + `fetch` + local state for data, loading, error. Always handle cleanup with **AbortController** to cancel in-flight requests on unmount.

### One-Line Interview Answer

> I fetch in useEffect with AbortController cleanup, track loading and error state, and re-fetch when dependencies like ID change.

### Real Example

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(setUser)
      .catch((e) => { if (e.name !== "AbortError") setError(e); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [userId]);
}
```

---

## 37. Axios vs fetch in React

### Theory

| | fetch | Axios |
|--|-------|-------|
| Built-in | Yes | No — npm package |
| JSON | Manual `.json()` | Auto-transform |
| Interceptors | Manual | Built-in |
| Timeout | Manual AbortController | Built-in config |
| Error on 4xx | No — check `response.ok` | Throws by default |

### One-Line Interview Answer

> fetch is built-in and fine for simple calls. Axios adds interceptors, auto JSON, and better error defaults — I use it with a configured instance for auth tokens and base URL.

### Real Example

```jsx
const api = axios.create({ baseURL: "/api/v1", timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) logout();
    return Promise.reject(err);
  }
);
```

---

## 38. TanStack Query (React Query)

### Theory

**TanStack Query** manages **server state** — caching, background refetch, deduplication, stale-while-revalidate. Replaces most manual useEffect fetch logic.

Core: `useQuery` (read), `useMutation` (write), `QueryClient`.

### Pros & Cons

| Pros | Cons |
|------|------|
| Caching, dedup, retry built-in | Learning curve |
| Less boilerplate than useEffect | Another dependency |

### One-Line Interview Answer

> TanStack Query handles server state — caching, refetching, loading and error states. I use useQuery for reads and useMutation for writes instead of manual useEffect fetching.

### Real Example

```jsx
function ProductList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", category],
    queryFn: () => api.get(`/products?cat=${category}`).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: (product) => api.post("/products", product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}
```

---

## 39. Loading, Error & Empty States

### Theory

Every data-fetching UI needs four states: **loading**, **error**, **empty**, **success**. Handle all explicitly — never show a blank screen.

Pattern: early returns or a unified `AsyncBoundary` component.

### One-Line Interview Answer

> I always handle loading, error, empty, and success states explicitly — early returns or a shared component so users never see a blank broken UI.

### Real Example

```jsx
function DataView({ query }) {
  const { data, isLoading, error, isFetching } = query;

  if (isLoading) return <Skeleton rows={5} />;
  if (error) return <ErrorBanner message={error.message} onRetry={query.refetch} />;
  if (!data?.length) return <EmptyState title="No results" action={<CreateButton />} />;

  return (
    <>
      {isFetching && <RefreshIndicator />}
      <ItemList items={data} />
    </>
  );
}
```

---

# Pattern 9 — Performance Optimization

## 40. React.memo

### Theory

`React.memo(Component)` wraps a component to **skip re-render** if props are shallowly equal. Custom comparison: `React.memo(Comp, (prev, next) => ...)`.

Only helps when parent re-renders often but props stay the same.

### One-Line Interview Answer

> React.memo prevents re-render when props haven't changed. I use it on expensive list items with stable callback props from useCallback.

### Real Example

```jsx
const ExpensiveChart = React.memo(function ExpensiveChart({ data, onPointClick }) {
  return <Chart data={data} onClick={onPointClick} />;
});
```

---

## 41. Code Splitting & Lazy Loading

### Theory

**Code splitting** breaks the bundle into chunks loaded on demand. `React.lazy(() => import("./Page"))` dynamically imports a component.

Always pair with `<Suspense fallback={...}>`.

### One-Line Interview Answer

> Code splitting loads routes and heavy components on demand. React.lazy plus Suspense reduces initial bundle size and improves first load.

### Real Example

```jsx
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 42. Suspense

### Theory

**Suspense** shows a **fallback UI** while children are loading (lazy components or data with Suspense-enabled libraries). Enables declarative loading states.

React 18+: Suspense for data fetching with frameworks like Next.js and Relay.

### One-Line Interview Answer

> Suspense shows fallback UI while lazy components or async data load — declarative loading instead of manual isLoading flags for code-split routes.

### Real Example

```jsx
<Suspense fallback={<Spinner />}>
  <LazyDashboard />
</Suspense>
```

---

## 43. useTransition & useDeferredValue

### Theory

- `useTransition` — mark state updates as **non-urgent** (low priority). Returns `[isPending, startTransition]`.
- `useDeferredValue` — defer re-rendering a **value** until urgent updates finish.

Both keep UI responsive during heavy updates (filtering large lists, tab switches).

### One-Line Interview Answer

> useTransition marks updates as low priority so input stays responsive. useDeferredValue delays rendering stale data until the UI catches up.

### Real Example

```jsx
function SearchResults({ query }) {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState(allItems);

  const handleChange = (q) => {
    setInput(q);
    startTransition(() => setResults(filterItems(allItems, q)));
  };

  return (
    <>
      <input value={input} onChange={(e) => handleChange(e.target.value)} />
      {isPending && <Spinner />}
      <List items={results} />
    </>
  );
}
```

---

## 44. React 18 Automatic Batching

### Theory

React 18 **batches all state updates** into one re-render — inside events, setTimeout, promises, and native handlers. Previously only batched in React event handlers.

`flushSync()` forces synchronous render when needed (measuring DOM).

### One-Line Interview Answer

> React 18 batches multiple setState calls everywhere — events, timeouts, promises — into one re-render. Use flushSync only when you need immediate DOM access.

### Real Example

```jsx
function handleClick() {
  setCount((c) => c + 1);
  setFlag(true);
  // React 18: ONE re-render
}

fetch("/api").then(() => {
  setData(result);
  setLoading(false);
  // Also batched in React 18
});
```

---

# Pattern 10 — Lifecycle Methods

## 45. Class Lifecycle Methods

### Theory

| Phase | Methods |
|-------|---------|
| Mount | `constructor`, `render`, `componentDidMount` |
| Update | `render`, `componentDidUpdate` |
| Unmount | `componentWillUnmount` |
| Error | `componentDidCatch`, `getDerivedStateFromError` |

Deprecated: `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`.

### One-Line Interview Answer

> Mount: componentDidMount for API calls. Update: componentDidUpdate when props change. Unmount: componentWillUnmount for cleanup. Error: componentDidCatch.

### Real Example

```jsx
class UserList extends React.Component {
  componentDidMount() { this.fetchUsers(); }
  componentDidUpdate(prevProps) {
    if (prevProps.teamId !== this.props.teamId) this.fetchUsers();
  }
  componentWillUnmount() { this.abortController?.abort(); }
  componentDidCatch(error) { this.setState({ error }); }
}
```

---

## 46. useEffect as Lifecycle Replacement

### Theory

| Lifecycle | Hook equivalent |
|-----------|-----------------|
| componentDidMount | `useEffect(() => {}, [])` |
| componentDidUpdate | `useEffect(() => {}, [dep])` |
| componentWillUnmount | `useEffect(() => { return cleanup }, [])` |
| componentDidUpdate (all) | `useEffect(() => {})` — avoid |

One useEffect can combine mount + unmount + update with cleanup.

### One-Line Interview Answer

> useEffect with empty deps replaces componentDidMount. Adding deps replaces componentDidUpdate. The cleanup function replaces componentWillUnmount.

### Real Example

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect(); // unmount + before re-run
  }, [roomId]); // re-run when roomId changes (didUpdate)
}
```

---

# Pattern 11 — Redux Basics

## 47. Redux — Store, Action, Reducer

### Theory

Redux flow: **UI → dispatch(action) → reducer(state, action) → new state → UI**

- **Store** — single source of truth
- **Action** — plain object `{ type, payload }`
- **Reducer** — pure function `(state, action) => newState`
- **Immutability** — never mutate; return new objects

### One-Line Interview Answer

> User action dispatches a plain action object. The reducer computes new state immutably. The store notifies subscribers and the UI re-renders.

### Real Example

```jsx
// Action
const addToCart = (product) => ({ type: "cart/add", payload: product });

// Reducer
function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case "cart/add": return { ...state, items: [...state.items, action.payload] };
    case "cart/remove": return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    default: return state;
  }
}

// Usage
store.dispatch(addToCart(product));
const items = store.getState().cart.items;
```

---

## 48. Redux Toolkit (RTK)

### Theory

**RTK** is the official Redux approach — reduces boilerplate with:
- `createSlice` — actions + reducer together
- `configureStore` — store with DevTools
- `createAsyncThunk` — async logic
- Immer built-in — "mutate" draft safely

### One-Line Interview Answer

> Redux Toolkit is the modern standard — createSlice combines actions and reducers, Immer allows safe mutation syntax, and createAsyncThunk handles API calls.

### Real Example

```jsx
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle" },
  reducers: {
    addItem: (state, action) => { state.items.push(action.payload); },
    clearCart: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
```

---

## 49. Redux vs Context API

### Theory

| | Redux / RTK | Context |
|--|-------------|---------|
| Use case | Complex global state, middleware | Theme, auth, locale |
| DevTools | Yes | No |
| Performance | Selective subscriptions (useSelector) | All consumers re-render |
| Async | createAsyncThunk, middleware | Manual in useEffect |
| Boilerplate | Higher (RTK reduces it) | Lower |

### One-Line Interview Answer

> Context for simple infrequent global data like theme. Redux for complex shared state with middleware, DevTools, and selective subscriptions — cart, auth with roles, real-time feeds.

### Real Example

```jsx
// Context — theme (changes rarely)
<ThemeProvider value={theme}>

// Redux — cart (many actions, DevTools, persistence)
const items = useSelector((s) => s.cart.items);
dispatch(addItem(product));
```

---

# Pattern 12 — Error Handling & Design Patterns

## 50. Error Boundaries & Design Patterns

### Theory

### Error Boundaries

Class components (or `react-error-boundary` library) that catch **render errors** in children via `componentDidCatch` / `getDerivedStateFromError`. They do **not** catch event handlers, async, or SSR errors.

### Design Patterns

| Pattern | Idea | When |
|---------|------|------|
| **HOC** | Function wrapping component to inject props | Cross-cutting: auth, logging |
| **Render Props** | Component accepts function as child | Shared behavior, flexible UI |
| **Compound Components** | Related components share implicit state | Tabs, Accordion, Select |
| **Container/Presentational** | Split logic vs UI | Testing, reuse |

Modern trend: **custom hooks replace HOCs and render props** for most cases.

### One-Line Interview Answer

> Error boundaries catch render errors and show fallback UI — I use react-error-boundary. For patterns, I prefer custom hooks over HOCs today, but I know compound components for design systems and HOCs in legacy code.

### Real Example

```jsx
// Error Boundary (react-error-boundary)
<ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => queryClient.resetQueries()}>
  <Dashboard />
</ErrorBoundary>

// HOC
function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}

// Render Props
<DataFetcher url="/api/users">
  {({ data, loading }) => loading ? <Spinner /> : <UserList users={data} />}
</DataFetcher>

// Compound Components
<Tabs defaultIndex={0}>
  <Tabs.List>
    <Tabs.Tab>Overview</Tabs.Tab>
    <Tabs.Tab>Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel><Overview /></Tabs.Panel>
    <Tabs.Panel><Settings /></Tabs.Panel>
  </Tabs.Panels>
</Tabs>

// Custom Hook — modern replacement
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
```

---

# Pattern Map — Quick Revision

| Pattern | Questions | Core idea |
|---------|-------------|-----------|
| Fundamentals & JSX | 1–5 | Library, JSX rules, Fragments, events |
| Components & State | 6–10 | Props down, state local, one-way flow |
| Data Flow & Forms | 11–14 | Lift state, controlled inputs |
| Hooks | 15–23 | Stateful logic, rules, custom hooks |
| Virtual DOM & Rendering | 24–28 | Diff, keys, CSR/SSR, Fiber |
| Context | 29–31 | Share without drilling |
| Router | 32–35 | SPA navigation, guards |
| API Integration | 36–39 | fetch, Axios, TanStack Query |
| Performance | 40–44 | memo, lazy, Suspense, transitions |
| Lifecycle | 45–46 | Class methods ↔ useEffect |
| Redux | 47–49 | Global state, RTK, vs Context |
| Errors & Patterns | 50 | Boundaries, HOC, compound, hooks |

---

# How to Study Pattern-Wise

1. **One pattern per session** — finish Hooks (15–23) before jumping to Redux
2. **Connect patterns** — after Context (29), revisit Prop Drilling (31) and Lifting State (11)
3. **Say the one-liner out loud** — if you can say it, you can answer in an interview
4. **Code the example** — type it, don't just read it
5. **Expect follow-ups** — "When would you NOT use useMemo?" → when cost < overhead

---

*50 questions. 12 patterns. Master the patterns and random interview questions become predictable.*
