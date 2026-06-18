---
title: "Tata Elxsi ReactJS Developer Interview Preparation"
description: "JavaScript fundamentals, React hooks, routing, Axios, security, and performance — with theory, pros/cons, and real-life examples."
tags: ["react", "javascript", "tata-elxsi", "interview", "routing", "security"]
level: "2–5 years"
company: "Tata Elxsi"
---

# Tata Elxsi ReactJS Developer Interview Preparation

Questions from a recent Tata Elxsi ReactJS Developer interview — covering **JavaScript fundamentals**, **React hooks & patterns**, **routing**, **API integration**, **frontend security**, and **performance optimization**.

Each topic includes **Theory**, **Pros & Cons**, and a **Real-Life Example**.

---

## Table of Contents

1. [What is the Event Loop?](#1-what-is-the-event-loop)
2. [Find the second largest element in an array](#2-given-an-array-how-do-you-find-the-second-largest-element)
3. [Debouncing and Throttling](#3-what-is-debouncing-and-throttling)
4. [How do map() and bind() work?](#4-how-do-map-and-bind-methods-work)
5. [What is Axios? How do you use it?](#5-what-is-axios-how-do-you-use-it)
6. [How do you connect routes in React?](#6-how-do-you-connect-routes-in-react)
7. [Frontend security practices](#7-what-do-you-do-for-security-purposes-in-frontend-applications)
8. [Hooks — useEffect, useCallback, useMemo](#8-what-are-hooks-explain-useeffect-usecallback-and-usememo)
9. [Higher Order Component (HOC)](#9-what-is-a-higher-order-component-hoc)
10. [What is Hoisting?](#10-what-is-hoisting)
11. [What is Props Drilling?](#11-what-is-props-drilling)
12. [What is Event Bubbling?](#12-what-is-event-bubbling)
13. [Microtasks and Macrotasks](#13-what-are-microtasks-and-macrotasks)

---

## 1. What is the Event Loop?

### Theory

JavaScript runs on a **single thread** — only one piece of code executes at a time on the call stack. The **Event Loop** is the mechanism that coordinates execution between:

- **Call Stack** — currently running synchronous code
- **Web APIs** — browser APIs (`setTimeout`, `fetch`, DOM events) that run outside the main thread
- **Callback Queue (Macrotask Queue)** — callbacks waiting to enter the call stack
- **Microtask Queue** — higher-priority jobs (Promises, `queueMicrotask`)

**Execution order:**

1. Run all synchronous code on the call stack
2. Drain **all microtasks** completely
3. Run **one macrotask**
4. Repeat

This is why `Promise.then` runs before `setTimeout`, even when both are scheduled at the same time.

### Pros & Cons

| Pros                                       | Cons                                           |
| ------------------------------------------ | ---------------------------------------------- |
| Simple concurrency model — no thread locks | Long synchronous code blocks the entire UI     |
| Non-blocking I/O via callbacks/promises    | Easy to create microtask starvation            |
| Predictable single-thread execution        | "Callback hell" without async/await discipline |

### Real-Life Example

```javascript
console.log("1: User clicks button");

setTimeout(() => {
  console.log("4: Analytics event sent");
}, 0);

fetch("/api/orders").then(() => console.log("3: Orders loaded"));

console.log("2: UI updated immediately");

// Output:
// 1: User clicks button
// 2: UI updated immediately
// 3: Orders loaded        ← microtask (Promise)
// 4: Analytics event sent ← macrotask (setTimeout)
```

```jsx
// Real React impact — don't block the event loop
function HeavyDashboard({ data }) {
  // ❌ Blocks UI for 2 seconds — user can't scroll or click
  const processed = processMillionRows(data);

  // ✅ Yield to event loop — UI stays responsive
  const [processed, setProcessed] = useState([]);
  useEffect(() => {
    const chunk = () => {
      const result = processChunk(data, 0, 1000);
      setProcessed((prev) => [...prev, ...result]);
      if (hasMore) requestIdleCallback(chunk);
    };
    chunk();
  }, [data]);
}
```

### Interview answer (concise)

> The event loop manages JavaScript's single thread. Sync code runs first, then all microtasks (Promises), then one macrotask (setTimeout, I/O). This ordering explains async behavior and why blocking the main thread freezes the UI.

---

## 2. Given an array, how do you find the second largest element?

### Theory

Find the **second largest unique element** in an array. Common approaches:

| Approach                 | Time       | Space        | Notes                        |
| ------------------------ | ---------- | ------------ | ---------------------------- |
| Sort + scan              | O(n log n) | O(1) or O(n) | Simple but overkill          |
| Two variables (one pass) | O(n)       | O(1)         | Optimal — interview favorite |
| Set + sort               | O(n log n) | O(n)         | Handles duplicates easily    |

Watch for edge cases: duplicates, array length < 2, all same elements.

### Pros & Cons

| One-pass (O(n))                  | Sort approach                         |
| -------------------------------- | ------------------------------------- |
| Optimal time complexity          | Easier to write under pressure        |
| O(1) space                       | Handles duplicates naturally with Set |
| Must handle edge cases carefully | Slower for large arrays               |

### Real-Life Example

```javascript
// ✅ Optimal — single pass, O(n) time, O(1) space
function findSecondLargest(arr) {
  if (arr.length < 2) return null;

  let largest = -Infinity;
  let secondLargest = -Infinity;

  for (const num of arr) {
    if (num > largest) {
      secondLargest = largest;
      largest = num;
    } else if (num > secondLargest && num < largest) {
      secondLargest = num;
    }
    // if num === largest, skip (duplicate)
  }

  return secondLargest === -Infinity ? null : secondLargest;
}

console.log(findSecondLargest([10, 5, 20, 8, 20])); // 10
console.log(findSecondLargest([5, 5, 5])); // null (no second largest)
console.log(findSecondLargest([42, 17])); // 17
```

```javascript
// Alternative — sort with dedup (simpler, good for interviews if you explain trade-off)
function findSecondLargestSort(arr) {
  const unique = [...new Set(arr)];
  if (unique.length < 2) return null;
  unique.sort((a, b) => b - a);
  return unique[1];
}
```

```javascript
// Real-life use: Find runner-up score in a leaderboard
const scores = [95, 87, 95, 72, 88, 87];
const runnerUp = findSecondLargest(scores); // 88
```

### Walk-through

```
[10, 5, 20, 8, 20]
 num=10: largest=10, second=-∞
 num=5:  largest=10, second=5
 num=20: largest=20, second=10
 num=8:  largest=20, second=10 (8 < 10)
 num=20: skip (duplicate of largest)
 → return 10
```

---

## 3. What is Debouncing and Throttling?

### Theory

Both limit how often a function executes during high-frequency events, but with different strategies:

|              | Debounce                                     | Throttle                                          |
| ------------ | -------------------------------------------- | ------------------------------------------------- |
| **Behavior** | Wait until activity **stops**, then run once | Run at most **once per interval** during activity |
| **Analogy**  | Elevator waits for everyone to board         | Train departs every 10 minutes regardless         |
| **Best for** | Search input, resize-end, auto-save          | Scroll, mousemove, button spam prevention         |

### Pros & Cons

| Debounce                               | Throttle                                               |
| -------------------------------------- | ------------------------------------------------------ |
| ✅ Minimizes total executions          | ✅ Guarantees regular updates during continuous events |
| ✅ Great for API cost reduction        | ✅ Better for scroll analytics                         |
| ❌ Delays until pause ends             | ❌ May miss final state without trailing edge          |
| ❌ Can feel sluggish if delay too long | ❌ More executions than debounce                       |

### Real-Life Example

```javascript
// Debounce — search restaurants after user stops typing
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchRestaurants = debounce(async (query) => {
  const { data } = await axios.get(`/api/restaurants?q=${query}`);
  setResults(data);
}, 300);

// Throttle — track scroll position max once per 200ms
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const trackScroll = throttle(() => {
  analytics.track("scroll_depth", { y: window.scrollY });
}, 200);
```

```jsx
// React usage
function SearchBar() {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () => debounce((q) => fetchResults(q), 300),
    [],
  );

  useEffect(() => {
    if (query) debouncedSearch(query);
    return () => debouncedSearch.cancel?.(); // cleanup if using lodash
  }, [query]);
}
```

---

## 4. How do map() and bind() methods work?

### Theory

These are different concepts that interviewers often group together:

**`Array.prototype.map()`** — creates a **new array** by transforming each element through a callback. Does not mutate the original array.

**`Function.prototype.bind()`** — creates a **new function** with a fixed `this` context and optionally pre-filled arguments. Does not invoke the function immediately.

### Pros & Cons

| map()                         | bind()                                       |
| ----------------------------- | -------------------------------------------- |
| ✅ Immutable transformation   | ✅ Fixes `this` in callbacks                 |
| ✅ Declarative, chainable     | ✅ Partial application                       |
| ❌ Creates new array (memory) | ❌ Less needed with arrow functions/hooks    |
| ❌ Can't short-circuit early  | ❌ Slight memory overhead per bound function |

### Real-Life Example — map()

```javascript
const orders = [
  { id: 1, item: "Biryani", price: 299 },
  { id: 2, item: "Naan", price: 49 },
  { id: 3, item: "Lassi", price: 79 },
];

// Transform API data for UI display
const orderSummary = orders.map((order) => ({
  label: `${order.item} — ₹${order.price}`,
  id: order.id,
}));
// [{ label: "Biryani — ₹299", id: 1 }, ...]

// React — map is the primary way to render lists
function OrderList({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.item} — ₹{order.price}
        </li>
      ))}
    </ul>
  );
}
```

### Real-Life Example — bind()

```javascript
const deliveryPartner = {
  name: "Rahul",
  getStatus(orderId) {
    return `${this.name} is delivering order #${orderId}`;
  },
};

// bind — fix `this` and optionally pre-fill args
const getStatusForOrder = deliveryPartner.getStatus.bind(deliveryPartner);
getStatusForOrder(1042); // "Rahul is delivering order #1042"

// Partial application
const greet = function (greeting, name) {
  return `${greeting}, ${name}!`;
};
const sayHello = greet.bind(null, "Hello");
sayHello("Amit"); // "Hello, Amit!"

// Class component (legacy) — bind in constructor
class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    this.props.onSubmit(this.state); // `this` is correct
  }
}

// Modern React — arrow functions replace bind
function OrderForm({ onSubmit }) {
  const [data, setData] = useState({});
  const handleSubmit = () => onSubmit(data); // no bind needed
}
```

---

## 5. What is Axios? How do you use it?

### Theory

**Axios** is a promise-based HTTP client for browsers and Node.js. It simplifies API calls with features like automatic JSON transformation, request/response interceptors, timeout support, and cancellation.

Unlike raw `fetch`, Axios provides:

- Automatic JSON parsing
- Request/response interceptors (auth tokens, error handling)
- Built-in timeout and cancel token support
- Better error handling (non-2xx throws by default with config)

### Pros & Cons

| Pros                                    | Cons                                                   |
| --------------------------------------- | ------------------------------------------------------ |
| Clean API, less boilerplate than fetch  | Extra dependency (~13KB gzipped)                       |
| Interceptors for auth and global errors | fetch is native — no install needed                    |
| Automatic JSON transform                | TanStack Query often preferred for data fetching layer |
| Request cancellation built-in           | Can hide fetch details from juniors                    |

### Real-Life Example

#### Installation

```bash
npm install axios
```

#### Basic usage

```javascript
import axios from "axios";

// GET
const { data: restaurants } = await axios.get("/api/restaurants", {
  params: { city: "bangalore", cuisine: "north-indian" },
});

// POST
const { data: order } = await axios.post("/api/orders", {
  restaurantId: 42,
  items: [{ id: 1, quantity: 2 }],
});

// PUT / PATCH / DELETE
await axios.put(`/api/cart/${userId}`, { items: updatedCart });
await axios.patch(`/api/orders/${orderId}`, { status: "cancelled" });
await axios.delete(`/api/cart/items/${itemId}`);
```

#### Axios instance with interceptors (production pattern)

```javascript
// api/client.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      window.location.href = "/login";
    }
    if (error.response?.status === 503) {
      toast.error("Service temporarily unavailable");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

#### Usage in React component

```tsx
import { useEffect, useState } from "react";
import apiClient from "../api/client";

function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get(`/users/${userId}/orders`, { signal: controller.signal })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        if (!axios.isCancel(err)) setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  return <OrderList orders={orders} />;
}
```

---

## 6. How do you connect routes in React?

### Theory

**React Router** is the standard library for client-side routing in React SPAs. It maps URLs to components without full page reloads, enabling navigation, nested routes, protected routes, and URL parameters.

Core components (v6+):

- `BrowserRouter` — wraps app, uses HTML5 history API
- `Routes` / `Route` — define URL-to-component mapping
- `Link` / `NavLink` — navigation without page reload
- `useNavigate`, `useParams`, `useSearchParams` — programmatic navigation and URL data

### Pros & Cons

| Client-side routing (SPA)                                    | Server-side routing               |
| ------------------------------------------------------------ | --------------------------------- |
| ✅ Instant navigation, no full reload                        | ✅ Better SEO out of the box      |
| ✅ App-like experience                                       | ✅ Works without JavaScript       |
| ❌ Needs SSR/SSG for SEO                                     | ❌ Full page reload on navigation |
| ❌ Initial bundle includes all routes (without lazy loading) | ❌ Slower perceived navigation    |

### Real-Life Example

#### Installation

```bash
npm install react-router-dom
```

#### Basic routing setup

```tsx
// App.tsx
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Restaurants = lazy(() => import("./pages/Restaurants"));
const RestaurantDetail = lazy(() => import("./pages/RestaurantDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/cart">Cart</Link>
      </nav>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

#### Protected route

```tsx
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

#### Dynamic params and navigation

```tsx
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

function RestaurantDetail() {
  const { id } = useParams(); // /restaurants/:id
  const [searchParams] = useSearchParams(); // ?sort=rating&filter=veg
  const navigate = useNavigate();

  const sort = searchParams.get("sort") ?? "rating";

  const goToCart = () => navigate("/cart", { state: { from: id } });

  return (
    <div>
      <h1>Restaurant #{id}</h1>
      <p>Sorted by: {sort}</p>
      <button onClick={goToCart}>Go to Cart</button>
    </div>
  );
}
```

#### Nested routes with layout

```tsx
// Dashboard layout with sidebar
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  <Route path="orders" element={<Orders />} />
  <Route path="settings" element={<Settings />} />
</Route>;

// DashboardLayout.tsx
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <Outlet />
      </main>{" "}
      {/* child routes render here */}
    </div>
  );
}
```

---

## 7. What do you do for security purposes in frontend applications?

### Theory

Frontend security protects users and data in the browser. While true security enforcement happens on the **server**, the frontend must prevent common attacks and never trust client-side code alone.

Key areas: **XSS**, **CSRF**, **authentication**, **data exposure**, **dependency security**, and **secure communication**.

### Pros & Cons of frontend security layers

| Practice           | Benefit                        | Limitation                    |
| ------------------ | ------------------------------ | ----------------------------- |
| Input sanitization | Prevents XSS                   | Server must also validate     |
| httpOnly cookies   | Tokens not accessible to JS    | Requires backend support      |
| CSP headers        | Blocks inline script injection | Can break third-party scripts |
| HTTPS only         | Encrypts data in transit       | Doesn't protect against XSS   |

### Real-Life Example — Security checklist

#### 1. Prevent XSS (Cross-Site Scripting)

```tsx
// ❌ Dangerous — renders raw HTML from user/API
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// ✅ Safe — React escapes by default
<div>{userComment}</div>

// ✅ If HTML needed — sanitize first
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />
```

#### 2. Secure token storage

```javascript
// ❌ Never store tokens in localStorage (accessible to any JS/XSS)
localStorage.setItem("token", accessToken);

// ✅ Use httpOnly, Secure, SameSite cookies (set by backend)
// Frontend cannot read it — immune to XSS token theft
// Backend sets: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict
```

#### 3. Authentication & authorization

```tsx
// Frontend checks are UX only — backend MUST enforce
function AdminPanel() {
  const { user } = useAuth();

  // UI guard
  if (!user?.roles.includes("admin")) {
    return <Navigate to="/unauthorized" />;
  }

  return <AdminDashboard />;
}

// API calls always include auth — backend validates
apiClient.get("/api/admin/users"); // 403 if not admin, regardless of UI
```

#### 4. Environment variables

```javascript
// ✅ Public keys only in frontend env
VITE_API_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=abc123  // public OAuth client ID — OK

// ❌ NEVER expose secrets in frontend
VITE_STRIPE_SECRET_KEY=sk_live_xxx  // visible in bundled JS!
```

#### 5. Content Security Policy (CSP)

```html
<!-- Set via server headers -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
/>
```

#### 6. CSRF protection

```javascript
// Include CSRF token in state-changing requests
apiClient.post("/api/orders", orderData, {
  headers: { "X-CSRF-Token": getCsrfTokenFromCookie() },
});
```

#### 7. Dependency security

```bash
npm audit
npm audit fix
# CI pipeline: Snyk or Dependabot for vulnerable packages
```

#### 8. Other practices

| Practice                       | Why                                      |
| ------------------------------ | ---------------------------------------- |
| HTTPS everywhere               | Encrypt data in transit                  |
| Validate/sanitize all inputs   | Client + server validation               |
| Rate limit sensitive actions   | Prevent brute force on login             |
| Logout clears all session data | Prevent session fixation                 |
| Subresource Integrity (SRI)    | Verify CDN scripts haven't been tampered |
| Don't log sensitive data       | Console logs visible in production tools |

### Interview answer (concise)

> Frontend security is defense-in-depth: sanitize inputs against XSS, store tokens in httpOnly cookies not localStorage, never put secrets in env vars shipped to browser, use HTTPS, implement CSP headers, validate on both client and server, and run npm audit in CI. Frontend guards are for UX — backend always enforces authorization.

---

## 8. What are Hooks? Explain useEffect, useCallback, and useMemo

### Theory

**Hooks** are functions that let you use state, side effects, and other React features in **function components** — without class components. They follow the **Rules of Hooks**: only call at the top level, only in React functions.

| Hook          | Purpose                                |
| ------------- | -------------------------------------- |
| `useState`    | Local component state                  |
| `useEffect`   | Side effects (API, subscriptions, DOM) |
| `useCallback` | Memoize function reference             |
| `useMemo`     | Memoize computed value                 |
| `useRef`      | Mutable ref without re-render          |
| `useContext`  | Consume context                        |

### Pros & Cons

| Pros                         | Cons                                   |
| ---------------------------- | -------------------------------------- |
| Simpler than class lifecycle | Rules of Hooks can confuse beginners   |
| Reusable custom hooks        | Easy to overuse useEffect              |
| Less boilerplate             | Stale closure bugs without proper deps |

### Real-Life Example

#### useEffect — side effects

```tsx
function LiveOrderTracker({ orderId }) {
  const [status, setStatus] = useState("pending");

  // Fetch on mount + when orderId changes; cleanup on unmount
  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/orders/${orderId}`);

    ws.onmessage = (event) => {
      setStatus(JSON.parse(event.data).status);
    };

    ws.onerror = () => setStatus("error");

    return () => ws.close(); // cleanup — prevent memory leak
  }, [orderId]);

  return <OrderStatusBadge status={status} />;
}
```

#### useMemo — expensive computation

```tsx
function RestaurantList({ restaurants, filters }) {
  // Only re-filter when restaurants or filters change
  const filtered = useMemo(() => {
    return restaurants
      .filter((r) => !filters.cuisine || r.cuisine === filters.cuisine)
      .filter((r) => !filters.minRating || r.rating >= filters.minRating)
      .sort((a, b) => b.rating - a.rating);
  }, [restaurants, filters]);

  return filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />);
}
```

#### useCallback — stable function reference

```tsx
const RestaurantCard = React.memo(function RestaurantCard({
  restaurant,
  onFavorite,
}) {
  return (
    <div>
      <h3>{restaurant.name}</h3>
      <button onClick={() => onFavorite(restaurant.id)}>♥ Save</button>
    </div>
  );
});

function RestaurantList({ restaurants }) {
  const [favorites, setFavorites] = useState([]);

  // Without useCallback, RestaurantCard re-renders every parent render
  const handleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  return restaurants.map((r) => (
    <RestaurantCard key={r.id} restaurant={r} onFavorite={handleFavorite} />
  ));
}
```

#### Custom hook — combining hooks

```tsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage
const debouncedQuery = useDebounce(searchQuery, 300);
useEffect(() => {
  if (debouncedQuery) fetchResults(debouncedQuery);
}, [debouncedQuery]);
```

---

## 9. What is a Higher Order Component (HOC)?

### Theory

A **Higher Order Component** is a function that takes a component and returns a **new enhanced component** with additional props or behavior. Pattern: `const Enhanced = withFeature(WrappedComponent)`.

HOCs were the primary reuse pattern before Hooks. They solve cross-cutting concerns: authentication, logging, data fetching, error handling.

### Pros & Cons

| Pros                             | Cons                                           |
| -------------------------------- | ---------------------------------------------- |
| Reusable logic across components | "Wrapper hell" — deeply nested component tree  |
| Separation of concerns           | Props collision (must rename injected props)   |
| Works with class components      | Harder to trace in DevTools                    |
|                                  | **Hooks and custom hooks are preferred today** |

### Real-Life Example

#### withAuth HOC

```tsx
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Spinner />;
    if (!user) return <Navigate to="/login" />;

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
function withLoading(WrappedComponent, fetchData) {
  return function WithLoadingComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchData(props).then((result) => {
        setData(result);
        setLoading(false);
      });
    }, [props.id]);

    if (loading) return <Spinner />;
    return <WrappedComponent {...props} data={data} />;
  };
}

const RestaurantPage = withLoading(
  ({ data }) => <RestaurantDetail restaurant={data} />,
  (props) => axios.get(`/api/restaurants/${props.id}`).then((r) => r.data),
);
```

#### Modern alternative — custom hooks (preferred)

```tsx
// ✅ Today — custom hook instead of HOC
function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/me")
      .then((res) => setUser(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading, isAuthenticated: !!user };
}

function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <h1>Welcome, {user.name}</h1>;
}
```

### Interview answer

> An HOC is a function that wraps a component to add behavior or data. Common examples: withAuth, withLoading. Today, custom hooks are preferred because they avoid wrapper hell and props naming collisions. Know HOCs for legacy codebases, but recommend hooks for new code.

---

## 10. What is Hoisting?

### Theory

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope during the compilation phase — before code execution.

| Declaration                            | Hoisted?     | Initialized?                  |
| -------------------------------------- | ------------ | ----------------------------- |
| `var`                                  | ✅ Yes       | As `undefined`                |
| `let`                                  | ✅ Yes (TDZ) | ❌ Not until declaration line |
| `const`                                | ✅ Yes (TDZ) | ❌ Not until declaration line |
| `function` declaration                 | ✅ Yes       | Fully initialized             |
| `function` expression (`var fn = ...`) | `var` only   | `undefined` until assignment  |

**TDZ (Temporal Dead Zone):** Accessing `let`/`const` before their declaration throws `ReferenceError`.

### Pros & Cons

| Pros                                           | Cons                                                   |
| ---------------------------------------------- | ------------------------------------------------------ |
| Function declarations usable before definition | `var` hoisting causes subtle bugs                      |
| Flexible function organization                 | TDZ errors confuse beginners                           |
|                                                | Easy to accidentally reference uninitialized variables |

### Real-Life Example

```javascript
// var hoisting
console.log(city); // undefined (not ReferenceError)
var city = "Bangalore";

// let hoisting + TDZ
// console.log(area); // ReferenceError — TDZ
let area = "Koramangala";

// Function declaration — fully hoisted
greet("Amit"); // works!
function greet(name) {
  console.log(`Hello, ${name}`);
}

// Function expression — only var hoisted
// sayBye("Amit"); // TypeError: sayBye is not a function
var sayBye = function (name) {
  console.log(`Bye, ${name}`);
};

// Classic interview trap
var x = 10;
function foo() {
  console.log(x); // undefined (not 10!)
  var x = 20;
}
foo();
// Equivalent to:
function foo() {
  var x; // hoisted
  console.log(x); // undefined
  x = 20;
}
```

```javascript
// Real-life best practice — avoid hoisting bugs
// ✅ Use const/let (block scoped, TDZ catches errors early)
const API_URL = import.meta.env.VITE_API_URL;
let retryCount = 0;

// ✅ Declare functions before use OR use function declarations intentionally
function formatPrice(amount) {
  return `₹${amount.toFixed(2)}`;
}
```

---

## 11. What is Props Drilling?

### Theory

**Props drilling** is passing data through multiple intermediate components that don't need the data themselves, just to reach a deeply nested child. It makes components tightly coupled and hard to maintain.

```
App (user)
 └── Header (passes user)
      └── Navbar (passes user)
           └── UserMenu (passes user)
                └── Avatar (finally uses user) ← 4 levels deep
```

### Pros & Cons of solutions

| Solution                      | Pros                      | Cons                              |
| ----------------------------- | ------------------------- | --------------------------------- |
| Props drilling                | Explicit, easy to trace   | Unmaintainable at depth           |
| Context API                   | No intermediate passing   | All consumers re-render on change |
| State library (Zustand/Redux) | Scalable, devtools        | Setup overhead                    |
| Component composition         | Clean, no extra libraries | Only works for specific slots     |

### Real-Life Example

#### The problem

```tsx
// ❌ Props drilling — theme passed through 4 levels
function App() {
  const [theme, setTheme] = useState("dark");
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Sidebar theme={theme} setTheme={setTheme} />;
}

function Sidebar({ theme, setTheme }) {
  return <ThemeToggle theme={theme} setTheme={setTheme} />;
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme}
    </button>
  );
}
```

#### Solution 1 — Context API

```tsx
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme}
    </button>
  );
}
```

#### Solution 2 — Component composition

```tsx
function App() {
  const [theme, setTheme] = useState("dark");
  return <Layout sidebar={<ThemeToggle theme={theme} setTheme={setTheme} />} />;
}

function Layout({ sidebar }) {
  return (
    <div>
      <aside>{sidebar}</aside> {/* no drilling — direct slot */}
      <main>...</main>
    </div>
  );
}
```

#### Solution 3 — Zustand (scalable)

```tsx
import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: "dark",
  toggle: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
}));

function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  return <button onClick={toggle}>{theme}</button>;
}
```

### Interview answer

> Props drilling is passing props through components that don't use them. Fix with Context for theme/auth, composition for layout slots, or Zustand/Redux for complex global state. One-to-two levels of prop passing is fine — don't over-engineer.

---

## 12. What is Event Bubbling?

### Theory

When an event fires on a DOM element, it goes through three phases:

1. **Capturing** — travels from `window` down to the target
2. **Target** — reaches the element that triggered the event
3. **Bubbling** — travels from target back up to `window`

By default, event listeners run in the **bubbling phase**. This enables **event delegation** — attaching one listener on a parent instead of many on children.

`event.stopPropagation()` stops the event from bubbling further. `event.stopImmediatePropagation()` also prevents other listeners on the same element.

### Pros & Cons

| Event Bubbling                                | Event Capturing                     |
| --------------------------------------------- | ----------------------------------- |
| ✅ Enables delegation — fewer listeners       | ✅ Intercept before children handle |
| ✅ Natural default behavior                   | ❌ Less intuitive                   |
| ❌ Children can unintentionally block parents | Used with `{ capture: true }`       |

### Real-Life Example

```html
<div id="card">
  <button id="add-to-cart">Add to Cart</button>
  <button id="favorite">♥</button>
</div>
```

```javascript
// Bubbling order when "Add to Cart" is clicked:
// 1. button (target)
// 2. div#card (bubbling)
// 3. body → html → window

document.getElementById("card").addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  if (button.id === "add-to-cart") addToCart();
  if (button.id === "favorite") toggleFavorite();
});
// One listener handles all buttons — works for dynamically added buttons too
```

```jsx
// React — bubbling works the same
function ProductCard({ onAddToCart }) {
  return (
    <div className="card" onClick={() => console.log("card clicked")}>
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent card click from firing
          onAddToCart();
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

// Modal — stop propagation on content to prevent overlay close
function Modal({ onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

---

## 13. What are Microtasks and Macrotasks?

### Theory

The event loop processes two types of async callbacks in strict priority:

**Microtasks** (higher priority — all drained before next macrotask):

- `Promise.then` / `catch` / `finally`
- `queueMicrotask()`
- `MutationObserver`
- `await` (resumes as microtask)

**Macrotasks** (lower priority — one per loop iteration):

- `setTimeout` / `setInterval`
- `setImmediate` (Node.js)
- I/O callbacks
- UI rendering events (click, scroll)
- `requestAnimationFrame` (before paint, separate queue)

### Pros & Cons

| Microtasks                                 | Macrotasks                         |
| ------------------------------------------ | ---------------------------------- |
| ✅ Run immediately after current sync code | ✅ Yield to browser rendering      |
| ✅ Fast promise resolution                 | ✅ Better for deferring heavy work |
| ❌ Can starve macrotasks if infinite chain | ❌ Slower than microtasks          |

### Real-Life Example

```javascript
console.log("1: sync start");

setTimeout(() => console.log("5: macrotask — setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("3: microtask 1"))
  .then(() => console.log("4: microtask 2"));

queueMicrotask(() => console.log("3b: microtask 3"));

console.log("2: sync end");

// Output: 1 → 2 → 3 → 3b → 4 → 5
```

```javascript
// Microtask starvation — avoid in production
function poisonLoop() {
  Promise.resolve().then(poisonLoop); // blocks setTimeout and UI updates forever
}
// poisonLoop(); // never do this
```

```jsx
// Practical React pattern
function CheckoutButton() {
  const handleClick = async () => {
    console.log("1: click handler sync");

    await processPayment(); // yields — microtask resumes after promise resolves
    console.log("3: after await");

    setTimeout(() => console.log("5: redirect"), 1000);
  };

  return <button onClick={handleClick}>Pay Now</button>;
}
// Click output: 1 → (payment API) → 3 → (1 second) → 5
```

### Microtask vs Macrotask — when to use which

| Use microtask (`Promise`, `queueMicrotask`) | Use macrotask (`setTimeout`, `requestAnimationFrame`) |
| ------------------------------------------- | ----------------------------------------------------- |
| Chain async operations                      | Defer work to next frame                              |
| Process promise results                     | Allow browser to paint between chunks                 |
| DOM measurements after state update         | Break up long computations                            |

```javascript
// Break heavy work across macrotasks to keep UI responsive
function processInChunks(items, chunkSize = 100) {
  let index = 0;

  function processChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (; index < end; index++) processItem(items[index]);

    if (index < items.length) {
      setTimeout(processChunk, 0); // macrotask — browser can paint between chunks
    }
  }

  processChunk();
}
```

---

# Preparation Focus Areas — Summary

| Area                   | Key Topics in This Guide                                          |
| ---------------------- | ----------------------------------------------------------------- |
| JavaScript core        | Event Loop, Hoisting, Micro/Macrotasks, map, bind, second largest |
| React Hooks & patterns | useEffect, useCallback, useMemo, HOC, Props Drilling              |
| Routing & API          | React Router v6, Axios interceptors, protected routes             |
| Frontend security      | XSS, token storage, CSP, CSRF, env vars, npm audit                |
| Performance            | Debounce, Throttle, useMemo, chunked processing                   |
| Logic questions        | Second largest element, event loop output prediction              |

---

# Quick Revision Cheat Sheet

| #   | Topic                | One-liner                                                         |
| --- | -------------------- | ----------------------------------------------------------------- |
| 1   | Event Loop           | Sync → all microtasks → one macrotask → repeat                    |
| 2   | Second largest       | One-pass with `largest` + `secondLargest` variables, O(n)         |
| 3   | Debounce vs Throttle | Wait for pause vs once per interval                               |
| 4   | map vs bind          | Transform array vs fix `this` on function                         |
| 5   | Axios                | HTTP client with interceptors, JSON, cancellation                 |
| 6   | React Router         | BrowserRouter → Routes → Route; useParams, protected routes       |
| 7   | Frontend security    | XSS sanitize, httpOnly cookies, no secrets in env, HTTPS          |
| 8   | Hooks                | useEffect = side effects; useMemo = value; useCallback = function |
| 9   | HOC                  | Wrap component for reuse; prefer custom hooks today               |
| 10  | Hoisting             | var/function hoisted; let/const in TDZ until declared             |
| 11  | Props Drilling       | Pass through unused levels; fix with Context/composition          |
| 12  | Event Bubbling       | Target → parents; enables delegation                              |
| 13  | Micro vs Macro       | Promises first, then setTimeout; one macro per loop               |

---

_Tata Elxsi interviews test practical understanding across the full frontend stack. Practice explaining each concept with a real project example — that's what separates a prepared candidate from someone who only read definitions._
