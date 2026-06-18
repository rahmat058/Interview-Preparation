---
title: "Senior Vue & JavaScript Interview"
description: "20 senior JavaScript topics plus 12 output puzzles — essential for senior Vue developer interviews."
tags: ["vue", "javascript", "senior", "interview"]
level: "Senior (4+ YOE)"
---

# Senior Vue & JavaScript Interview

Senior Vue roles test **deep JavaScript** plus **Vue 3 internals**. Same JS puzzles as React senior roles.

---

## 20 Senior JS Topics

| # | Topic | Key point |
|---|-------|-----------|
| 1 | Closure | Private state, composable internals |
| 2 | Prototype chain | Object.create, inheritance |
| 3 | Event loop | Micro vs macro, async ordering |
| 4 | Promise internals | then chaining, Promise.all/race/allSettled |
| 5 | Generators | yield, iterators |
| 6 | Proxy/Reflect | Vue 3 reactivity basis |
| 7 | WeakMap/WeakSet | GC-friendly metadata |
| 8 | Memory leaks | Listeners, closures, detached DOM |
| 9 | Currying | Partial application |
| 10 | Memoization | Cache function results |
| 11 | Module patterns | IIFE, ES modules |
| 12 | call/apply/bind | this binding |
| 13 | Debounce/throttle | Performance |
| 14 | Deep clone | structuredClone, edge cases |
| 15 | Flatten array | Recursive, iterative |
| 16 | Event delegation | Performance pattern |
| 17 | requestAnimationFrame | Smooth animations |
| 18 | Web Workers | Offload heavy computation |
| 19 | Service Workers | PWA caching |
| 20 | Functional programming | map, filter, reduce, compose |

---

## Vue-Specific Senior Topics

| Topic | Detail |
|-------|--------|
| Reactivity triggers | track/trigger in @vue/reactivity |
| effectScope | Cleanup for composables |
| shallowRef vs ref | Performance for large objects |
| customRenderer | Vue for non-DOM targets |
| compile-time flags | Tree-shaking optimization |

```javascript
import { effectScope } from "vue";

function useScopedFeature() {
  const scope = effectScope();
  scope.run(() => {
    const count = ref(0);
    watch(count, () => { /* ... */ });
  });
  onUnmounted(() => scope.stop()); // cleanup all effects
}
```

---

## 12 Output Puzzles

### Puzzle 1
```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2
```

### Puzzle 2
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3 — use let for 0,1,2
```

### Puzzle 3
```javascript
const obj = { a: 1, b: 2 };
const copy = obj;
copy.a = 99;
console.log(obj.a); // 99 — reference type
```

### Puzzle 4
```javascript
function outer() {
  let x = 10;
  return function inner() { return x++; };
}
const fn = outer();
console.log(fn(), fn(), fn()); // 10, 11, 12
```

### Puzzle 5 — Proxy (Vue reactivity basis)
```javascript
const raw = { count: 0 };
const observed = new Proxy(raw, {
  get(target, key) { console.log("get", key); return target[key]; },
  set(target, key, value) { console.log("set", key); target[key] = value; return true; },
});
observed.count; // logs "get count"
observed.count = 1; // logs "set count"
```

### Puzzle 6
```javascript
async function foo() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
foo();
console.log("C");
// A, C, B
```

### Puzzle 7–12
Practice: typeof null, [] + [], implicit coercion, this in arrow vs regular, Promise.race, event loop with nested setTimeout.

---

# One-Line Answers

| Question | Answer |
|----------|--------|
| Vue 3 reactivity | Proxy traps get/set, track deps, trigger updates |
| effectScope | Batch and cleanup reactive effects in composables |
| Senior JS | Closures, event loop, Proxy — all connect to Vue internals |
