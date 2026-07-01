---
title: "Node.js Interview Questions & Answers"
description: "15 Node.js interview topics — event loop, non-blocking I/O, streams, clustering, modules, and concurrency."
tags: ["nodejs", "mern", "backend", "event-loop", "interview"]
level: "All levels"
---

# Node.js Interview Questions & Answers

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is Node.js?](#p1) |
| <span id="i2"></span>2 | [Features of Node.js](#p2) |
| <span id="i3"></span>3 | [Node.js vs JavaScript](#p3) |
| <span id="i4"></span>4 | [Event Loop in Node.js](#p4) |
| <span id="i5"></span>5 | [Non-blocking I/O](#p5) |
| <span id="i6"></span>6 | [package.json in Node](#p6) |
| <span id="i7"></span>7 | [require() vs import](#p7) |
| <span id="i8"></span>8 | [Concurrency in Node.js](#p8) |
| <span id="i9"></span>9 | [Streams in Node.js](#p9) |
| <span id="i10"></span>10 | [fs module](#p10) |
| <span id="i11"></span>11 | [process.nextTick() vs setImmediate()](#p11) |
| <span id="i12"></span>12 | [Buffers in Node.js](#p12) |
| <span id="i13"></span>13 | [Error handling in Node.js](#p13) |
| <span id="i14"></span>14 | [Clustering in Node.js](#p14) |
| <span id="i15"></span>15 | [Environment variables](#p15) |

---

<a id="p1"></a>

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


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

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


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

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


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

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


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

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


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

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


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

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


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

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


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

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


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

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


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

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


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

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


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

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


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

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


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

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


<p><a href="#i15">Back to index</a></p>
