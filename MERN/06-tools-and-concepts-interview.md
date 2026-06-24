---
title: "Tools & Concepts Interview Questions & Answers"
description: "15 tools and concepts for MERN interviews — REST, JWT, Git, MVC, CORS, rate limiting, CI/CD, Docker, WebSocket, and Redis."
tags: ["mern", "rest", "jwt", "docker", "redis", "interview"]
level: "All levels"
---

# Tools & Concepts Interview Questions & Answers

---

## Table of Contents

1. [REST API](#1-what-is-rest-api)
2. [RESTful architecture](#2-what-is-restful-architecture)
3. [JWT](#3-what-is-jwt)
4. [Authentication vs Authorization](#4-what-is-authentication-vs-authorization)
5. [Postman](#5-what-is-postman-used-for)
6. [Git and GitHub](#6-what-is-git-and-github)
7. [MVC architecture](#7-what-is-mvc-architecture)
8. [Environment variable](#8-what-is-environment-variable)
9. [CORS](#9-what-is-cors)
10. [Rate limiting](#10-what-is-rate-limiting)
11. [API versioning](#11-what-is-api-versioning)
12. [CI/CD](#12-what-is-cicd)
13. [Docker](#13-what-is-docker)
14. [WebSocket](#14-what-is-websocket)
15. [Redis](#15-what-is-redis-and-why-use-it)

---

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

## 2. What is RESTful architecture?

### Theory

Principles: **stateless**, **client-server**, **cacheable**, **uniform interface**, **layered system**.

### Interview Answer

> RESTful APIs are stateless, use standard HTTP semantics, return appropriate status codes, and treat everything as resources identifiable by URLs.

---

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

## 5. What is Postman used for?

### Theory

**Postman** tests HTTP APIs — send requests, save collections, environments, automate tests.

### Interview Answer

> Postman tests REST endpoints during development — save MERN API collections with auth headers and env variables.

---

## 6. What is Git and GitHub?

### Theory

**Git** — distributed version control. **GitHub** — remote hosting, PRs, CI.

### Interview Answer

> Git tracks code history locally; GitHub hosts remotes and enables collaboration via branches and pull requests.

---

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

## 8. What is environment variable?

### Theory

Config values outside code — `process.env.PORT`, `MONGO_URI`, `JWT_SECRET`.

### Interview Answer

> Environment variables configure secrets and URLs per environment — never commit `.env` to Git.

---

## 9. What is CORS?

### Theory

Browser security blocking cross-origin reads unless server allows via headers.

### Interview Answer

> CORS restricts cross-origin browser requests — fix on Express server with `Access-Control-Allow-Origin`, not in React.

---

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

## 11. What is API versioning?

### Theory

`/api/v1/users` vs `/api/v2/users` — evolve API without breaking old clients.

### Interview Answer

> Version APIs in the URL or header so you can ship breaking changes without breaking existing React clients.

---

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

## 14. What is WebSocket?

### Theory

**Full-duplex** persistent connection — server pushes data without client polling.

### Interview Answer

> WebSockets enable real-time bidirectional communication — use Socket.io in MERN for chat, notifications, live dashboards.

---

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
