---
title: 'JavaScript Arrays — Practice Tasks with Answers'
description: '54 array exercises with explanations and solutions — basics through HOFs, Array.from, and employee datasets.'
tags: ['javascript', 'arrays', 'practice', 'solutions', 'interview']
level: 'Beginner to Intermediate'
---

# Array Practice Tasks — Answers

Solutions for every task in [tasks.md](./tasks.md). Try each task yourself first, then compare with these answers.

**Reference:** [01-javascript-arrays-course-reference.md](./01-javascript-arrays-course-reference.md) · [02-arrays-core-functions.md](../vanila-js/02-arrays-core-functions.md)

---

<a id="quick-index"></a>

## Quick index

### 1. Fundamentals (T-001 – T-020)

| #                     | Question                                                                  |
| --------------------- | ------------------------------------------------------------------------- |
| <span id="i1"></span> | [T-001: Create an array of 5 elements using the Array constructor](#t001) |
|                       | [T-002: Create an array of 3 empty slots](#t002)                          |
|                       | [T-003: Access the fourth element using `length`](#t003)                  |
|                       | [T-004: Print elements at odd indices](#t004)                             |
|                       | [T-005: Add one element at the front and the end](#t005)                  |
|                       | [T-006: Remove an element from the front and the end](#t006)              |
|                       | [T-007: Destructure the 6th food element](#t007)                          |
|                       | [T-008: Take out the last 8 items using rest](#t008)                      |
|                       | [T-009: Shallow clone an array](#t009)                                    |
|                       | [T-010: Empty an array using `length`](#t010)                             |
|                       | [T-011: Resize to length 6 when you find 5](#t011)                        |
|                       | [T-012: Empty an array with `splice()`](#t012)                            |
|                       | [T-013: Most efficient way to empty an array?](#t013)                     |
|                       | [T-014: Concatenate two empty arrays](#t014)                              |
|                       | [T-015: Check partial match against any element](#t015)                   |
|                       | [T-016: `slice()` vs `splice()`](#t016)                                   |
|                       | [T-017: Sort immutably (ascending & descending)](#t017)                   |
|                       | [T-018: Sparse vs dense arrays](#t018)                                    |
|                       | [T-019: Practical uses of `.fill()`](#t019)                               |
|                       | [T-020: Convert an array to a string](#t020)                              |

### 2. Employee dataset (T-021 – T-048)

| #                     | Question                                                        |
| --------------------- | --------------------------------------------------------------- |
| <span id="i2"></span> | [T-021: Filter employees in "Engineering"](#t021)               |
|                       | [T-022: Combine name and department — `"Alice (HR)"`](#t022)    |
|                       | [T-023: Highest salary](#t023)                                  |
|                       | [T-024: At least one employee in "Sales"?](#t024)               |
|                       | [T-025: Function to filter by salary threshold](#t025)          |
|                       | [T-026: Array of names only](#t026)                             |
|                       | [T-027: Total salary with `reduce`](#t027)                      |
|                       | [T-028: Any employee earning less than 5000?](#t028)            |
|                       | [T-029: First employee earning exactly 5100](#t029)             |
|                       | [T-030: Last employee in "HR"](#t030)                           |
|                       | [T-031: First employee in "Marketing"](#t031)                   |
|                       | [T-032: All employees earn more than 4000?](#t032)              |
|                       | [T-033: First employee in "Sales"](#t033)                       |
|                       | [T-034: All employees belong to a listed department?](#t034)    |
|                       | [T-035: Log each name and department](#t035)                    |
|                       | [T-036: Extract all names into one array](#t036)                |
|                       | [T-037: Increment each salary by 10%](#t037)                    |
|                       | [T-038: Flatten employee skills](#t038)                         |
|                       | [T-039: Total salary in "Engineering"](#t039)                   |
|                       | [T-040: Any department where all employees earn > 5000?](#t040) |
|                       | [T-041: Count unique projects across employees](#t041)          |
|                       | [T-042: Array of `{ name, departmentName }`](#t042)             |
|                       | [T-043: Names of employees earning > 6000](#t043)               |
|                       | [T-044: `for...of` — print all names](#t044)                    |
|                       | [T-045: `for...of` — names earning > 5000](#t045)               |
|                       | [T-046: Destructure in `for...of` — log name and salary](#t046) |
|                       | [T-047: Match employees with departments in `for...of`](#t047)  |
|                       | [T-048: `entries()` with `for...of` — index and name](#t048)    |

### 3. Array-like & static methods (T-049 – T-054)

| #                     | Question                                                            |
| --------------------- | ------------------------------------------------------------------- |
| <span id="i3"></span> | [T-049: Access second element of array-like object](#t049)          |
|                       | [T-050: Convert `arguments` to a real array](#t050)                 |
|                       | [T-051: Convert `NodeList` from `querySelectorAll` to array](#t051) |
|                       | [T-052: Merge two arrays](#t052)                                    |
|                       | [T-053: Five `"A"` values with `Array.from`](#t053)                 |
|                       | [T-054: Convert `"Hello"` to character array](#t054)                |

---

<a id="p1"></a>

## 1. Fundamentals (T-001 – T-020)

<a id="t001"></a>

### T-001: Create an array of 5 elements using the Array constructor

**Answer:**

> Pass five values to `new Array(...)`. Each argument becomes an element. Do not confuse this with `new Array(5)`, which creates five **empty slots**.

```javascript
const arr = new Array('apple', 'banana', 'cherry', 'date', 'elderberry');
console.log(arr.length); // 5
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t002"></a>

### T-002: Create an array of 3 empty slots

**Answer:**

> When `Array` receives a **single number**, it creates a sparse array with that many empty slots (holes), not three `undefined` values.

```javascript
const arr = new Array(3);
console.log(arr.length); // 3
console.log(0 in arr); // false — slot is empty, not undefined
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t003"></a>

### T-003: Access the fourth element using `length`

**Answer:**

> The fourth element sits at index `length - 3` (1st → `length - 4`, 2nd → `length - 3`, …). Alternatively use index `3` directly.

```javascript
const arr = [10, 20, 30, 40, 50, 60];
const fourth = arr[arr.length - 3]; // index 3 → 40
console.log(fourth); // 40
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t004"></a>

### T-004: Print elements at odd indices

**Answer:**

> Odd indices are 1, 3, 5, … — check `i % 2 !== 0` inside a `for` loop.

```javascript
const arr = [10, 20, 30, 40, 50, 60];

for (let i = 0; i < arr.length; i++) {
  if (i % 2 !== 0) {
    console.log(arr[i]); // 20, 40, 60
  }
}
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t005"></a>

### T-005: Add one element at the front and the end

**Answer:**

> `unshift()` adds to the front; `push()` adds to the end. Both mutate the original array.

```javascript
const arr = ['b', 'c'];
arr.unshift('a'); // front
arr.push('d'); // end
console.log(arr); // ['a', 'b', 'c', 'd']
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t006"></a>

### T-006: Remove an element from the front and the end

**Answer:**

> `shift()` removes from the front; `pop()` removes from the end. Both return the removed value.

```javascript
const arr = ['a', 'b', 'c', 'd'];
arr.shift(); // removes 'a'
arr.pop(); // removes 'd'
console.log(arr); // ['b', 'c']
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t007"></a>

### T-007: Destructure the 6th food element

**Answer:**

> Skip the first five positions with commas, then bind the sixth value. Index 5 = 6th element.

```javascript
const foods = [
  'pizza',
  'pasta',
  'burger',
  'sushi',
  'tacos',
  'ramen',
  'curry',
  'salad',
  'steak',
  'dosa',
];
const [, , , , , sixthFood] = foods;
console.log(sixthFood); // 'ramen'
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t008"></a>

### T-008: Take out the last 8 items using rest

**Answer:**

> Destructure the first two items, then collect the rest into a new array with `...rest`.

```javascript
const foods = [
  'pizza',
  'pasta',
  'burger',
  'sushi',
  'tacos',
  'ramen',
  'curry',
  'salad',
  'steak',
  'dosa',
];
const [first, second, ...lastEight] = foods;
console.log(lastEight);
// ['burger', 'sushi', 'tacos', 'ramen', 'curry', 'salad', 'steak', 'dosa']
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t009"></a>

### T-009: Shallow clone an array

**Answer:**

> Spread, `slice()`, and `Array.from()` all create a new array with the same top-level values. Nested objects are still shared (shallow copy).

```javascript
const original = [1, 2, 3, 4];
const clone = [...original];
// or: original.slice()
// or: Array.from(original)

console.log(clone); // [1, 2, 3, 4]
console.log(clone === original); // false
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t010"></a>

### T-010: Empty an array using `length`

**Answer:**

> Setting `length` to `0` truncates the array in place — O(1) and very efficient.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.length = 0;
console.log(arr); // []
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t011"></a>

### T-011: Resize to length 6 when you find 5

**Answer:**

> Loop through the array; when the value `5` is found, set `length = 6` to truncate everything after index 5.

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (let i = 0; i < arr.length; i++) {
  if (arr[i] === 5) {
    arr.length = 6;
    break;
  }
}

console.log(arr); // [1, 2, 3, 4, 5, 6]
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t012"></a>

### T-012: Empty an array with `splice()`

**Answer:**

> `splice(0)` removes all elements starting at index 0 and returns them. The array becomes empty.

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.splice(0);
console.log(arr); // []
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t013"></a>

### T-013: Most efficient way to empty an array?

**Answer:**

> **`arr.length = 0`** is the most efficient. It clears in place in O(1) time without creating a new array or shifting elements one by one.

| Method                      | Notes                                                                       |
| --------------------------- | --------------------------------------------------------------------------- |
| `length = 0`                | Fastest — O(1), keeps same reference                                        |
| `splice(0)`                 | Works but slower for large arrays                                           |
| `pop()` / `shift()` in loop | O(n) — shifts remaining elements each time                                  |
| `arr = []`                  | Only reassigns the **variable**, not the original reference others may hold |

```javascript
const arr = [1, 2, 3, 4, 5];
arr.length = 0; // preferred
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t014"></a>

### T-014: Concatenate two empty arrays

**Answer:**

> Returns a **new empty array** `[]`. The result has length 0 and is a different reference from either input.

```javascript
const result = [].concat([]);
console.log(result); // []
console.log(result.length); // 0
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t015"></a>

### T-015: Check partial match against any element

**Answer:**

> Use `some()` with `includes()` on strings, or a custom predicate. `includes()` alone only checks full equality.

```javascript
const words = ['javascript', 'typescript', 'python'];

const query = 'script';
const hasPartialMatch = words.some((word) => word.includes(query));
console.log(hasPartialMatch); // true — 'javascript' contains 'script'
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t016"></a>

### T-016: `slice()` vs `splice()`

**Answer:**

|              | `slice(start, end)` | `splice(start, deleteCount, ...items)` |
| ------------ | ------------------- | -------------------------------------- |
| **Mutates?** | No                  | Yes                                    |
| **Returns**  | New sub-array       | Array of removed items                 |
| **Use**      | Copy a portion      | Insert / delete / replace in place     |

```javascript
const arr = [1, 2, 3, 4, 5];

const copy = arr.slice(1, 3); // [2, 3] — arr unchanged
const removed = arr.splice(1, 2, 'a', 'b'); // removes [2,3], inserts 'a','b'
// arr is now [1, 'a', 'b', 4, 5]
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t017"></a>

### T-017: Sort immutably (ascending & descending)

**Answer:**

> Use `toSorted()` (ES2023) or `[...arr].sort()` so the source array never changes.

```javascript
const codes = ['b2', 'a10', 'a2', 'b1'];

const ascending = codes.toSorted((a, b) =>
  a.localeCompare(b, undefined, { numeric: true })
);
const descending = codes.toSorted((a, b) =>
  b.localeCompare(a, undefined, { numeric: true })
);

console.log(ascending); // ['a2', 'a10', 'b1', 'b2']
console.log(descending); // ['b2', 'b1', 'a10', 'a2']
console.log(codes); // unchanged — ['b2', 'a10', 'a2', 'b1']
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t018"></a>

### T-018: Sparse vs dense arrays

**Answer:**

> A **dense** array has a value at every index from `0` to `length - 1`. A **sparse** array has **holes** — missing indices that were never assigned.

```javascript
// Dense
const dense = [1, 2, 3, 4, 5];

// Sparse
const sparse = [1, , 3]; // hole at index 1
const sparse2 = new Array(5); // 5 empty slots

console.log(1 in sparse); // false
console.log(sparse.length); // 3
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t019"></a>

### T-019: Practical uses of `.fill()`

**Answer:**

> Initialize arrays with a default value, reset buffers, or pad a range without a manual loop.

```javascript
// Initialize a score board with zeros
const scores = new Array(5).fill(0); // [0, 0, 0, 0, 0]

// Reset only part of an array
const buffer = [1, 2, 3, 4, 5];
buffer.fill(-1, 2, 4); // [1, 2, -1, -1, 5]

// Create a 3×3 grid (same reference — use map for unique inner arrays)
const grid = Array.from({ length: 3 }, () => new Array(3).fill(0));
```

<p><a href="#i1">Back to index</a></p>

---

<a id="t020"></a>

### T-020: Convert an array to a string

**Answer:**

> `join(separator)` gives control over the delimiter. `toString()` joins with commas. `String(arr)` behaves like `toString()`.

```javascript
const arr = ['hello', 'world'];

arr.join(); // "hello,world"
arr.join(' '); // "hello world"
arr.join(' - '); // "hello - world"
arr.toString(); // "hello,world"
String(arr); // "hello,world"
```

<p><a href="#i1">Back to index</a></p>

---

<a id="p2"></a>

## 2. Employee dataset (T-021 – T-048)

Shared setup for all employee tasks:

```javascript
const employees = [
  { id: 1, name: 'Alice', departmentId: 1, salary: 5000 },
  { id: 2, name: 'Bob', departmentId: 2, salary: 7000 },
  { id: 3, name: 'Charlie', departmentId: 3, salary: 4500 },
  { id: 4, name: 'Diana', departmentId: 1, salary: 5500 },
  { id: 5, name: 'Edward', departmentId: 2, salary: 8000 },
  { id: 6, name: 'Fiona', departmentId: 4, salary: 6000 },
  { id: 7, name: 'George', departmentId: 3, salary: 5200 },
  { id: 8, name: 'Helen', departmentId: 4, salary: 7200 },
  { id: 9, name: 'Ian', departmentId: 2, salary: 4800 },
  { id: 10, name: 'Jane', departmentId: 1, salary: 5100 },
];

const departments = [
  { id: 1, name: 'HR' },
  { id: 2, name: 'Engineering' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Sales' },
];

const getDeptName = (departmentId) =>
  departments.find((d) => d.id === departmentId)?.name ?? 'Unknown';

const getDeptIdByName = (name) => departments.find((d) => d.name === name)?.id;
```

---

<a id="t021"></a>

### T-021: Filter employees in "Engineering"

**Answer:**

> Find the department id first, then `filter` employees by `departmentId`.

```javascript
const engineeringId = getDeptIdByName('Engineering'); // 2

const engineeringEmployees = employees.filter(
  (emp) => emp.departmentId === engineeringId
);
// Bob, Edward, Ian
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t022"></a>

### T-022: Combine name and department — `"Alice (HR)"`

**Answer:**

> `map` each employee to a formatted string using a department lookup.

```javascript
const formatted = employees.map(
  (emp) => `${emp.name} (${getDeptName(emp.departmentId)})`
);
// ['Alice (HR)', 'Bob (Engineering)', ...]
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t023"></a>

### T-023: Highest salary

**Answer:**

> `reduce` to track the max, or `Math.max` with spread over mapped salaries.

```javascript
const highestSalary = employees.reduce(
  (max, emp) => (emp.salary > max ? emp.salary : max),
  0
);
// 8000

// Alternative
const highest = Math.max(...employees.map((e) => e.salary));
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t024"></a>

### T-024: At least one employee in "Sales"?

**Answer:**

> `some()` returns `true` as soon as one match is found.

```javascript
const salesId = getDeptIdByName('Sales');

const hasSalesEmployee = employees.some((emp) => emp.departmentId === salesId);
// true — Fiona, Helen
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t025"></a>

### T-025: Function to filter by salary threshold

**Answer:**

> Accept a minimum salary parameter and return a reusable filter function or filtered array.

```javascript
function filterByMinSalary(minSalary) {
  return employees.filter((emp) => emp.salary > minSalary);
}

const above6000 = filterByMinSalary(6000);
// Bob, Edward, Fiona, Helen
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t026"></a>

### T-026: Array of names only

**Answer:**

> `map` to extract the `name` property from each object.

```javascript
const names = employees.map((emp) => emp.name);
// ['Alice', 'Bob', 'Charlie', ...]
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t027"></a>

### T-027: Total salary with `reduce`

**Answer:**

> Accumulate salaries starting from `0`.

```javascript
const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
// 58400
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t028"></a>

### T-028: Any employee earning less than 5000?

**Answer:**

> `some()` short-circuits on the first match.

```javascript
const hasLowEarner = employees.some((emp) => emp.salary < 5000);
// true — Charlie (4500), Ian (4800)
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t029"></a>

### T-029: First employee earning exactly 5100

**Answer:**

> `find()` returns the first matching object or `undefined`.

```javascript
const employee = employees.find((emp) => emp.salary === 5100);
// { id: 10, name: 'Jane', ... }
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t030"></a>

### T-030: Last employee in "HR"

**Answer:**

> `findLast()` (ES2023) searches from the end. Filter + pop also works.

```javascript
const hrId = getDeptIdByName('HR');

const lastInHR = employees.findLast((emp) => emp.departmentId === hrId);
// Jane (id: 10)
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t031"></a>

### T-031: First employee in "Marketing"

**Answer:**

> `find()` returns the first match from the start.

```javascript
const marketingId = getDeptIdByName('Marketing');

const firstInMarketing = employees.find(
  (emp) => emp.departmentId === marketingId
);
// Charlie (id: 3)
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t032"></a>

### T-032: All employees earn more than 4000?

**Answer:**

> `every()` returns `true` only if **all** elements pass the test.

```javascript
const allAbove4000 = employees.every((emp) => emp.salary > 4000);
// true
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t033"></a>

### T-033: First employee in "Sales"

**Answer:**

> Same pattern as T-031 with the Sales department id.

```javascript
const salesId = getDeptIdByName('Sales');

const firstInSales = employees.find((emp) => emp.departmentId === salesId);
// Fiona (id: 6)
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t034"></a>

### T-034: All employees belong to a listed department?

**Answer:**

> Build a `Set` of valid department ids, then `every()` employee must have a matching id.

```javascript
const validDeptIds = new Set(departments.map((d) => d.id));

const allValid = employees.every((emp) => validDeptIds.has(emp.departmentId));
// true
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t035"></a>

### T-035: Log each name and department

**Answer:**

> `forEach` for side effects — lookup department name per employee.

```javascript
employees.forEach((emp) => {
  console.log(`${emp.name} — ${getDeptName(emp.departmentId)}`);
});
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t036"></a>

### T-036: Extract all names into one array

**Answer:**

> Identical to T-026 — `map` to pluck the `name` field.

```javascript
const allNames = employees.map((emp) => emp.name);
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t037"></a>

### T-037: Increment each salary by 10%

**Answer:**

> `map` to return new objects with updated salary — do not mutate originals if immutability matters.

```javascript
const withRaise = employees.map((emp) => ({
  ...emp,
  salary: emp.salary * 1.1,
}));
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t038"></a>

### T-038: Flatten employee skills

**Answer:**

> `flatMap` maps each employee to their skills array and flattens one level.

```javascript
const employeesWithSkills = [
  { name: 'Alice', skills: ['Excel', 'Management'] },
  { name: 'Bob', skills: ['JavaScript', 'React'] },
  { name: 'Charlie', skills: ['SEO', 'Analytics'] },
];

const allSkills = employeesWithSkills.flatMap((emp) => emp.skills);
// ['Excel', 'Management', 'JavaScript', 'React', 'SEO', 'Analytics']
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t039"></a>

### T-039: Total salary in "Engineering"

**Answer:**

> Chain `filter` then `reduce`, or use a single `reduce` with a condition.

```javascript
const engineeringId = getDeptIdByName('Engineering');

const engineeringTotal = employees
  .filter((emp) => emp.departmentId === engineeringId)
  .reduce((sum, emp) => sum + emp.salary, 0);
// 19800 (Bob 7000 + Edward 8000 + Ian 4800)
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t040"></a>

### T-040: Any department where all employees earn > 5000?

**Answer:**

> Group employees by department, then check if **every** group has all salaries above 5000 and at least one member.

```javascript
const deptGroups = Object.groupBy(employees, (e) => e.departmentId);

const hasDeptAllAbove5000 = Object.values(deptGroups).some(
  (group) => group.length > 0 && group.every((emp) => emp.salary > 5000)
);
// true — Engineering (all > 5000), Sales (6000, 7200)
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t041"></a>

### T-041: Count unique projects across employees

**Answer:**

> Collect all projects with `flatMap`, then deduplicate with `Set`.

```javascript
const employeesWithProjects = [
  { id: 1, name: 'Alice', projects: ['Project A', 'Project B'] },
  { id: 2, name: 'Bob', projects: ['Project B', 'Project C'] },
  { id: 3, name: 'Charlie', projects: ['Project A'] },
];

const uniqueProjectCount = new Set(
  employeesWithProjects.flatMap((emp) => emp.projects)
).size;
// 3 — A, B, C
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t042"></a>

### T-042: Array of `{ name, departmentName }`

**Answer:**

> `map` each employee, resolve department name via lookup.

```javascript
const withDept = employees.map((emp) => ({
  name: emp.name,
  departmentName: getDeptName(emp.departmentId),
}));
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t043"></a>

### T-043: Names of employees earning > 6000

**Answer:**

> `filter` then `map` — or chain in one expression.

```javascript
const highEarners = employees
  .filter((emp) => emp.salary > 6000)
  .map((emp) => emp.name);
// ['Bob', 'Edward', 'Helen']
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t044"></a>

### T-044: `for...of` — print all names

**Answer:**

> `for...of` iterates values directly — cleaner than index-based loops for arrays of objects.

```javascript
for (const emp of employees) {
  console.log(emp.name);
}
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t045"></a>

### T-045: `for...of` — names earning > 5000

**Answer:**

> Add a condition inside the loop before logging.

```javascript
for (const emp of employees) {
  if (emp.salary > 5000) {
    console.log(emp.name);
  }
}
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t046"></a>

### T-046: Destructure in `for...of` — log name and salary

**Answer:**

> Destructure `{ name, salary }` directly in the loop header.

```javascript
for (const { name, salary } of employees) {
  console.log(name, salary);
}
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t047"></a>

### T-047: Match employees with departments in `for...of`

**Answer:**

> Look up the department inside the loop and log the pairing.

```javascript
for (const emp of employees) {
  const dept = departments.find((d) => d.id === emp.departmentId);
  console.log(`${emp.name} works in ${dept?.name ?? 'Unknown'}`);
}
```

<p><a href="#i2">Back to index</a></p>

---

<a id="t048"></a>

### T-048: `entries()` with `for...of` — index and name

**Answer:**

> `entries()` yields `[index, value]` pairs ideal for destructuring in `for...of`.

```javascript
for (const [index, emp] of employees.entries()) {
  console.log(index, emp.name);
}
```

<p><a href="#i2">Back to index</a></p>

---

<a id="p3"></a>

## 3. Array-like & static methods (T-049 – T-054)

<a id="t049"></a>

### T-049: Access second element of array-like object

**Answer:**

> Array-like objects use numeric keys and a `length` property. Access index `1` directly — or convert with `Array.from` first.

```javascript
const arrayLike = { 0: 'First', 1: 'Second', length: 2 };

console.log(arrayLike[1]); // 'Second'
```

<p><a href="#i3">Back to index</a></p>

---

<a id="t050"></a>

### T-050: Convert `arguments` to a real array

**Answer:**

> `Array.from(arguments)` (or rest parameters in modern code) produces a true array with all array methods.

```javascript
function collectArgs() {
  const argsArray = Array.from(arguments);
  console.log(Array.isArray(argsArray)); // true
  return argsArray;
}

collectArgs(1, 2, 3); // [1, 2, 3]

// Modern alternative — prefer rest parameters
function collectArgsModern(...args) {
  return args;
}
```

<p><a href="#i3">Back to index</a></p>

---

<a id="t051"></a>

### T-051: Convert `NodeList` from `querySelectorAll` to array

**Answer:**

> `querySelectorAll` returns a `NodeList` — array-like but not a full array. Spread or `Array.from` converts it.

```javascript
const divs = document.querySelectorAll('div');
const divsArray = Array.from(divs);
// or: const divsArray = [...divs];

divsArray.forEach((div) => div.classList.add('highlight'));
```

<p><a href="#i3">Back to index</a></p>

---

<a id="t052"></a>

### T-052: Merge two arrays

**Answer:**

> Spread is the most common approach. `concat` also works and does not mutate either source.

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];

const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]
// or: arr1.concat(arr2)           // [1, 2, 3, 4]
```

<p><a href="#i3">Back to index</a></p>

---

<a id="t053"></a>

### T-053: Five `"A"` values with `Array.from`

**Answer:**

> Pass `{ length: n }` as array-like and a mapper function to fill each slot.

```javascript
const fiveAs = Array.from({ length: 5 }, () => 'A');
console.log(fiveAs); // ['A', 'A', 'A', 'A', 'A']
```

<p><a href="#i3">Back to index</a></p>

---

<a id="t054"></a>

### T-054: Convert `"Hello"` to character array

**Answer:**

> Strings are iterables — `Array.from` splits into Unicode code units (characters).

```javascript
const chars = Array.from('Hello');
console.log(chars); // ['H', 'e', 'l', 'l', 'o']
```

<p><a href="#i3">Back to index</a></p>

---

## Quick reference — method by task

| Tasks         | Primary methods                                                                       |
| ------------- | ------------------------------------------------------------------------------------- |
| T-001 – T-006 | `new Array()`, literals, `push`, `unshift`, `pop`, `shift`                            |
| T-007 – T-009 | Destructuring, rest, spread, `slice`                                                  |
| T-010 – T-013 | `length`, `splice`, efficiency                                                        |
| T-014 – T-020 | `concat`, `some`, `includes`, `slice` vs `splice`, `toSorted`, `fill`, `join`         |
| T-021 – T-048 | `filter`, `map`, `reduce`, `some`, `every`, `find`, `findLast`, `flatMap`, `for...of` |
| T-049 – T-054 | `Array.from`, spread, `querySelectorAll`                                              |

**Interview tip:** After studying these answers, close the file and explain T-021, T-027, and T-040 aloud — they cover filter, reduce, and grouped logic interviewers love.
