---
title: 'JavaScript Arrays — Core Functions Interview Guide'
description: 'Mutating vs non-mutating methods, iteration, grouping, flat, sort pitfalls — intermediate to senior.'
tags: ['javascript', 'arrays', 'interview', 'map', 'filter', 'reduce']
level: 'Intermediate to Senior'
---

# Arrays — Core Functions Interview Guide

---

## Table of Contents

1. [Mutating vs non-mutating](#1-mutating-vs-non-mutating)
2. [Creation & spread](#2-creation--spread)
3. [Iteration methods (HOFs)](#3-iteration-methods-hofs)
4. [Search & membership](#4-search--membership)
5. [Transform & reshape](#5-transform--reshape)
6. [`sort` pitfalls](#6-sort-pitfalls)
7. [Immutability patterns](#7-immutability-patterns)
8. [Grouping & indexing](#8-grouping--indexing)
9. [Sparse arrays & holes](#9-sparse-arrays--holes)
10. [Senior scenarios](#10-senior-scenarios)

---

## 1. Mutating vs non-mutating

| Mutates original                  | Returns new array                              |
| --------------------------------- | ---------------------------------------------- |
| `push`, `pop`, `shift`, `unshift` | `map`, `filter`, `slice`, `concat`             |
| `splice`, `sort`, `reverse`       | `toSorted`, `toReversed`, `toSpliced` (ES2023) |
| `fill`, `copyWithin`              | `flat`, `flatMap`, spread `[...arr]`           |

**Interview answer:**

> In React/Redux I avoid mutating state arrays — use `map`/`filter`/spread. `sort` and `reverse` mutate unless you copy first or use `toSorted()`.

```javascript
const nums = [3, 1, 2];

// Mutates
nums.sort((a, b) => a - b);

// Non-mutating (ES2023)
const sorted = [...nums].sort((a, b) => a - b);
// or
const sorted2 = nums.toSorted((a, b) => a - b);
```

---

## 2. Creation & spread

```javascript
Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]
Array.from('hello'); // ['h','e','l','l','o']
Array.of(1, 2, 3); // [1,2,3] — safer than Array(3) which creates holes

const copy = [...original];
const merged = [...a, ...b];
const withNew = [...arr.slice(0, 2), 'inserted', ...arr.slice(2)];
```

---

## 3. Iteration methods (HOFs)

See [01-higher-order-functions.md](./01-higher-order-functions.md) for implementations.

```javascript
const cart = [
  { id: 'p1', qty: 2, price: 10 },
  { id: 'p2', qty: 1, price: 25 },
];

// map — transform
const lines = cart.map((item) => ({
  ...item,
  total: item.qty * item.price,
}));

// filter — subset
const expensive = cart.filter((item) => item.price >= 20);

// reduce — single value
const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

// forEach — side effects only
cart.forEach((item) => analytics.track('view', item.id));
```

---

## 4. Search & membership

```javascript
const ids = ['p1', 'p2', 'p3'];

ids.includes('p2'); // true
ids.indexOf('p2'); // 1 (-1 if missing)
ids.find((id) => id.startsWith('p')); // 'p1'
ids.findIndex((id) => id === 'p2'); // 1

// includes vs indexOf with NaN
[NaN].includes(NaN); // true
[NaN].indexOf(NaN); // -1
```

**`at()` — negative index:**

```javascript
const arr = [10, 20, 30];
arr.at(-1); // 30
arr.at(-2); // 20
```

---

## 5. Transform & reshape

### `slice` — copy portion (non-mutating)

```javascript
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3); // [2, 3]
arr.slice(-2); // [4, 5]
```

### `splice` — mutates (remove/insert)

```javascript
const arr = [1, 2, 3, 4];
arr.splice(1, 2, 'a', 'b'); // removes [2,3], inserts 'a','b' → [1,'a','b',4]
```

### `concat` / spread

```javascript
[1, 2].concat([3, 4]); // [1,2,3,4]
```

### `flat` / `flatMap`

```javascript
[1, [2, [3]]].flat(); // [1, 2, [3]]
[1, [2, [3]]].flat(2); // [1, 2, 3]

const sentences = ['hello world', 'foo bar'];
sentences.flatMap((s) => s.split(' ')); // ['hello','world','foo','bar']
```

### Pagination (from data-table projects)

```javascript
function paginate(rows, page, pageSize) {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
```

---

## 6. `sort` pitfalls

**Default sort converts to strings:**

```javascript
[10, 2, 1].sort(); // [1, 10, 2] — wrong for numbers!
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]
```

**Unstable sort in older engines** — equal elements may reorder. Modern V8 is stable.

**Sort strings case-insensitive:**

```javascript
names.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
```

**Interview answer:**

> Always pass a comparator for numbers and dates. Copy the array first if you must preserve original order in state.

---

## 7. Immutability patterns

```javascript
// Add item
const added = [...items, newItem];

// Remove by index
const removed = items.filter((_, i) => i !== index);

// Remove by id
const without = items.filter((item) => item.id !== id);

// Update one item
const updated = items.map((item) =>
  item.id === id ? { ...item, qty: item.qty + 1 } : item
);

// Move item (kanban)
const move = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
```

---

## 8. Grouping & indexing

### `Object.groupBy` (ES2024)

```javascript
const employees = [
  { name: 'A', dept: 'Eng' },
  { name: 'B', dept: 'Sales' },
  { name: 'C', dept: 'Eng' },
];

const grouped = Object.groupBy(employees, (e) => e.dept);
// { Eng: [...], Sales: [...] }
```

### `reduce` fallback (widely supported)

```javascript
const grouped = employees.reduce((acc, emp) => {
  const key = emp.dept;
  (acc[key] ??= []).push(emp);
  return acc;
}, {});
```

### Build index map

```javascript
const byId = Object.fromEntries(products.map((p) => [p.id, p]));
// or
const byId2 = products.reduce((map, p) => ({ ...map, [p.id]: p }), {});
```

---

## 9. Sparse arrays & holes

```javascript
const sparse = [1, , 3]; // hole at index 1
sparse.length; // 3
sparse.map((x) => x * 2); // [2, empty, 6] — skips holes

// forEach skips holes; for...of does not
sparse.forEach((x) => console.log(x)); // 1, 3 only
```

**Interview trap:** `Array(3)` creates `{ length: 3 }` with holes, not `[undefined, undefined, undefined]`.

```javascript
Array(3).map(() => 1); // [empty × 3] — callback never runs!
Array.from({ length: 3 }, () => 1); // [1, 1, 1]
```

---

## 10. Senior scenarios

### Deduplicate

```javascript
const unique = [...new Set(arr)];
// objects by key
const uniqueById = [...new Map(arr.map((item) => [item.id, item])).values()];
```

### Chunk array

```javascript
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
```

### Difference / intersection

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const intersection = [...a].filter((x) => b.has(x)); // [2, 3]
const difference = [...a].filter((x) => !b.has(x)); // [1]
```

### Flatten tree to array (file explorer pattern)

```javascript
function flattenTree(nodes) {
  return nodes.reduce((acc, node) => {
    acc.push(node);
    if (node.children?.length) {
      acc.push(...flattenTree(node.children));
    }
    return acc;
  }, []);
}
```

---

## 11. Additional array built-ins

### `join` — array to string

```javascript
['2024', '08', '03'].join('-'); // '2024-08-03'
[1, 2, 3].join(); // '1,2,3' — default comma
```

### `reduceRight`

```javascript
[
  [0, 1],
  [2, 3],
  [4, 5],
].reduceRight((acc, cur) => acc.concat(cur), []);
// [4, 5, 2, 3, 0, 1]
```

### ES2023 immutable helpers

```javascript
const nums = [1, 2, 3];
nums.with(1, 99); // [1, 99, 3]
nums.toReversed(); // [3, 2, 1]
nums.toSpliced(1, 1, 'a', 'b'); // [1, 'a', 'b', 3]
```

### `copyWithin` (mutates)

```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3, 5); // [4, 5, 3, 4, 5] — copies index 3–4 to start
```

### Iterators

```javascript
for (const [i, val] of ['a', 'b'].entries()) {
  console.log(i, val); // 0 'a', 1 'b'
}
```

---

## Quick Reference

| Goal                | Method                          |
| ------------------- | ------------------------------- |
| Transform all       | `map`                           |
| Keep some           | `filter`                        |
| One value out       | `reduce`                        |
| First match         | `find`                          |
| Any / all           | `some` / `every`                |
| Copy slice          | `slice`                         |
| Merge               | spread or `concat`              |
| Remove/add in place | `splice` (mutates)              |
| Sort safely         | `toSorted` or `[...arr].sort()` |
| Nested → flat       | `flat` / `flatMap`              |
| Array → string      | `join`                          |
| Right-to-left fold  | `reduceRight`                   |
| Immutable replace   | `with` / `toSpliced` (ES2023)   |
| Type check          | `Array.isArray`                 |
| Build from length   | `Array.from`                    |
