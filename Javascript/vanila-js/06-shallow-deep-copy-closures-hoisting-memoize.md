---
title: 'Shallow Copy, Deep Copy, Memoize, Hoisting & Closures'
description: 'Interview fundamentals with theory, output problems, and spoken answers — intermediate to senior.'
tags:
  [
    'javascript',
    'closure',
    'hoisting',
    'shallow-copy',
    'deep-copy',
    'memoize',
    'interview',
  ]
level: 'Intermediate to Senior'
---

# Shallow Copy · Deep Copy · Memoize · Hoisting · Closures

Core JavaScript fundamentals that appear in **every** mid/senior interview — often as **output questions** or **implement this** live coding.

---

<a id="quick-index"></a>

## Quick index


### Copying

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Shallow copy](#p1) |
| <span id="i2"></span>2 | [Deep copy](#p2) |
| <span id="i3"></span>3 | [Shallow vs deep — comparison table](#p3) |

### Patterns

| # | Section |
| --- | --- |
| <span id="i4"></span>4 | [Memoize](#p4) |
| <span id="i5"></span>5 | [Hoisting & TDZ](#p5) |
| <span id="i6"></span>6 | [Closures](#p6) |

### Output problems (with answers)

| # | Section |
| --- | --- |
| <span id="i7"></span>7 | [Hoisting output questions](#p7) |
| <span id="i8"></span>8 | [Closure output questions](#p8) |
| <span id="i9"></span>9 | [Copy-related output questions](#p9) |

### Interview pack

| # | Section |
| --- | --- |
| <span id="i10"></span>10 | [One-line answers cheat sheet](#p10) |

---

<a id="p1"></a>

## 1. Shallow copy

**Definition:** A new container (object/array) is created, but **nested values are still shared by reference**.

**Interview answer:**

> Shallow copy duplicates the top level only. Nested objects and arrays point to the same memory — mutating `copy.nested.x` changes the original too.

### Arrays — shallow copy methods

```javascript
const original = [1, 2, { id: 3 }];

// 1. Spread
const a = [...original];

// 2. slice() — whole array
const b = original.slice();

// 3. Array.from
const c = Array.from(original);

// 4. concat
const d = [].concat(original);

a.push(99);
console.log(original.length); // 3 — top level separate

a[2].id = 999;
console.log(original[2].id); // 999 — nested object SHARED
```

### Objects — shallow copy methods

```javascript
const user = {
  name: 'Alice',
  address: { city: 'NYC' },
};

// 1. Spread
const copy1 = { ...user };

// 2. Object.assign
const copy2 = Object.assign({}, user);

copy1.name = 'Bob';
console.log(user.name); // 'Alice' — primitive copied

copy1.address.city = 'LA';
console.log(user.address.city); // 'LA' — nested SHARED
```

### When shallow copy is enough

- Flat objects with only primitives
- Immutable update of one level: `{ ...state, count: state.count + 1 }`
- Redux/React state updates at a known depth (spread each level you change)

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Deep copy

**Definition:** Recursively copies nested structures so **no references are shared** between original and copy.

**Interview answer:**

> Deep copy clones the full tree. I use `structuredClone` in modern browsers/Node, or a library for edge cases. `JSON.parse(JSON.stringify())` only works for plain JSON data.

### Method 1: `structuredClone` (recommended)

```javascript
const original = {
  name: 'Alice',
  joined: new Date('2024-01-15'),
  tags: ['admin'],
  meta: new Map([['role', 'lead']]),
  nested: { score: 90 },
};

const deep = structuredClone(original);
deep.nested.score = 0;
deep.tags.push('beta');

console.log(original.nested.score); // 90
console.log(original.tags); // ['admin']
```

**Limitations:** Cannot clone functions, DOM nodes, symbols, or circular references.

### Method 2: `JSON.parse(JSON.stringify())`

```javascript
const data = { a: 1, nested: { b: 2 } };
const copy = JSON.parse(JSON.stringify(data));
```

| Lost / broken | Why                |
| ------------- | ------------------ |
| `undefined`   | Omitted in objects |
| `function`    | Omitted            |
| `Date`        | Becomes string     |
| `Map`, `Set`  | Empty `{}` / `[]`  |
| `Symbol`      | Omitted            |
| Circular refs | Throws             |

### Method 3: Recursive deep clone (interview implementation)

```javascript
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value);

  if (Array.isArray(value)) {
    const arr = [];
    seen.set(value, arr);
    value.forEach((item, i) => {
      arr[i] = deepClone(item, seen);
    });
    return arr;
  }

  const obj = {};
  seen.set(value, obj);
  for (const key of Object.keys(value)) {
    obj[key] = deepClone(value[key], seen);
  }
  return obj;
}
```

**Senior note:** `WeakMap` handles circular references — mention this in interviews.

### Method 4: `lodash.cloneDeep` / Immer

Production code often uses battle-tested libraries or **Immer** for immutable updates without manual deep cloning entire trees.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Shallow vs deep — comparison table

| Technique                      | Depth   | Mutates original nested? | Date/Map/Fn        |
| ------------------------------ | ------- | ------------------------ | ------------------ |
| `[...arr]` / `{ ...obj }`      | Shallow | Yes                      | N/A                |
| `Object.assign({}, obj)`       | Shallow | Yes                      | N/A                |
| `arr.slice()`                  | Shallow | Yes                      | N/A                |
| `JSON.parse(JSON.stringify())` | Deep    | No                       | Breaks             |
| `structuredClone`              | Deep    | No                       | Most types         |
| Custom `deepClone`             | Deep    | No                       | If you handle them |

### Live-coding: safe nested update (React/Redux pattern)

```javascript
// Shallow at each level — NOT full deep clone
const nextState = {
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      city: 'LA',
    },
  },
};
```

**Interview answer:**

> I don't deep-clone entire Redux state — I shallow-copy each level on the path that changes. Full deep clone is for duplicating unknown nested API payloads.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Memoize

**Definition:** A **higher-order function** that caches results by arguments so repeated calls return cached value without re-running expensive logic.

**Interview answer:**

> Memoize wraps a pure function with a cache (usually `Map`). Same inputs → return stored output. Used for expensive calculations, selectors, and API deduplication — not for functions with side effects.

### Basic implementation

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### Usage

```javascript
function slowSquare(n) {
  console.log('computing', n);
  return n * n;
}

const fastSquare = memoize(slowSquare);
fastSquare(5); // logs "computing 5" → 25
fastSquare(5); // cache hit — no log → 25
```

### Improved key — objects as arguments

```javascript
function memoizeWithResolver(fn, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fetchUser = memoizeWithResolver(
  (id) => api.getUser(id),
  (id) => id
);
```

### Pitfalls (senior)

| Pitfall                    | Fix                                          |
| -------------------------- | -------------------------------------------- |
| Unbounded cache growth     | LRU cache with max size                      |
| `JSON.stringify` key order | Custom resolver / `Map` with object identity |
| Non-pure functions         | Don't memoize — stale side effects           |
| `this` binding             | Use `fn.apply(this, args)`                   |

### React connection

- `useMemo(() => compute(a, b), [a, b])` — memoize a **value**
- `useCallback(fn, deps)` — memoize a **function reference**
- Reselect `createSelector` — memoized derived state (like cart totals in `09-shopping-cart`)

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Hoisting & Temporal Dead Zone (TDZ)

**Hoisting:** JS engine registers declarations in scope **before** execution runs line-by-line. **Initialization** timing differs by declaration type.

| Declaration                                   | Hoisted?     | Usable before line? | Initial value |
| --------------------------------------------- | ------------ | ------------------- | ------------- |
| `var`                                         | Yes          | Yes                 | `undefined`   |
| `let`                                         | Yes (TDZ)    | No — ReferenceError | —             |
| `const`                                       | Yes (TDZ)    | No — ReferenceError | —             |
| `function` declaration                        | Yes          | Yes                 | Fully defined |
| `function` expression (`const fn = function`) | Like `const` | No                  | —             |
| `class`                                       | Yes (TDZ)    | No                  | —             |

**Interview answer:**

> `var` is hoisted and initialized to `undefined`. `let`/`const` are hoisted but sit in the TDZ until their line runs — accessing them early throws. Function declarations are fully hoisted.

### Example

```javascript
console.log(typeof myVar); // 'undefined'
var myVar = 1;

// console.log(myLet)     // ReferenceError — TDZ
let myLet = 2;

greet(); // 'Hello' — function declaration hoisted
function greet() {
  console.log('Hello');
}

// sayHi()                 // TypeError or ReferenceError — const not initialized
const sayHi = function () {
  console.log('Hi');
};
```

### `var` in blocks

```javascript
for (var i = 0; i < 3; i++) {}
console.log(i); // 3 — var is function-scoped, not block-scoped
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Closures

**Definition:** A function that **remembers variables from its outer (lexical) scope** even after the outer function has finished executing.

**Interview answer:**

> A closure is a function plus its surrounding scope. Inner functions access outer variables after the outer returns — I use this for privacy, factories, debounce timers, and module patterns.

### Basic closure

```javascript
function outer() {
  const secret = 42;
  return function inner() {
    return secret;
  };
}

const getSecret = outer();
getSecret(); // 42 — outer finished, but inner still closes over `secret`
```

### Module pattern — private state

```javascript
function createWallet(initial = 0) {
  let balance = initial;
  return {
    deposit(amount) {
      balance += amount;
    },
    withdraw(amount) {
      if (amount <= balance) balance -= amount;
    },
    getBalance() {
      return balance;
    },
  };
}

const wallet = createWallet(100);
wallet.deposit(50);
wallet.getBalance(); // 150
// balance is not accessible directly — private via closure
```

### Counter factory (separate instances)

```javascript
function createCounter() {
  let count = 0;
  return {
    inc: () => ++count,
    dec: () => --count,
    get: () => count,
  };
}

const a = createCounter();
const b = createCounter();
a.inc();
a.inc();
console.log(a.get(), b.get()); // 2, 0 — separate closures
```

### Debounce uses closure

```javascript
function debounce(fn, wait) {
  let timerId; // closed over by returned function
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), wait);
  };
}
```

### Memory leak warning (senior)

Closures keep outer variables alive. Attaching closures to DOM nodes that outlive the data can leak memory — null out references or use WeakMap for caches.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Hoisting output questions

### Problem 1

```javascript
console.log(x);
var x = 10;
console.log(x);
```

<details>
<summary>Answer</summary>

```
undefined
10
```

`var x` is hoisted; first log sees `undefined`, then assignment runs.

</details>

---

### Problem 2

```javascript
console.log(y);
let y = 10;
```

<details>
<summary>Answer</summary>

```
ReferenceError: Cannot access 'y' before initialization
```

`let` is in TDZ until line 2.

</details>

---

### Problem 3

```javascript
foo();
var foo = function () {
  console.log('A');
};
function foo() {
  console.log('B');
}
foo();
```

<details>
<summary>Answer</summary>

```
B
A
```

Function **declaration** `foo` is fully hoisted first. `var foo` is hoisted but `function` declaration wins for name `foo` until assignment `var foo = function` overwrites it with the expression.

</details>

---

### Problem 4

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

<details>
<summary>Answer</summary>

```
3
3
3
```

Single shared `var i` — loop ends at 3. All callbacks read same `i`.

**Fix with `let`:**

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2 — new binding per iteration
```

</details>

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Closure output questions

### Problem 5 — Classic loop + `var`

```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function () {
    return i;
  });
}
console.log(funcs[0](), funcs[1](), funcs[2]());
```

<details>
<summary>Answer</summary>

```
3 3 3
```

All functions share one `i`. **Fix:** use `let`, or IIFE:

```javascript
for (var i = 0; i < 3; i++) {
  funcs.push(
    (
      (j) => () =>
        j
    )(i)
  );
}
```

</details>

---

### Problem 6 — Separate closure instances

```javascript
function create() {
  let count = 0;
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const a = create();
const b = create();
a.inc();
a.inc();
console.log(a.get(), b.get());
```

<details>
<summary>Answer</summary>

```
2 0
```

Each `create()` call gets its own `count` binding.

</details>

---

### Problem 7 — Closure in event handler

```javascript
function setup() {
  let clicks = 0;
  document.getElementById('btn').addEventListener('click', () => {
    clicks++;
    console.log(clicks);
  });
}
```

<details>
<summary>Answer</summary>

Each click logs incrementing count — handler closes over `clicks`. Outer `setup` can finish; `clicks` stays alive via closure.

</details>

---

### Problem 8 — Stale closure trap (React-style)

```javascript
function useCounter() {
  let count = 0;
  return {
    get: () => count,
    asyncInc: async () => {
      await Promise.resolve();
      count++; // always reads closure at call time
    },
  };
}
const c = useCounter();
await c.asyncInc();
await c.asyncInc();
console.log(c.get());
```

<details>
<summary>Answer</summary>

```
2
```

Works here — but in React, `useState` closures in stale `useEffect` without deps cause bugs. **Interview tie-in:** mention dependency arrays and functional updates `setCount(c => c + 1)`.

</details>

---

### Problem 9 — Memoize + closure

```javascript
function memoize(fn) {
  const cache = {};
  return (n) => {
    if (n in cache) return cache[n];
    return (cache[n] = fn(n));
  };
}
const slow = memoize((n) => n * 2);
console.log(slow(5), slow(5));
```

<details>
<summary>Answer</summary>

```
10 10
```

Second call hits cache. `cache` object is closed over by returned function.

</details>

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Copy-related output questions

### Problem 10

```javascript
const a = { x: { y: 1 } };
const b = { ...a };
b.x.y = 99;
console.log(a.x.y);
```

<details>
<summary>Answer</summary>

```
99
```

Shallow copy — `x` is shared reference.

</details>

---

### Problem 11

```javascript
const a = [1, 2, 3];
const b = a.slice();
b.push(4);
console.log(a.length, b.length);
```

<details>
<summary>Answer</summary>

```
3 4
```

Shallow copy of array — top-level separate.

</details>

---

### Problem 12

```javascript
const original = { date: new Date('2024-01-01') };
const copy = JSON.parse(JSON.stringify(original));
console.log(copy.date instanceof Date);
```

<details>
<summary>Answer</summary>

```
false
```

`date` became a string — JSON deep copy limitation.

</details>

---

### Problem 13

```javascript
const original = { a: 1 };
const copy = structuredClone(original);
copy.a = 2;
console.log(original.a, copy.a);
```

<details>
<summary>Answer</summary>

```
1 2
```

True deep copy for plain nested data.

</details>

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. One-line answers cheat sheet

| Topic            | Interview answer                                                           |
| ---------------- | -------------------------------------------------------------------------- |
| **Shallow copy** | New container, shared nested references — spread, `slice`, `Object.assign` |
| **Deep copy**    | Full tree clone — `structuredClone` or library; JSON only for plain data   |
| **Memoize**      | HOF caching pure function results by args — `Map` + resolver               |
| **Hoisting**     | Declarations registered early; `var` → `undefined`, `let`/`const` → TDZ    |
| **Closure**      | Inner function + lexical scope; used for privacy, factories, debounce      |
| **var in loop**  | One shared binding — `3,3,3` in setTimeout                                 |
| **let in loop**  | New binding per iteration — `0,1,2`                                        |

---

## Practice in this repo

| Concept             | See also                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Memoize / debounce  | [01-higher-order-functions.md](./01-higher-order-functions.md)                                 |
| Shallow object copy | [04-objects-core-functions.md](./04-objects-core-functions.md)                                 |
| Hoisting / coercion | [kpmg-round-1-vanilla-javascript-interview.md](./kpmg-round-1-vanilla-javascript-interview.md) |
| Memoized selectors  | `Projects/09-shopping-cart` — `cartSelectors.ts`                                               |
| Closure in store    | `Projects/vanilla-js/02-catalog-spa` — `createStore` subscribers                               |


<p><a href="#i10">Back to index</a></p>
