---
title: 'JavaScript Objects — Course Reference & Interview Guide'
description: 'Complete object reference — creation, static methods, destructuring, cloning, Map/Set, descriptors, utility patterns.'
tags: ['javascript', 'objects', 'interview', 'destructuring', 'map', 'set', 'structuredClone']
level: 'Beginner to Senior'
---

# JavaScript Objects — Course Reference

Structured notes for object fundamentals and built-in APIs, formatted for interview preparation. For senior traps and patterns, also see [04-objects-core-functions.md](../vanila-js/04-objects-core-functions.md).

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Creation & literals](#p1) |
| <span id="i2"></span>2 | [Property access & optional chaining](#p2) |
| <span id="i3"></span>3 | [`Object.keys`, `values`, `entries`](#p3) |
| <span id="i4"></span>4 | [Spread & `Object.assign`](#p4) |
| <span id="i5"></span>5 | [Object destructuring](#p5) |
| <span id="i6"></span>6 | [Shallow vs deep copy](#p6) |
| <span id="i7"></span>7 | [`Object.is`, `hasOwn`, `in`](#p7) |
| <span id="i8"></span>8 | [Descriptors, freeze, seal](#p8) |
| <span id="i9"></span>9 | [`Object.create` & prototypes](#p9) |
| <span id="i10"></span>10 | [Map & Set](#p10) |
| <span id="i11"></span>11 | [Utility patterns](#p11) |

---

<a id="p1"></a>

## 1. Creation & literals

### Object literal

```javascript
const user = {
  id: 'u1',
  name: 'Alice',
  role: 'admin',
  'full name': 'Alice Smith', // quoted key when needed
  isActive: true,
};
```

### `new Object()` constructor

```javascript
const user = new Object();
user.id = 'u1';
user.name = 'Alice';

// Prefer literals — shorter and idiomatic
const better = { id: 'u1', name: 'Alice' };
```

### Computed property names

```javascript
const field = 'status';
const record = { [field]: 'active' }; // { status: 'active' }

const key = 'userId';
const dynamic = {
  [key]: 42,
  [`${key}_label`]: 'User ID',
};
```

### Method shorthand

```javascript
const cart = {
  items: {},
  add(id) {
    this.items[id] = (this.items[id] ?? 0) + 1;
  },
  total() {
    return Object.values(this.items).reduce((sum, qty) => sum + qty, 0);
  },
};
```

**Interview answer:**

> Use **object literals** `{}` for plain data records and configuration. Use computed keys `[expression]` when property names are dynamic (API fields, form names).

---

<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Property access & optional chaining

### Dot vs bracket notation

```javascript
const user = { name: 'Alice', role: 'admin' };

user.name;        // 'Alice' — dot for known keys
user['role'];     // 'admin' — bracket for dynamic keys

const key = 'name';
user[key];        // 'Alice'
```

### Add, update, delete

```javascript
const product = { id: 1, name: 'Mug' };

product.price = 12.99;       // add / update
product['inStock'] = true;

delete product.inStock;      // removes own property
```

### Optional chaining (`?.`)

```javascript
const user = { profile: { city: 'NYC' } };

user.profile?.city;           // 'NYC'
user.address?.city;           // undefined — no error
user.address?.city ?? 'Remote'; // 'Remote'
user.getName?.();             // safe method call
```

### Nullish coalescing (`??`)

```javascript
const settings = { theme: null, fontSize: 0 };

settings.theme ?? 'light';    // 'light' — null/undefined only
settings.fontSize ?? 14;      // 0 — 0 is valid, not replaced
```

**Interview trap:**

```javascript
const obj = { a: undefined };
obj.a ?? 'default'; // 'default'
'a' in obj;         // true — key exists even if value is undefined!
```

---

<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. `Object.keys`, `values`, `entries`

```javascript
const scores = { alice: 90, bob: 75, carol: 88 };

Object.keys(scores);    // ['alice', 'bob', 'carol']
Object.values(scores);  // [90, 75, 88]
Object.entries(scores); // [['alice', 90], ['bob', 75], ['carol', 88]]
```

### `Object.fromEntries`

```javascript
const pairs = [
  ['x', 1],
  ['y', 2],
];
Object.fromEntries(pairs); // { x: 1, y: 2 }

// Transform object immutably
const curved = Object.fromEntries(
  Object.entries(scores).map(([name, score]) => [name, score + 5])
);
```

### Iterate objects

```javascript
// Preferred — own enumerable string keys
for (const [name, score] of Object.entries(scores)) {
  console.log(name, score);
}

// for...in — includes inherited enumerable keys (usually avoid)
for (const key in scores) {
  if (Object.hasOwn(scores, key)) {
    console.log(key, scores[key]);
  }
}
```

**Interview answer:**

> `Object.keys/values/entries` only return **own enumerable** properties. Use `Object.entries` + `map`/`filter` + `fromEntries` to transform objects without mutation.

---

<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Spread & `Object.assign`

### Merge objects

```javascript
const defaults = { theme: 'light', pageSize: 10 };
const userPrefs = { pageSize: 25, lang: 'en' };

const merged = { ...defaults, ...userPrefs };
// { theme: 'light', pageSize: 25, lang: 'en' } — later keys win
```

### `Object.assign`

```javascript
const target = {};
Object.assign(target, defaults, userPrefs);
// mutates target, returns target
```

### Immutable single-field update

```javascript
const user = { id: 1, name: 'Alice', role: 'viewer' };

const promoted = { ...user, role: 'admin' };

// Nested update (Redux-style)
const state = { cart: { p1: { qty: 1 } }, user: { name: 'Alice' } };
const next = {
  ...state,
  cart: {
    ...state.cart,
    p1: { ...state.cart.p1, qty: 2 },
  },
};
```

**Interview answer:**

> Spread creates a **shallow** copy. Later spread arguments overwrite earlier keys. `Object.assign` mutates its first argument; spread does not mutate the source.

---

<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Object destructuring

### Basic, rename, default

```javascript
const employee = {
  id: 'e1',
  name: 'Alice',
  department: 'Eng',
  salary: 90000,
};

const { name, department } = employee;
const { name: employeeName } = employee;
const { role = 'viewer' } = employee; // default when missing
```

### Rest — omit pattern

```javascript
const { id, ...rest } = employee;
// rest = { name, department, salary } — id omitted
```

### Nested destructuring

```javascript
const data = { user: { profile: { city: 'NYC', zip: '10001' } } };

const {
  user: {
    profile: { city },
  },
} = data;
```

### Function parameters

```javascript
function renderRow({ name, salary, status = 'active' }) {
  return `${name} (${status}): $${salary}`;
}

renderRow({ name: 'Alice', salary: 90000 });
```

### Swap object properties

```javascript
let a = { x: 1 };
let b = { x: 2 };
[a, b] = [b, a];
```

**Interview answer:**

> Destructuring extracts shape cleanly from API responses, React props, and config. Rest (`...rest`) collects remaining keys — ideal for omitting `password` before sending to client.

---

<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Shallow vs deep copy

```javascript
const original = { a: 1, nested: { b: 2 }, tags: ['js'] };

// Shallow — top-level new reference, nested shared
const shallow = { ...original };
shallow.nested.b = 99;
original.nested.b; // 99 — mutated!

// Deep — modern built-in
const deep = structuredClone(original);
deep.nested.b = 0;
original.nested.b; // 99 — unchanged

// JSON trick — loses Date, Map, undefined, functions, Symbol
const jsonCopy = JSON.parse(JSON.stringify(original));
```

| Method | Depth | Handles Date / Map / functions |
| --- | --- | --- |
| spread / `Object.assign` | Shallow | N/A |
| `structuredClone` | Deep | Yes (most built-in types) |
| `JSON.parse/stringify` | Deep | No |

**Interview answer:**

> In React/Redux, always return **new object references** at the level you change. Shallow spread is enough for flat updates; use `structuredClone` or Immer for deep trees.

---

<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. `Object.is`, `hasOwn`, `in`

### `Object.is` — SameValue equality

```javascript
Object.is(NaN, NaN); // true  (NaN === NaN is false)
Object.is(-0, +0);     // false (=== treats them as equal)
```

### `in` vs `Object.hasOwn`

```javascript
const user = { name: 'Alice' };

'name' in user;              // true
'toString' in user;          // true — inherited from prototype!
Object.hasOwn(user, 'name'); // true — own property only
Object.hasOwn(user, 'toString'); // false
```

### Legacy `hasOwnProperty`

```javascript
user.hasOwnProperty('name'); // true — can be overridden on object
// Prefer Object.hasOwn (ES2022)
```

**Interview answer:**

> Use `Object.hasOwn(obj, key)` to check **own** properties. Use `in` when inherited properties matter. `Object.is` is for edge cases like `NaN` and `-0`.

---

<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Descriptors, freeze, seal

### `Object.defineProperty`

```javascript
const user = {};
Object.defineProperty(user, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false,
});

user.id = 2; // fails silently (strict mode: TypeError)
```

### `freeze`, `seal`, `preventExtensions`

```javascript
const obj = { name: 'Alice', meta: { age: 30 } };

Object.freeze(obj);           // no add / delete / change own props (shallow)
Object.seal(obj);             // can change values, not add/delete keys
Object.preventExtensions(obj); // no new keys, can delete/change existing

obj.meta.age = 31; // still works after freeze — nested not frozen!
```

**Interview answer:**

> `Object.freeze` is **shallow**. Nested objects remain mutable. For immutable app state, use Immer or immutable update patterns — not `freeze` alone in production.

---

<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. `Object.create` & prototypes

### Create with explicit prototype

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

### Clone with property descriptors

```javascript
const src = { get label() { return 'src'; } };
const clone = Object.create(
  Object.getPrototypeOf(src),
  Object.getOwnPropertyDescriptors(src)
);
```

**Interview answer:**

> `Object.create(proto)` sets the prototype chain without a constructor — useful for delegation patterns. For data cloning in apps, prefer spread or `structuredClone`.

---

<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Map & Set

### `Map` — any key type, insertion order

```javascript
const cache = new Map();

cache.set('user:1', { name: 'Alice' });
cache.set(42, 'answer');
cache.set({ id: 1 }, 'metadata');

cache.get('user:1');     // { name: 'Alice' }
cache.has(42);           // true
cache.size;              // 3
cache.delete(42);

for (const [key, value] of cache) {
  console.log(key, value);
}
```

### Object → Map → Object

```javascript
const obj = { a: 1, b: 2 };
const map = new Map(Object.entries(obj));
const back = Object.fromEntries(map);
```

### `Set` — unique values

```javascript
const ids = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(ids)]; // [1, 2, 3]
```

| | `Object` | `Map` | `Set` |
| --- | --- | --- | --- |
| Keys | string / symbol | any | unique values |
| Size | manual count | `.size` | `.size` |
| Default | has prototype | clean | clean |
| JSON | serializable | not directly | not directly |

**Interview answer:**

> Use **Object** for JSON-like records and configs. Use **Map** when keys are not strings or you add/delete frequently. Use **Set** for uniqueness (dedupe ids, tags).

---

<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Utility patterns

### Pick & omit

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

const user = { id: 1, name: 'Alice', password: 'secret' };
pick(user, ['id', 'name']);           // safe public fields
omit(user, ['password']);             // strip sensitive fields
```

### Shallow equal

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

### Normalize array → object by id

```javascript
const products = [
  { id: 'p1', name: 'Mug' },
  { id: 'p2', name: 'Book' },
];

const byId = Object.fromEntries(products.map((p) => [p.id, p]));
// { p1: { id: 'p1', name: 'Mug' }, p2: { ... } }

// Or with reduce
const byId2 = products.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});
```

### `Object.groupBy` (ES2024)

```javascript
const employees = [
  { name: 'A', dept: 'Eng' },
  { name: 'B', dept: 'Sales' },
  { name: 'C', dept: 'Eng' },
];

const byDept = Object.groupBy(employees, (e) => e.dept);
// { Eng: [...], Sales: [...] }
```

### Deep merge (one level vs recursive)

```javascript
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

---

<p><a href="#i11">Back to index</a></p>

## Quick reference

| Task | API |
| --- | --- |
| List keys | `Object.keys` |
| List values | `Object.values` |
| Key-value pairs | `Object.entries` |
| Pairs → object | `Object.fromEntries` |
| Merge | spread, `Object.assign` |
| Clone shallow | `{ ...obj }` |
| Clone deep | `structuredClone` |
| Own property check | `Object.hasOwn` |
| Freeze (shallow) | `Object.freeze` |
| Dynamic key | `{ [key]: value }` |
| Safe nested access | `?.` optional chaining |
| Same-value check | `Object.is` |
| Create with prototype | `Object.create` |
| Unique values | `Set` |
| Any-type keys | `Map` |

See also: [tasks.md](./tasks.md) · [04-objects-core-functions.md](../vanila-js/04-objects-core-functions.md)
