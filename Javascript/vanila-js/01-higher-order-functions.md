---
title: 'Higher-Order Functions — JavaScript Interview Guide'
description: 'Functions as values, map/filter/reduce implementations, compose, curry, debounce — intermediate to senior.'
tags: ['javascript', 'hof', 'map', 'filter', 'reduce', 'interview']
level: 'Intermediate to Senior'
---

# Higher-Order Functions — Interview Guide

A **higher-order function (HOF)** is a function that either:

1. **Takes one or more functions as arguments**, or
2. **Returns a function** as its result.

Most modern JavaScript interviews expect you to **use** and **implement** HOFs confidently.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What makes a function "higher-order"?](#p1) |
| <span id="i2"></span>2 | [Callbacks vs HOFs](#p2) |
| <span id="i3"></span>3 | [Implement `map` from scratch](#p3) |
| <span id="i4"></span>4 | [Implement `filter` from scratch](#p4) |
| <span id="i5"></span>5 | [Implement `reduce` from scratch](#p5) |
| <span id="i6"></span>6 | [Chaining: the data pipeline pattern](#p6) |
| <span id="i7"></span>7 | [`forEach` vs `map` — interview trap](#p7) |
| <span id="i8"></span>8 | [`some`, `every`, `find`, `findIndex`](#p8) |
| <span id="i9"></span>9 | [Composition: `compose` and `pipe`](#p9) |
| <span id="i10"></span>10 | [Currying and partial application](#p10) |
| <span id="i11"></span>11 | [Debounce and throttle (HOF classics)](#p11) |
| <span id="i12"></span>12 | [Once, memoize, retry](#p12) |
| <span id="i13"></span>13 | [Array methods as HOFs on objects](#p13) |
| <span id="i14"></span>14 | [Senior follow-ups](#p14) |

---

<a id="p1"></a>

## 1. What makes a function "higher-order"?

```javascript
// Takes a function as argument
function repeat(n, action) {
  for (let i = 0; i < n; i++) action(i);
}

repeat(3, console.log); // 0, 1, 2

// Returns a function
function multiplyBy(factor) {
  return (n) => n * factor;
}

const double = multiplyBy(2);
double(5); // 10
```

**Interview answer:**

> A higher-order function operates on other functions — either receiving them as arguments or returning them. `map`, `filter`, `reduce`, event listeners, and React hooks all rely on this idea.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Callbacks vs HOFs

| Term         | Meaning                                                      |
| ------------ | ------------------------------------------------------------ |
| **Callback** | Function passed to be called later (`onClick`, `setTimeout`) |
| **HOF**      | The function that _receives_ or _returns_ that callback      |

```javascript
// callback = (item) => item * 2
// HOF = Array.prototype.map
[1, 2, 3].map((item) => item * 2);
```

**Senior point:** Callbacks enable **inversion of control** — the HOF controls _when_ and _how often_ your function runs (loop, event, retry).

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Implement `map` from scratch

**Signature:** `map(array, callback)` → new array, same length.

```javascript
function myMap(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

myMap([1, 2, 3], (n) => n * 2); // [2, 4, 6]
```

**With `Array.prototype` style (how engines expose it):**

```javascript
function myMap(array, callback, thisArg) {
  const result = new Array(array.length);
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      result[i] = callback.call(thisArg, array[i], i, array);
    }
  }
  return result;
}
```

**Interview answer:**

> `map` transforms each element and always returns a new array of the same length. I never use `map` for side effects — that's `forEach`.

**Complexity:** O(n) time, O(n) space.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Implement `filter` from scratch

```javascript
function myFilter(array, predicate) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

myFilter([1, 2, 3, 4], (n) => n % 2 === 0); // [2, 4]
```

**Real example — active employees:**

```javascript
const employees = [
  { name: 'Alice', status: 'active' },
  { name: 'Bob', status: 'inactive' },
];

const active = employees.filter((e) => e.status === 'active');
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Implement `reduce` from scratch

**The most important HOF in senior interviews** — `map` and `filter` can be built with `reduce`.

```javascript
function myReduce(array, reducer, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (initialValue === undefined) {
    if (array.length === 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    if (i in array) {
      accumulator = reducer(accumulator, array[i], i, array);
    }
  }
  return accumulator;
}

myReduce([1, 2, 3, 4], (sum, n) => sum + n, 0); // 10
```

### Re-implement `map` with `reduce`

```javascript
const mapped = myReduce(
  [1, 2, 3],
  (acc, n) => {
    acc.push(n * 2);
    return acc;
  },
  []
);
// [2, 4, 6]
```

### Re-implement `filter` with `reduce`

```javascript
const evens = myReduce(
  [1, 2, 3, 4],
  (acc, n) => {
    if (n % 2 === 0) acc.push(n);
    return acc;
  },
  []
);
// [2, 4]
```

### Real-world `reduce` patterns

```javascript
// 1. Sum salaries
const total = employees.reduce((sum, e) => sum + e.salary, 0);

// 2. Group by department
const byDept = employees.reduce((groups, emp) => {
  const key = emp.department;
  if (!groups[key]) groups[key] = [];
  groups[key].push(emp);
  return groups;
}, {});

// 3. Count occurrences
const counts = ['a', 'b', 'a'].reduce((acc, ch) => {
  acc[ch] = (acc[ch] ?? 0) + 1;
  return acc;
}, {});
// { a: 2, b: 1 }

// 4. Build lookup map by id
const byId = products.reduce((map, p) => {
  map[p.id] = p;
  return map;
}, {});
```

**Interview answer:**

> `reduce` folds an array into a single value — number, object, array, or anything. It's the most flexible iterator; I use it for aggregations, grouping, and building indexes when `map`/`filter` alone would need extra passes.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Chaining: the data pipeline pattern

Same pattern as `tableQuery.js` in this repo: **search → filter → sort → paginate**.

```javascript
const result = employees
  .filter((e) => e.status === 'active')
  .filter((e) => e.department === 'Engineering')
  .map((e) => ({ ...e, bonus: e.salary * 0.1 }))
  .sort((a, b) => b.salary - a.salary)
  .slice(0, 10);
```

**Senior point:** Each step is O(n) — chaining 4 passes is O(4n) still O(n), but for huge datasets combine into one `reduce` or use lazy iterators.

```javascript
// Single-pass with reduce (advanced)
function pipeline(rows, ...fns) {
  return fns.reduce((acc, fn) => fn(acc), rows);
}
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. `forEach` vs `map` — interview trap

```javascript
// Wrong — map for side effect, return value discarded
users.map((u) => sendEmail(u));

// Right
users.forEach((u) => sendEmail(u));

// Wrong — forEach can't be chained meaningfully for transforms
const doubled = [1, 2, 3].forEach((n) => n * 2); // undefined
```

| Method    | Returns            | Use for                     |
| --------- | ------------------ | --------------------------- |
| `forEach` | `undefined`        | Side effects only           |
| `map`     | New array          | Transform each element      |
| `filter`  | New array (subset) | Keep matching elements      |
| `reduce`  | Any single value   | Aggregate / build structure |

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. `some`, `every`, `find`, `findIndex`

All are HOFs — they take a predicate.

```javascript
const nums = [2, 4, 6, 8];

nums.some((n) => n % 2 === 1); // false — at least one odd?
nums.every((n) => n % 2 === 0); // true — all even?

const users = [{ id: 1 }, { id: 2 }];
users.find((u) => u.id === 2); // { id: 2 }
users.findIndex((u) => u.id === 2); // 1
```

**Implement `find`:**

```javascript
function myFind(array, predicate) {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) return array[i];
  }
  return undefined;
}
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Composition: `compose` and `pipe`

Combine small pure functions into one.

```javascript
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

const trim = (s) => s.trim();
const toLower = (s) => s.toLowerCase();
const slugify = (s) => s.replace(/\s+/g, '-');

const toSlug = pipe(trim, toLower, slugify);
toSlug('  Hello World  '); // "hello-world"
```

**Interview answer:**

> `pipe` reads left-to-right like a data pipeline; `compose` is right-to-left like math notation. I use composition to keep functions small and testable.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Currying and partial application

**Curry:** transform `f(a, b, c)` → `f(a)(b)(c)`  
**Partial apply:** fix some arguments, return a function for the rest.

```javascript
// Manual curry (two-arg)
function curry2(fn) {
  return function curried(a) {
    return function (b) {
      return fn(a, b);
    };
  };
}

const add = (a, b) => a + b;
const curriedAdd = curry2(add);
curriedAdd(2)(3); // 5

// Partial application
function partial(fn, ...fixedArgs) {
  return (...restArgs) => fn(...fixedArgs, ...restArgs);
}

const addTen = partial(add, 10);
addTen(5); // 15
```

**Real example — reusable filter:**

```javascript
const byProp = (key, value) => (item) => item[key] === value;

const activeUsers = users.filter(byProp('status', 'active'));
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Debounce and throttle (HOF classics)

Used in `vanilla-js/03-performance-patterns` and React autocomplete projects.

### Debounce — wait until user stops

```javascript
function debounce(fn, waitMs) {
  let timerId = null;
  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), waitMs);
  };
}

const onSearch = debounce((query) => {
  fetchResults(query);
}, 300);
```

### Throttle — at most once per interval

```javascript
function throttle(fn, limitMs) {
  let lastRun = 0;
  let timerId = null;

  return function throttled(...args) {
    const now = Date.now();
    const remaining = limitMs - (now - lastRun);

    if (remaining <= 0) {
      lastRun = now;
      fn.apply(this, args);
    } else if (!timerId) {
      timerId = setTimeout(() => {
        lastRun = Date.now();
        timerId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

const onScroll = throttle(() => paintVirtualList(), 16);
```

| Pattern      | Fires when  | Use case                 |
| ------------ | ----------- | ------------------------ |
| **Debounce** | After pause | Search input, resize end |
| **Throttle** | On interval | Scroll, mousemove, drag  |

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Once, memoize, retry

### `once` — run function only one time

```javascript
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const init = once(() => {
  console.log('Initialized');
  return { config: true };
});
```

### `memoize` — cache by arguments

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

const expensive = memoize((n) => {
  // heavy computation
  return n * n;
});
```

### `retry` — HOF that wraps async calls

```javascript
function retry(fn, attempts = 3, delayMs = 500) {
  return async function (...args) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastError = err;
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
    throw lastError;
  };
}
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Array methods as HOFs on objects

```javascript
// Object → array → transform → object
const scores = { alice: 90, bob: 75 };

const curved = Object.fromEntries(
  Object.entries(scores).map(([name, score]) => [name, score + 5])
);
// { alice: 95, bob: 80 }

// Or with reduce in one pass
const curved2 = Object.keys(scores).reduce((acc, key) => {
  acc[key] = scores[key] + 5;
  return acc;
}, {});
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Senior follow-ups

### Q: Implement `flatMap`

```javascript
function myFlatMap(array, callback) {
  return myReduce(
    array,
    (acc, item, i, arr) => {
      const mapped = callback(item, i, arr);
      return acc.concat(mapped);
    },
    []
  );
}

// Or: array.map(fn).flat(1) — but know your interviewer's preference
```

### Q: Difference between `map` + `flat` and `flatMap`?

`flatMap` is `map` then flatten **one level** only — efficient for avoiding intermediate arrays.

```javascript
['hello world', 'foo bar'].flatMap((s) => s.split(' '));
// ['hello', 'world', 'foo', 'bar']
```

### Q: Can you use `async` functions with `map`?

```javascript
// Wrong — array of promises, not results
const data = ids.map(async (id) => fetch(`/api/${id}`));

// Right
const results = await Promise.all(ids.map((id) => fetch(`/api/${id}`)));
```

### Q: Functional vs imperative — when to break pure HOF style?

- **Use HOFs** for transforms, filters, derived data
- **Use loops** when you need `break`, `continue`, early exit, or micro-optimization
- **Use `for...of`** when readability beats chaining 5 methods

---

## Quick Reference

| HOF              | Takes                        | Returns                    |
| ---------------- | ---------------------------- | -------------------------- |
| `map`            | `(item, i, arr) => newItem`  | New array (same length)    |
| `filter`         | `(item, i, arr) => boolean`  | New array (≤ length)       |
| `reduce`         | `(acc, item, i, arr) => acc` | Single accumulated value   |
| `forEach`        | `(item, i, arr) => void`     | `undefined`                |
| `find`           | predicate                    | First match or `undefined` |
| `some` / `every` | predicate                    | `boolean`                  |
| `sort`           | `(a, b) => number`           | Same array (mutates!)      |
| `flatMap`        | `(item) => array`            | Flattened new array        |

---

## Practice (LeetCode-style in this repo)

- [2634-filter-elements-from-array.js](../leetcode/2634-filter-elements-from-array.js)
- [2635-apply-transform-over-each-element-in-array.js](../leetcode/2635-apply-transform-over-each-element-in-array.js)
- [2665-counter-two.js](../leetcode/2665-counter-two.js)


<p><a href="#i14">Back to index</a></p>
