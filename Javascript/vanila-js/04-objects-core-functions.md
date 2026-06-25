---
title: 'JavaScript Objects — Core Functions Interview Guide'
description: 'Keys, values, entries, spread, destructuring, cloning, Map vs Object — intermediate to senior.'
tags: ['javascript', 'objects', 'interview']
level: 'Intermediate to Senior'
---

# Objects — Core Functions Interview Guide

---

## Table of Contents

1. [Object basics & literals](#1-object-basics--literals)
2. [Property access & optional chaining](#2-property-access--optional-chaining)
3. [Static methods: keys, values, entries](#3-static-methods-keys-values-entries)
4. [Spread & assign](#4-spread--assign)
5. [Destructuring](#5-destructuring)
6. [Shallow vs deep copy](#6-shallow-vs-deep-copy)
7. [Object vs Map vs Set](#7-object-vs-map-vs-set)
8. [Descriptors & sealing](#8-descriptors--sealing)
9. [Normalization pattern (Redux-style)](#9-normalization-pattern-redux-style)
10. [Senior scenarios](#10-senior-scenarios)

---

## 1. Object basics & literals

```javascript
const user = {
  id: 'u1',
  name: 'Alice',
  role: 'admin',
  'full name': 'Alice Smith', // quoted key
};

// Computed property
const field = 'status';
const record = { [field]: 'active' }; // { status: 'active' }

// Method shorthand
const cart = {
  items: {},
  add(id) {
    this.items[id] = (this.items[id] ?? 0) + 1;
  },
};
```

---

## 2. Property access & optional chaining

```javascript
const user = { profile: { city: 'NYC' } };

user.profile.city; // 'NYC'
user.address?.city; // undefined — no throw
user.address?.city ?? 'Remote'; // 'Remote'

// Bracket access — dynamic keys
const key = 'name';
user[key];

// 'in' vs hasOwnProperty
'name' in user; // true (own + prototype)
user.hasOwnProperty('name'); // true (own only)
Object.hasOwn(user, 'name'); // ES2022 — preferred
```

**Interview trap:**

```javascript
const obj = { a: undefined };
obj.a ?? 'default'; // 'default'
'a' in obj; // true — key exists!
```

---

## 3. Static methods: keys, values, entries

```javascript
const scores = { alice: 90, bob: 75, carol: 88 };

Object.keys(scores); // ['alice', 'bob', 'carol']
Object.values(scores); // [90, 75, 88]
Object.entries(scores); // [['alice',90], ['bob',75], ['carol',88]]

// entries → object
Object.fromEntries([
  ['x', 1],
  ['y', 2],
]); // { x: 1, y: 2 }

// Transform with HOFs
const curved = Object.fromEntries(
  Object.entries(scores).map(([name, score]) => [name, score + 5])
);
```

**Iterate safely:**

```javascript
for (const [name, score] of Object.entries(scores)) {
  console.log(name, score);
}
```

---

## 4. Spread & assign

```javascript
const defaults = { theme: 'light', pageSize: 10 };
const userPrefs = { pageSize: 25, lang: 'en' };

// Later keys win
const merged = { ...defaults, ...userPrefs };
// { theme: 'light', pageSize: 25, lang: 'en' }

// Object.assign — same idea, mutates target
const target = {};
Object.assign(target, defaults, userPrefs);
```

**Immutable update (single field):**

```javascript
const updated = { ...user, name: 'Bob' };
const nested = {
  ...state,
  cart: { ...state.cart, [productId]: { qty: 2 } },
};
```

---

## 5. Destructuring

```javascript
const employee = {
  id: 'e1',
  name: 'Alice',
  department: 'Eng',
  salary: 90000,
};

// Basic
const { name, department } = employee;

// Rename
const { name: employeeName } = employee;

// Default
const { role = 'viewer' } = employee;

// Rest
const { id, ...rest } = employee; // rest = { name, department, salary }

// Nested
const data = { user: { profile: { city: 'NYC' } } };
const {
  user: {
    profile: { city },
  },
} = data;

// Function params
function renderRow({ name, salary, status = 'active' }) {
  return `${name} (${status}): $${salary}`;
}
```

**Interview answer:**

> Destructuring extracts shape from objects cleanly — great for function arguments, React props, and API responses. Rest collects remaining keys for omit patterns.

---

## 6. Shallow vs deep copy

```javascript
const original = { a: 1, nested: { b: 2 } };

// Shallow
const shallow = { ...original };
shallow.nested.b = 99;
original.nested.b; // 99 — shared reference!

// Deep (modern)
const deep = structuredClone(original);
deep.nested.b = 0;
original.nested.b; // 99 — unchanged

// JSON trick — loses Date, Map, undefined, functions
const jsonCopy = JSON.parse(JSON.stringify(original));
```

| Method                   | Depth   | Handles Date/Map/Fn |
| ------------------------ | ------- | ------------------- |
| spread / `Object.assign` | Shallow | N/A                 |
| `structuredClone`        | Deep    | Yes (most types)    |
| `JSON.parse/stringify`   | Deep    | No                  |

---

## 7. Object vs Map vs Set

|         | `Object`                | `Map`     | `Set`         |
| ------- | ----------------------- | --------- | ------------- |
| Keys    | string / symbol         | any       | unique values |
| Order   | insertion (string keys) | insertion | insertion     |
| Size    | manual                  | `.size`   | `.size`       |
| Default | prototype chain         | clean     | clean         |

```javascript
// Object — JSON config, records
const config = { apiUrl: '/api', timeout: 5000 };

// Map — frequent add/delete, non-string keys
const cache = new Map();
cache.set({ id: 1 }, 'result');
cache.get({ id: 1 }); // undefined — different object reference!

// Set — uniqueness
const uniqueIds = [...new Set(ids)];
```

**When to use Map in interviews:**  
Cart line cache, memoization, DOM node → metadata — when keys aren't always strings.

---

## 8. Descriptors & sealing

```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false,
});

Object.freeze(obj); // shallow — no add/change/delete
Object.seal(obj); // can change values, not add/delete keys
Object.preventExtensions(obj);
```

**Interview answer:**

> `freeze` is shallow. For immutable Redux state in dev, use Immer or never mutate — don't rely on `freeze` alone in production.

---

## 9. Normalization pattern (Redux-style)

From shopping cart / data table projects:

```javascript
// API returns array
const products = [
  { id: 'p1', name: 'Mug' },
  { id: 'p2', name: 'Book' },
];

// Normalize to map for O(1) lookup
const productsById = products.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});

// Or
const productsById2 = Object.fromEntries(products.map((p) => [p.id, p]));

// Cart lines keyed by productId
const cart = {
  p1: { productId: 'p1', qty: 2 },
  p2: { productId: 'p2', qty: 1 },
};
```

**Interview answer:**

> Normalize relational data by id — arrays for lists, objects for lookups. Selectors join them at read time.

---

## 10. Senior scenarios

### Pick / omit

```javascript
function pick(obj, keys) {
  return Object.fromEntries(
    keys.filter((k) => k in obj).map((k) => [k, obj[k]])
  );
}

function omit(obj, keys) {
  const exclude = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !exclude.has(k))
  );
}

pick(user, ['id', 'name']);
omit(user, ['password', 'token']);
```

### Deep merge (one level vs recursive)

```javascript
function shallowMerge(a, b) {
  return { ...a, ...b };
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object'
    ) {
      out[key] = deepMerge(target[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
```

### Compare objects shallowly

```javascript
function shallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => Object.is(a[key], b[key]));
}
```

### `Object.groupBy` (employees by department)

```javascript
const byDept = Object.groupBy(employees, (e) => e.department);
```

### Safe JSON parse

```javascript
function safeParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
```

---

## 11. Additional object built-ins

### `Object.is` — SameValue equality

```javascript
Object.is(NaN, NaN); // true  (NaN === NaN is false)
Object.is(-0, +0); // false (=== treats them equal)
```

### `Object.create` — prototype without constructor

```javascript
const animal = {
  speak() {
    return `${this.name} speaks`;
  },
};
const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // 'Rex speaks'
```

### `Object.getOwnPropertyDescriptors` — clone with getters

```javascript
const clone = Object.create(
  Object.getPrototypeOf(src),
  Object.getOwnPropertyDescriptors(src)
);
```

### `Object.defineProperty`

```javascript
const user = {};
Object.defineProperty(user, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
});
```

### `in` operator vs `hasOwnProperty`

```javascript
'toString' in {}; // true — inherited
Object.hasOwn({}, 'toString'); // false — own only
```

---

## Quick Reference

| Task                 | API                                           |
| -------------------- | --------------------------------------------- |
| List keys            | `Object.keys`                                 |
| List values          | `Object.values`                               |
| Key-value pairs      | `Object.entries`                              |
| Pairs → object       | `Object.fromEntries`                          |
| Merge                | spread, `Object.assign`                       |
| Clone shallow        | spread                                        |
| Clone deep           | `structuredClone`                             |
| Own property check   | `Object.hasOwn`                               |
| Freeze               | `Object.freeze` (shallow)                     |
| Dynamic key          | `{ [key]: value }`                            |
| Safe nested access   | `?.` optional chaining                        |
| Same-value check     | `Object.is`                                   |
| Create with proto    | `Object.create`                               |
| Property descriptors | `defineProperty`, `getOwnPropertyDescriptors` |
