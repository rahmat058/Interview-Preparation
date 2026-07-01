---
title: "Top React & JavaScript Interview Questions to Master in 2026"
description: "38 essential topics with theory, pros/cons, and real-life examples for modern frontend interviews."
tags: ["react", "javascript", "interview", "2026"]
level: "4+ years"
---

# Top React & JavaScript Interview Questions to Master in 2026

Each topic follows this structure:

1. **Theory** — clear description of the concept
2. **Pros & Cons** — where trade-offs matter
3. **Real-Life Example** — practical code or scenario

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Promise.all polyfill](#p1) |
| <span id="i2"></span>2 | [Promise.any polyfill](#p2) |
| <span id="i3"></span>3 | [Array.prototype.reduce polyfill](#p3) |
| <span id="i4"></span>4 | [Lodash flatten](#p4) |
| <span id="i5"></span>5 | [Auto-retry for promises](#p5) |
| <span id="i6"></span>6 | [Throttle promises by batching](#p6) |
| <span id="i7"></span>7 | [Debouncing](#p7) |
| <span id="i8"></span>8 | [Throttling](#p8) |
| <span id="i9"></span>9 | [N async tasks in series](#p9) |
| <span id="i10"></span>10 | [Output prediction snippets](#p10) |
| <span id="i11"></span>11 | [Object vs Map](#p11) |
| <span id="i12"></span>12 | [PATCH vs PUT](#p12) |
| <span id="i13"></span>13 | [Debounce vs Throttle](#p13) |
| <span id="i14"></span>14 | [JavaScript Engine](#p14) |
| <span id="i15"></span>15 | [Event Loop & Microtask Queue](#p15) |
| <span id="i16"></span>16 | [Virtual DOM](#p16) |
| <span id="i17"></span>17 | [React keys](#p17) |
| <span id="i18"></span>18 | [useState internals](#p18) |
| <span id="i19"></span>19 | [Basic useState implementation](#p19) |
| <span id="i20"></span>20 | [React Portals](#p20) |
| <span id="i21"></span>21 | [Error Boundaries](#p21) |
| <span id="i22"></span>22 | [Memoization in React](#p22) |
| <span id="i23"></span>23 | [SSR vs CSR](#p23) |
| <span id="i24"></span>24 | [Module Federation](#p24) |
| <span id="i25"></span>25 | [Micro-Frontend Architecture](#p25) |
| <span id="i26"></span>26 | [SSR for SEO](#p26) |
| <span id="i27"></span>27 | [tabIndex & tab order](#p27) |
| <span id="i28"></span>28 | [Event Capturing & Bubbling](#p28) |
| <span id="i29"></span>29 | [Override toString on String.prototype](#p29) |
| <span id="i30"></span>30 | [Memory leaks in React](#p30) |
| <span id="i31"></span>31 | [Measure React performance](#p31) |
| <span id="i32"></span>32 | [OAuth](#p32) |
| <span id="i33"></span>33 | [SSO](#p33) |
| <span id="i34"></span>34 | [REST API methods](#p34) |
| <span id="i35"></span>35 | [Functional Programming](#p35) |
| <span id="i36"></span>36 | [Microservices](#p36) |
| <span id="i37"></span>37 | [Build a tool like CRA](#p37) |
| <span id="i38"></span>38 | [Reusable UI components](#p38) |

---

<a id="p1"></a>

## 1. Implement Promise.all polyfill

### Theory

`Promise.all` takes an iterable of promises (or values) and returns a **single promise** that resolves when **all** inputs resolve, with results in the **same order** as inputs. If **any** promise rejects, the entire operation rejects immediately with that error.

It is the standard pattern for parallel async work where every result is required — like loading user profile, permissions, and preferences before rendering a dashboard.

### Pros & Cons

| Pros                                        | Cons                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| Parallel execution — faster than sequential | Fails entirely if one request fails                                    |
| Preserves result order                      | No partial results on failure                                          |
| Simple mental model                         | All requests run even after first failure (until rejection propagates) |

### Real-Life Example

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("promises must be an array"));
    }

    const results = [];
    let completed = 0;
    const len = promises.length;

    if (len === 0) return resolve([]);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          results[index] = value;
          completed++;
          if (completed === len) resolve(results);
        })
        .catch(reject);
    });
  });
}

// Real-life: Load checkout page data in parallel
async function loadCheckoutPage(userId) {
  const [cart, addresses, paymentMethods] = await promiseAll([
    fetch(`/api/cart/${userId}`).then((r) => r.json()),
    fetch(`/api/addresses/${userId}`).then((r) => r.json()),
    fetch(`/api/payments/${userId}`).then((r) => r.json()),
  ]);
  return { cart, addresses, paymentMethods };
}
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Implement Promise.any polyfill

### Theory

`Promise.any` takes an iterable of promises and returns a promise that resolves with the **first fulfilled** result. It only rejects if **all** promises reject — with an `AggregateError` containing all rejection reasons.

Use it when you have multiple fallback sources and only need **one success** — CDN mirrors, redundant API endpoints, or fastest-wins scenarios.

### Pros & Cons

| Pros                                  | Cons                                    |
| ------------------------------------- | --------------------------------------- |
| Resilient — one success is enough     | Waits for all to fail before rejecting  |
| Great for redundancy / racing sources | All requests still consume bandwidth    |
| Ignores individual failures           | No built-in timeout (must add manually) |

### Real-Life Example

```javascript
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    const errors = [];
    let rejectedCount = 0;

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(resolve)
        .catch((err) => {
          errors[index] = err;
          rejectedCount++;
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}

// Real-life: Fetch image from fastest CDN mirror
async function loadProductImage(productId) {
  const imageUrl = await promiseAny([
    fetch(`https://cdn1.example.com/images/${productId}`),
    fetch(`https://cdn2.example.com/images/${productId}`),
    fetch(`https://cdn3.example.com/images/${productId}`),
  ]);
  return imageUrl.blob();
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Implement Array.prototype.reduce polyfill

### Theory

`Array.prototype.reduce` executes a **reducer function** on each element, carrying an **accumulator** from left to right, and returns a single final value. It is the most flexible array method — it can implement `map`, `filter`, `flat`, and more.

The reducer receives `(accumulator, currentValue, index, array)` and must return the next accumulator.

### Pros & Cons

| Pros                                            | Cons                                                        |
| ----------------------------------------------- | ----------------------------------------------------------- |
| Extremely versatile — one method, many patterns | Harder to read than `map`/`filter` for beginners            |
| No intermediate arrays (unlike chaining)        | Easy to write inefficient reducers                          |
| Works on sparse arrays with proper checks       | Cannot short-circuit early (unlike `for` loop with `break`) |

### Real-Life Example

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  if (this == null) throw new TypeError("Array is null or undefined");
  if (typeof callback !== "function")
    throw new TypeError(callback + " is not a function");

  const arr = Object(this);
  const len = arr.length >>> 0;
  let accumulator;
  let startIndex = 0;

  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    while (startIndex < len && !(startIndex in arr)) startIndex++;
    if (startIndex >= len) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = arr[startIndex++];
  }

  for (let i = startIndex; i < len; i++) {
    if (i in arr) {
      accumulator = callback(accumulator, arr[i], i, arr);
    }
  }

  return accumulator;
};

// Real-life: Calculate total order value with tax and discounts
const order = [
  { name: "Biryani", price: 299, qty: 2 },
  { name: "Naan", price: 49, qty: 4 },
];

const total = order.myReduce((sum, item) => sum + item.price * item.qty, 0);
// 299*2 + 49*4 = 794
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Implement Lodash's flatten method

### Theory

Lodash's `flatten` converts a **nested array** into a flatter structure. `flatten(array)` flattens **one level deep**. `flattenDeep(array)` flattens **all levels** recursively.

This is common when APIs return nested category trees, nested form field groups, or deeply nested menu structures that need a flat list for rendering or search.

### Pros & Cons

| Pros                                          | Cons                                                      |
| --------------------------------------------- | --------------------------------------------------------- |
| Simplifies nested data for UI rendering       | Loses structural hierarchy unless you keep depth metadata |
| Enables flat search/filter across nested data | Deep recursion can hit stack limits on very deep nesting  |
| Native `flat(Infinity)` exists in modern JS   | `flat` creates a new array (memory cost)                  |

### Real-Life Example

```javascript
function flatten(arr, depth = 1) {
  if (!Array.isArray(arr)) return arr;

  return depth > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val),
        [],
      )
    : arr.slice();
}

function flattenDeep(arr) {
  return flatten(arr, Infinity);
}

// Real-life: Flatten nested menu categories for search autocomplete
const menu = [
  "Home",
  ["Food", ["North Indian", ["Biryani", "Kebab"]], "South Indian"],
  ["Drinks", "Desserts"],
];

const searchableItems = flattenDeep(menu);
// ["Home", "Food", "North Indian", "Biryani", "Kebab", "South Indian", "Drinks", "Desserts"]
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Implement auto-retry for promises

### Theory

**Auto-retry** wraps an async operation to automatically re-attempt on failure, typically with **exponential backoff** and optional **jitter**. This handles transient failures — network blips, 503 errors, rate limits — without user intervention.

Key parameters: max retries, base delay, backoff multiplier, which errors are retryable.

### Pros & Cons

| Pros                                   | Cons                                            |
| -------------------------------------- | ----------------------------------------------- |
| Improves reliability on flaky networks | Can amplify load on failing servers             |
| Better UX — fewer visible errors       | Non-idempotent POST requests can duplicate data |
| Standard pattern in production systems | Needs careful error classification              |

### Real-Life Example

```javascript
async function retry(fn, { retries = 3, delay = 1000, backoff = 2 } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;

      const wait = delay * Math.pow(backoff, attempt) + Math.random() * 100;
      await new Promise((r) => setTimeout(r, wait));
    }
  }

  throw lastError;
}

// Real-life: Retry payment status check after checkout
async function checkPaymentStatus(orderId) {
  return retry(
    () =>
      fetch(`/api/orders/${orderId}/status`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    { retries: 5, delay: 500, backoff: 2 },
  );
}
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Throttle promises by batching

### Theory

**Batching promises** groups multiple concurrent requests into controlled batches to avoid overwhelming the server or hitting rate limits. Instead of firing 1000 API calls at once, you process them in chunks of N with optional delay between batches.

This is essential for bulk imports, mass notifications, or syncing large datasets.

### Pros & Cons

| Pros                                    | Cons                                   |
| --------------------------------------- | -------------------------------------- |
| Prevents server overload and 429 errors | Slower total completion time           |
| Predictable resource usage              | More complex code than fire-and-forget |
| Respects API rate limits                | Batch size tuning required per API     |

### Real-Life Example

```javascript
async function batchPromises(tasks, batchSize = 5, delayMs = 200) {
  const results = [];

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((task) => task()));
    results.push(...batchResults);

    if (i + batchSize < tasks.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return results;
}

// Real-life: Send push notifications to 10,000 users in batches
async function notifyUsers(userIds, message) {
  const tasks = userIds.map(
    (id) => () =>
      fetch("/api/notify", {
        method: "POST",
        body: JSON.stringify({ userId: id, message }),
      }),
  );

  return batchPromises(tasks, 50, 100); // 50 at a time, 100ms between batches
}
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Debouncing implementation

### Theory

**Debouncing** delays execution of a function until after a specified pause in triggering events. If the event fires again before the delay expires, the timer resets. The function runs only once the user **stops** the action.

Classic use: search-as-you-type, resize-end handlers, auto-save on form changes.

### Pros & Cons

| Pros                                       | Cons                                              |
| ------------------------------------------ | ------------------------------------------------- |
| Reduces API calls dramatically             | Adds perceived latency (waits for pause)          |
| Prevents expensive work on every keystroke | Can feel unresponsive if delay is too long        |
| Simple to implement                        | May skip intermediate states user expected to see |

### Real-Life Example

```javascript
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Real-life: Restaurant search on Zomato-style app
const searchRestaurants = debounce(async (query) => {
  const res = await fetch(`/api/restaurants?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  renderResults(data);
}, 300);

// User types "pizza" → only 1 API call after they stop typing for 300ms
document.getElementById("search").addEventListener("input", (e) => {
  searchRestaurants(e.target.value);
});
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Throttling implementation

### Theory

**Throttling** ensures a function executes **at most once per time window**, regardless of how many times the event fires. The first call runs immediately; subsequent calls within the window are ignored until the window expires.

Classic use: scroll handlers, mouse-move tracking, rate-limiting button clicks.

### Pros & Cons

| Pros                                                  | Cons                                                  |
| ----------------------------------------------------- | ----------------------------------------------------- |
| Guarantees regular execution during continuous events | May miss the final event (unless trailing edge added) |
| Protects performance on high-frequency events         | Less precise than debounce for "wait until done"      |
| Immediate first response                              | Can drop important intermediate values                |

### Real-Life Example

```javascript
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

// Real-life: Track scroll depth for analytics (max once per 200ms)
const trackScrollDepth = throttle(() => {
  const depth = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
  );
  analytics.track("scroll_depth", { depth });
}, 200);

window.addEventListener("scroll", trackScrollDepth);
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Execute N callback-based async tasks in series

### Theory

Running async tasks **in series** means each task starts only after the previous one completes. Unlike `Promise.all` (parallel), series execution is needed when tasks depend on each other or when the resource (API, DB) cannot handle concurrency.

The classic pattern chains callbacks or uses `reduce` with promises.

### Pros & Cons

| Pros                           | Cons                                |
| ------------------------------ | ----------------------------------- |
| Safe for dependent operations  | Slower than parallel                |
| Respects rate limits naturally | One failure blocks the entire chain |
| Predictable order              | Harder to cancel mid-chain          |

### Real-Life Example

```javascript
function runSeries(tasks, finalCallback) {
  let index = 0;
  const results = [];

  function next(err, result) {
    if (err) return finalCallback(err);
    if (result !== undefined) results.push(result);

    if (index >= tasks.length) return finalCallback(null, results);

    const task = tasks[index++];
    task(next);
  }

  next();
}

// Real-life: Multi-step onboarding — each step depends on previous
runSeries(
  [
    (cb) => createAccount(userData, cb),
    (cb) => sendVerificationEmail(userData.email, cb),
    (cb) => setupDefaultPreferences(userData.id, cb),
    (cb) => redirectToDashboard(userData.id, cb),
  ],
  (err, results) => {
    if (err) console.error("Onboarding failed:", err);
    else console.log("Onboarding complete:", results);
  },
);

// Modern promise version
function runSeriesPromises(tasks) {
  return tasks.reduce(
    (chain, task) =>
      chain.then((results) => task().then((result) => [...results, result])),
    Promise.resolve([]),
  );
}
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Output prediction for tricky JavaScript snippets

### Theory

Output prediction questions test your understanding of **hoisting**, **closures**, **this binding**, **type coercion**, **event loop ordering**, and **reference vs value**. Interviewers want you to explain **why**, not just guess the output.

### Pros & Cons of these questions in interviews

| Pros                                | Cons                                        |
| ----------------------------------- | ------------------------------------------- |
| Reveals deep language understanding | Can feel academic vs real-world             |
| Fast to ask in live coding          | Some edge cases rarely appear in production |

### Real-Life Example — 12 Tricky Snippets

#### Snippet 1 — Hoisting + TDZ

```javascript
console.log(a);
var a = 1;
console.log(b);
let b = 2;
```

**Output:** `undefined` → **ReferenceError** (b is in TDZ)

**Why:** `var` is hoisted and initialized as `undefined`. `let` is hoisted but not initialized.

---

#### Snippet 2 — Closure in loop

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Output:** `3, 3, 3`

**Why:** `var` is function-scoped; all closures share the same `i` which is 3 after the loop.

---

#### Snippet 3 — Closure with let

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Output:** `0, 1, 2`

**Why:** `let` creates a new binding per iteration.

---

#### Snippet 4 — Event loop order

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

**Output:** `1, 4, 3, 2`

**Why:** Sync first → microtasks (promises) → macrotasks (setTimeout).

---

#### Snippet 5 — typeof null

```javascript
console.log(typeof null);
console.log(null instanceof Object);
```

**Output:** `"object"` → `false`

**Why:** Historical bug — `typeof null` returns `"object"`. `instanceof` checks prototype chain.

---

#### Snippet 6 — Implicit coercion

```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

**Output:** `""` → `"[object Object]"` → `"[object Object]"`

**Why:** `+` with arrays/objects triggers `toString()`.

---

#### Snippet 7 — this in arrow vs regular function

```javascript
const obj = {
  name: "Amit",
  regular() {
    console.log(this.name);
  },
  arrow: () => console.log(this.name),
};
obj.regular();
obj.arrow();
```

**Output:** `"Amit"` → `undefined` (or global name in non-strict)

**Why:** Arrow functions don't have their own `this` — they inherit from enclosing scope.

---

#### Snippet 8 — Promise chaining

```javascript
Promise.resolve(1)
  .then((v) => {
    console.log(v);
    return v + 1;
  })
  .then((v) => {
    console.log(v);
    throw new Error("fail");
  })
  .then((v) => console.log(v))
  .catch((e) => console.log("caught"));
```

**Output:** `1` → `2` → `caught`

**Why:** Thrown error skips next `.then`, goes to `.catch`.

---

#### Snippet 9 — async/await order

```javascript
async function foo() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
console.log("C");
foo();
console.log("D");
```

**Output:** `C, A, D, B`

**Why:** `await` pauses `foo` and schedules resume as microtask after sync code.

---

#### Snippet 10 — Object reference

```javascript
const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n);
```

**Output:** `2`

**Why:** Objects are passed by reference — `a` and `b` point to the same object.

---

#### Snippet 11 — == vs ===

```javascript
console.log(0 == false);
console.log(0 === false);
console.log("" == 0);
console.log(null == undefined);
console.log(null === undefined);
```

**Output:** `true, false, true, true, false`

**Why:** `==` does type coercion; `===` does not.

---

#### Snippet 12 — IIFE + closure

```javascript
(function () {
  try {
    throw new Error("x");
  } catch (e) {
    var e = 2;
    console.log(e);
  }
})();
```

**Output:** `2`

**Why:** `var e` in catch is function-scoped and hoisted, shadowing the catch parameter.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Object vs Map differences in JavaScript

### Theory

Both `Object` and `Map` store key-value pairs, but they differ in key types, iteration, performance, and API design. `Object` is the general-purpose data structure with prototype inheritance. `Map` is a dedicated hash map with any type of key and guaranteed insertion order.

### Pros & Cons

|          | Object                                                     | Map                                                          |
| -------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| **Pros** | JSON-serializable, familiar syntax, literal shorthand      | Any key type, size property, better frequent add/delete perf |
| **Cons** | Keys only string/symbol, prototype pollution risk, no size | Not JSON-serializable, slightly more verbose                 |

### Real-Life Example

```javascript
// Object — config/settings (string keys, JSON-friendly)
const appConfig = {
  apiUrl: "https://api.zomato.com",
  timeout: 5000,
  retries: 3,
};

// Map — caching DOM elements or object-keyed lookups
const elementCache = new Map();
function getCachedElement(node) {
  if (!elementCache.has(node)) {
    elementCache.set(node, {
      height: node.offsetHeight,
      width: node.offsetWidth,
    });
  }
  return elementCache.get(node);
}

// Map — counting occurrences with non-string keys
const requestCounts = new Map();
function trackRequest(requestObj) {
  requestCounts.set(requestObj, (requestCounts.get(requestObj) || 0) + 1);
}
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Difference between PATCH and PUT

### Theory

Both are HTTP methods for updating resources, but they differ in **scope** and **idempotency expectations**.

- **PUT** replaces the **entire resource** with the request body. Missing fields are typically set to null/default.
- **PATCH** applies **partial updates** — only the fields in the request body are changed.

### Pros & Cons

|          | PUT                                              | PATCH                                                     |
| -------- | ------------------------------------------------ | --------------------------------------------------------- |
| **Pros** | Idempotent, simple full replacement semantics    | Bandwidth-efficient, precise partial updates              |
| **Cons** | Must send full resource, risk overwriting fields | Harder to implement correctly, less universally supported |

### Real-Life Example

```http
# PUT — replace entire user profile
PUT /api/users/42
Content-Type: application/json

{
  "name": "Amit Sharma",
  "email": "amit@example.com",
  "phone": "9876543210",
  "address": "Delhi"
}
# If phone was omitted, it gets cleared

# PATCH — update only the phone number
PATCH /api/users/42
Content-Type: application/json

{
  "phone": "9876543210"
}
# name, email, address remain unchanged
```

```javascript
// Frontend usage
await fetch("/api/users/42", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: newPhone }),
});
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. What is the difference between debounce and throttle?

### Theory

Both limit how often a function runs, but with opposite philosophies:

- **Debounce:** "Wait until they **stop**, then run once."
- **Throttle:** "Run at most once per interval, even if they **keep going**."

### Pros & Cons

|              | Debounce                            | Throttle                                            |
| ------------ | ----------------------------------- | --------------------------------------------------- |
| **Best for** | Search input, resize-end, auto-save | Scroll, mousemove, API rate limiting                |
| **Pros**     | Minimizes total executions          | Guarantees regular updates during continuous events |
| **Cons**     | Delays until pause ends             | May miss final state without trailing option        |

### Real-Life Example

```
User typing "pizza" in search box:
  Debounce (300ms):  p-i-z-z-a → wait 300ms → 1 API call
  Throttle (300ms):  p → call, (300ms) z → call, (300ms) a → call

User scrolling a feed:
  Debounce:          No analytics until scroll STOPS (bad — miss scroll data)
  Throttle (200ms):    Analytics fires every 200ms during scroll (good)
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. How does the JavaScript Engine work?

### Theory

A JavaScript engine (V8 in Chrome/Node, SpiderMonkey in Firefox, JavaScriptCore in Safari) compiles and executes JS code. Modern engines use a **multi-tier compilation pipeline**:

1. **Parser** — converts source code into an Abstract Syntax Tree (AST)
2. **Ignition interpreter** — quickly generates bytecode and starts execution
3. **Sparkplug (baseline compiler)** — compiles hot functions to faster baseline machine code
4. **Maglev / TurboFan (optimizing compiler)** — recompiles very hot functions with type specialization
5. **Garbage Collector** — reclaims unreachable memory (generational mark-and-sweep)

### Pros & Cons of JIT compilation

| Pros                              | Cons                                          |
| --------------------------------- | --------------------------------------------- |
| Fast startup (interpret first)    | Deoptimization penalties if types change      |
| Hot code runs near-native speed   | Memory overhead for compiled code caches      |
| Adaptive — optimizes what matters | Hard to predict performance without profiling |

### Real-Life Example

```javascript
// Engine starts in interpreter (fast startup)
function add(a, b) {
  return a + b;
}

// Called 10,000 times with numbers → TurboFan optimizes for numbers
for (let i = 0; i < 10000; i++) add(i, i);

// Called once with string → DEOPTIMIZATION (bailout to slower path)
add("hello", "world"); // still works, but function may re-optimize
```

**Takeaway for interviews:** Write consistent types in hot loops. Avoid mixing types in functions called millions of times.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. What is the Event Loop and how does the Microtask Queue work?

### Theory

JavaScript is **single-threaded** — one call stack. The **event loop** coordinates execution between the call stack, **macrotask queue** (tasks), and **microtask queue** (jobs).

**Execution order:**

1. Run all synchronous code (call stack)
2. Drain **all microtasks** (promises, `queueMicrotask`, `MutationObserver`)
3. Run **one macrotask** (`setTimeout`, `setInterval`, I/O, UI events)
4. Repeat

### Pros & Cons

| Pros                                      | Cons                                        |
| ----------------------------------------- | ------------------------------------------- |
| Simple concurrency model — no locks       | Long sync code blocks everything            |
| Microtasks enable fast promise resolution | Microtask starvation if queue never empties |
| Non-blocking I/O via callbacks            | "Callback hell" without async/await         |

### Real-Life Example

```javascript
console.log("1: sync");

setTimeout(() => console.log("4: macrotask"), 0);

Promise.resolve()
  .then(() => console.log("3: microtask 1"))
  .then(() => console.log("3b: microtask 2"));

queueMicrotask(() => console.log("3c: microtask 3"));

console.log("2: sync");

// Output: 1: sync → 2: sync → 3: microtask 1 → 3c: microtask 3 → 3b: microtask 2 → 4: macrotask
```

**Real-life impact:** If you `await` in a loop without yielding, you starve the UI. Batch work with `setTimeout(0)` or `requestAnimationFrame` for long computations.

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Explain Virtual DOM and its comparison mechanism

### Theory

The **Virtual DOM** is a lightweight JavaScript representation of the real DOM tree. React creates a new VDOM tree on each render, compares it with the previous tree (**diffing**), and computes the minimum set of DOM mutations needed.

**Diffing rules:**

1. Different element **types** → tear down old subtree, build new one
2. Same type → update **props** only, recurse into children
3. **Keys** identify list items across renders for efficient reordering

### Pros & Cons

| Pros                                                   | Cons                                            |
| ------------------------------------------------------ | ----------------------------------------------- |
| Declarative UI — you describe state, React patches DOM | Abstraction overhead vs direct DOM manipulation |
| Batched updates — fewer DOM operations                 | Not always faster than hand-optimized DOM       |
| Cross-browser consistency                              | Diffing large trees has CPU cost                |

### Real-Life Example

```jsx
// Before render: <ul><li key="a">Apple</li><li key="b">Banana</li></ul>
// After render:  <ul><li key="b">Banana</li><li key="a">Apple</li></ul>

// React sees same types (ul, li), same keys (a, b)
// → Only reorders DOM nodes, does NOT destroy/recreate <li> elements
// → Component state inside each <li> is preserved

// Without keys (or index keys), inserting at top causes:
// → React thinks every item changed → full re-render of all children
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Why do keys matter in React and how do they improve performance?

### Theory

**Keys** are stable identifiers that tell React which items in a list correspond between renders. They enable React to **match**, **move**, **insert**, or **delete** elements efficiently instead of re-creating the entire list.

Without stable keys, React falls back to index-based matching, which breaks when items are inserted, deleted, or reordered.

### Pros & Cons

| Good keys (unique IDs)              | Bad keys (array index)                 |
| ----------------------------------- | -------------------------------------- |
| Preserve component state on reorder | State "slides" to wrong item on delete |
| Minimal DOM operations              | Unnecessary unmount/remount            |
| Correct animations                  | Broken enter/exit transitions          |

### Real-Life Example

```jsx
// ❌ Bad — index keys on a mutable todo list
{
  todos.map((todo, index) => <TodoItem key={index} todo={todo} />);
}
// Delete first todo → every item below gets new key → all re-render, state bleeds

// ✅ Good — stable ID from database
{
  todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);
}
// Delete first todo → only that item unmounts, rest stay intact
```

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. Explain how useState works internally

### Theory

`useState` stores state on the **Fiber node** associated with the component. Each hook call creates a **hook object** linked in a singly-linked list on the Fiber (`memoizedState`).

On each render:

1. React walks the hook list in the **same order** hooks were called
2. Returns the current `memoizedState` value
3. The setter enqueues an update on the Fiber's update queue
4. React schedules a re-render; during the next render, the hook returns the new value

**Rules of Hooks** exist because hook order must be identical every render.

### Pros & Cons

| Pros                             | Cons                              |
| -------------------------------- | --------------------------------- |
| Simple API for local state       | State updates are async (batched) |
| Triggers re-render automatically | Cannot call conditionally         |
| Batching improves performance    | Stale closure if deps not managed |

### Real-Life Example

```jsx
function Counter() {
  const [count, setCount] = useState(0); // Hook #1 on Fiber
  const [name, setName] = useState(""); // Hook #2 on Fiber

  // Internally on Fiber:
  // memoizedState → { memoizedState: count, queue: [updates], next: hook2 }
  // hook2 → { memoizedState: name, queue: [], next: null }

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Implement a basic version of useState

### Theory

A minimal `useState` implementation uses a module-level array to store state per hook index, incrementing the index on each call. A `render` function re-executes the component. This mirrors React's hook linked list but simplified for learning.

### Real-Life Example

```javascript
let hooks = [];
let hookIndex = 0;

function useState(initialValue) {
  const currentIndex = hookIndex;

  if (hooks[currentIndex] === undefined) {
    hooks[currentIndex] =
      typeof initialValue === "function" ? initialValue() : initialValue;
  }

  const setState = (newValue) => {
    const nextValue =
      typeof newValue === "function" ? newValue(hooks[currentIndex]) : newValue;

    if (Object.is(hooks[currentIndex], nextValue)) return; // bailout

    hooks[currentIndex] = nextValue;
    hookIndex = 0; // reset for re-render
    render(); // trigger re-render
  };

  hookIndex++;
  return [hooks[currentIndex], setState];
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Guest");
  console.log(`Hello ${name}, count: ${count}`);
}

function render() {
  hookIndex = 0;
  Counter();
}

render();
// setCount(1) → re-renders with updated count
```

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. What are React Portals? How are modals mounted using them?

### Theory

**Portals** let you render children into a **DOM node outside the parent component's DOM hierarchy** while keeping the React tree (context, events) connected. `ReactDOM.createPortal(child, container)` is the API.

Modals use portals to render at `document.body` level, escaping `overflow: hidden`, `z-index` stacking contexts, and parent CSS transforms.

### Pros & Cons

| Pros                                          | Cons                                         |
| --------------------------------------------- | -------------------------------------------- |
| Escapes parent CSS constraints                | Focus management must be handled manually    |
| Proper z-index layering for overlays          | Screen readers need `aria-modal`, focus trap |
| Event bubbling still works through React tree | Portal target must exist in DOM              |

### Real-Life Example

```jsx
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root"), // or document.body
  );
}

// Usage in a deeply nested component
function ProductPage() {
  const [showCart, setShowCart] = useState(false);
  return (
    <div style={{ overflow: "hidden" }}>
      <button onClick={() => setShowCart(true)}>View Cart</button>
      <Modal isOpen={showCart} onClose={() => setShowCart(false)}>
        <CartItems />
      </Modal>
    </div>
  );
}
```

---


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

## 21. What are Error Boundaries in React?

### Theory

**Error Boundaries** are React components that **catch JavaScript errors in their child component tree** during rendering, in lifecycle methods, and in constructors. They display a fallback UI instead of crashing the entire app.

They do **NOT** catch: event handler errors, async errors, SSR errors, or errors in the boundary itself.

### Pros & Cons

| Pros                                  | Cons                                           |
| ------------------------------------- | ---------------------------------------------- |
| Isolates failures — app stays usable  | Class components only (no hook equivalent yet) |
| Better UX with fallback UI            | Doesn't catch event handler or async errors    |
| Can log errors to monitoring services | Must be placed intentionally in tree           |

### Real-Life Example

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Send to Sentry / Datadog
    logErrorToService(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Real-life: Wrap each route independently
function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/orders"
          element={
            <ErrorBoundary>
              <OrdersPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/profile"
          element={
            <ErrorBoundary>
              <ProfilePage />
            </ErrorBoundary>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}
```

---


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

## 22. How does memoization work in React?

### Theory

**Memoization** caches the result of a computation or component render and returns the cached version when inputs haven't changed. React provides three levels:

| Tool          | Caches             | Skips                                          |
| ------------- | ------------------ | ---------------------------------------------- |
| `useMemo`     | Computed value     | Re-computation                                 |
| `useCallback` | Function reference | New function creation                          |
| `React.memo`  | Component render   | Re-render if props unchanged (shallow compare) |

React compares previous and next props/state using `Object.is` (shallow equality).

### Pros & Cons

| Pros                            | Cons                                         |
| ------------------------------- | -------------------------------------------- |
| Avoids expensive recalculations | Memory overhead for cached values            |
| Prevents child re-renders       | Shallow compare misses deep object changes   |
| Profile-guided optimization     | Over-memoization adds complexity for no gain |

### Real-Life Example

```jsx
function OrderSummary({ orders, taxRate }) {
  // useMemo — expensive aggregation
  const total = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const tax = useMemo(() => total * taxRate, [total, taxRate]);

  return <div>Total: ₹{total + tax}</div>;
}

const OrderRow = React.memo(function OrderRow({ order, onCancel }) {
  return (
    <div>
      {order.name} — ₹{order.amount}
      <button onClick={() => onCancel(order.id)}>Cancel</button>
    </div>
  );
});

function OrderList({ orders }) {
  const handleCancel = useCallback((id) => {
    cancelOrder(id);
  }, []); // stable reference → OrderRow won't re-render unnecessarily

  return orders.map((o) => (
    <OrderRow key={o.id} order={o} onCancel={handleCancel} />
  ));
}
```

---


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

## 23. SSR vs CSR with examples and use-cases

### Theory

- **CSR (Client-Side Rendering):** Server sends empty HTML + JS bundle. Browser downloads JS, executes it, fetches data, renders UI.
- **SSR (Server-Side Rendering):** Server runs React, generates full HTML with data, sends to browser. Browser hydrates interactivity on top.

### Pros & Cons

|              | CSR                                                 | SSR                                                |
| ------------ | --------------------------------------------------- | -------------------------------------------------- |
| **Pros**     | Rich interactivity, simpler hosting, SPA navigation | Fast FCP, SEO-friendly, works without JS           |
| **Cons**     | Slow initial load, poor SEO without extra work      | Server cost, hydration complexity, TTFB dependency |
| **Best for** | Dashboards, admin panels, authenticated apps        | Marketing pages, e-commerce listings, blogs        |

### Real-Life Example

```
CSR — Zomato order tracking (authenticated, post-login):
  Browser → GET /app → empty <div id="root"> → download 500KB JS
  → fetch /api/orders → render tracking UI
  → User sees spinner for 2-3 seconds

SSR — Zomato restaurant listing (SEO-critical):
  Browser → GET /restaurants/delhi
  → Server runs React → fetches restaurant data
  → Returns full HTML with restaurant cards
  → User sees content in <1s → JS hydrates for filters/sort
```

```jsx
// Next.js SSR example
export async function getServerSideProps() {
  const restaurants = await fetchRestaurants("delhi");
  return { props: { restaurants } };
}

export default function RestaurantPage({ restaurants }) {
  return <RestaurantList data={restaurants} />;
}
```

---


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

## 24. What is Module Federation?

### Theory

**Module Federation** (Webpack 5) allows multiple independently built and deployed applications to **share code at runtime**. One app can dynamically import components/modules from another without rebuilding.

A **host** app consumes remote modules. A **remote** app exposes modules. Shared dependencies (React) are deduplicated.

### Pros & Cons

| Pros                                  | Cons                                         |
| ------------------------------------- | -------------------------------------------- |
| Independent deploys per team          | Runtime coupling — remote down = host breaks |
| Share components without npm packages | Complex webpack configuration                |
| Runtime code sharing                  | Version mismatch risks for shared deps       |

### Real-Life Example

```javascript
// Remote app (webpack.config.js) — "checkout" team
new ModuleFederationPlugin({
  name: "checkout",
  filename: "remoteEntry.js",
  exposes: {
    "./CheckoutWidget": "./src/CheckoutWidget",
  },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});

// Host app (webpack.config.js) — "main" team
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    checkout: "checkout@https://checkout.example.com/remoteEntry.js",
  },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});

// Host consumes remote component
const CheckoutWidget = React.lazy(() => import("checkout/CheckoutWidget"));
```

---


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

## 25. What is Micro-Frontend Architecture?

### Theory

**Micro-frontends** apply microservices principles to the frontend — splitting a large app into **smaller, independently deployable frontend applications** owned by different teams. Each micro-frontend handles a business domain (search, checkout, profile).

Integration approaches: Module Federation, iframes, Web Components, single-spa orchestrator.

### Pros & Cons

| Pros                                | Cons                                       |
| ----------------------------------- | ------------------------------------------ |
| Team autonomy — independent deploys | Inconsistent UX across teams               |
| Technology flexibility per team     | Shared state and routing complexity        |
| Incremental migration from monolith | Performance overhead (multiple bundles)    |
| Fault isolation                     | Duplicated dependencies without federation |

### Real-Life Example

```
Zomato-style micro-frontend architecture:

┌─────────────────────────────────────────────┐
│  Shell App (routing, auth, layout, nav)     │
├──────────┬──────────┬──────────┬────────────┤
│ Search   │ Restaurant│ Checkout │ Profile   │
│ Team     │ Team      │ Team     │ Team      │
│ (React)  │ (React)   │ (Vue*)   │ (React)   │
└──────────┴──────────┴──────────┴────────────┘
     ↑ Module Federation loads each at runtime
```

---


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

## 26. Server-Side Rendering techniques to improve SEO

### Theory

Search engine crawlers need **meaningful HTML content** to index pages. SSR techniques ensure crawlers see full content without executing JavaScript.

Key techniques: SSR, SSG (Static Site Generation), ISR (Incremental Static Regeneration), dynamic rendering, structured data, meta tags.

### Pros & Cons

| Technique         | Pros                       | Cons                           |
| ----------------- | -------------------------- | ------------------------------ |
| SSR               | Always fresh, SEO-friendly | Server load on every request   |
| SSG               | Fastest, cheapest hosting  | Stale until rebuild            |
| ISR               | Fresh + fast               | Complexity, cache invalidation |
| Dynamic rendering | Serves bots HTML, users JS | Cloaking risk if misused       |

### Real-Life Example

```jsx
// Next.js — SSR with meta tags for SEO
export async function generateMetadata({ params }) {
  const restaurant = await fetchRestaurant(params.id);
  return {
    title: `${restaurant.name} — Order Online | Zomato`,
    description: restaurant.cuisine + " restaurant in " + restaurant.area,
    openGraph: {
      images: [restaurant.image],
    },
  };
}

// Structured data for Google rich results
function RestaurantPage({ restaurant }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    address: restaurant.address,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: restaurant.rating,
      reviewCount: restaurant.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{restaurant.name}</h1>
      {/* Full content in HTML — visible to crawlers */}
    </>
  );
}
```

---


<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

## 27. How to control tab order in DOM (explain tabIndex)

### Theory

**Tab order** determines which element receives focus when the user presses Tab. By default, focusable elements (links, buttons, inputs) are tabbed in **DOM order**.

`tabIndex` controls this:

- `tabIndex="0"` — element is focusable and in natural tab order
- `tabIndex="-1"` — focusable programmatically (`focus()`) but **not** in tab order
- `tabIndex="1+"` — focusable and tabbed **before** natural order (avoid — confuses users)

### Pros & Cons

| Approach                          | Pros                                 | Cons                                   |
| --------------------------------- | ------------------------------------ | -------------------------------------- |
| Natural DOM order                 | Accessible by default                | Layout changes can break logical order |
| `tabIndex={0}` on custom elements | Makes divs/spans keyboard-accessible | Must add keyboard handlers too         |
| `tabIndex={-1}` for modals        | Focus trap without tab pollution     | Requires focus management code         |
| Positive tabIndex                 | —                                    | **Never use** — unpredictable order    |

### Real-Life Example

```jsx
function CheckoutModal({ isOpen, onClose }) {
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (isOpen) firstFocusableRef.current?.focus();
  }, [isOpen]);

  const handleTabKey = (e) => {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === firstFocusableRef.current) {
      e.preventDefault();
      lastFocusableRef.current?.focus();
    } else if (
      !e.shiftKey &&
      document.activeElement === lastFocusableRef.current
    ) {
      e.preventDefault();
      firstFocusableRef.current?.focus();
    }
  };

  return (
    <div role="dialog" aria-modal="true" onKeyDown={handleTabKey}>
      <button ref={firstFocusableRef} tabIndex={0}>
        Continue
      </button>
      <button tabIndex={0}>Cancel</button>
      <button ref={lastFocusableRef} tabIndex={0} onClick={onClose}>
        Close
      </button>
    </div>
  );
}

// Skip navigation link (accessibility best practice)
<a href="#main-content" className="sr-only focus:not-sr-only" tabIndex={0}>
  Skip to main content
</a>;
```

---


<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

## 28. What is Event Capturing and Bubbling

### Theory

When an event fires on a DOM element, it travels in **three phases**:

1. **Capturing phase** — event travels from `window` → target (top down)
2. **Target phase** — event reaches the target element
3. **Bubbling phase** — event travels from target → `window` (bottom up)

By default, event listeners run in the **bubbling phase**. Use `{ capture: true }` or `addEventListener(el, fn, true)` for capturing.

`event.stopPropagation()` stops further propagation. `event.stopImmediatePropagation()` also prevents other listeners on the same element.

### Pros & Cons

|              | Capturing                                    | Bubbling                           |
| ------------ | -------------------------------------------- | ---------------------------------- |
| **Pros**     | Intercept events before children handle them | Natural default, event delegation  |
| **Cons**     | Less intuitive, rarely needed                | Children can block parent handlers |
| **Use case** | Focus management, analytics wrappers         | Delegated click handlers on lists  |

### Real-Life Example

```html
<div id="grandparent">
  <div id="parent">
    <button id="child">Click me</button>
  </div>
</div>
```

```javascript
document
  .getElementById("grandparent")
  .addEventListener("click", () => console.log("grandparent bubble"));
document
  .getElementById("parent")
  .addEventListener("click", () => console.log("parent bubble"));
document
  .getElementById("child")
  .addEventListener("click", () => console.log("child target"));

// Click button → Output: child target → parent bubble → grandparent bubble

// Event delegation (bubbling) — real-life pattern
document.getElementById("menu").addEventListener("click", (e) => {
  const item = e.target.closest("[data-action]");
  if (!item) return;
  handleAction(item.dataset.action); // one listener for 100 menu items
});
```

---


<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

## 29. How to override toString on String.prototype

### Theory

`String.prototype.toString` returns the string value. You can override it, but **mutating built-in prototypes is strongly discouraged** — it breaks libraries, causes conflicts, and is considered bad practice. Prefer utility functions or wrapper classes instead.

If asked in an interview, show you know how but also know why not to.

### Pros & Cons

| Pros                   | Cons                                              |
| ---------------------- | ------------------------------------------------- |
| Global behavior change | Breaks other libraries expecting default behavior |
| Theoretical knowledge  | Security risk in shared environments              |
| —                      | Hard to debug, non-standard                       |

### Real-Life Example

```javascript
// ❌ Don't do this in production
String.prototype.toString = function () {
  return `🎉 ${this.valueOf()}`;
};

console.log("hello".toString()); // "🎉 hello"
// Breaks: JSON.stringify, template literals, comparisons

// ✅ Better approach — utility function
function displayString(str) {
  return `🎉 ${str}`;
}

// ✅ Or a wrapper class
class DisplayString {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return `🎉 ${this.value}`;
  }
}
```

---


<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

## 30. What are memory leaks in React and how to detect them?

### Theory

A **memory leak** occurs when memory that is no longer needed is not released. In React, common causes are: uncleared timers/subscriptions, detached DOM nodes held in closures, growing caches, and event listeners not removed on unmount.

### Pros & Cons of detection tools

| Tool                       | Pros                           | Cons                          |
| -------------------------- | ------------------------------ | ----------------------------- |
| Chrome DevTools Memory tab | Heap snapshots, comparison     | Manual, requires reproduction |
| React DevTools Profiler    | Component render counts        | Doesn't show JS heap directly |
| `why-did-you-render`       | Catches unnecessary re-renders | Dev-only, noisy               |
| Sentry / monitoring        | Production leak patterns       | Indirect detection            |

### Real-Life Example

```jsx
// ❌ Memory leak — subscription not cleaned up
function LiveOrderTracker({ orderId }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/orders/${orderId}`);
    ws.onmessage = (e) => setStatus(JSON.parse(e.data).status);
    // Missing cleanup! WebSocket stays open after unmount
  }, [orderId]);

  return <div>Status: {status}</div>;
}

// ✅ Fixed — cleanup on unmount
function LiveOrderTracker({ orderId }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/orders/${orderId}`);
    ws.onmessage = (e) => setStatus(JSON.parse(e.data).status);

    return () => ws.close(); // cleanup
  }, [orderId]);

  return <div>Status: {status}</div>;
}
```

**Detection steps:**

1. Chrome DevTools → Memory → Take heap snapshot
2. Perform the action (navigate away from component)
3. Force GC → Take another snapshot
4. Compare — look for detached DOM trees or growing object counts

---


<p><a href="#i30">Back to index</a></p>

<a id="p31"></a>

## 31. How to measure performance in a React application?

### Theory

React performance measurement spans **lab metrics** (controlled environment) and **field metrics** (real users). Key areas: render performance, bundle size, network timing, and Core Web Vitals.

### Pros & Cons

| Tool                    | Pros                             | Cons                     |
| ----------------------- | -------------------------------- | ------------------------ |
| React DevTools Profiler | Flame charts, render duration    | Dev environment only     |
| Lighthouse              | Comprehensive audit, CI-friendly | Lab data, not real users |
| Web Vitals (RUM)        | Real user data                   | Needs instrumentation    |
| Bundle analyzer         | Finds large dependencies         | Doesn't measure runtime  |

### Real-Life Example

```jsx
import { Profiler } from "react";
import { onLCP, onINP, onCLS } from "web-vitals";

// 1. React Profiler — measure component render time
function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 16) {
    // longer than one frame
    console.warn(`Slow render: ${id} took ${actualDuration}ms`);
  }
}

<Profiler id="RestaurantList" onRender={onRenderCallback}>
  <RestaurantList />
</Profiler>;

// 2. Web Vitals in production
onLCP((metric) => analytics.track("LCP", metric));
onINP((metric) => analytics.track("INP", metric));
onCLS((metric) => analytics.track("CLS", metric));

// 3. Bundle analysis (package.json script)
// "analyze": "source-map-explorer build/static/js/*.js"
```

**Performance budget example:**

- Initial JS bundle: < 200KB gzipped
- LCP: < 2.5s on 4G
- Component render: < 16ms (60fps)

---


<p><a href="#i31">Back to index</a></p>

<a id="p32"></a>

## 32. What is OAuth and how does it work?

### Theory

**OAuth 2.0** is an **authorization framework** that lets a user grant a third-party application **limited access** to their resources without sharing their password. It defines roles: **Resource Owner** (user), **Client** (your app), **Authorization Server** (Google, GitHub), **Resource Server** (API).

Common flows:

- **Authorization Code** (most secure, used by web apps)
- **PKCE** (extension for SPAs and mobile)
- **Client Credentials** (machine-to-machine)

### Pros & Cons

| Pros                                       | Cons                                     |
| ------------------------------------------ | ---------------------------------------- |
| No password sharing with third parties     | Complex to implement correctly           |
| Granular scopes (read email, not password) | Token management overhead                |
| Industry standard                          | Misconfiguration leads to security holes |

### Real-Life Example

```
"Sign in with Google" on a food delivery app:

1. User clicks "Sign in with Google"
2. App redirects to Google Authorization Server:
   GET https://accounts.google.com/o/oauth2/v2/auth
     ?client_id=YOUR_APP_ID
     &redirect_uri=https://app.com/callback
     &response_type=code
     &scope=email profile
     &state=random_csrf_token

3. User logs in and grants permission on Google's page
4. Google redirects back:
   https://app.com/callback?code=AUTH_CODE&state=random_csrf_token

5. Backend exchanges code for tokens (server-side, never in browser):
   POST https://oauth2.googleapis.com/token
     code=AUTH_CODE&client_secret=SECRET&grant_type=authorization_code

6. Backend receives: { access_token, refresh_token, id_token }
7. Backend creates session / JWT for the user in your app
```

---


<p><a href="#i32">Back to index</a></p>

<a id="p33"></a>

## 33. How does SSO work?

### Theory

**Single Sign-On (SSO)** lets a user authenticate **once** and access **multiple applications** without logging in again. It is typically built on top of OAuth 2.0 + **OpenID Connect (OIDC)** or SAML.

The **Identity Provider (IdP)** handles authentication. **Service Providers (SPs)** trust the IdP's tokens.

### Pros & Cons

| Pros                               | Cons                                               |
| ---------------------------------- | -------------------------------------------------- |
| One login for all company apps     | Single point of failure (IdP down = all apps down) |
| Centralized user management        | Complex setup for small teams                      |
| Better security (MFA at IdP level) | Session management across domains is tricky        |

### Real-Life Example

```
Employee logs into company SSO (Okta) once:

1. Employee visits internal-dashboard.company.com
2. No session → redirect to okta.company.com/login
3. Employee enters credentials + MFA on Okta
4. Okta issues SAML assertion / OIDC id_token
5. Dashboard app validates token → creates local session
6. Employee visits hr-portal.company.com
   → Already has Okta session cookie → auto-authenticated
   → No second login required

Frontend's role:
- Redirect to IdP login page
- Handle callback with authorization code
- Store session token (httpOnly cookie, not localStorage)
- Check token expiry and refresh silently
```

---


<p><a href="#i33">Back to index</a></p>

<a id="p34"></a>

## 34. What are REST API methods and their differences?

### Theory

REST (Representational State Transfer) uses HTTP methods to perform CRUD operations on resources identified by URLs. Each method has defined semantics for safety and idempotency.

### Pros & Cons

| Method | Safe | Idempotent | Body     | Use Case         |
| ------ | ---- | ---------- | -------- | ---------------- |
| GET    | ✅   | ✅         | No       | Read resource    |
| POST   | ❌   | ❌         | Yes      | Create resource  |
| PUT    | ❌   | ✅         | Yes      | Replace resource |
| PATCH  | ❌   | ❌\*       | Yes      | Partial update   |
| DELETE | ❌   | ✅         | Optional | Remove resource  |

\*PATCH idempotency depends on implementation

### Real-Life Example

```javascript
// Restaurant API for a food delivery app

// GET — fetch restaurants (safe, cacheable)
const restaurants = await fetch("/api/restaurants?city=delhi").then((r) =>
  r.json(),
);

// POST — create a new order (not idempotent — duplicate = 2 orders)
await fetch("/api/orders", {
  method: "POST",
  body: JSON.stringify({ restaurantId: 42, items: [{ id: 1, qty: 2 }] }),
});

// PUT — replace entire cart
await fetch("/api/cart", {
  method: "PUT",
  body: JSON.stringify({ items: [{ id: 1, qty: 3 }] }),
});

// PATCH — update order status
await fetch("/api/orders/99", {
  method: "PATCH",
  body: JSON.stringify({ status: "delivered" }),
});

// DELETE — remove item from cart
await fetch("/api/cart/items/5", { method: "DELETE" });
```

---


<p><a href="#i34">Back to index</a></p>

<a id="p35"></a>

## 35. Principles of Functional Programming

### Theory

**Functional Programming (FP)** treats computation as the evaluation of pure functions, avoiding mutable state and side effects. Core principles:

1. **Pure functions** — same input always produces same output, no side effects
2. **Immutability** — never mutate data; create new copies
3. **First-class functions** — functions are values, can be passed/returned
4. **Higher-order functions** — functions that take/return functions
5. **Function composition** — combine small functions into pipelines
6. **Declarative style** — describe what, not how

### Pros & Cons

| Pros                                 | Cons                                    |
| ------------------------------------ | --------------------------------------- |
| Predictable, easier to test          | Learning curve for OOP developers       |
| Fewer bugs from shared mutable state | Can be verbose without language support |
| Enables parallelism                  | Performance cost of copying large data  |

### Real-Life Example

```javascript
// Imperative (mutating)
function getActiveOrderTotals(orders) {
  const totals = [];
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status === "active") {
      orders[i].total = orders[i].items.reduce((s, item) => s + item.price, 0);
      totals.push(orders[i].total);
    }
  }
  return totals;
}

// Functional (immutable, pure)
const getActiveOrderTotals = (orders) =>
  orders
    .filter((order) => order.status === "active")
    .map((order) => order.items.reduce((sum, item) => sum + item.price, 0));

// React embraces FP
const [orders, setOrders] = useState([]);
setOrders((prev) => [...prev, newOrder]); // immutable update
```

---


<p><a href="#i35">Back to index</a></p>

<a id="p36"></a>

## 36. What are microservices?

### Theory

**Microservices** is an architectural style where an application is built as a collection of **small, independently deployable services**, each owning a specific business capability. Services communicate via HTTP/REST, gRPC, or message queues.

Each service has its own database, codebase, and deployment pipeline.

### Pros & Cons

| Pros                            | Cons                                       |
| ------------------------------- | ------------------------------------------ |
| Independent scaling per service | Distributed system complexity              |
| Team autonomy per service       | Network latency between services           |
| Technology diversity            | Data consistency challenges                |
| Fault isolation                 | Operational overhead (monitoring, logging) |

### Real-Life Example

```
Food delivery platform microservices:

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Restaurant  │  │   Order     │  │  Payment    │
│  Service     │  │   Service   │  │  Service    │
│  (menus,     │  │  (cart,     │  │  (Razorpay, │
│   search)    │  │   tracking) │  │   refunds)  │
└──────┬───────┘  └──────┬──────┘  └──────┬──────┘
       │                 │                │
       └──────── API Gateway ─────────────┘
                         │
                    Frontend App
                    (calls gateway,
                     not individual services)
```

Frontend impact: BFF (Backend for Frontend) aggregates multiple microservice calls into one API tailored for the UI.

---


<p><a href="#i36">Back to index</a></p>

<a id="p37"></a>

## 37. How would you build a tool like Create React App?

### Theory

**Create React App (CRA)** is a CLI tool that scaffolds a production-ready React project with zero configuration. Building one requires: project templating, bundler setup, dev server, build pipeline, and extensibility.

### Core components to build

| Component          | Technology                                 |
| ------------------ | ------------------------------------------ |
| CLI scaffolding    | `commander` or `yargs`                     |
| Project template   | Copied files (package.json, src/, public/) |
| Bundler            | Webpack or Vite                            |
| Dev server         | HMR via webpack-dev-server or Vite         |
| Transpilation      | Babel (JSX, modern syntax) or esbuild      |
| CSS handling       | PostCSS, CSS Modules, Sass loader          |
| Build optimization | Minification, tree shaking, code splitting |
| Testing setup      | Jest + React Testing Library               |

### Pros & Cons

| Pros                             | Cons                                   |
| -------------------------------- | -------------------------------------- |
| Zero-config developer experience | Hides complexity — hard to customize   |
| Consistent project structure     | Ejected config is irreversible (CRA)   |
| Fast onboarding                  | Opinionated — may not fit all projects |

### Real-Life Example (simplified CLI)

```javascript
#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

program
  .name("create-my-app")
  .argument("<project-name>")
  .action(async (projectName) => {
    const targetDir = path.join(process.cwd(), projectName);
    const templateDir = path.join(__dirname, "../template");

    // 1. Copy template
    await fs.copy(templateDir, targetDir);

    // 2. Customize package.json
    const pkg = await fs.readJson(path.join(targetDir, "package.json"));
    pkg.name = projectName;
    await fs.writeJson(path.join(targetDir, "package.json"), pkg, {
      spaces: 2,
    });

    // 3. Install dependencies
    execSync("npm install", { cwd: targetDir, stdio: "inherit" });

    console.log(`\n✅ Created ${projectName}`);
    console.log(`   cd ${projectName} && npm start`);
  });

program.parse();
```

```
template/
├── package.json        # react, react-dom, vite
├── vite.config.js      # bundler config
├── index.html
├── src/
│   ├── main.jsx
│   └── App.jsx
└── public/
```

Modern alternative: Use **Vite** instead of Webpack for faster dev experience (what most CRA successors do).

---


<p><a href="#i37">Back to index</a></p>

<a id="p38"></a>

## 38. How do you structure reusable UI components in React?

### Theory

A reusable component library follows **atomic design** principles: atoms (Button, Input) → molecules (SearchBar, FormField) → organisms (Header, ProductCard) → templates → pages. Components should be composable, accessible, themeable, and documented.

### Pros & Cons

| Approach              | Pros                       | Cons                              |
| --------------------- | -------------------------- | --------------------------------- |
| Monolithic components | Fast to build initially    | Hard to customize, prop explosion |
| Compound components   | Flexible composition       | Steeper learning curve            |
| Headless + styled     | Logic reuse across designs | Two layers to maintain            |
| Design tokens         | Consistent theming         | Setup overhead                    |

### Real-Life Example

```
packages/
├── tokens/                 # Design tokens
│   ├── colors.json
│   ├── spacing.json
│   └── typography.json
├── primitives/             # Atoms — unstyled, accessible
│   ├── Button/
│   ├── Input/
│   └── Checkbox/
├── components/             # Molecules & organisms
│   ├── SearchBar/
│   ├── ProductCard/
│   └── Modal/
└── docs/                   # Storybook
```

```tsx
// Compound component pattern — flexible Modal
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay" onClick={onClose}>
        {children}
      </div>
    </ModalContext.Provider>,
    document.body,
  );
};

Modal.Header = ({ children }) => (
  <header className="modal-header">{children}</header>
);
Modal.Body = ({ children }) => <div className="modal-body">{children}</div>;
Modal.Footer = ({ children }) => (
  <footer className="modal-footer">{children}</footer>
);

// Usage — compose as needed
<Modal isOpen={open} onClose={close}>
  <Modal.Header>
    <h2>Confirm Order</h2>
  </Modal.Header>
  <Modal.Body>Your total is ₹499. Proceed?</Modal.Body>
  <Modal.Footer>
    <Button variant="ghost" onClick={close}>
      Cancel
    </Button>
    <Button variant="primary" onClick={confirm}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>;
```

**Key principles:**

- Accept `className` and spread remaining props for extensibility
- Use `forwardRef` for focus management
- Document with Storybook + TypeScript prop types
- Test accessibility with `@testing-library/jest-dom` and axe

---

# Quick Revision Cheat Sheet

| #   | Topic                | Key Point                                                        |
| --- | -------------------- | ---------------------------------------------------------------- |
| 1   | Promise.all          | All resolve or first reject; order preserved                     |
| 2   | Promise.any          | First resolve wins; all reject = AggregateError                  |
| 3   | reduce polyfill      | Accumulator + callback; handles sparse arrays                    |
| 4   | flatten              | Recursive depth control; `flat(Infinity)` native                 |
| 5   | Auto-retry           | Exponential backoff + jitter                                     |
| 6   | Batch promises       | Chunk size + delay between batches                               |
| 7   | Debounce             | Wait for pause                                                   |
| 8   | Throttle             | Once per interval                                                |
| 9   | Series tasks         | Callback chain or reduce with promises                           |
| 10  | Output prediction    | Hoisting, closure, event loop, coercion                          |
| 11  | Object vs Map        | String keys vs any key; JSON vs performance                      |
| 12  | PATCH vs PUT         | Partial vs full replacement                                      |
| 13  | Debounce vs Throttle | Stop vs rate-limit                                               |
| 14  | JS Engine            | Parse → interpret → JIT optimize → GC                            |
| 15  | Event Loop           | Sync → microtasks → macrotask                                    |
| 16  | Virtual DOM          | JS tree + diffing heuristics                                     |
| 17  | Keys                 | Stable identity for list reconciliation                          |
| 18  | useState internals   | Hook linked list on Fiber                                        |
| 19  | useState polyfill    | Array + index reset on setState                                  |
| 20  | Portals              | Render outside parent DOM                                        |
| 21  | Error Boundaries     | Catch render errors; class only                                  |
| 22  | Memoization          | useMemo / useCallback / React.memo                               |
| 23  | SSR vs CSR           | Server HTML vs client JS render                                  |
| 24  | Module Federation    | Runtime remote module sharing                                    |
| 25  | Micro-frontends      | Independent deployable frontend apps                             |
| 26  | SSR for SEO          | Meta tags, structured data, SSG/ISR                              |
| 27  | tabIndex             | 0 = focusable, -1 = programmatic only                            |
| 28  | Capturing/Bubbling   | Top-down vs bottom-up event propagation                          |
| 29  | toString override    | Possible but never mutate prototypes                             |
| 30  | Memory leaks         | Cleanup effects, remove listeners                                |
| 31  | Performance          | Profiler, Web Vitals, bundle analyzer                            |
| 32  | OAuth                | Authorization without password sharing                           |
| 33  | SSO                  | One login, multiple apps via IdP                                 |
| 34  | REST methods         | GET read, POST create, PUT replace, PATCH partial, DELETE remove |
| 35  | FP                   | Pure functions, immutability, composition                        |
| 36  | Microservices        | Small independent deployable services                            |
| 37  | CRA-like tool        | CLI + template + bundler + dev server                            |
| 38  | UI components        | Atoms → molecules → organisms + Storybook                        |

---

_Master the "why" behind each answer. In 2026 interviews, depth and real-world judgment matter more than memorized syntax._


<p><a href="#i38">Back to index</a></p>
