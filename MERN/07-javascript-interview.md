---
title: "JavaScript Interview Questions & Answers (MERN)"
description: "10 essential JavaScript interview topics — var/let/const, closures, hoisting, this, promises, async/await, and more."
tags: ["javascript", "mern", "interview", "closures", "async"]
level: "All levels"
---

# General / JavaScript Interview Questions & Answers

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [var, let and const](#p1) |
| <span id="i2"></span>2 | [Closures](#p2) |
| <span id="i3"></span>3 | [Hoisting](#p3) |
| <span id="i4"></span>4 | [this keyword](#p4) |
| <span id="i5"></span>5 | [== vs ===](#p5) |
| <span id="i6"></span>6 | [Promises](#p6) |
| <span id="i7"></span>7 | [async/await](#p7) |
| <span id="i8"></span>8 | [Event delegation](#p8) |
| <span id="i9"></span>9 | [Debounce and throttle](#p9) |
| <span id="i10"></span>10 | [Deep copy vs shallow copy](#p10) |

---

<a id="p1"></a>

## 1. What is the difference between var, let and const?

### Theory

|          | var       | let   | const |
| -------- | --------- | ----- | ----- |
| Scope    | Function  | Block | Block |
| Reassign | ✅        | ✅    | ❌    |
| Hoist    | undefined | TDZ   | TDZ   |

### Real Example

```javascript
if (true) {
  var a = 1;
  let b = 2;
  const c = 3;
}
console.log(a); // 1
// console.log(b); // ReferenceError

const user = { name: "Rahul" };
user.name = "Amit"; // OK — mutate object
// user = {};     // TypeError
```

### Interview Answer

> Use `const` by default, `let` when reassigning, avoid `var` — block scope and TDZ prevent loop and scope bugs.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What are closures in JavaScript?

### Theory

A **closure** is a function that remembers variables from its **lexical scope** even after the outer function returns.

### Real Example

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    get: () => count,
  };
}

const counter = createCounter();
counter.increment();
console.log(counter.get()); // 1
```

```javascript
// MERN — module pattern for API config
function createApiClient(baseURL) {
  return (path) => fetch(`${baseURL}${path}`);
}
const api = createApiClient("http://localhost:5000/api");
```

### Interview Answer

> A closure is an inner function that retains access to outer variables — used for private state, factories, and callbacks.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What is hoisting in JavaScript?

### Theory

Declarations are processed before execution. `var` → `undefined`; `let`/`const` → TDZ; `function` declarations → fully available.

### Real Example

```javascript
console.log(fn()); // works
function fn() {
  return "hoisted";
}

// console.log(x); // ReferenceError
let x = 10;
```

### Interview Answer

> Hoisting moves declarations to the top of scope — `var` is undefined until assigned; `let`/`const` throw in TDZ until their line runs.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is the this keyword?

### Theory

`this` depends on **call site**: method call (object), `new` (instance), `call/apply/bind` (explicit), arrow functions (lexical).

### Real Example

```javascript
const obj = {
  name: "MERN",
  greet() {
    return this.name;
  },
};

obj.greet(); // "MERN"
const fn = obj.greet;
fn(); // undefined (strict mode)

const bound = obj.greet.bind(obj);
bound(); // "MERN"
```

### Interview Answer

> `this` is determined by how a function is called — use arrow functions or `bind` when passing callbacks to preserve context.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. What is the difference between == and ===?

### Real Example

```javascript
console.log(0 == false); // true
console.log(0 === false); // false
console.log("" == false); // true
console.log(null == undefined); // true
```

### Interview Answer

> `===` compares without coercion — always prefer it; `==` coerces types and causes subtle bugs.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. What are promises?

### Theory

A **Promise** represents async completion: `pending` → `fulfilled` or `rejected`.

### Real Example

```javascript
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Not found");
      return res.json();
    })
    .then((user) => console.log(user))
    .catch((err) => console.error(err));
}

Promise.all([fetch("/api/a"), fetch("/api/b")]).then(([a, b]) =>
  Promise.all([a.json(), b.json()]),
);
```

### Interview Answer

> Promises handle async results with `.then`/`.catch` — chain them for sequential async or `Promise.all` for parallel requests.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. What is async/await?

### Theory

Syntactic sugar over Promises — `async` functions return Promises; `await` pauses until resolution.

### Real Example

```javascript
async function loadDashboard() {
  try {
    const [user, orders] = await Promise.all([
      fetch("/api/me").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]);
    return { user, orders };
  } catch (err) {
    console.error("Dashboard failed:", err);
    throw err;
  }
}
```

### Interview Answer

> `async/await` writes asynchronous code synchronously — use `try/catch` for errors and `Promise.all` for parallel MERN API calls.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. What is event delegation?

### Theory

Attach one listener on a **parent**; handle events from children via `event.target` — works for dynamic lists.

### Real Example

```javascript
document.querySelector("#product-list").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add-cart]");
  if (!btn) return;
  const id = btn.dataset.productId;
  addToCart(id);
});
```

```jsx
// React — usually direct handlers, delegation for native DOM
<ul onClick={(e) => {
  if (e.target.tagName === 'LI') handleSelect(e.target.dataset.id);
}}>
```

### Interview Answer

> Event delegation listens on a parent and uses bubbling to handle child events — efficient for dynamic MERN lists without per-item listeners.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. What is debounce and throttle?

### Theory

|      | Debounce                  | Throttle                      |
| ---- | ------------------------- | ----------------------------- |
| Idea | Run after pause in events | Run at most once per interval |
| Use  | Search input              | Scroll, resize                |

### Real Example

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((q) => fetch(`/api/search?q=${q}`), 300);

function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### Interview Answer

> Debounce waits until the user stops typing before calling the API; throttle limits execution rate for scroll handlers.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. What is deep copy and shallow copy?

### Theory

|                | Shallow                 | Deep                          |
| -------------- | ----------------------- | ----------------------------- |
| Nested objects | Shared reference        | Independent copy              |
| Methods        | spread, `Object.assign` | `structuredClone`, JSON trick |

### Real Example

```javascript
const original = { a: 1, nested: { b: 2 } };

// Shallow
const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b); // 99 — shared

// Deep
const deep = structuredClone(original);
deep.nested.b = 0;
console.log(original.nested.b); // 99 — unchanged
```

### Interview Answer

> Shallow copy duplicates top-level only; deep copy clones nested objects — use `structuredClone` for state snapshots in React.

---

**Deep dive:** [Javascript/kpmg-round-1-vanilla-javascript-interview.md](../Javascript/kpmg-round-1-vanilla-javascript-interview.md) · [React/07-javascript-interview-concepts-cheat-sheet.md](../React/07-javascript-interview-concepts-cheat-sheet.md)


<p><a href="#i10">Back to index</a></p>
