---
title: "JavaScript Coding Problems At a Glance"
description: "Closure, debounce, throttle, Promise, shallow/deep copy, array flatten, memoize, curry — built-in and manual implementations with easy explanations."
tags:
  [
    "javascript",
    "interview",
    "closure",
    "debounce",
    "throttle",
    "curry",
    "memoize",
    "at-a-glance",
  ]
level: "Mid-Level to Senior (4–5+ years)"
format: "Implement + Built-in"
---

# JavaScript Coding Problems At a Glance

**Live-coding staples** for frontend interviews — each problem shows **the easy explanation**, **manual implementation**, and **built-in / modern alternative** where one exists.

Practice: cover the manual version, then mention the built-in.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Closure](#p1) |
| <span id="i2"></span>2 | [Debounce](#p2) |
| <span id="i3"></span>3 | [Throttle](#p3) |
| <span id="i4"></span>4 | [Promise utilities](#p4) |
| <span id="i5"></span>5 | [Shallow copy](#p5) |
| <span id="i6"></span>6 | [Deep copy](#p6) |
| <span id="i7"></span>7 | [Flatten array](#p7) |
| <span id="i8"></span>8 | [Memoize](#p8) |
| <span id="i9"></span>9 | [Curry](#p9) |
| <span id="i10"></span>10 | [Quick comparison table](#p10) |

---

<a id="p1"></a>

## 1. Closure

**What it is:** Inner function remembers variables from outer scope after outer function returns.

**Use cases:** Private state, factories, debounce timer, memo cache.

### Manual — counter module

```javascript
function createCounter(start = 0) {
  let count = start; // closed over — not global

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    get() {
      return count;
    },
  };
}

const c = createCounter(10);
c.increment(); // 11
c.get(); // 11
// count is not accessible from outside
```

### Manual — function factory

```javascript
function multiplyBy(factor) {
  return (n) => n * factor; // closure on factor
}

const double = multiplyBy(2);
double(5); // 10
```

### Interview answer

> A closure is a function plus its lexical environment. I use it for encapsulation and patterns like debounce where the timer variable must persist between calls.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Debounce

**What it is:** Run function **only after user stops** triggering for `wait` ms.

**Use cases:** Search input, resize end, auto-save.

### Manual

```javascript
function debounce(fn, wait) {
  let timerId;

  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// Usage
const search = debounce((q) => fetch(`/api?q=${q}`), 300);
input.addEventListener("input", (e) => search(e.target.value));
```

### With `leading` edge (optional — senior)

```javascript
function debounce(fn, wait, { leading = false } = {}) {
  let timerId;
  return function (...args) {
    const callNow = leading && !timerId;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
    }, wait);
    if (callNow) fn.apply(this, args);
  };
}
```

### Built-in / library

```javascript
// Lodash
import debounce from "lodash/debounce";

// React — closure + useRef (idiomatic)
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

### Interview answer

> Debounce delays execution until events pause — 300ms after last keystroke for search. Implemented with `setTimeout` + `clearTimeout` in a closure.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Throttle

**What it is:** Run at most **once per `limit` ms** while events keep firing.

**Use cases:** Scroll, mousemove, window resize handlers.

### Manual

```javascript
function throttle(fn, limit) {
  let lastCall = 0;

  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

window.addEventListener(
  "scroll",
  throttle(() => {
    updateStickyHeader();
  }, 100),
);
```

### Manual — trailing call variant

```javascript
function throttle(fn, limit) {
  let last = 0;
  let timer;

  return function (...args) {
    const now = Date.now();
    const remaining = limit - (now - last);

    clearTimeout(timer);
    if (remaining <= 0) {
      last = now;
      fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        last = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

### Built-in / library

```javascript
import throttle from "lodash/throttle";

// requestAnimationFrame for scroll (browser-native throttle ~60fps)
function onScrollRAF(fn) {
  let ticking = false;
  return () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
      ticking = true;
    }
  };
}
```

### Debounce vs throttle

|         | Debounce      | Throttle        |
| ------- | ------------- | --------------- |
| Fires   | After pause   | On interval     |
| Example | Search typing | Scroll position |

### Interview answer

> Throttle caps execution rate — scroll handler runs every 100ms max. Debounce waits until user stops — search after 300ms idle.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Promise utilities

**What they test:** Async flow, `Promise` constructor, `all` / `race` / `allSettled`.

### Manual — `delay`

```javascript
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await delay(1000); // wait 1 second
```

### Manual — `promiseAll` polyfill

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = promises.length;
    if (remaining === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}
```

### Built-in

```javascript
// All succeed or first reject
const [user, posts] = await Promise.all([getUser(), getPosts()]);

// First to finish (timeout pattern)
const result = await Promise.race([
  fetchData(),
  delay(5000).then(() => Promise.reject(new Error("Timeout"))),
]);

// Never short-circuits — all outcomes
const outcomes = await Promise.allSettled([api1(), api2()]);
outcomes.forEach((o) => {
  if (o.status === "fulfilled") console.log(o.value);
  else console.log(o.reason);
});

// Any first success
const first = await Promise.any([mirror1(), mirror2()]);
```

### Manual — simple `async` retry

```javascript
async function retry(fn, retries = 3, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
```

### Interview answer

> `Promise.all` for parallel independent calls; `allSettled` when I need every result; `race` for timeouts. I wrap with `async/await` and try/catch in application code.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Shallow copy

**What it is:** New container; **nested objects still shared**.

### Built-in

```javascript
const original = { a: 1, nested: { b: 2 } };
const arr = [1, 2, { x: 3 }];

// Objects
const copy1 = { ...original };
const copy2 = Object.assign({}, original);
const copy3 = structuredClone(original); // ⚠️ deep — see next section

// Arrays
const a1 = [...arr];
const a2 = arr.slice();
const a3 = Array.from(arr);
```

### Manual — shallow object

```javascript
function shallowCopyObject(obj) {
  const out = {};
  for (const key of Object.keys(obj)) {
    out[key] = obj[key];
  }
  return out;
}
```

### Proof nested is shared

```javascript
const copy = { ...original };
copy.nested.b = 99;
console.log(original.nested.b); // 99 — same reference
```

### React / Redux pattern (shallow per level)

```javascript
const nextState = {
  ...state,
  user: { ...state.user, name: "Bob" },
};
```

### Interview answer

> Spread and `Object.assign` copy top level only. For React state I shallow-copy each level on the path that changes — not full deep clone.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Deep copy

**What it is:** Full tree copy — **no shared nested references**.

### Built-in (recommended)

```javascript
const original = {
  name: "Alice",
  tags: ["a", "b"],
  meta: { score: 90 },
  joined: new Date(),
};

const copy = structuredClone(original);
copy.meta.score = 0;
console.log(original.meta.score); // 90
```

**`structuredClone` limits:** no functions, symbols, DOM nodes, circular refs.

### Built-in — JSON trick (plain data only)

```javascript
const copy = JSON.parse(JSON.stringify(original));
// ❌ loses Date, undefined, Map, Set, functions
```

### Manual — recursive with circular ref support

```javascript
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
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
  for (const key of Reflect.ownKeys(value)) {
    obj[key] = deepClone(value[key], seen);
  }
  return obj;
}
```

### Library

```javascript
import cloneDeep from "lodash/cloneDeep";
import { produce } from "immer"; // immutable updates without manual clone
```

### Interview answer

> `structuredClone` in modern JS for plain nested data. JSON trick only for simple JSON-safe objects. Mention `WeakMap` if they ask about circular references.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Flatten array

**What it is:** `[1, [2, [3]]]` → `[1, 2, 3]`.

### Built-in

```javascript
const nested = [1, [2, [3, 4]], 5];

nested.flat(); // [1, 2, [3, 4], 5]  — one level
nested.flat(1); // same
nested.flat(Infinity); // [1, 2, 3, 4, 5] — all levels
nested.flat(2); // [1, 2, 3, 4, 5]
```

### Manual — recursive reduce

```javascript
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}
```

### Manual — iterative (stack)

```javascript
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
```

### Manual — generator (senior)

```javascript
function* flatGen(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) yield* flatGen(item);
    else yield item;
  }
}
const flat = [...flatGen([1, [2, [3]]])]; // [1, 2, 3]
```

### Interview answer

> `flat(Infinity)` in production when allowed. In interviews I write recursive `reduce` + `concat`, or iterative stack if they want no recursion.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Memoize

**What it is:** Cache function results by arguments — same inputs → skip recompute.

### Manual — simple object cache (interview classic)

Uses a **closure** to hold `cache` and returns a function that checks before computing.

```javascript
const memoizeAddition = () => {
  let cache = {};
  return (value) => {
    if (value in cache) {
      console.log("Fetching from cache");
      return cache[value]; // bracket notation — numeric keys (e.g. 20) are not valid identifiers, so cache.20 is invalid
    } else {
      console.log("Calculating result");
      let result = value + 20;
      cache[value] = result;
      return result;
    }
  };
};

const addition = memoizeAddition();
console.log(addition(20)); // Calculating result → 40
console.log(addition(20)); // Fetching from cache → 40
```

**Why `cache[value]` not `cache.value`?** Property names that start with a number (or are numeric keys) are not valid JavaScript identifiers — always use **bracket notation** for dynamic or numeric keys.

---

### Manual — generic `Map` version

```javascript
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowFib = memoize((n) => {
  if (n <= 1) return n;
  return slowFib(n - 1) + slowFib(n - 2);
});
slowFib(40); // fast after first call
```

### Manual — custom key (objects)

```javascript
function memoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const getUser = memoize(
  (id) => api.fetchUser(id),
  (id) => id,
);
```

### Built-in / ecosystem

```javascript
// React
const MemoChild = React.memo(Child); // props shallow compare
const value = useMemo(() => expensive(a, b), [a, b]);

// Reselect (Redux)
const selectTotal = createSelector([(state) => state.items], (items) =>
  items.reduce((s, i) => s + i.price, 0),
);
```

### Interview answer

> Memoize wraps a pure function with a Map cache. React's `useMemo` / `React.memo` are framework versions — only use when profiling shows benefit.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Curry

**What it is:** Transform `f(a, b, c)` into `f(a)(b)(c)` — partial application one arg at a time.

### Manual

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried(...args, ...more);
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6
add(1)(2, 3); // 6
```

### Manual — practical logger

```javascript
const log = curry((level, module, message) => {
  console.log(`[${level}] ${module}: ${message}`);
});

const logError = log("ERROR");
const logAuthError = logError("auth");

logAuthError("Invalid token"); // [ERROR] auth: Invalid token
```

### Built-in-ish patterns

```javascript
// Function.prototype.bind — partial application (not full curry)
const add5 = (a, b) => a + b;
const add5to = add5.bind(null, 5);
add5to(3); // 8

// Ramda
import { curry } from "ramda";
const multiply = curry((a, b) => a * b);
const double = multiply(2);
```

### Interview answer

> Curry collects arguments until the function's arity is met. Useful for reusable configured functions — `log('ERROR')('api')`. `bind` fixes some args but isn't variadic curry.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Quick comparison table

| Problem          | One line                         | Built-in / shortcut             |
| ---------------- | -------------------------------- | ------------------------------- |
| **Closure**      | Function + remembered outer vars | Module pattern, hooks           |
| **Debounce**     | After user stops                 | Lodash, `useEffect` + timeout   |
| **Throttle**     | Max once per interval            | Lodash, `requestAnimationFrame` |
| **Promise.all**  | Parallel, fail fast              | Native `Promise.all`            |
| **Shallow copy** | Top level only                   | `{...obj}`, `[...arr]`          |
| **Deep copy**    | Full tree                        | `structuredClone`               |
| **Flatten**      | Nested → 1D                      | `arr.flat(Infinity)`            |
| **Memoize**      | Cache by args                    | `useMemo`, `React.memo`         |
| **Curry**        | `f(a)(b)(c)`                     | Ramda `curry`, `bind`           |

---

## Live-coding checklist

```
□ Closure — explain + counter or debounce timer
□ Debounce — clearTimeout + setTimeout in closure
□ Throttle — timestamp or rAF
□ Promise.all — parallel fetch example
□ Shallow — spread + show nested mutation
□ Deep — structuredClone + JSON limits
□ Flatten — flat(Infinity) + recursive reduce
□ Memoize — Map + JSON.stringify key
□ Curry — arity check + return nested function
```

---

_More problems: [Javascript/vanila-js/08-top-30-javascript-interview-problems.md](../Javascript/vanila-js/08-top-30-javascript-interview-problems.md) · [Javascript/vanila-js/06-shallow-deep-copy-closures-hoisting-memoize.md](../Javascript/vanila-js/06-shallow-deep-copy-closures-hoisting-memoize.md)_


<p><a href="#i10">Back to index</a></p>
