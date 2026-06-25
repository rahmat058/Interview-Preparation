---
title: "Class vs Function OOP — Problems & Solutions"
description: "Side-by-side constructor/function and ES6 class solutions for common OOP interview problems."
tags: ["javascript", "oop", "class", "constructor", "prototype", "interview"]
level: "Intermediate to Senior"
---

# Class vs Function OOP — Problems & Solutions

Every problem below has **two solutions**:

| Style              | Also called                                | Best when                                              |
| ------------------ | ------------------------------------------ | ------------------------------------------------------ |
| **Function-based** | Constructor + prototype, factory + closure | Legacy codebases, no `class`, true privacy via closure |
| **Class-based**    | ES6 `class`, `extends`, `#private`         | Modern apps, familiar to Java/TS devs, static methods  |

**Interview tip:** Interviewers may ask "implement with class" or "without class" — know both.

---

## Four pillars — where they appear

| Pillar            | One-line definition                           | In JavaScript                            | Problems in this file        |
| ----------------- | --------------------------------------------- | ---------------------------------------- | ---------------------------- |
| **Encapsulation** | Hide internal state; expose only safe methods | Closure, `#private`, module scope        | #1, #2, #5, #7, #8, #9, #11  |
| **Abstraction**   | Hide _how_ it works; expose _what_ it does    | Public API, factory, base class contract | #1, #5, #6, #7, #9, #10, #11 |
| **Inheritance**   | Child reuses / extends parent behavior        | `extends`, prototype chain               | #3, #4, #6                   |
| **Polymorphism**  | Same call, different behavior per type        | Method override, duck typing, strategy   | #3, #4, #6, #10              |

**Legend in code comments:** `[Encapsulation]` `[Abstraction]` `[Inheritance]` `[Polymorphism]`

### Mini examples (one per pillar)

```javascript
// [Encapsulation] — balance hidden; only deposit/withdraw/getBalance are public
function createAccount() {
  let balance = 0; // private
  return {
    deposit(n) {
      balance += n;
    },
    getBalance() {
      return balance;
    },
  };
}

// [Abstraction] — caller uses drive(), not engine internals
class Car {
  drive() {
    return this.#startEngine() + " moving";
  }
  #startEngine() {
    return "vroom";
  } // hidden detail
}

// [Inheritance] — Employee gets Person's name + prototype chain
class Employee extends Person {
  constructor(name, dept) {
    super(name);
    this.dept = dept;
  }
}

// [Polymorphism] — same .area() call, different math per shape
shapes.forEach((s) => console.log(s.area())); // Circle vs Rectangle
```

### 1. Encapsulation — description, why, pros & cons

**What it is:** Bundling data with the methods that operate on it, and **hiding** internal details so outside code cannot corrupt state directly.

**Why we need it:**

```javascript
// ❌ Without encapsulation — anyone can break invariants
const account = { balance: 100 };
account.balance = -9999; // invalid state
account.balance = "hello"; // type corruption

// ✅ With encapsulation — rules enforced in one place
const account = createBankAccount(100);
account.balance; // undefined — can't touch directly
account.withdraw(200); // rejected inside withdraw() — balance stays valid
```

| Pros                                                              | Cons                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Prevents invalid state (`balance < 0`, negative stack pop)        | Slightly more code than public fields                                                |
| Single place to change validation logic                           | Closure privacy: methods not on prototype (more memory per instance if many methods) |
| Easier to reason about — only public API matters                  | `#private` requires modern JS; closure harder to debug in DevTools                   |
| Safer refactoring — internals can change without breaking callers | Over-encapsulation can feel heavy for simple DTOs                                    |

**Real-world benefit:** React component state, Redux store, bank APIs — consumers call `deposit()`, never assign `balance` directly. Same idea as not letting UI components mutate the database.

**Interview one-liner:** _"Encapsulation protects invariants — I hide `balance` and expose only validated operations."_

---

### 2. Abstraction — description, why, pros & cons

**What it is:** Showing a **simple interface** while hiding implementation complexity. Callers care _what_ happens, not _how_.

**Why we need it:**

```javascript
// ❌ Without abstraction — caller knows Map + Set + event names
const handlers = new Map();
if (!handlers.has("click")) handlers.set("click", new Set());
handlers.get("click").add(fn);
handlers.get("click").forEach((f) => f(data));

// ✅ With abstraction — one line to subscribe
bus.on("click", fn);
bus.emit("click", data);
```

| Pros                                                          | Cons                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Reduces cognitive load — `stack.push()` vs array index math   | Can hide bugs if API is too vague                                         |
| Swap internals (array → linked list) without changing callers | Wrong abstraction leaks anyway (e.g. `getAll()` returning live reference) |
| Teams agree on contracts (`charge()`, `area()`)               | Over-abstraction (10 layers) hurts readability                            |
| Testable — mock `paymentStrategy`, not Stripe SDK             | Abstract base classes can force awkward hierarchies                       |

**Real-world benefit:** `fetch('/api/users')` — you don't manage TCP sockets. `checkout.pay(99)` — you don't know Stripe vs PayPal. Frontend uses `localStorage` API, not raw disk sectors.

**Interview one-liner:** _"Abstraction lets `totalArea(shapes)` work without knowing if each shape is Circle or Rectangle."_

---

### 3. Inheritance — description, why, pros & cons

**What it is:** A child type **reuses** parent properties and methods via the prototype chain (`extends` or manual linking).

**Why we need it:**

```javascript
// ❌ Without inheritance — duplicate shared logic
function Employee(name, dept) {
  this.name = name;
  this.greet = function () {
    return `Hi, ${this.name}`;
  }; // duplicated per instance!
}

// ✅ With inheritance — greet lives once on Person.prototype
class Employee extends Person {
  constructor(name, dept) {
    super(name);
    this.dept = dept;
  }
}
// Employee instances share one introduce/greet function on prototype
```

| Pros                                                      | Cons                                                      |
| --------------------------------------------------------- | --------------------------------------------------------- |
| DRY — shared methods on prototype (one copy in memory)    | Tight coupling — child depends on parent implementation   |
| `instanceof` checks for type hierarchies                  | Deep trees (`Animal → Dog → Bulldog`) get fragile         |
| Natural for "is-a" relationships (`Employee is a Person`) | Parent change can break all children (fragile base class) |
| Familiar to OOP backgrounds                               | JS has single inheritance only — no multiple `extends`    |

**When to skip inheritance:** Prefer **composition** when behavior is swapped at runtime (payment strategy, plugins) — see #10.

**Real-world benefit:** DOM hierarchy (`HTMLInputElement extends HTMLElement`). Use sparingly in app code; React favors composition (`<Button icon={...} />`).

**Interview one-liner:** _"Inheritance shares behavior up a chain; I use it for true is-a, otherwise composition."_

---

### 4. Polymorphism — description, why, pros & cons

**What it is:** **Same interface, different behavior** at runtime depending on the actual type — method override or duck typing.

**Why we need it:**

```javascript
// ❌ Without polymorphism — if/else everywhere
function getArea(shape) {
  if (shape.type === "circle") return Math.PI * shape.radius ** 2;
  if (shape.type === "rect") return shape.width * shape.height;
  // add new shape → edit this function (violates Open/Closed)
}

// ✅ With polymorphism — open for extension, closed for modification
shapes.forEach((s) => (sum += s.area())); // Circle, Rectangle, Triangle — no if/else
```

| Pros                                                     | Cons                                                   |
| -------------------------------------------------------- | ------------------------------------------------------ |
| Open/Closed — add `Triangle` without editing `totalArea` | Duck typing: no compile-time guarantee `area()` exists |
| Cleaner loops and pipelines                              | Wrong override silently breaks behavior                |
| Strategy pattern — swap `charge()` implementation        | Can be harder to trace which implementation runs       |
| Works with or without inheritance                        | Overuse of subtype polymorphism → deep class trees     |

**Real-world benefit:** Payment gateways (Stripe/PayPal), sorting comparators, React `children` (any renderable node), file exporters (PDF/CSV/JSON same `export()` call).

**Interview one-liner:** _"Polymorphism means I call `charge()` and the injected strategy decides Stripe vs PayPal."_

---

### Function-based vs class-based — overall pros & cons

|                     | Function (factory / constructor)                                          | Class (`extends`, `#private`)                                                   |
| ------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Pros**            | No `new` required; closure privacy is natural; works everywhere           | Readable inheritance; `#` enforced privacy; `static` utilities; familiar syntax |
| **Cons**            | Manual prototype linking is verbose; easy to forget `new` on constructors | Must use `new`; `this` binding pitfalls; less common in modern React            |
| **Best for**        | Modules, factories, true IIFE singletons, interview "no class" rounds     | Domain models, inheritance trees, teams from Java/C#                            |
| **Example in repo** | `createBankAccount()` — #1                                                | `class BankAccount` — #1                                                        |

---

## Table of Contents

0. [Four pillars — where they appear](#four-pillars--where-they-appear)
   - [Encapsulation — description, why, pros & cons](#1-encapsulation--description-why-pros--cons)
   - [Abstraction — description, why, pros & cons](#2-abstraction--description-why-pros--cons)
   - [Inheritance — description, why, pros & cons](#3-inheritance--description-why-pros--cons)
   - [Polymorphism — description, why, pros & cons](#4-polymorphism--description-why-pros--cons)
   - [Function vs class — overall pros & cons](#function-based-vs-class-based--overall-pros--cons)
1. [Bank account (encapsulation)](#1-bank-account-encapsulation)
2. [Counter (private state)](#2-counter-private-state)
3. [Person → Employee (inheritance)](#3-person--employee-inheritance)
4. [Shapes — area polymorphism](#4-shapes--area-polymorphism)
5. [Stack data structure](#5-stack-data-structure)
6. [Vehicle factory](#6-vehicle-factory)
7. [Event emitter (observer)](#7-event-emitter-observer)
8. [Singleton app config](#8-singleton-app-config)
9. [Todo list manager](#9-todo-list-manager)
10. [Payment strategy](#10-payment-strategy)
11. [Library book lending](#11-library-book-lending)
12. [Compare both styles — interview summary](#12-compare-both-styles--interview-summary)

---

## 1. Bank account (encapsulation)

| Pillar            | Where in this problem                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| **Encapsulation** | `balance` / `#balance` — never exposed on the returned object            |
| **Abstraction**   | Caller uses `deposit` / `withdraw` / `getBalance` — not raw balance math |
| Inheritance       | —                                                                        |
| Polymorphism      | —                                                                        |

**Problem:** Create an account with `deposit`, `withdraw`, and `getBalance`. Balance must not be directly accessible from outside.

### Function-based (closure factory)

```javascript
function createBankAccount(initialBalance = 0) {
  let balance = initialBalance; // [Encapsulation] private via closure — not on returned object

  return {
    // [Abstraction] public API — hides how balance is stored/validated
    deposit(amount) {
      if (amount > 0) balance += amount; // [Encapsulation] only methods can mutate
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) balance -= amount;
    },
    getBalance() {
      return balance; // [Encapsulation] read-only access to hidden state
    },
  };
}

const acc = createBankAccount(100);
acc.deposit(50);
acc.withdraw(30);
console.log(acc.getBalance()); // 120
// acc.balance — undefined [Encapsulation] no direct access
```

### Class-based (private `#field`)

```javascript
class BankAccount {
  #balance = 0; // [Encapsulation] language-enforced private field

  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
  }

  // [Abstraction] same public contract as factory version
  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount(100);
acc.deposit(50);
acc.withdraw(30);
console.log(acc.getBalance()); // 120
```

**Interview answer:**

> **Encapsulation:** closure or `#balance` hides state. **Abstraction:** user sees banking operations, not internal storage. Class is better when you later need `extends BankAccount`.

### Why this pattern?

Banking is the classic encapsulation example: balance must never go negative or be set to arbitrary values from outside.

### Benefits

- **Data integrity** — `withdraw(500)` when balance is `100` is rejected inside the method
- **Stable API** — switch from number to cents internally without breaking `getBalance()` callers
- **Security mindset** — same reason APIs don't expose raw DB rows

### Pros & cons (this problem)

|               | Factory + closure                                                      | Class + `#balance`                                           |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Pros**      | No `new`; true privacy without `#`; easy to return plain object        | `instanceof BankAccount`; can `extends SavingsAccount` later |
| **Cons**      | Each instance closes over its own methods (or you attach methods once) | Requires `new`; `#` not visible in all debuggers             |
| **Pick when** | Utility modules, functional style, "implement without class"           | OOP hierarchy, TypeScript class models                       |

---

## 2. Counter (private state)

| Pillar            | Where in this problem                                       |
| ----------------- | ----------------------------------------------------------- |
| **Encapsulation** | `count` / `#count` — each instance owns private state       |
| **Abstraction**   | `increment` / `decrement` / `getValue` — simple counter API |
| Inheritance       | —                                                           |
| Polymorphism      | —                                                           |

**Problem:** Build a counter with `increment`, `decrement`, `getValue`. Multiple instances must be independent.

### Function-based

```javascript
function createCounter(start = 0) {
  let count = start; // [Encapsulation] per-factory-call closure = independent instance
  return {
    increment() {
      count++;
    }, // [Abstraction] mutate via method, not count++
    decrement() {
      count--;
    },
    getValue() {
      return count;
    },
  };
}

const a = createCounter();
const b = createCounter(10);
a.increment();
a.increment();
console.log(a.getValue(), b.getValue()); // 2, 10 — [Encapsulation] separate closures
```

### Class-based

```javascript
class Counter {
  #count = 0; // [Encapsulation] private per instance

  constructor(start = 0) {
    this.#count = start;
  }

  increment() {
    this.#count++;
  } // [Abstraction]
  decrement() {
    this.#count--;
  }
  getValue() {
    return this.#count;
  }
}

const a = new Counter();
const b = new Counter(10);
a.increment();
a.increment();
console.log(a.getValue(), b.getValue()); // 2, 10
```

### Why this pattern?

Counters appear in pagination, retry limits, and UI steppers — each screen needs its **own** count, not a shared global.

### Benefits

- **Isolation** — `a` and `b` never interfere (separate closure or instance)
- **Controlled mutation** — no `count = -5` from outside
- **Testable** — create fresh counter per test case

### Pros & cons (this problem)

|               | Factory                                           | Class                                                      |
| ------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| **Pros**      | Trivial one-liner API; no `new` in tests          | Clear `new Counter(10)` semantics; works with `instanceof` |
| **Cons**      | Looks like plain object — no type hint without TS | Slightly heavier for a 3-method object                     |
| **Pick when** | Hooks-style state (`useCounter` pattern)          | Domain entity in class-based codebase                      |

---

## 3. Person → Employee (inheritance)

| Pillar           | Where in this problem                                            |
| ---------------- | ---------------------------------------------------------------- |
| Encapsulation    | — (public `name`, `department`)                                  |
| **Abstraction**  | `introduce()` — caller doesn't care Person vs Employee internals |
| **Inheritance**  | Employee reuses Person's `name` + prototype chain                |
| **Polymorphism** | `introduce()` — same method name, different string per type      |

**Problem:** `Person` has `name` and `introduce()`. `Employee` adds `department` and overrides introduce to include department.

### Function-based (prototype inheritance)

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.introduce = function () {
  // [Abstraction] public behavior
  return `Hi, I'm ${this.name}`;
};

function Employee(name, department) {
  Person.call(this, name); // [Inheritance] copy parent instance props (= super)
  this.department = department;
}
Employee.prototype = Object.create(Person.prototype); // [Inheritance] link prototype chain
Employee.prototype.constructor = Employee;

Employee.prototype.introduce = function () {
  // [Polymorphism] override — same method name, Employee-specific output
  return `Hi, I'm ${this.name} from ${this.department}`;
};

const emp = new Employee("Alice", "Engineering");
console.log(emp.introduce()); // [Polymorphism] Employee version runs
console.log(emp instanceof Person); // true [Inheritance]
```

### Class-based

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  introduce() {
    return `Hi, I'm ${this.name}`;
  } // [Abstraction]
}

class Employee extends Person {
  // [Inheritance]
  constructor(name, department) {
    super(name); // [Inheritance] parent constructor
    this.department = department;
  }
  introduce() {
    // [Polymorphism] override
    return `Hi, I'm ${this.name} from ${this.department}`;
  }
}

const emp = new Employee("Alice", "Engineering");
console.log(emp.introduce());
console.log(emp instanceof Person); // true
```

**Interview answer:**

> **Inheritance:** `extends` / `Object.create` wires the chain. **Polymorphism:** `emp.introduce()` resolves to Employee's override. **Abstraction:** consumer only calls `introduce()`, not `name` + `department` manually.

### Why this pattern?

When types share identity (`name`) and behavior (`introduce`) but specialize (Employee adds `department`), inheritance avoids duplicating parent logic.

### Benefits

- **DRY** — `introduce` base logic written once on `Person.prototype`
- **Type checks** — `emp instanceof Person` for authorization ("all employees are people")
- **Polymorphic lists** — `[person, emp].forEach(p => p.introduce())` calls the right version

### Pros & cons (this problem)

|               | Prototype chain                                         | `extends`                                                   |
| ------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| **Pros**      | Shows you understand how `class` works under the hood   | Readable; `super()` is obvious; less boilerplate            |
| **Cons**      | Easy to break chain (forget `constructor`); verbose     | Hides prototype mechanics in interviews that test internals |
| **Pick when** | Legacy code, "no class" round, debugging prototype bugs | Greenfield, team OOP conventions, TypeScript                |

**Caution:** If `Employee` only _has_ a `department` but isn't really a `Person`, use composition instead: `{ person, department }`.

---

## 4. Shapes — area polymorphism

| Pillar           | Where in this problem                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| Encapsulation    | — (dimensions are public here)                                                      |
| **Abstraction**  | `Shape.area()` contract — `totalArea` doesn't know Circle vs Rectangle              |
| **Inheritance**  | `Circle` / `Rectangle` extend `Shape` (class) or share duck-typed `area` (function) |
| **Polymorphism** | `s.area()` — π·r² vs w·h depending on runtime type                                  |

**Problem:** `Circle` and `Rectangle` each implement `area()`. Write a function that sums areas of any shapes.

### Function-based

```javascript
function Circle(radius) {
  this.radius = radius;
}
Circle.prototype.area = function () {
  // [Polymorphism] Circle-specific formula
  return Math.PI * this.radius ** 2;
};

function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}
Rectangle.prototype.area = function () {
  // [Polymorphism] Rectangle-specific formula
  return this.width * this.height;
};

function totalArea(shapes) {
  // [Abstraction] + [Polymorphism] — one loop, any object with .area()
  return shapes.reduce((sum, s) => sum + s.area(), 0);
}

totalArea([new Circle(2), new Rectangle(3, 4)]);
// π*4 + 12 ≈ 14.57
```

### Class-based

```javascript
class Shape {
  area() {
    throw new Error("Subclass must implement area()"); // [Abstraction] contract / interface
  }
}

class Circle extends Shape {
  // [Inheritance]
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  } // [Polymorphism]
}

class Rectangle extends Shape {
  // [Inheritance]
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  } // [Polymorphism]
}

function totalArea(shapes) {
  return shapes.reduce((sum, s) => sum + s.area(), 0); // [Polymorphism] dispatch at runtime
}
```

### Why this pattern?

Graphics, billing, and layout engines need one algorithm (`totalArea`, `render`, `export`) to work on many types without a growing `if/else` chain.

### Benefits

- **Open/Closed** — add `Triangle` with its own `area()`; `totalArea` unchanged
- **Uniform API** — every shape answers to `.area()`
- **Testable** — mock `{ area: () => 10 }` in unit tests (duck typing)

### Pros & cons (this problem)

|               | Duck typing (function)                              | Abstract `Shape` (class)                               |
| ------------- | --------------------------------------------------- | ------------------------------------------------------ |
| **Pros**      | Minimal boilerplate; any object with `area()` works | Enforces contract via `throw` in base; clear hierarchy |
| **Cons**      | Typo `aria()` fails at runtime                      | Must extend `Shape`; more ceremony for 2 shapes        |
| **Pick when** | Small utilities, JS without TS                      | Large domain models, teams using abstract base classes |

**Without polymorphism:**

```javascript
// Every new shape = edit this function ❌
function totalArea(shapes) {
  return shapes.reduce((sum, s) => {
    if (s.radius) return sum + Math.PI * s.radius ** 2;
    if (s.width) return sum + s.width * s.height;
    return sum;
  }, 0);
}
```

---

## 5. Stack data structure

| Pillar            | Where in this problem                                             |
| ----------------- | ----------------------------------------------------------------- |
| **Encapsulation** | `items` / `#items` — array hidden; LIFO rules enforced in methods |
| **Abstraction**   | `push` / `pop` / `peek` — stack API, not raw array access         |
| Inheritance       | —                                                                 |
| Polymorphism      | —                                                                 |

**Problem:** Implement stack with `push`, `pop`, `peek`, `isEmpty`, `size`.

### Function-based

```javascript
function createStack() {
  const items = []; // [Encapsulation] private array inside closure
  return {
    push(value) {
      items.push(value);
      return this;
    }, // [Abstraction]
    pop() {
      if (!items.length) throw new Error("Stack underflow"); // [Encapsulation] guard rules
      return items.pop();
    },
    peek() {
      return items[items.length - 1];
    },
    isEmpty() {
      return items.length === 0;
    },
    size() {
      return items.length;
    },
  };
}

const stack = createStack();
stack.push(1).push(2);
stack.pop(); // 2
stack.peek(); // 1
```

### Class-based

```javascript
class Stack {
  #items = []; // [Encapsulation]

  push(value) {
    this.#items.push(value);
    return this;
  } // [Abstraction]
  pop() {
    if (this.isEmpty()) throw new Error("Stack underflow");
    return this.#items.pop();
  }
  peek() {
    return this.#items[this.#items.length - 1];
  }
  isEmpty() {
    return this.#items.length === 0;
  }
  size() {
    return this.#items.length;
  }
}
```

### Why this pattern?

A raw array allows `arr.unshift()` or `arr[0] = x` — breaking LIFO. A stack **enforces** last-in-first-out (undo stacks, browser history, DFS).

### Benefits

- **Invariant protection** — `pop()` on empty throws instead of returning `undefined` silently
- **Semantic API** — `peek()` vs remembering `arr[arr.length - 1]`
- **Encapsulation** — callers can't `splice` the internal array

### Pros & cons (this problem)

|               | Factory stack                              | Class stack                                       |
| ------------- | ------------------------------------------ | ------------------------------------------------- |
| **Pros**      | Drop-in `createStack()` in functional code | Reusable `Stack` type; can `extends BoundedStack` |
| **Cons**      | No `instanceof Stack` without extra work   | `new` required                                    |
| **Pick when** | Algorithm internals, interview closures    | DSA class library, OOP design                     |

---

## 6. Vehicle factory

| Pillar           | Where in this problem                                                            |
| ---------------- | -------------------------------------------------------------------------------- |
| Encapsulation    | —                                                                                |
| **Abstraction**  | `createVehicle` / `VehicleFactory.create` — hides `new Car` vs `new Truck`       |
| **Inheritance**  | `Car` / `Truck` extend `Vehicle` (class) or share constructor pattern (function) |
| **Polymorphism** | `.drive()` / `.info()` — different strings for car vs truck                      |

**Problem:** Factory returns `Car` or `Truck` with `drive()` and `info()`.

### Function-based (factory + prototype)

```javascript
function Car(model) {
  this.type = "car";
  this.model = model;
}
Car.prototype.drive = function () {
  // [Polymorphism] car behavior
  return `${this.model} car driving`;
};
Car.prototype.info = function () {
  return `[Car] ${this.model}`;
};

function Truck(model, capacity) {
  this.type = "truck";
  this.model = model;
  this.capacity = capacity;
}
Truck.prototype.drive = function () {
  // [Polymorphism] truck behavior
  return `${this.model} truck hauling ${this.capacity}t`;
};
Truck.prototype.info = function () {
  return `[Truck] ${this.model} (${this.capacity}t)`;
};

function createVehicle(kind, model, capacity) {
  // [Abstraction] single entry point
  switch (kind) {
    case "car":
      return new Car(model);
    case "truck":
      return new Truck(model, capacity);
    default:
      throw new Error(`Unknown vehicle: ${kind}`);
  }
}

const v1 = createVehicle("car", "Sedan");
const v2 = createVehicle("truck", "Freight", 10);
v1.drive(); // [Polymorphism]
v2.info(); // [Polymorphism]
```

### Class-based (factory static method)

```javascript
class Vehicle {
  constructor(model) {
    this.model = model;
  }
}

class Car extends Vehicle {
  // [Inheritance]
  drive() {
    return `${this.model} car driving`;
  } // [Polymorphism]
  info() {
    return `[Car] ${this.model}`;
  }
}

class Truck extends Vehicle {
  // [Inheritance]
  constructor(model, capacity) {
    super(model);
    this.capacity = capacity;
  }
  drive() {
    return `${this.model} truck hauling ${this.capacity}t`;
  } // [Polymorphism]
  info() {
    return `[Truck] ${this.model} (${this.capacity}t)`;
  }
}

class VehicleFactory {
  static create(kind, model, capacity) {
    // [Abstraction]
    switch (kind) {
      case "car":
        return new Car(model);
      case "truck":
        return new Truck(model, capacity);
      default:
        throw new Error(`Unknown vehicle: ${kind}`);
    }
  }
}

VehicleFactory.create("car", "Sedan").drive();
```

### Why this pattern?

Callers shouldn't know whether they're getting a `Car` or `Truck` — only that it can `drive()`. Factory + polymorphism centralize creation logic.

### Benefits

- **Single creation point** — change truck defaults in one `switch` / factory method
- **Polymorphic usage** — `vehicles.forEach(v => v.drive())` works for mixed fleet
- **Abstraction** — UI passes `"truck"` string, not `new Truck(...)` everywhere

### Pros & cons (this problem)

|               | `createVehicle()` function          | `VehicleFactory.create()` static                            |
| ------------- | ----------------------------------- | ----------------------------------------------------------- |
| **Pros**      | Simple; no class for factory itself | Groups all vehicle types under one namespace                |
| **Cons**      | Factory is loose function           | Extra class just for `static create`                        |
| **Pick when** | Scripts, small apps                 | Enterprise-style naming (`VehicleFactory`, `LoggerFactory`) |

---

## 7. Event emitter (observer)

| Pillar            | Where in this problem                                                     |
| ----------------- | ------------------------------------------------------------------------- |
| **Encapsulation** | `handlers` / `#handlers` Map — listener registry is internal              |
| **Abstraction**   | `on` / `off` / `emit` — pub/sub API without exposing Map structure        |
| Inheritance       | —                                                                         |
| Polymorphism      | — (handlers are functions; pattern is observer, not subtype polymorphism) |

**Problem:** `on(event, handler)`, `off(event, handler)`, `emit(event, data)`.

### Function-based

```javascript
function createEventEmitter() {
  const handlers = new Map(); // [Encapsulation] hidden listener store

  return {
    on(event, handler) {
      // [Abstraction]
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event).add(handler);
      return () => handlers.get(event).delete(handler);
    },
    off(event, handler) {
      handlers.get(event)?.delete(handler);
    },
    emit(event, ...args) {
      handlers.get(event)?.forEach((fn) => fn(...args)); // [Abstraction] broadcast
    },
  };
}

const bus = createEventEmitter();
bus.on("cart:update", (count) => console.log("Cart:", count));
bus.emit("cart:update", 3);
```

### Class-based

```javascript
class EventEmitter {
  #handlers = new Map(); // [Encapsulation]

  on(event, handler) {
    // [Abstraction]
    if (!this.#handlers.has(event)) this.#handlers.set(event, new Set());
    this.#handlers.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.#handlers.get(event)?.delete(handler);
  }

  emit(event, ...args) {
    this.#handlers.get(event)?.forEach((fn) => fn(...args));
  }
}
```

**Repo tie-in:** Same pattern as `createStore().subscribe()` in `vanilla-js/02-catalog-spa`.

### Why this pattern?

UI components shouldn't know about each other directly — the cart updates the badge, the analytics hook, and localStorage via **events**, not tight imports.

### Benefits

- **Decoupling** — publisher doesn't know who listens
- **Encapsulation** — `Map` of handlers never leaked
- **Extensibility** — add listeners without editing `emit` source

### Pros & cons (this problem)

|               | `createEventEmitter()`                               | `class EventEmitter`                                              |
| ------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| **Pros**      | Matches functional store pattern; easy singleton bus | Can `extends NodeEventEmitter`; multiple instances                |
| **Cons**      | One bus per factory call unless shared               | Heavier if you only need one module-level bus                     |
| **Pick when** | Vanilla JS stores, React context alternatives        | Node-style APIs, subclassing (`class MyBus extends EventEmitter`) |

**Without abstraction (tight coupling):**

```javascript
// ❌ Cart directly calls every dependent
function updateCart(count) {
  document.querySelector("#badge").textContent = count;
  saveToStorage(count);
  trackAnalytics(count);
}
```

---

## 8. Singleton app config

| Pillar            | Where in this problem                                         |
| ----------------- | ------------------------------------------------------------- |
| **Encapsulation** | `store` / `#store` — config object not reachable from outside |
| **Abstraction**   | `get` / `set` / `getInstance` — simple config API             |
| Inheritance       | —                                                             |
| Polymorphism      | —                                                             |

**Problem:** Only one config instance app-wide. `get(key)`, `set(key, value)`.

### Function-based (module singleton)

```javascript
const AppConfig = (() => {
  const store = { theme: "light", apiUrl: "/api" }; // [Encapsulation] IIFE closure
  return {
    get(key) {
      return store[key];
    }, // [Abstraction]
    set(key, value) {
      store[key] = value;
    },
    getAll() {
      return { ...store };
    }, // [Encapsulation] copy, not reference
  };
})();

AppConfig.set("theme", "dark");
AppConfig.get("theme"); // 'dark'
```

### Class-based

```javascript
class AppConfig {
  static #instance; // [Encapsulation] single shared reference
  #store = { theme: "light", apiUrl: "/api" }; // [Encapsulation]

  constructor() {
    if (AppConfig.#instance) return AppConfig.#instance;
    AppConfig.#instance = this;
  }

  static getInstance() {
    return new AppConfig();
  } // [Abstraction]

  get(key) {
    return this.#store[key];
  }
  set(key, value) {
    this.#store[key] = value;
  }
}

const a = AppConfig.getInstance();
const b = AppConfig.getInstance();
console.log(a === b); // true — [Encapsulation] one instance
a.set("theme", "dark");
```

### Why this pattern?

App theme, API base URL, and feature flags should be **one source of truth** — not recreated per import or component mount.

### Benefits

- **Consistency** — all modules read same `apiUrl`
- **Encapsulation** — can't accidentally `AppConfig.store = {}` from outside (IIFE / `#store`)
- **Lazy init** — class version creates instance on first `getInstance()`

### Pros & cons (this problem)

|               | IIFE module singleton                  | Class `getInstance()`                               |
| ------------- | -------------------------------------- | --------------------------------------------------- |
| **Pros**      | Idiomatic in JS modules; zero ceremony | Familiar to Java devs; testable with reset helper   |
| **Cons**      | Hard to reset in tests without hack    | Easy to misuse `new AppConfig()` twice before guard |
| **Pick when** | ES modules, frontend config            | OOP codebases, DI containers                        |

**When NOT to use singleton:** Anything that should be **per-request** (user session) or **per-test** — use factory or DI instead.

---

## 9. Todo list manager

| Pillar            | Where in this problem                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| **Encapsulation** | `todos` / `#todos` + `nextId` — internal list and ID generation          |
| **Abstraction**   | `add` / `remove` / `toggle` / `getAll` — todo CRUD without array surgery |
| Inheritance       | —                                                                        |
| Polymorphism      | —                                                                        |

**Problem:** Add, remove, list, and mark todos complete.

### Function-based

```javascript
function createTodoList() {
  let todos = []; // [Encapsulation]
  let nextId = 1; // [Encapsulation]

  return {
    add(title) {
      // [Abstraction]
      const todo = { id: nextId++, title, done: false };
      todos.push(todo);
      return todo;
    },
    remove(id) {
      todos = todos.filter((t) => t.id !== id);
    },
    toggle(id) {
      const todo = todos.find((t) => t.id === id);
      if (todo) todo.done = !todo.done;
    },
    getAll() {
      return todos.map((t) => ({ ...t }));
    }, // [Encapsulation] defensive copy
    getActive() {
      return todos.filter((t) => !t.done);
    },
  };
}

const list = createTodoList();
list.add("Learn prototypes");
list.add("Learn classes");
list.toggle(1);
console.log(list.getActive());
```

### Class-based

```javascript
class TodoList {
  #todos = []; // [Encapsulation]
  #nextId = 1; // [Encapsulation]

  add(title) {
    // [Abstraction]
    const todo = { id: this.#nextId++, title, done: false };
    this.#todos.push(todo);
    return todo;
  }

  remove(id) {
    this.#todos = this.#todos.filter((t) => t.id !== id);
  }
  toggle(id) {
    const todo = this.#todos.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;
  }
  getAll() {
    return this.#todos.map((t) => ({ ...t }));
  }
  getActive() {
    return this.#todos.filter((t) => !t.done);
  }
}
```

### Why this pattern?

Todo apps are a standard CRUD interview task — tests encapsulation (private list + ID), abstraction (methods not array ops), and defensive copies (`getAll`).

### Benefits

- **Auto IDs** — `nextId` hidden; no duplicate ID collisions from outside
- **Defensive copy** — `getAll()` returns clones so UI can't mutate internal state
- **Filtered views** — `getActive()` without exposing filter logic to caller

### Pros & cons (this problem)

|               | Factory list                                          | Class `TodoList`                                   |
| ------------- | ----------------------------------------------------- | -------------------------------------------------- |
| **Pros**      | Natural fit for React custom hooks (`useTodoList`)    | Clear entity; easy to add `extends SharedTodoList` |
| **Cons**      | Returning live todo refs from `add` can leak mutation | More boilerplate for interview-sized problem       |
| **Pick when** | Functional components, module state                   | OOP domain layer                                   |

---

## 10. Payment strategy

| Pillar           | Where in this problem                                              |
| ---------------- | ------------------------------------------------------------------ |
| Encapsulation    | — (strategies are stateless here)                                  |
| **Abstraction**  | `Checkout.pay()` — caller doesn't know Stripe vs PayPal internals  |
| Inheritance      | — (composition over inheritance — strategies are swapped in)       |
| **Polymorphism** | `strategy.charge(amount)` — same method, different gateway message |

**Problem:** `Checkout` class accepts a payment strategy — Stripe or PayPal — without if/else in `pay()`.

### Function-based (composition)

```javascript
function createStripeStrategy() {
  return {
    name: "stripe",
    charge(amount) {
      // [Polymorphism] Stripe implementation
      return `Stripe charged $${amount.toFixed(2)}`;
    },
  };
}

function createPayPalStrategy() {
  return {
    name: "paypal",
    charge(amount) {
      // [Polymorphism] PayPal implementation
      return `PayPal charged $${amount.toFixed(2)}`;
    },
  };
}

function createCheckout(strategy) {
  return {
    pay(amount) {
      // [Abstraction] + [Polymorphism] — no if/else; delegate to strategy
      return strategy.charge(amount);
    },
  };
}

createCheckout(createStripeStrategy()).pay(99.99);
createCheckout(createPayPalStrategy()).pay(49.5);
```

### Class-based (strategy + injection)

```javascript
class StripeStrategy {
  charge(amount) {
    return `Stripe charged $${amount.toFixed(2)}`;
  } // [Polymorphism]
}

class PayPalStrategy {
  charge(amount) {
    return `PayPal charged $${amount.toFixed(2)}`;
  } // [Polymorphism]
}

class Checkout {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  pay(amount) {
    return this.paymentStrategy.charge(amount); // [Abstraction] + [Polymorphism]
  }
}

new Checkout(new StripeStrategy()).pay(99.99);
new Checkout(new PayPalStrategy()).pay(49.5);
```

**Interview answer:**

> **Polymorphism** without inheritance — duck typing. **Abstraction** — `Checkout` depends on `charge()`, not Stripe SDK details. Open/Closed: add `ApplePayStrategy` without editing `Checkout`.

### Why this pattern?

Payment gateways change (Stripe, PayPal, Razorpay). Strategy + polymorphism let you add providers without touching checkout logic — core **Open/Closed Principle**.

### Benefits

- **No if/else sprawl** in `pay()` — delegate to strategy
- **Runtime swap** — A/B test gateways or per-region config
- **Unit tests** — inject `{ charge: () => "ok" }` mock

### Pros & cons (this problem)

|               | Object strategies (factory)           | Class strategies                                |
| ------------- | ------------------------------------- | ----------------------------------------------- |
| **Pros**      | Minimal; plain objects duck-type fine | Named types; can share base `PaymentStrategy`   |
| **Cons**      | No shared validation in base class    | Extra classes for simple one-method strategies  |
| **Pick when** | JS apps, composition-first            | TypeScript interfaces, enterprise payment layer |

**Without polymorphism:**

```javascript
// ❌ Every new gateway = edit Checkout
pay(amount, provider) {
  if (provider === "stripe") return stripeCharge(amount);
  if (provider === "paypal") return paypalCharge(amount);
}
```

---

## 11. Library book lending

| Pillar            | Where in this problem                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| **Encapsulation** | `books` / `#books` — catalog hidden inside library                     |
| **Abstraction**   | `lend` / `returnBook` / `listAvailable` — lending rules, not raw array |
| Inheritance       | — (`Book` is a separate entity, not a subclass)                        |
| Polymorphism      | —                                                                      |

**Problem:** `Book` has title/author. `Library` can add books, lend, return, list available.

### Function-based

```javascript
function Book(title, author) {
  this.title = title;
  this.author = author;
  this.isAvailable = true;
}

function createLibrary() {
  const books = []; // [Encapsulation]

  return {
    addBook(book) {
      books.push(book);
    },
    lend(title) {
      // [Abstraction] enforces availability rules
      const book = books.find((b) => b.title === title && b.isAvailable);
      if (!book) return null;
      book.isAvailable = false;
      return book;
    },
    returnBook(title) {
      const book = books.find((b) => b.title === title);
      if (book) book.isAvailable = true;
    },
    listAvailable() {
      return books
        .filter((b) => b.isAvailable)
        .map((b) => `${b.title} by ${b.author}`);
    },
  };
}

const lib = createLibrary();
lib.addBook(new Book("Clean Code", "Robert Martin"));
lib.lend("Clean Code");
console.log(lib.listAvailable()); // []
```

### Class-based

```javascript
class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
    this.isAvailable = true;
  }
}

class Library {
  #books = []; // [Encapsulation]

  addBook(book) {
    this.#books.push(book);
  }

  lend(title) {
    // [Abstraction]
    const book = this.#books.find((b) => b.title === title && b.isAvailable);
    if (!book) return null;
    book.isAvailable = false;
    return book;
  }

  returnBook(title) {
    const book = this.#books.find((b) => b.title === title);
    if (book) book.isAvailable = true;
  }

  listAvailable() {
    return this.#books
      .filter((b) => b.isAvailable)
      .map((b) => `${b.title} by ${b.author}`);
  }
}
```

### Why this pattern?

Libraries (and inventory systems) need **business rules** in one place: can't lend an unavailable book, must track availability without exposing the full catalog.

### Benefits

- **Encapsulation** — catalog is private; only intentional operations mutate it
- **Abstraction** — `lend("Clean Code")` vs manual find + flag flip
- **Composition** — `Book` is data; `Library` is service (not inheritance)

### Pros & cons (this problem)

|               | `createLibrary()` + `Book` constructor                           | `class Library` + `class Book`              |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **Pros**      | Book stays simple POJO; library is factory                       | Both entities are first-class types         |
| **Cons**      | `Book` fields are public — can set `isAvailable` outside library | Slightly more structure for interview scope |
| **Pick when** | Anemic data + service object pattern                             | Full OOP domain model                       |

**Composition note:** `Library` **has** books; `Book` doesn't extend `Library` — prefer has-a over is-a here.

---

## 12. Compare both styles — interview summary

### Four pillars — function vs class (side by side)

| Pillar            | Function-based                   | Class-based                          | Best example in this file |
| ----------------- | -------------------------------- | ------------------------------------ | ------------------------- |
| **Encapsulation** | Closure (`let balance`)          | `#private` fields                    | #1 Bank account           |
| **Abstraction**   | Returned object API              | Public methods + hidden `#` helpers  | #5 Stack, #10 Checkout    |
| **Inheritance**   | `Object.create` + `Parent.call`  | `extends` + `super()`                | #3 Person → Employee      |
| **Polymorphism**  | Prototype override / duck typing | Method override / strategy injection | #4 Shapes, #10 Payment    |

### Master cheat sheet — which problem teaches which pillar?

| #   | Problem           |  E  |  A  |  I  |  P  |
| --- | ----------------- | :-: | :-: | :-: | :-: |
| 1   | Bank account      |  ✓  |  ✓  |     |     |
| 2   | Counter           |  ✓  |  ✓  |     |     |
| 3   | Person → Employee |     |  ✓  |  ✓  |  ✓  |
| 4   | Shapes / area     |     |  ✓  |  ✓  |  ✓  |
| 5   | Stack             |  ✓  |  ✓  |     |     |
| 6   | Vehicle factory   |     |  ✓  |  ✓  |  ✓  |
| 7   | Event emitter     |  ✓  |  ✓  |     |     |
| 8   | Singleton config  |  ✓  |  ✓  |     |     |
| 9   | Todo list         |  ✓  |  ✓  |     |     |
| 10  | Payment strategy  |     |  ✓  |     |  ✓  |
| 11  | Library lending   |  ✓  |  ✓  |     |     |

_E = Encapsulation · A = Abstraction · I = Inheritance · P = Polymorphism_

### Style comparison — with real-world examples

| Topic                 | Function-based                | Class-based                   | Real-world example                              |
| --------------------- | ----------------------------- | ----------------------------- | ----------------------------------------------- |
| **Privacy**           | Closure (`let balance`)       | `#private` fields             | Module-scoped config vs `class Config`          |
| **Inheritance**       | Manual prototype linking      | `extends` / `super`           | Polyfill patterns vs DOM element subclasses     |
| **No `new` required** | Factory functions yes         | Class usually needs `new`     | `createStore()` in catalog SPA vs `new Error()` |
| **`instanceof`**      | Works with constructors       | Works with classes            | `arr instanceof Array`                          |
| **Memory**            | Methods on prototype (shared) | Methods on prototype (shared) | Both share one `push` on `Stack.prototype`      |
| **Readability**       | Verbose inheritance           | Familiar OOP syntax           | Legacy jQuery plugins vs TS service classes     |
| **React modern**      | Hooks / factories common      | Less common for components    | `useReducer` vs rare class components           |

### When to use which — decision guide

```
Need private state only?        → Factory + closure (#1, #2)
Need inheritance tree?          → class extends (#3, #4) OR prototype chain
Need swap behavior at runtime?  → Composition / strategy (#10) — not inheritance
Need single global instance?    → IIFE singleton (#8)
Interview says "no class"?      → Factory + prototype
Interview says "use OOP"?       → class + #private + extends
```

### When interviewer says "without class"

Use:

- Factory + closure for encapsulation
- Constructor + `prototype` for shared methods and inheritance
- IIFE module for singleton

### When interviewer says "use class"

Use:

- `extends` / `super` for inheritance
- `#fields` for privacy
- `static` for factories and utilities
- Arrow class fields if passing methods as callbacks

### Live-coding template (function)

```javascript
function MyType(arg) {
  this.arg = arg;
}
MyType.prototype.method = function () {
  return this.arg;
};
```

### Live-coding template (class)

```javascript
class MyType {
  constructor(arg) {
    this.arg = arg;
  }
  method() {
    return this.arg;
  }
}
```

---

## Practice problems (solve both ways)

| #   | Problem                              |  E  |  A  |  I  |  P  |
| --- | ------------------------------------ | :-: | :-: | :-: | :-: |
| 1   | Shopping cart with add/remove/total  |  ✓  |  ✓  |     |     |
| 2   | Animal → Dog → Bulldog chain         |     |  ✓  |  ✓  |  ✓  |
| 3   | Temperature converter C↔F            |  ✓  |  ✓  |     |     |
| 4   | Rate limiter (max N calls/sec)       |  ✓  |  ✓  |     |     |
| 5   | HTML element builder (`div`, `span`) |  ✓  |  ✓  |  ✓  |  ✓  |
| 6   | Implement `bind` using closure       |  ✓  |     |     |     |
| 7   | Plugin system with `register`/`run`  |  ✓  |  ✓  |     |  ✓  |
| 8   | Deck of cards — shuffle, draw        |  ✓  |  ✓  |     |     |

---

## Related

- [01-javascript-oop-interview-guide.md](./01-javascript-oop-interview-guide.md)
- [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md)
- [Javascript/vanila-js/08-top-30 #30 EventEmitter](../Javascript/vanila-js/08-top-30-javascript-interview-problems.md)
