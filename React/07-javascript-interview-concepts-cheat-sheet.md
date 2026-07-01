---
title: "JavaScript Interview Concepts – Complete Frontend Interview Cheat Sheet"
description: "20 essential JavaScript topics for frontend interviews — theory, pros/cons, and real-life examples."
tags: ["javascript", "interview", "frontend", "cheat-sheet"]
level: "All levels"
---

# JavaScript Interview Concepts – Complete Frontend Interview Cheat Sheet

The most important JavaScript topics every frontend developer should know — compiled from real interview questions and production scenarios. Each topic includes **Theory**, **Pros & Cons**, and a **Real-Life Example**.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [var, let & const](#p1) |
| <span id="i2"></span>2 | [Data Types](#p2) |
| <span id="i3"></span>3 | [Hoisting](#p3) |
| <span id="i4"></span>4 | [Scope & Scope Chain](#p4) |
| <span id="i5"></span>5 | [this Keyword](#p5) |
| <span id="i6"></span>6 | [Closures](#p6) |
| <span id="i7"></span>7 | [Prototype & Inheritance](#p7) |
| <span id="i8"></span>8 | [Event Loop](#p8) |
| <span id="i9"></span>9 | [Promises](#p9) |
| <span id="i10"></span>10 | [Async/Await](#p10) |
| <span id="i11"></span>11 | [Arrow Functions](#p11) |
| <span id="i12"></span>12 | [Destructuring](#p12) |
| <span id="i13"></span>13 | [Spread & Rest Operators](#p13) |
| <span id="i14"></span>14 | [Map, Filter & Reduce](#p14) |
| <span id="i15"></span>15 | [Object Methods](#p15) |
| <span id="i16"></span>16 | [Type Coercion](#p16) |
| <span id="i17"></span>17 | [Debounce vs Throttle](#p17) |
| <span id="i18"></span>18 | [Memory Management](#p18) |
| <span id="i19"></span>19 | [Common JavaScript Gotchas](#p19) |
| <span id="i20"></span>20 | [Best Practices](#p20) |

---

<a id="p1"></a>

## 1. var, let & const

### Theory

`var`, `let`, and `const` are three ways to declare variables in JavaScript. They differ in **scope**, **hoisting behavior**, and **reassignment rules**.

- **`var`** — function-scoped, hoisted as `undefined`, can be redeclared
- **`let`** — block-scoped, hoisted but in TDZ until declared, cannot be redeclared
- **`const`** — block-scoped, same as `let` but cannot be **reassigned** (objects/arrays can still be mutated)

**TDZ (Temporal Dead Zone):** The period between entering a scope and the line where `let`/`const` is declared. Accessing the variable during TDZ throws `ReferenceError`.

### Pros & Cons

|              | var                           | let                            | const                                |
| ------------ | ----------------------------- | ------------------------------ | ------------------------------------ |
| **Pros**     | Works everywhere (legacy)     | Block scope, no redeclare bugs | Intent is clear — won't reassign     |
| **Cons**     | Hoisting bugs, no block scope | —                              | Can't reassign (even if you need to) |
| **Use when** | Never in modern code          | Value will change              | Default choice                       |

### Real-Life Example

```javascript
// Block scope
function processOrder() {
  if (true) {
    var oldWay = "var"; // function-scoped
    let newWay = "let"; // block-scoped
    const API = "v2"; // block-scoped, constant binding
  }
  console.log(oldWay); // "var" — leaked out
  // console.log(newWay); // ReferenceError
}

// const does NOT freeze objects
const cart = { items: [], total: 0 };
cart.items.push({ id: 1, name: "Biryani" }); // ✅ mutation OK
cart.total = 299; // ✅ mutation OK
// cart = {};                                 // ❌ TypeError — rebinding

// Classic var loop bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100); // 0, 1, 2
}
```

**Rule:** Use `const` by default → `let` when reassignment is needed → avoid `var`.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Data Types

### Theory

JavaScript has **8 data types** — 7 primitives and 1 non-primitive:

| Type        | typeof        | Mutable | Stored    |
| ----------- | ------------- | ------- | --------- |
| `string`    | `"string"`    | No      | Value     |
| `number`    | `"number"`    | No      | Value     |
| `boolean`   | `"boolean"`   | No      | Value     |
| `undefined` | `"undefined"` | No      | Value     |
| `null`      | `"object"` ⚠️ | No      | Value     |
| `symbol`    | `"symbol"`    | No      | Value     |
| `bigint`    | `"bigint"`    | No      | Value     |
| `object`    | `"object"`    | Yes     | Reference |

**Primitives** are immutable and compared by **value**. **Objects** (including arrays, functions, dates) are compared by **reference**.

### Pros & Cons

| Primitives                              | Objects                              |
| --------------------------------------- | ------------------------------------ |
| ✅ Fast comparison by value             | ✅ Can hold complex nested data      |
| ✅ Immutable — thread-safe conceptually | ✅ Methods and properties            |
| ❌ Limited structure                    | ❌ Compared by reference — easy bugs |
|                                         | ❌ Mutable — accidental changes      |

### Real-Life Example

```javascript
// Primitives — passed by value
let price = 299;
let discount = price;
discount = 199;
console.log(price); // 299 — unchanged

// Objects — passed by reference
const orderA = { total: 500 };
const orderB = orderA;
orderB.total = 600;
console.log(orderA.total); // 600 — same object!

// typeof quirks
typeof null; // "object" (historical bug)
typeof []; // "object"
typeof function () {}; // "function" (special case)
Array.isArray([]); // true — reliable array check

// Checking for null/undefined safely
const value = null;
value == null; // true (checks null OR undefined)
value === null; // true
value ?? "default"; // "default" (nullish coalescing)
```

```javascript
// Real-life: API response typing mindset
const user = {
  id: "u_42",
  name: "Amit",
  roles: ["admin", "editor"],
  metadata: { lastLogin: "2026-03-15" },
};
// typeof user === "object" — always check structure, not just type
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Hoisting

### Theory

**Hoisting** is JavaScript moving declarations to the top of their scope during compilation — before execution. Only **declarations** are hoisted, not **initializations**.

| Declaration                            | Hoisted?   | Initial Value |
| -------------------------------------- | ---------- | ------------- |
| `var`                                  | ✅         | `undefined`   |
| `let` / `const`                        | ✅ (TDZ)   | uninitialized |
| `function` declaration                 | ✅         | full function |
| `function` expression (`var fn = ...`) | `var` only | `undefined`   |
| `class`                                | ✅ (TDZ)   | uninitialized |

### Pros & Cons

| Pros                                           | Cons                                    |
| ---------------------------------------------- | --------------------------------------- |
| Function declarations usable before definition | `var` hoisting causes subtle bugs       |
| Flexible code organization                     | TDZ errors confuse beginners            |
|                                                | Easy to reference before initialization |

### Real-Life Example

```javascript
// Function declaration — fully hoisted
calculateTax(100); // works! returns 5
function calculateTax(amount) {
  return amount * 0.05;
}

// var — hoisted as undefined
console.log(status); // undefined (not error)
var status = "active";

// let — TDZ
// console.log(count); // ReferenceError
let count = 0;

// Function expression
// processPayment(); // TypeError: not a function
var processPayment = function () {
  return "paid";
};

// Classic trap
function app() {
  console.log(theme); // undefined
  var theme = "dark";
  // Equivalent to:
  // var theme;
  // console.log(theme);
  // theme = "dark";
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Scope & Scope Chain

### Theory

**Scope** determines where variables are accessible. JavaScript has:

- **Global scope** — accessible everywhere (`window` in browsers)
- **Function scope** — `var` is limited to the function
- **Block scope** — `let`/`const` limited to `{}` blocks
- **Module scope** — ES modules have their own scope

The **scope chain** is the path JavaScript follows to look up a variable: current scope → outer scope → ... → global. Inner scopes can access outer variables; outer scopes cannot access inner ones (**lexical scoping**).

### Pros & Cons

| Block scope (let/const)          | Function scope (var)                 |
| -------------------------------- | ------------------------------------ |
| ✅ Variables contained to blocks | ❌ Variables leak from if/for blocks |
| ✅ Fewer naming collisions       | ❌ Harder to reason about            |
| ✅ TDZ catches early access      | —                                    |

### Real-Life Example

```javascript
const API_URL = "https://api.example.com"; // global/module scope

function fetchOrders(userId) {
  const endpoint = `/users/${userId}/orders`; // function scope

  if (userId) {
    let page = 1; // block scope
    const limit = 20;

    while (page <= 5) {
      let cursor = page * limit; // block scope per iteration (let)
      fetch(`${API_URL}${endpoint}?page=${page}&limit=${limit}`);
      page++;
    }
    // console.log(cursor); // ReferenceError — block scoped
  }
  // console.log(page); // ReferenceError
  return endpoint;
}

// Scope chain lookup
const tax = 0.05; // outer
function calculate(price) {
  const discount = 0.1; // middle
  function applyDiscount() {
    return price - price * discount + price * tax;
    // applyDiscount looks up: own scope → calculate → global
  }
  return applyDiscount();
}
```

```javascript
// Module scope — variables don't pollute global
// orderService.js
const BASE_URL = import.meta.env.VITE_API_URL; // module-private
export function getOrders() {
  return fetch(`${BASE_URL}/orders`);
}
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. this Keyword

### Theory

`this` refers to the **execution context** — who called the function. Its value depends on **how** the function is invoked, not where it's defined.

| Invocation                | `this` value                           |
| ------------------------- | -------------------------------------- |
| Global / standalone       | `undefined` (strict) or `window`       |
| Object method             | The object                             |
| `call` / `apply` / `bind` | Explicitly set                         |
| `new` keyword             | Newly created instance                 |
| Arrow function            | Inherited from enclosing lexical scope |
| Event handler             | The element (usually)                  |

### Pros & Cons

| Explicit binding (bind/call) | Arrow functions (lexical this)              |
| ---------------------------- | ------------------------------------------- |
| ✅ Full control over `this`  | ✅ No `this` confusion in callbacks         |
| ❌ Verbose, easy to forget   | ❌ Can't use as constructors                |
|                              | ❌ Wrong `this` if you need dynamic binding |

### Real-Life Example

```javascript
const checkout = {
  items: ["Biryani", "Naan"],
  total: 348,

  printReceipt() {
    console.log(this.total); // 348 — method call
  },

  processItems: function () {
    this.items.forEach(function (item) {
      // console.log(this.total); // undefined — `this` is lost in callback
    });

    this.items.forEach((item) => {
      console.log(this.total); // 348 — arrow inherits `this` from processItems
    });
  },
};

checkout.printReceipt();

// Explicit binding
function formatPrice(amount) {
  return `${this.currency}${amount}`;
}
formatPrice.call({ currency: "₹" }, 299); // "₹299"
formatPrice.apply({ currency: "$" }, [49]); // "$49"

const formatINR = formatPrice.bind({ currency: "₹" });
formatINR(199); // "₹199"

// React class component (legacy)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }
}
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Closures

### Theory

A **closure** is a function bundled together with its **lexical environment** — the scope in which it was created. The inner function retains access to outer variables even after the outer function has finished executing.

Closures enable: data privacy, factory functions, memoization, debouncing, and module patterns.

### Pros & Cons

| Pros                              | Cons                                                |
| --------------------------------- | --------------------------------------------------- |
| Encapsulation / private variables | Memory — outer vars stay alive while closure exists |
| Reusable function factories       | Accidental closures in loops (var bug)              |
| Powerful callback patterns        | Harder to debug deep closure chains                 |

### Real-Life Example

```javascript
// Private counter — module pattern
function createCart() {
  let items = []; // private via closure

  return {
    add(item) {
      items.push(item);
    },
    remove(id) {
      items = items.filter((i) => i.id !== id);
    },
    getTotal() {
      return items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    getCount() {
      return items.length;
    },
  };
}

const cart = createCart();
cart.add({ id: 1, name: "Biryani", price: 299, qty: 1 });
console.log(cart.getTotal()); // 299
// cart.items — undefined (private)

// Debounce — closure holds timer reference
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((q) => fetch(`/api?q=${q}`), 300);
```

```javascript
// Memoization
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFilter = memoize((products, category) =>
  products.filter((p) => p.category === category),
);
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Prototype & Inheritance

### Theory

Every JavaScript object has an internal link to another object called its **prototype** (`[[Prototype]]`, accessible via `Object.getPrototypeOf()` or `__proto__`). When you access a property, JavaScript walks the **prototype chain** until it finds the property or reaches `null`.

**Constructor functions** (pre-ES6) and **classes** (ES6 syntactic sugar) create objects that inherit from a shared prototype.

### Pros & Cons

| Prototypal inheritance                            | Classical inheritance (Java/C++) |
| ------------------------------------------------- | -------------------------------- |
| ✅ Flexible — objects inherit from objects        | ❌ Rigid class hierarchies       |
| ✅ Dynamic — add methods at runtime               |                                  |
| ✅ Memory efficient — shared methods on prototype |                                  |
| ❌ Confusing `this` and prototype chain           |                                  |

### Real-Life Example

```javascript
// Constructor + prototype (ES5 style)
function Restaurant(name, cuisine) {
  this.name = name;
  this.cuisine = cuisine;
}

Restaurant.prototype.getDetails = function () {
  return `${this.name} (${this.cuisine})`;
};

Restaurant.prototype.isOpen = function () {
  return this.status === "open";
};

const r1 = new Restaurant("Spice Garden", "North Indian");
const r2 = new Restaurant("Dosa Corner", "South Indian");

console.log(r1.getDetails()); // "Spice Garden (North Indian)"
// getDetails lives on Restaurant.prototype — shared, not duplicated

// ES6 class — syntactic sugar over prototypes
class Order {
  constructor(id, items) {
    this.id = id;
    this.items = items;
  }

  getTotal() {
    return this.items.reduce((sum, i) => sum + i.price, 0);
  }
}

class DeliveryOrder extends Order {
  constructor(id, items, address) {
    super(id, items);
    this.address = address;
  }

  getTotal() {
    return super.getTotal() + 40; // delivery fee
  }
}

const order = new DeliveryOrder("ORD-1", [{ price: 299 }]);
console.log(order.getTotal()); // 339

// Prototype chain check
order instanceof DeliveryOrder; // true
order instanceof Order; // true
order.hasOwnProperty("id"); // true
order.hasOwnProperty("getTotal"); // false (on prototype)
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Event Loop

### Theory

JavaScript is **single-threaded** — one call stack. The **event loop** coordinates between the call stack, **web APIs** (setTimeout, fetch, DOM events), the **microtask queue**, and the **macrotask queue**.

**Order:** Sync code → drain all microtasks → one macrotask → repeat.

### Pros & Cons

| Pros                          | Cons                          |
| ----------------------------- | ----------------------------- |
| Simple concurrency — no locks | Long sync code blocks UI      |
| Non-blocking I/O              | Microtask starvation possible |
| Predictable execution model   | Async mental model is hard    |

### Real-Life Example

```javascript
console.log("1");

setTimeout(() => console.log("4"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("2");

// Output: 1 → 2 → 3 → 4
```

```javascript
// Real impact — don't block the main thread
function handleLargeDataset(data) {
  // ❌ Blocks UI for 3 seconds
  return data.map(heavyTransform);

  // ✅ Chunk with macrotasks
  return new Promise((resolve) => {
    const results = [];
    let i = 0;
    function chunk() {
      const end = Math.min(i + 1000, data.length);
      for (; i < end; i++) results.push(heavyTransform(data[i]));
      if (i < data.length) setTimeout(chunk, 0);
      else resolve(results);
    }
    chunk();
  });
}
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Promises

### Theory

A **Promise** represents a value that may be available now, later, or never. It has three states:

- **Pending** — initial state
- **Fulfilled** — operation succeeded
- **Rejected** — operation failed

Once settled (fulfilled or rejected), a promise cannot change state. `.then()` handles success, `.catch()` handles errors, `.finally()` runs regardless.

### Pros & Cons

| Promises                             | Callbacks                   |
| ------------------------------------ | --------------------------- |
| ✅ Avoid callback hell               | ✅ Simple for one-off async |
| ✅ `.then` chain is readable         | ❌ Pyramid of doom          |
| ✅ `Promise.all`, `race`, `any`      | ❌ Hard error handling      |
| ❌ Still need careful error handling |                             |

### Real-Life Example

```javascript
// Creating promises
function fetchOrder(orderId) {
  return fetch(`/api/orders/${orderId}`).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

// Chaining
fetchOrder("ORD-42")
  .then((order) => enrichWithDriverInfo(order))
  .then((order) => renderOrderUI(order))
  .catch((err) => showErrorToast(err.message))
  .finally(() => hideSpinner());

// Promise.all — parallel, all must succeed
const [user, cart, addresses] = await Promise.all([
  fetchUser(userId),
  fetchCart(userId),
  fetchAddresses(userId),
]);

// Promise.race — first to settle wins
const result = await Promise.race([
  fetchFromPrimaryCDN(url),
  timeout(5000), // reject after 5s
]);

// Custom Promise.all polyfill concept
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (!promises.length) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          results[i] = val;
          if (++done === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Async/Await

### Theory

`async/await` is **syntactic sugar** over Promises. An `async` function always returns a Promise. `await` pauses execution until the Promise settles, then resumes with the resolved value.

Code before the first `await` runs synchronously. Code after `await` runs as a **microtask**.

### Pros & Cons

| async/await                                 | .then() chains                                     |
| ------------------------------------------- | -------------------------------------------------- |
| ✅ Reads like synchronous code              | ✅ More explicit control flow                      |
| ✅ try/catch for errors                     | ✅ Easier to parallelize visually with Promise.all |
| ✅ Easier debugging (stack traces)          |                                                    |
| ❌ Easy to accidentally run sequentially    |                                                    |
| ❌ Sequential await is slower than parallel |                                                    |

### Real-Life Example

```javascript
// Sequential — slow (each waits for previous)
async function loadCheckoutSlow(userId) {
  const user = await fetchUser(userId);
  const cart = await fetchCart(userId);
  const addresses = await fetchAddresses(userId);
  return { user, cart, addresses };
}

// Parallel — fast
async function loadCheckout(userId) {
  const [user, cart, addresses] = await Promise.all([
    fetchUser(userId),
    fetchCart(userId),
    fetchAddresses(userId),
  ]);
  return { user, cart, addresses };
}

// Error handling
async function placeOrder(orderData) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error(`Order failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    logToSentry(error);
    showToast("Order failed. Please try again.");
    throw error;
  }
}

// Execution order demo
async function demo() {
  console.log("A");
  await Promise.resolve();
  console.log("B"); // microtask — after sync code
}
console.log("C");
demo();
console.log("D");
// C → A → D → B
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Arrow Functions

### Theory

Arrow functions (`() => {}`) are a concise function syntax introduced in ES6. Key differences from regular functions:

| Feature             | Regular function            | Arrow function                           |
| ------------------- | --------------------------- | ---------------------------------------- |
| `this`              | Dynamic — depends on caller | Lexical — inherited from enclosing scope |
| `arguments`         | Available                   | Not available — use rest `...args`       |
| `new` / constructor | Can be used with `new`      | Cannot                                   |
| `prototype`         | Has `.prototype`            | No                                       |
| Syntax              | Verbose                     | Concise, implicit return                 |

### Pros & Cons

| Pros                                  | Cons                                         |
| ------------------------------------- | -------------------------------------------- |
| Concise syntax                        | No `this` binding — wrong for object methods |
| Implicit return for expressions       | Can't be used as constructors                |
| Great for callbacks and array methods | No `arguments` object                        |
| Lexical `this` fixes callback bugs    | Not ideal for prototype methods              |

### Real-Life Example

```javascript
// Concise syntax
const double = (x) => x * 2;
const sum = (a, b) => a + b;
const getUser = (id) => ({ id, name: "Amit" }); // implicit return object

// Array methods — arrow functions shine
const prices = [299, 49, 79, 150];
const withTax = prices.map((p) => p * 1.05);
const affordable = prices.filter((p) => p < 100);
const total = prices.reduce((sum, p) => sum + p, 0);

// Lexical this — fixes callback bug
const store = {
  products: ["Biryani", "Naan"],
  printAll() {
    // ❌ Regular function loses `this`
    this.products.forEach(function (p) {
      // console.log(this.category, p);
    });
    // ✅ Arrow inherits `this`
    this.products.forEach((p) => {
      console.log(this.products.length, p); // works
    });
  },
};

// When NOT to use arrow functions
const obj = {
  name: "Test",
  regular() { return this.name; },     // "Test"
  arrow: () => this?.name,             // undefined (lexical this)
};

// React event handlers — both work in function components
<button onClick={() => handleClick(id)}>Click</button>
<button onClick={handleClick}>Click</button>
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Destructuring

### Theory

**Destructuring** extracts values from arrays or properties from objects into distinct variables. It works in assignments, function parameters, and nested structures.

Supports defaults, renaming, and rest patterns.

### Pros & Cons

| Pros                             | Cons                                            |
| -------------------------------- | ----------------------------------------------- |
| Cleaner variable extraction      | Can be overused on deeply nested data           |
| Self-documenting function params | Undefined nested destructuring throws           |
| Easy swap without temp variable  | Defaults only apply for `undefined`, not `null` |

### Real-Life Example

```javascript
// Object destructuring
const user = { id: "u_1", name: "Amit", email: "amit@test.com", role: "admin" };
const { name, email, role = "user" } = user;
const { id: userId } = user; // rename

// Nested
const order = {
  id: "ORD-1",
  customer: { name: "Rahul", city: "Delhi" },
  items: [{ name: "Biryani", price: 299 }],
};
const {
  customer: { name: customerName },
  items: [firstItem],
} = order;

// Array destructuring
const [first, second, ...rest] = [10, 20, 30, 40];
// first=10, second=20, rest=[30,40]

// Function parameters
function renderOrder({ id, status, items = [] }) {
  return `Order ${id}: ${status} (${items.length} items)`;
}

// Swap without temp
let a = 1,
  b = 2;
[a, b] = [b, a];

// React — props destructuring
function ProductCard({ name, price, image, onAddToCart }) {
  return (
    <div>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>₹{price}</p>
      <button onClick={onAddToCart}>Add</button>
    </div>
  );
}

// API response
const {
  data: restaurants,
  meta: { total, page },
} = await apiResponse;
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Spread & Rest Operators

### Theory

Both use `...` syntax but serve opposite purposes:

| Operator   | Context                            | Action                                            |
| ---------- | ---------------------------------- | ------------------------------------------------- |
| **Spread** | Arrays, objects, function calls    | **Expands** iterable into individual elements     |
| **Rest**   | Function parameters, destructuring | **Collects** remaining elements into array/object |

### Pros & Cons

| Pros                              | Cons                                      |
| --------------------------------- | ----------------------------------------- |
| Immutable updates (copy + modify) | Shallow copy only — nested objects shared |
| Clean function argument handling  | Can be confusing spread vs rest           |
| Merge objects/arrays easily       | Performance cost on very large arrays     |

### Real-Life Example

```javascript
// SPREAD — arrays
const cart = [item1, item2];
const updatedCart = [...cart, item3]; // add
const withoutFirst = [...cart.slice(1)]; // or cart.filter
const merged = [...cartA, ...cartB];

// SPREAD — objects (immutable state update)
const user = { name: "Amit", role: "user" };
const updated = { ...user, role: "admin" }; // override one field
const withDefaults = { theme: "light", ...user }; // user overrides defaults

// SPREAD — function calls
Math.max(...prices);
fetchOrder(...orderIds);

// REST — function parameters
function createOrder(customerId, ...items) {
  console.log(items); // array of all remaining args
  return { customerId, items };
}
createOrder("c_1", { id: 1 }, { id: 2 });

// REST — destructuring
const [head, ...tail] = [1, 2, 3, 4]; // head=1, tail=[2,3,4]
const { name, ...rest } = user; // rest = all other properties

// React state update
setFilters((prev) => ({ ...prev, city: "Delhi", page: 1 }));
setItems((prev) => prev.filter((i) => i.id !== removedId));
```

```javascript
// ⚠️ Shallow copy trap
const state = { user: { name: "Amit" }, cart: [] };
const copy = { ...state };
copy.user.name = "Rahul";
console.log(state.user.name); // "Rahul" — nested object is shared!
// Fix: structuredClone(state) or deep merge
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Map, Filter & Reduce

### Theory

These are **higher-order array methods** that transform data without mutating the original array.

| Method   | Returns                 | Purpose                          |
| -------- | ----------------------- | -------------------------------- |
| `map`    | New array (same length) | Transform each element           |
| `filter` | New array (≤ length)    | Keep elements matching condition |
| `reduce` | Single value            | Accumulate into one result       |

All accept a callback `(element, index, array)` and optional `thisArg`.

### Pros & Cons

| Pros                        | Cons                                              |
| --------------------------- | ------------------------------------------------- |
| Declarative, readable       | Can't short-circuit (use `for` loop with `break`) |
| Immutable — no side effects | Chaining creates intermediate arrays              |
| Chainable                   | Slightly slower than manual loop for hot paths    |

### Real-Life Example

```javascript
const products = [
  { id: 1, name: "Biryani", price: 299, category: "main", rating: 4.5 },
  { id: 2, name: "Naan", price: 49, category: "bread", rating: 4.0 },
  { id: 3, name: "Lassi", price: 79, category: "drink", rating: 4.2 },
  { id: 4, name: "Kebab", price: 199, category: "main", rating: 4.8 },
];

// map — transform for UI
const menuItems = products.map((p) => ({
  label: `${p.name} — ₹${p.price}`,
  value: p.id,
}));

// filter — show only highly rated mains under ₹300
const affordable = products.filter(
  (p) => p.category === "main" && p.rating >= 4.5 && p.price <= 300,
);

// reduce — calculate cart total
const cart = [
  { id: 1, qty: 2 },
  { id: 2, qty: 4 },
];
const total = cart.reduce((sum, item) => {
  const product = products.find((p) => p.id === item.id);
  return sum + product.price * item.qty;
}, 0);
// 299*2 + 49*4 = 794

// Chaining
const summary = products
  .filter((p) => p.rating >= 4.0)
  .map((p) => p.name)
  .reduce((acc, name) => acc + name + ", ", "");

// reduce can implement map and filter
const doubled = [1, 2, 3].reduce((acc, n) => [...acc, n * 2], []);
```

```jsx
// React — primary list rendering pattern
function ProductList({ products }) {
  return (
    <ul>
      {products
        .filter((p) => p.inStock)
        .map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
    </ul>
  );
}
```

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Object Methods

### Theory

JavaScript provides built-in static methods on `Object` and instance methods on `Object.prototype` for creating, copying, comparing, and iterating objects.

### Key methods

| Method                              | Purpose                                 |
| ----------------------------------- | --------------------------------------- |
| `Object.keys(obj)`                  | Array of own enumerable property names  |
| `Object.values(obj)`                | Array of own enumerable property values |
| `Object.entries(obj)`               | Array of `[key, value]` pairs           |
| `Object.assign(target, ...sources)` | Shallow copy/merge                      |
| `Object.freeze(obj)`                | Prevent all mutations                   |
| `Object.seal(obj)`                  | Prevent add/delete, allow modify        |
| `Object.hasOwn(obj, key)`           | Safe own-property check                 |
| `Object.fromEntries(arr)`           | Inverse of `entries`                    |
| `Object.create(proto)`              | Create with specific prototype          |

### Pros & Cons

| Object static methods                       | Manual iteration                     |
| ------------------------------------------- | ------------------------------------ |
| ✅ Standard, well-supported                 | ❌ Verbose                           |
| ✅ Composable (entries → map → fromEntries) | ❌ Easy to miss non-enumerable props |
| `Object.freeze` for immutability            | `freeze` is shallow only             |

### Real-Life Example

```javascript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};

// Iterate
Object.keys(config).forEach((key) => console.log(key, config[key]));
Object.entries(config).map(([k, v]) => `${k}=${v}`);

// Merge configs
const defaults = { timeout: 3000, retries: 1 };
const finalConfig = { ...defaults, ...config };

// Transform object
const inverted = Object.fromEntries(
  Object.entries(config).map(([k, v]) => [k.toUpperCase(), v]),
);

// Safe property check
Object.hasOwn(config, "apiUrl"); // true
Object.hasOwn(config, "toString"); // false (inherited)

// Freeze for constants
const TAX_RATES = Object.freeze({
  GST: 0.05,
  SERVICE: 0.1,
});
// TAX_RATES.GST = 0.08; // silent fail (strict: TypeError)

// Clone
const shallow = { ...config };
const deep = structuredClone(config);
```

```javascript
// Real-life: Form state to API payload
const formState = { name: "Amit", email: "a@b.com", phone: "" };
const payload = Object.fromEntries(
  Object.entries(formState).filter(([_, v]) => v !== ""),
);
// { name: "Amit", email: "a@b.com" }
```

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Type Coercion

### Theory

**Type coercion** is JavaScript automatically converting one data type to another during operations. It happens with `==`, `+`, comparison operators, and logical operators.

- **Implicit coercion** — JS converts automatically (`"5" + 1` → `"51"`)
- **Explicit coercion** — you convert intentionally (`Number("5")`, `String(42)`)

`===` does **not** coerce — always prefer it over `==`.

### Pros & Cons

| Implicit coercion           | Strict equality (===)          |
| --------------------------- | ------------------------------ |
| ✅ Flexible, forgiving      | ✅ Predictable, no surprises   |
| ❌ `"0" == false` is true   | ❌ Must convert types yourself |
| ❌ Source of countless bugs | ✅ Industry standard           |

### Real-Life Example

```javascript
// == coercion rules (avoid ==)
0 == false; // true
"" == false; // true
null == undefined; // true
"5" == 5; // true
[] == false; // true
![] == false; // false (quirky)

// === — no coercion
0 === false; // false
"5" === 5; // false

// + operator coercion
"5" + 1; // "51" (string concat)
"5" - 1; // 4 (string → number)
true + true; // 2
[] + []; // "" (both toString to "")

// Explicit conversion — preferred
Number("42"); // 42
Number(""); // 0
Number("abc"); // NaN
parseInt("42px"); // 42
String(42); // "42"
Boolean(""); // false
Boolean("hello"); // true
!!value; // common boolean cast

// Falsy values (all coerce to false)
// false, 0, -0, 0n, "", null, undefined, NaN

// Nullish coalescing — only null/undefined
const port = config.port ?? 3000; // 0 is valid, unlike ||
const name = user.name ?? "Guest";
```

```javascript
// Real-life: Safe number from form input
function getQuantity(input) {
  const qty = Number(input);
  return Number.isFinite(qty) && qty > 0 ? qty : 1;
}
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Debounce vs Throttle

### Theory

Both control execution frequency of functions during rapid events:

- **Debounce** — wait until activity **stops**, then execute **once**
- **Throttle** — execute at most **once per time window** during continuous activity

### Pros & Cons

| Debounce                           | Throttle                         |
| ---------------------------------- | -------------------------------- |
| ✅ Minimizes executions (API cost) | ✅ Regular updates during scroll |
| ✅ Great for search, auto-save     | ✅ Immediate first response      |
| ❌ Delays until pause              | ❌ May miss final event          |
|                                    | ❌ More calls than debounce      |

### Real-Life Example

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
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

// Debounce — restaurant search
const search = debounce((q) => {
  fetch(`/api/restaurants?q=${q}`).then(renderResults);
}, 300);

// Throttle — infinite scroll position tracker
const onScroll = throttle(() => {
  if (nearBottom()) loadMoreItems();
}, 200);

// Throttle — prevent double-submit on payment button
const handlePay = throttle(() => processPayment(), 2000);
```

| Scenario                      | Use      |
| ----------------------------- | -------- |
| Search input                  | Debounce |
| Window resize (layout recalc) | Debounce |
| Scroll handler                | Throttle |
| Mouse move / drag             | Throttle |
| Auto-save form                | Debounce |
| API rate limiting             | Throttle |

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. Memory Management

### Theory

JavaScript uses **automatic garbage collection** — memory for unreachable objects is reclaimed. The primary algorithm is **mark-and-sweep**: GC marks all objects reachable from roots (global, call stack, closures), then frees unmarked objects.

V8 uses **generational GC**: young generation (short-lived objects, frequent Scavenge) and old generation (long-lived, Mark-Sweep-Compact).

### Common memory leak causes

1. Global variables holding references
2. Forgotten timers and intervals
3. Event listeners not removed
4. Closures holding large objects
5. Detached DOM nodes still referenced in JS
6. Unbounded caches

### Pros & Cons

| Automatic GC                           | Manual memory management (C/C++)            |
| -------------------------------------- | ------------------------------------------- |
| ✅ Developer doesn't free memory       | ✅ Predictable memory usage                 |
| ❌ GC pauses can affect performance    | ❌ Manual errors (leaks, dangling pointers) |
| ❌ Leaks still possible via references |                                             |

### Real-Life Example

```javascript
// ❌ Memory leak — global cache grows forever
const cache = {};
function fetchUser(id) {
  if (!cache[id]) cache[id] = expensiveFetch(id);
  return cache[id];
}

// ✅ Bounded cache with LRU or WeakMap
const cache = new Map();
const MAX_SIZE = 100;
function fetchUserCached(id) {
  if (cache.has(id)) return cache.get(id);
  const result = expensiveFetch(id);
  if (cache.size >= MAX_SIZE) cache.delete(cache.keys().next().value);
  cache.set(id, result);
  return result;
}

// ❌ Leak — closure holds large data
function setupHandler() {
  const hugeData = new Array(1e6).fill("x");
  return () => console.log(hugeData.length); // hugeData never freed
}

// ✅ Cleanup pattern
function setupPolling(callback) {
  const intervalId = setInterval(callback, 5000);
  return () => clearInterval(intervalId); // caller cleans up
}

// WeakMap — doesn't prevent GC of keys
const domMetadata = new WeakMap();
function attachMetadata(element, data) {
  domMetadata.set(element, data);
  // When element is removed from DOM and unreferenced, entry is GC'd
}
```

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Common JavaScript Gotchas

### Theory

JavaScript has quirks from its design history. Interviewers test whether you know the traps — not to trick you, but to verify deep understanding.

### Top gotchas

### Real-Life Example

#### 1. `typeof null === "object"`

```javascript
typeof null; // "object" — historical bug
null === null; // true — use this instead
```

#### 2. Floating point precision

```javascript
0.1 + 0.2 === 0.3; // false (0.30000000000000004)
// Fix: Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON
// Or: use integers (paise not rupees)
const totalPaise = 10 + 20; // 30 paise
const total = totalPaise / 100; // 0.3
```

#### 3. `==` vs `===`

```javascript
[] == false; // true
[] === false; // false
// Always use ===
```

#### 4. Closure in loop with `var`

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}
// Fix: use let
```

#### 5. `this` in callbacks

```javascript
const obj = {
  name: "Amit",
  getName() {
    return this.name;
  },
};
const fn = obj.getName;
fn(); // undefined — lost context
// Fix: fn = obj.getName.bind(obj) or arrow in class field
```

#### 6. Array holes

```javascript
const arr = [1, , 3];
arr.map((x) => x * 2); // [2, empty, 6] — skips empty slot
arr.length; // 3
```

#### 7. `parseInt` without radix

```javascript
parseInt("08"); // 8 (modern) but was octal in old ES3
parseInt("08", 10); // always safe
```

#### 8. JSON.stringify limitations

```javascript
JSON.stringify({ a: undefined, b: function () {} });
// '{"b":{}}' — undefined and functions omitted
JSON.stringify({ date: new Date() });
// '{"date":"2026-03-15T..."}' — Date becomes string
```

#### 9. NaN is not equal to itself

```javascript
NaN === NaN; // false
Number.isNaN(NaN); // true
isNaN("hello"); // true (coerces!)
Number.isNaN("hello"); // false
```

#### 10. Sort mutates and is lexicographic by default

```javascript
[10, 2, 1].sort(); // [1, 10, 2] — string sort!
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]
```

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. Best Practices

### Theory

Production JavaScript follows conventions that reduce bugs, improve readability, and make code maintainable at scale. These apply to any frontend project — React, Vue, or vanilla.

### Core principles

| Principle         | Practice                                         |
| ----------------- | ------------------------------------------------ |
| Use strict mode   | `"use strict"` or ES modules (strict by default) |
| Prefer `const`    | Default to `const`, `let` only when needed       |
| Strict equality   | Always `===` and `!==`                           |
| Explicit types    | TypeScript for large projects                    |
| Immutable updates | Spread, map, filter — never mutate               |
| Handle errors     | try/catch on async, validate inputs              |
| Meaningful names  | `fetchUserOrders` not `getData`                  |
| Small functions   | One responsibility per function                  |
| Avoid globals     | Module scope, IIFE, or bundler                   |
| Lint and format   | ESLint + Prettier in CI                          |

### Pros & Cons

| Following best practices | Cutting corners             |
| ------------------------ | --------------------------- |
| ✅ Fewer production bugs | ❌ Technical debt compounds |
| ✅ Easier onboarding     | ❌ Harder code reviews      |
| ✅ Safer refactoring     | ❌ Inconsistent codebase    |
| Small upfront cost       | Large cleanup cost later    |

### Real-Life Example

```javascript
// ❌ Bad practices
var data = fetchData();
if ((data = null)) {
}
function calc(a, b, c, d, e) {
  return a + b + c + d + e;
}
arr.sort();

// ✅ Good practices
const DEFAULT_PAGE_SIZE = 20;

async function fetchOrders({ userId, page = 1, limit = DEFAULT_PAGE_SIZE }) {
  if (!userId) throw new Error("userId is required");

  try {
    const response = await fetch(
      `/api/users/${userId}/orders?page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    logger.error("fetchOrders failed", { userId, error });
    throw error;
  }
}

function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function sortByPriceAscending(products) {
  return [...products].sort((a, b) => a.price - b.price);
}
```

```javascript
// ESLint rules worth enabling
// .eslintrc
{
  "rules": {
    "eqeqeq": ["error", "always"],
    "no-var": "error",
    "prefer-const": "error",
    "no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**Quick checklist before shipping:**

- [ ] No `var`, no `==`
- [ ] All async has error handling
- [ ] No secrets in client code
- [ ] Inputs validated before API calls
- [ ] Event listeners and timers cleaned up
- [ ] `npm audit` passes
- [ ] TypeScript strict mode (if using TS)

---

# Quick Revision Cheat Sheet

| Topic             | One-liner                                     |
| ----------------- | --------------------------------------------- |
| var/let/const     | const default; block scope for let/const; TDZ |
| Data types        | 7 primitives + object; typeof null quirk      |
| Hoisting          | var→undefined; let/const→TDZ; function→full   |
| Scope chain       | Inner → outer → global; lexical scoping       |
| this              | Depends on call site; arrow = lexical         |
| Closures          | Function + captured environment               |
| Prototype         | Objects inherit via `[[Prototype]]` chain     |
| Event loop        | Sync → microtasks → macrotask                 |
| Promises          | pending/fulfilled/rejected; .then/.catch      |
| async/await       | Promise sugar; await = microtask pause        |
| Arrow functions   | Lexical this; no arguments; concise           |
| Destructuring     | Extract from arrays/objects; defaults         |
| Spread/rest       | Expand vs collect with `...`                  |
| map/filter/reduce | Transform, select, accumulate                 |
| Object methods    | keys, values, entries, assign, freeze         |
| Type coercion     | Prefer ===; explicit Number/String            |
| Debounce/throttle | Pause vs rate-limit                           |
| Memory            | GC mark-and-sweep; avoid leaks                |
| Gotchas           | null typeof, 0.1+0.2, sort, NaN               |
| Best practices    | const, ===, immutability, TypeScript, ESLint  |

---

_Master these 20 concepts and you cover the majority of JavaScript questions in frontend interviews. Practice explaining each with a real example from your projects — that's what interviewers remember._


<p><a href="#i20">Back to index</a></p>
