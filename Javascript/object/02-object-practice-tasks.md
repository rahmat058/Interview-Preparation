---
title: 'JavaScript Objects — Practice Tasks with Answers'
description: '48 object exercises with explanations and solutions — basics through Map/Set, normalization, pick/omit.'
tags: ['javascript', 'objects', 'practice', 'solutions', 'interview']
level: 'Beginner to Intermediate'
---

# Object Practice Tasks — Answers

Solutions for every task in [tasks.md](./tasks.md). Try each task yourself first, then compare with these answers.

**Reference:** [01-javascript-objects-course-reference.md](./01-javascript-objects-course-reference.md) · [04-objects-core-functions.md](../vanila-js/04-objects-core-functions.md)

---

<a id="quick-index"></a>

## Quick index

### 1. Fundamentals (T-001 – T-020)

| # | Question |
| --- | --- |
| <span id="i1"></span> | [T-001: Create a user object using an object literal](#t001) |
|  | [T-002: Create an object using `new Object()`](#t002) |
|  | [T-003: Access property with dot and bracket notation](#t003) |
|  | [T-004: Add and update properties](#t004) |
|  | [T-005: Delete a property with `delete`](#t005) |
|  | [T-006: Check property with `in` vs `Object.hasOwn`](#t006) |
|  | [T-007: Destructure `name` and `email`](#t007) |
|  | [T-008: Destructure with rename and default](#t008) |
|  | [T-009: Rest destructuring to omit `password`](#t009) |
|  | [T-010: Nested destructuring](#t010) |
|  | [T-011: Shallow clone with spread](#t011) |
|  | [T-012: Deep clone with `structuredClone`](#t012) |
|  | [T-013: Merge configs with spread](#t013) |
|  | [T-014: `Object.assign` vs spread](#t014) |
|  | [T-015: `Object.keys`, `values`, `entries`](#t015) |
|  | [T-016: `Object.fromEntries`](#t016) |
|  | [T-017: Loop with `Object.entries` and `for...of`](#t017) |
|  | [T-018: freeze vs seal vs preventExtensions](#t018) |
|  | [T-019: Read-only property with `defineProperty`](#t019) |
|  | [T-020: Optional chaining and nullish coalescing](#t020) |

### 2. Product dataset (T-021 – T-040)

| # | Question |
| --- | --- |
| <span id="i2"></span> | [T-021: Filter products in "Stationery" category](#t021) |
|  | [T-022: Format as `"Mug (Kitchen)"`](#t022) |
|  | [T-023: Find highest-priced product](#t023) |
|  | [T-024: Any product out of stock?](#t024) |
|  | [T-025: Function `filterByMinPrice`](#t025) |
|  | [T-026: Extract product names only](#t026) |
|  | [T-027: Total value of in-stock products](#t027) |
|  | [T-028: Any product priced below 5?](#t028) |
|  | [T-029: Find product with price exactly 8.5](#t029) |
|  | [T-030: Group products by `categoryId`](#t030) |
|  | [T-031: Normalize products by `id`](#t031) |
|  | [T-032: Lookup product name and category by id](#t032) |
|  | [T-033: Increase all prices by 10% immutably](#t033) |
|  | [T-034: Count products per category name](#t034) |
|  | [T-035: Log name and category with `for...of`](#t035) |
|  | [T-036: Implement `pick`](#t036) |
|  | [T-037: Implement `omit`](#t037) |
|  | [T-038: Deep merge `defaults` and `overrides`](#t038) |
|  | [T-039: Implement `shallowEqual`](#t039) |
|  | [T-040: Convert `categories` object to `Map`](#t040) |

### 3. Map, Set & advanced (T-041 – T-048)

| # | Question |
| --- | --- |
| <span id="i3"></span> | [T-041: Create and iterate a `Map`](#t041) |
|  | [T-042: Object to `Map` via `Object.entries`](#t042) |
|  | [T-043: `Map` back to plain object](#t043) |
|  | [T-044: Deduplicate tags with `Set`](#t044) |
|  | [T-045: Count word occurrences](#t045) |
|  | [T-046: `Object.create` with inherited `greet`](#t046) |
|  | [T-047: When to use `Map` instead of object](#t047) |
|  | [T-048: Safe JSON parse with fallback](#t048) |

---



<a id="p1"></a>

## 1. Fundamentals (T-001 – T-020)

<a id="t001"></a>

### T-001: Create a user object using an object literal

**Answer:**

> Use curly braces with key-value pairs. Keys are strings (or symbols); values can be any type.

```javascript
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin',
};
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t002"></a>

### T-002: Create an object using `new Object()`

**Answer:**

> Instantiate an empty object, then assign properties. Literals are preferred in production code.

```javascript
const user = new Object();
user.id = 1;
user.name = 'Alice';
user.email = 'alice@example.com';
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t003"></a>

### T-003: Access property with dot and bracket notation

**Answer:**

> Dot notation for known keys; bracket notation when the key is stored in a variable or contains special characters.

```javascript
const user = { name: 'Alice', role: 'admin' };

user.name;       // 'Alice'
user['role'];    // 'admin'

const key = 'name';
user[key];       // 'Alice'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t004"></a>

### T-004: Add and update properties

**Answer:**

> Assign to a new key to add; assign to an existing key to update. Objects are mutable by default.

```javascript
const product = { id: 1, name: 'Mug' };

product.price = 12.99;      // add
product.name = 'Ceramic Mug'; // update
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t005"></a>

### T-005: Delete a property with `delete`

**Answer:**

> `delete` removes an own property. Returns `true` if successful.

```javascript
const user = { id: 1, name: 'Alice', temp: true };
delete user.temp;
console.log(user); // { id: 1, name: 'Alice' }
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t006"></a>

### T-006: Check property with `in` vs `Object.hasOwn`

**Answer:**

> `in` checks the whole prototype chain. `Object.hasOwn` checks **own** properties only.

```javascript
const user = { name: 'Alice' };

'name' in user;              // true
'toString' in user;          // true — inherited!
Object.hasOwn(user, 'name'); // true
Object.hasOwn(user, 'toString'); // false
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t007"></a>

### T-007: Destructure `name` and `email`

**Answer:**

> Pull specific properties into variables in one line.

```javascript
const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
const { name, email } = user;
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t008"></a>

### T-008: Destructure with rename and default

**Answer:**

> Rename with `key: newName`. Default applies when the property is `undefined` or missing.

```javascript
const user = { name: 'Alice' };
const { name: userName, role = 'viewer' } = user;
// userName = 'Alice', role = 'viewer'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t009"></a>

### T-009: Rest destructuring to omit `password`

**Answer:**

> Rest collects remaining properties — classic omit pattern for API responses.

```javascript
const user = { id: 1, name: 'Alice', password: 'secret', role: 'admin' };
const { password, ...safeUser } = user;
// safeUser = { id: 1, name: 'Alice', role: 'admin' }
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t010"></a>

### T-010: Nested destructuring

**Answer:**

> Match the nested shape in the destructuring pattern.

```javascript
const data = {
  user: { address: { city: 'NYC', zip: '10001' } },
};

const { user: { address: { city } } } = data;
console.log(city); // 'NYC'
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t011"></a>

### T-011: Shallow clone with spread

**Answer:**

> Spread copies top-level keys into a new object. Nested objects are still shared.

```javascript
const original = { a: 1, nested: { b: 2 } };
const clone = { ...original };

clone.a = 99;
original.a; // 1 — top-level independent
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t012"></a>

### T-012: Deep clone with `structuredClone`

**Answer:**

> `structuredClone` recursively copies nested objects and arrays.

```javascript
const original = { a: 1, nested: { b: 2 } };
const deep = structuredClone(original);

deep.nested.b = 99;
original.nested.b; // 2 — unchanged
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t013"></a>

### T-013: Merge configs with spread

**Answer:**

> Later spread sources overwrite earlier keys for the same property name.

```javascript
const defaults = { theme: 'light', pageSize: 10 };
const overrides = { pageSize: 25, lang: 'en' };

const config = { ...defaults, ...overrides };
// { theme: 'light', pageSize: 25, lang: 'en' }
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t014"></a>

### T-014: `Object.assign` vs spread

**Answer:**

> Both shallow-merge. `Object.assign` **mutates** the first argument and returns it. Spread creates a new object.

```javascript
const defaults = { a: 1, b: 2 };
const extra = { b: 3, c: 4 };

const target = {};
Object.assign(target, defaults, extra); // mutates target

const merged = { ...defaults, ...extra }; // new object
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t015"></a>

### T-015: `Object.keys`, `values`, `entries`

**Answer:**

> Three static methods to list own enumerable string-keyed properties in different forms.

```javascript
const scores = { alice: 90, bob: 75 };

Object.keys(scores);    // ['alice', 'bob']
Object.values(scores);  // [90, 75]
Object.entries(scores); // [['alice', 90], ['bob', 75]]
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t016"></a>

### T-016: `Object.fromEntries`

**Answer:**

> Inverse of `entries` — builds an object from `[key, value]` pairs.

```javascript
const pairs = [['x', 1], ['y', 2], ['z', 3]];
const obj = Object.fromEntries(pairs);
// { x: 1, y: 2, z: 3 }
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t017"></a>

### T-017: Loop with `Object.entries` and `for...of`

**Answer:**

> Preferred over `for...in` — no inherited keys, destructuring-friendly.

```javascript
const user = { name: 'Alice', role: 'admin' };

for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t018"></a>

### T-018: freeze vs seal vs preventExtensions

**Answer:**

> **preventExtensions** — no new keys. **seal** — no add/delete, can change values. **freeze** — no add/delete/change (shallow).

```javascript
const obj = { a: 1 };

Object.preventExtensions(obj); // can't add keys
Object.seal(obj);                // can't add/delete
Object.freeze(obj);              // can't add/delete/change values
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t019"></a>

### T-019: Read-only property with `defineProperty`

**Answer:**

> Set `writable: false` to prevent value changes.

```javascript
const user = {};
Object.defineProperty(user, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false,
});
```


<p><a href="#i1">Back to index</a></p>

---
<a id="t020"></a>

### T-020: Optional chaining and nullish coalescing

**Answer:**

> `?.` short-circuits on null/undefined. `??` defaults only for null/undefined, not 0 or ''.

```javascript
const user = { profile: { name: 'Alice' } };

user.profile?.name;              // 'Alice'
user.address?.city;              // undefined
user.address?.city ?? 'Remote';    // 'Remote'
```


<p><a href="#i1">Back to index</a></p>

---

<a id="p2"></a>

## 2. Product dataset (T-021 – T-040)

Shared setup:

```javascript
const products = [
  { id: 'p1', name: 'Mug', categoryId: 'c1', price: 12.99, inStock: true },
  { id: 'p2', name: 'Book', categoryId: 'c2', price: 24.5, inStock: true },
  { id: 'p3', name: 'Pen', categoryId: 'c1', price: 2.99, inStock: false },
  { id: 'p4', name: 'Lamp', categoryId: 'c3', price: 45.0, inStock: true },
  { id: 'p5', name: 'Notebook', categoryId: 'c2', price: 8.5, inStock: true },
  { id: 'p6', name: 'Desk', categoryId: 'c3', price: 199.99, inStock: false },
];

const categories = { c1: 'Kitchen', c2: 'Stationery', c3: 'Furniture' };

const getCategoryName = (id) => categories[id] ?? 'Unknown';
const getCategoryIdByName = (name) =>
  Object.entries(categories).find(([, n]) => n === name)?.[0];
```

<a id="t021"></a>

### T-021: Filter products in "Stationery" category

**Answer:**

> Resolve category id from name, then filter products.

```javascript
const stationeryId = getCategoryIdByName('Stationery'); // 'c2'

const stationeryProducts = products.filter(
  (p) => p.categoryId === stationeryId
);
// Book, Notebook
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t022"></a>

### T-022: Format as `"Mug (Kitchen)"`

**Answer:**

> Map each product to a label string using category lookup.

```javascript
const labeled = products.map(
  (p) => `${p.name} (${getCategoryName(p.categoryId)})`
);
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t023"></a>

### T-023: Find highest-priced product

**Answer:**

> Reduce to track max, or sort a copy and take first (reduce is O(n)).

```javascript
const highest = products.reduce((max, p) =>
  p.price > max.price ? p : max
);
// Desk — 199.99
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t024"></a>

### T-024: Any product out of stock?

**Answer:**

> `some` returns true if at least one matches.

```javascript
const hasOutOfStock = products.some((p) => !p.inStock);
// true
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t025"></a>

### T-025: Function `filterByMinPrice`

**Answer:**

> Reusable filter with a price threshold parameter.

```javascript
function filterByMinPrice(list, minPrice) {
  return list.filter((p) => p.price > minPrice);
}

filterByMinPrice(products, 20);
// Book, Lamp, Desk
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t026"></a>

### T-026: Extract product names only

**Answer:**

> `map` to pluck the `name` field.

```javascript
const names = products.map((p) => p.name);
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t027"></a>

### T-027: Total value of in-stock products

**Answer:**

> Filter in-stock, then reduce prices.

```javascript
const totalInStock = products
  .filter((p) => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
// 91.99
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t028"></a>

### T-028: Any product priced below 5?

**Answer:**

> `some` with price comparison.

```javascript
const hasCheap = products.some((p) => p.price < 5);
// true — Pen (2.99)
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t029"></a>

### T-029: Find product with price exactly 8.5

**Answer:**

> `find` returns first match or undefined.

```javascript
const notebook = products.find((p) => p.price === 8.5);
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t030"></a>

### T-030: Group products by `categoryId`

**Answer:**

> `Object.groupBy` (ES2024) groups array items by key function.

```javascript
const byCategory = Object.groupBy(products, (p) => p.categoryId);
// { c1: [Mug, Pen], c2: [Book, Notebook], c3: [Lamp, Desk] }
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t031"></a>

### T-031: Normalize products by `id`

**Answer:**

> Convert array to object keyed by id for O(1) lookup — common Redux pattern.

```javascript
const productsById = Object.fromEntries(
  products.map((p) => [p.id, p])
);

productsById['p4'].name; // 'Lamp'
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t032"></a>

### T-032: Lookup product name and category by id

**Answer:**

> Combine normalized lookup with categories map.

```javascript
function getProductDetails(id) {
  const product = productsById[id];
  if (!product) return null;
  return {
    name: product.name,
    category: getCategoryName(product.categoryId),
  };
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t033"></a>

### T-033: Increase all prices by 10% immutably

**Answer:**

> `map` returns new objects — source array unchanged.

```javascript
const withMarkup = products.map((p) => ({
  ...p,
  price: +(p.price * 1.1).toFixed(2),
}));
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t034"></a>

### T-034: Count products per category name

**Answer:**

> Reduce into an accumulator object, incrementing counts.

```javascript
const countByCategory = products.reduce((acc, p) => {
  const name = getCategoryName(p.categoryId);
  acc[name] = (acc[name] ?? 0) + 1;
  return acc;
}, {});
// { Kitchen: 2, Stationery: 2, Furniture: 2 }
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t035"></a>

### T-035: Log name and category with `for...of`

**Answer:**

> Build a lookup map first, then iterate entries.

```javascript
const labelMap = Object.fromEntries(
  products.map((p) => [p.id, { name: p.name, category: getCategoryName(p.categoryId) }])
);

for (const [id, info] of Object.entries(labelMap)) {
  console.log(id, info.name, info.category);
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t036"></a>

### T-036: Implement `pick`

**Answer:**

> Select only specified keys into a new object.

```javascript
function pick(obj, keys) {
  return Object.fromEntries(
    keys.filter((k) => k in obj).map((k) => [k, obj[k]])
  );
}

products.map((p) => pick(p, ['id', 'name', 'price']));
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t037"></a>

### T-037: Implement `omit`

**Answer:**

> Exclude specified keys from a new object.

```javascript
function omit(obj, keys) {
  const exclude = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !exclude.has(k))
  );
}

products.map((p) => omit(p, ['inStock']));
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t038"></a>

### T-038: Deep merge `defaults` and `overrides`

**Answer:**

> Recursively merge nested objects; override leaf values from `overrides`.

```javascript
function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value && typeof value === 'object' && !Array.isArray(value) &&
      target[key] && typeof target[key] === 'object'
    ) {
      out[key] = deepMerge(target[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

const defaults = { theme: 'light', settings: { fontSize: 14, bold: false } };
const overrides = { settings: { fontSize: 16 } };

deepMerge(defaults, overrides);
// { theme: 'light', settings: { fontSize: 16, bold: false } }
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t039"></a>

### T-039: Implement `shallowEqual`

**Answer:**

> Compare key count and each value with `Object.is`.

```javascript
function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => Object.is(a[key], b[key]));
}
```


<p><a href="#i2">Back to index</a></p>

---
<a id="t040"></a>

### T-040: Convert `categories` object to `Map`

**Answer:**

> `Object.entries` + `Map` constructor.

```javascript
const categoryMap = new Map(Object.entries(categories));
categoryMap.get('c2'); // 'Stationery'
```


<p><a href="#i2">Back to index</a></p>

---

<a id="p3"></a>

## 3. Map, Set & advanced (T-041 – T-048)

<a id="t041"></a>

### T-041: Create and iterate a `Map`

**Answer:**

> `Map` accepts any key type and preserves insertion order.

```javascript
const map = new Map();
map.set('name', 'Alice');
map.set(42, 'answer');
map.set({ id: 1 }, 'meta');

for (const [key, value] of map) {
  console.log(key, value);
}
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t042"></a>

### T-042: Object to `Map` via `Object.entries`

**Answer:**

> Standard conversion for when you need Map APIs on plain data.

```javascript
const obj = { a: 1, b: 2 };
const map = new Map(Object.entries(obj));
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t043"></a>

### T-043: `Map` back to plain object

**Answer:**

> `Object.fromEntries` accepts iterable of pairs — `map.entries()` works.

```javascript
const map = new Map([['a', 1], ['b', 2]]);
const obj = Object.fromEntries(map);
// { a: 1, b: 2 }
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t044"></a>

### T-044: Deduplicate tags with `Set`

**Answer:**

> `Set` stores unique values; spread back to array.

```javascript
const tags = ['js', 'web', 'js', 'api', 'web'];
const unique = [...new Set(tags)];
// ['js', 'web', 'api']
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t045"></a>

### T-045: Count word occurrences

**Answer:**

> Use object (or Map) as frequency map.

```javascript
const sentence = 'the cat and the dog';
const counts = {};

for (const word of sentence.split(' ')) {
  counts[word] = (counts[word] ?? 0) + 1;
}
// { the: 2, cat: 1, and: 1, dog: 1 }
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t046"></a>

### T-046: `Object.create` with inherited `greet`

**Answer:**

> Set prototype to an object with shared methods.

```javascript
const personProto = {
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};

const user = Object.create(personProto);
user.name = 'Alice';
user.greet(); // "Hi, I'm Alice"
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t047"></a>

### T-047: When to use `Map` instead of object

**Answer:**

> Use Map when keys are not strings/symbols, you need frequent add/delete, or you want a clean prototype-free store.

```javascript
// DOM node → metadata (object keys get coerced to strings)
const nodeData = new Map();
const el = document.createElement('div');
nodeData.set(el, { clicks: 0 }); // object as key works
```


<p><a href="#i3">Back to index</a></p>

---
<a id="t048"></a>

### T-048: Safe JSON parse with fallback

**Answer:**

> Wrap `JSON.parse` in try/catch; return fallback on invalid JSON.

```javascript
function safeParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

safeParse('{"a":1}');     // { a: 1 }
safeParse('not json', {}); // {}
```


<p><a href="#i3">Back to index</a></p>

---

## Quick reference — method by task

| Tasks | Primary APIs |
| --- | --- |
| T-001 – T-006 | literals, dot/bracket, `delete`, `in`, `Object.hasOwn` |
| T-007 – T-010 | destructuring, rest, nested destructuring |
| T-011 – T-014 | spread, `structuredClone`, `Object.assign` |
| T-015 – T-020 | `Object.keys/values/entries/fromEntries`, freeze/seal, `defineProperty`, `?.` |
| T-021 – T-040 | `filter`, `map`, `reduce`, `Object.groupBy`, normalize, pick/omit |
| T-041 – T-048 | `Map`, `Set`, `Object.create`, safe JSON parse |

**Interview tip:** Practice explaining T-006 (`in` vs `hasOwn`), T-031 (normalization), and T-047 (Map vs Object) aloud.
