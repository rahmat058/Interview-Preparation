---
title: 'JavaScript Strings — Practice Tasks with Answers'
description: '48 string exercises with explanations and solutions — basics through regex, templates, and parsing.'
tags: ['javascript', 'strings', 'practice', 'solutions', 'interview']
level: 'Beginner to Intermediate'
---

# String Practice Tasks — Answers

Solutions for every task in [tasks.md](./tasks.md). Try each task yourself first, then compare with these answers.

**Reference:** [01-javascript-strings-course-reference.md](./01-javascript-strings-course-reference.md) · [03-strings-core-functions.md](../vanila-js/03-strings-core-functions.md)

---

<a id="quick-index"></a>

## Quick index

### 1. Fundamentals (T-001 – T-020)

| # | Question |
| --- | --- |
| <span id="i1"></span> | [T-001: Create strings with quotes and template literal](#t001) |
|  | [T-002: Length and first/last character](#t002) |
|  | [T-003: `charAt()` vs bracket notation](#t003) |
|  | [T-004: `at()` with negative index](#t004) |
|  | [T-005: String immutability](#t005) |
|  | [T-006: Uppercase and lowercase](#t006) |
|  | [T-007: Trim whitespace](#t007) |
|  | [T-008: `includes`, `startsWith`, `endsWith`](#t008) |
|  | [T-009: `indexOf` and `lastIndexOf`](#t009) |
|  | [T-010: Extract with `slice`](#t010) |
|  | [T-011: `slice` vs `substring`](#t011) |
|  | [T-012: `replace` first occurrence](#t012) |
|  | [T-013: `replaceAll`](#t013) |
|  | [T-014: `split` into array](#t014) |
|  | [T-015: `join` array to string](#t015) |
|  | [T-016: `padStart` and `padEnd`](#t016) |
|  | [T-017: `repeat`](#t017) |
|  | [T-018: Character codes](#t018) |
|  | [T-019: Emoji length trap](#t019) |
|  | [T-020: Template literal HTML snippet](#t020) |

### 2. Article dataset (T-021 – T-040)

| # | Question |
| --- | --- |
| <span id="i2"></span> | [T-021: Trimmed lowercased titles](#t021) |
|  | [T-022: Filter by `@company.io` email](#t022) |
|  | [T-023: Extract email domain](#t023) |
|  | [T-024: Create URL slug from title](#t024) |
|  | [T-025: Case-insensitive title search](#t025) |
|  | [T-026: Split tags into array](#t026) |
|  | [T-027: Join tags with ` | `](#t027) |
|  | [T-028: Format id as 4-digit string](#t028) |
|  | [T-029: Spaces to underscores](#t029) |
|  | [T-030: Count words in title](#t030) |
|  | [T-031: Reverse word order](#t031) |
|  | [T-032: All emails end with `.com` or `.io`](#t032) |
|  | [T-033: Username before `@`](#t033) |
|  | [T-034: Title case](#t034) |
|  | [T-035: Truncate with ellipsis](#t035) |
|  | [T-036: Search title or tags](#t036) |
|  | [T-037: Extract TLD from email](#t037) |
|  | [T-038: Parse log line key-value pairs](#t038) |
|  | [T-039: Highlight search term in title](#t039) |
|  | [T-040: Sort titles with `localeCompare`](#t040) |

### 3. Regex, templates & advanced (T-041 – T-048)

| # | Question |
| --- | --- |
| <span id="i3"></span> | [T-041: Validate email with regex](#t041) |
|  | [T-042: Extract numbers with `match`](#t042) |
|  | [T-043: `matchAll` for digit groups](#t043) |
|  | [T-044: Multi-line template literal](#t044) |
|  | [T-045: Tagged template with `<strong>`](#t045) |
|  | [T-046: `String.raw` for file paths](#t046) |
|  | [T-047: Unicode `normalize`](#t047) |
|  | [T-048: Parse query string](#t048) |

---


<a id="p1"></a>

## 1. Fundamentals (T-001 – T-020)

<a id="t001"></a>

### T-001: Create strings with quotes and template literal

**Answer:**

> Three ways to create strings. Template literals allow interpolation and multiline text.

```javascript
const a = 'hello';
const b = "world";
const c = `hello ${b}`; // 'hello world'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t002"></a>

### T-002: Length and first/last character

**Answer:**

> Use `.length` and index `0` / `length - 1`, or `.at(-1)` for the last char.

```javascript
const s = 'javascript';
s.length;    // 10
s[0];        // 'j'
s[s.length - 1]; // 't'
s.at(-1);    // 't'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t003"></a>

### T-003: `charAt()` vs bracket notation

**Answer:**

> Both return a character. `charAt` returns empty string out of bounds; bracket returns `undefined`.

```javascript
const s = 'hi';
s.charAt(0);  // 'h'
s[0];         // 'h'
s.charAt(5);  // ''
s[5];         // undefined
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t004"></a>

### T-004: `at()` with negative index

**Answer:**

> ES2022 `.at(-1)` reads from the end — same idea as array `.at()`.

```javascript
const s = 'hello';
s.at(-1); // 'o'
s.at(-2); // 'l'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t005"></a>

### T-005: String immutability

**Answer:**

> Strings cannot be mutated in place. Assignment creates a new reference to a new string.

```javascript
let s = 'hello';
s[0] = 'H'; // fails silently / strict: no effect
s = 'H' + s.slice(1); // 'Hello' — new string
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t006"></a>

### T-006: Uppercase and lowercase

**Answer:**

> `toUpperCase` and `toLowerCase` return new strings.

```javascript
'Hello'.toUpperCase(); // 'HELLO'
'Hello'.toLowerCase(); // 'hello'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t007"></a>

### T-007: Trim whitespace

**Answer:**

> Remove whitespace from both ends or one side only.

```javascript
const s = '  hello  ';
s.trim();      // 'hello'
s.trimStart(); // 'hello  '
s.trimEnd();   // '  hello'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t008"></a>

### T-008: `includes`, `startsWith`, `endsWith`

**Answer:**

> Boolean search methods — all case-sensitive by default.

```javascript
const s = 'hello world';
s.includes('world');   // true
s.startsWith('hello'); // true
s.endsWith('ld');      // true
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t009"></a>

### T-009: `indexOf` and `lastIndexOf`

**Answer:**

> Return index or `-1` if not found.

```javascript
const s = 'hello world hello';
s.indexOf('hello');     // 0
s.lastIndexOf('hello'); // 12
s.indexOf('xyz');       // -1
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t010"></a>

### T-010: Extract with `slice`

**Answer:**

> `slice(start, end)` — end is exclusive. Negative start counts from end.

```javascript
const s = 'hello world';
s.slice(0, 5);  // 'hello'
s.slice(6);     // 'world'
s.slice(-5);    // 'world'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t011"></a>

### T-011: `slice` vs `substring`

**Answer:**

> `slice` supports negative indices. `substring` swaps arguments if start > end and treats negatives as 0.

```javascript
'hello'.slice(-3);       // 'llo'
'hello'.substring(-3);   // 'hello' — negative → 0
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t012"></a>

### T-012: `replace` first occurrence

**Answer:**

> Replaces only the **first** match unless using regex with `g`.

```javascript
'hello'.replace('l', 'x'); // 'hexlo'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t013"></a>

### T-013: `replaceAll`

**Answer:**

> Replaces every occurrence of a substring.

```javascript
'hello'.replaceAll('l', 'x'); // 'hexxo'
'hello'.replace(/l/g, 'x');   // same with regex
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t014"></a>

### T-014: `split` into array

**Answer:**

> Split on delimiter or empty string for characters.

```javascript
'a,b,c'.split(','); // ['a','b','c']
'hello'.split('');  // ['h','e','l','l','o']
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t015"></a>

### T-015: `join` array to string

**Answer:**

> Inverse of split — concatenates with separator.

```javascript
['hello', 'world'].join(' '); // 'hello world'
['a','b','c'].join('-');      // 'a-b-c'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t016"></a>

### T-016: `padStart` and `padEnd`

**Answer:**

> Pad to target length with fill string.

```javascript
'42'.padStart(5, '0'); // '00042'
'42'.padEnd(5, '-');   // '42---'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t017"></a>

### T-017: `repeat`

**Answer:**

> Repeat string n times.

```javascript
'-'.repeat(10); // '----------'
'ha'.repeat(3);  // 'hahaha'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t018"></a>

### T-018: Character codes

**Answer:**

> `charCodeAt` gets code unit; `fromCharCode` builds string from codes.

```javascript
'A'.charCodeAt(0);              // 65
String.fromCharCode(72, 105);   // 'Hi'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t019"></a>

### T-019: Emoji length trap

**Answer:**

> Emoji use surrogate pairs — `.length` is 2. Spread counts code points.

```javascript
'😀'.length;      // 2
[...'😀'].length; // 1
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t020"></a>

### T-020: Template literal HTML snippet

**Answer:**

> Embed expressions inside backticks for dynamic strings.

```javascript
const name = 'Alice';
const role = 'admin';

const html = `<div class="user"><h2>${name}</h2><span>${role}</span></div>`;
```


<p><a href="#i1">Back to index</a></p>

---

<a id="p2"></a>

## 2. Article dataset (T-021 – T-040)

Shared setup:

```javascript
const articles = [
  { id: 1, title: '  Learn JavaScript  ', author: 'alice@company.io', tags: 'js,web,api' },
  { id: 2, title: 'React Hooks Guide', author: 'bob@mail.com', tags: 'react,hooks' },
  { id: 3, title: 'NODE.JS PERFORMANCE', author: 'carol@company.io', tags: 'node,perf' },
  { id: 4, title: 'css tricks for beginners', author: 'dave@mail.com', tags: 'css,ui' },
  { id: 5, title: 'API Design Patterns  ', author: 'eve@startup.io', tags: 'api,design,js' },
];
```

<a id="t021"></a>

### T-021: Trimmed lowercased titles

**Answer:**

> Map to new strings — `trim` then `toLowerCase` without mutating source.

```javascript
const cleaned = articles.map((a) => a.title.trim().toLowerCase());
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t022"></a>

### T-022: Filter by `@company.io` email

**Answer:**

> `includes` on author field.

```javascript
const company = articles.filter((a) => a.author.includes('@company.io'));
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t023"></a>

### T-023: Extract email domain

**Answer:**

> Split on `@` and take index 1.

```javascript
const domains = articles.map((a) => a.author.split('@')[1]);
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t024"></a>

### T-024: Create URL slug from title

**Answer:**

> Trim, lowercase, replace spaces with hyphens, remove special chars.

```javascript
function toSlug(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t025"></a>

### T-025: Case-insensitive title search

**Answer:**

> Compare lowercased strings.

```javascript
const term = 'javascript';
const found = articles.filter((a) =>
  a.title.toLowerCase().includes(term)
);
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t026"></a>

### T-026: Split tags into array

**Answer:**

> `split(',')` per article.

```javascript
const withTagArrays = articles.map((a) => ({
  ...a,
  tagList: a.tags.split(','),
}));
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t027"></a>

### T-027: Join tags with ` | `

**Answer:**

> `split` then `join` for display format.

```javascript
articles.map((a) => a.tags.split(',').join(' | '));
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t028"></a>

### T-028: Format id as 4-digit string

**Answer:**

> `String(id).padStart(4, '0')`.

```javascript
articles.map((a) => String(a.id).padStart(4, '0'));
// ['0001', '0002', ...]
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t029"></a>

### T-029: Spaces to underscores

**Answer:**

> `replaceAll(' ', '_')` after trim.

```javascript
articles.map((a) => a.title.trim().replaceAll(' ', '_'));
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t030"></a>

### T-030: Count words in title

**Answer:**

> Split on whitespace and count length.

```javascript
function wordCount(title) {
  return title.trim().split(/\s+/).length;
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t031"></a>

### T-031: Reverse word order

**Answer:**

> trim → split → reverse → join.

```javascript
function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t032"></a>

### T-032: All emails end with `.com` or `.io`

**Answer:**

> `every` with `endsWith` check.

```javascript
const allValid = articles.every(
  (a) => a.author.endsWith('.com') || a.author.endsWith('.io')
);
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t033"></a>

### T-033: Username before `@`

**Answer:**

> `split('@')[0]`.

```javascript
const usernames = articles.map((a) => a.author.split('@')[0]);
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t034"></a>

### T-034: Title case

**Answer:**

> Capitalize first letter of each word.

```javascript
function toTitleCase(str) {
  return str
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t035"></a>

### T-035: Truncate with ellipsis

**Answer:**

> Slice to max length and append `…`.

```javascript
function truncate(str, max = 20) {
  const t = str.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + '…';
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t036"></a>

### T-036: Search title or tags

**Answer:**

> Case-insensitive match in either field.

```javascript
function searchArticles(list, term) {
  const q = term.toLowerCase();
  return list.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.tags.toLowerCase().includes(q)
  );
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t037"></a>

### T-037: Extract TLD from email

**Answer:**

> Last segment after final dot.

```javascript
const tlds = articles.map((a) => a.author.slice(a.author.lastIndexOf('.')));
// '.io', '.com', ...
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t038"></a>

### T-038: Parse log line key-value pairs

**Answer:**

> Split tokens, parse `key=value` pairs into object.

```javascript
function parseLog(line) {
  const parts = line.replace(/^\[.*?\]\s*/, '').split(' ');
  return Object.fromEntries(
    parts.map((p) => p.split('=')).filter(([k]) => k)
  );
}

parseLog('[ERROR] user=alice code=500');
// { user: 'alice', code: '500' }
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t039"></a>

### T-039: Highlight search term in title

**Answer:**

> Find index case-insensitively, wrap match in `<mark>`.

```javascript
function highlight(text, term) {
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


<p><a href="#i2">Back to index</a></p>

---
<a id="t040"></a>

### T-040: Sort titles with `localeCompare`

**Answer:**

> Locale-aware alphabetical sort.

```javascript
const sorted = [...articles].sort((a, b) =>
  a.title.trim().localeCompare(b.title.trim(), 'en', { sensitivity: 'base' })
);
```


<p><a href="#i2">Back to index</a></p>

---

<a id="p3"></a>

## 3. Regex, templates & advanced (T-041 – T-048)

<a id="t041"></a>

### T-041: Validate email with regex

**Answer:**

> Basic pattern check — not production-grade but common in interviews.

```javascript
const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
emailRegex.test('alice@company.io'); // true
emailRegex.test('not-an-email');    // false
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t042"></a>

### T-042: Extract numbers with `match`

**Answer:**

> Global regex returns all matches.

```javascript
'order 42 costs 19.99'.match(/\d+(\.\d+)?/g);
// ['42', '19.99']
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t043"></a>

### T-043: `matchAll` for digit groups

**Answer:**

> Iterator of match objects — spread to array.

```javascript
const matches = [...'a1 b22 c333'.matchAll(/\d+/g)].map((m) => m[0]);
// ['1', '22', '333']
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t044"></a>

### T-044: Multi-line template literal

**Answer:**

> Backticks allow newlines and interpolated expressions.

```javascript
const name = 'Alice';
const date = new Date().toDateString();

const card = `User: ${name}
Date: ${date}`;
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t045"></a>

### T-045: Tagged template with `<strong>`

**Answer:**

> Tag function receives string parts and interpolated values.

```javascript
function strong(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const val = values[i] ?? '';
    return acc + str + (val ? `<strong>${val}</strong>` : '');
  }, '');
}

const name = 'Alice';
strong`Hello, ${name}!`; // 'Hello, <strong>Alice</strong>!'
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t046"></a>

### T-046: `String.raw` for file paths

**Answer:**

> Preserves backslashes without escaping.

```javascript
const winPath = String.raw`C:\Users\Alice\Documents`;
// 'C:\\Users\\Alice\\Documents'
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t047"></a>

### T-047: Unicode `normalize`

**Answer:**

> NFC combines composed characters consistently.

```javascript
const composed = 'e\u0301';
composed.normalize('NFC'); // 'é' (single code point)
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t048"></a>

### T-048: Parse query string

**Answer:**

> `URLSearchParams` + `Object.fromEntries`.

```javascript
function parseQuery(search = '') {
  const params = new URLSearchParams(
    search.startsWith('?') ? search : '?' + search
  );
  return Object.fromEntries(params.entries());
}

parseQuery('?page=2&sort=name');
// { page: '2', sort: 'name' }
```


<p><a href="#i3">Back to index</a></p>

---

## Quick reference — method by task

| Tasks | Primary APIs |
| --- | --- |
| T-001 – T-005 | literals, `.length`, `charAt`, `.at()`, immutability |
| T-006 – T-013 | `toUpperCase`, `trim`, `includes`, `indexOf`, `slice`, `replace`, `replaceAll` |
| T-014 – T-020 | `split`, `join`, `padStart`, `repeat`, `charCodeAt`, templates |
| T-021 – T-040 | trim, slug, title case, truncate, highlight, `localeCompare` |
| T-041 – T-048 | regex, `matchAll`, tagged templates, `String.raw`, `URLSearchParams` |

**Interview tip:** Practice explaining T-005 (immutability), T-011 (slice vs substring), and T-019 (emoji length) aloud.
