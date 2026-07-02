---
title: 'JavaScript Strings — Course Reference & Interview Guide'
description: 'Complete string reference — immutability, search, slice, transform, split/join, templates, regex, Unicode.'
tags: ['javascript', 'strings', 'interview', 'regex', 'template-literals', 'slice']
level: 'Beginner to Senior'
---

# JavaScript Strings — Course Reference

Structured notes for string fundamentals and built-in methods, formatted for interview preparation. For senior traps and patterns, also see [03-strings-core-functions.md](../vanila-js/03-strings-core-functions.md).

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Creation & immutability](#p1) |
| <span id="i2"></span>2 | [Access & length](#p2) |
| <span id="i3"></span>3 | [Search methods](#p3) |
| <span id="i4"></span>4 | [Extract: `slice`, `substring`](#p4) |
| <span id="i5"></span>5 | [Transform & replace](#p5) |
| <span id="i6"></span>6 | [Trim & pad](#p6) |
| <span id="i7"></span>7 | [Split & join](#p7) |
| <span id="i8"></span>8 | [Template literals](#p8) |
| <span id="i9"></span>9 | [Regex essentials](#p9) |
| <span id="i10"></span>10 | [Unicode & static methods](#p10) |
| <span id="i11"></span>11 | [Utility patterns](#p11) |

---

<a id="p1"></a>

## 1. Creation & immutability

### Create strings

```javascript
const single = 'hello';
const double = "world";
const template = `hello ${double}`; // 'hello world'

const multi = `Line 1
Line 2`;
```

### Strings are immutable

```javascript
let s = 'hello';
s[0] = 'H'; // does not mutate (ignored in strict mode)
s = s.toUpperCase(); // must reassign — returns new string 'HELLO'
```

**Interview answer:**

> Strings are **primitives** and **immutable**. Every method that "changes" a string returns a **new** string. For large text building in loops, use an array + `join` instead of `+=`.

---

<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Access & length

```javascript
const s = 'hello';

s.length;      // 5
s[0];          // 'h'
s.charAt(0);   // 'h'
s.charAt(99);  // '' — out of bounds, no error
s.at(-1);      // 'o' — ES2022 negative index
s.at(-2);      // 'l'
```

### Character codes

```javascript
'A'.charCodeAt(0);           // 65
String.fromCharCode(72, 105); // 'Hi'
'😀'.codePointAt(0);         // 128512
String.fromCodePoint(0x1f600); // '😀'
```

### Unicode length trap

```javascript
'😀'.length;        // 2 — UTF-16 code units
[...'😀'].length;   // 1 — spread by code point
Array.from('😀').length; // 1
```

**Interview answer:**

> `.length` counts UTF-16 code units, not visual characters. Use spread or `Array.from` for emoji-safe length.

---

<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Search methods

| Method | Returns | Notes |
| --- | --- | --- |
| `includes(sub)` | `boolean` | Case-sensitive |
| `startsWith(sub)` | `boolean` | Optional start position |
| `endsWith(sub)` | `boolean` | Optional end position |
| `indexOf(sub)` | `number` | `-1` if not found |
| `lastIndexOf(sub)` | `number` | Search from end |
| `search(regex)` | `number` | Regex only |

```javascript
const email = 'user@company.io';

email.includes('@');        // true
email.startsWith('user');   // true
email.endsWith('.io');      // true
email.indexOf('@');         // 4
email.lastIndexOf('.');     // 12

// Case-insensitive check
email.toLowerCase().includes('USER'.toLowerCase());
```

---

<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Extract: `slice`, `substring`

```javascript
const s = 'hello world';

s.slice(0, 5);   // 'hello' — [start, end)
s.slice(6);      // 'world'
s.slice(-5);     // 'world' — negative start

s.substring(0, 5); // 'hello' — swaps if start > end
s.substr(6, 5);    // 'world' — deprecated, avoid
```

**Interview answer:**

> Prefer **`slice`** — supports negative indices and behaves like array `slice`. `substring` treats negative args as `0`.

---

<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Transform & replace

```javascript
'Hello'.toLowerCase();  // 'hello'
'hello'.toUpperCase();  // 'HELLO'

'hello'.replace('l', 'x');       // 'hexlo' — first only
'hello'.replaceAll('l', 'x');    // 'hexxo'
'hello'.replace(/l/g, 'x');      // 'hexxo'

// replace with callback
'user-name-id'.replace(/-(\w)/g, (_, ch) => ch.toUpperCase());
// 'userNameId'
```

### `repeat`

```javascript
'•'.repeat(3);  // '•••'
'0'.repeat(4);  // '0000'
```

---

<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Trim & pad

```javascript
'  hello  '.trim();       // 'hello'
'  hello  '.trimStart();  // 'hello  '
'  hello  '.trimEnd();    // '  hello'

'42'.padStart(5, '0');  // '00042'
'42'.padEnd(5, '-');    // '42---'
```

**Practical use:**

```javascript
String(orderId).padStart(6, '0'); // '000042'
```

---

<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Split & join

```javascript
'a,b,c'.split(',');     // ['a', 'b', 'c']
'a,b,c'.split(',', 2);  // ['a', 'b'] — limit
'hello'.split('');      // ['h','e','l','l','o']

['a', 'b', 'c'].join('-'); // 'a-b-c'
```

### Reverse words

```javascript
function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}
```

### Efficient string building

```javascript
// Bad — O(n²) in many engines
let result = '';
for (const chunk of chunks) result += chunk;

// Good — O(n)
const result = chunks.join('');
```

---

<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Template literals

```javascript
const name = 'Alice';
const salary = 90000;

const msg = `Hello, ${name}! Salary: $${salary}`;

const html = `
  <article>
    <h2>${name}</h2>
  </article>
`;
```

### Tagged templates

```javascript
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const val = values[i] ?? '';
    return acc + str + (val ? `<mark>${val}</mark>` : '');
  }, '');
}

const query = 'react';
highlight`Search results for ${query}`;
```

### `String.raw`

```javascript
String.raw`C:\new\folder`; // 'C:\\new\\folder'
```

---

<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Regex essentials

```javascript
const slug = '  Hello World!  '
  .trim()
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-');
// 'hello-world'

/^[\w.-]+@[\w.-]+\.\w+$/.test('user@co.io'); // basic email check

'price: $10, tax: $2'.match(/\$(\d+)/g); // ['$10', '$2']
[...'a1 b2'.matchAll(/\d+/g)].map((m) => m[0]); // ['1', '2']
```

**Interview answer:**

> Use `match` with `g` for all matches (no capture groups with `g`). Use `matchAll` when you need capture groups for each match.

---

<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Unicode & static methods

### `normalize`

```javascript
const composed = 'e\u0301'; // e + combining accent
composed.normalize('NFC');  // single 'é'
```

### `localeCompare`

```javascript
const names = ['Zoe', 'alice', 'Bob'];
names.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
```

### `Intl` formatting

```javascript
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1499.99);
new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date());
```

---

<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Utility patterns

### Highlight search term

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

### Truncate with ellipsis

```javascript
function truncate(str, max = 50) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + '…';
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

### Title case & slug

```javascript
function toTitleCase(str) {
  return str
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function toSlug(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
```

---

<p><a href="#i11">Back to index</a></p>

## Quick reference

| Task | API |
| --- | --- |
| Contains | `includes`, `startsWith`, `endsWith` |
| Find position | `indexOf`, `lastIndexOf`, `search` |
| Substring | `slice` |
| Replace | `replace`, `replaceAll` |
| Case | `toLowerCase`, `toUpperCase` |
| Whitespace | `trim`, `trimStart`, `trimEnd` |
| Array ↔ string | `split`, `join` |
| Interpolation | template literals `` `${}` `` |
| Unicode-safe length | `[...str].length` |
| Repeat | `repeat(n)` |
| Pad | `padStart`, `padEnd` |
| Locale sort | `localeCompare` |
| Parse query | `URLSearchParams` |

See also: [tasks.md](./tasks.md) · [03-strings-core-functions.md](../vanila-js/03-strings-core-functions.md)
