---
title: "JavaScript Interview Questions & Answers (MERN)"
description: "10 essential JavaScript interview topics — var/let/const, closures, hoisting, this, promises, async/await, and more."
tags: ["javascript", "mern", "interview", "closures", "async"]
level: "All levels"
---

# General / JavaScript Interview Questions & Answers

---

## Table of Contents

1. [var, let and const](#1-what-is-the-difference-between-var-let-and-const)
2. [Closures](#2-what-are-closures-in-javascript)
3. [Hoisting](#3-what-is-hoisting-in-javascript)
4. [this keyword](#4-what-is-the-this-keyword)
5. [== vs ===](#5-what-is-the-difference-between--and-)
6. [Promises](#6-what-are-promises)
7. [async/await](#7-what-is-asyncawait)
8. [Event delegation](#8-what-is-event-delegation)
9. [Debounce and throttle](#9-what-is-debounce-and-throttle)
10. [Deep copy vs shallow copy](#10-what-is-deep-copy-and-shallow-copy)

---

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
