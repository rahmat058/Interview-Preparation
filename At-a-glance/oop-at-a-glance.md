---
title: "JavaScript OOP At a Glance — Four Pillars"
description: "Encapsulation, Abstraction, Inheritance, Polymorphism in JavaScript — class + function examples, one unified demo, interview answers."
tags:
  [
    "javascript",
    "oop",
    "encapsulation",
    "inheritance",
    "polymorphism",
    "abstraction",
    "at-a-glance",
    "interview",
  ]
level: "Mid-Level to Senior (4–5+ years)"
format: "Four Pillars + Examples"
---

# JavaScript OOP At a Glance — Four Pillars

Quick reference for **JavaScript OOP** interviews — focused on the **four pillars** with **proper examples** in both **class** and **function** style.

> JavaScript OOP is **prototype-based**. `class` is syntax sugar. Know **both** styles — interviewers often ask "with class" or "without class."

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Four pillars overview](#p1) |
| <span id="i2"></span>2 | [Encapsulation](#p2) |
| <span id="i3"></span>3 | [Abstraction](#p3) |
| <span id="i4"></span>4 | [Inheritance](#p4) |
| <span id="i5"></span>5 | [Polymorphism](#p5) |
| <span id="i6"></span>6 | [All four pillars — one example](#p6) |
| <span id="i7"></span>7 | [Prototype chain (under the hood)](#p7) |
| <span id="i8"></span>8 | [Composition vs inheritance](#p8) |
| <span id="i9"></span>9 | [Quick revision](#p9) |

---

<a id="p1"></a>

## 1. Four pillars overview

| Pillar            | One line                                        | JavaScript tools                            |
| ----------------- | ----------------------------------------------- | ------------------------------------------- |
| **Encapsulation** | Hide internal state; expose safe public methods | `#private`, closure, WeakMap, modules       |
| **Abstraction**   | Show _what_ it does, hide _how_ it works        | Public API, factory, base class contract    |
| **Inheritance**   | Child reuses / extends parent behavior          | `extends`, prototype chain, `Object.create` |
| **Polymorphism**  | Same call, different behavior per type          | Method override, duck typing, strategy      |

### Interview answer (all four)

> In JavaScript, encapsulation uses private fields or closures, inheritance uses the prototype chain via `extends`, polymorphism is method overriding or duck typing on a shared interface, and abstraction is a simple public API hiding implementation details. I prefer composition over deep inheritance in React and modern JS.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Encapsulation

**Definition:** Bundle data + behavior together and **hide internal state** so outside code cannot break invariants.

**Why:** Without it, anyone can corrupt your object:

```javascript
// ❌ No encapsulation
const account = { balance: 100 };
account.balance = -9999; // invalid
account.balance = "hello"; // wrong type
```

---

### Class way — private `#fields` (ES2022)

```javascript
class BankAccount {
  #balance = 0; // truly private — SyntaxError if accessed outside

  constructor(owner) {
    this.owner = owner;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount("Alice");
acc.deposit(500);
acc.withdraw(100);
acc.getBalance(); // 400
// acc.#balance  → SyntaxError
// acc.balance = 999 → only sets public prop, not real balance
```

---

### Function way — closure (classic JS)

```javascript
function createBankAccount(owner) {
  let balance = 0; // private — closed over, not on returned object

  return {
    owner,
    deposit(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      balance += amount;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
    },
    getBalance() {
      return balance;
    },
  };
}

const acc = createBankAccount("Bob");
acc.deposit(200);
acc.getBalance(); // 200
// no way to read or write `balance` directly
```

---

### Built-in / module way

```javascript
// ES modules — file scope is private
// account.js
let balance = 0; // not exported = encapsulated in module

export function deposit(amount) {
  balance += amount;
}
export function getBalance() {
  return balance;
}
```

---

### Encapsulation — interview answer

> Encapsulation hides state behind a public API. In modern JS I use `#private` fields; in plain JS I use closures or modules. Underscore `_prefix` is convention only — not enforced.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Abstraction

**Definition:** Expose a **simple interface**; hide complex implementation. Caller uses _what_, not _how_.

**Real-life analogy:** You press **Start** on a car — you don't manage fuel injection manually.

---

### Class way — hide complexity behind methods

```javascript
class EmailService {
  #apiKey;
  #baseUrl;

  constructor(apiKey) {
    this.#apiKey = apiKey;
    this.#baseUrl = "https://api.mail.com";
  }

  // Public — WHAT the user needs
  sendWelcomeEmail(user) {
    return this.#send({
      to: user.email,
      subject: "Welcome!",
      body: this.#buildWelcomeTemplate(user.name),
    });
  }

  // Private — HOW it works (hidden)
  #buildWelcomeTemplate(name) {
    return `<h1>Hi ${name}</h1><p>Thanks for joining.</p>`;
  }

  #send(payload) {
    // fetch, retry, logging — caller never sees this
    console.log(`POST ${this.#baseUrl}/send`, payload);
    return { ok: true, id: "msg-123" };
  }
}

const mail = new EmailService("secret-key");
mail.sendWelcomeEmail({ email: "a@b.com", name: "Alice" });
// mail.#send() → SyntaxError — implementation hidden
```

---

### Function way — factory returns public API only

```javascript
function createEmailService(apiKey) {
  const baseUrl = "https://api.mail.com";

  function buildWelcomeTemplate(name) {
    return `<h1>Hi ${name}</h1>`;
  }

  function send(payload) {
    console.log(`POST ${baseUrl}/send`, payload);
    return { ok: true };
  }

  // Only this object is returned — inner functions are hidden
  return {
    sendWelcomeEmail(user) {
      return send({
        to: user.email,
        subject: "Welcome!",
        body: buildWelcomeTemplate(user.name),
      });
    },
  };
}
```

---

### Abstraction vs encapsulation

|          | Encapsulation                         | Abstraction                                |
| -------- | ------------------------------------- | ------------------------------------------ |
| Focus    | **Protect data**                      | **Simplify usage**                         |
| Question | "Can outsiders touch internal state?" | "Does caller need to know internals?"      |
| Example  | Private `#balance`                    | `sendWelcomeEmail()` hides HTTP + template |

You usually use **both together**.

---

### Abstraction — interview answer

> Abstraction is a simple public surface over complex logic — like `payment.charge(amount)` hiding Stripe API calls, retries, and idempotency keys. Encapsulation protects state; abstraction reduces cognitive load.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Inheritance

**Definition:** Child class/object **reuses and extends** parent behavior without duplicating code.

**JavaScript mechanism:** Prototype chain — not copying fields like classical Java.

---

### Class way — `extends` + `super`

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
    return `${this.name} barks`; // override parent
  }

  info() {
    return `${this.breed} dog named ${this.name}`;
  }
}

class Cat extends Animal {
  speak() {
    return `${this.name} meows`;
  }
}

const dog = new Dog("Rex", "Lab");
dog.speak(); // "Rex barks"
dog.info(); // "Lab dog named Rex"
```

---

### Function way — constructor + prototype chain

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // inherit instance properties
  this.breed = breed;
}

// Link prototypes — Dog inherits Animal methods
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return `${this.name} barks`;
};

const rex = new Dog("Rex", "Lab");
rex.speak(); // "Rex barks"
rex instanceof Dog; // true
rex instanceof Animal; // true
```

---

### Built-in — `Object.create`

```javascript
const animal = {
  speak() {
    return `${this.name} makes a sound`;
  },
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.speak = function () {
  return `${this.name} barks`;
};

dog.speak(); // "Rex barks"
```

---

### Inheritance — interview answer

> Inheritance in JS is prototype delegation — child instances link to parent `prototype`. I use `extends` for an IS-A relationship (`Dog` is an `Animal`). For HAS-A (car has engine), use composition instead.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Polymorphism

**Definition:** **Same method call**, **different behavior** depending on the actual type — caller doesn't need `if/else` on type.

Two forms in JS:

1. **Subtype polymorphism** — override method in subclass
2. **Duck typing** — "if it has `.area()`, treat it as a shape"

---

### Class way — method overriding + shared caller

```javascript
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
  describe() {
    return `Circle (r=${this.radius})`;
  }
}

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
  describe() {
    return `Rectangle (${this.width}×${this.height})`;
  }
}

class Triangle {
  constructor(base, height) {
    this.base = base;
    this.height = height;
  }
  area() {
    return (this.base * this.height) / 2;
  }
  describe() {
    return `Triangle (b=${this.base}, h=${this.height})`;
  }
}

// Polymorphism — same loop, different behavior
function printAreas(shapes) {
  shapes.forEach((shape) => {
    console.log(`${shape.describe()} → area = ${shape.area().toFixed(2)}`);
  });
}

printAreas([new Circle(5), new Rectangle(4, 6), new Triangle(3, 8)]);
// Circle (r=5) → area = 78.54
// Rectangle (4×6) → area = 24.00
// Triangle (b=3, h=8) → area = 12.00
```

---

### Function way — duck typing (no class hierarchy)

```javascript
const shapes = [
  {
    kind: "circle",
    radius: 5,
    area() {
      return Math.PI * this.radius ** 2;
    },
  },
  {
    kind: "rectangle",
    width: 4,
    height: 6,
    area() {
      return this.width * this.height;
    },
  },
];

function totalArea(shapes) {
  return shapes.reduce((sum, s) => {
    if (typeof s.area !== "function") throw new Error("Not a shape");
    return sum + s.area();
  }, 0);
}

totalArea(shapes); // ~102.54
```

---

### Strategy pattern (polymorphism without inheritance)

```javascript
const paymentStrategies = {
  card: (amount) => `Charged $${amount} to card`,
  upi: (amount) => `UPI paid $${amount}`,
  wallet: (amount) => `Wallet debited $${amount}`,
};

function checkout(method, amount) {
  const pay = paymentStrategies[method];
  if (!pay) throw new Error("Unknown method");
  return pay(amount); // same call, different behavior
}

checkout("upi", 99); // "UPI paid $99"
checkout("wallet", 50); // "Wallet debited $50"
```

---

### Polymorphism — interview answer

> Polymorphism lets me call `shape.area()` without checking `instanceof`. JavaScript uses prototype overriding in classes or duck typing on a shared method name. Strategy objects are polymorphism without inheritance.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. All four pillars — one example

**Domain:** Notification system (email + SMS + push) — ties all pillars together.

```javascript
// [Abstraction] Simple public API: notify(user, message)
// [Encapsulation] Provider credentials hidden
// [Inheritance] BaseNotifier → EmailNotifier, SmsNotifier
// [Polymorphism] Same .send() call, different transport

class BaseNotifier {
  #providerName;

  constructor(providerName) {
    this.#providerName = providerName; // [Encapsulation]
  }

  // [Abstraction] Subclasses must implement; caller uses .send()
  send(user, message) {
    throw new Error("Subclasses must implement send()");
  }

  #log(result) {
    // [Encapsulation] internal logging hidden
    console.log(`[${this.#providerName}]`, result);
  }

  _deliver(user, message) {
    // protected-style helper for children
    const result = { to: user.contact, body: message, at: Date.now() };
    this.#log(result);
    return result;
  }
}

class EmailNotifier extends BaseNotifier {
  #apiKey; // [Encapsulation]

  constructor(apiKey) {
    super("Email");
    this.#apiKey = apiKey;
  }

  // [Polymorphism] + [Inheritance]
  send(user, message) {
    return this._deliver(
      { contact: user.email },
      `[Email via ${this.#apiKey.slice(0, 4)}***] ${message}`,
    );
  }
}

class SmsNotifier extends BaseNotifier {
  constructor() {
    super("SMS");
  }

  send(user, message) {
    return this._deliver({ contact: user.phone }, message.slice(0, 160));
  }
}

class PushNotifier extends BaseNotifier {
  constructor() {
    super("Push");
  }

  send(user, message) {
    return this._deliver({ contact: user.deviceId }, message);
  }
}

// [Polymorphism] — one function, many types
function notifyAll(notifiers, user, message) {
  return notifiers.map((n) => n.send(user, message));
}

const user = { email: "a@b.com", phone: "+91...", deviceId: "dev-1" };
const notifiers = [
  new EmailNotifier("sk_live_abc123"),
  new SmsNotifier(),
  new PushNotifier(),
];

notifyAll(notifiers, user, "Your order shipped!");
// Each notifier.send() behaves differently — polymorphism
// API keys hidden — encapsulation
// notifyAll only calls .send() — abstraction
// Email/SMS extend BaseNotifier — inheritance
```

### Function way — same idea without classes

```javascript
function createNotifier(type, config = {}) {
  const { apiKey = "" } = config;

  const senders = {
    email(user, message) {
      return { channel: "email", to: user.email, body: message };
    },
    sms(user, message) {
      return { channel: "sms", to: user.phone, body: message.slice(0, 160) };
    },
    push(user, message) {
      return { channel: "push", to: user.deviceId, body: message };
    },
  };

  const send = senders[type];
  if (!send) throw new Error("Unknown notifier");

  // [Encapsulation] apiKey closed over, not exposed
  return {
    send(user, message) {
      void apiKey; // used internally in real impl
      return send(user, message);
    },
  };
}

function notifyAll(notifiers, user, message) {
  return notifiers.map((n) => n.send(user, message));
}

notifyAll(
  [createNotifier("email", { apiKey: "secret" }), createNotifier("sms")],
  user,
  "Order shipped",
);
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Prototype chain (under the hood)

```
dog instance → Dog.prototype → Animal.prototype → Object.prototype → null
```

```javascript
class Dog extends Animal {}
const d = new Dog("Rex");

Object.getPrototypeOf(d) === Dog.prototype; // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true

d.hasOwnProperty("name"); // on instance
"speak" in d; // on prototype chain
```

### What `new` does (4 steps)

1. Create empty object
2. Set `[[Prototype]]` to `Constructor.prototype`
3. Run constructor with `this` = new object
4. Return object (unless constructor returns its own object)

### Interview answer

> `class` is sugar over prototypes. `new` links the instance to `Constructor.prototype`. `instanceof` walks that chain.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Composition vs inheritance

|              | Inheritance (`extends`)  | Composition (has-a)          |
| ------------ | ------------------------ | ---------------------------- |
| Relationship | IS-A (Dog is Animal)     | HAS-A (Car has Engine)       |
| Risk         | Deep fragile trees       | Slightly more boilerplate    |
| React        | Rarely extend components | Hooks, children, composition |

```javascript
// ✅ Composition — preferred for behavior reuse
class Car {
  constructor(engine) {
    this.engine = engine; // HAS-A
  }
  start() {
    return this.engine.start();
  }
}

class ElectricEngine {
  start() {
    return "Silent start";
  }
}

new Car(new ElectricEngine()).start(); // "Silent start"
```

### Interview answer

> Favor composition over inheritance — mix behaviors with objects and functions. Use `extends` only for true IS-A with stable hierarchies.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Quick revision

| Pillar            | Remember                    | JS tool                         |
| ----------------- | --------------------------- | ------------------------------- |
| **Encapsulation** | Hide state                  | `#private`, closure, module     |
| **Abstraction**   | Simple public API           | Methods, factory, base class    |
| **Inheritance**   | Reuse parent                | `extends`, prototype chain      |
| **Polymorphism**  | Same call, different result | Override, duck typing, strategy |

### 30-second spoken answer

> JavaScript OOP is prototype-based. Encapsulation hides state with private fields or closures. Abstraction exposes a clean API. Inheritance links objects through the prototype chain. Polymorphism lets me call the same method on different types. In React and modern code I prefer composition and small objects over deep class trees.

### Class vs function — when to use

| Use class                   | Use function + closure          |
| --------------------------- | ------------------------------- |
| Team knows OOP / TypeScript | No `class` allowed in interview |
| `extends` hierarchy         | True privacy without `#`        |
| Static methods, `#fields`   | Module pattern, factory         |

---

_Deep dives: [OOP/01-javascript-oop-interview-guide.md](../OOP/01-javascript-oop-interview-guide.md) · [OOP/02-class-vs-function-oop-problems.md](../OOP/02-class-vs-function-oop-problems.md) · [OOP/INTERVIEW-QUESTIONS.md](../OOP/INTERVIEW-QUESTIONS.md)_


<p><a href="#i9">Back to index</a></p>
