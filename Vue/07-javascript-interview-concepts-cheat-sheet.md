---
title: "JavaScript Interview Concepts Cheat Sheet"
description: "20 core JavaScript concepts for Vue/frontend interviews — closures, event loop, async, prototypes, and more."
tags: ["javascript", "interview", "cheat-sheet", "vue"]
level: "All levels"
note: "Framework-agnostic — applies to Vue, React, and all frontend roles"
---

# JavaScript Interview Concepts Cheat Sheet

20 core JS concepts tested in **Vue and all frontend** interviews. Vue developers need the same JS fundamentals as React developers.

---

## Quick Reference

| # | Concept | One-liner |
|---|---------|-----------|
| 1 | Closure | Function remembers outer scope |
| 2 | Event loop | Sync → microtasks → macrotask |
| 3 | var/let/const | const default, block scope with let |
| 4 | Hoisting | Declarations lifted, not initializations |
| 5 | this | Dynamic in regular functions, lexical in arrows |
| 6 | Prototypes | JS inheritance via prototype chain |
| 7 | Promises | Future value — pending/fulfilled/rejected |
| 8 | async/await | Promise syntactic sugar |
| 9 | call/apply/bind | Control `this` binding |
| 10 | Spread/rest | Expand vs collect with `...` |
| 11 | Destructuring | Unpack objects/arrays |
| 12 | Optional chaining | Safe nested access `?.` |
| 13 | Nullish coalescing | `??` only for null/undefined |
| 14 | Map/Set | Key-value any type / unique values |
| 15 | Debounce/throttle | Pause vs rate-limit |
| 16 | Deep vs shallow copy | structuredClone vs spread |
| 17 | Event delegation | One listener on parent |
| 18 | Modules | ES6 import/export |
| 19 | Generators | Pausable functions with yield |
| 20 | WeakMap/WeakRef | GC-friendly references |

---

## Closure (Vue connection: composables)

```javascript
function createCounter() {
  let count = 0;
  return { increment: () => ++count, get: () => count };
}
// Same pattern as useCounter composable internals
```

## Event Loop

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4); // 1,4,3,2
```

## Debounce (Vue: useDebounce composable)

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

## Deep Copy

```javascript
const deep = structuredClone(original);
```

---

*Master these 20 — they appear in every Vue and frontend interview.*
