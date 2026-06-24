---
title: "Node.js Interview Questions & Answers"
description: "15 Node.js interview topics — event loop, non-blocking I/O, streams, clustering, modules, and concurrency."
tags: ["nodejs", "mern", "backend", "event-loop", "interview"]
level: "All levels"
---

# Node.js Interview Questions & Answers

---

## Table of Contents

1. [What is Node.js?](#1-what-is-nodejs)
2. [Features of Node.js](#2-what-are-the-features-of-nodejs)
3. [Node.js vs JavaScript](#3-what-is-the-difference-between-nodejs-and-javascript)
4. [Event Loop in Node.js](#4-what-is-the-event-loop-in-nodejs)
5. [Non-blocking I/O](#5-what-is-non-blocking-io)
6. [package.json in Node](#6-what-is-the-use-of-packagejson)
7. [require() vs import](#7-what-is-the-difference-between-require-and-import)
8. [Concurrency in Node.js](#8-how-does-nodejs-handle-concurrency)
9. [Streams in Node.js](#9-what-are-streams-in-nodejs)
10. [fs module](#10-what-is-the-use-of-fs-module)
11. [process.nextTick() vs setImmediate()](#11-what-is-the-difference-between-processnexttick-and-setimmediate)
12. [Buffers in Node.js](#12-what-are-buffers-in-nodejs)
13. [Error handling in Node.js](#13-how-do-you-handle-errors-in-nodejs)
14. [Clustering in Node.js](#14-what-is-clustering-in-nodejs)
15. [Environment variables](#15-what-is-environment-variable-in-nodejs)

---

## 1. What is Node.js?

### Theory

**Node.js** is a **JavaScript runtime** built on Chrome's **V8** engine — runs JS outside the browser for servers, CLIs, and tools.

### Real Example

```javascript
// server.js — MERN backend entry
const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello from Node" }));
  })
  .listen(3000);
```

### Interview Answer

> Node.js is a V8-based runtime that lets you run JavaScript on the server — the runtime layer under Express in MERN.

---

## 2. What are the features of Node.js?

### Theory

- Asynchronous, event-driven, non-blocking I/O
- Single-threaded event loop (+ worker threads for CPU work)
- npm ecosystem
- Cross-platform
- Great for I/O-bound APIs, real-time apps

### Interview Answer

> Node excels at I/O-bound concurrent connections via non-blocking APIs and the event loop — ideal for MERN API servers and WebSockets.

---

## 3. What is the difference between Node.js and JavaScript?

### Theory

|         | JavaScript          | Node.js                 |
| ------- | ------------------- | ----------------------- |
| What    | Language            | Runtime environment     |
| Runs in | Browser (+ engines) | Server, CLI             |
| APIs    | DOM, `window`       | `fs`, `http`, `process` |

### Interview Answer

> JavaScript is the language; Node.js is the runtime that executes JS on the server with APIs like `fs` and `http` instead of the DOM.

---

## 4. What is the event loop in Node.js?

### Theory

Node's event loop has phases: **timers** → **pending callbacks** → **poll** → **check** → **close**. Libuv handles async I/O; callbacks run when ready.

```
   ┌───────────────────────────┐
   │        Call Stack         │
   └─────────────┬─────────────┘
                 │
   ┌─────────────▼─────────────┐
   │  Microtasks (nextTick,    │
   │  Promise.then)            │
   └─────────────┬─────────────┘
                 │
   ┌─────────────▼─────────────┐
   │  Macrotasks (setTimeout,  │
   │  setImmediate, I/O)       │
   └───────────────────────────┘
```

### Real Example

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
process.nextTick(() => console.log("4"));
console.log("5");
// 1, 5, 4, 3, 2
```

### Interview Answer

> The event loop processes the call stack, then microtasks (`nextTick`, Promises), then macrotasks — enabling non-blocking I/O on a single thread.

---

## 5. What is non-blocking I/O?

### Theory

Node **doesn't wait** for disk/network — it registers callbacks and continues. When I/O completes, the callback runs on the event loop.

### Real Example

```javascript
const fs = require("fs");

console.log("Start");

fs.readFile("large-log.txt", "utf8", (err, data) => {
  console.log("File read done", data.length);
});

console.log("End"); // prints before file read completes
// Start → End → File read done
```

### Interview Answer

> Non-blocking I/O delegates slow operations to the OS and continues executing — callbacks fire when data is ready, maximizing throughput.

---

## 6. What is the use of package.json?

### Theory

Same as Express — defines dependencies, scripts (`start`, `dev`), `type: module` for ESM, engines.

### Real Example

```json
{
  "name": "mern-api",
  "type": "module",
  "scripts": { "dev": "nodemon index.js" },
  "dependencies": { "express": "^4.18.0" }
}
```

### Interview Answer

> `package.json` manages dependencies and npm scripts — the project manifest for every Node MERN backend.

---

## 7. What is the difference between require() and import?

### Theory

|         | `require()` (CJS)        | `import` (ESM)               |
| ------- | ------------------------ | ---------------------------- |
| Loading | Synchronous              | Async, static analysis       |
| Syntax  | `const x = require('x')` | `import x from 'x'`          |
| Node    | Default historically     | `"type": "module"` or `.mjs` |

### Real Example

```javascript
// CommonJS
const express = require("express");

// ESM
import express from "express";
```

### Interview Answer

> `require` is CommonJS synchronous loading; `import` is ESM with static analysis and tree-shaking — modern Node supports both with `"type": "module"`.

---

## 8. How does Node.js handle concurrency?

### Theory

**Single thread** for JS + **event loop** for async I/O. CPU-heavy work blocks — use **worker threads**, **cluster**, or offload to queue.

### Real Example

```javascript
// I/O concurrent — thousands of connections
app.get("/api/users", async (req, res) => {
  const users = await User.find(); // async — doesn't block other requests
  res.json(users);
});
```

### Interview Answer

> Node handles many concurrent I/O operations on one thread via the event loop — for CPU-bound tasks use worker threads or cluster mode.

---

## 9. What are streams in Node.js?

### Theory

**Streams** process data in chunks — readable, writable, duplex, transform. Memory-efficient for large files.

### Real Example

```javascript
const fs = require("fs");

// Pipe large file to response — don't load entire file in RAM
app.get("/download/report", (req, res) => {
  const stream = fs.createReadStream("./reports/annual.pdf");
  stream.pipe(res);
});
```

### Interview Answer

> Streams read/write data in chunks — use `pipe()` for large file uploads/downloads instead of buffering entire files in memory.

---

## 10. What is the use of fs module?

### Theory

**fs** — file system: read, write, append, delete, watch files and directories.

### Real Example

```javascript
const fs = require("fs").promises;

async function saveUpload(filename, buffer) {
  await fs.writeFile(`./uploads/${filename}`, buffer);
}

const exists = await fs
  .access("./config.json")
  .then(() => true)
  .catch(() => false);
```

### Interview Answer

> The `fs` module handles file operations — use `fs.promises` or `fs.readFile` with callbacks for reading configs and saving uploads.

---

## 11. What is the difference between process.nextTick() and setImmediate()?

### Theory

|          | `process.nextTick()`  | `setImmediate()`                        |
| -------- | --------------------- | --------------------------------------- |
| Queue    | Microtask (same tick) | Check phase (next event loop iteration) |
| Priority | Higher                | Lower                                   |

### Real Example

```javascript
setImmediate(() => console.log("immediate"));
process.nextTick(() => console.log("nextTick"));
console.log("sync");
// sync → nextTick → immediate
```

### Interview Answer

> `nextTick` runs before the event loop continues; `setImmediate` runs in the check phase on the next iteration — `nextTick` has higher priority.

---

## 12. What are Buffers in Node.js?

### Theory

**Buffer** is a fixed-length raw binary allocation — for files, network packets, images before encoding.

### Real Example

```javascript
const buf = Buffer.from("Hello", "utf8");
console.log(buf.toString("base64")); // SGVsbG8=

// HTTP response with binary
res.setHeader("Content-Type", "image/png");
fs.createReadStream("logo.png").pipe(res);
```

### Interview Answer

> Buffers represent binary data in Node — used for file I/O, crypto, and handling uploads before writing to disk or S3.

---

## 13. How do you handle errors in Node.js?

### Theory

- Callbacks: `if (err) return ...`
- Promises: `.catch()` or `try/catch` with `async/await`
- Process: `process.on('uncaughtException')`, `unhandledRejection`
- Express: error middleware

### Real Example

```javascript
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(5000);
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}
```

### Interview Answer

> Use try/catch with async/await, global handlers for unhandled rejections, and never let the server run in a corrupted state after fatal errors.

---

## 14. What is clustering in Node.js?

### Theory

**cluster** module forks worker processes per CPU core — each runs its own event loop, sharing the same port.

### Real Example

```javascript
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died — restarting`);
    cluster.fork();
  });
} else {
  require("./server.js"); // Express app
}
```

### Interview Answer

> Clustering forks multiple Node processes to use all CPU cores — each handles requests independently for better throughput on multi-core servers.

---

## 15. What is environment variable in Node.js?

### Theory

**Environment variables** configure secrets and URLs without hardcoding — accessed via `process.env`. Use `.env` + `dotenv` locally.

### Real Example

```javascript
require("dotenv").config();

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error("JWT_SECRET required");
```

### Interview Answer

> Environment variables via `process.env` store secrets and config — load with `dotenv` in dev and set in production (Docker, Vercel, Railway).

---

**Next:** [05-mern-fullstack-interview.md](./05-mern-fullstack-interview.md)
