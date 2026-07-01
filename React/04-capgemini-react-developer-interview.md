---
title: "Capgemini React Developer Interview Preparation"
description: "Practical React, TypeScript, JavaScript, and Redux answers with theory, pros/cons, and real-life examples."
tags: ["react", "typescript", "redux", "capgemini", "interview"]
level: "2–5 years"
company: "Capgemini"
---

# Capgemini React Developer Interview Preparation

This round focuses on **practical understanding** of React, TypeScript, and JavaScript — not just definitions. Each topic includes theory, pros/cons where relevant, and real-life examples you can use in interviews.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is React and why is it efficient?](#p1) |
| <span id="i2"></span>2 | [How does React work internally?](#p2) |
| <span id="i3"></span>3 | [Most challenging task in your project](#p3) |
| <span id="i4"></span>4 | [Is JavaScript tightly or loosely coupled?](#p4) |
| <span id="i5"></span>5 | [Why do we use TypeScript?](#p5) |
| <span id="i6"></span>6 | [extends in TypeScript — type vs interface](#p6) |
| <span id="i7"></span>7 | [How does Redux work — installation to usage](#p7) |
| <span id="i8"></span>8 | [Redux Toolkit vs TanStack Query](#p8) |
| <span id="i9"></span>9 | [Difference between bind and apply](#p9) |
| <span id="i10"></span>10 | [useCallback and useMemo in real projects](#p10) |
| <span id="i11"></span>11 | [Role of the dependency array in useEffect](#p11) |

---

<a id="p1"></a>

## 1. What is React and why is it efficient?

### Theory

**React** is a JavaScript library for building user interfaces using a **component-based**, **declarative** model. You describe what the UI should look like for a given state, and React handles updating the DOM when state changes.

React is efficient because it:

1. **Virtual DOM** — compares trees and applies minimal DOM mutations instead of rewriting the entire page
2. **Batched updates** — groups multiple state changes into one re-render (React 18 automatic batching)
3. **Fiber architecture** — interruptible rendering; urgent updates (typing) aren't blocked by heavy work
4. **One-way data flow** — predictable state propagation from parent to child
5. **Component reusability** — write once, compose everywhere

### Pros & Cons

| Pros                                    | Cons                                                                 |
| --------------------------------------- | -------------------------------------------------------------------- |
| Large ecosystem and community           | JSX learning curve for beginners                                     |
| Reusable component model                | Needs additional libraries for routing, state (not a full framework) |
| Strong hiring market                    | Frequent ecosystem changes (hooks, RSC, etc.)                        |
| Virtual DOM minimizes expensive DOM ops | Can over-render without memoization discipline                       |

### Real-Life Example

```jsx
// Declarative — you describe UI based on state
function OrderTracker({ orderId }) {
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) return <Skeleton />;
  if (order.status === "delivered") return <DeliveredBanner order={order} />;

  return (
    <div>
      <h2>Order #{order.id}</h2>
      <StatusTimeline steps={order.timeline} />
      <LiveMap driverLocation={order.driverLocation} />
    </div>
  );
}

// React efficiently updates only what changed:
// - Status text changes → only that DOM node updates
// - Driver location updates every 5s → only map marker moves
// - You never manually call document.getElementById or innerHTML
```

### Interview answer (concise)

> React is a component-based UI library. You declare UI as a function of state. It's efficient because of Virtual DOM diffing, batched updates, and the Fiber engine that prioritizes user interactions over background rendering.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. How does React work internally?

### Theory

React's internal pipeline has four major stages when state changes:

```
State Change
    ↓
Schedule Update (priority lane assigned)
    ↓
Render Phase (interruptible)
  → Call component functions
  → Run hooks (linked list on Fiber node)
  → Build new Virtual DOM / Fiber tree
  → Diff against previous tree
    ↓
Commit Phase (synchronous)
  → Apply DOM mutations
  → Run useLayoutEffect
    ↓
Browser Paint
    ↓
Passive Effects (useEffect runs after paint)
```

**Fiber** is the core data structure — each component instance is a Fiber node with links to parent, child, and sibling. This linked-list tree enables React to pause, resume, and prioritize work.

### Pros & Cons of React's internal model

| Pros                                               | Cons                                        |
| -------------------------------------------------- | ------------------------------------------- |
| Interruptible rendering keeps UI responsive        | Mental model is complex for beginners       |
| Double buffering (current ↔ work-in-progress tree) | Debugging across async boundaries is hard   |
| Hooks stored as linked list — predictable order    | Rules of Hooks exist because of this design |

### Real-Life Example

```jsx
function SearchPage() {
  const [query, setQuery] = useState(""); // Hook #1 on Fiber
  const [results, setResults] = useState([]); // Hook #2 on Fiber

  useEffect(() => {
    // Scheduled AFTER browser paint
    fetch(`/api/search?q=${query}`)
      .then((r) => r.json())
      .then(setResults);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultList items={results} />
    </div>
  );
}

// What happens when user types "p":
// 1. onChange fires → setQuery("p") enqueued on Fiber
// 2. Render phase: SearchPage re-runs, hooks return new query
// 3. ResultList may or may not re-render (depends on memo)
// 4. Commit: input value updated in DOM
// 5. Browser paints
// 6. useEffect runs because query changed → API call fires
```

### Key internals to mention

| Concept        | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| Fiber node     | Unit of work; holds state, props, hooks              |
| Reconciliation | Diff algorithm — O(n) heuristic                      |
| Update queue   | Circular linked list of pending state updates        |
| Lanes          | Priority system for concurrent features              |
| `Object.is`    | Comparison for bailout (same value → skip re-render) |

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What is the most challenging task you handled in your project?

### Theory

This is a **behavioral question**. Interviewers assess problem-solving, ownership, technical depth, and communication. Use the **STAR method**:

- **S**ituation — project context and constraints
- **T**ask — your specific responsibility
- **A**ction — technical decisions and steps you took
- **R**esult — measurable outcome

Capgemini values **practical experience**, so anchor your answer in real technical work — performance, legacy migration, production bugs, or cross-team coordination.

### Pros & Cons of answer strategies

| Do                                                      | Avoid                                  |
| ------------------------------------------------------- | -------------------------------------- |
| Quantify impact (load time, error rate, users affected) | Vague answers without technical detail |
| Explain trade-offs you considered                       | Blaming teammates                      |
| Show what you learned                                   | Picking a trivial task                 |
| Mention tools (React Profiler, Redux DevTools)          | Rambling over 3 minutes                |

### Real-Life Example — Sample answer skeleton

> **Situation:** In our e-commerce project, the product listing page took 8+ seconds to load on mobile. It had 200+ product cards, each fetching ratings from a separate API, causing a waterfall of 200 requests.
>
> **Task:** I owned the frontend performance fix for the listing page before a major sale event.
>
> **Action:**
>
> - Profiled with React DevTools — identified unnecessary re-renders and N+1 API pattern
> - Worked with backend to create a batch ratings API (`/api/ratings?ids=1,2,3...`)
> - Introduced TanStack Query for caching and deduplication
> - Virtualized the product list with `@tanstack/react-virtual` — only 15 DOM nodes instead of 200
> - Wrapped `ProductCard` in `React.memo` and stabilized callbacks with `useCallback`
>
> **Result:** Page load dropped from 8s to 1.4s (LCP). API calls reduced from 200+ to 2 per page view. Zero performance complaints during the sale weekend.

### Tips for your own answer

Pick a story where you can naturally mention **React, TypeScript, or Redux** — Capgemini's focus areas. Have 2–3 stories ready and choose based on the conversation flow.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Is JavaScript tightly coupled or loosely coupled?

### Theory

**Coupling** measures how dependent one module is on another's internal details.

- **Tightly coupled** — modules know each other's internals; changing one breaks others
- **Loosely coupled** — modules interact through well-defined interfaces; changes are isolated

JavaScript **as a language** is flexible and supports both styles. By default, without discipline, JS code tends toward **tight coupling** — global variables, direct DOM manipulation, shared mutable state.

With good patterns, JS achieves **loose coupling** — modules, dependency injection, event-driven architecture, interfaces (TypeScript).

### Pros & Cons

| Tight Coupling                   | Loose Coupling                 |
| -------------------------------- | ------------------------------ |
| Faster to write initially        | More upfront design            |
| Direct access — less boilerplate | Easier to test in isolation    |
| Hard to maintain at scale        | Easier to swap implementations |
| Changes ripple across codebase   | Better team parallelization    |

### Real-Life Example

```javascript
// ❌ Tightly coupled — OrderService directly depends on Stripe internals
class OrderService {
  placeOrder(cart) {
    const stripe = new Stripe("sk_live_xxx");
    stripe.charges.create({ amount: cart.total, currency: "inr" });
    document.getElementById("status").innerText = "Paid"; // DOM coupling too
  }
}

// ✅ Loosely coupled — depends on abstractions (interfaces)
class OrderService {
  constructor(paymentGateway, notifier) {
    this.paymentGateway = paymentGateway; // injected
    this.notifier = notifier;
  }

  async placeOrder(cart) {
    await this.paymentGateway.charge(cart.total);
    this.notifier.notify("order_placed", cart);
  }
}

// Swap Stripe for Razorpay without touching OrderService
const orderService = new OrderService(
  new RazorpayGateway(),
  new EmailNotifier(),
);
```

```tsx
// React loose coupling — composition over inheritance
function CheckoutPage() {
  return (
    <PaymentProvider gateway="razorpay">
      <CartSummary />
      <PaymentForm /> {/* doesn't know which gateway */}
      <OrderConfirmation />
    </PaymentProvider>
  );
}
```

### Interview answer (concise)

> JavaScript doesn't enforce coupling — it's up to the developer. Without patterns, JS tends to be tightly coupled. We achieve loose coupling through modules, dependency injection, React's component composition, TypeScript interfaces, and separating UI from business logic.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Why do we use TypeScript?

### Theory

**TypeScript** is a typed superset of JavaScript that compiles to plain JS. It adds **static type checking** at compile time, catching errors before runtime.

### Why teams adopt TypeScript

1. **Catch bugs early** — typos, wrong argument types, null access
2. **Better IDE support** — autocomplete, refactoring, go-to-definition
3. **Self-documenting code** — types serve as inline documentation
4. **Safer refactoring** — rename a field, compiler finds all usages
5. **Team scalability** — contracts between modules are explicit

### Pros & Cons

| Pros                              | Cons                                          |
| --------------------------------- | --------------------------------------------- |
| Fewer runtime type errors         | Build step required                           |
| Excellent autocomplete            | Learning curve for JS developers              |
| Safer large codebases             | Can be verbose (`any` abuse negates benefits) |
| Interfaces document API contracts | Slower initial development for small projects |

### Real-Life Example

```typescript
// JavaScript — bug discovered at runtime in production
function calculateDiscount(price, discountPercent) {
  return price - (price * discountPercent) / 100;
}
calculateDiscount("299", "10"); // "299" - NaN → broken UI

// TypeScript — caught at compile time
function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent) / 100;
}
calculateDiscount("299", "10"); // ❌ Compile error: string not assignable to number

// Real React project — typed API response
interface Restaurant {
  id: string;
  name: string;
  rating: number;
  cuisine: string[];
  isOpen: boolean;
}

async function fetchRestaurants(city: string): Promise<Restaurant[]> {
  const res = await fetch(`/api/restaurants?city=${city}`);
  return res.json();
}

// Autocomplete works: restaurant.rating, restaurant.cuisine
// Typo caught: restaurant.raiting → compile error
```

### Interview answer (concise)

> TypeScript adds static types to JavaScript. It catches errors at build time, improves IDE support, and makes large React codebases maintainable. In my projects, it's especially valuable for API response types, Redux state shapes, and component prop contracts.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. How does `extends` work in TypeScript and what is the difference between `type` and `interface`?

### Theory

Both `type` and `interface` define object shapes in TypeScript. **`extends`** inherits properties from another type or interface.

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
// Dog = { name: string; breed: string }
```

### `type` vs `interface` — key differences

| Feature                    | `interface`           | `type`                 |
| -------------------------- | --------------------- | ---------------------- |
| Object shapes              | ✅                    | ✅                     |
| `extends` / inheritance    | ✅ `extends`          | ✅ `&` intersection    |
| Declaration merging        | ✅ (same name merges) | ❌ (duplicate = error) |
| Primitives, unions, tuples | ❌                    | ✅                     |
| Computed properties        | ❌                    | ✅                     |
| `implements` in class      | ✅                    | ✅ (with object types) |

### When to use which

| Use `interface`                    | Use `type`                                                           |
| ---------------------------------- | -------------------------------------------------------------------- |
| Object/class contracts             | Unions: `type Status = "active" \| "inactive"`                       |
| Public API surfaces (libraries)    | Tuples: `type Point = [number, number]`                              |
| When you need declaration merging  | Mapped types: `type Readonly<T> = { readonly [K in keyof T]: T[K] }` |
| React component props (convention) | Utility compositions                                                 |

### Pros & Cons

| interface                                  | type                                         |
| ------------------------------------------ | -------------------------------------------- |
| Extendable, mergeable — good for libraries | More flexible — unions, primitives, computed |
| Clear OOP semantics                        | Cannot be reopened/merged                    |
| Slightly better error messages for objects | Required for advanced type operations        |

### Real-Life Example

```typescript
// interface — component props (Capgemini React project pattern)
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
}

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}

function IconButton({ icon, iconPosition = "left", label, ...rest }: IconButtonProps) {
  return (
    <button {...rest}>
      {iconPosition === "left" && icon}
      {label}
      {iconPosition === "right" && icon}
    </button>
  );
}

// type — unions and API response states
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

type User = { id: string; name: string; email: string };
type Admin = User & { permissions: string[] }; // intersection via type

// type — function signature
type Fetcher<T> = (url: string) => Promise<T>;

// interface merging — extending third-party types
interface Window {
  analytics: { track: (event: string, data?: object) => void };
}
// Now window.analytics is typed everywhere
```

### `extends` with generics

```typescript
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}

interface RestaurantListResponse extends PaginatedResponse<Restaurant> {
  city: string;
}
// { data: Restaurant[]; page: number; totalPages: number; city: string }
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. How does Redux work, from installation to usage in a project?

### Theory

**Redux** is a predictable state container. It holds application state in a single **store**, updated only through **actions** dispatched to a **reducer** (pure function). The flow is unidirectional:

```
UI → dispatch(action) → reducer(state, action) → new state → UI re-renders
```

### Pros & Cons

| Pros                                   | Cons                                               |
| -------------------------------------- | -------------------------------------------------- |
| Predictable state updates              | Boilerplate without RTK                            |
| Time-travel debugging (Redux DevTools) | Overkill for simple apps                           |
| Centralized state — easy to trace      | Learning curve for new developers                  |
| Middleware for async (thunks, sagas)   | Can cause unnecessary re-renders without selectors |

### Real-Life Example — Full flow

#### Step 1: Installation

```bash
npm install @reduxjs/toolkit react-redux
```

#### Step 2: Create a slice (RTK — modern approach)

```typescript
// store/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = { items: [], total: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.total = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    clearCart: () => initialState,
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

#### Step 3: Configure store

```typescript
// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Step 4: Provide store to React

```tsx
// main.tsx
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
```

#### Step 5: Use in components

```tsx
// hooks.ts — typed hooks
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// CartButton.tsx
import { useAppSelector, useAppDispatch } from "../hooks";
import { addItem } from "../store/slices/cartSlice";

function AddToCartButton({ product }) {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) => state.cart.items.length);

  return (
    <button onClick={() => dispatch(addItem(product))}>
      Add to Cart ({cartCount})
    </button>
  );
}
```

#### Step 6: Async with createAsyncThunk

```typescript
// store/slices/ordersSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (userId: string) => {
    const res = await fetch(`/api/orders?userId=${userId}`);
    return res.json();
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

### Classic Redux flow (without RTK — know for interviews)

```javascript
// Action
const ADD_ITEM = "cart/ADD_ITEM";
const addItem = (item) => ({ type: ADD_ITEM, payload: item });

// Reducer (pure function)
function cartReducer(state = [], action) {
  switch (action.type) {
    case ADD_ITEM:
      return [...state, action.payload];
    default:
      return state;
  }
}

// Store
const store = createStore(cartReducer);
store.dispatch(addItem({ id: 1, name: "Biryani" }));
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Have you used Redux Toolkit (RTK) or TanStack Query?

### Theory

These solve **different problems**:

|              | Redux Toolkit (RTK)               | TanStack Query                     |
| ------------ | --------------------------------- | ---------------------------------- |
| **Purpose**  | Client-side global state          | Server state (API data)            |
| **Manages**  | UI state, auth, cart, preferences | Fetched/cached remote data         |
| **Caching**  | Manual                            | Automatic (stale-while-revalidate) |
| **Async**    | createAsyncThunk, RTK Query       | Built-in useQuery / useMutation    |
| **DevTools** | Redux DevTools                    | React Query DevTools               |

They are **complementary**, not competitors. Use RTK for client state, TanStack Query for server state.

### Pros & Cons

| RTK                                   | TanStack Query                             |
| ------------------------------------- | ------------------------------------------ |
| ✅ Great for complex client workflows | ✅ Eliminates boilerplate for API calls    |
| ✅ Predictable global state           | ✅ Auto refetch, cache invalidation, dedup |
| ❌ Overkill for API-only state        | ❌ Not for UI-only state (sidebar open)    |
| ❌ Boilerplate even with RTK          | ❌ Learning curve for cache concepts       |

### Real-Life Example — Using both together

```tsx
// TanStack Query — server state (restaurant data from API)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function RestaurantList({ city }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["restaurants", city],
    queryFn: () => fetch(`/api/restaurants?city=${city}`).then((r) => r.json()),
    staleTime: 5 * 60 * 1000, // fresh for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner />;
  return data.map((r) => <RestaurantCard key={r.id} restaurant={r} />);
}

// RTK — client state (shopping cart, not from API cache)
function CartDrawer() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  return (
    <div>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => dispatch(removeItem(item.id))}
        />
      ))}
    </div>
  );
}

// TanStack Query mutation — place order, then invalidate cache
function PlaceOrderButton({ cartItems }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (order) =>
      fetch("/api/orders", { method: "POST", body: JSON.stringify(order) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      dispatch(clearCart()); // RTK action
    },
  });

  return (
    <button onClick={() => mutation.mutate(cartItems)}>Place Order</button>
  );
}
```

### Interview answer (concise)

> Yes, I've used both. RTK for client-side state like cart, auth, and UI preferences. TanStack Query for all API data — it handles caching, background refetch, and loading/error states better than putting fetch logic in Redux. In my last project, we used both: Query for server state, RTK for client state.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. What is the difference between `bind` and `apply` in JavaScript?

### Theory

Both `call`, `apply`, and `bind` let you control the `this` context of a function. They are methods on `Function.prototype`.

| Method  | Invokes immediately? | Arguments                       | Returns                            |
| ------- | -------------------- | ------------------------------- | ---------------------------------- |
| `call`  | ✅ Yes               | Comma-separated                 | Function result                    |
| `apply` | ✅ Yes               | Array of arguments              | Function result                    |
| `bind`  | ❌ No                | Comma-separated (partial apply) | **New function** with bound `this` |

### Pros & Cons

| bind                                        | apply                                    |
| ------------------------------------------- | ---------------------------------------- |
| Creates reusable function with fixed `this` | Invokes immediately — one-time use       |
| Supports partial application                | Useful when args are already in an array |
| No immediate execution — defer call         | Must know all args at call time          |

### Real-Life Example

```javascript
const restaurant = {
  name: "Spice Garden",
  getDetails(prefix) {
    return `${prefix}: ${this.name}`;
  },
};

// apply — invoke immediately with array of args
restaurant.getDetails.call(restaurant, "Welcome"); // "Welcome: Spice Garden"
restaurant.getDetails.apply(restaurant, ["Welcome"]); // same result

// apply shines with dynamic arrays
const args = ["Order from"];
restaurant.getDetails.apply(restaurant, args); // "Order from: Spice Garden"

// bind — returns a new function, does NOT invoke
const getWelcome = restaurant.getDetails.bind(restaurant, "Welcome");
getWelcome(); // "Welcome: Spice Garden" — called later

// Real React use case — binding event handlers in class components
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this); // ensure `this` is the component
  }

  handleSearch(query) {
    this.props.onSearch(query); // `this` correctly refers to component instance
  }
}

// Modern React — arrow functions or hooks eliminate bind need
function SearchBar({ onSearch }) {
  const handleSearch = (query) => onSearch(query); // no bind needed
  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

### Quick comparison

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Amit" };

greet.apply(user, ["Hello", "!"]); // "Hello, Amit!" — called now, args as array
greet.call(user, "Hello", "!"); // "Hello, Amit!" — called now, args individually

const boundGreet = greet.bind(user, "Hello");
boundGreet("!"); // "Hello, Amit!" — called later, partial args
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. What has been your experience with useCallback and useMemo in real projects?

### Theory

| Hook          | Memoizes           | Prevents                                            |
| ------------- | ------------------ | --------------------------------------------------- |
| `useCallback` | Function reference | Child re-render (when passed to `React.memo` child) |
| `useMemo`     | Computed value     | Expensive recalculation on every render             |

**Key insight:** These are **performance optimizations**, not correctness tools. Use them after profiling shows a problem — not everywhere by default.

### Pros & Cons

| Pros                                        | Cons                                   |
| ------------------------------------------- | -------------------------------------- |
| Prevents expensive recalculations           | Adds memory overhead (cached values)   |
| Stabilizes references for memoized children | Shallow compare can miss deep changes  |
| Fixes stale closure in effect deps          | Overuse makes code harder to read      |
| Essential for virtualization libraries      | Premature optimization wastes dev time |

### Real-Life Example — When they helped

```tsx
// Project: Admin dashboard with 500-row data table

function AdminDashboard({ filters }) {
  const { data: orders } = useOrders();

  // useMemo — filtering 500 orders was taking 40ms per keystroke
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filters.status && order.status !== filters.status) return false;
      if (filters.city && order.city !== filters.city) return false;
      if (filters.search) {
        return order.customerName
          .toLowerCase()
          .includes(filters.search.toLowerCase());
      }
      return true;
    });
  }, [orders, filters]); // only recalculate when these change

  // useCallback — without this, every row re-rendered on parent render
  const handleCancelOrder = useCallback((orderId: string) => {
    cancelOrder(orderId);
    toast.success("Order cancelled");
  }, []); // stable reference

  return (
    <VirtualTable
      rows={filteredOrders}
      renderRow={(order) => (
        <OrderRow key={order.id} order={order} onCancel={handleCancelOrder} />
      )}
    />
  );
}

const OrderRow = React.memo(function OrderRow({ order, onCancel }) {
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.customerName}</td>
      <td>
        <button onClick={() => onCancel(order.id)}>Cancel</button>
      </td>
    </tr>
  );
});
```

### Real-Life Example — When NOT to use them

```tsx
// ❌ Over-optimization — cheap operations
function UserGreeting({ name }) {
  const greeting = useMemo(() => `Hello, ${name}`, [name]); // pointless
  const handleClick = useCallback(() => console.log(name), [name]); // pointless
  return <p onClick={handleClick}>{greeting}</p>;
}

// ✅ Just write it simply
function UserGreeting({ name }) {
  return <p onClick={() => console.log(name)}>Hello, {name}</p>;
}
```

### My real project experience (answer template)

> In our admin dashboard, we had a table with 500+ rows. Profiling showed filtering took 40ms per render. I added `useMemo` for the filtered list and `useCallback` for row action handlers, combined with `React.memo` on row components. Render time dropped from 40ms to 4ms.
>
> But I don't use them everywhere. For simple components with cheap computations, they add complexity without benefit. My rule: profile first, optimize second.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. What is the role of the dependency array in useEffect?

### Theory

The **dependency array** is the second argument of `useEffect`. It tells React **when to re-run** the effect:

| Dependency Array    | Behavior                                    |
| ------------------- | ------------------------------------------- |
| **Omitted**         | Runs after **every** render                 |
| **`[]` (empty)**    | Runs **once** on mount; cleanup on unmount  |
| **`[a, b]`**        | Runs on mount + whenever `a` or `b` changes |
| **No array at all** | Runs after every render (rarely intended)   |

React compares dependencies using `Object.is` (shallow equality). If all deps are the same reference/value, the effect is skipped.

### Pros & Cons of strict dependency rules

| Pros                                   | Cons                                      |
| -------------------------------------- | ----------------------------------------- |
| Prevents stale closures                | ESLint exhaustive-deps can feel noisy     |
| Ensures effects sync with latest state | Easy to cause infinite loops with objects |
| Makes effect triggers explicit         | Requires understanding reference equality |

### Real-Life Example

```tsx
function OrderTracker({ orderId }) {
  const [status, setStatus] = useState("loading");

  // [] — run once on mount (fetch initial data)
  useEffect(() => {
    fetchOrder(orderId).then(setStatus);
  }, []); // ⚠️ Bug: orderId not in deps — stale if orderId changes

  // ✅ Correct — re-fetch when orderId changes
  useEffect(() => {
    setStatus("loading");
    fetchOrder(orderId).then(setStatus);
  }, [orderId]);

  // [query] — re-run search when query changes
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setResults);

    return () => controller.abort(); // cleanup prevents race condition
  }, [query]);

  // WebSocket — setup on mount, cleanup on unmount
  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/orders/${orderId}`);
    ws.onmessage = (e) => setStatus(JSON.parse(e.data).status);

    return () => ws.close(); // cleanup — prevents memory leak
  }, [orderId]);
}
```

### Common mistakes

```tsx
// ❌ Missing dependency — stale closure
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // always uses initial count (0)
  }, 1000);
  return () => clearInterval(interval);
}, []);

// ✅ Fix 1 — functional updater (no dep needed)
useEffect(() => {
  const interval = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(interval);
}, []);

// ✅ Fix 2 — add count to deps
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(interval);
}, [count]);

// ❌ Object/array in deps — infinite loop (new reference every render)
useEffect(() => {
  fetchData(filters);
}, [filters]); // if filters = { status: "active" } created inline → infinite loop

// ✅ Fix — memoize or use primitive deps
const filters = useMemo(() => ({ status, city }), [status, city]);
useEffect(() => {
  fetchData(filters);
}, [filters]);
```

### Cleanup function role

The return value of `useEffect` is a **cleanup function** that runs:

1. Before the effect re-runs (deps changed)
2. When the component unmounts

Use cleanup for: timers, subscriptions, event listeners, WebSockets, AbortControllers.

### Interview answer (concise)

> The dependency array controls when useEffect re-runs. Empty array means mount-only. Listing values means re-run when they change. React uses shallow comparison. Missing deps cause stale closures; unstable references cause infinite loops. Always return a cleanup function for subscriptions and async work.

---

# Quick Revision Cheat Sheet

| #   | Topic               | One-liner                                                       |
| --- | ------------------- | --------------------------------------------------------------- |
| 1   | React & efficiency  | Component-based, Virtual DOM, batched updates, Fiber            |
| 2   | React internals     | Fiber → render phase → commit → effects                         |
| 3   | Challenging task    | STAR method, quantify impact, show trade-offs                   |
| 4   | JS coupling         | Flexible language; loose coupling via modules, DI, composition  |
| 5   | TypeScript          | Static types, catch bugs early, better tooling                  |
| 6   | type vs interface   | interface = objects + merging; type = unions + utilities        |
| 7   | Redux flow          | dispatch → reducer → store → UI; RTK simplifies                 |
| 8   | RTK vs Query        | RTK = client state; Query = server state                        |
| 9   | bind vs apply       | apply = invoke now with array args; bind = returns new function |
| 10  | useMemo/useCallback | Profile first; memoize expensive work + stable child refs       |
| 11  | useEffect deps      | Controls re-run timing; cleanup prevents leaks                  |

---

_Capgemini interviews reward practical depth. Practice explaining concepts using examples from your own projects — that's what separates a strong candidate from someone who only knows definitions._


<p><a href="#i11">Back to index</a></p>
