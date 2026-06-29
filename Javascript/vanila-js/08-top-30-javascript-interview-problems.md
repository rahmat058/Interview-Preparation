---
title: 'Top 30 JavaScript Interview Problems'
description: 'Most common live-coding and whiteboard problems with description, examples, and solutions.'
tags: ['javascript', 'interview', 'coding', 'problems', 'leetcode']
level: 'Intermediate to Senior'
---

# Top 30 JavaScript Interview Problems

Problems that appear repeatedly in **frontend**, **React**, and **vanilla JS** rounds. Each has a **description**, **example**, and **solution**.

**Legend:** ⭐ = very high frequency · 🟢 Easy · 🟡 Medium

---

<a id="quick-index"></a>

## Quick index

| #                        | Problem                                  | Difficulty |
| ------------------------ | ---------------------------------------- | ---------- |
| <span id="i1"></span>1   | [Two Sum](#p1)                           | 🟢 ⭐      |
| <span id="i2"></span>2   | [Reverse string / array](#p2)            | 🟢 ⭐      |
| <span id="i3"></span>3   | [Palindrome check](#p3)                  | 🟢 ⭐      |
| <span id="i4"></span>4   | [FizzBuzz](#p4)                          | 🟢         |
| <span id="i5"></span>5   | [Remove duplicates](#p5)                 | 🟢 ⭐      |
| <span id="i6"></span>6   | [Find max / min](#p6)                    | 🟢         |
| <span id="i7"></span>7   | [Anagram check](#p7)                     | 🟢 ⭐      |
| <span id="i8"></span>8   | [Character / word frequency](#p8)        | 🟢 ⭐      |
| <span id="i9"></span>9   | [Valid parentheses](#p9)                 | 🟢 ⭐      |
| <span id="i10"></span>10 | [Merge two sorted arrays](#p10)          | 🟢 ⭐      |
| <span id="i11"></span>11 | [Binary search](#p11)                    | 🟢 ⭐      |
| <span id="i12"></span>12 | [Flatten array](#p12)                    | 🟡 ⭐      |
| <span id="i13"></span>13 | [Chunk array](#p13)                      | 🟢         |
| <span id="i14"></span>14 | [Debounce](#p14)                         | 🟡 ⭐      |
| <span id="i15"></span>15 | [Throttle](#p15)                         | 🟡 ⭐      |
| <span id="i16"></span>16 | [Implement `map`](#p16)                  | 🟡 ⭐      |
| <span id="i17"></span>17 | [Implement `filter`](#p17)               | 🟡         |
| <span id="i18"></span>18 | [Implement `reduce`](#p18)               | 🟡 ⭐      |
| <span id="i19"></span>19 | [Deep clone](#p19)                       | 🟡 ⭐      |
| <span id="i20"></span>20 | [Memoize](#p20)                          | 🟡 ⭐      |
| <span id="i21"></span>21 | [Curry](#p21)                            | 🟡         |
| <span id="i22"></span>22 | [Flatten object](#p22)                   | 🟡         |
| <span id="i23"></span>23 | [Group by key](#p23)                     | 🟢 ⭐      |
| <span id="i24"></span>24 | [Pick / omit](#p24)                      | 🟢         |
| <span id="i25"></span>25 | [Capitalize words](#p25)                 | 🟢         |
| <span id="i26"></span>26 | [Longest substring without repeat](#p26) | 🟡 ⭐      |
| <span id="i27"></span>27 | [Promise.all polyfill](#p27)             | 🟡 ⭐      |
| <span id="i28"></span>28 | [Sleep / delay](#p28)                    | 🟢         |
| <span id="i29"></span>29 | [LRU cache (simplified)](#p29)           | 🟡         |
| <span id="i30"></span>30 | [Event emitter](#p30)                    | 🟡 ⭐      |

---

<a id="p1"></a>

## 1. Two Sum ⭐

**Description:** Given array and target, return indices of two numbers that add to target. Assume exactly one solution.

```javascript
// Input: nums = [2, 7, 11, 15], target = 9
// Output: [0, 1]
```

```javascript
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
```

**Time:** O(n) · **Space:** O(n)

<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Reverse string / array ⭐

**Description:** Reverse in place or return new reversed array/string.

```javascript
// 'hello' → 'olleh'   |   [1,2,3] → [3,2,1]
```

```javascript
function reverseString(s) {
  return s.split('').reverse().join('');
}

function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}
```

<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Palindrome check ⭐

**Description:** Return true if string reads same forwards and backwards (ignore case/spaces for variant).

```javascript
// 'racecar' → true   |   'hello' → false
```

```javascript
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

// Two-pointer (no extra array)
function isPalindromeFast(s) {
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}
```

<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. FizzBuzz

**Description:** 1 to n: multiples of 3 → "Fizz", 5 → "Buzz", both → "FizzBuzz", else number.

```javascript
function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(i);
  }
  return result;
}
```

<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Remove duplicates ⭐

**Description:** Return array with unique values (primitives or by key).

```javascript
// [1,1,2,3,3] → [1,2,3]
```

```javascript
const unique = (arr) => [...new Set(arr)];

const uniqueById = (arr) => [
  ...new Map(arr.map((item) => [item.id, item])).values(),
];
```

<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Find max / min

```javascript
const max = (arr) => Math.max(...arr);
const min = (arr) => Math.min(...arr);

// Safe for large arrays — reduce avoids spread limit
const maxReduce = (arr) => arr.reduce((m, n) => (n > m ? n : m), -Infinity);
```

<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Anagram check ⭐

**Description:** Two strings are anagrams if same letters, different order.

```javascript
// 'listen', 'silent' → true
```

```javascript
function isAnagram(a, b) {
  const norm = (s) => s.toLowerCase().split('').sort().join('');
  return norm(a) === norm(b);
}

// O(n) with frequency map
function isAnagramFast(a, b) {
  if (a.length !== b.length) return false;
  const count = {};
  for (const ch of a) count[ch] = (count[ch] ?? 0) + 1;
  for (const ch of b) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}
```

<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Character / word frequency ⭐

```javascript
function charFrequency(s) {
  return [...s].reduce((acc, ch) => {
    acc[ch] = (acc[ch] ?? 0) + 1;
    return acc;
  }, {});
}
// charFrequency('aab') → { a: 2, b: 1 }

function wordFrequency(sentence) {
  return sentence.split(/\s+/).reduce((acc, word) => {
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, {});
}
```

<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Valid parentheses ⭐

**Description:** Check balanced `()[]{}.`

```javascript
// '{[()]}' → true
```

See full solution in [07-sorting-stack-queue.md](./07-sorting-stack-queue.md#p5--valid-parentheses--most-common)

<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Merge two sorted arrays ⭐

```javascript
// [1,3,5] + [2,4,6] → [1,2,3,4,5,6]
```

See [07-sorting-stack-queue.md](./07-sorting-stack-queue.md#p1--merge-two-sorted-arrays)

<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Binary search ⭐

**Description:** Find index of target in sorted array, or -1.

```javascript
// nums = [1,3,5,7,9], target = 5 → 2
```

```javascript
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

**Time:** O(log n)

<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Flatten array ⭐

**Description:** Nested array → single depth or full flat.

```javascript
// [1, [2, [3, 4]]] → [1, 2, 3, 4]
```

```javascript
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}

// Built-in
[1, [2, [3]]].flat(Infinity);
```

<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Chunk array

**Description:** Split array into groups of size n.

```javascript
// chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]
```

```javascript
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
```

<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Debounce ⭐

**Description:** Delay execution until user stops triggering (search input).

```javascript
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

See [01-higher-order-functions.md](./01-higher-order-functions.md)

<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Throttle ⭐

**Description:** Run at most once per interval (scroll handler).

```javascript
function throttle(fn, limit) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}
```

<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Implement `map` ⭐

```javascript
function myMap(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) result.push(fn(arr[i], i, arr));
  }
  return result;
}
```

<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Implement `filter`

```javascript
function myFilter(arr, predicate) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (i in arr && predicate(arr[i], i, arr)) result.push(arr[i]);
  }
  return result;
}
```

<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. Implement `reduce` ⭐

```javascript
function myReduce(arr, reducer, initial) {
  let acc = initial;
  let start = 0;
  if (initial === undefined) {
    if (arr.length === 0) throw new TypeError('Empty array');
    acc = arr[0];
    start = 1;
  }
  for (let i = start; i < arr.length; i++) {
    if (i in arr) acc = reducer(acc, arr[i], i, arr);
  }
  return acc;
}
```

<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Deep clone ⭐

**Description:** Copy nested object with no shared references.

```javascript
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value);
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

// Modern: structuredClone(obj)
```

<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. Memoize ⭐

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

<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

## 21. Curry

**Description:** `add(1)(2)(3)` → 6 or `add(1,2)(3)`.

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
```

<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

## 22. Flatten object

**Description:** `{ a: { b: 1 } }` → `{ 'a.b': 1 }`

```javascript
function flattenObject(obj, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}
```

<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

## 23. Group by key ⭐

**Description:** Array of objects → object keyed by field.

```javascript
// [{dept:'Eng'},{dept:'Sales'},{dept:'Eng'}]
// → { Eng: [...], Sales: [...] }
```

```javascript
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key];
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

// ES2024: Object.groupBy(arr, (item) => item.dept)
```

<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

## 24. Pick / omit

```javascript
const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

const omit = (obj, keys) => {
  const skip = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !skip.has(k)));
};
```

<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

## 25. Capitalize words

```javascript
function capitalizeWords(s) {
  return s.replace(/\b\w/g, (ch) => ch.toUpperCase());
}
// 'hello world' → 'Hello World'
```

<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

## 26. Longest substring without repeating chars ⭐

**Description:** Sliding window — max length of substring with all unique characters.

```javascript
// 'abcabcbb' → 3 ('abc')
```

```javascript
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let start = 0;
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (last.has(ch) && last.get(ch) >= start) {
      start = last.get(ch) + 1;
    }
    last.set(ch, i);
    max = Math.max(max, i - start + 1);
  }
  return max;
}
```

<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

## 27. Promise.all polyfill ⭐

**Description:** Resolve when all promises resolve; reject on first rejection.

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);
    const results = [];
    let done = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        if (++done === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

## 28. Sleep / delay

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function demo() {
  console.log('start');
  await sleep(1000);
  console.log('after 1s');
}
```

<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

## 29. LRU cache (simplified)

**Description:** Cache with max size — evict least recently used.

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // refresh as most recent
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
  }
}
```

<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

## 30. Event emitter ⭐

**Description:** Pub/sub — `on`, `off`, `emit` (like Node EventEmitter).

```javascript
class EventEmitter {
  #events = new Map();

  on(event, handler) {
    if (!this.#events.has(event)) this.#events.set(event, new Set());
    this.#events.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.#events.get(event)?.delete(handler);
  }

  emit(event, ...args) {
    this.#events.get(event)?.forEach((handler) => handler(...args));
  }

  once(event, handler) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      handler(...args);
    };
    this.on(event, wrapper);
  }
}

const bus = new EventEmitter();
bus.on('cart:update', (count) => console.log('cart', count));
bus.emit('cart:update', 3);
```

**Tie-in:** Same pattern as `createStore` subscribe in `vanilla-js/02-catalog-spa`.

<p><a href="#i30">Back to index</a></p>

---

## Study plan (1 week)

| Day | Focus                                                                                |
| --- | ------------------------------------------------------------------------------------ |
| 1   | #1–#8 — arrays, strings, hash map                                                    |
| 2   | #9–#12 — stack, merge, binary search, flatten                                        |
| 3   | #14–#20 — HOF, debounce, memoize, deep clone                                         |
| 4   | #23–#27 — objects, sliding window, Promise.all                                       |
| 5   | #29–#30 + [sorting/stack/queue](./07-sorting-stack-queue.md)                         |
| 6   | Mock — 2 random problems timed 25 min each                                           |
| 7   | Review output questions in [06](./06-shallow-deep-copy-closures-hoisting-memoize.md) |

---

## Interview tips

1. **Clarify** — empty input? negative numbers? mutate or new array?
2. **Brute force first** — then optimize (Two Sum hash map)
3. **State complexity** — say O(n) time / O(n) space out loud
4. **Use built-ins** when allowed — `Set`, `Map`, `sort` — then offer manual if asked
5. **Test** — empty `[]`, single element, duplicates
