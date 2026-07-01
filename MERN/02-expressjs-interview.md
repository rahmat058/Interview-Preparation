---
title: "Express.js Interview Questions & Answers"
description: "15 Express.js interview topics — middleware, routing, error handling, CORS, static files, and authentication."
tags: ["express", "mern", "nodejs", "backend", "interview"]
level: "All levels"
---

# Express.js Interview Questions & Answers

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is Express.js?](#p1) |
| <span id="i2"></span>2 | [Features of Express.js](#p2) |
| <span id="i3"></span>3 | [Use of app.use()](#p3) |
| <span id="i4"></span>4 | [Middleware in Express.js](#p4) |
| <span id="i5"></span>5 | [app.use() vs app.METHOD()](#p5) |
| <span id="i6"></span>6 | [Error handling](#p6) |
| <span id="i7"></span>7 | [Use of next()](#p7) |
| <span id="i8"></span>8 | [Routing](#p8) |
| <span id="i9"></span>9 | [404 errors](#p9) |
| <span id="i10"></span>10 | [Parse JSON](#p10) |
| <span id="i11"></span>11 | [CORS in Express](#p11) |
| <span id="i12"></span>12 | [package.json purpose](#p12) |
| <span id="i13"></span>13 | [Static files](#p13) |
| <span id="i14"></span>14 | [res.send() vs res.json()](#p14) |
| <span id="i15"></span>15 | [Authentication in Express](#p15) |

---

<a id="p1"></a>

## 1. What is Express.js?

### Theory

**Express.js** is a minimal, unopinionated **Node.js web framework** for building APIs and server-side apps — routing, middleware, and HTTP utilities.

### Real Example

```javascript
const express = require("express");
const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5000, () => console.log("Server on :5000"));
```

### Interview Answer

> Express is a lightweight Node.js framework for HTTP APIs — it handles routing and middleware composition with minimal boilerplate.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What are the features of Express.js?

### Theory

- Fast, minimal core
- Robust **routing** (HTTP verbs + paths)
- **Middleware** pipeline
- Template engine support
- Static file serving
- Large ecosystem (passport, helmet, morgan)

### Real Example

```javascript
const helmet = require("helmet");
const morgan = require("morgan");

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
```

### Interview Answer

> Express offers flexible routing, middleware chaining, static serving, and integrates with security and logging packages — the standard MERN API layer.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What is the use of app.use()?

### Theory

`app.use()` mounts **middleware** for all paths (or a path prefix). Runs in **registration order** for every matching request.

### Real Example

```javascript
app.use(express.json()); // all routes — parse JSON body
app.use("/api", apiRouter); // mount router at prefix
app.use(express.static("public")); // static assets
```

### Interview Answer

> `app.use` registers middleware for all or prefixed routes — order matters; body parsers and auth usually come before route handlers.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is middleware in Express.js?

### Theory

**Middleware** functions have `(req, res, next)` — they can read/modify `req`/`res`, end the response, or call `next()` to continue the chain.

Types: application-level, router-level, error-handling (4 args), built-in, third-party.

### Real Example

```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
```

### Interview Answer

> Middleware are functions in the request pipeline that handle cross-cutting concerns — auth, logging, parsing — and call `next()` or send a response.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. What is the difference between app.use() and app.METHOD()?

### Theory

|         | `app.use()`               | `app.get/post/put/delete()` |
| ------- | ------------------------- | --------------------------- |
| Matches | Path prefix (all methods) | Specific HTTP method + path |
| Purpose | Middleware mounting       | Route handlers              |

### Real Example

```javascript
app.use("/api/users", userRouter); // all methods under /api/users

app.get("/api/users", listUsers); // only GET /api/users
app.post("/api/users", createUser); // only POST
```

### Interview Answer

> `app.use` mounts middleware for any HTTP method on a path prefix; `app.METHOD` binds a handler to a specific verb and route.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. How do you handle errors in Express?

### Theory

1. Sync errors in routes — Express catches and forwards to error middleware
2. Async — use `try/catch` or wrapper, call `next(err)`
3. Error middleware — **4 parameters** `(err, req, res, next)`

### Real Example

```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get(
  "/api/orders/:id",
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  }),
);

// Error middleware — must be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
```

### Interview Answer

> Wrap async handlers to pass errors to `next(err)`, then use a four-argument error middleware at the end to return consistent JSON error responses.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. What is the use of next() in middleware?

### Theory

`next()` passes control to the **next middleware**. `next('route')` skips to next route handler. `next(err)` jumps to error handlers.

### Real Example

```javascript
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next(); // continue to route handler
}
```

### Interview Answer

> `next()` advances the middleware chain; omit it and the request hangs — use `next(err)` for centralized error handling.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. What is routing in Express.js?

### Theory

**Routing** maps HTTP methods + URL patterns to handler functions. Use `express.Router()` for modular routes.

### Real Example

```javascript
// routes/products.js
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().limit(20);
  res.json(products);
});

router.post("/", auth, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

module.exports = router;

// app.js
app.use("/api/products", require("./routes/products"));
```

### Interview Answer

> Routing maps URLs and HTTP verbs to handlers — split into `Router` modules per resource for maintainable MERN APIs.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. How do you handle 404 errors?

### Theory

Add a catch-all middleware **after all routes** — no route matched.

### Real Example

```javascript
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// 404 — must be after routes, before error handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});
```

### Interview Answer

> Place a catch-all middleware after all route definitions that returns 404 JSON for unmatched paths.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. How do you parse JSON data in Express?

### Theory

`express.json()` middleware parses `Content-Type: application/json` bodies into `req.body` (limit configurable).

### Real Example

```javascript
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true })); // form data

app.post("/api/items", (req, res) => {
  const { name, price } = req.body;
  res.json({ received: { name, price } });
});
```

### Interview Answer

> Use `express.json()` globally before routes so `req.body` contains parsed JSON — set a size limit for large payloads.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. What is CORS and how to enable it in Express?

### Theory

**CORS** lets browsers allow cross-origin API calls when the server sends `Access-Control-Allow-*` headers.

### Real Example

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CLIENT_URL, // http://localhost:3000
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Manual
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
```

### Interview Answer

> CORS is enforced by the browser — enable it in Express with the `cors` package, whitelisting your React origin and credentials for cookie/JWT flows.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. What is the purpose of package.json?

### Theory

`package.json` defines project **metadata**, **dependencies**, **scripts**, and engine versions for npm.

### Real Example

```json
{
  "name": "mern-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

### Interview Answer

> `package.json` lists dependencies, npm scripts, and project metadata — it's the manifest for any Node/Express MERN backend.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. How to serve static files in Express?

### Theory

`express.static()` serves files from a directory — built React `build/` or uploads.

### Real Example

```javascript
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MERN production — serve React build
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
```

### Interview Answer

> Use `express.static` for public assets; in production MERN deploys, serve the React `build` folder from Express or a CDN.

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. What is the difference between res.send() and res.json()?

### Theory

| Method       | Behavior                                                          |
| ------------ | ----------------------------------------------------------------- |
| `res.send()` | Sends string, Buffer, or object (sets Content-Type automatically) |
| `res.json()` | Serializes to JSON, sets `Content-Type: application/json`         |

### Real Example

```javascript
res.send("Hello"); // text/html
res.send({ ok: true }); // application/json (Express 4+)
res.json({ ok: true }); // explicit JSON — preferred for APIs
res.status(201).json({ id: 1 }); // status + JSON
```

### Interview Answer

> For REST APIs prefer `res.json()` — it always sets JSON content-type; `res.send()` is more generic for HTML or mixed types.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. How do you implement authentication in Express?

### Theory

Common pattern: **JWT** — login validates credentials, signs token; protected routes verify token in middleware. Alternatives: sessions + cookies (Passport).

### Real Example

```javascript
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token, user: { id: user._id, name: user.name } });
});
```

### Interview Answer

> Hash passwords with bcrypt, issue JWT on login, verify token in auth middleware on protected routes, and never store plain passwords in MongoDB.

---

**Next:** [03-reactjs-interview.md](./03-reactjs-interview.md)


<p><a href="#i15">Back to index</a></p>
