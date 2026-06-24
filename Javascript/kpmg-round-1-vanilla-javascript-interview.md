---
title: 'KPMG Frontend Interview — Round 1: Vanilla JavaScript'
description: '60-minute KPMG Round 1 — type coercion, hoisting & TDZ, event loop, prototypes, output questions, and sliding window DSA.'
tags: ['javascript', 'kpmg', 'interview', 'event-loop', 'dsa', 'sliding-window']
level: '2–5 years'
company: 'KPMG'
round: 'Round 1 — Vanilla JavaScript (60 mins)'
---

# KPMG Frontend Interview — Round 1: Vanilla JavaScript

**Duration:** 60 minutes  
**Focus:** JavaScript fundamentals, output-based edge cases, one DSA problem (Sliding Window)

**Prep resource:** [YouTube playlist](https://lnkd.in/ertxHnJR)

**Related rounds:** [React Round 2](../React/23-kpmg-frontend-interview.md) · [System Design Round 3](../System%20Design/04-file-upload-system-design.md)

---

## Table of Contents

### JavaScript Fundamentals

1. [Type Coercion](#1-type-coercion)
2. [Hoisting & TDZ](#2-hoisting--temporal-dead-zone-tdz)
3. [Event Loop](#3-event-loop)
4. [Prototype Inheritance](#4-prototype-inheritance)

### Output-Based Questions

5. [Output Question Bank](#5-output-based--edge-case-questions)

### DSA

6. [Sliding Window — Longest Substring Without Repeating Characters](#6-dsa-sliding-window)

7. [Quick Revision Cheat Sheet](#7-quick-revision-cheat-sheet)

---

## 1. Type Coercion

### Theory

**Type coercion** is JavaScript's automatic (or explicit) conversion of values from one type to another.

| Kind         | Trigger                             | Example               |
| ------------ | ----------------------------------- | --------------------- |
| **Implicit** | `==`, `+`, `-`, `if`, `&&`          | `"5" - 2` → `3`       |
| **Explicit** | `Number()`, `String()`, `Boolean()` | `Number("42")` → `42` |

**`==` vs `===`**

- `==` — compares after coercion
- `===` — compares type and value (no coercion) — **prefer this**

**Truthy / Falsy:** `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN` are falsy. Everything else is truthy (including `[]` and `{}`).

### Real Example

```javascript
// Implicit coercion traps
console.log([] + []); // ""  (arrays → "")
console.log([] + {}); // "[object Object]"
console.log({} + []); // 0 in some engines, "[object Object]" in others
console.log(true + true); // 2
console.log('5' + 1); // "51" (string concat)
console.log('5' - 1); // 4   (number subtraction)

// == coercion rules (memorize common interview cases)
console.log(null == undefined); // true
console.log(null == 0); // false
console.log(undefined == 0); // false
console.log([] == false); // true  ([] → "" → 0)
console.log([] == ![]); // true

// Safe comparisons
console.log(Number('42') === 42); // true
console.log(Object.is(NaN, NaN)); // true (NaN !== NaN normally)
```

### Interview Answer

> JavaScript coerces types implicitly with `==` and operators like `+`. I always use `===` for comparisons and explicit `Number()` / `String()` when converting, because implicit coercion causes subtle bugs in conditions and arithmetic.

---

## 2. Hoisting & Temporal Dead Zone (TDZ)

### Theory

**Hoisting** moves declarations to the top of their scope during compilation — but **initialization** behavior differs:

| Declaration | Hoisted?         | Initial value before line | TDZ? |
| ----------- | ---------------- | ------------------------- | ---- |
| `var`       | Yes              | `undefined`               | No   |
| `let`       | Yes (not usable) | —                         | Yes  |
| `const`     | Yes (not usable) | —                         | Yes  |
| `function`  | Yes              | Fully initialized         | No   |

**TDZ:** From entering block until `let`/`const` line executes — accessing the variable throws `ReferenceError`.

### Real Example

```javascript
// var — hoisted as undefined
console.log(a); // undefined
var a = 10;

// let/const — TDZ
// console.log(b); // ReferenceError
let b = 20;

// function declaration — fully hoisted
sayHi(); // "Hi"
function sayHi() {
  console.log('Hi');
}

// function expression — not hoisted like declaration
// greet(); // TypeError: greet is not a function
var greet = function () {
  console.log('Hello');
};

// TDZ with typeof (unlike undeclared var)
// typeof undeclaredVar; // "undefined" (no error)
// typeof x; // ReferenceError if let x is in TDZ below
let x = 1;

// Classic loop trap
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100); // 0, 1, 2
}
```

### Output question

```javascript
var foo = 1;
function bar() {
  if (!foo) {
    var foo = 10;
  }
  console.log(foo);
}
bar(); // ? → 10 (var foo hoisted inside bar as undefined; !undefined is true)
```

### Interview Answer

> `var` and function declarations are hoisted; `let` and `const` are hoisted but sit in the TDZ until their line runs. That's why `let` in loops creates a new binding per iteration and `var` does not.

---

## 3. Event Loop

### Theory

JavaScript is **single-threaded**. The **event loop** coordinates:

1. **Call stack** — synchronous execution
2. **Microtask queue** — `Promise.then`, `queueMicrotask`, `MutationObserver`
3. **Macrotask queue** — `setTimeout`, `setInterval`, I/O, UI events

**Order:** Run stack until empty → **drain all microtasks** → run **one** macrotask → repeat.

### Real Example

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
// Stack: 1, 4
// Microtasks: 3
// Macrotasks: 2
```

**Harder output question**

```javascript
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
    setTimeout(() => console.log('timeout inside promise'), 0);
  })
  .then(() => console.log('promise 2'));

console.log('end');

// Output:
// start, end
// promise 1, promise 2
// timeout 1, promise inside timeout
// timeout inside promise
```

**Async/await** — `await` schedules the rest of the function as microtasks.

```javascript
async function demo() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
}
demo();
console.log('C');
// A, C, B
```

### Interview Answer

> The event loop runs synchronous code first, then all microtasks (Promises), then one macrotask (setTimeout). That's why Promises resolve before `setTimeout(0)` and why microtask starvation can delay timers.

---

## 4. Prototype Inheritance

### Theory

Every object has an internal `[[Prototype]]` (accessed via `__proto__` or `Object.getPrototypeOf`). When you read a property, JS walks the **prototype chain** until it finds the key or reaches `null`.

**ES6 classes** are syntactic sugar over prototypes — methods live on `ClassName.prototype`.

### Real Example

```javascript
// Constructor + prototype
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // inherit instance props
  this.breed = breed;
}

// Link prototypes — Dog inherits Animal methods
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return `${this.name} barks`;
};

const d = new Dog('Rex', 'Lab');
console.log(d.speak()); // "Rex barks"
console.log(d instanceof Animal); // true

// ES6 class equivalent
class Vehicle {
  constructor(type) {
    this.type = type;
  }
  move() {
    return `${this.type} moving`;
  }
}

class Car extends Vehicle {
  move() {
    return `Car: ${super.move()}`;
  }
}

console.log(new Car('sedan').move()); // "Car: sedan moving"

// hasOwnProperty vs chain
console.log(d.hasOwnProperty('breed')); // true
console.log(d.hasOwnProperty('speak')); // false (on prototype)
```

### Interview Answer

> JavaScript uses prototypal inheritance — objects delegate to their prototype chain. `class` extends sets up that chain; `new` creates an object whose `[[Prototype]]` links to the constructor's `prototype`.

---

## 5. Output-Based & Edge-Case Questions

Practice these KPMG-style rapid-fire questions.

### Q1 — Closures

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
console.log(a.get(), b.get()); // 2, 0
```

### Q2 — `this` binding

```javascript
const obj = {
  name: 'KPMG',
  greet() {
    return this.name;
  },
  greetArrow: () => this?.name,
};

console.log(obj.greet()); // "KPMG"
console.log(obj.greetArrow()); // undefined (arrow uses lexical this)

const fn = obj.greet;
console.log(fn()); // undefined (lost binding)

console.log(obj.greet.call({ name: 'Audit' })); // "Audit"
```

### Q3 — Destructuring + default

```javascript
const { a = 1, b = 2 } = { b: undefined };
console.log(a, b); // 1, 2 (undefined triggers default for b? NO — only missing keys)

const { c = 3 } = { c: null };
console.log(c); // null (null is present, default not used)
```

### Q4 — Spread vs rest

```javascript
const arr = [1, 2, 3];
const copy = [...arr];
copy.push(4);
console.log(arr.length, copy.length); // 3, 4

function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3)); // 6
```

### Q5 — Optional chaining & nullish coalescing

```javascript
const user = { profile: { name: '' } };
console.log(user?.profile?.age ?? 18); // 18 (undefined → default)
console.log(user?.profile?.name || 'Guest'); // "Guest" ("" is falsy)
console.log(user?.profile?.name ?? 'Guest'); // "" (only null/undefined)
```

### Q6 — Map key uniqueness

```javascript
const map = new Map();
const key1 = { id: 1 };
const key2 = { id: 1 };
map.set(key1, 'first');
map.set(key2, 'second');
console.log(map.size); // 2 — different object references
```

---

## 6. DSA — Sliding Window

### Theory

**Sliding window** maintains a contiguous subarray/substring window and slides it in **O(n)** instead of checking every subarray in **O(n²)**.

| Pattern             | When to use                                   |
| ------------------- | --------------------------------------------- |
| **Fixed window**    | Sum/average of size `k`                       |
| **Variable window** | Longest/shortest subarray meeting a condition |

**KPMG-style problem:** _Longest substring without repeating characters_ (LeetCode 3)

### Approach

1. Use `left` and `right` pointers
2. Expand `right`, track characters in a `Map` (char → last index)
3. If duplicate in window, move `left` past previous occurrence
4. Track max window size

### Real Example — Solution

```javascript
/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }

    lastSeen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

console.log(lengthOfLongestSubstring('abcabcbb')); // 3 ("abc")
console.log(lengthOfLongestSubstring('bbbbb')); // 1
console.log(lengthOfLongestSubstring('pwwkew')); // 3 ("wke")
```

### Fixed window bonus — Max sum of subarray of size k

```javascript
function maxSumSubarray(arr, k) {
  let windowSum = 0;
  let maxSum = 0;

  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];
    if (i >= k) windowSum -= arr[i - k];
    if (i >= k - 1) maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9 (5+1+3)
```

### Interview Answer

> For contiguous subarray problems, I use sliding window — expand the right pointer, shrink left when the constraint breaks, track the best window in O(n) time and O(k) space for character maps.

---

## 7. Quick Revision Cheat Sheet

| Topic          | Remember                                           |
| -------------- | -------------------------------------------------- |
| Coercion       | Use `===`; `[] + {}` tricks; `null == undefined`   |
| Hoisting       | `var` → undefined; `let`/`const` → TDZ             |
| Event loop     | Sync → all microtasks → one macrotask              |
| Prototypes     | Chain lookup; `class extends` sets `[[Prototype]]` |
| Sliding window | Two pointers; Map for duplicates; O(n)             |

---

**Next round:** [KPMG Round 2 — React](../React/23-kpmg-frontend-interview.md)
