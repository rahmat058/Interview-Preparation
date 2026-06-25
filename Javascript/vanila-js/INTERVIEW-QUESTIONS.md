# Interview Questions — Vanilla JS Core & Built-in Functions

Practice answers aloud. Each question includes an **Interview Answer** and **Example**.

**Deep dives:** [HOF](./01-higher-order-functions.md) · [Arrays](./02-arrays-core-functions.md) · [Strings](./03-strings-core-functions.md) · [Objects](./04-objects-core-functions.md) · [Built-ins](./05-built-in-functions-reference.md) · [Copy · Closures · Hoisting](./06-shallow-deep-copy-closures-hoisting-memoize.md)

---

## Higher-Order Functions

### Q1. What is a higher-order function?

**Interview Answer:**

> A function that takes another function as an argument, returns a function, or both. `map`, `filter`, `reduce`, event handlers, and `debounce` are all HOFs.

**Example:**

```javascript
[1, 2, 3].map((n) => n * 2); // HOF: map, callback: (n) => n * 2
```

---

### Q2. Implement `map` without using `.map`.

**Interview Answer:**

> Loop, push transformed items into a new array, return it — O(n) time and space.

```javascript
function myMap(arr, fn) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) out.push(fn(arr[i], i, arr));
  }
  return out;
}
```

---

### Q3. When do you use `reduce` instead of `map` + `filter`?

**Interview Answer:**

> When folding to one value — sum, group-by, index map — or when a single pass is clearer. `reduce` can implement both `map` and `filter`.

```javascript
const total = orders.reduce((sum, o) => sum + o.amount, 0);
```

---

### Q4. `forEach` vs `map`?

**Interview Answer:**

> `forEach` is for side effects and returns `undefined`. `map` transforms and returns a new array — never use `map` just to loop.

---

### Q5. Debounce vs throttle?

|           | Debounce     | Throttle       |
| --------- | ------------ | -------------- |
| **Fires** | After pause  | On interval    |
| **Use**   | Search input | Scroll handler |

**Example:** 300ms debounce on search — used in `vanilla-js/03-performance-patterns`.

---

### Q6. What is function composition?

**Interview Answer:**

> Chaining pure functions so output of one feeds the next — `pipe(trim, lower, slugify)(input)`.

---

## Array Built-ins

### Q7. Which array methods mutate the original?

**Interview Answer:**

> `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`. In React state I avoid these — copy then mutate the copy, or use `toSorted` / `with`.

---

### Q8. `slice` vs `splice`?

|          | `slice`           | `splice`      |
| -------- | ----------------- | ------------- |
| Mutates? | No                | Yes           |
| Returns  | Extracted portion | Removed items |

```javascript
const a = [1, 2, 3, 4];
a.slice(1, 3); // [2, 3] — a unchanged
a.splice(1, 2); // [2, 3] — a is [1, 4]
```

---

### Q9. Why does `[10, 2, 1].sort()` give wrong order?

**Interview Answer:**

> Default `sort` converts to strings — `'10' < '2'`. Always pass `(a, b) => a - b` for numbers.

---

### Q10. `flat` vs `flatMap`?

**Interview Answer:**

> `flatMap` is `map` then flatten one level — one pass, good for `split` per item. `flat(depth)` flattens nested arrays only.

```javascript
['a b', 'c'].flatMap((s) => s.split(' ')); // ['a','b','c']
```

---

### Q11. How do you remove duplicates from an array?

**Interview Answer:**

> Primitives: `[...new Set(arr)]`. Objects by key: `Map` keyed by `id`, then `.values()`.

---

### Q12. What is `Array.from` used for?

**Interview Answer:**

> Convert iterables or array-likes to real arrays — `NodeList`, `string`, or `{ length: n }` with a mapper.

```javascript
Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]
```

---

### Q13. `find` vs `filter`?

**Interview Answer:**

> `find` returns the first match or `undefined`. `filter` returns all matches as a new array.

---

### Q14. What does `Array(3)` create?

**Interview Answer:**

> An array with `length: 3` and **holes** — `map` won't run. Use `Array.from` or `Array.of` instead.

---

## String Built-ins

### Q15. Are strings mutable in JavaScript?

**Interview Answer:**

> No — primitives are immutable. Methods return new strings. For many concatenations use `array.join('')` not `+=` in a loop.

---

### Q16. `slice` vs `substring` vs `substr`?

**Interview Answer:**

> Prefer `slice` — supports negative indices. `substring` swaps reversed args. `substr` is deprecated.

---

### Q17. `includes` vs `indexOf`?

**Interview Answer:**

> `includes` returns boolean and handles `NaN` correctly. `indexOf` returns index or `-1`.

---

### Q18. How do you build a URL slug from a title?

```javascript
title
  .trim()
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-');
```

---

### Q19. What is `String.raw` for?

**Interview Answer:**

> Tagged template that skips escape processing — useful for regex strings and file paths.

---

## Object Built-ins

### Q20. `Object.keys` vs `for...in`?

**Interview Answer:**

> `keys` only own enumerable properties. `for...in` walks prototype chain too — usually want `hasOwn` check inside.

---

### Q21. Spread vs `Object.assign`?

**Interview Answer:**

> Both shallow merge. Spread creates new object — preferred for immutability. `assign` mutates the first argument.

```javascript
const next = { ...state, user: { ...state.user, name: 'Bob' } };
```

---

### Q22. Shallow copy vs deep copy?

| Method                   | Depth                   |
| ------------------------ | ----------------------- |
| spread / `Object.assign` | Shallow                 |
| `structuredClone`        | Deep (most types)       |
| `JSON.parse/stringify`   | Deep but no Date/Fn/Map |

---

### Q23. When use `Map` over plain object?

**Interview Answer:**

> Non-string keys, frequent add/delete, need `.size`, or want clean prototype. Objects are fine for JSON-like records.

---

### Q24. What is object normalization?

**Interview Answer:**

> Store entities in `{ [id]: entity }` for O(1) lookup; keep id arrays for order — pattern in Redux and our shopping cart.

---

## Number, Math & JSON

### Q25. `isNaN` vs `Number.isNaN`?

**Interview Answer:**

> Global `isNaN` coerces — `isNaN('hello')` is true. `Number.isNaN` only true for actual `NaN`.

---

### Q26. Why not use floats for money?

**Interview Answer:**

> `0.1 + 0.2 !== 0.3`. Store cents as integers or use `toFixed` for display only.

---

### Q27. `parseInt` without radix — what's the risk?

**Interview Answer:**

> Strings starting with `0` may parse as octal in old engines. Always `parseInt(str, 10)`.

---

### Q28. What does `JSON.stringify` omit?

**Interview Answer:**

> `undefined`, functions, symbols in objects; `undefined` in arrays becomes `null`. Dates become ISO strings.

---

### Q29. `Math.floor` vs `Math.trunc` for negatives?

```javascript
Math.floor(-3.9); // -4
Math.trunc(-3.9); // -3
```

---

## Set, Map & Promise

### Q30. Set vs Array for uniqueness?

**Interview Answer:**

> Set enforces uniqueness on add — O(1) `has`. Array needs scan or Set conversion.

---

### Q31. `Promise.all` vs `Promise.allSettled`?

**Interview Answer:**

> `all` rejects on first failure — use when all must succeed. `allSettled` waits for every promise — use for independent batch jobs.

```javascript
const results = await Promise.allSettled(urls.map((u) => fetch(u)));
const ok = results.filter((r) => r.status === 'fulfilled');
```

---

### Q32. How do you add a timeout to a fetch?

**Interview Answer:**

> `Promise.race` between fetch and a timeout promise, or `AbortController` with `setTimeout` + `abort()`.

---

## Senior / Live-Coding Scenarios

### Q33. Group array of objects by a key.

```javascript
const grouped = items.reduce((acc, item) => {
  const k = item.category;
  (acc[k] ??= []).push(item);
  return acc;
}, {});
// or Object.groupBy(items, (i) => i.category)
```

---

### Q34. Implement `pick` and `omit`.

```javascript
const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

const omit = (obj, keys) => {
  const skip = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !skip.has(k)));
};
```

---

### Q35. Paginate an array client-side.

```javascript
function paginate(rows, page, pageSize) {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
```

---

### Q36. Sort employees by salary desc, then name asc.

```javascript
employees.sort((a, b) => b.salary - a.salary || a.name.localeCompare(b.name));
```

---

### Q37. Deep equality — how far do you go in an interview?

**Interview Answer:**

> Start with `JSON.stringify` caveats, then shallow compare keys, then recursive for plain objects. Mention `structuredClone` for copy, not equality. Libraries use specialized deep equal.

---

### Q38. Implement `debounce` in 10 lines.

```javascript
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
```

---

### Q39. Chain async calls vs parallel?

**Interview Answer:**

> Sequential when output of A feeds B. Parallel with `Promise.all` when independent — faster total time.

---

### Q40. What built-in would you use to check if value is an array?

**Interview Answer:**

> `Array.isArray(x)` — reliable. `typeof` is `'object'`, `instanceof Array` breaks across iframes.

---

## Shallow Copy & Deep Copy

### Q41. What is shallow copy?

**Interview Answer:**

> A new object or array at the top level, but nested objects/arrays still share references. Spread, `slice`, and `Object.assign` are shallow.

```javascript
const a = { nested: { x: 1 } };
const b = { ...a };
b.nested.x = 99;
console.log(a.nested.x); // 99
```

---

### Q42. What is deep copy?

**Interview Answer:**

> No shared references anywhere in the tree. Use `structuredClone` for most cases, or `JSON.parse(JSON.stringify())` only for plain JSON-safe data.

```javascript
const deep = structuredClone(original);
deep.nested.x = 0; // original unchanged
```

---

### Q43. When is `JSON.parse(JSON.stringify())` unsafe?

**Interview Answer:**

> Loses `Date` (becomes string), functions, `undefined`, `Map`/`Set`, symbols, and throws on circular references.

---

### Q44. How do you update nested Redux state without deep cloning everything?

**Interview Answer:**

> Shallow-copy each level on the changed path: `{ ...state, user: { ...state.user, name: 'Bob' } }`. Immer does this ergonomically.

---

## Memoize

### Q45. What is memoization?

**Interview Answer:**

> Caching results of a pure function by input so repeat calls skip recomputation. Implemented as a HOF with a `Map` closed over the cache.

```javascript
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

---

### Q46. Memoize vs `useMemo` in React?

**Interview Answer:**

> Same idea — cache by deps. `useMemo` caches a computed value between renders; `useCallback` caches a function reference. Reselect memoizes Redux selectors.

---

### Q47. When should you NOT memoize?

**Interview Answer:**

> Non-pure functions, unbounded argument space (memory leak), or when inputs are objects without a stable cache key.

---

## Hoisting

### Q48. Explain hoisting.

**Interview Answer:**

> Declarations are registered before execution. `var` → `undefined` if accessed early. `let`/`const` → TDZ `ReferenceError`. Function declarations are fully hoisted.

```javascript
console.log(a); // undefined
var a = 1;
```

---

### Q49. What is the Temporal Dead Zone?

**Interview Answer:**

> From block entry until `let`/`const` initialization — accessing the variable throws `ReferenceError`, even though it's technically hoisted.

---

### Q50. Output: `var` in loop + setTimeout?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3 — fix with let or IIFE
```

**Interview Answer:**

> One shared `var` binding. `let` creates a new binding per iteration.

---

## Closures

### Q51. What is a closure?

**Interview Answer:**

> A function that retains access to its outer lexical scope after the outer function returns. Used for private state, factories, and debounce timers.

```javascript
function outer() {
  let count = 0;
  return () => ++count;
}
const inc = outer();
inc(); // 1
inc(); // 2
```

---

### Q52. Output: functions in loop with `var`?

```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(() => i);
}
console.log(funcs[0](), funcs[1](), funcs[2]()); // 3, 3, 3
```

**Fix:** `let i` or IIFE `((j) => () => j)(i)`.

---

### Q53. Output: two counter instances?

```javascript
function create() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}
const a = create(),
  b = create();
a.inc();
a.inc();
console.log(a.get(), b.get()); // 2, 0
```

**Interview Answer:**

> Each `create()` call gets its own `count` — separate closures.

---

### Q54. How does debounce use closure?

**Interview Answer:**

> Returned function closes over `timerId`. Each call clears and resets the timer — outer variables survive without global state.

---

### Q55. Closure memory leak — when?

**Interview Answer:**

> When a closure holds large data and is attached to long-lived DOM or global listeners after the UI is gone. Detach listeners and null references.

---

## What Interviewers Look For

| Criteria         | Strong signal                                               |
| ---------------- | ----------------------------------------------------------- |
| **Correct tool** | `map` vs `forEach` vs `reduce` — right choice first time    |
| **Mutability**   | Mentions copy before `sort`, spread for state updates       |
| **Complexity**   | Knows O(n) for single pass vs chained filters               |
| **Edge cases**   | Empty array reduce, `parseInt` radix, sparse arrays         |
| **Production**   | `Promise.allSettled`, `structuredClone`, debounce on search |
| **Fundamentals** | Shallow vs deep copy, closure output, hoisting / TDZ        |

---

## Quick Revision (day before interview)

1. Implement `map`, `filter`, `reduce` from memory
2. Explain debounce vs throttle with use cases
3. Shallow vs deep copy — spread vs `structuredClone`
4. Closure loop `var` vs `let` output (`3,3,3` vs `0,1,2`)
5. Hoisting: `var` → `undefined`, `let` → TDZ
6. Implement `memoize` with `Map`
7. `slice` / `splice` / `sort` mutability
8. `Object.entries` + `fromEntries` round trip
9. `Promise.all` vs `allSettled`
10. `Array.isArray`, `Array.from` traps

---

## Map to repo projects

| Question theme            | Code to reference                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| Debounce / virtual list   | `Projects/vanilla-js/03-performance-patterns`                                                            |
| Store + `reduce`          | `Projects/vanilla-js/02-catalog-spa`                                                                     |
| Table query pipeline      | `Projects/vanilla-js/04-data-table` · `Projects/05-data-table`                                           |
| Cart normalization        | `Projects/09-shopping-cart`                                                                              |
| Type coercion traps       | [KPMG Round 1](./kpmg-round-1-vanilla-javascript-interview.md)                                           |
| Copy / closure / hoisting | [06-shallow-deep-copy-closures-hoisting-memoize.md](./06-shallow-deep-copy-closures-hoisting-memoize.md) |
