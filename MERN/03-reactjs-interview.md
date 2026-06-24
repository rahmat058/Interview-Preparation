---
title: "React.js Interview Questions & Answers"
description: "15 React.js interview topics — JSX, components, state, props, hooks, virtual DOM, router, and context."
tags: ["react", "mern", "frontend", "hooks", "interview"]
level: "All levels"
---

# React.js Interview Questions & Answers

---

## Table of Contents

1. [What is React?](#1-what-is-react)
2. [Features of React](#2-what-are-the-features-of-react)
3. [What is JSX?](#3-what-is-jsx)
4. [Components in React](#4-what-are-components-in-react)
5. [Functional vs Class Components](#5-what-is-the-difference-between-functional-and-class-components)
6. [Props in React](#6-what-are-props-in-react)
7. [State in React](#7-what-is-state-in-react)
8. [State vs Props](#8-what-is-the-difference-between-state-and-props)
9. [React Router](#9-what-is-react-router)
10. [Hooks in React](#10-what-are-hooks-in-react)
11. [Most Used React Hooks](#11-what-are-the-most-used-react-hooks)
12. [Virtual DOM](#12-what-is-the-virtual-dom)
13. [Controlled vs Uncontrolled Components](#13-what-is-the-difference-between-controlled-and-uncontrolled-components)
14. [How useEffect Works](#14-how-does-useeffect-work)
15. [Context in React](#15-what-is-context-in-react)

---

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

## 10. What are Hooks in React?

### Theory

**Hooks** let functional components use state, effects, context, and more — must follow Rules of Hooks (top level only, same order).

### Interview Answer

> Hooks add state and lifecycle to functional components — call them only at the top level of React functions.

---

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

## 12. What is the Virtual DOM?

### Theory

The **Virtual DOM** is a lightweight JS tree mirroring the real DOM. On state change, React diffs old vs new and applies **minimal** DOM updates.

### Interview Answer

> Virtual DOM is an in-memory UI representation — React diffs it against the previous version and patches only changed nodes for performance.

---

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
