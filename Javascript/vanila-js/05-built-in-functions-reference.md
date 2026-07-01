---
title: 'Built-in Functions — Complete Interview Reference'
description: 'Math, Number, JSON, Date, Set, Map, Promise, globals — with examples for mid/senior interviews.'
tags:
  [
    'javascript',
    'built-in',
    'interview',
    'Math',
    'JSON',
    'Promise',
    'Set',
    'Map',
  ]
level: 'Intermediate to Senior'
---

# Built-in Functions — Complete Reference

Methods not covered in the array/string/object guides — **globals**, **Math**, **Number**, **JSON**, **Date**, **Set/Map**, and **Promise** combinators.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Global functions](#p1) |
| <span id="i2"></span>2 | [Number & parsing](#p2) |
| <span id="i3"></span>3 | [Math](#p3) |
| <span id="i4"></span>4 | [JSON](#p4) |
| <span id="i5"></span>5 | [Date](#p5) |
| <span id="i6"></span>6 | [Set built-ins](#p6) |
| <span id="i7"></span>7 | [Map built-ins](#p7) |
| <span id="i8"></span>8 | [Promise combinators](#p8) |
| <span id="i9"></span>9 | [Array static methods (extra)](#p9) |
| <span id="i10"></span>10 | [String static methods](#p10) |
| <span id="i11"></span>11 | [Object static methods (extra)](#p11) |

---

<a id="p1"></a>

## 1. Global functions

| Function                  | Purpose             | Interview note              |
| ------------------------- | ------------------- | --------------------------- |
| `parseInt(str, radix)`    | Parse integer       | Always pass radix `10`      |
| `parseFloat(str)`         | Parse float         | Stops at first invalid char |
| `isNaN(x)`                | Coerces then checks | Prefer `Number.isNaN`       |
| `isFinite(x)`             | Coerces then checks | Prefer `Number.isFinite`    |
| `encodeURI` / `decodeURI` | Full URI            | vs component variants       |
| `encodeURIComponent`      | Query param safe    | Use for `?q=` values        |

```javascript
parseInt('42px', 10); // 42
parseInt('08', 10); // 8
parseInt('0xff', 16); // 255

parseFloat('3.14em'); // 3.14
parseFloat(''); // NaN

isNaN('hello'); // true — coerces
Number.isNaN('hello'); // false — no coercion
Number.isNaN(NaN); // true

encodeURIComponent('a b&c'); // 'a%20b%26c'
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Number & parsing

| Method / API              | Example                                   |
| ------------------------- | ----------------------------------------- |
| `Number(value)`           | `Number('42')` → `42`, `Number('')` → `0` |
| `Number.isInteger(n)`     | `Number.isInteger(3.0)` → `true`          |
| `Number.isSafeInteger(n)` | ±2^53 − 1 range                           |
| `Number.parseInt(s, 10)`  | Same as global `parseInt`                 |
| `Number.parseFloat(s)`    | Same as global `parseFloat`               |
| `n.toFixed(digits)`       | `'3.14'` string — rounds                  |
| `n.toPrecision(n)`        | Significant digits                        |
| `n.toString(16)`          | Hex string                                |

```javascript
const price = 19.996;
price.toFixed(2); // '20.00' — string!
Number(price.toFixed(2))(
  // 20

  0.1 + 0.2
).toFixed(1); // '0.3' — display fix, not math fix
Number.EPSILON; // smallest float diff
```

**Interview answer:**

> `toFixed` returns a string for display. For money, store cents as integers or use a decimal library — never rely on float equality.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Math

| Method                  | Use                            |
| ----------------------- | ------------------------------ |
| `Math.round`            | Nearest integer                |
| `Math.floor`            | Down                           |
| `Math.ceil`             | Up                             |
| `Math.trunc`            | Drop decimals (toward zero)    |
| `Math.min` / `Math.max` | Variadic min/max               |
| `Math.abs`              | Absolute value                 |
| `Math.random`           | [0, 1) pseudo-random           |
| `Math.pow` / `**`       | Power                          |
| `Math.sqrt`             | Square root                    |
| `Math.clamp`            | _Not built-in_ — pattern below |

```javascript
Math.floor(3.9); // 3
Math.ceil(3.1); // 4
Math.trunc(-3.9); // -3  (floor would be -4)

Math.max(...[12, 5, 99]); // 99
Math.min(10, 20); // 10

// Random int in [min, max] inclusive
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clamp — pagination page bounds
function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
clamp(15, 1, 10); // 10
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. JSON

| API                                        | Purpose         |
| ------------------------------------------ | --------------- |
| `JSON.stringify(value, replacer?, space?)` | Object → string |
| `JSON.parse(text, reviver?)`               | String → value  |

```javascript
const user = { id: 1, name: 'Alice', token: 'secret' };

// Omit sensitive fields
JSON.stringify(user, ['id', 'name']);
// '{"id":1,"name":"Alice"}'

JSON.stringify(user, (key, value) => {
  if (key === 'token') return undefined;
  return value;
});

// Pretty print
JSON.stringify(user, null, 2);

// Date reviver
JSON.parse('{"joined":"2024-01-15"}', (key, value) => {
  if (key === 'joined') return new Date(value);
  return value;
});
```

**What `JSON.stringify` drops / fails on:**

- `undefined`, functions, symbols → omitted in objects; `undefined` in arrays → `null`
- `Date` → ISO string
- `Map`, `Set`, circular refs → error or partial

**Interview answer:**

> `JSON.parse/stringify` is not a full clone — use `structuredClone` for in-memory deep copy with more types.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Date

| Method                                      | Output                |
| ------------------------------------------- | --------------------- |
| `Date.now()`                                | ms timestamp (number) |
| `new Date(isoString)`                       | Parse ISO             |
| `getFullYear`, `getMonth` (0–11), `getDate` | Components            |
| `getTime()`                                 | ms since epoch        |
| `toISOString()`                             | UTC ISO string        |
| `toLocaleDateString(locale, opts)`          | Formatted             |

```javascript
const now = Date.now();
const d = new Date('2024-08-03T12:00:00Z');

d.getUTCFullYear(); // 2024
d.toISOString(); // '2024-08-03T12:00:00.000Z'

// Prefer Intl for display
new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(d);
```

**Interview trap:** `new Date('2024-08-03')` may parse as UTC midnight — timezone bugs in production.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Set built-ins

```javascript
const tags = new Set(['react', 'js', 'react'])

tags.add('ts')
tags.has('js')       // true
tags.delete('js')
tags.size            // 2
tags.clear()

// Iteration
for (const t of tags) console.log(t)
[...tags]            // array

// Set ops via HOFs
const a = new Set([1, 2, 3])
const b = new Set([2, 3, 4])
const union = new Set([...a, ...b])
const intersection = new Set([...a].filter((x) => b.has(x)))
```

| Method                              | Returns         |
| ----------------------------------- | --------------- |
| `add(value)`                        | Set (chainable) |
| `has(value)`                        | boolean         |
| `delete(value)`                     | boolean         |
| `clear()`                           | void            |
| `keys()` / `values()` / `entries()` | iterators       |

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Map built-ins

```javascript
const cache = new Map()

cache.set('user:1', { name: 'Alice' })
cache.get('user:1')           // { name: 'Alice' }
cache.has('user:1')           // true
cache.delete('user:1')
cache.size

// Any key type
const nodeMap = new Map()
const el = document.createElement('div')
nodeMap.set(el, { clicks: 0 })

// Iterate
for (const [key, value] of cache) { }
[...cache.keys()]
[...cache.values()]
[...cache.entries()]

// Map from array
new Map([['a', 1], ['b', 2]])
```

**vs plain object:** Map preserves insertion order, has `.size`, no prototype pollution, any key type.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Promise combinators

| API                       | Resolves when | Use                           |
| ------------------------- | ------------- | ----------------------------- |
| `Promise.all(arr)`        | All fulfill   | Parallel fetches — fails fast |
| `Promise.allSettled(arr)` | All finish    | Partial success OK            |
| `Promise.race(arr)`       | First settle  | Timeout pattern               |
| `Promise.any(arr)`        | First fulfill | Fallback servers              |

```javascript
// Parallel API calls
const [users, products] = await Promise.all([
  fetch('/api/users').then((r) => r.json()),
  fetch('/api/products').then((r) => r.json()),
]);

// allSettled — batch with errors
const results = await Promise.allSettled([fetch('/a'), fetch('/b')]);
results.filter((r) => r.status === 'fulfilled');

// Race timeout
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}
```

**Interview answer:**

> `Promise.all` fails fast on first rejection. Use `allSettled` when you need every result; `race` for timeouts or first-wins.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Array static methods (extra)

| Static                         | Purpose                               |
| ------------------------------ | ------------------------------------- |
| `Array.isArray(x)`             | Reliable array check                  |
| `Array.from(iterable, mapFn?)` | Iterable/array-like → array           |
| `Array.of(...items)`           | `[1,2,3]` without `new Array(n)` trap |

```javascript
Array.isArray([]); // true
Array.isArray({ length: 1 }); // false

Array.from('abc'); // ['a','b','c']
Array.from({ length: 3 }, (_, i) => i); // [0,1,2]
Array.from(new Set([1, 1, 2])); // [1, 2]

Array.of(3); // [3] — not empty×3
Array(3); // [empty × 3]
```

### Instance methods (additional)

| Method                              | Notes                               |
| ----------------------------------- | ----------------------------------- |
| `reduceRight`                       | Right-to-left fold                  |
| `join(sep)`                         | Array → string                      |
| `with(index, value)`                | ES2023 — immutable replace at index |
| `toSpliced(start, del, ...items)`   | ES2023 — immutable splice           |
| `copyWithin`                        | Mutates — copy region in place      |
| `keys()` / `values()` / `entries()` | Iterators                           |

```javascript
['a', 'b', 'c'].join('-'); // 'a-b-c'
[1, 2, 3].reduceRight((acc, n) => acc - n, 0); // -6

const arr = [1, 2, 3];
arr.with(1, 99); // [1, 99, 3] — arr unchanged
arr.toSpliced(1, 1, 'x', 'y'); // [1, 'x', 'y', 3]
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. String static methods

| Static                          | Example         |
| ------------------------------- | --------------- |
| `String.fromCharCode(65, 66)`   | `'AB'`          |
| `String.fromCodePoint(0x1f600)` | `'😀'`          |
| `String.raw`\`C:\path\n`\`      | Raw backslashes |

```javascript
String.raw`line1\nline2`; // 'line1\\nline2' — no escape processing
```

### Instance (additional)

| Method            | Purpose                       |
| ----------------- | ----------------------------- |
| `repeat(n)`       | `'ab'.repeat(3)` → `'ababab'` |
| `normalize(form)` | Unicode NFC/NFD               |
| `localeCompare`   | Locale-aware sort             |
| `charCodeAt(i)`   | UTF-16 unit code              |
| `codePointAt(i)`  | Full code point               |

```javascript
'e\u0301'.normalize('NFC'); // single composed é

'ä'.localeCompare('z', 'de'); // negative — German rules
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Object static methods (extra)

| Method                                     | Purpose                   |
| ------------------------------------------ | ------------------------- |
| `Object.create(proto)`                     | Prototype-linked object   |
| `Object.assign(target, ...sources)`        | Shallow merge into target |
| `Object.getOwnPropertyNames`               | Keys incl. non-enumerable |
| `Object.getOwnPropertyDescriptors`         | Descriptors for copy      |
| `Object.getPrototypeOf` / `setPrototypeOf` | Prototype chain           |
| `Object.is(a, b)`                          | Same-value (NaN, -0)      |
| `Object.defineProperty`                    | Fine-grained control      |

```javascript
// Object.is vs ===
Object.is(NaN, NaN); // true
Object.is(-0, +0); // false

const proto = {
  greet() {
    return 'hi';
  },
};
const obj = Object.create(proto);
obj.greet(); // 'hi' — prototype method

// Clone with descriptors
const clone = Object.create(
  Object.getPrototypeOf(original),
  Object.getOwnPropertyDescriptors(original)
);
```

---

## Master cheat sheet

| Category    | Must-know built-ins                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------- |
| **Array**   | `map`, `filter`, `reduce`, `find`, `some`, `every`, `slice`, `flat`, `sort`, `from`, `isArray` |
| **String**  | `slice`, `includes`, `split`, `trim`, `replace`, `replaceAll`, `padStart`, `at`                |
| **Object**  | `keys`, `values`, `entries`, `fromEntries`, `assign`, `hasOwn`, `freeze`                       |
| **Number**  | `Number()`, `isNaN`, `isInteger`, `toFixed`, `parseInt` + radix                                |
| **JSON**    | `parse`, `stringify` + replacer                                                                |
| **Set/Map** | `add`, `has`, `get`, `set`, `size`                                                             |
| **Promise** | `all`, `allSettled`, `race`                                                                    |
| **Math**    | `floor`, `ceil`, `round`, `min`, `max`, `random`                                               |


<p><a href="#i11">Back to index</a></p>
