---
title: 'JavaScript Arrays — Course Reference & Interview Guide'
description: 'Complete array reference from tapaScript course — creation, destructuring, methods, HOFs, ES2023 immutability.'
tags:
  [
    'javascript',
    'arrays',
    'interview',
    'map',
    'filter',
    'reduce',
    'destructuring',
  ]
level: 'Beginner to Senior'
---

# JavaScript Arrays — Course Reference

Structured notes from the **tapaScript Array Master Course**, formatted for interview preparation. For interview traps and senior patterns, also see [02-arrays-core-functions.md](../vanila-js/02-arrays-core-functions.md).

> **Attribution:** Course snippets © 2024 [tapaScript](https://github.com/atapas) / [Tapas Adhikary](https://www.linkedin.com/in/tapasadhikary/). Used here for personal study within this repository.

---

<a id="quick-index"></a>

## Quick index

| #                        | Section                                    |
| ------------------------ | ------------------------------------------ |
| <span id="i1"></span>1   | [Creation & access](#p1)                   |
| <span id="i2"></span>2   | [Add, remove, clone](#p2)                  |
| <span id="i3"></span>3   | [Array.isArray](#p3)                       |
| <span id="i4"></span>4   | [Destructuring, rest & spread](#p4)        |
| <span id="i5"></span>5   | [The length property](#p5)                 |
| <span id="i6"></span>6   | [Mutating methods](#p6)                    |
| <span id="i7"></span>7   | [ES2023 immutable methods](#p7)            |
| <span id="i8"></span>8   | [Static methods & array-like objects](#p8) |
| <span id="i9"></span>9   | [Iterator methods (HOFs)](#p9)             |
| <span id="i10"></span>10 | [Method chaining](#p10)                    |

---

<a id="p1"></a>

## 1. Creation & access

### Create an array

```javascript
const salad = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];
const anotherSalad = new Array('🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑');
```

**Interview answer:**

> Prefer **array literals** `[]` over `new Array()` unless you need `Array.of()` or `Array.from()`. `new Array(7)` creates an array with 7 **empty slots** (holes), not seven `undefined` values.

### Get elements by index

```javascript
const salad = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];

salad[0]; // '🍅'
salad[2]; // '🥦'
salad[5]; // '🥕'

// Last element via length
const len = salad.length;
salad[len - 1]; // '🥑'
salad[len - 3]; // '🌽'
```

### Loop with `for`

```javascript
const salad = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];

for (let i = 0; i < salad.length; i++) {
  console.log(`Element at index ${i} is ${salad[i]}`);
}
```

---

<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Add, remove, clone

### Add elements

```javascript
const salad = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];

salad.push('🥜'); // add at end — mutates
salad.unshift('🥜'); // add at front — mutates
```

### Remove elements

```javascript
const salad = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];
salad.pop(); // removes last — returns '🥑'
console.log(salad); // ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕']
```

### Shallow clone with `slice()`

```javascript
const salad = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];
const saladCopy = salad.slice();

console.log(saladCopy); // same values
salad === saladCopy; // false — different reference
```

**Interview answer:**

> `slice()` with no args, spread `[...arr]`, or `Array.from(arr)` all create a **shallow** copy. Nested objects are still shared.

---

<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Array.isArray

```javascript
Array.isArray(['🍅', '🍄', '🥦']); // true
Array.isArray('🍅'); // false
Array.isArray({ tomato: '🍅' }); // false
Array.isArray([]); // true
```

**Interview answer:**

> Always use `Array.isArray()` — not `typeof` (returns `'object'`) and not `instanceof Array` (breaks across iframes).

---

<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Destructuring, rest & spread

### Basic destructuring

```javascript
let [tomato, mushroom, carrot] = ['🍅', '🍄', '🥕'];
console.log(tomato, mushroom, carrot); // 🍅 🍄 🥕

// Equivalent without destructuring
let vegetables = ['🍅', '🍄', '🥕'];
let tomato2 = vegetables[0];
let mushroom2 = vegetables[1];
let carrot2 = vegetables[2];
```

### Default values

```javascript
let [tomato, mushroom = '🍄'] = ['🍅'];
console.log(tomato); // '🍅'
console.log(mushroom); // '🍄' — default applied
```

### Skip a value

```javascript
let [tomato, , carrot] = ['🍅', '🍄', '🥕'];
console.log(tomato); // '🍅'
console.log(carrot); // '🥕'
```

### Nested destructuring

```javascript
let fruits = ['🍈', '🍍', '🍌', '🍉', ['🍅', '🍄', '🥕']];

const veg = fruits[4]; // ['🍅', '🍄', '🥕']
const carrot = veg[2]; // '🥕'
fruits[4][2]; // '🥕'

let [, , , , [, , carrot2]] = ['🍈', '🍍', '🍌', '🍉', ['🍅', '🍄', '🥕']];
```

### Rest parameter

```javascript
const [tomato, mushroom, ...rest] = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];

console.log(tomato); // '🍅'
console.log(mushroom); // '🍄'
console.log(rest); // ['🥦', '🥒', '🌽', '🥕', '🥑']
```

### Spread operator — clone & merge

```javascript
const salad = ['🍅', '🍄', '🥦', '🥒', '🌽', '🥕', '🥑'];
const saladCloned = [...salad];
salad === saladCloned; // false

// Merge arrays
const emotion = ['🙂', '😔'];
const veggies = ['🥦', '🥒', '🌽', '🥕'];
const emotionalVeggies = [...emotion, ...veggies];
// ['🙂', '😔', '🥦', '🥒', '🌽', '🥕']
```

### Swap values

```javascript
let first = '😔';
let second = '🙂';
[first, second] = [second, first];

console.log(first); // '🙂'
console.log(second); // '😔'
```

**Interview answer:**

> Rest collects **remaining** elements into an array; spread **expands** an iterable into elements. Both use `...` syntax but opposite directions.

---

<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. The length property

```javascript
const arr1 = [11, 21, 73];
const arr2 = new Array(7); // 7 empty slots

console.log(arr1.length); // 3
console.log(arr2.length); // 7

// Resize — adds empty slots or truncates
const arr = [11, 32];
arr.length = 5; // [11, 32, empty × 3]
arr.length = 0; // fastest way to empty (when writable)
```

**Edge cases:**

```javascript
arr2.length = 2 ** 32; // RangeError — max length 2³² − 1
new Array(-10); // RangeError — invalid length

// Non-writable length
const ages = [21, 12, 73, 41, 67];
Object.defineProperty(ages, 'length', { writable: false });
ages[5] = 6; // silently fails (strict: throws in some contexts)
ages.push(5); // TypeError — cannot change length
```

**Interview answer:**

> Setting `length = 0` is the most efficient way to empty an array when length is writable. `splice(0)` also works but is slower for large arrays.

---

<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Mutating methods

### `concat()` — merge without mutating originals

```javascript
const first = [1, 2, 3];
const second = [4, 5, 6];
const merged = first.concat(second);

console.log(merged); // [1, 2, 3, 4, 5, 6]
console.log(first); // [1, 2, 3] — unchanged
```

### `join()` — array to string

```javascript
const emotions = ['🙂', '😍', '🙄', '😟'];

emotions.join(); // "🙂,😍,🙄,😟" — default comma
emotions.join('<=>'); // "🙂<=>😍<=>🙄<=>😟"
[].join(); // ""
```

### `fill()` — mutates all or a range

```javascript
const colors = ['red', 'blue', 'green'];
colors.fill('pink'); // ['pink', 'pink', 'pink']

const colors2 = ['red', 'blue', 'green'];
colors2.fill('pink', 1, 3); // ['red', 'pink', 'pink']
```

### `includes()` & `indexOf()`

```javascript
const names = ['tom', 'alex', 'bob', 'john'];

names.includes('tom'); // true
names.includes('july'); // false

names.indexOf('alex'); // 1
names.indexOf('rob'); // -1

const dupes = ['tom', 'alex', 'bob', 'tom'];
dupes.indexOf('tom'); // 0 — first match
dupes.lastIndexOf('tom'); // 3 — last match
```

### `reverse()` & `sort()` — mutate in place

```javascript
const names = ['tom', 'alex', 'bob'];
names.reverse(); // ['bob', 'alex', 'tom']

let artists = [
  'John White Abbott',
  'Leonardo da Vinci',
  'Charles Aubry',
  'Anna Atkins',
  'Barent Avercamp',
];

let sorted = artists.sort(); // mutates AND returns same reference
console.log(artists === sorted); // true

// Descending compare function
artists.sort((a, b) => (a === b ? 0 : a > b ? -1 : 1));

// Numbers — default sort is lexicographic!
let ages = [2, 1000, 10, 3, 23, 12, 30, 21];
ages.sort(); // [10, 1000, 12, 2, 21, 23, 3, 30] — wrong!
ages.sort((a, b) => a - b); // [2, 3, 10, 12, 21, 23, 30, 1000]
```

### `splice()` — insert, delete, or replace

```javascript
const names = ['tom', 'alex', 'bob'];

names.splice(1, 0, 'zack'); // insert at index 1
// ['tom', 'zack', 'alex', 'bob']

const names2 = ['tom', 'alex', 'bob'];
const deleted = names2.splice(2, 1, 'zack'); // replace index 2
console.log(deleted); // ['bob']
console.log(names2); // ['tom', 'alex', 'zack']
```

### `at()` — negative index access

```javascript
const junkFoodILove = ['🥖', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🍿'];

junkFoodILove.at(0); // 🥖
junkFoodILove.at(3); // 🍕
junkFoodILove.at(-1); // 🍿
junkFoodILove.at(-5); // 🍕
junkFoodILove.at(10); // undefined
```

### `flat()` — flatten nested arrays

```javascript
const arr1 = [0, 1, 2, [3, 4]];
arr1.flat(); // [0, 1, 2, 3, 4]

const arr2 = [0, 1, [2, [3, [4, 5]]]];
arr2.flat(); // [0, 1, 2, [3, [4, 5]]]
arr2.flat(2); // deeper flatten
arr2.flat(Infinity); // fully flat
```

### `copyWithin()` — copy segment in place

```javascript
const array = [1, 2, 3, 4, 5, 6, 7];
array.copyWithin(0, 3, 6); // copy indices 3–5 to start
// [4, 5, 6, 4, 5, 6, 7]

const array2 = [1, 2, 3, 4, 5, 6, 7];
array2.copyWithin(0, 4);
```

---

<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. ES2023 immutable methods

```javascript
// toSorted — non-mutating sort
const months = ['Mar', 'Jan', 'Feb', 'Dec'];
const sortedMonths = months.toSorted();
console.log(sortedMonths); // ['Dec', 'Feb', 'Jan', 'Mar']
console.log(months); // unchanged

// toReversed
const items = [1, 2, 3];
const reversedItems = items.toReversed(); // [3, 2, 1]
console.log(items); // [1, 2, 3] — unchanged

// toSpliced
const months2 = ['Jan', 'Mar', 'Apr', 'May'];
const withFeb = months2.toSpliced(1, 0, 'Feb');

// with — replace at index (supports negative index)
const numbers = [1, 2, 3, 4, 5];
const newArray = numbers.with(2, 6);
console.log(numbers); // [1, 2, 3, 4, 5] — unchanged
console.log(newArray); // [1, 2, 6, 4, 5]

const anotherArray = numbers.with(-2, 8);
anotherArray.at(-2); // 8
```

**Interview answer:**

> In React/Redux state, prefer `toSorted()`, `toReversed()`, `toSpliced()`, and `with()` over mutating `sort`/`reverse`/`splice`. Only the copy changes.

---

<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Static methods & array-like objects

### `Array.of()` vs `new Array()`

```javascript
const a = new Array(2, 3, 4); // [2, 3, 4]
const b = [4, 5, 6];
const c = Array.of(2, false, 'test', { name: 'Alex' });
// Array.of(7) → [7]  vs  new Array(7) → 7 empty slots
```

### Array-like objects

```javascript
const arrayLike = {
  0: 'A',
  1: 'B',
  2: 'C',
  length: 3,
};

arrayLike[1]; // 'B'

Array.from(arrayLike); // ['A', 'B', 'C']

// Other array-likes: NodeList, arguments
document.getElementsByTagName('li');

function checkArgs() {
  console.log(arguments.length);
}
```

### `Array.from()`

```javascript
const collection = Array.from(document.getElementsByTagName('li'));

// With map function
Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
Array.from('Hello'); // ['H', 'e', 'l', 'l', 'o']
```

### `Array.fromAsync()`

```javascript
Array.fromAsync({
  length: 3,
  0: Promise.resolve('tapaScript'),
  1: Promise.resolve('Google'),
  2: Promise.resolve('Apple'),
}).then((array) => console.log(array));
// ['tapaScript', 'Google', 'Apple']
```

**Interview answer:**

> `Array.from` converts any **array-like** or **iterable** to a real array. Only this method (or spread on iterables) — needed for `NodeList` and `arguments`.

---

<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Iterator methods (HOFs)

Sample dataset used throughout:

```javascript
const customers = [
  {
    id: 1,
    f_name: 'Abby',
    l_name: 'Thomas',
    gender: 'M',
    married: true,
    age: 32,
    expense: 500,
    purchased: ['Shampoo', 'Toys', 'Book'],
  },
  {
    id: 2,
    f_name: 'Jerry',
    l_name: 'Tom',
    gender: 'M',
    married: true,
    age: 64,
    expense: 100,
    purchased: ['Stick', 'Blade'],
  },
  {
    id: 3,
    f_name: 'Dianna',
    l_name: 'Cherry',
    gender: 'F',
    married: true,
    age: 22,
    expense: 1500,
    purchased: ['Lipstik', 'Nail Polish', 'Bag', 'Book'],
  },
  {
    id: 4,
    f_name: 'Dev',
    l_name: 'Currian',
    gender: 'M',
    married: true,
    age: 82,
    expense: 90,
    purchased: ['Book'],
  },
  {
    id: 5,
    f_name: 'Maria',
    l_name: 'Gomes',
    gender: 'F',
    married: false,
    age: 7,
    expense: 300,
    purchased: ['Toys'],
  },
];
```

### `filter()` — subset by condition

```javascript
const seniorCustomers = customers.filter((customer) => customer.age >= 60);
console.log('[filter] Senior Customers =', seniorCustomers);
```

### `map()` — transform each element

```javascript
const customersWithFullName = customers.map((customer) => {
  let title = '';
  if (customer.gender === 'M') title = 'Mr.';
  else if (customer.gender === 'F' && customer.married) title = 'Mrs.';
  else title = 'Miss';

  return {
    ...customer,
    full_name: `${title} ${customer.f_name} ${customer.l_name}`,
  };
});
console.log('[map] Customers With Full Name =', customersWithFullName);
```

### `reduce()` — fold to one value

```javascript
// Average age of customers who purchased 'Book'
let count = 0;
const total = customers.reduce((accumulator, customer) => {
  if (customer.purchased.includes('Book')) {
    accumulator += customer.age;
    count += 1;
  }
  return accumulator;
}, 0);

console.log(
  '[reduce] Customer Avg age Purchased Book:',
  Math.floor(total / count)
);
```

### `some()` / `every()` — boolean tests

```javascript
const hasYoungCustomer = customers.some((customer) => customer.age < 10);
console.log('[some] Has Young Customer (Age < 10):', hasYoungCustomer);

const isThereWindowShopper = customers.every(
  (customer) => customer.purchased.length === 0
);
console.log('[every] Everyone a window shopper?', isThereWindowShopper);
```

### `find()` / `findIndex()` / `findLast()` / `findLastIndex()`

```javascript
const foundYoungCustomer = customers.find((customer) => customer.age < 10);
console.log('[find] Found Young Customer:', foundYoungCustomer);

const index = customers.findIndex((customer) => customer.age < 10);

const lastFoundYoungCustomer = customers.findLast(
  (customer) => customer.age < 10
);
console.log('[findLast] Last Found Young Customer:', lastFoundYoungCustomer);

const lastIndex = customers.findLastIndex((customer) => customer.age < 10);
```

### `entries()` / `values()` — iterators

```javascript
const numbers = [10, 20, 30];

for (const [index, value] of numbers.entries()) {
  console.log(index, value);
}

for (const value of numbers.values()) {
  console.log(value);
}
```

### `flatMap()` — map then flatten one level

```javascript
const arr1 = [1, 2, 3, 4];

arr1.map((item) => item * 2); // [2, 4, 6, 8]
arr1.flatMap((item) => item * 2); // same for flat scalars

arr1.map((item) => [item * 2]); // [[2], [4], [6], [8]]
arr1.flatMap((item) => [item * 2]); // [2, 4, 6, 8] — flattened

arr1.map((item) => [[item * 2]]); // nested
arr1.flatMap((item) => [[item * 2]]); // [[2], [4], [6], [8]] — one level flat
```

### `reduceRight()` — fold right to left

```javascript
const number = [100, 40, 15];

number.reduceRight((accumulator, current) => accumulator - current);
// 15 - 40 - 100 = -125
```

**Interview answer:**

> `filter` → subset, `map` → transform, `reduce` → single value. `some`/`every` short-circuit; `find` returns first match or `undefined`. Prefer `flatMap` over `map().flat()` when each callback returns an array.

---

<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Method chaining

Build a pipeline instead of intermediate variables:

```javascript
// Step-by-step
const marriedCustomers = customers.filter((customer) => customer.married);
const expenseMapped = marriedCustomers.map((c) => c.expense);
const totalExpenseMarriedCustomer = expenseMapped.reduce(
  (accum, expense) => accum + expense,
  0
);
console.log(
  'Total Expense of Married Customers in INR:',
  totalExpenseMarriedCustomer
);

// Chained — same result, cleaner
const total = customers
  .filter((customer) => customer.married)
  .map((married) => married.expense)
  .reduce((accum, expense) => accum + expense, 0);

console.log('Orchestrated total expense in INR:', total);
```

**Interview answer:**

> Method chaining works because each HOF returns an array (except `reduce` which terminates the chain). Keep pipelines readable — if a chain exceeds 3–4 steps, extract named steps or helper functions.

---

<p><a href="#i10">Back to index</a></p>

## Mutating vs non-mutating — quick reference

| Mutates original                    | Returns new array                             |
| ----------------------------------- | --------------------------------------------- |
| `push`, `pop`, `shift`, `unshift`   | `map`, `filter`, `slice`, `concat`            |
| `splice`, `sort`, `reverse`, `fill` | `toSorted`, `toReversed`, `toSpliced`, `with` |
| `copyWithin`                        | `flat`, `flatMap`, spread `[...arr]`          |

See also: [02-array-practice-tasks.md](./02-array-practice-tasks.md) · [02-arrays-core-functions.md](../vanila-js/02-arrays-core-functions.md)
