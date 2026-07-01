---
title: "Top 20 JavaScript Questions — Senior React Interviews"
description: "Senior-level JavaScript fundamentals that decide React interviews — closures, event loop, prototypes, currying, and output-based questions."
tags: ["javascript", "react", "senior", "interview", "closure", "event-loop"]
level: "Senior (4+ years)"
---

# Top 20 JavaScript Questions — Senior React Interviews

React gets you into the interview. **JavaScript decides whether you clear it.** These 20 questions appear repeatedly in Senior React Developer rounds — with **Theory**, **Pros & Cons**, **One-Line Interview Answer**, and **Real Examples**.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Closure](#p1) |
| <span id="i2"></span>2 | [Event Loop](#p2) |
| <span id="i3"></span>3 | [Microtasks vs Macrotasks](#p3) |
| <span id="i4"></span>4 | [Hoisting](#p4) |
| <span id="i5"></span>5 | [Temporal Dead Zone (TDZ)](#p5) |
| <span id="i6"></span>6 | [var, let, const](#p6) |
| <span id="i7"></span>7 | [== vs ===](#p7) |
| <span id="i8"></span>8 | [call(), apply(), bind()](#p8) |
| <span id="i9"></span>9 | [call/apply/bind with Arrow Functions?](#p9) |
| <span id="i10"></span>10 | [Normal vs Arrow Functions](#p10) |
| <span id="i11"></span>11 | [Debouncing and Throttling](#p11) |
| <span id="i12"></span>12 | [Currying — sum(1)(2)(3)](#p12) |
| <span id="i13"></span>13 | [Prototypes and Prototype Chain](#p13) |
| <span id="i14"></span>14 | [Event Bubbling and Capturing](#p14) |
| <span id="i15"></span>15 | [Garbage Collection](#p15) |
| <span id="i16"></span>16 | [Deep Copy vs Shallow Copy](#p16) |
| <span id="i17"></span>17 | [async/await and Promises](#p17) |
| <span id="i18"></span>18 | [map(), filter(), reduce()](#p18) |
| <span id="i19"></span>19 | [Flatten nested array](#p19) |
| <span id="i20"></span>20 | [Output-based questions](#p20) |

---

<a id="p1"></a>

## 1. What is Closure?

### Theory

A **closure** is a function bundled with its **lexical environment** — the scope where it was created. The inner function retains access to outer variables even after the outer function has finished executing.

Closures enable: data privacy, factory functions, memoization, debouncing, and module patterns.

### Pros & Cons

| Pros | Cons |
|------|------|
| Encapsulation / private state | Memory — outer vars stay alive while closure exists |
| Powerful callback patterns | Accidental leaks if not cleaned up |
| Module pattern without classes | Harder to debug deep chains |

### One-Line Interview Answer

> A closure is when a function remembers variables from its outer scope even after that outer function returns. I use closures for privacy, debouncing, and memoization.

### Real Example

```javascript
function createWallet(initialBalance) {
  let balance = initialBalance; // private via closure

  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
    },
    getBalance() { return balance; },
  };
}

const wallet = createWallet(1000);
wallet.deposit(500);
console.log(wallet.getBalance()); // 1500
// balance is NOT accessible directly — encapsulated
```

```javascript
// React-relevant: debounce hook uses closure
function useDebounce(callback, delay) {
  let timerId; // closed over
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. How does the JavaScript Event Loop work?

### Theory

JavaScript is **single-threaded** — one call stack. The **event loop** coordinates:

1. **Call stack** — synchronous code execution
2. **Web APIs** — setTimeout, fetch, DOM (run outside main thread)
3. **Microtask queue** — Promises, queueMicrotask
4. **Macrotask queue** — setTimeout, I/O, UI events

**Order:** Run all sync code → drain **all microtasks** → run **one macrotask** → repeat.

### Pros & Cons

| Understanding event loop | Ignoring it |
|--------------------------|-------------|
| Predict async behavior | Surprised by Promise/setTimeout order |
| Avoid blocking UI | Long sync code freezes app |
| Debug race conditions | Stale closure bugs in async |

### One-Line Interview Answer

> The event loop manages JS's single thread. Sync code runs first, then all microtasks, then one macrotask. That's why Promises resolve before setTimeout.

### Real Example

```javascript
console.log("1");
setTimeout(() => console.log("4"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("2");
// Output: 1 → 2 → 3 → 4
```

```javascript
// Senior insight — don't block the loop
function processPayments(transactions) {
  // ❌ Blocks UI for 2 seconds
  transactions.forEach(heavyValidation);

  // ✅ Chunk with macrotasks
  let i = 0;
  function chunk() {
    const end = Math.min(i + 100, transactions.length);
    for (; i < end; i++) heavyValidation(transactions[i]);
    if (i < transactions.length) setTimeout(chunk, 0);
  }
  chunk();
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Microtasks and Macrotasks

### Theory

| | Microtasks | Macrotasks |
|--|------------|------------|
| **Examples** | Promise.then, await, queueMicrotask | setTimeout, setInterval, I/O |
| **Priority** | Higher — all drained before next macro | Lower — one per loop iteration |
| **Queue emptied?** | Completely, before next macro | One at a time |

### One-Line Interview Answer

> Microtasks (Promises) run before macrotasks (setTimeout). The loop drains the entire microtask queue before processing one macrotask.

### Real Example

```javascript
console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve()
  .then(() => console.log("promise 1"))
  .then(() => console.log("promise 2"));

queueMicrotask(() => console.log("microtask"));

console.log("end");

// start → end → promise 1 → microtask → promise 2 → timeout
```

**Senior trap:** Infinite microtask chain starves macrotasks and UI updates.

```javascript
// ❌ Never do this
function poison() {
  Promise.resolve().then(poison);
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is Hoisting?

### Theory

**Hoisting** registers declarations in memory during the **creation phase** before code executes line by line. Only **declarations** hoist — not initializations.

| Declaration | Hoisted as |
|-------------|------------|
| `var` | `undefined` |
| `let`/`const` | Uninitialized (TDZ) |
| `function` declaration | Full function |
| `class` | Uninitialized (TDZ) |

### One-Line Interview Answer

> Hoisting moves declarations to the top of their scope during compilation. var becomes undefined; let/const enter TDZ; function declarations are fully available.

### Real Example

```javascript
console.log greet("Amit")); // works
function greet(name) { return `Hello, ${name}`; }

console.log(x); // undefined
var x = 10;

// console.log(y); // ReferenceError — TDZ
let y = 20;
```

```javascript
// Classic senior trap
var price = 100;
function getPrice() {
  console.log(price); // undefined, not 100
  var price = 200;
}
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Temporal Dead Zone (TDZ)

### Theory

The **TDZ** is the period from entering a scope until the `let`/`const` declaration line. The variable exists in the lexical environment but is **uninitialized** — accessing it throws `ReferenceError`.

`var` has no TDZ — it's initialized as `undefined` when hoisted.

### One-Line Interview Answer

> TDZ is the window between scope entry and let/const declaration where accessing the variable throws ReferenceError. It prevents use-before-declare bugs that var silently allows.

### Real Example

```javascript
{
  // TDZ for `amount` starts here
  // console.log(amount); // ReferenceError

  let amount = 5000;
  console.log(amount); // 5000 — TDZ ended
}

typeof undeclaredVar; // "undefined" — safe
// typeof tdzVar;     // ReferenceError if let tdzVar is below
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. var, let, and const

### Theory

| | var | let | const |
|--|-----|-----|-------|
| Scope | Function | Block | Block |
| Hoisting | undefined | TDZ | TDZ |
| Redeclare | Yes | No | No |
| Reassign | Yes | Yes | No (binding) |
| Global object prop | Yes (window) | No | No |

`const` prevents **rebinding**, not **mutation** of objects.

### One-Line Interview Answer

> Use const by default, let when reassignment is needed, avoid var. let/const are block-scoped and have TDZ; const objects can still be mutated.

### Real Example

```javascript
const config = { apiUrl: "/api/v2", retries: 3 };
config.retries = 5;  // ✅ mutation OK
// config = {};      // ❌ TypeError

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
for (var j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100); // 3, 3, 3
}
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. == vs ===

### Theory

- **`==`** — loose equality with **type coercion**
- **`===`** — strict equality, **no coercion**

Always prefer `===` in production. Use `== null` to check both `null` and `undefined`.

### Coercion surprises

```javascript
0 == false;        // true
"" == false;       // true
null == undefined; // true
[] == false;       // true
"5" == 5;          // true

0 === false;       // false
null === undefined;// false
```

### One-Line Interview Answer

> === compares value and type without coercion. == coerces types which causes subtle bugs — I always use === except for null checks with == null.

### Real Example

```javascript
function validateAmount(input) {
  // ❌ "0" == 0 is true — wrong for payment validation
  if (input == 0) return "Invalid amount";

  // ✅ Strict check
  if (input === 0 || input === "0") return "Invalid amount";
  if (Number(input) <= 0) return "Invalid amount";
}
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. call(), apply(), bind()

### Theory

All three control **`this`** context:

| Method | Invokes? | Arguments | Returns |
|--------|----------|-----------|---------|
| `call` | Immediately | Comma-separated | Function result |
| `apply` | Immediately | Array | Function result |
| `bind` | No | Comma-separated (+ partial) | **New function** |

### One-Line Interview Answer

> call and apply invoke immediately with a specific this — apply takes args as array. bind returns a new function with this permanently bound.

### Real Example

```javascript
const billing = {
  currency: "₹",
  format(amount) {
    return `${this.currency}${amount}`;
  },
};

billing.format(999);                    // "₹999"
billing.format.call({ currency: "$" }, 49);   // "$49"
billing.format.apply({ currency: "€" }, [29]);  // "€29"

const formatINR = billing.format.bind({ currency: "₹" });
formatINR(199); // "₹199"

// Borrowing methods
const nums = [5, 2, 8, 1];
Math.max.apply(null, nums); // 8
Math.max.call(null, ...nums); // 8
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Can call(), apply(), bind() be used with Arrow Functions?

### Theory

**No.** Arrow functions have **no own `this`** — they inherit `this` lexically from the enclosing scope. Since `this` is fixed at creation time, `call`, `apply`, and `bind` **cannot change it**.

Calling them on arrow functions doesn't throw — but **`this` stays lexical**, arguments are still passed.

### One-Line Interview Answer

> No — arrow functions ignore call, apply, and bind for this binding because they inherit this lexically. Use regular functions when you need dynamic this.

### Real Example

```javascript
const obj = {
  name: "CRED",
  regular() { return this.name; },
  arrow: () => this?.name,
};

obj.regular();                        // "CRED"
obj.regular.call({ name: "Other" });  // "Other"

obj.arrow();                          // undefined (lexical this)
obj.arrow.call({ name: "Other" });    // still undefined — this NOT changed

// bind on arrow — creates bound function but this unchanged
const bound = obj.arrow.bind({ name: "Other" });
bound(); // undefined
```

```javascript
// Practical rule for React class components (legacy)
this.handleClick = this.handleClick.bind(this); // regular fn — works
this.handleClick = () => { ... };               // arrow — this already correct
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Normal Functions vs Arrow Functions

### Theory

| Feature | Normal | Arrow |
|---------|--------|-------|
| `this` | Dynamic (call site) | Lexical (enclosing scope) |
| `arguments` | Yes | No — use rest `...args` |
| `new` / constructor | Yes | No |
| `prototype` | Yes | No |
| Syntax | Verbose | Concise, implicit return |

### One-Line Interview Answer

> Normal functions have dynamic this and can be constructors. Arrow functions inherit this lexically — perfect for callbacks, wrong for object methods and constructors.

### Real Example

```javascript
const paymentService = {
  transactions: [100, 200, 300],

  // ✅ Normal — this = paymentService
  getTotal() {
    return this.transactions.reduce((a, b) => a + b, 0);
  },

  // ❌ Arrow — this is NOT paymentService
  brokenTotal: () => this?.transactions?.reduce((a, b) => a + b, 0),

  // ✅ Arrow inside normal — inherits correct this
  getFormatted() {
    return this.transactions.map((t) => `₹${t}`);
  },
};
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Debouncing and Throttling

### Theory

| | Debounce | Throttle |
|--|----------|----------|
| **Behavior** | Wait for pause, run once | Run at most once per interval |
| **Use for** | Search input, auto-save | Scroll, resize, rate limiting |
| **Analogy** | Elevator waits for everyone | Train every 10 minutes |

### One-Line Interview Answer

> Debounce waits until activity stops then fires once — great for search. Throttle fires at most once per interval — great for scroll handlers.

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

// React payment search
const searchTransactions = debounce((q) => fetch(`/api/txns?q=${q}`), 300);
const trackScroll = throttle(() => analytics.track("scroll"), 200);
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Currying — Implement sum(1)(2)(3)

### Theory

**Currying** transforms a function taking multiple arguments into a chain of functions each taking one (or more) arguments.

`sum(1)(2)(3)` should return **6**.

### One-Line Interview Answer

> Currying converts f(a,b,c) into f(a)(b)(c). Each call returns a function until enough arguments are collected, then computes the result.

### Real Example

```javascript
// sum(1)(2)(3) → 6
function sum(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
console.log(sum(1)(2)(3)); // 6

// Generic curry — flexible arity
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried(...args, ...more);
  };
}

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6

// Infinite currying sum — sum(1)(2)(3)...(n)
function infiniteSum(a) {
  const fn = (b) => infiniteSum(a + b);
  fn.valueOf = () => a;
  fn.toString = () => String(a);
  return fn;
}
console.log(+infiniteSum(1)(2)(3)); // 6
console.log(+infiniteSum(5)(10)(15)); // 30
```

```javascript
// Real-life: partial application for API client
const apiCall = curry((method, baseUrl, endpoint) =>
  fetch(`${baseUrl}${endpoint}`, { method })
);

const credApi = apiCall("GET")("https://api.cred.club");
credApi("/users/me").then((r) => r.json());
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Prototypes and Prototype Chain

### Theory

Every JS object has an internal link `[[Prototype]]` (accessed via `Object.getPrototypeOf()` or `__proto__`). When you access a property, JS walks the **prototype chain** until it finds the property or reaches `null`.

Functions have a `prototype` property used when called with `new`.

### One-Line Interview Answer

> Every object inherits from another via its prototype link. Property lookup walks the chain up until found or null — that's prototypal inheritance.

### Real Example

```javascript
function Transaction(amount, type) {
  this.amount = amount;
  this.type = type;
}

Transaction.prototype.getFormatted = function () {
  return `₹${this.amount} (${this.type})`;
};

Transaction.prototype.isCredit = function () {
  return this.type === "credit";
};

const txn = new Transaction(500, "credit");
console.log(txn.getFormatted()); // "₹500 (credit)"

// Prototype chain
txn → Transaction.prototype → Object.prototype → null

console.log(txn.hasOwnProperty("amount"));  // true
console.log(txn.hasOwnProperty("getFormatted")); // false — on prototype

// ES6 class — syntactic sugar over prototypes
class Payment {
  constructor(amount) { this.amount = amount; }
  getFormatted() { return `₹${this.amount}`; }
}
```

```javascript
// Senior: Object.create for pure prototypal inheritance
const animal = { breathe() { return "breathing"; } };
const dog = Object.create(animal);
dog.bark = () => "woof";
dog.breathe(); // "breathing" — inherited
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Event Bubbling and Capturing

### Theory

Events travel in three phases:

1. **Capturing** — window → target (top down)
2. **Target** — event reaches element
3. **Bubbling** — target → window (bottom up)

Default listeners run in **bubbling** phase. Use `{ capture: true }` for capturing.

**Event delegation** attaches one listener on parent, uses bubbling + `event.target`.

### One-Line Interview Answer

> Events bubble from target to root by default. Capturing goes the opposite direction. Delegation uses one parent listener and event.target to handle dynamic children.

### Real Example

```html
<div id="list">
  <button data-id="1">Pay</button>
  <button data-id="2">Refund</button>
</div>
```

```javascript
// Bubbling — click button → list → body → html
document.getElementById("list").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  handlePayment(btn.dataset.id);
});

// stopPropagation — modal content click doesn't close overlay
overlay.addEventListener("click", closeModal);
modalContent.addEventListener("click", (e) => e.stopPropagation());

// Capturing — intercept before children
document.addEventListener("click", logAllClicks, { capture: true });
```

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Garbage Collection

### Theory

JS uses **automatic garbage collection**. The main algorithm is **mark-and-sweep**: mark all objects reachable from roots (global, call stack, closures), sweep unmarked objects.

V8 uses **generational GC**: young generation (Scavenge, frequent) and old generation (Mark-Sweep-Compact, less frequent).

### Common leak causes

- Global variables holding references
- Forgotten timers / intervals
- Event listeners not removed
- Closures holding large objects
- Detached DOM nodes referenced in JS

### One-Line Interview Answer

> GC frees memory for objects no longer reachable from roots. Leaks happen when we keep references accidentally — timers, listeners, closures holding large data.

### Real Example

```javascript
// ❌ Leak
const cache = {};
function loadUser(id) {
  cache[id] = fetchHugeUserObject(id); // grows forever
}

// ✅ Bounded cache
const cache = new Map();
const MAX = 100;
function loadUserCached(id) {
  if (cache.has(id)) return cache.get(id);
  const data = fetchUser(id);
  if (cache.size >= MAX) cache.delete(cache.keys().next().value);
  cache.set(id, data);
  return data;
}

// ✅ WeakMap — doesn't prevent GC of keys
const domData = new WeakMap();
function attach(el, data) { domData.set(el, data); }
// When el removed from DOM and unreferenced, entry is GC'd
```

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Deep Copy vs Shallow Copy

### Theory

| | Shallow Copy | Deep Copy |
|--|--------------|-----------|
| Top level | New reference | New reference |
| Nested objects | **Shared** | **New copies** |
| Methods | spread, Object.assign, slice | structuredClone, JSON, recursive |

### One-Line Interview Answer

> Shallow copy shares nested references — mutating nested object affects both. Deep copy recursively clones everything — use structuredClone for modern code.

### Real Example

```javascript
const order = {
  id: "ORD-1",
  items: [{ name: "Biryani", price: 299 }],
  customer: { name: "Amit" },
};

// Shallow
const shallow = { ...order };
shallow.items.push({ name: "Naan", price: 49 });
console.log(order.items.length); // 2 — shared!

// Deep
const deep = structuredClone(order);
deep.items.push({ name: "Lassi", price: 79 });
console.log(order.items.length); // still 2

// JSON deep copy — limitations: no Date, Map, undefined, functions
const jsonDeep = JSON.parse(JSON.stringify(order));
```

```javascript
// React state — always immutable updates (shallow spread is enough for one level)
setOrder((prev) => ({
  ...prev,
  items: [...prev.items, newItem], // new array — shallow copy of items
}));
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. async/await and Promises

### Theory

A **Promise** represents a future value: pending → fulfilled or rejected.

**async/await** is syntactic sugar — `async` functions return Promises; `await` pauses until Promise settles.

Code before first `await` runs synchronously. After `await` resumes as **microtask**.

### One-Line Interview Answer

> Promises handle async with then/catch chains. async/await makes it read like sync code. await pauses the function, not the thread — other code keeps running.

### Real Example

```javascript
// Promise chain
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
}

// async/await — cleaner error handling
async function loadDashboard(userId) {
  try {
    const [user, orders, rewards] = await Promise.all([
      fetchUser(userId),
      fetchOrders(userId),
      fetchRewards(userId),
    ]);
    return { user, orders, rewards };
  } catch (err) {
    logError(err);
    throw err;
  }
}

// Execution order
async function demo() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
console.log("C");
demo();
console.log("D");
// C → A → D → B
```

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. map(), filter(), reduce()

### Theory

| Method | Returns | Purpose |
|--------|---------|---------|
| `map` | Same length array | Transform each element |
| `filter` | 0 to n length | Keep matching elements |
| `reduce` | Single value | Accumulate to one result |

All are **immutable** — original array unchanged.

### One-Line Interview Answer

> map transforms, filter selects, reduce accumulates. I chain them for readable data pipelines and use reduce when I need a single output like sum or grouping.

### Real Example

```javascript
const transactions = [
  { id: 1, amount: 500, type: "credit", status: "success" },
  { id: 2, amount: 200, type: "debit", status: "failed" },
  { id: 3, amount: 150, type: "credit", status: "success" },
  { id: 4, amount: 800, type: "debit", status: "success" },
];

// map — UI labels
const labels = transactions.map((t) => `${t.type}: ₹${t.amount}`);
// ["credit: ₹500", "debit: ₹200", ...]

// filter — successful credits
const successfulCredits = transactions.filter(
  (t) => t.type === "credit" && t.status === "success"
);

// reduce — total successful amount
const total = transactions
  .filter((t) => t.status === "success")
  .reduce((sum, t) => sum + t.amount, 0);
// 1450

// reduce — group by type
const byType = transactions.reduce((groups, t) => {
  (groups[t.type] ??= []).push(t);
  return groups;
}, {});
```

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Flatten Nested Array

### Theory

Convert `[1, [2, [3, 4]], 5]` → `[1, 2, 3, 4, 5]`.

Approaches: recursive, iterative with stack, built-in `flat(Infinity)`.

### One-Line Interview Answer

> I flatten recursively by reducing each element — if array, flatten it; otherwise keep it. In production I'd use flat(Infinity) or specify depth for partial flatten.

### Real Example

```javascript
// Built-in
[1, [2, [3, 4]], 5].flat(Infinity); // [1, 2, 3, 4, 5]
[1, [2, [3, 4]], 5].flat(1);        // [1, 2, [3, 4], 5] — one level

// Recursive — interview implementation
function flatten(arr, depth = Infinity) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) return acc.concat(flatten(val, depth - 1));
    return acc.concat(val);
  }, []);
}

// Iterative — stack (no recursion limit issues)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) stack.push(...next);
    else result.push(next);
  }
  return result.reverse();
}

console.log(flatten([1, [2, [3, 4]], 5])); // [1, 2, 3, 4, 5]
```

```javascript
// Real-life: flatten nested API categories for search
const categories = ["All", ["Food", ["North Indian", ["Biryani"]]], "Drinks"];
const searchable = flatten(categories);
// ["All", "Food", "North Indian", "Biryani", "Drinks"]
```

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. Output-based JavaScript Questions

### Theory

Senior interviews test **deep understanding** through output prediction. Explain **why**, not just the answer. Topics: hoisting, closures, event loop, coercion, `this`, prototypes.

---

### Q1 — Hoisting + var

```javascript
console.log(a);
var a = 1;
console.log(a);
```

**Output:** `undefined` → `1`

---

### Q2 — TDZ

```javascript
console.log(b);
let b = 2;
```

**Output:** `ReferenceError`

---

### Q3 — Closure + var loop

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Output:** `3, 3, 3`

---

### Q4 — Closure + let loop

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Output:** `0, 1, 2`

---

### Q5 — Event loop

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

**Output:** `1` → `4` → `3` → `2`

---

### Q6 — async/await order

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

**Output:** `C` → `A` → `D` → `B`

---

### Q7 — this + arrow

```javascript
const obj = {
  name: "Senior",
  regular() { return this.name; },
  arrow: () => this?.name,
};
console.log(obj.regular());
console.log(obj.arrow());
```

**Output:** `"Senior"` → `undefined`

---

### Q8 — Prototype

```javascript
function Person(name) { this.name = name; }
Person.prototype.greet = function () { return this.name; };
const p = new Person("Amit");
console.log(p.greet());
console.log(p.hasOwnProperty("greet"));
```

**Output:** `"Amit"` → `false`

---

### Q9 — Coercion

```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

**Output:** `""` → `"[object Object]"` → `"[object Object]"`

---

### Q10 — Promise chain

```javascript
Promise.resolve(1)
  .then((v) => v + 1)
  .then((v) => { throw new Error("fail"); })
  .then((v) => console.log(v))
  .catch((e) => console.log("caught"))
  .then(() => console.log("done"));
```

**Output:** `caught` → `done`

---

### Q11 — typeof null

```javascript
console.log(typeof null);
console.log(null instanceof Object);
```

**Output:** `"object"` → `false`

---

### Q12 — Currying output

```javascript
function multiply(a) {
  return function (b) {
    return a * b;
  };
}
const double = multiply(2);
console.log(double(5));
console.log(multiply(3)(4));
```

**Output:** `10` → `12`

---

# Senior Interview Strategy

| Do | Don't |
|----|-------|
| Explain **why** behind output | Guess without reasoning |
| Connect JS to React (closures → hooks, event loop → useEffect) | Treat JS and React as separate |
| Write code from scratch (debounce, curry, flatten) | Only know definitions |
| Mention edge cases (TDZ, shallow copy, arrow this) | Give textbook paragraphs |

---

# Quick Revision — All 20

| # | Topic | One-liner |
|---|-------|-----------|
| 1 | Closure | Function + remembered outer scope |
| 2 | Event loop | Sync → microtasks → macrotask |
| 3 | Micro vs macro | Promises first, setTimeout later |
| 4 | Hoisting | Declarations registered before run |
| 5 | TDZ | let/const inaccessible until declared |
| 6 | var/let/const | Block scope; const default |
| 7 | == vs === | Coercion vs strict — always === |
| 8 | call/apply/bind | Invoke now vs bind this for later |
| 9 | Arrow + bind | No — lexical this, bind ignored |
| 10 | Normal vs arrow | Dynamic vs lexical this |
| 11 | Debounce/throttle | Pause vs rate-limit |
| 12 | Currying | f(a)(b)(c) — partial application |
| 13 | Prototypes | Property lookup chain |
| 14 | Bubbling/capturing | Target → up vs window → down |
| 15 | GC | Mark-and-sweep unreachable objects |
| 16 | Deep vs shallow | Nested shared vs full clone |
| 17 | async/await | Promise sugar, microtask resume |
| 18 | map/filter/reduce | Transform, select, accumulate |
| 19 | Flatten | Recursive or flat(Infinity) |
| 20 | Output questions | Hoisting, loop, event loop, this |

---

*Senior React interviews are won on JavaScript depth. Know the concept, explain it in 30 seconds, prove it with one example.*


<p><a href="#i20">Back to index</a></p>
