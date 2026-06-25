---
title: 'JavaScript Strings — Core Functions Interview Guide'
description: 'Search, slice, immutability, template literals, parsing, regex — intermediate to senior.'
tags: ['javascript', 'strings', 'interview']
level: 'Intermediate to Senior'
---

# Strings — Core Functions Interview Guide

Strings are **immutable** in JavaScript — methods return new strings.

---

## Table of Contents

1. [Immutability](#1-immutability)
2. [Access & length](#2-access--length)
3. [Search methods](#3-search-methods)
4. [Extract: slice, substring, substr](#4-extract-slice-substring-substr)
5. [Transform](#5-transform)
6. [Trim & pad](#6-trim--pad)
7. [Split & join](#7-split--join)
8. [Template literals](#8-template-literals)
9. [Regex essentials](#9-regex-essentials)
10. [Senior scenarios](#10-senior-scenarios)

---

## 1. Immutability

```javascript
let s = 'hello';
s[0] = 'H'; // silent fail in sloppy mode; ignored in strict
s = s.toUpperCase(); // must reassign — returns new string 'HELLO'
```

**Interview answer:**

> Strings are primitives and immutable. Every "change" creates a new string — important for performance when building large text (use array + `join`).

---

## 2. Access & length

```javascript
const s = 'hello';
s.length; // 5
s[0]; // 'h'
s.charAt(0); // 'h'
s.charAt(99); // '' (out of bounds)
s.at(-1); // 'o' — ES2022, supports negative index
s.codePointAt(0); // 104
```

**Unicode trap:**

```javascript
'😀'.length // 2 — surrogate pair
[...'😀'].length // 1 — spread by code point
```

---

## 3. Search methods

| Method             | Returns   | Notes             |
| ------------------ | --------- | ----------------- |
| `includes(sub)`    | `boolean` | Case-sensitive    |
| `startsWith(sub)`  | `boolean` | Optional position |
| `endsWith(sub)`    | `boolean` | Optional position |
| `indexOf(sub)`     | `number`  | `-1` if not found |
| `lastIndexOf(sub)` | `number`  | From end          |
| `search(regex)`    | `number`  | Regex only        |

```javascript
const email = 'user@company.io';

email.includes('@'); // true
email.startsWith('user'); // true
email.endsWith('.io'); // true
email.indexOf('@'); // 4

// Case-insensitive check
email.toLowerCase().includes('USER'.toLowerCase());
```

---

## 4. Extract: slice, substring, substr

```javascript
const s = 'hello world';

s.slice(0, 5); // 'hello' — [start, end)
s.slice(6); // 'world'
s.slice(-5); // 'world' — negative start

s.substring(0, 5); // 'hello' — swaps if start > end
s.substr(6, 5); // 'world' — deprecated, avoid in new code
```

**Interview answer:**

> Prefer `slice` — supports negative indices and consistent with arrays. `substring` normalizes negative args to 0.

---

## 5. Transform

```javascript
'Hello'.toLowerCase(); // 'hello'
'hello'.toUpperCase(); // 'HELLO'
'hello'.replace('l', 'x'); // 'hexlo' — first only
'hello'.replaceAll('l', 'x'); // 'hexxo'
'hello'.replace(/l/g, 'x'); // 'hexxo'

// replace with callback (HOF!)
'user-name-id'.replace(/-(\w)/g, (_, ch) => ch.toUpperCase());
// 'userNameId' — naive camelCase
```

---

## 6. Trim & pad

```javascript
'  hello  '.trim(); // 'hello'
'  hello  '.trimStart(); // 'hello  '
'42'.padStart(5, '0'); // '00042'
'42'.padEnd(5, '-'); // '42---'
```

**Format currency / ids:**

```javascript
String(orderId).padStart(6, '0'); // '000042'
```

---

## 7. Split & join

```javascript
'a,b,c'.split(','); // ['a','b','c']
'a,b,c'.split(',', 2); // ['a','b'] — limit
'hello'.split(''); // ['h','e','l','l','o']
'hello'
  .split() // ['hello'] — no separator

  [('a', 'b', 'c')].join('-'); // 'a-b-c'
```

**Reverse words:**

```javascript
function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}
```

**Build strings efficiently (senior):**

```javascript
// Bad — O(n²) string concat in loop
let result = '';
for (const chunk of chunks) result += chunk;

// Good — O(n)
const result = chunks.join('');
// or
const result2 = chunks.reduce((acc, c) => acc + c, '');
```

---

## 8. Template literals

```javascript
const name = 'Alice';
const salary = 90000;

const msg = `Hello, ${name}! Salary: ${salary.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
})}`;

// Multiline
const html = `
  <article class="card">
    <h2>${name}</h2>
  </article>
`;

// Tagged templates (advanced HOF)
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const val = values[i] ?? '';
    return acc + str + (val ? `<mark>${val}</mark>` : '');
  }, '');
}

const query = 'react';
const text = highlight`Search results for ${query}`;
```

---

## 9. Regex essentials

```javascript
const slug = '  Hello World!  '
  .trim()
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
// 'hello-world'

// Test pattern
/^[\w.-]+@[\w.-]+\.\w+$/.test('user@co.io') // basic email check

// match vs matchAll
'a1 b2'.match(/\d+/g)     // ['1', '2']
[...'a1 b2'.matchAll(/\d+/g)].map((m) => m[0]) // ['1', '2']
```

---

## 10. Senior scenarios

### Highlight search term (catalog search)

```javascript
function highlightMatch(text, term) {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return text;
  return (
    text.slice(0, i) +
    '<mark>' +
    text.slice(i, i + term.length) +
    '</mark>' +
    text.slice(i + term.length)
  );
}
```

### Parse query string

```javascript
function parseQuery(search = '') {
  const params = new URLSearchParams(
    search.startsWith('?') ? search : `?${search}`
  );
  return Object.fromEntries(params.entries());
}

parseQuery('?page=2&sort=name'); // { page: '2', sort: 'name' }
```

### Truncate with ellipsis

```javascript
function truncate(str, max = 50) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + '…';
}
```

### `localeCompare` for sort

```javascript
names.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
```

### `Intl` formatting

```javascript
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
  1499.99
);
new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date());
```

---

## 11. Additional string built-ins

### `repeat`

```javascript
'•'.repeat(3); // '•••'
'0'.repeat(4); // '0000' — pad alternative
```

### `normalize` (Unicode)

```javascript
const composed = 'e\u0301'; // e + combining accent
composed.normalize('NFC'); // single 'é' character
```

### `match` vs `matchAll`

```javascript
'price: $10, tax: $2'.match(/\$(\d+)/g); // ['$10', '$2'] — no groups with g
[...'a1 b2'.matchAll(/\d+/g)].map((m) => m[0]); // ['1', '2']
```

### `charCodeAt` vs `codePointAt`

```javascript
'A'.charCodeAt(0); // 65
'😀'.codePointAt(0); // 128512 — full emoji code point
```

### String static methods

```javascript
String.fromCharCode(72, 105); // 'Hi'
String.fromCodePoint(0x1f600); // '😀'
String.raw`C:\new\folder`; // 'C:\\new\\folder'
```

---

## Quick Reference

| Task                | API                                    |
| ------------------- | -------------------------------------- |
| Contains            | `includes`, `startsWith`, `endsWith`   |
| Find position       | `indexOf`, `search`                    |
| Substring           | `slice`                                |
| Replace             | `replace`, `replaceAll`                |
| Case                | `toLowerCase`, `toUpperCase`           |
| Whitespace          | `trim`, `trimStart`, `trimEnd`         |
| Array ↔ string      | `split`, `join`                        |
| Interpolation       | template literals `` `${}` ``          |
| Unicode-safe length | `[...str].length`                      |
| Repeat              | `repeat(n)`                            |
| Unicode normalize   | `normalize('NFC')`                     |
| Locale sort         | `localeCompare`                        |
| Char codes          | `charCodeAt`, `codePointAt`            |
| Static constructors | `String.fromCharCode`, `fromCodePoint` |
