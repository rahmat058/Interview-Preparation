# Interview Questions — JavaScript OOP

Practice answers aloud. Each question has an **Interview Answer** and **Example**.

**Full guide:** [01-javascript-oop-interview-guide.md](./01-javascript-oop-interview-guide.md) · **Problems:** [02-class-vs-function-oop-problems.md](./02-class-vs-function-oop-problems.md)

---

## Fundamentals

### Q1. Is JavaScript object-oriented?

**Interview Answer:**

> Yes — it's **prototype-based** OOP. Objects inherit from other objects via the prototype chain. ES6 `class` is syntactic sugar over prototypes, not classical inheritance like Java.

---

### Q2. What are the four pillars of OOP? How does JS implement them?

| Pillar        | JavaScript                          |
| ------------- | ----------------------------------- |
| Encapsulation | `#private`, closures, modules       |
| Inheritance   | Prototype chain, `extends`          |
| Polymorphism  | Method overriding, duck typing      |
| Abstraction   | Base classes, TypeScript interfaces |

---

### Q3. What is `this` in JavaScript?

**Interview Answer:**

> `this` is determined by **call site** — how the function is invoked: method call, `new`, `call`/`apply`, or arrow (lexical `this`). Not by where the function is written.

```javascript
const obj = {
  name: "Alice",
  greet() {
    return this.name;
  },
};
obj.greet(); // 'Alice'
const fn = obj.greet;
fn(); // undefined (strict) — lost binding
obj.greet.call({ name: "Bob" }); // 'Bob'
```

---

## Prototypes

### Q4. What is the prototype chain?

**Interview Answer:**

> When you access `obj.prop`, JS looks on the object, then its `[[Prototype]]`, then that object's prototype, until `null`. It's delegation, not copying.

```javascript
const parent = { role: "user" };
const child = Object.create(parent);
child.name = "Alice";
child.role; // 'user' — found on parent
```

---

### Q5. Difference between `__proto__` and `prototype`?

**Interview Answer:**

> `prototype` exists on **constructor functions** — it's the object instances will link to. `__proto__` (use `getPrototypeOf`) is the actual link on **any object** to its parent.

```javascript
function Person() {}
const p = new Person();
Object.getPrototypeOf(p) === Person.prototype; // true
```

---

### Q6. What does `new` do?

**Interview Answer:**

> (1) Create empty object, (2) set `[[Prototype]]` to `Constructor.prototype`, (3) run constructor with `this` bound to object, (4) return object unless constructor returns its own object.

---

### Q7. What is `instanceof`?

**Interview Answer:**

> Checks if `Constructor.prototype` appears anywhere in the object's prototype chain.

```javascript
[] instanceof Array   // true
[] instanceof Object  // true
```

---

## ES6 Classes

### Q8. Class vs constructor function?

**Interview Answer:**

> Same under the hood — class methods live on `prototype`. Class gives `extends`/`super`, static methods, private `#fields`, and throws if called without `new`. Class bodies are in strict mode.

---

### Q9. Why must `super()` be called first in a child constructor?

**Interview Answer:**

> `this` doesn't exist until parent constructor runs. `super()` initializes the parent part of the object before you assign child properties.

```javascript
class Child extends Parent {
  constructor(name) {
    super(); // required first
    this.name = name;
  }
}
```

---

### Q10. Static vs instance methods?

**Interview Answer:**

> Static methods live on the class (`Employee.create()`), not instances. Used for factories and utilities that don't need instance state.

```javascript
class MathUtil {
  static clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }
}
MathUtil.clamp(15, 0, 10); // 10
```

---

### Q11. Private fields `#` — how do they work?

**Interview Answer:**

> True language-level privacy — only accessible inside class body. Stronger than `_convention` or closures for class-based APIs.

```javascript
class Wallet {
  #balance = 0;
  deposit(n) {
    this.#balance += n;
  }
  get balance() {
    return this.#balance;
  }
}
```

---

## Encapsulation

### Q12. How do you hide data in JavaScript?

**Interview Answer:**

> Three ways: (1) private `#fields`, (2) closure module pattern, (3) WeakMap keyed by instance. ES modules also hide exports.

```javascript
function createAccount(initial) {
  let balance = initial;
  return {
    getBalance: () => balance,
    deposit: (n) => {
      balance += n;
    },
  };
}
```

---

### Q13. Closure vs private field — when to use which?

|              | Closure module                   | `#private`              |
| ------------ | -------------------------------- | ----------------------- |
| **Best for** | Factory functions, few instances | Class-based APIs        |
| **Memory**   | New closure per instance         | Single class definition |

---

## Inheritance & Composition

### Q14. Inheritance vs composition?

**Interview Answer:**

> Inheritance is "is-a" — `Dog extends Animal`. Composition is "has-a" — `Car has Engine`. Prefer composition for flexibility; deep inheritance trees are hard to maintain. React moved from class inheritance to hooks/composition.

---

### Q15. Implement inheritance without `class`.

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = () => "sound";

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function () {
  return `${this.name} barks`;
};
```

---

### Q16. What is the fragile base class problem?

**Interview Answer:**

> Changing a parent class breaks children in unexpected ways. Composition limits blast radius — swap a behavior object instead of overriding deep hierarchy.

---

## Polymorphism

### Q17. What is polymorphism in JS?

**Interview Answer:**

> Different classes implement the same method name; caller treats them uniformly. Also duck typing — if object has `.render()`, use it regardless of class.

```javascript
function renderAll(items) {
  items.forEach((item) => item.render());
}
```

---

### Q18. Method overriding example?

```javascript
class Shape {
  area() {
    throw new Error("implement area");
  }
}
class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }
  area() {
    return this.side ** 2;
  }
}
```

---

## Design Patterns

### Q19. Factory pattern — why use it?

**Interview Answer:**

> Centralize object creation — caller asks for `createUser('admin')` without knowing concrete class. Easy to add new types without changing call sites (Open/Closed).

```javascript
function createNotification(type, message) {
  const types = {
    email: (msg) => ({ channel: "email", msg }),
    sms: (msg) => ({ channel: "sms", msg }),
  };
  return types[type](message);
}
```

---

### Q20. Singleton — use case and caution?

**Interview Answer:**

> One shared instance — config, connection pool, app bus. Caution: hard to test, hidden global state. In frontend, prefer module singleton (`export const store`).

---

### Q21. Observer pattern in frontend?

**Interview Answer:**

> Subject notifies subscribers on change — DOM events, Redux subscribe, EventEmitter, React `useEffect` on props. Decouples publisher from listeners.

---

### Q22. Strategy pattern?

**Interview Answer:**

> Inject interchangeable algorithm — payment method, sort strategy, validation rules — without `if/else` chains in the main class.

---

## SOLID & Architecture

### Q23. Explain Single Responsibility Principle.

**Interview Answer:**

> A class/module should have one reason to change. Split `UserComponent` that fetches, validates, and renders into separate concerns.

---

### Q24. Dependency Injection — why?

**Interview Answer:**

> Pass dependencies in constructor instead of hard-coding — enables testing with mocks and swapping implementations.

```javascript
class ReportService {
  constructor(api) {
    this.api = api;
  }
  fetch() {
    return this.api.get("/report");
  }
}
// test: new ReportService(mockApi)
```

---

### Q25. OOP vs functional in modern frontend?

**Interview Answer:**

> React favors functional components + hooks. OOP still matters for domain models, class-based libraries (Three.js, Chart.js), Node services, and understanding prototypes in debugging. Use the right paradigm per layer.

---

## Output / Trap Questions

### Q26. What prints?

```javascript
class Parent {
  greet() {
    return "parent";
  }
}
class Child extends Parent {
  greet() {
    return "child";
  }
}
const c = new Child();
console.log(c.greet());
```

**Answer:** `'child'` — overridden method on `Child.prototype`.

---

### Q27. What prints?

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return this.name;
};
const p = { name: "Hacked" };
p.__proto__ = Person.prototype;
console.log(p.getName());
```

**Answer:** `'Hacked'` — method uses `this.name` from `p`, not from `new Person`.

---

### Q28. Arrow method in class — `this` behavior?

```javascript
class Timer {
  count = 0;
  inc = () => {
    this.count++;
  };
}
const t = new Timer();
const fn = t.inc;
fn();
console.log(t.count);
```

**Answer:** `1` — arrow class field captures lexical `this` from instance.

---

### Q29. Can you call a class constructor without `new`?

**Interview Answer:**

> Class constructors throw if called without `new`. Plain constructor functions can be called without `new` (bad practice — `this` is global or undefined).

---

### Q30. `Object.create(null)` — why?

**Interview Answer:**

> Creates object with **no prototype** — pure dictionary, no inherited `toString`/`hasOwnProperty`. Used for safe map-like objects.

```javascript
const dict = Object.create(null);
dict.toString; // undefined — no Object.prototype pollution
```

---

## Class vs function coding problems

Full solutions (both styles): [02-class-vs-function-oop-problems.md](./02-class-vs-function-oop-problems.md)

### Q31. Implement BankAccount — class vs factory?

**Interview Answer:**

> Factory + closure hides `balance` without `new`. Class uses `#balance` for language-enforced privacy. Both expose `deposit`, `withdraw`, `getBalance` only.

### Q32. Implement Person → Employee inheritance without `class`?

**Interview Answer:**

> `Employee` calls `Person.call(this, name)`, set `Employee.prototype = Object.create(Person.prototype)`, override `introduce` on prototype.

### Q33. When would you choose factory over `new`?

**Interview Answer:**

> When you don't need `instanceof`, want closure privacy without `#`, or return plain objects/APIs (module pattern). Factories avoid forgetting `new`.

### Q34. Implement EventEmitter both ways?

**Interview Answer:**

> Same `Map` of event → `Set` of handlers. Function returns `{ on, off, emit }`. Class uses `#handlers` private field. See problem #7 in [02](./02-class-vs-function-oop-problems.md).

### Q35. Singleton — IIFE vs class?

**Interview Answer:**

> IIFE module is simplest in JS — one closure, no `getInstance`. Class singleton needs static `#instance` guard. Both ensure single shared state.

### Q36. Polymorphism without inheritance?

**Interview Answer:**

> Duck typing — any object with `area()` works in `totalArea(shapes)`. No shared parent required; composition over class hierarchy.

### Q37. Convert this constructor to class?

```javascript
function Stack() {
  this.items = [];
}
Stack.prototype.push = function (v) {
  this.items.push(v);
};
Stack.prototype.pop = function () {
  return this.items.pop();
};
```

```javascript
class Stack {
  #items = [];
  push(v) {
    this.#items.push(v);
  }
  pop() {
    return this.#items.pop();
  }
}
```

### Q38. Strategy pattern — function vs class?

**Interview Answer:**

> Function: strategy is `{ charge(amount) }` object passed to `createCheckout(strategy)`. Class: `new Checkout(new StripeStrategy())`. Same dependency injection idea.

### Q39. What's shared between both styles for methods?

**Interview Answer:**

> Methods on `Constructor.prototype` or class methods (non-static) both live on the prototype — instances share one function object per method, not per instance.

### Q40. Live task: TodoList in 10 minutes — which style?

**Interview Answer:**

> Use whichever interviewer requests. Class if they want `extends` later; factory if they emphasize privacy without `#`. Start with `add`, `remove`, `toggle`, `getAll`.

---

## What Interviewers Look For

| Criteria                   | Strong signal                                   |
| -------------------------- | ----------------------------------------------- |
| **Prototype mental model** | Explains `new` steps without googling           |
| **Pragmatism**             | Composition over deep inheritance               |
| **Encapsulation**          | Knows `#`, closures, module scope               |
| **`this` mastery**         | bind, arrow, `call`, class field arrows         |
| **Patterns**               | Names factory, observer, strategy with real use |

---

## Quick revision

1. Four pillars in JS
2. `new` keyword steps
3. Prototype chain lookup
4. `extends` + `super()`
5. `#private` vs closure
6. Composition vs inheritance — one example each
7. `instanceof` vs `typeof`
8. Singleton + observer — one use case each
9. Bank account + Employee inheritance — **both** function and class ([02](./02-class-vs-function-oop-problems.md))

---

## Related

- [02-class-vs-function-oop-problems.md](./02-class-vs-function-oop-problems.md) — 11 dual-style problems
- [Javascript/vanila-js/kpmg-round-1-vanilla-javascript-interview.md](../Javascript/vanila-js/kpmg-round-1-vanilla-javascript-interview.md) — prototypes
- [Javascript/vanila-js/06-shallow-deep-copy-closures-hoisting-memoize.md](../Javascript/vanila-js/06-shallow-deep-copy-closures-hoisting-memoize.md) — closures
- [Javascript/vanila-js/08-top-30-javascript-interview-problems.md](../Javascript/vanila-js/08-top-30-javascript-interview-problems.md) — EventEmitter (#30)
