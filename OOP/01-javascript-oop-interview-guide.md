---
title: "JavaScript OOP — Interview Guide"
description: "Encapsulation, inheritance, polymorphism, prototypes, ES6 classes, composition, SOLID — with examples."
tags: ["javascript", "oop", "prototype", "class", "inheritance", "interview"]
level: "Intermediate to Senior"
---

# JavaScript OOP — Interview Guide

JavaScript is **multi-paradigm** — OOP is built on **prototypes**, not classical classes (though `class` syntax exists). Senior interviews test whether you understand **what happens under the hood**.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Four pillars of OOP in JavaScript](#p1) |
| <span id="i2"></span>2 | [Objects as the foundation](#p2) |
| <span id="i3"></span>3 | [Constructor functions](#p3) |
| <span id="i4"></span>4 | [Prototype & prototype chain](#p4) |
| <span id="i5"></span>5 | [What `new` does — step by step](#p5) |
| <span id="i6"></span>6 | [ES6 classes](#p6) |
| <span id="i7"></span>7 | [Inheritance — extends & super](#p7) |
| <span id="i8"></span>8 | [Encapsulation patterns](#p8) |
| <span id="i9"></span>9 | [Polymorphism](#p9) |
| <span id="i10"></span>10 | [Abstraction](#p10) |
| <span id="i11"></span>11 | [Composition vs inheritance](#p11) |
| <span id="i12"></span>12 | [Design patterns](#p12) |
| <span id="i13"></span>13 | [SOLID in JavaScript](#p13) |
| <span id="i14"></span>14 | [Common interview traps](#p14) |

---

<a id="p1"></a>

## 1. Four pillars of OOP in JavaScript

| Pillar            | In JavaScript                                                    |
| ----------------- | ---------------------------------------------------------------- |
| **Encapsulation** | Hide internal state — closures, private `#fields`, WeakMap       |
| **Inheritance**   | Prototype chain — `extends`, `Object.create`                     |
| **Polymorphism**  | Same method name, different behavior per class / duck typing     |
| **Abstraction**   | Hide complexity — interfaces via JSDoc/TS, abstract base classes |

**Interview answer:**

> JS OOP is prototype-based. Classes are syntax sugar. I use encapsulation via private fields or modules, inheritance sparingly (prefer composition), and polymorphism through shared method contracts.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Objects as the foundation

```javascript
const user = {
  name: "Alice",
  role: "admin",
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};

user.greet(); // "Hi, I'm Alice"
```

**Method shorthand** and **`this`** — `this` depends on **how** the function is called, not where it's defined.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Constructor functions

Pre-ES6 pattern — still asked in interviews.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};

const alice = new Person("Alice", 30);
alice.greet(); // "Hi, I'm Alice"
```

**Rules:**

- Capitalize constructor name by convention
- Methods go on `Constructor.prototype` (shared, memory-efficient)
- Always call with `new` (or use class syntax)

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Prototype & prototype chain

```
alice → Person.prototype → Object.prototype → null
```

| Property         | Where                       |
| ---------------- | --------------------------- |
| `alice.name`     | Own property on instance    |
| `alice.greet`    | Found on `Person.prototype` |
| `alice.toString` | Found on `Object.prototype` |

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // inherit instance props
  this.breed = breed;
}

// Link prototypes
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return `${this.name} barks`;
};

const rex = new Dog("Rex", "Lab");
rex.speak(); // "Rex barks"
console.log(rex instanceof Dog); // true
console.log(rex instanceof Animal); // true
```

### `__proto__` vs `prototype`

|               | `prototype`                   | `__proto__` / `getPrototypeOf`  |
| ------------- | ----------------------------- | ------------------------------- |
| **On**        | Functions (constructor)       | All objects                     |
| **Points to** | Object instances will link to | Actual prototype of this object |

```javascript
function Foo() {}
const f = new Foo();
Object.getPrototypeOf(f) === Foo.prototype; // true
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. What `new` does — step by step

**Interview answer — memorize this:**

1. Create empty object
2. Set its `[[Prototype]]` to `Constructor.prototype`
3. Execute constructor with `this` = new object
4. Return object (unless constructor returns own object)

```javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

function Car(model) {
  this.model = model;
}
Car.prototype.drive = () => "vroom";

const car = myNew(Car, "Sedan");
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. ES6 classes

Syntactic sugar over prototypes — **not** classical OOP from Java/C#.

```javascript
class Employee {
  static company = "Acme Inc";

  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  describe() {
    return `${this.name} earns $${this.salary}`;
  }

  static createIntern(name) {
    return new Employee(name, 40000);
  }
}

const emp = new Employee("Alice", 90000);
Employee.company; // 'Acme Inc'
Employee.createIntern("Bob");
```

**Hoisting:** Class declarations are hoisted but in **TDZ** until defined (unlike function declarations).

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Inheritance — extends & super

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // must call before using `this`
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`;
  }

  info() {
    return `${super.speak()} (${this.breed})`;
  }
}

const d = new Dog("Rex", "Lab");
d.speak(); // "Rex barks"
d.info(); // "Rex makes a sound (Lab)"
```

### Private fields `#` (ES2022)

```javascript
class BankAccount {
  #balance = 0;

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  withdraw(amount) {
    if (amount <= this.#balance) this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount();
acc.deposit(100);
// acc.#balance — SyntaxError: private
acc.getBalance(); // 100
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Encapsulation patterns

### Pattern 1 — Private fields (modern)

```javascript
class User {
  #passwordHash;
  constructor(email, passwordHash) {
    this.email = email;
    this.#passwordHash = passwordHash;
  }
  verify(hash) {
    return this.#passwordHash === hash;
  }
}
```

### Pattern 2 — Closure module (classic)

```javascript
function createCounter() {
  let count = 0; // private via closure
  return {
    increment() {
      count++;
    },
    getCount() {
      return count;
    },
  };
}
```

### Pattern 3 — WeakMap privacy

```javascript
const privateData = new WeakMap();

class SecretHolder {
  constructor(secret) {
    privateData.set(this, { secret });
  }
  reveal() {
    return privateData.get(this).secret;
  }
}
```

**Interview answer:**

> True private state in JS: `#fields`, closures, or WeakMap. Convention `_prefix` is not enforced.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Polymorphism

**Same interface, different implementations** — caller doesn't need to know concrete type.

```javascript
class Circle {
  constructor(r) {
    this.r = r;
  }
  area() {
    return Math.PI * this.r ** 2;
  }
}

class Rectangle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  area() {
    return this.w * this.h;
  }
}

function totalArea(shapes) {
  return shapes.reduce((sum, shape) => sum + shape.area(), 0);
}

totalArea([new Circle(2), new Rectangle(3, 4)]);
```

**Duck typing:** "If it walks like a duck and quacks like a duck…"

```javascript
function renderDrawable(item) {
  item.draw(); // any object with draw() works
}
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Abstraction

JavaScript has no `interface` keyword — use **TypeScript** or document contracts.

```javascript
// Abstract base — prevent direct instantiation
class PaymentProcessor {
  constructor() {
    if (new.target === PaymentProcessor) {
      throw new Error("Abstract class — use subclass");
    }
  }

  process(amount) {
    throw new Error("process() must be implemented");
  }
}

class StripeProcessor extends PaymentProcessor {
  process(amount) {
    return `Stripe charged $${amount}`;
  }
}

class PayPalProcessor extends PaymentProcessor {
  process(amount) {
    return `PayPal charged $${amount}`;
  }
}
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Composition vs inheritance

**Interview answer:**

> Favor **composition** ("has-a") over deep **inheritance** ("is-a") trees. Inheritance couples child to parent; composition swaps behaviors at runtime.

### Inheritance problem — fragile base class

```javascript
// Deep hierarchy gets hard to change
class FlyingBird {
  fly() {}
}
class SwimmingBird extends FlyingBird {
  swim() {}
} // Penguin problem?
```

### Composition solution

```javascript
const canFly = {
  fly() {
    return "flying";
  },
};
const canSwim = {
  swim() {
    return "swimming";
  },
};

function createDuck() {
  return {
    name: "Duck",
    ...canFly,
    ...canSwim,
  };
}

function createPenguin() {
  return {
    name: "Penguin",
    ...canSwim,
  };
}
```

### Class mixin pattern

```javascript
const Timestamped = (Base) =>
  class extends Base {
    createdAt = new Date();
  };

class Product {
  constructor(name) {
    this.name = name;
  }
}

class TimestampedProduct extends Timestamped(Product) {}

new TimestampedProduct("Mug").createdAt; // Date
```

**React tie-in:** Hooks + composition replaced class inheritance for most UI logic.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Design patterns

### Factory — create objects without `new` at call site

```javascript
function createEmployee(type, name) {
  switch (type) {
    case "intern":
      return { name, salary: 40000, level: "junior" };
    case "senior":
      return { name, salary: 120000, level: "senior" };
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}
```

### Singleton — one shared instance

```javascript
class AppConfig {
  static #instance;

  constructor() {
    if (AppConfig.#instance) return AppConfig.#instance;
    this.theme = "light";
    AppConfig.#instance = this;
  }

  static getInstance() {
    return new AppConfig();
  }
}

const a = AppConfig.getInstance();
const b = AppConfig.getInstance();
console.log(a === b); // true
```

### Observer / Pub-Sub (EventEmitter)

```javascript
class EventBus {
  #handlers = new Map();

  on(event, fn) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, new Set());
    this.#handlers.get(event).add(fn);
    return () => this.#handlers.get(event).delete(fn);
  }

  emit(event, data) {
    this.#handlers.get(event)?.forEach((fn) => fn(data));
  }
}
```

Same idea as `createStore().subscribe()` in vanilla-js catalog.

### Strategy — swap algorithms at runtime

```javascript
class Checkout {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  pay(amount) {
    return this.paymentStrategy.charge(amount);
  }
}

const stripe = { charge: (n) => `Stripe: $${n}` };
const paypal = { charge: (n) => `PayPal: $${n}` };

new Checkout(stripe).pay(99);
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. SOLID in JavaScript

| Principle                   | Meaning                                     | JS example                                         |
| --------------------------- | ------------------------------------------- | -------------------------------------------------- |
| **S** Single Responsibility | One reason to change                        | Split `UserAPI` from `UserValidator`               |
| **O** Open/Closed           | Open for extension, closed for modification | Strategy pattern for payment types                 |
| **L** Liskov Substitution   | Subclass usable wherever parent is          | `Dog extends Animal` must honor `speak()` contract |
| **I** Interface Segregation | Small focused interfaces                    | Split fat class into `Readable` + `Writable`       |
| **D** Dependency Inversion  | Depend on abstractions                      | Inject `logger` interface, not `console`           |

```javascript
// Dependency injection — testable
class OrderService {
  constructor(api, logger) {
    this.api = api;
    this.logger = logger;
  }
  async place(order) {
    this.logger.info("Placing order");
    return this.api.post("/orders", order);
  }
}
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Common interview traps

### Trap 1 — `this` in class methods passed as callback

```javascript
class Counter {
  count = 0;
  inc() {
    this.count++;
  }
}

const c = new Counter();
const fn = c.inc;
// fn() — TypeError or wrong this in strict mode

// Fix: arrow class field or bind
class CounterFixed {
  count = 0;
  inc = () => {
    this.count++;
  };
}
```

### Trap 2 — Overriding constructor without `super`

```javascript
class Child extends Parent {
  constructor() {
    // super() must be called first
    this.x = 1; // ReferenceError
  }
}
```

### Trap 3 — `typeof` vs `instanceof`

```javascript
typeof []           // 'object'
Array.isArray([])   // true
[] instanceof Array // true
```

### Trap 4 — Classes are not hoisted like functions

```javascript
// const c = new MyClass() // TDZ error
class MyClass {}
```

---

## Quick reference

| Task                   | Approach                      |
| ---------------------- | ----------------------------- |
| Share methods          | `Prototype` or class methods  |
| Inherit                | `extends` + `super()`         |
| Private state          | `#field`, closure, WeakMap    |
| Check type             | `instanceof`, `Array.isArray` |
| Avoid deep inheritance | Composition / mixins          |
| One instance           | Singleton                     |
| Swap behavior          | Strategy pattern              |

---

## Map to repo

| Concept                    | See                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| Prototype chain            | [KPMG vanilla JS](../Javascript/vanila-js/kpmg-round-1-vanilla-javascript-interview.md)             |
| Closure encapsulation      | [vanila-js/06](../Javascript/vanila-js/06-shallow-deep-copy-closures-hoisting-memoize.md)           |
| Observer pattern           | [vanila-js/08 #30 EventEmitter](../Javascript/vanila-js/08-top-30-javascript-interview-problems.md) |
| Functional vs OOP state    | `Projects/vanilla-js/02-catalog-spa` store                                                          |
| Class vs function problems | [02-class-vs-function-oop-problems.md](./02-class-vs-function-oop-problems.md)                      |


<p><a href="#i14">Back to index</a></p>
