---
title: "React.js Interview Questions & Answers"
description: "15 React.js interview topics — JSX, components, state, props, hooks, virtual DOM, router, and context."
tags: ["react", "mern", "frontend", "hooks", "interview"]
level: "All levels"
---

# React.js Interview Questions & Answers

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is React?](#p1) |
| <span id="i2"></span>2 | [Features of React](#p2) |
| <span id="i3"></span>3 | [What is JSX?](#p3) |
| <span id="i4"></span>4 | [Components in React](#p4) |
| <span id="i5"></span>5 | [Functional vs Class Components](#p5) |
| <span id="i6"></span>6 | [Props in React](#p6) |
| <span id="i7"></span>7 | [State in React](#p7) |
| <span id="i8"></span>8 | [State vs Props](#p8) |
| <span id="i9"></span>9 | [React Router](#p9) |
| <span id="i10"></span>10 | [Hooks in React](#p10) |
| <span id="i11"></span>11 | [Most Used React Hooks](#p11) |
| <span id="i12"></span>12 | [Virtual DOM](#p12) |
| <span id="i13"></span>13 | [Controlled vs Uncontrolled Components](#p13) |
| <span id="i14"></span>14 | [How useEffect Works](#p14) |
| <span id="i15"></span>15 | [Context in React](#p15) |

---

<a id="p1"></a>

## 1. What is React?

### Theory

**React** is a JavaScript library for building UIs with **reusable components** and a **declarative** model — UI = f(state).

### Real Example

```jsx
function ProductCard({ name, price }) {
  return (
    <article className="card">
      <h2>{name}</h2>
      <p>₹{price}</p>
    </article>
  );
}
```

### Interview Answer

> React is a component-based UI library where you declare what the interface should look like for a given state and React updates the DOM efficiently.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What are the features of React?

### Theory

- Component-based architecture
- Virtual DOM + reconciliation
- One-way data flow
- Hooks for state and side effects
- JSX syntax
- Strong ecosystem (Router, Query, etc.)

### Interview Answer

> Key features: components, Virtual DOM diffing, unidirectional data flow, hooks, and a rich ecosystem for MERN frontends.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What is JSX?

### Theory

**JSX** is syntax sugar — `React.createElement()` under the hood. Must transpile with Babel.

### Real Example

```jsx
// JSX
const el = <h1 className="title">Hello {user.name}</h1>;

// Compiles to
const el = React.createElement(
  "h1",
  { className: "title" },
  "Hello ",
  user.name,
);
```

### Interview Answer

> JSX lets you write HTML-like markup in JavaScript — it compiles to `React.createElement` calls and must return a single parent or Fragment.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What are components in React?

### Theory

**Components** are independent, reusable UI pieces — functions (or classes) that accept props and return elements.

### Real Example

```jsx
function App() {
  return (
    <Layout>
      <Header title="MERN Shop" />
      <ProductList />
      <Footer />
    </Layout>
  );
}
```

### Interview Answer

> Components are reusable UI building blocks — compose small focused components into pages.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. What is the difference between functional and class components?

### Theory

|                | Functional         | Class                     |
| -------------- | ------------------ | ------------------------- |
| Syntax         | `function` / arrow | `class extends Component` |
| State          | `useState`         | `this.state`              |
| Lifecycle      | `useEffect`        | `componentDidMount`, etc. |
| Modern default | ✅ Yes             | Legacy                    |

### Real Example

```jsx
// Functional (modern)
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### Interview Answer

> Functional components with hooks replaced classes for new code — simpler syntax, same capabilities, better optimization with React 18+.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. What are props in React?

### Theory

**Props** are read-only inputs from parent to child — one-way data flow.

### Real Example

```jsx
function UserBadge({ name, role, avatarUrl }) {
  return (
    <div className="badge">
      <img src={avatarUrl} alt="" />
      <span>{name}</span>
      <small>{role}</small>
    </div>
  );
}

<UserBadge name="Rahul" role="Admin" avatarUrl="/a.png" />;
```

### Interview Answer

> Props pass read-only data from parent to child — never mutate props inside the child.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. What is state in React?

### Theory

**State** is mutable data owned by a component — changes trigger re-renders.

### Real Example

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
    />
  );
}
```

### Interview Answer

> State is local mutable data — updating it via setState/useState triggers a re-render with the new UI.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. What is the difference between state and props?

### Theory

|         | Props         | State            |
| ------- | ------------- | ---------------- |
| Source  | Parent        | Component itself |
| Mutable | No            | Yes (via setter) |
| Purpose | Configuration | Interactive data |

### Interview Answer

> Props are external read-only inputs; state is internal and drives interactivity — lift state up when siblings need to share it.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. What is React Router?

### Theory

**React Router** enables client-side routing — map URLs to components without full page reload.

### Real Example

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Interview Answer

> React Router maps paths to components for SPA navigation — use protected route wrappers for auth in MERN apps.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. What are Hooks in React?

### Theory

**Hooks** let functional components use state, effects, context, and more — must follow Rules of Hooks (top level only, same order).

### Interview Answer

> Hooks add state and lifecycle to functional components — call them only at the top level of React functions.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. What are the most used React Hooks?

### Theory

| Hook          | Purpose                   |
| ------------- | ------------------------- |
| `useState`    | Local state               |
| `useEffect`   | Side effects after render |
| `useContext`  | Consume context           |
| `useRef`      | DOM ref / mutable value   |
| `useMemo`     | Memoize expensive compute |
| `useCallback` | Stable function reference |
| `useReducer`  | Complex state logic       |

### Real Example

```jsx
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return <OrderList orders={orders} />;
}
```

### Interview Answer

> Most common: `useState` for state, `useEffect` for API calls and subscriptions, `useContext` for global auth, `useRef` for DOM access.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. What is the Virtual DOM?

### Theory

The **Virtual DOM** is a lightweight JS tree mirroring the real DOM. On state change, React diffs old vs new and applies **minimal** DOM updates.

### Interview Answer

> Virtual DOM is an in-memory UI representation — React diffs it against the previous version and patches only changed nodes for performance.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. What is the difference between controlled and uncontrolled components?

### Theory

|              | Controlled           | Uncontrolled        |
| ------------ | -------------------- | ------------------- |
| Value source | React state          | DOM                 |
| Access       | `value` + `onChange` | `ref.current.value` |

### Real Example

```jsx
// Controlled
function ControlledInput() {
  const [email, setEmail] = useState("");
  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}

// Uncontrolled
function UncontrolledInput() {
  const ref = useRef();
  const submit = () => console.log(ref.current.value);
  return (
    <>
      <input ref={ref} />
      <button onClick={submit}>Go</button>
    </>
  );
}
```

### Interview Answer

> Controlled components bind input value to React state; uncontrolled use refs — prefer controlled for forms with validation in MERN apps.

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. How does useEffect work?

### Theory

`useEffect(fn, deps)` runs **after paint**. Cleanup returned from `fn` runs before next effect and on unmount.

| deps     | Behavior                |
| -------- | ----------------------- |
| omitted  | Every render            |
| `[]`     | Mount only              |
| `[a, b]` | When `a` or `b` changes |

### Real Example

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/user/${id}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUser);

  return () => controller.abort(); // cleanup on id change / unmount
}, [id]);
```

### Interview Answer

> `useEffect` runs side effects after render — use the dependency array to control when it re-runs and return cleanup for subscriptions and abort controllers.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. What is context in React?

### Theory

**Context** shares data across the tree without prop drilling — theme, auth user, locale.

### Real Example

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Interview Answer

> Context provides global state without prop drilling — good for auth and theme; use Zustand/Redux when updates are frequent or state is large.

---

**Next:** [04-nodejs-interview.md](./04-nodejs-interview.md) · Deep dive: [React folder](../React/)


<p><a href="#i15">Back to index</a></p>
