---
title: 'Sorting, Stack & Queue — JavaScript Interview Guide'
description: 'Sorting algorithms, stack/queue implementations, and classic problems with solutions.'
tags: ['javascript', 'sorting', 'stack', 'queue', 'dsa', 'interview']
level: 'Intermediate to Senior'
---

# Sorting · Stack · Queue

Frontend interviews often ask **sorting comparators**, **stack** (parentheses, undo), and **queue** (BFS, task scheduling). Know implementations + time complexity.

---

## Table of Contents

### Sorting

1. [Built-in `Array.sort`](#1-built-in-arraysort)
2. [Bubble sort](#2-bubble-sort)
3. [Selection sort](#3-selection-sort)
4. [Insertion sort](#4-insertion-sort)
5. [Merge sort](#5-merge-sort)
6. [Quick sort](#6-quick-sort)
7. [Sorting complexity cheat sheet](#7-sorting-complexity-cheat-sheet)

### Stack & Queue

8. [Stack implementation](#8-stack-implementation)
9. [Queue implementation](#9-queue-implementation)
10. [Deque / queue with two stacks](#10-deque--queue-from-two-stacks)

### Problems

11. [Sort problems](#11-sort-problems)
12. [Stack problems](#12-stack-problems)
13. [Queue problems](#13-queue-problems)

---

## 1. Built-in `Array.sort`

**Interview answer:**

> Default sort converts to strings — always pass a comparator. V8 uses TimSort — O(n log n) average. `sort` **mutates** the array.

```javascript
// Numbers
[10, 2, 1].sort((a, b) => a - b); // ascending
[10, 2, 1].sort((a, b) => b - a); // descending

// Strings (locale-aware)
['banana', 'apple'].sort((a, b) => a.localeCompare(b));

// Objects by key
employees.sort((a, b) => b.salary - a.salary || a.name.localeCompare(b.name));

// Non-mutating (ES2023)
const sorted = nums.toSorted((a, b) => a - b);
```

---

## 2. Bubble sort

**Idea:** Repeatedly swap adjacent elements if out of order. Largest "bubbles" to end each pass.

**Time:** O(n²) · **Space:** O(1) · **Stable:** Yes

```javascript
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // optimized — already sorted
  }
  return a;
}

bubbleSort([5, 1, 4, 2, 8]); // [1, 2, 4, 5, 8]
```

**When to mention:** Teaching only — never use in production for large arrays.

---

## 3. Selection sort

**Idea:** Find minimum in unsorted portion, swap to front.

**Time:** O(n²) · **Space:** O(1) · **Stable:** No (unless careful)

```javascript
function selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
}
```

---

## 4. Insertion sort

**Idea:** Build sorted portion by inserting each element into correct position — efficient for small or nearly-sorted arrays.

**Time:** O(n²) worst, O(n) best · **Stable:** Yes

```javascript
function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}
```

---

## 5. Merge sort

**Idea:** Divide in half, sort each, merge sorted halves.

**Time:** O(n log n) · **Space:** O(n) · **Stable:** Yes

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}

mergeSort([38, 27, 43, 3]); // [3, 27, 38, 43]
```

**Interview tie-in:** Same merge pattern as "merge two sorted arrays" problem.

---

## 6. Quick sort

**Idea:** Pick pivot, partition smaller/larger, recurse.

**Time:** O(n log n) average, O(n²) worst · **Space:** O(log n) stack · **Stable:** No

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

---

## 7. Sorting complexity cheat sheet

| Algorithm    | Best       | Average    | Worst      | Space    | Stable       |
| ------------ | ---------- | ---------- | ---------- | -------- | ------------ |
| Bubble       | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes          |
| Selection    | O(n²)      | O(n²)      | O(n²)      | O(1)     | No           |
| Insertion    | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes          |
| Merge        | O(n log n) | O(n log n) | O(n log n) | O(n)     | Yes          |
| Quick        | O(n log n) | O(n log n) | O(n²)      | O(log n) | No           |
| `Array.sort` | O(n log n) | O(n log n) | O(n log n) | O(log n) | Yes (modern) |

---

## 8. Stack implementation

**LIFO** — Last In, First Out. Used for: undo, call stack, parentheses matching, DFS.

```javascript
class Stack {
  #items = [];

  push(value) {
    this.#items.push(value);
    return this;
  }

  pop() {
    if (this.isEmpty()) throw new Error('Stack underflow');
    return this.#items.pop();
  }

  peek() {
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }
}

const stack = new Stack();
stack.push(1).push(2);
stack.pop(); // 2
stack.peek(); // 1
```

**Array as stack:** `push` / `pop` — both O(1) amortized.

---

## 9. Queue implementation

**FIFO** — First In, First Out. Used for: task queues, BFS, breadth-first UI traversal.

```javascript
class Queue {
  #items = [];

  enqueue(value) {
    this.#items.push(value);
    return this;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error('Queue underflow');
    return this.#items.shift(); // O(n) — see optimized version below
  }

  front() {
    return this.#items[0];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }
}
```

### O(1) dequeue — track head index

```javascript
class FastQueue {
  #items = [];
  #head = 0;

  enqueue(value) {
    this.#items.push(value);
  }

  dequeue() {
    if (this.isEmpty()) throw new Error('Queue underflow');
    const value = this.#items[this.#head];
    this.#head++;
    // optional: compact when sparse
    if (this.#head > 100 && this.#head > this.#items.length / 2) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
    return value;
  }

  isEmpty() {
    return this.#head >= this.#items.length;
  }
}
```

---

## 10. Deque / queue from two stacks

**Interview classic:** Implement queue using two stacks.

```javascript
class QueueTwoStacks {
  #inStack = [];
  #outStack = [];

  enqueue(value) {
    this.#inStack.push(value);
  }

  dequeue() {
    if (this.#outStack.length === 0) {
      while (this.#inStack.length) {
        this.#outStack.push(this.#inStack.pop());
      }
    }
    if (this.#outStack.length === 0) throw new Error('Queue underflow');
    return this.#outStack.pop();
  }

  isEmpty() {
    return this.#inStack.length === 0 && this.#outStack.length === 0;
  }
}
```

**Amortized O(1)** per operation — each element moved once.

---

## 11. Sort problems

### P1 — Merge two sorted arrays

```javascript
function mergeSorted(a, b) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else result.push(b[j++]);
  }
  return result.concat(a.slice(i), b.slice(j));
}

mergeSorted([1, 3, 5], [2, 4, 6]); // [1,2,3,4,5,6]
```

### P2 — Sort array of 0s, 1s, 2s (Dutch flag — optional)

```javascript
function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}
```

### P3 — Kth largest element (sort approach)

```javascript
function kthLargest(nums, k) {
  return [...nums].sort((a, b) => b - a)[k - 1];
}
// Interview upgrade: mention quickselect O(n) average
```

### P4 — Sort employees for data table

```javascript
function sortEmployees(rows, sortBy, order = 'asc') {
  const dir = order === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (typeof av === 'number' && typeof bv === 'number')
      return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}
```

---

## 12. Stack problems

### P5 — Valid parentheses ⭐ (most common)

**Description:** Given `()[]{}` string, return if brackets are balanced.

```javascript
function isValidParentheses(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else if (')]}'.includes(ch)) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

isValidParentheses('({[]})'); // true
isValidParentheses('(]'); // false
```

**Time:** O(n) · **Space:** O(n)

---

### P6 — Min stack ⭐

**Description:** Stack with `push`, `pop`, `top`, `getMin` all O(1).

```javascript
class MinStack {
  #stack = [];
  #mins = [];

  push(value) {
    this.#stack.push(value);
    const min = this.#mins.length ? Math.min(this.topMin(), value) : value;
    this.#mins.push(min);
  }

  pop() {
    this.#stack.pop();
    this.#mins.pop();
  }

  top() {
    return this.#stack[this.#stack.length - 1];
  }

  topMin() {
    return this.#mins[this.#mins.length - 1];
  }
}
```

---

### P7 — Evaluate reverse Polish notation

```javascript
function evalRPN(tokens) {
  const stack = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
  };
  for (const t of tokens) {
    if (t in ops) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(ops[t](a, b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack[0];
}

evalRPN(['2', '1', '+', '3', '*']); // 9 → (2+1)*3
```

---

### P8 — Daily temperatures (monotonic stack pattern)

**Description:** For each day, days until warmer temperature. `0` if none.

```javascript
function dailyTemperatures(temps) {
  const result = Array(temps.length).fill(0);
  const stack = []; // indices
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const idx = stack.pop();
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}

dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]); // [1,1,4,2,1,1,0,0]
```

---

## 13. Queue problems

### P9 — Implement stack using queues (variant)

```javascript
class StackWithQueue {
  #q = [];
  push(x) {
    this.#q.push(x);
    for (let i = 0; i < this.#q.length - 1; i++) {
      this.#q.push(this.#q.shift());
    }
  }
  pop() {
    return this.#q.shift();
  }
}
```

---

### P10 — BFS level order (tree/graph concept)

```javascript
function bfs(start, getNeighbors) {
  const queue = [start];
  const visited = new Set([start]);
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of getNeighbors(node)) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}
```

---

### P11 — Sliding window maximum (deque pattern — senior)

**Description:** Max in each window of size `k`.

```javascript
function maxSlidingWindow(nums, k) {
  const deque = []; // indices, decreasing values
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque.at(-1)] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}
```

---

## Practice checklist

| Must know | Problem                                                                |
| --------- | ---------------------------------------------------------------------- |
| ⭐⭐⭐    | Valid parentheses                                                      |
| ⭐⭐⭐    | Merge two sorted arrays                                                |
| ⭐⭐⭐    | `Array.sort` comparator                                                |
| ⭐⭐      | Min stack                                                              |
| ⭐⭐      | Queue from two stacks                                                  |
| ⭐⭐      | Binary search (see [08](./08-top-30-javascript-interview-problems.md)) |
| ⭐        | Merge sort / quick sort explain complexity                             |

**Repo link:** KPMG sliding window — [kpmg-round-1-vanilla-javascript-interview.md](./kpmg-round-1-vanilla-javascript-interview.md)
