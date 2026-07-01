---
title: "Tools & Concepts Interview Questions & Answers"
description: "15 tools and concepts for MERN interviews — REST, JWT, Git, MVC, CORS, rate limiting, CI/CD, Docker, WebSocket, and Redis."
tags: ["mern", "rest", "jwt", "docker", "redis", "interview"]
level: "All levels"
---

# Tools & Concepts Interview Questions & Answers

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [REST API](#p1) |
| <span id="i2"></span>2 | [RESTful architecture](#p2) |
| <span id="i3"></span>3 | [JWT](#p3) |
| <span id="i4"></span>4 | [Authentication vs Authorization](#p4) |
| <span id="i5"></span>5 | [Postman](#p5) |
| <span id="i6"></span>6 | [Git and GitHub](#p6) |
| <span id="i7"></span>7 | [MVC architecture](#p7) |
| <span id="i8"></span>8 | [Environment variable](#p8) |
| <span id="i9"></span>9 | [CORS](#p9) |
| <span id="i10"></span>10 | [Rate limiting](#p10) |
| <span id="i11"></span>11 | [API versioning](#p11) |
| <span id="i12"></span>12 | [CI/CD](#p12) |
| <span id="i13"></span>13 | [Docker](#p13) |
| <span id="i14"></span>14 | [WebSocket](#p14) |
| <span id="i15"></span>15 | [Redis](#p15) |

---

<a id="p1"></a>

## 1. What is REST API?

### Theory

**REST** (Representational State Transfer) uses HTTP methods on **resources** (URLs) with stateless requests.

| Method    | Action |
| --------- | ------ |
| GET       | Read   |
| POST      | Create |
| PUT/PATCH | Update |
| DELETE    | Remove |

### Real Example

```http
GET    /api/users/42
POST   /api/users          { "name": "Rahul" }
PUT    /api/users/42       { "name": "Updated" }
DELETE /api/users/42
```

### Interview Answer

> REST is an architectural style using HTTP verbs on resource URLs — stateless, JSON payloads, standard status codes.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What is RESTful architecture?

### Theory

Principles: **stateless**, **client-server**, **cacheable**, **uniform interface**, **layered system**.

### Interview Answer

> RESTful APIs are stateless, use standard HTTP semantics, return appropriate status codes, and treat everything as resources identifiable by URLs.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What is JWT?

### Theory

**JWT** = header.payload.signature (Base64). Signed with secret — server verifies without session store.

### Real Example

```javascript
const token = jwt.sign({ userId: "42", role: "admin" }, SECRET, {
  expiresIn: "1h",
});
const payload = jwt.verify(token, SECRET);
```

### Interview Answer

> JWT is a signed token encoding claims — stateless auth for MERN APIs; verify signature server-side on every protected request.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is authentication vs authorization?

### Theory

|          | Authentication | Authorization    |
| -------- | -------------- | ---------------- |
| Question | Who are you?   | What can you do? |
| Example  | Login          | Admin-only route |

### Real Example

```javascript
// AuthN — verify identity
const user = jwt.verify(token, SECRET);

// AuthZ — check permission
if (user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
```

### Interview Answer

> Authentication proves identity; authorization checks permissions — login is authN, role-based route access is authZ.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. What is Postman used for?

### Theory

**Postman** tests HTTP APIs — send requests, save collections, environments, automate tests.

### Interview Answer

> Postman tests REST endpoints during development — save MERN API collections with auth headers and env variables.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. What is Git and GitHub?

### Theory

**Git** — distributed version control. **GitHub** — remote hosting, PRs, CI.

### Interview Answer

> Git tracks code history locally; GitHub hosts remotes and enables collaboration via branches and pull requests.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. What is MVC architecture?

### Theory

**Model** (data) — **View** (UI) — **Controller** (logic). In MERN: Mongoose models, React views, Express controllers.

### Real Example

```text
Model      → User.js (Mongoose)
View       → React components
Controller → userController.js (business logic)
Routes     → userRoutes.js (HTTP mapping)
```

### Interview Answer

> MVC separates data, UI, and logic — in MERN, Mongoose is Model, React is View, Express controllers handle request logic.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. What is environment variable?

### Theory

Config values outside code — `process.env.PORT`, `MONGO_URI`, `JWT_SECRET`.

### Interview Answer

> Environment variables configure secrets and URLs per environment — never commit `.env` to Git.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. What is CORS?

### Theory

Browser security blocking cross-origin reads unless server allows via headers.

### Interview Answer

> CORS restricts cross-origin browser requests — fix on Express server with `Access-Control-Allow-Origin`, not in React.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. What is rate limiting?

### Theory

Caps requests per IP/user/time window — prevents abuse and DDoS.

### Real Example

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);
```

### Interview Answer

> Rate limiting throttles excessive requests — use `express-rate-limit` or Redis-backed limits on public MERN APIs.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. What is API versioning?

### Theory

`/api/v1/users` vs `/api/v2/users` — evolve API without breaking old clients.

### Interview Answer

> Version APIs in the URL or header so you can ship breaking changes without breaking existing React clients.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. What is CI/CD?

### Theory

**CI** — auto build/test on push. **CD** — auto deploy to staging/production.

### Real Example

```yaml
# .github/workflows/ci.yml
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
```

### Interview Answer

> CI runs tests on every commit; CD deploys passing builds — GitHub Actions is common for MERN projects.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. What is Docker?

### Theory

**Docker** packages app + dependencies in containers — consistent dev and prod environments.

### Real Example

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

### Interview Answer

> Docker containers bundle Node, Express, and dependencies — same image runs locally and in production.

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. What is WebSocket?

### Theory

**Full-duplex** persistent connection — server pushes data without client polling.

### Interview Answer

> WebSockets enable real-time bidirectional communication — use Socket.io in MERN for chat, notifications, live dashboards.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. What is Redis and why use it?

### Theory

**Redis** — in-memory key-value store. Uses: session cache, rate limit counters, pub/sub, job queues.

### Real Example

```javascript
// Cache expensive MongoDB query
const cached = await redis.get("products:featured");
if (cached) return res.json(JSON.parse(cached));

const products = await Product.find({ featured: true });
await redis.setex("products:featured", 300, JSON.stringify(products));
res.json(products);
```

### Interview Answer

> Redis is an in-memory data store for caching, sessions, and rate limiting — reduces MongoDB load and speeds up MERN API responses.

---

**Next:** [07-javascript-interview.md](./07-javascript-interview.md)


<p><a href="#i15">Back to index</a></p>
