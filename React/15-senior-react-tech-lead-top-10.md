---
title: "Top 10 Senior React & Tech Lead Interview Questions"
description: "Call/apply/bind polyfills, flatten, currying, stopwatch, todo list, output puzzles — with theory, pros/cons, and full code."
tags: ["react", "javascript", "senior", "tech-lead", "interview", "polyfill"]
level: "Senior / Tech Lead"
---

# Top 10 Senior React & Tech Lead Interview Questions

Common questions that test **concept clarity + coding approach** in Senior React.js and Tech Lead interviews. Each topic includes **Theory**, **Pros & Cons**, **One-Line Interview Answer**, and **Full Implementation**.

---

## Table of Contents

1. [Call, Apply, Bind + Polyfills](#1-call-apply-bind--difference--polyfill)
2. [Flatten Array without Array.flat()](#2-flatten-array-without-arrayflat)
3. [5 Divs in a Row without Flex](#3-inline-5-divs-without-flexmarginpadding)
4. [Sum without a for Loop](#4-sum-of-numbers-without-a-for-loop)
5. [Deep Copy vs Shallow Copy](#5-deep-copy-vs-shallow-copy)
6. [Promise & Async/Await Output Puzzle](#6-promise--asyncawait-output-puzzle)
7. [First Repeating Character](#7-first-repeating-character)
8. [Stopwatch Implementation](#8-stopwatch-implementation)
9. [To-Do List with Re-render Optimization](#9-to-do-list-vanilla-js--react)
10. [Currying for Infinite Sum](#10-currying-for-infinite-sum)

---

## 1. Call, Apply, Bind — Difference + Polyfill

### Theory

All three control **`this`** context of a function:

| Method | Invokes? | Arguments | Returns |
|--------|----------|-----------|---------|
| `call` | Immediately | Comma-separated | Function result |
| `apply` | Immediately | Array | Function result |
| `bind` | No | Comma-separated (+ partial) | **New function** |

### Pros & Cons

| call/apply | bind |
|------------|------|
| One-time invocation | Reusable bound function |
| apply when args in array | Partial application |
| Cannot reuse easily | Slight memory per bound fn |

### One-Line Interview Answer

> call and apply invoke immediately with a set this — apply takes args as array. bind returns a new function with this permanently bound. Arrow functions ignore all three for this.

### Polyfill Implementations

```javascript
// Polyfill: Function.prototype.call
Function.prototype.myCall = function (thisArg, ...args) {
  const fn = this;
  if (typeof fn !== "function") throw new TypeError("Not a function");

  const context = thisArg ?? globalThis;
  const uniqueKey = Symbol("fn");
  context[uniqueKey] = fn;

  const result = context[uniqueKey](...args);
  delete context[uniqueKey];
  return result;
};

// Polyfill: Function.prototype.apply
Function.prototype.myApply = function (thisArg, argsArray) {
  const fn = this;
  if (typeof fn !== "function") throw new TypeError("Not a function");

  const context = thisArg ?? globalThis;
  const uniqueKey = Symbol("fn");
  context[uniqueKey] = fn;

  const result = argsArray ? context[uniqueKey](...argsArray) : context[uniqueKey]();
  delete context[uniqueKey];
  return result;
};

// Polyfill: Function.prototype.bind
Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const fn = this;
  if (typeof fn !== "function") throw new TypeError("Not a function");

  const boundFn = function (...callArgs) {
    const isNew = this instanceof boundFn;
    return fn.apply(isNew ? this : thisArg, boundArgs.concat(callArgs));
  };

  if (fn.prototype) {
    boundFn.prototype = Object.create(fn.prototype);
  }

  return boundFn;
};
```

### Real Example

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Amit" };

greet.myCall(user, "Hello", "!");     // "Hello, Amit!"
greet.myApply(user, ["Hi", "."]);     // "Hi, Amit."
const sayHello = greet.myBind(user, "Hey");
sayHello("!!");                        // "Hey, Amit!!"
```

---

## 2. Flatten Array without Array.flat()

### Theory

Convert nested arrays into a single flat array by recursively expanding any array element until all values are non-array primitives.

**Given input:** `[1,2,3,[4,5,6,[7,8,[10,11]]],9]`  
**Expected output:** `[1,2,3,4,5,6,7,8,10,11,9]`

### Pros & Cons

| Recursive | Iterative (stack) |
|-----------|-------------------|
| ✅ Clean, readable | ✅ No stack overflow on deep nesting |
| ❌ Stack limit on very deep arrays | Slightly more code |

### One-Line Interview Answer

> I flatten by reducing — if element is array, recursively flatten and concat; otherwise push the value. Iterative version uses a stack to avoid recursion limits.

### Implementations

```javascript
// Approach 1 — Recursive reduce
function flatten(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}

// Approach 2 — Iterative with stack
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}

// Approach 3 — toString trick (ONLY for numbers — not general)
// [1,[2,3]].toString() → "1,2,3" — avoid in interviews unless asked
```

### Test

```javascript
const input = [1, 2, 3, [4, 5, 6, [7, 8, [10, 11]]], 9];
console.log(flatten(input));
// [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 9]
```

---

## 3. Inline 5 Divs without Flex/Margin/Padding

### Theory

Without `flex`, `margin`, or `padding`, place 5 divs in a horizontal row using **`display: inline-block`**. Inline-block elements sit side-by-side like text, respecting width/height unlike pure inline.

Watch for: **whitespace gaps** between inline-block elements (font-size zero hack on parent, or remove whitespace in HTML).

### Pros & Cons

| inline-block | float (alternative) |
|--------------|---------------------|
| ✅ Simple, in document flow | ❌ Removed from normal flow |
| ✅ Respects width/height | Needs clearfix |
| ❌ Whitespace gap between items | No gap issue |

### One-Line Interview Answer

> Set display inline-block on each div with a fixed width. Parent gets font-size 0 to remove whitespace gaps, then reset font-size on children.

### Real Example

```html
<div class="row">
  <div class="box">1</div><!--
  --><div class="box">2</div><!--
  --><div class="box">3</div><!--
  --><div class="box">4</div><!--
  --><div class="box">5</div>
</div>
```

```css
/* Method 1 — font-size zero on parent */
.row {
  font-size: 0; /* removes whitespace gap */
}

.box {
  display: inline-block;
  width: 20%;
  height: 100px;
  background: #4a90d9;
  font-size: 16px; /* reset for content */
  text-align: center;
  line-height: 100px;
  box-sizing: border-box;
  border: 1px solid #333;
}

/* Method 2 — HTML comments remove whitespace (shown above) */

/* Method 3 — float (if inline-block not accepted) */
.box-float {
  float: left;
  width: 20%;
  height: 100px;
}
.row-float::after {
  content: "";
  display: table;
  clear: both;
}
```

```html
<!-- Alternative: calc width -->
<style>
  .box-calc {
    display: inline-block;
    width: calc(100% / 5);
    height: 80px;
    background: coral;
    box-sizing: border-box;
  }
</style>
```

---

## 4. Sum of Numbers without a for Loop

### Theory

Sum an array without `for`/`while` using:
- **`reduce()`** — most idiomatic
- **Recursion** — classic interview approach
- **`eval` + join** — trick (avoid in production)

### One-Line Interview Answer

> I use reduce — it accumulates a sum without an explicit loop. Recursion works too by adding first element to sum of rest.

### Implementations

```javascript
const nums = [1, 2, 3, 4, 5];

// Approach 1 — reduce (preferred)
const sumReduce = (arr) => arr.reduce((acc, n) => acc + n, 0);
console.log(sumReduce(nums)); // 15

// Approach 2 — recursion
function sumRecursive(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumRecursive(arr.slice(1));
}
console.log(sumRecursive(nums)); // 15

// Approach 3 — reduce without initial (only for non-empty)
const sumReduceNoInit = (arr) => arr.reduce((a, b) => a + b);
console.log(sumReduceNoInit(nums)); // 15

// Sum of arguments without loop
function sumArgs(...args) {
  return args.reduce((a, b) => a + b, 0);
}
console.log(sumArgs(10, 20, 30)); // 60
```

---

## 5. Deep Copy vs Shallow Copy

### Theory

| | Shallow Copy | Deep Copy |
|--|--------------|-----------|
| Top level | New reference | New reference |
| Nested objects | **Shared** | **Independent copies** |
| Methods | spread, Object.assign, slice | structuredClone, JSON, recursive |
| Mutation risk | Nested changes affect both | Fully isolated |

### One-Line Interview Answer

> Shallow copy shares nested references — mutating nested object affects both. Deep copy recursively clones everything — use structuredClone in modern JS.

### Real Example

```javascript
const original = {
  name: "Amit",
  scores: [90, 85],
  address: { city: "Bangalore" },
};

// Shallow
const shallow = { ...original };
shallow.scores.push(100);
console.log(original.scores); // [90, 85, 100] — mutated!

// Deep — structuredClone (modern)
const deep = structuredClone(original);
deep.scores.push(100);
console.log(original.scores); // [90, 85] — unchanged

// Deep — JSON (limitations: no Date, Map, undefined, functions)
const jsonDeep = JSON.parse(JSON.stringify(original));

// Deep — manual recursive
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value);

  const clone = Array.isArray(value) ? [] : {};
  seen.set(value, clone);

  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone(value[key], seen);
  }
  return clone;
}
```

```javascript
// React — immutable update is shallow spread per level
setUser((prev) => ({
  ...prev,
  address: { ...prev.address, city: "Delhi" }, // deep enough for one nested level
}));
```

---

## 6. Promise & Async/Await Output Puzzle

### Theory

Remember: sync first → all **microtasks** (Promises, await) → one **macrotask** (setTimeout).

Senior interviews give multi-layer puzzles mixing async/await, Promise chains, and setTimeout.

### Puzzle 1 — Classic

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");
```

**Output:** `1` → `4` → `3` → `2`

**Why:** Sync (1, 4) → microtask (3) → macrotask (2)

---

### Puzzle 2 — async/await

```javascript
async function foo() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

console.log("C");
foo();
console.log("D");
```

**Output:** `C` → `A` → `D` → `B`

**Why:** await pauses foo after A; D runs synchronously; B resumes as microtask.

---

### Puzzle 3 — Nested promises

```javascript
console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve()
  .then(() => {
    console.log("promise 1");
    return Promise.resolve();
  })
  .then(() => console.log("promise 2"));

Promise.resolve().then(() => console.log("promise 3"));

console.log("end");
```

**Output:** `start` → `end` → `promise 1` → `promise 3` → `promise 2` → `timeout`

---

### Puzzle 4 — async function return

```javascript
async function getData() {
  return 42;
}

console.log(getData());
getData().then(console.log);
```

**Output:** `Promise { 42 }` → `42`

**Why:** async functions always return a Promise.

---

### Puzzle 5 — Senior trap

```javascript
async function run() {
  console.log(1);
  await null;
  console.log(2);
  await null;
  console.log(3);
}

run();
console.log(4);
```

**Output:** `1` → `4` → `2` → `3`

---

## 7. First Repeating Character

### Theory

Find the **first character that appears more than once** when scanning left to right.

`"success"` → **`"c"`** (index 2 — first char with count > 1 on second occurrence)

Note: This is different from **first non-repeating** character (`"success"` → `"u"`).

### Algorithm

1. Track seen characters in a Set
2. Scan left to right
3. If char already in Set → return it (first repeat)
4. Else add to Set

### One-Line Interview Answer

> I scan left to right with a Set — the first character I see that's already in the Set is the first repeating character.

### Implementation

```javascript
function firstRepeatingChar(str) {
  const seen = new Set();

  for (const char of str) {
    if (seen.has(char)) return char;
    seen.add(char);
  }

  return null; // no repeat
}

console.log(firstRepeatingChar("success"));  // "c"
console.log(firstRepeatingChar("abcdef"));   // null
console.log(firstRepeatingChar("abccba"));   // "c" (first repeat at index 2)
console.log(firstRepeatingChar("programming")); // "r"
```

```javascript
// Alternative — frequency map + second pass for first index
function firstRepeatingCharMap(str) {
  const freq = new Map();

  for (const char of str) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  for (const char of str) {
    if (freq.get(char) > 1) return char;
  }

  return null;
}
```

### Walk-through: "success"

```
s → seen={s}
u → seen={s,u}
c → seen={s,u,c}
c → already in seen → return "c" ✅
```

---

## 8. Stopwatch Implementation

### Theory

Build a stopwatch with **Start**, **Stop**, **Reset** and a live timer display. Use `setInterval` for ticking, store elapsed time, handle pause/resume by tracking offset.

Key: cleanup interval on stop/unmount; don't drift by recalculating from `Date.now()`.

### One-Line Interview Answer

> I track start timestamp and accumulated elapsed time. Start begins an interval updating display; Stop clears interval and saves elapsed; Reset zeroes everything.

### Vanilla JS Implementation

```html
<div class="stopwatch">
  <span id="display">00:00:00</span>
  <button id="start">Start</button>
  <button id="stop" disabled>Stop</button>
  <button id="reset" disabled>Reset</button>
</div>
```

```javascript
class Stopwatch {
  constructor(displayEl) {
    this.display = displayEl;
    this.elapsed = 0;
    this.startTime = 0;
    this.timerId = null;
    this.running = false;
  }

  format(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  tick() {
    const now = Date.now();
    this.display.textContent = this.format(this.elapsed + (now - this.startTime));
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startTime = Date.now();
    this.timerId = setInterval(() => this.tick(), 10); // update every 10ms
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    this.elapsed += Date.now() - this.startTime;
    clearInterval(this.timerId);
    this.timerId = null;
    this.tick(); // final display
  }

  reset() {
    this.stop();
    this.elapsed = 0;
    this.display.textContent = "00:00:00";
  }
}

const sw = new Stopwatch(document.getElementById("display"));
document.getElementById("start").onclick = () => sw.start();
document.getElementById("stop").onclick = () => sw.stop();
document.getElementById("reset").onclick = () => sw.reset();
```

### React Implementation

```tsx
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const format = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const start = () => {
    if (running) return;
    setRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current));
    }, 10);
  };

  const stop = () => {
    if (!running) return;
    accumulatedRef.current += Date.now() - startTimeRef.current;
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setRunning(false);
  };

  const reset = () => {
    stop();
    accumulatedRef.current = 0;
    setElapsed(0);
  };

  useEffect(() => () => clearInterval(intervalRef.current!), []);

  return (
    <div>
      <span aria-live="polite">{format(elapsed)}</span>
      <button onClick={start} disabled={running}>Start</button>
      <button onClick={stop} disabled={!running}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## 9. To-Do List (Vanilla JS / React) — Optimize Re-renders

### Theory

Todo list tests: CRUD operations, state management, and **re-render optimization** in React. Avoid re-rendering entire list when one item changes — use stable keys, memoized item components, and immutable updates.

### One-Line Interview Answer

> I use immutable state updates, stable ID keys, React.memo on TodoItem, and useCallback for handlers so only the changed item re-renders.

### Vanilla JS Implementation

```html
<div id="app">
  <input id="input" placeholder="Add todo..." />
  <button id="add">Add</button>
  <ul id="list"></ul>
</div>
```

```javascript
class TodoApp {
  constructor() {
    this.todos = [];
    this.listEl = document.getElementById("list");
    this.inputEl = document.getElementById("input");

    document.getElementById("add").onclick = () => this.add();
    this.inputEl.onkeydown = (e) => e.key === "Enter" && this.add();
  }

  add() {
    const text = this.inputEl.value.trim();
    if (!text) return;
    this.todos.push({ id: crypto.randomUUID(), text, done: false });
    this.inputEl.value = "";
    this.render();
  }

  toggle(id) {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    this.render();
  }

  remove(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.render();
  }

  render() {
    this.listEl.innerHTML = this.todos
      .map(
        (t) => `
      <li data-id="${t.id}">
        <input type="checkbox" ${t.done ? "checked" : ""} />
        <span style="${t.done ? "text-decoration:line-through" : ""}">${t.text}</span>
        <button class="delete">×</button>
      </li>`
      )
      .join("");

    this.listEl.querySelectorAll("li").forEach((li) => {
      const id = li.dataset.id;
      li.querySelector("input").onchange = () => this.toggle(id);
      li.querySelector(".delete").onclick = () => this.remove(id);
    });
  }
}

new TodoApp();
```

### React — Optimized Re-renders

```tsx
type Todo = { id: string; text: string; done: boolean };

// Memoized item — only re-renders when its props change
const TodoItem = React.memo(function TodoItem({
  todo,
  onToggle,
  onRemove,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  console.log("render", todo.id); // verify only changed item renders
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onRemove(todo.id)}>×</button>
    </li>
  );
});

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setInput("");
  }, [input]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onRemove={removeTodo}
          />
        ))}
      </ul>
    </div>
  );
}
```

**What to say:** "React.memo on TodoItem + useCallback on handlers + stable UUID keys = only the toggled item re-renders."

---

## 10. Currying for Infinite Sum

### Theory

Implement `sum(10)(20)(30)()` → `60` and `sum(10)(20)(30)(40)(50)(60)()` → `210`.

Each call adds a number. Calling with **empty parentheses `()`** triggers the final result. This is **infinite currying** with an empty-call terminator.

### One-Line Interview Answer

> Each call returns a new function that accumulates the sum. When called with no arguments, it returns the total — I detect empty invocation as the signal to compute.

### Implementation

```javascript
function sum(a) {
  const fn = function (b) {
    // Empty call () → return accumulated sum
    if (arguments.length === 0) return a;
    return sum(a + b);
  };

  // Allow sum(10)(20)(30)() — empty parens call fn with no args
  fn.valueOf = () => a;
  fn.toString = () => String(a);

  return fn;
}

// Tests
console.log(sum(10)(20)(30)());                    // 60
console.log(sum(10)(20)(30)(40)(50)(60)());        // 210
console.log(+sum(5)(15)(25)());                    // 45
console.log(sum(1)(2)(3)(4)(5)(6)(7)(8)(9)(10)()); // 55
```

### Alternative — explicit empty call detection

```javascript
function sum(initial) {
  let total = initial;

  function accumulator(value) {
    if (value === undefined) {
      // Called as () — return result
      const result = total;
      total = 0; // reset for reuse (optional)
      return result;
    }
    total += value;
    return accumulator;
  }

  // First call already set total = initial
  return function next(value) {
    if (value === undefined) return total;
    total += value;
    return next;
  };
}

// Cleaner version matching interview spec exactly
function sum(a) {
  return function inner(b) {
    if (b === undefined) return a;
    return sum(a + b);
  };
}

// Usage: must pass undefined or use () which passes undefined
console.log(sum(10)(20)(30)(undefined)); // 60 — less elegant

// Best: empty call detection via argument length
function sum(a) {
  const f = (b) => {
    if (arguments.length === 0) return a;
    return sum(a + b);
  };
  return f;
}

console.log(sum(10)(20)(30)());             // 60
console.log(sum(10)(20)(30)(40)(50)(60)()); // 210
```

### Walk-through: sum(10)(20)(30)()

```
sum(10)       → f, a=10
(20)          → sum(10+20=30) → f, a=30
(30)          → sum(30+30=60) → f, a=60
()            → arguments.length===0 → return 60 ✅
```

---

# Quick Revision Cheat Sheet

| # | Topic | One-liner |
|---|-------|-----------|
| 1 | call/apply/bind | Invoke now vs bind this; polyfill via Symbol |
| 2 | Flatten | Recursive reduce or stack; concat if array |
| 3 | 5 divs inline | display:inline-block; font-size:0 on parent |
| 4 | Sum no loop | arr.reduce((a,b) => a+b, 0) |
| 5 | Deep vs shallow | structuredClone vs spread; nested shared |
| 6 | Output puzzle | Sync → microtasks → macrotask |
| 7 | First repeating | Set scan left; first char seen twice |
| 8 | Stopwatch | setInterval + elapsed offset; cleanup on stop |
| 9 | Todo list | React.memo + useCallback + UUID keys |
| 10 | Infinite sum | Curried fn; empty () returns accumulated total |

---

# Senior Interview Tips

| Do | Don't |
|----|-------|
| Write polyfills from scratch | Say "I'd use lodash" |
| Explain output puzzles step by step | Guess the answer |
| Mention re-render optimization in Todo | Build naive list without memo |
| Handle edge cases (empty string, empty array) | Skip cleanup in stopwatch |
| Clarify first **repeating** vs **non-repeating** char | Assume wrong problem |

---

*These 10 questions appear repeatedly in Senior React and Tech Lead rounds. Practice writing each from scratch in under 10 minutes.*
