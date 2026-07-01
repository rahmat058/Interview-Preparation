---
title: "Mphasis Frontend Developer Interview Preparation"
description: "JavaScript fundamentals, React performance, Redux, snapshot testing, and scenario-based API architecture — theory, pros/cons, and real-life examples."
tags: ["react", "javascript", "redux", "mphasis", "interview", "frontend"]
level: "2–5 years"
company: "Mphasis"
---

# Mphasis Frontend Developer Interview Preparation

Questions from a recent Mphasis Frontend Developer interview — covering **JavaScript fundamentals**, **React performance**, **Redux**, **testing**, and **real-world architecture scenarios**. Each topic includes **Theory**, **Pros & Cons**, and a **Real-Life Example**.

---

<a id="quick-index"></a>

## Quick index


### Technical Interview

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is Hoisting?](#p1) |
| <span id="i2"></span>2 | [What is the Event Loop?](#p2) |
| <span id="i3"></span>3 | [Normal Functions vs Arrow Functions](#p3) |
| <span id="i4"></span>4 | [What is a Promise?](#p4) |
| <span id="i5"></span>5 | [Promise.all() vs Promise.allSettled()](#p5) |
| <span id="i6"></span>6 | [What is the Virtual DOM?](#p6) |
| <span id="i7"></span>7 | [React application performance](#p7) |
| <span id="i8"></span>8 | [Redux Workflow](#p8) |
| <span id="i9"></span>9 | [Advantages of Redux](#p9) |
| <span id="i10"></span>10 | [Snapshot Testing](#p10) |
| <span id="i11"></span>11 | [First non-repeated character (coding)](#p11) |
| <span id="i12"></span>12 | [Error Boundary](#p12) |
| <span id="i13"></span>13 | [Scenario: 3 API calls with partial errors](#p13) |

---

<a id="p1"></a>

## 1. What is Hoisting?

### Theory

**Hoisting** is JavaScript's behavior during the **creation phase** of an execution context, where the engine registers variable and function **declarations** in memory before running any code line by line.

Only declarations are hoisted — **not initializations**. The variable exists but may not have a value yet.

| Declaration             | Hoisted as                                 |
| ----------------------- | ------------------------------------------ |
| `var x`                 | `undefined`                                |
| `let` / `const`         | Uninitialized (TDZ until declaration line) |
| `function foo(){}`      | Full function body                         |
| `var fn = function(){}` | `var fn` → `undefined`                     |

### Pros & Cons

| Pros                                           | Cons                                            |
| ---------------------------------------------- | ----------------------------------------------- |
| Function declarations usable before definition | `var` hoisting causes silent `undefined` bugs   |
| Flexible code organization                     | Misleading "moved to top" mental model          |
|                                                | TDZ errors with `let`/`const` confuse beginners |

### Real-Life Example

```javascript
// var — hoisted as undefined
console.log(apiVersion); // undefined
var apiVersion = "v2";

// Function declaration — fully hoisted
loadDashboard();
function loadDashboard() {
  console.log("Dashboard loaded");
}

// let — Temporal Dead Zone
// console.log(userId); // ReferenceError
let userId = "u_42";

// Classic trap
function getTotal() {
  console.log(total); // undefined (not 100)
  var total = 100;
  return total;
}
```

**Interview tip:** Mention TDZ for `let`/`const` — Mphasis often follows hoisting with TDZ questions.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What is the Event Loop?

### Theory

JavaScript is **single-threaded** — one call stack. The **event loop** coordinates execution between:

- **Call stack** — currently running synchronous code
- **Web APIs** — `setTimeout`, `fetch`, DOM events (run outside main thread)
- **Microtask queue** — Promises, `queueMicrotask`, `MutationObserver`
- **Macrotask queue** — `setTimeout`, I/O callbacks, UI events

**Order:** Run all sync code → drain **all microtasks** → run **one macrotask** → repeat.

### Pros & Cons

| Pros                                 | Cons                           |
| ------------------------------------ | ------------------------------ |
| Simple concurrency — no thread locks | Long sync code blocks UI       |
| Non-blocking I/O                     | Microtask starvation if abused |
| Predictable once understood          | Hard to debug async ordering   |

### Real-Life Example

```javascript
console.log("1: Render UI");

fetch("/api/user").then(() => console.log("3: User data applied")); // microtask

setTimeout(() => console.log("4: Analytics sent"), 0); // macrotask

console.log("2: Continue sync work");

// Output: 1 → 2 → 3 → 4
```

```jsx
// React impact — API results apply as microtasks after paint
function ProfilePage() {
  useEffect(() => {
    fetchUser().then(setUser); // resolves → microtask → re-render
  }, []);
  return <Skeleton />; // paints first, then updates when promise resolves
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Difference between Normal Functions and Arrow Functions

### Theory

Both define functions, but differ in syntax, `this` binding, and capabilities.

| Feature              | Normal function                     | Arrow function                               |
| -------------------- | ----------------------------------- | -------------------------------------------- |
| Syntax               | `function fn() {}`                  | `const fn = () => {}`                        |
| `this`               | Dynamic — depends on **how called** | Lexical — inherited from **enclosing scope** |
| `arguments`          | Available                           | Not available — use `...args`                |
| `new` keyword        | Can be constructor                  | Cannot                                       |
| `prototype`          | Has `.prototype`                    | No                                           |
| Implicit return      | No (unless IIFE)                    | Yes for single expressions                   |
| `yield` (generators) | Yes                                 | No                                           |

### Pros & Cons

| Normal functions                     | Arrow functions                    |
| ------------------------------------ | ---------------------------------- |
| ✅ Correct `this` for object methods | ✅ Concise syntax                  |
| ✅ Can be constructors               | ✅ Fixes `this` in callbacks       |
| ✅ Has `arguments`                   | ✅ Great for array methods         |
| ❌ `this` lost in callbacks          | ❌ Wrong `this` for object methods |
|                                      | ❌ Not usable as constructors      |

### Real-Life Example

```javascript
const orderService = {
  orders: ["ORD-1", "ORD-2"],

  // ✅ Normal — `this` is orderService
  listOrders() {
    return this.orders;
  },

  // ❌ Arrow — `this` is NOT orderService
  brokenList: () => this?.orders, // undefined

  // ✅ Arrow inside normal — inherits `this` from listWithIds
  listWithIds() {
    return this.orders.map((id) => `ID: ${id}`);
  },
};

// Callback pattern
button.addEventListener("click", function () {
  this.classList.add("active"); // `this` = button element
});

button.addEventListener("click", () => {
  // `this` = enclosing scope (e.g., component instance or undefined)
});
```

```tsx
// React — arrow functions are standard in function components
function OrderList({ orders }) {
  const handleCancel = (id: string) => cancelOrder(id); // arrow — no `this` needed

  return orders.map((order) => (
    <OrderCard
      key={order.id}
      order={order}
      onCancel={() => handleCancel(order.id)}
    />
  ));
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is a Promise?

### Theory

A **Promise** is an object representing the eventual result of an asynchronous operation. It has three states:

- **Pending** — initial state, operation in progress
- **Fulfilled** — operation completed successfully
- **Rejected** — operation failed

Once settled (fulfilled or rejected), a promise **cannot change state**. Promises chain with `.then()`, `.catch()`, `.finally()`.

### Pros & Cons

| Promises                                    | Callbacks                    |
| ------------------------------------------- | ---------------------------- |
| ✅ Avoid callback hell                      | ✅ Simple for one-off async  |
| ✅ Composable — `all`, `race`, `allSettled` | ❌ Error handling is painful |
| ✅ Clear success/error paths                | ❌ Pyramid of doom           |
| ❌ Still need discipline for errors         |                              |

### Real-Life Example

```javascript
// Creating a promise
function fetchEmployee(id) {
  return new Promise((resolve, reject) => {
    fetch(`/api/employees/${id}`)
      .then((res) => {
        if (!res.ok) reject(new Error(`HTTP ${res.status}`));
        else resolve(res.json());
      })
      .catch(reject);
  });
}

// Consuming
fetchEmployee("E101")
  .then((employee) => renderProfile(employee))
  .catch((err) => showErrorToast(err.message))
  .finally(() => hideSpinner());

// async/await — syntactic sugar over promises
async function loadProfile(id) {
  try {
    const employee = await fetchEmployee(id);
    renderProfile(employee);
  } catch (err) {
    showErrorToast(err.message);
  } finally {
    hideSpinner();
  }
}
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Difference between Promise.all() and Promise.allSettled()

### Theory

Both run multiple promises in parallel, but handle failures differently:

|                   | `Promise.all()`               | `Promise.allSettled()`                   |
| ----------------- | ----------------------------- | ---------------------------------------- |
| **Resolves when** | All promises fulfill          | All promises settle (fulfill OR reject)  |
| **Rejects when**  | **Any** promise rejects       | Never rejects (always resolves)          |
| **Result**        | Array of values               | Array of `{ status, value/reason }`      |
| **Use when**      | All results required together | Need every outcome regardless of failure |

### Pros & Cons

| Promise.all                                   | Promise.allSettled                                    |
| --------------------------------------------- | ----------------------------------------------------- |
| ✅ Fail-fast — don't wait for doomed requests | ✅ Partial success — one failure doesn't block others |
| ✅ Simple array of results                    | ✅ Perfect for independent UI sections                |
| ❌ One failure kills entire operation         | ❌ Must check each `status` manually                  |
| ❌ No partial results on error                | ❌ Waits for all even after failures                  |

### Real-Life Example

```javascript
// Promise.all — ALL must succeed (checkout needs user + cart + payment)
async function loadCheckout(userId) {
  try {
    const [user, cart, paymentMethods] = await Promise.all([
      fetchUser(userId),
      fetchCart(userId),
      fetchPaymentMethods(userId),
    ]);
    return { user, cart, paymentMethods };
  } catch (err) {
    // One API failed — entire checkout unavailable
    showFullPageError("Unable to load checkout");
  }
}

// Promise.allSettled — independent sections (Mphasis scenario!)
async function loadDashboard(userId) {
  const results = await Promise.allSettled([
    fetchAnnouncements(),
    fetchTeamMembers(userId),
    fetchRecentProjects(userId),
  ]);

  return {
    announcements: results[0].status === "fulfilled" ? results[0].value : null,
    team: results[1].status === "fulfilled" ? results[1].value : null,
    projects: results[2].status === "fulfilled" ? results[2].value : null,
    errors: results
      .map((r, i) =>
        r.status === "rejected" ? { section: i, reason: r.reason } : null,
      )
      .filter(Boolean),
  };
}
```

```javascript
// Output shape of allSettled
[
  { status: "fulfilled", value: { title: "Holiday notice" } },
  { status: "rejected", reason: Error("503 Service Unavailable") },
  { status: "fulfilled", value: [{ id: 1, name: "Project Alpha" }] },
];
```

**Key interview point:** Mphasis scenario question maps directly to `Promise.allSettled()` + per-section error boundaries.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. What is the Virtual DOM?

### Theory

The **Virtual DOM (VDOM)** is a lightweight JavaScript object tree that mirrors the real DOM structure. React keeps a VDOM representation in memory and, on each state change:

1. Creates a **new** VDOM tree
2. **Diffs** it against the previous tree (reconciliation)
3. Applies only the **minimum DOM mutations** needed

This is faster than rewriting the entire DOM because DOM operations are expensive; JS object comparison is cheap.

### Pros & Cons

| Pros                                               | Cons                                      |
| -------------------------------------------------- | ----------------------------------------- |
| Declarative UI — describe state, React patches DOM | CPU overhead for diffing large trees      |
| Batched updates — fewer DOM operations             | Not always faster than hand-optimized DOM |
| Cross-browser consistency                          | Abstraction can hide performance issues   |
| Enables React Native (same model, native renderer) | Learning curve for reconciliation rules   |

### Real-Life Example

```jsx
// You write declarative UI
function OrderStatus({ order }) {
  return (
    <div className="status">
      <h2>Order #{order.id}</h2>
      <p className={order.status}>{order.statusLabel}</p>
    </div>
  );
}

// When order.status changes "pending" → "delivered":
// VDOM diff sees: same <div>, same <h2>, <p> className changed
// Real DOM: only updates className on <p> — nothing else touched
```

**Diffing rules (mention in interview):**

- Different element **type** → destroy old subtree, build new
- Same type → update props, recurse children
- **Keys** help match list items efficiently across re-renders

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. How do you ensure the performance of a React application?

### Theory

React performance optimization spans **rendering**, **bundling**, **network**, and **measurement**. Optimize based on data — profile first, then fix the biggest bottleneck.

### Key strategies

| Category        | Techniques                                             |
| --------------- | ------------------------------------------------------ |
| **Rendering**   | `React.memo`, `useMemo`, `useCallback`, virtualization |
| **Bundling**    | Code splitting, `React.lazy`, tree shaking             |
| **Network**     | TanStack Query caching, prefetch, CDN, compression     |
| **Images**      | WebP/AVIF, lazy load, responsive `srcset`              |
| **State**       | Colocate state, avoid unnecessary context re-renders   |
| **Measurement** | React Profiler, Lighthouse, Web Vitals RUM             |

### Pros & Cons

| Profile-driven optimization | Premature optimization           |
| --------------------------- | -------------------------------- |
| ✅ Fixes real bottlenecks   | ❌ Wasted dev time               |
| ✅ Measurable improvements  | ❌ Added complexity everywhere   |
| ✅ Better user experience   | ❌ `useMemo` on cheap operations |

### Real-Life Example

```tsx
// 1. Code splitting — route level
const Analytics = lazy(() => import("./pages/Analytics"));

// 2. Virtualization — 10,000 row table
import { useVirtualizer } from "@tanstack/react-virtual";

// 3. Memoization — after profiling shows slow child re-renders
const DataRow = React.memo(function DataRow({ row, onEdit }) {
  return (
    <tr>
      <td>{row.name}</td>
      <td>
        <button onClick={() => onEdit(row.id)}>Edit</button>
      </td>
    </tr>
  );
});

// 4. Server state caching
const { data } = useQuery({
  queryKey: ["employees", deptId],
  queryFn: () => fetchEmployees(deptId),
  staleTime: 5 * 60 * 1000,
});

// 5. Defer non-urgent updates
const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);

// 6. Measure
import { Profiler } from "react";
<Profiler
  id="EmployeeList"
  onRender={(id, phase, duration) => {
    if (duration > 16) console.warn(`Slow: ${id} ${duration}ms`);
  }}
>
  <EmployeeList />
</Profiler>;
```

**Performance budget example:**

| Metric            | Target           |
| ----------------- | ---------------- |
| Initial JS bundle | < 200 KB gzipped |
| LCP               | < 2.5s           |
| Component render  | < 16ms (60fps)   |

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Explain the Redux Workflow

### Theory

Redux is a **predictable state container** with a strict **unidirectional data flow**:

```
UI dispatches Action → Reducer processes → Store updates → UI re-renders
```

**Core pieces:**

- **Store** — single source of truth holding application state
- **Action** — plain object `{ type: "ADD_ITEM", payload: {...} }` describing what happened
- **Reducer** — pure function `(state, action) => newState`
- **Dispatch** — sends action to store
- **Selector** — reads specific slice of state

With **Redux Toolkit (RTK)**, slices, Immer, and `createAsyncThunk` simplify the boilerplate.

### Pros & Cons

| Redux workflow                    | Ad-hoc useState everywhere           |
| --------------------------------- | ------------------------------------ |
| ✅ Predictable, traceable updates | ❌ State scattered across components |
| ✅ Time-travel debugging          | ❌ Hard to sync sibling components   |
| ✅ Middleware for async/logging   | ❌ Prop drilling for shared state    |
| ❌ Boilerplate without RTK        |                                      |

### Real-Life Example

```tsx
// 1. Slice — state + reducers
// store/employeeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (deptId: string) => {
    const res = await fetch(`/api/departments/${deptId}/employees`);
    return res.json();
  },
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    clearEmployees: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// 2. Store
import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({
  reducer: { employees: employeeSlice.reducer },
});

// 3. Provider
<Provider store={store}>
  <App />
</Provider>;

// 4. Component — dispatch + select
function EmployeeList() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.employees);

  useEffect(() => {
    dispatch(fetchEmployees("D101"));
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  return list.map((e) => <EmployeeCard key={e.id} employee={e} />);
}
```

### Workflow diagram

```
User clicks "Load Employees"
        ↓
dispatch(fetchEmployees("D101"))
        ↓
createAsyncThunk → API call
        ↓
pending → loading: true
        ↓
fulfilled → state.list = data, loading: false
        ↓
useSelector reads new state → component re-renders
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. What are the advantages of Redux?

### Theory

Redux centralizes application state and enforces predictable updates through pure reducers. It's most valuable when multiple components share complex state or when you need strong debugging and traceability.

### Advantages

| Advantage                  | Explanation                                           |
| -------------------------- | ----------------------------------------------------- |
| **Single source of truth** | All state in one store — easy to inspect              |
| **Predictable updates**    | Pure reducers — same input always same output         |
| **Time-travel debugging**  | Redux DevTools replay every action                    |
| **Middleware ecosystem**   | Logging, async (thunk/saga), analytics                |
| **Testability**            | Reducers are pure functions — easy unit tests         |
| **Scalability**            | Large teams — clear state ownership per slice         |
| **Decoupled components**   | Any component can read/dispatch without prop drilling |

### Pros & Cons

| When Redux helps                                           | When Redux is overkill            |
| ---------------------------------------------------------- | --------------------------------- |
| Complex shared client state (auth, cart, multi-step forms) | Simple local UI state             |
| Multiple features need same data                           | Server state (use TanStack Query) |
| Need action history / debugging                            | Small apps with few components    |
| Enterprise apps with many developers                       | Prototyping / MVPs                |

### Real-Life Example

```tsx
// Without Redux — prop drilling + duplicate fetches
<App user={user}>
  <Header user={user} />
  <Sidebar user={user} />
  <Dashboard user={user} />
</App>;

// With Redux — any component accesses state directly
function Header() {
  const user = useAppSelector((s) => s.auth.user);
  return <span>{user.name}</span>;
}

function Sidebar() {
  const user = useAppSelector((s) => s.auth.user);
  return <nav>{user.role === "admin" && <AdminLink />}</nav>;
}

// Redux DevTools — replay bug report
// "User clicked Add → ADD_ITEM → state.cart.items.length went 2→3"
// Reproduce exact sequence of actions
```

**Modern note for interview:** Mention Redux Toolkit + TanStack Query together — Redux for client state, Query for server state.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. What is Snapshot Testing?

### Theory

**Snapshot testing** captures the rendered output of a component (or serialized data) and saves it as a **snapshot file**. On future test runs, the output is compared against the saved snapshot. If they differ, the test fails — you either fix a bug or update the snapshot intentionally.

Common tools: **Jest** (`toMatchSnapshot`), **Vitest**, React Testing Library.

Snapshots can capture:

- React component HTML/JSON tree
- Serialized objects
- Error messages

### Pros & Cons

| Pros                                          | Cons                                                      |
| --------------------------------------------- | --------------------------------------------------------- |
| ✅ Fast to write — good for regression        | ❌ Developers blindly update snapshots                    |
| ✅ Catches unintended UI changes              | ❌ Large diffs hard to review                             |
| ✅ Good for stable, presentational components | ❌ Not a substitute for behavior tests                    |
| ✅ Documents component output over time       | ❌ Fragile if snapshots include dynamic data (dates, IDs) |

### Real-Life Example

```tsx
// EmployeeCard.tsx
function EmployeeCard({ name, role, department }) {
  return (
    <div className="employee-card">
      <h3>{name}</h3>
      <p>{role}</p>
      <span className="dept-badge">{department}</span>
    </div>
  );
}

// EmployeeCard.test.tsx
import { render } from "@testing-library/react";
import EmployeeCard from "./EmployeeCard";

describe("EmployeeCard", () => {
  it("matches snapshot", () => {
    const { container } = render(
      <EmployeeCard
        name="Priya Sharma"
        role="Senior Developer"
        department="Engineering"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

```javascript
// First run creates: __snapshots__/EmployeeCard.test.tsx.snap
exports[`EmployeeCard matches snapshot 1`] = `
<div class="employee-card">
  <h3>Priya Sharma</h3>
  <p>Senior Developer</p>
  <span class="dept-badge">Engineering</span>
</div>
`;
```

**Best practices:**

- Use snapshots for **stable presentational** components
- Combine with **behavior tests** (clicks, form submission)
- Mock dates/IDs to avoid flaky snapshots
- Review snapshot diffs carefully in PRs — don't auto-accept blindly

```tsx
// Better — snapshot + behavior test together
it("calls onSelect when clicked", async () => {
  const onSelect = jest.fn();
  render(<EmployeeCard name="Amit" onSelect={onSelect} />);
  await userEvent.click(screen.getByRole("button", { name: /select/i }));
  expect(onSelect).toHaveBeenCalledWith("Amit");
});
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Coding: Find the first non-repeated character

### Theory

Find the **first character** in a string that appears exactly **once**. Two-pass approach:

1. Count frequency of each character
2. Iterate string left-to-right, return first char with count === 1

Time: **O(n)**, Space: **O(k)** where k = unique characters.

### Pros & Cons

| Hash map (Map)           | Array (ASCII)                     |
| ------------------------ | --------------------------------- |
| ✅ Works with Unicode    | ✅ O(1) space for limited charset |
| ✅ Handles any character | ❌ Limited to known charset size  |
| Slightly more memory     | Faster for English-only           |

### Real-Life Example

**Input:** `"I love coding"`

```javascript
function firstNonRepeated(str) {
  const freq = new Map();

  for (const char of str) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  for (const char of str) {
    if (freq.get(char) === 1) return char;
  }

  return null;
}

console.log(firstNonRepeated("I love coding")); // "I"
```

**Walk-through:**

```
Char frequencies:
  " " → 1
  "I" → 1  ← first non-repeated (index 0)
  "l" → 1  (but "I" comes first)
  "o" → 2
  "v" → 1
  "e" → 2
  "c" → 1
  "d" → 1
  "i" → 1
  "n" → 1
  "g" → 1

Scan left to right: "I" at index 0 has freq 1 → return "I"
```

```javascript
// Case-sensitive variant
firstNonRepeated("I love coding"); // "I"
firstNonRepeated("i love coding"); // "i"

// Ignore spaces (if interviewer asks)
function firstNonRepeatedNoSpaces(str) {
  const cleaned = str.replace(/\s/g, "");
  const freq = new Map();
  for (const char of cleaned) freq.set(char, (freq.get(char) || 0) + 1);
  for (const char of cleaned) if (freq.get(char) === 1) return char;
  return null;
}
firstNonRepeatedNoSpaces("I love coding"); // "I" (still first unique)
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. What is an Error Boundary?

### Theory

An **Error Boundary** is a React class component that catches JavaScript errors in its **child component tree** during rendering, in lifecycle methods, and in constructors. It displays a fallback UI instead of crashing the entire application.

**Does NOT catch:**

- Event handler errors (use try/catch)
- Async errors (use try/catch or `.catch()`)
- Errors in the boundary itself
- SSR errors

### Pros & Cons

| Pros                                         | Cons                                   |
| -------------------------------------------- | -------------------------------------- |
| ✅ Isolates failures — app stays usable      | ❌ Class components only (no hook yet) |
| ✅ Better UX with fallback UI                | ❌ Doesn't catch async/event errors    |
| ✅ Integrates with error monitoring (Sentry) | Must be placed intentionally in tree   |

### Real-Life Example

```tsx
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (e: Error) => void;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error);
    logToSentry(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert">
            <p>Something went wrong in this section.</p>
            <button onClick={() => this.setState({ hasError: false })}>
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// Wrap independent page sections
function DashboardPage() {
  return (
    <div className="dashboard">
      <ErrorBoundary fallback={<SectionError name="Announcements" />}>
        <AnnouncementsSection />
      </ErrorBoundary>
      <ErrorBoundary fallback={<SectionError name="Team" />}>
        <TeamSection />
      </ErrorBoundary>
      <ErrorBoundary fallback={<SectionError name="Projects" />}>
        <ProjectsSection />
      </ErrorBoundary>
    </div>
  );
}
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Scenario-Based: 3 API calls, fast load, partial errors

### Theory

**Requirements from Mphasis interview:**

1. Three independent API calls populate different page sections
2. Page must load **fast**
3. If one API fails, show error **only in that block** — other sections keep working

**Solution architecture:**

- **Parallel fetching** — `Promise.allSettled()` or three independent TanStack Query hooks
- **Per-section error boundaries** — catch render errors
- **Per-section error/loading state** — independent UI per block
- **Streaming / progressive rendering** — show each section as data arrives (not wait for all)
- **Suspense boundaries** (optional) — per-section loading fallbacks

### Pros & Cons

| Independent sections + allSettled                 | Promise.all                       |
| ------------------------------------------------- | --------------------------------- |
| ✅ Partial failure tolerated                      | ❌ One failure breaks entire page |
| ✅ Fast perceived load — sections appear as ready | ❌ Waits for slowest API          |
| ✅ Matches real enterprise dashboards             | More complex state per section    |
| More code per section                             |                                   |

### Real-Life Example — Full implementation

```tsx
// hooks/useSectionData.ts
import { useQuery } from "@tanstack/react-query";

function useSectionData<T>(key: string, fetcher: () => Promise<T>) {
  return useQuery({
    queryKey: [key],
    queryFn: fetcher,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    // Each query is independent — one failure doesn't affect others
  });
}
```

```tsx
// components/SectionBlock.tsx — reusable section wrapper
function SectionBlock({ title, isLoading, isError, error, onRetry, children }) {
  return (
    <section className="dashboard-section" aria-labelledby={`${title}-heading`}>
      <h2 id={`${title}-heading`}>{title}</h2>

      {isLoading && <SectionSkeleton />}

      {isError && (
        <div role="alert" className="section-error">
          <p>
            Failed to load {title}. {error?.message}
          </p>
          <button onClick={onRetry}>Retry</button>
        </div>
      )}

      {!isLoading && !isError && children}
    </section>
  );
}
```

```tsx
// pages/DashboardPage.tsx — Mphasis scenario solution
import ErrorBoundary from "../ErrorBoundary";

function AnnouncementsSection() {
  const { data, isLoading, isError, error, refetch } = useSectionData(
    "announcements",
    () =>
      fetch("/api/announcements").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
  );

  return (
    <SectionBlock
      title="Announcements"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      <AnnouncementList items={data} />
    </SectionBlock>
  );
}

function TeamSection() {
  const { data, isLoading, isError, error, refetch } = useSectionData(
    "team",
    () =>
      fetch("/api/team").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
  );

  return (
    <SectionBlock
      title="Team"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      <TeamGrid members={data} />
    </SectionBlock>
  );
}

function ProjectsSection() {
  const { data, isLoading, isError, error, refetch } = useSectionData(
    "projects",
    () =>
      fetch("/api/projects").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
  );

  return (
    <SectionBlock
      title="Projects"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      <ProjectList projects={data} />
    </SectionBlock>
  );
}

function DashboardPage() {
  return (
    <main className="dashboard-grid">
      {/* Each section: independent fetch, loading, error, and error boundary */}
      <ErrorBoundary fallback={<SectionError name="Announcements" />}>
        <AnnouncementsSection />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Team" />}>
        <TeamSection />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Projects" />}>
        <ProjectsSection />
      </ErrorBoundary>
    </main>
  );
}
```

#### Alternative — Promise.allSettled without React Query

```tsx
function DashboardPageManual() {
  const [sections, setSections] = useState({
    announcements: { data: null, loading: true, error: null },
    team: { data: null, loading: true, error: null },
    projects: { data: null, loading: true, error: null },
  });

  useEffect(() => {
    const controllers = [
      new AbortController(),
      new AbortController(),
      new AbortController(),
    ];

    const configs = [
      { key: "announcements", url: "/api/announcements" },
      { key: "team", url: "/api/team" },
      { key: "projects", url: "/api/projects" },
    ];

    // Fire all 3 in parallel — don't wait for each other
    configs.forEach(({ key, url }, i) => {
      fetch(url, { signal: controllers[i].signal })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          setSections((prev) => ({
            ...prev,
            [key]: { data, loading: false, error: null },
          }));
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setSections((prev) => ({
            ...prev,
            [key]: { data: null, loading: false, error: err.message },
          }));
        });
    });

    return () => controllers.forEach((c) => c.abort());
  }, []);

  return (
    <main className="dashboard-grid">
      <SectionBlock title="Announcements" {...sections.announcements} />
      <SectionBlock title="Team" {...sections.team} />
      <SectionBlock title="Projects" {...sections.projects} />
    </main>
  );
}
```

### Architecture diagram

```
Dashboard Page
├── Announcements Section
│   ├── fetch /api/announcements (parallel)
│   ├── own loading skeleton
│   ├── own error block (if fails)
│   └── ErrorBoundary (render errors)
├── Team Section
│   ├── fetch /api/team (parallel)
│   ├── own loading / error
│   └── ErrorBoundary
└── Projects Section
    ├── fetch /api/projects (parallel)
    ├── own loading / error
    └── ErrorBoundary

✅ Fast: all 3 fire simultaneously, sections render as each resolves
✅ Resilient: team API 503 → only team block shows error
```

### Performance optimizations to mention

| Technique                         | Benefit                                    |
| --------------------------------- | ------------------------------------------ |
| Parallel fetch (not sequential)   | Total time = slowest API, not sum of all   |
| Independent loading states        | Perceived speed — fast sections show first |
| `staleTime` caching (React Query) | Instant on revisit                         |
| Prefetch on navigation hover      | Data ready before page mount               |
| Skeleton loaders per section      | Better CLS than full-page spinner          |
| `AbortController` cleanup         | No stale updates on navigate away          |

### Interview answer (concise)

> I'd fire all three API calls in parallel — not sequentially — so total wait time equals the slowest call. Each section manages its own loading, data, and error state independently using TanStack Query or separate fetch calls with `Promise.allSettled`. If the team API fails, only the team block shows an error with a retry button; announcements and projects render normally. I'd wrap each section in an Error Boundary for render errors, use skeleton loaders for perceived speed, and cache responses with `staleTime` for repeat visits.

---

# Quick Revision Cheat Sheet

| #   | Topic              | One-liner                                                        |
| --- | ------------------ | ---------------------------------------------------------------- |
| 1   | Hoisting           | Declarations registered before execution; var=undefined, let=TDZ |
| 2   | Event Loop         | Sync → microtasks → macrotask                                    |
| 3   | Arrow vs normal    | Arrow = lexical `this`; normal = dynamic `this`                  |
| 4   | Promise            | pending/fulfilled/rejected async result                          |
| 5   | all vs allSettled  | all = fail fast; allSettled = all outcomes, partial success      |
| 6   | Virtual DOM        | JS tree + diff → minimal real DOM updates                        |
| 7   | React performance  | Split, memo, virtualize, cache, profile, Web Vitals              |
| 8   | Redux workflow     | dispatch → reducer → store → UI                                  |
| 9   | Redux advantages   | Single truth, predictable, DevTools, testable                    |
| 10  | Snapshot testing   | Save render output, compare on future runs                       |
| 11  | First non-repeated | Frequency map + second left-to-right scan → `"I"`                |
| 12  | Error Boundary     | Catch render errors, show fallback per section                   |
| 13  | 3 API scenario     | Parallel fetch, per-section state/error, Error Boundaries        |

---

_Mphasis interviews test fundamentals deeply and expect you to connect them to real architecture — especially partial failure handling. Practice explaining the 3-API scenario out loud with the parallel + independent error pattern._


<p><a href="#i13">Back to index</a></p>
