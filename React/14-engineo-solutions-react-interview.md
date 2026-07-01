---
title: "Engineo Solutions React Interview Preparation"
description: "Senior React Developer interview — authentication, Context API, Redux, React hooks, and JavaScript fundamentals."
tags: ["react", "engineo", "senior", "interview", "redux", "authentication"]
level: "Senior (4+ years)"
company: "Engineo Solutions Pvt. Ltd."
---

# Engineo Solutions React Interview Preparation

Questions from a **Senior React Developer** interview at Engineo Solutions Pvt. Ltd. — covering **behavioral**, **authentication**, **React hooks**, **Redux**, and **JavaScript fundamentals**. Each topic includes **Theory**, **Pros & Cons**, **One-Line Interview Answer**, and **Real Examples**.

---

<a id="quick-index"></a>

## Quick index


### 1st Round

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Tell me about your key skills](#p1) |
| <span id="i2"></span>2 | [Why did you choose React?](#p2) |
| <span id="i3"></span>3 | [Your role in the last project](#p3) |
| <span id="i4"></span>4 | [Authentication in React](#p4) |
| <span id="i5"></span>5 | [Session Storage vs Local Storage](#p5) |
| <span id="i6"></span>6 | [How do you use Context API?](#p6) |

### 2nd Round

| # | Section |
| --- | --- |
| <span id="i7"></span>7 | [Authenticate React application (deep dive)](#p7) |
| <span id="i8"></span>8 | [New features in latest React versions](#p8) |
| <span id="i9"></span>9 | [How does addEventListener work?](#p9) |
| <span id="i10"></span>10 | [useLayoutEffect](#p10) |
| <span id="i11"></span>11 | [Debouncing and Throttling](#p11) |
| <span id="i12"></span>12 | [JavaScript Event Loop](#p12) |
| <span id="i13"></span>13 | [useState hook](#p13) |
| <span id="i14"></span>14 | [useEffect hook](#p14) |
| <span id="i15"></span>15 | [What is Redux?](#p15) |
| <span id="i16"></span>16 | [Optimize Redux performance](#p16) |
| <span id="i17"></span>17 | [Lazy Loading](#p17) |

---
# 1st Round

<a id="p1"></a>

## 1. Tell me about your key skills

### Theory

This is an **opening behavioral question**. For a Senior React role at Engineo, structure your answer around **technical depth**, **leadership**, and **business impact** — not a laundry list of buzzwords.

Use the **T-shaped model**: deep in React/JS frontend, broad in related areas (APIs, testing, CI/CD).

### What to include

| Category | Examples to mention |
|----------|---------------------|
| Core | React, TypeScript, JavaScript (ES6+) |
| State | Redux Toolkit, TanStack Query, Context |
| Styling | CSS Modules, Tailwind, responsive design |
| Testing | Jest, React Testing Library, Playwright |
| Tools | Git, Webpack/Vite, CI/CD |
| Soft | Code review, mentoring, agile, cross-team collaboration |

### One-Line Interview Answer

> I'm a senior frontend developer specializing in React and TypeScript, with strong JavaScript fundamentals, experience in state management, authentication, performance optimization, and leading features end-to-end from design to production.

### Real Example — Sample answer (60 seconds)

> My core stack is **React, TypeScript, and JavaScript**. On the state side, I use **Redux Toolkit** for complex client state and **TanStack Query** for server data. I've built **authentication flows** with JWT and OAuth, optimized apps with **code splitting and memoization**, and write tests with **Jest and RTL**.
>
> In my last role, I led the checkout module for 50K daily users, mentored two junior developers, and established our component library. I'm also comfortable with **REST APIs**, **Git workflows**, and **CI/CD** pipelines.

**Tip:** Tailor to the job description. Mention skills Engineo likely needs (enterprise apps, Redux, auth).

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Why did you choose React?

### Theory

Interviewers want **genuine reasoning** — not "because it's popular." Connect React's strengths to **real problems you've solved**.

### Pros & Cons (why React vs alternatives)

| React | Angular | Vue |
|-------|---------|-----|
| ✅ Flexible — library not framework | ✅ Full framework, opinionated | ✅ Gentle learning curve |
| ✅ Huge ecosystem and hiring pool | ❌ Steeper learning curve | ❌ Smaller enterprise adoption in India |
| ✅ Component reusability | | |
| ✅ Virtual DOM performance | | |
| ❌ Needs choices (router, state) | | |

### One-Line Interview Answer

> I chose React because of its component model, one-way data flow, and ecosystem. It lets me build reusable UIs at scale, hire and collaborate easily, and the declarative model makes complex state manageable with hooks.

### Real Example — Strong answer

> I picked React over Angular because I prefer its **flexibility** — I choose my router, state library, and tooling based on project needs rather than a fixed framework. The **component model** maps naturally to UI design, and **hooks** made state logic reusable without class boilerplate.
>
> Practically, React's ecosystem — React Query, Redux Toolkit, Next.js — solved real problems in my projects: caching API data, managing auth state, and SSR for SEO. The job market and community support also mean faster problem-solving and easier team scaling.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What was your role in your last project?

### Theory

Use **STAR method** — Situation, Task, Action, Result. For senior roles, emphasize **ownership**, **decisions**, **collaboration**, and **measurable impact**.

### One-Line Interview Answer

> I was the senior frontend developer owning the [module name] — from architecture and implementation to code review, mentoring, and production support.

### Real Example — Sample answer

> **Situation:** Enterprise SaaS platform serving 10,000+ business users with a legacy jQuery frontend being migrated to React.
>
> **Task:** I was the senior frontend developer responsible for the **dashboard and reporting module** — the highest-traffic area after login.
>
> **Action:**
> - Designed feature-based folder structure and shared component library
> - Implemented auth with httpOnly cookies and protected routes
> - Introduced Redux Toolkit for global state and TanStack Query for API caching
> - Led code reviews, wrote ADRs for key decisions, mentored 2 junior devs
> - Reduced dashboard load time from 4.2s to 1.1s with code splitting and virtualization
>
> **Result:** Module shipped on time, zero P0 bugs in first month, dashboard LCP improved 74%, junior devs promoted within a year.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. How do you implement authentication in React?

### Theory

React authentication involves: **login flow**, **token/session storage**, **protected routes**, **token refresh**, and **logout**. Security-critical logic must be enforced on the **backend** — frontend guards are for UX only.

Common approaches:
- **JWT** in httpOnly cookies (recommended)
- **OAuth 2.0 / OIDC** (Google, GitHub SSO)
- **Session-based** auth with cookie

### Pros & Cons

| httpOnly cookies | localStorage JWT |
|------------------|------------------|
| ✅ XSS-safe — JS can't read token | ❌ Any XSS script steals token |
| ✅ Auto-sent with requests | ✅ Simple to implement |
| ❌ CSRF risk (use SameSite) | ❌ Not recommended for production |

### One-Line Interview Answer

> I implement auth with a login API that sets httpOnly cookies, wrap the app in an AuthProvider using Context, protect routes with a guard component, and refresh tokens silently before expiry. Backend always validates — frontend guards are UX only.

### Real Example

```tsx
// auth/AuthContext.tsx
type User = { id: string; name: string; role: string };

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const userData = await res.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
```

```tsx
// Protected route
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// App routing
<Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
```

```tsx
// Axios interceptor — attach credentials + handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      const refreshed = await fetch("/api/auth/refresh", { credentials: "include" });
      if (refreshed.ok) return api.request(error.config);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Session Storage vs Local Storage

### Theory

Both are **Web Storage APIs** storing key-value pairs in the browser. Neither is sent with HTTP requests (unlike cookies).

| | localStorage | sessionStorage |
|--|--------------|----------------|
| **Lifetime** | Until explicitly cleared | Until **tab/window closes** |
| **Scope** | Same origin, all tabs | Same origin, **single tab** |
| **Capacity** | ~5–10 MB | ~5–10 MB |
| **Shared across tabs** | Yes | No |
| **Survives refresh** | Yes | Yes (same tab) |
| **Use for** | Preferences, drafts | Form data, single-session state |

### Pros & Cons

| localStorage | sessionStorage |
|--------------|----------------|
| ✅ Persists across sessions | ✅ Auto-clears on tab close — safer for sensitive temp data |
| ❌ Stays until cleared — stale data risk | ❌ Lost when tab closes |
| ❌ XSS can read it | ❌ XSS can read it |

**Never store auth tokens in either** — use httpOnly cookies.

### One-Line Interview Answer

> localStorage persists until cleared and is shared across tabs. sessionStorage lasts only for the tab session. I use localStorage for user preferences and sessionStorage for temporary form data — never for auth tokens.

### Real Example

```javascript
// localStorage — user preferences (persist forever)
localStorage.setItem("theme", "dark");
localStorage.setItem("language", "en");
localStorage.setItem("recentSearches", JSON.stringify(["react", "redux"]));

// sessionStorage — multi-step form (cleared when tab closes)
sessionStorage.setItem("checkoutStep", "2");
sessionStorage.setItem("draftOrder", JSON.stringify(cartItems));

// Tab behavior demo
// Tab A: localStorage.setItem("x", "1") → Tab B can read "1"
// Tab A: sessionStorage.setItem("y", "2") → Tab B CANNOT read "y"
```

```tsx
// Custom hook
function useSessionStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. How do you use Context API?

### Theory

**Context API** shares data across the component tree without prop drilling. Pattern: `createContext` → `Provider` wraps tree → consumers use `useContext`.

Best for: **theme**, **locale**, **auth session** — data that many components need but changes infrequently.

Avoid for: fast-changing or fine-grained state (causes mass re-renders).

### Pros & Cons

| Pros | Cons |
|------|------|
| No prop drilling | All consumers re-render on value change |
| Built into React | Provider hell if overused |
| Simple for theme/auth | Not a full state manager |

### One-Line Interview Answer

> I create a context with createContext, wrap relevant parts of the tree in a Provider with a memoized value, and consume with useContext. I split contexts by concern — auth, theme — to limit re-renders.

### Real Example

```tsx
// Split contexts — Engineo senior pattern
const ThemeContext = createContext<"light" | "dark">("light");
const AuthContext = createContext<AuthState | null>(null);

function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const auth = useAuthState(); // custom hook with login/logout

  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <AuthContext.Provider value={auth}>
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

// Consumer — only re-renders when its context changes
function Header() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  return <header className={`header-${theme}`}>Hello, {user?.name}</header>;
}
```

```tsx
// When NOT to use Context — use TanStack Query instead
// ❌ Context for API data
const DataContext = createContext(fetchedUsers);

// ✅ TanStack Query
const { data: users } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
```

---

# 2nd Round


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. How do you authenticate your React application?

### Theory

Round 2 revisits auth with **more depth**. Cover the full flow: login → token storage → protected routes → refresh → logout → role-based access.

### Complete auth flow diagram

```
User submits login
       ↓
POST /api/auth/login
       ↓
Server validates → sets httpOnly cookie (access + refresh)
       ↓
Frontend stores user object in Context (NOT the token)
       ↓
ProtectedRoute checks user → render or redirect
       ↓
API calls include credentials: "include"
       ↓
401 → try /api/auth/refresh → retry or logout
       ↓
Logout → POST /api/auth/logout → clear cookie → clear Context
```

### One-Line Interview Answer

> Auth flow: login API sets httpOnly cookies, Context holds user profile for UI, ProtectedRoute guards routes, axios interceptor handles 401 with silent refresh, RBAC checks roles for admin features. Server validates every request.

### Real Example — Role-based access

```tsx
function RequireRole({ role, children }: { role: string; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user?.roles.includes(role)) return <Navigate to="/unauthorized" />;
  return children;
}

<Route path="/admin" element={
  <ProtectedRoute>
    <RequireRole role="admin"><AdminPanel /></RequireRole>
  </ProtectedRoute>
} />
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. New features in latest React versions

### Theory

Stay current with React 18 and React 19 features — Engineo asks this to verify you follow the ecosystem.

### React 18 (2022)

| Feature | What it does |
|---------|--------------|
| **Concurrent rendering** | Interruptible rendering, keeps UI responsive |
| **Automatic batching** | Batch state updates in timeouts, promises, native events |
| **Transitions** | `useTransition`, `useDeferredValue` — mark updates low priority |
| **Suspense improvements** | SSR streaming with `renderToPipeableStream` |
| **Strict Mode changes** | Double-invoke effects in dev |
| **`createRoot`** | Replaces `ReactDOM.render` |

### React 19 (2024–2025)

| Feature | What it does |
|---------|--------------|
| **Actions** | `useActionState`, form actions with async |
| **useOptimistic** | Optimistic UI updates built-in |
| **`use()` hook** | Read promises and context in render |
| **Ref as prop** | No more `forwardRef` needed |
| **Document metadata** | `<title>`, `<meta>` in components |
| **Server Components** | Stable in frameworks (Next.js) |
| **Improved hydration** | Better mismatch error messages |

### One-Line Interview Answer

> React 18 brought concurrent rendering, automatic batching, and useTransition. React 19 adds Actions, useOptimistic, the use hook, and drops forwardRef. I use transitions for search filters and Suspense for code splitting.

### Real Example

```tsx
// React 18 — useTransition for non-urgent updates
function SearchPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);

  const handleChange = (value: string) => {
    setQuery(value); // urgent — input stays responsive
    startTransition(() => {
      setResults(filterProducts(value)); // non-urgent — can be interrupted
    });
  };

  return (
    <>
      <input value={query} onChange={(e) => handleChange(e.target.value)} />
      {isPending && <Spinner />}
      <ProductList products={results} />
    </>
  );
}

// React 19 — useOptimistic
function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(todos, (state, newTodo) => [
    ...state,
    { ...newTodo, pending: true },
  ]);

  async function handleAdd(text) {
    addOptimistic({ id: crypto.randomUUID(), text });
    await addTodo(text);
  }
}
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. How does addEventListener work?

### Theory

`element.addEventListener(type, handler, options)` registers a function to run when an event fires on that element.

**Options:**
- `capture: true` — run in capturing phase (top → target)
- `once: true` — remove after first fire
- `passive: true` — won't call preventDefault (scroll performance)

Events flow: **capturing → target → bubbling**. Default listeners use bubbling.

Remove with `removeEventListener(type, handler)` — must pass the **same function reference**.

### Pros & Cons

| addEventListener | inline onclick |
|------------------|----------------|
| ✅ Multiple handlers per event | ❌ One handler only |
| ✅ Capture/bubble control | ❌ No capture option |
| ✅ Remove with removeEventListener | ❌ Harder to clean up |

### One-Line Interview Answer

> addEventListener registers an event handler on a DOM element. It supports capture and bubble phases, can be removed with removeEventListener, and I always clean up in useEffect return for React.

### Real Example

```javascript
const button = document.getElementById("submit");

// Basic
button.addEventListener("click", handleSubmit);

// With options
button.addEventListener("click", handleSubmit, { once: true });
document.addEventListener("keydown", handleEsc, { capture: true });

// Remove — same reference required
button.removeEventListener("click", handleSubmit);
```

```tsx
// React — useEffect cleanup pattern
function Modal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);
}
```

```javascript
// Event delegation with addEventListener
document.getElementById("menu").addEventListener("click", (e) => {
  const item = e.target.closest("[data-action]");
  if (item) handleAction(item.dataset.action);
});
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. useLayoutEffect Hook

### Theory

`useLayoutEffect` runs **synchronously after DOM mutations but before the browser paints**. Same signature as `useEffect` but fires earlier.

**Use when:** you need to measure DOM or mutate layout before user sees the screen — prevents visual flicker.

**Use `useEffect` for:** everything else — data fetching, subscriptions (doesn't block paint).

### Comparison

| | useEffect | useLayoutEffect |
|--|-----------|-----------------|
| Runs | After paint | Before paint |
| Blocks paint? | No | Yes |
| Use for | API calls, subscriptions | DOM measurements, sync layout |
| SSR warning? | No | Yes — server has no layout |

### One-Line Interview Answer

> useLayoutEffect runs before the browser paints — I use it when I need to measure DOM or fix layout to prevent flicker. For data fetching and subscriptions, I use useEffect.

### Real Example

```tsx
// ❌ useEffect — tooltip flickers at (0,0) then jumps
function Tooltip({ targetRef }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPos({ x: rect.left, y: rect.bottom });
  }, [targetRef]);
  return <div style={{ left: pos.x, top: pos.y }}>Tip</div>;
}

// ✅ useLayoutEffect — position calculated before paint
function Tooltip({ targetRef }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useLayoutEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPos({ x: rect.left, y: rect.bottom });
  }, [targetRef]);
  return <div style={{ left: pos.x, top: pos.y }}>Tip</div>;
}
```

```tsx
// Other valid uses: focus on mount, scroll to element, animate from measured size
useLayoutEffect(() => {
  inputRef.current?.focus();
}, []);
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Debouncing and Throttling

### Theory

| | Debounce | Throttle |
|--|----------|----------|
| **Behavior** | Wait for pause, run once | Run at most once per interval |
| **Use for** | Search, auto-save, resize-end | Scroll, mousemove, button spam |

### One-Line Interview Answer

> Debounce waits until the user stops typing then fires once — perfect for search. Throttle fires at most once per interval — perfect for scroll handlers.

### Real Example

```javascript
function debounce(fn, delay) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
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

// React search
const debouncedSearch = useMemo(
  () => debounce((q) => fetchResults(q), 300),
  []
);
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. JavaScript Event Loop

### Theory

JS is single-threaded. The event loop coordinates: **call stack** → **microtasks** (Promises) → **macrotasks** (setTimeout).

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


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. useState Hook

### Theory

`useState` adds local state to function components. Returns `[value, setter]`. Updates are async and batched. Use functional updater when new state depends on old: `setCount(c => c + 1)`.

### One-Line Interview Answer

> useState gives a component local state and a setter. When state changes, React re-renders. I use functional updates when the new value depends on the previous one.

### Real Example

```tsx
function OrderForm() {
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (product: Product) => {
    setItems((prev) => [...prev, { ...product, quantity }]);
  };

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={() => addItem(selectedProduct)}>Add</button>
    </div>
  );
}
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. useEffect Hook

### Theory

`useEffect` handles side effects after render — API calls, subscriptions, timers. Returns cleanup function for unmount/re-run. Dependency array controls when it re-runs.

### One-Line Interview Answer

> useEffect runs side effects after render. I pass a dependency array to control re-runs and return a cleanup function to prevent memory leaks.

### Real Example

```tsx
function UserDashboard({ userId }: { userId: string }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}/dashboard`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [userId]);

  return data ? <Dashboard data={data} /> : <Spinner />;
}
```

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. What is Redux?

### Theory

**Redux** is a predictable state container. Single store, updated only through **actions** processed by **reducers** (pure functions). Flow: `dispatch(action) → reducer → new state → UI re-renders`.

**Redux Toolkit (RTK)** is the modern standard — slices, Immer, createAsyncThunk.

Use for **complex client-side global state**. Use TanStack Query for **server state**.

### One-Line Interview Answer

> Redux centralizes app state in one store with predictable updates through actions and reducers. I use Redux Toolkit for slices and async thunks, and TanStack Query for API data.

### Real Example

```tsx
// store/authSlice.ts
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

// Usage
function Profile() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
}
```

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Optimize Redux application performance

### Theory

Redux performance issues come from: **unnecessary re-renders**, **large state trees**, **unmemoized selectors**, and **storing server data in Redux**.

### Optimization strategies

| Strategy | How |
|----------|-----|
| **Reselect / createSelector** | Memoized derived data |
| **Slice selectors** | Select only needed slice |
| **Normalized state** | Flat entities by ID — avoid nested updates |
| **RTK Query for API** | Don't duplicate server state in Redux |
| **React.memo on list items** | Prevent child re-renders |
| **Avoid storing UI state globally** | Keep modal open state local |
| **useAppSelector with equality** | `shallowEqual` for object selections |
| **Code split reducers** | `injectReducer` for lazy routes |

### Pros & Cons

| Optimized Redux | Unoptimized Redux |
|-----------------|-------------------|
| ✅ Minimal re-renders | ❌ Entire tree re-renders on any change |
| ✅ DevTools still useful | ❌ Slow lists, janky UI |
| More setup upfront | Simple but doesn't scale |

### One-Line Interview Answer

> I use createSelector for memoized selectors, normalize state by entity ID, keep server data in TanStack Query not Redux, split contexts from Redux, and wrap list items in React.memo.

### Real Example

```tsx
// ❌ Bad — new object every render, all subscribers re-render
const user = useAppSelector((state) => ({
  name: state.auth.user.name,
  role: state.auth.user.role,
}));

// ✅ createSelector — memoized
const selectUserProfile = createSelector(
  (state: RootState) => state.auth.user,
  (user) => user ? { name: user.name, role: user.role } : null
);
const profile = useAppSelector(selectUserProfile);

// Normalized state
// ❌ { orders: [{ id, items: [...] }, ...] }
// ✅ { orders: { byId: { "1": {...} }, allIds: ["1", "2"] } }

// RTK Query — server state NOT in Redux slice
const { data: orders } = useGetOrdersQuery(userId);
// Redux only holds: auth, UI preferences, cart
```

```tsx
// injectReducer — code split Redux per route
import { injectReducer } from "./store";
injectReducer("reports", reportsReducer);
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Lazy Loading

### Theory

**Lazy loading** defers loading resources until needed. In React: `React.lazy()` + `<Suspense>` for components. For images: `loading="lazy"`.

Reduces initial bundle size — users download only what they visit.

### One-Line Interview Answer

> Lazy loading defers code until needed — React.lazy for route components with Suspense fallback, and loading="lazy" for images below the fold.

### Real Example

```tsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Reports = lazy(() => import("./pages/Reports"));
const Admin = lazy(() => import("./pages/Admin"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}

// Prefetch on hover
<Link to="/reports" onMouseEnter={() => import("./pages/Reports")}>
  Reports
</Link>

// Image lazy load
<img src="/chart.png" alt="Analytics" loading="lazy" width={800} height={400} />
```

---

# Quick Revision Cheat Sheet

| # | Topic | One-liner |
|---|-------|-----------|
| 1 | Key skills | React, TS, Redux, auth, testing, mentoring |
| 2 | Why React | Components, ecosystem, hooks, job market |
| 3 | Last project role | STAR — ownership, impact, metrics |
| 4 | Auth in React | httpOnly cookies, AuthProvider, protected routes |
| 5 | session vs local | Tab-scoped vs persistent; never for tokens |
| 6 | Context API | Split by concern, memoize value |
| 7 | Auth deep dive | Login → cookie → refresh → RBAC |
| 8 | React 19 features | Actions, useOptimistic, use hook, no forwardRef |
| 9 | addEventListener | Register, capture/bubble, cleanup in useEffect |
| 10 | useLayoutEffect | Before paint — DOM measure, no flicker |
| 11 | Debounce/throttle | Pause vs rate-limit |
| 12 | Event loop | Sync → micro → macro |
| 13 | useState | Local state + setter, functional updates |
| 14 | useEffect | Side effects + cleanup + deps |
| 15 | Redux | dispatch → reducer → store |
| 16 | Redux perf | createSelector, normalize, RTK Query |
| 17 | Lazy loading | React.lazy + Suspense |

---

*Engineo tests senior breadth — auth, Redux, hooks, and JS fundamentals in one interview. Prepare short confident answers with one example each.*


<p><a href="#i17">Back to index</a></p>
