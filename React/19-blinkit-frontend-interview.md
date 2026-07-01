---
title: "Blinkit SDE-1 Frontend Interview Preparation"
description: "Blinkit 3-round interview — CORS, WebSockets, browser storage, event loop, Grid Toggle machine coding, and culture fit."
tags: ["react", "blinkit", "frontend", "interview", "websocket", "cors", "machine-coding"]
level: "SDE-1 (0–2 years)"
company: "Blinkit"
---

# Blinkit SDE-1 Frontend Interview Preparation

Questions from a **Blinkit SDE-1 Frontend Engineer** interview — **3 rounds**: Core Web Concepts, React Machine Coding, and Culture Fit. Each technical topic includes **Theory**, **Pros & Cons**, **One-Line Interview Answer**, and **Real Examples**.

> Blinkit interviews test **how browsers work**, **frontend–backend data flow**, and **real-time systems** — not just React syntax.

---

<a id="quick-index"></a>

## Quick index


### Round 1 — Core Web Concepts

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [CORS](#p1) |
| <span id="i2"></span>2 | [WebSockets](#p2) |
| <span id="i3"></span>3 | [Long Polling vs WebSockets](#p3) |
| <span id="i4"></span>4 | [Browser Storage](#p4) |
| <span id="i5"></span>5 | [Event Loop — Microtasks vs Macrotasks](#p5) |

### Round 2 — React Machine Coding

| # | Section |
| --- | --- |
| <span id="i6"></span>6 | [Grid Toggle Component](#p6) |

### Round 3 — Culture Fit

| # | Section |
| --- | --- |
| <span id="i7"></span>7 | [Culture Fit & Behavioral Questions](#p7) |

---
# Round 1 — Core Web Concepts

<a id="p1"></a>

## 1. CORS

### Theory

**CORS** (Cross-Origin Resource Sharing) is a browser security mechanism that blocks JavaScript from reading responses from a **different origin** unless the server explicitly allows it.

**Origin** = protocol + domain + port (e.g. `https://blinkit.com:443`)

The browser sends a **preflight** `OPTIONS` request for non-simple requests (custom headers, PUT/DELETE, JSON content-type). Server responds with:

```
Access-Control-Allow-Origin: https://blinkit.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Pros & Cons

| Pros | Cons |
|------|------|
| Protects users from malicious sites | Confusing for beginners |
| Standard, well-supported | Misconfigured servers break apps |
| Granular control per origin | Can't fix purely on frontend |

### One-Line Interview Answer

> CORS is a browser security policy blocking cross-origin API reads unless the server sends Access-Control-Allow-Origin. Fix it on the server or use a same-origin proxy — not by disabling CORS in the browser.

### Real Example

```javascript
// Frontend — blinkit.com calling api.blinkit.com
fetch("https://api.blinkit.com/v1/products", {
  method: "GET",
  credentials: "include", // sends cookies — server must allow credentials
  headers: { "Content-Type": "application/json" },
})
  .then((r) => r.json())
  .then(setProducts);

// ❌ CORS error in console:
// "Access to fetch at 'https://api.blinkit.com' from origin 'https://blinkit.com'
//  has been blocked by CORS policy"
```

```javascript
// Backend — Express CORS setup
import cors from "cors";

app.use(cors({
  origin: ["https://blinkit.com", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
```

### Common Interview Follow-ups

| Question | Answer |
|----------|--------|
| Can frontend bypass CORS? | No — it's enforced by the browser |
| Simple vs preflight request? | Simple: GET/POST with basic headers — no OPTIONS. Preflight: custom headers, PUT/DELETE |
| Why credentials need special header? | `Access-Control-Allow-Credentials: true` + specific origin (not `*`) |

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. WebSockets

### Theory

**WebSocket** provides a **persistent, full-duplex** TCP connection between client and server over a single handshake. After upgrade from HTTP, both sides can send messages **anytime** without re-establishing connection.

Protocol: `ws://` (dev) / `wss://` (prod — always use in production)

Ideal for: live order tracking, chat, stock updates, delivery ETA.

### Pros & Cons

| Pros | Cons |
|------|------|
| Real-time, low latency | Stateful — harder to scale |
| Bidirectional | Connection drops need reconnect logic |
| Less overhead than polling | Not ideal for request/response CRUD |
| Server can push instantly | Proxies/firewalls may block |

### One-Line Interview Answer

> WebSocket opens a persistent bidirectional connection — perfect for live order tracking or inventory updates. I always use wss, handle reconnect with exponential backoff, and clean up on unmount.

### Real Example

```javascript
function useOrderTracking(orderId) {
  const [status, setStatus] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;

    const ws = new WebSocket(`wss://api.blinkit.com/orders/${orderId}/live`);
    wsRef.current = ws;

    ws.onopen = () => console.log("Connected to order tracking");
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setStatus(update); // { status: "out_for_delivery", eta: "8 min" }
    };
    ws.onerror = (err) => console.error("WebSocket error", err);
    ws.onclose = () => console.log("Connection closed");

    return () => ws.close();
  }, [orderId]);

  return status;
}
```

### Reconnection Pattern

```javascript
function connectWithRetry(url, { maxRetries = 5, baseDelay = 1000 } = {}) {
  let retries = 0;
  let ws;

  function connect() {
    ws = new WebSocket(url);

    ws.onopen = () => { retries = 0; };

    ws.onclose = () => {
      if (retries < maxRetries) {
        const delay = baseDelay * Math.pow(2, retries);
        retries++;
        setTimeout(connect, delay);
      }
    };
  }

  connect();
  return () => ws?.close();
}
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Long Polling vs WebSockets

### Theory

| | Long Polling | WebSockets |
|--|------------|------------|
| **Connection** | New HTTP request each cycle | Single persistent connection |
| **Direction** | Client pulls (server holds request) | Bidirectional push/pull |
| **Latency** | Higher — wait + new request | Low — instant push |
| **Overhead** | HTTP headers every request | Minimal after handshake |
| **Scaling** | Easier — stateless HTTP | Harder — sticky sessions |
| **Use case** | Fallback, low-frequency updates | High-frequency real-time |

**Long polling**: Client sends request → server holds it open until data arrives or timeout → client immediately sends new request.

**Short polling**: Client requests every N seconds regardless — wasteful.

### One-Line Interview Answer

> Long polling simulates push by holding HTTP requests open — simpler but higher latency. WebSockets give true real-time bidirectional communication — I pick WebSockets for live delivery tracking, long polling as fallback.

### Real Example

```javascript
// Long polling — order status
async function pollOrderStatus(orderId) {
  while (true) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status?longPoll=true`, {
        signal: AbortSignal.timeout(30000), // 30s server hold
      });
      const data = await res.json();
      updateUI(data);
      if (data.status === "delivered") break;
    } catch (err) {
      await new Promise((r) => setTimeout(r, 2000)); // backoff on error
    }
  }
}

// WebSocket — same use case, better UX
const ws = new WebSocket(`wss://api.blinkit.com/orders/${orderId}`);
ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  updateUI(data);
  if (data.status === "delivered") ws.close();
};
```

### When Blinkit Might Use Each

| Feature | Likely approach |
|---------|-----------------|
| Live delivery map / ETA | WebSocket |
| Cart inventory sync | WebSocket or SSE |
| Notification badge (low freq) | Long polling or SSE |
| Legacy API / CDN compatibility | Long polling fallback |

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Browser Storage

### Theory

| Storage | Capacity | Lifetime | Scope | Sent to server? |
|---------|----------|----------|-------|-----------------|
| **localStorage** | ~5–10 MB | Until cleared | Per origin | No |
| **sessionStorage** | ~5–10 MB | Tab session | Per tab | No |
| **Cookies** | ~4 KB | Configurable expiry | Per domain | Yes (auto) |
| **IndexedDB** | Large (50MB+) | Until cleared | Per origin | No |

### Pros & Cons

| Storage | Best for | Avoid for |
|---------|----------|-----------|
| localStorage | Theme, preferences, recent searches | Auth tokens (XSS risk) |
| sessionStorage | Form wizard state, tab-specific data | Cross-tab sync |
| Cookies | Session ID, httpOnly auth | Large data |
| IndexedDB | Offline cart, large cache, images | Simple key-value |

### One-Line Interview Answer

> localStorage persists across sessions for preferences. sessionStorage dies with the tab. Cookies go to the server automatically — use httpOnly for auth. IndexedDB handles large structured offline data like cart cache.

### Real Example

```javascript
// localStorage — user preferences (non-sensitive)
localStorage.setItem("theme", "dark");
localStorage.setItem("recentSearches", JSON.stringify(["milk", "bread"]));

// sessionStorage — checkout flow (tab-scoped)
sessionStorage.setItem("checkoutStep", "2");
sessionStorage.setItem("deliveryAddress", JSON.stringify(address));

// Cookies — set by server (httpOnly, Secure, SameSite)
// Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=86400

// IndexedDB — offline cart
const dbRequest = indexedDB.open("BlinkitCart", 1);
dbRequest.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore("cart", { keyPath: "productId" });
};
```

### React Hook — localStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    const next = newValue instanceof Function ? newValue(value) : newValue;
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  return [value, setStoredValue];
}
```

### Security Note (Interview Gold)

```javascript
// ❌ NEVER — XSS can steal tokens
localStorage.setItem("jwt", token);

// ✅ Auth tokens in httpOnly cookies — JS cannot read them
// Server: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Event Loop — Microtasks vs Macrotasks

### Theory

JavaScript is **single-threaded**. The **event loop** decides what runs next:

1. Execute all **synchronous** code (call stack)
2. Drain **all microtasks** (Job queue)
3. Run **one macrotask** (Task queue)
4. Repeat (render between tasks if needed)

| Type | Examples |
|------|----------|
| **Microtasks** | `Promise.then`, `queueMicrotask`, `MutationObserver` |
| **Macrotasks** | `setTimeout`, `setInterval`, `setImmediate`, I/O, UI events |

**Rule:** After every macrotask, ALL microtasks run before the next macrotask.

### One-Line Interview Answer

> Sync code runs first, then all microtasks like Promise.then, then one macrotask like setTimeout. That's why Promise callbacks run before setTimeout even with 0ms delay.

### Classic Interview Output

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1 → 4 → 3 → 2
// Sync (1, 4) → Microtask (3) → Macrotask (2)
```

### Advanced Puzzle

```javascript
console.log("start");

setTimeout(() => console.log("timeout 1"), 0);

Promise.resolve()
  .then(() => {
    console.log("promise 1");
    setTimeout(() => console.log("timeout 2"), 0);
  })
  .then(() => console.log("promise 2"));

setTimeout(() => console.log("timeout 3"), 0);

console.log("end");

// start → end → promise 1 → promise 2 → timeout 1 → timeout 3 → timeout 2
```

### Blinkit-Relevant Example

```javascript
// Why this matters in React apps
async function addToCart(product) {
  console.log("1: optimistic UI update");
  setCart((prev) => [...prev, product]); // sync state schedule

  console.log("2: API call starts");
  await fetch("/api/cart", { method: "POST", body: JSON.stringify(product) });
  console.log("3: API done");

  Promise.resolve().then(() => console.log("4: microtask after await"));
}

console.log("A");
addToCart(item);
console.log("B");

// A → 1 → 2 → B → (microtasks) → 3 → 4
```

---

# Round 2 — React Machine Coding


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Grid Toggle Component

### Theory

Build an **N×N grid** where clicking a cell **toggles** its state (on/off). Tests:

- **State management** — 2D grid in state
- **Immutable updates** — never mutate array directly
- **Component design** — separate Grid, Cell, maybe custom hook
- **Event handling** — click toggles correct cell
- **Clean code** — readable names, small functions

Common variations interviewers add:
- Toggle row/column on header click
- "Select all" / "Clear all"
- Count active cells
- Keyboard navigation

### One-Line Interview Answer

> I store the grid as a 2D boolean array, toggle with immutable map — copy the row, flip the cell, replace the row in a new grid array. I split into Grid, Row, and Cell for readability.

### Basic Implementation

```jsx
import { useState, useCallback } from "react";

function createGrid(rows, cols, fill = false) {
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
}

function GridToggle({ rows = 3, cols = 3 }) {
  const [grid, setGrid] = useState(() => createGrid(rows, cols));

  const toggleCell = useCallback((rowIndex, colIndex) => {
    setGrid((prev) =>
      prev.map((row, r) =>
        r === rowIndex
          ? row.map((cell, c) => (c === colIndex ? !cell : cell))
          : row
      )
    );
  }, []);

  const activeCount = grid.flat().filter(Boolean).length;

  return (
    <div>
      <p>Active cells: {activeCount}</p>
      <div
        role="grid"
        aria-label={`${rows} by ${cols} toggle grid`}
        style={{ display: "inline-grid", gap: 4 }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} role="row" style={{ display: "flex", gap: 4 }}>
            {row.map((isActive, colIndex) => (
              <button
                key={colIndex}
                role="gridcell"
                aria-pressed={isActive}
                aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}, ${isActive ? "on" : "off"}`}
                onClick={() => toggleCell(rowIndex, colIndex)}
                style={{
                  width: 48,
                  height: 48,
                  border: "2px solid #333",
                  borderRadius: 4,
                  cursor: "pointer",
                  backgroundColor: isActive ? "#22c55e" : "#f3f4f6",
                  transition: "background-color 0.15s",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridToggle;
```

### Senior Structure — Custom Hook + Subcomponents

```jsx
import { useState, useCallback, useMemo } from "react";

// --- Custom hook — logic separated from UI ---
function useGridToggle(initialRows = 3, initialCols = 3) {
  const [grid, setGrid] = useState(() => createGrid(initialRows, initialCols));

  const toggleCell = useCallback((row, col) => {
    setGrid((prev) =>
      prev.map((r, ri) =>
        ri === row ? r.map((cell, ci) => (ci === col ? !cell : cell)) : r
      )
    );
  }, []);

  const toggleRow = useCallback((row) => {
    const allActive = grid[row].every(Boolean);
    setGrid((prev) =>
      prev.map((r, ri) => (ri === row ? r.map(() => !allActive) : r))
    );
  }, [grid]);

  const toggleCol = useCallback((col) => {
    const allActive = grid.every((row) => row[col]);
    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell, ci) => (ci === col ? !allActive : cell))
      )
    );
  }, [grid]);

  const reset = useCallback(() => {
    setGrid(createGrid(grid.length, grid[0]?.length ?? 0));
  }, [grid]);

  const selectAll = useCallback(() => {
    setGrid((prev) => prev.map((row) => row.map(() => true)));
  }, []);

  const activeCount = useMemo(() => grid.flat().filter(Boolean).length, [grid]);

  return { grid, toggleCell, toggleRow, toggleCol, reset, selectAll, activeCount };
}

// --- Cell component ---
function Cell({ isActive, row, col, onToggle }) {
  return (
    <button
      type="button"
      role="gridcell"
      aria-pressed={isActive}
      aria-label={`Cell ${row + 1}-${col + 1}, ${isActive ? "active" : "inactive"}`}
      onClick={() => onToggle(row, col)}
      className={`cell ${isActive ? "cell--active" : ""}`}
    />
  );
}

// --- Grid component ---
function GridToggle({ rows = 4, cols = 4 }) {
  const {
    grid,
    toggleCell,
    toggleRow,
    toggleCol,
    reset,
    selectAll,
    activeCount,
  } = useGridToggle(rows, cols);

  return (
    <div className="grid-toggle">
      <header className="grid-toggle__header">
        <span>{activeCount} / {rows * cols} selected</span>
        <button type="button" onClick={selectAll}>Select All</button>
        <button type="button" onClick={reset}>Reset</button>
      </header>

      <div role="grid" aria-rowcount={rows} aria-colcount={cols}>
        {/* Column toggle headers */}
        <div role="row" className="grid-toggle__col-headers">
          <div style={{ width: 48 }} />
          {Array.from({ length: cols }, (_, col) => (
            <button
              key={col}
              type="button"
              aria-label={`Toggle column ${col + 1}`}
              onClick={() => toggleCol(col)}
              className="grid-toggle__header-btn"
            >
              C{col + 1}
            </button>
          ))}
        </div>

        {grid.map((row, rowIndex) => (
          <div key={rowIndex} role="row" className="grid-toggle__row">
            <button
              type="button"
              aria-label={`Toggle row ${rowIndex + 1}`}
              onClick={() => toggleRow(rowIndex)}
              className="grid-toggle__header-btn"
            >
              R{rowIndex + 1}
            </button>
            {row.map((isActive, colIndex) => (
              <Cell
                key={colIndex}
                isActive={isActive}
                row={rowIndex}
                col={colIndex}
                onToggle={toggleCell}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### CSS (optional — mention in interview)

```css
.grid-toggle__row {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.cell {
  width: 48px;
  height: 48px;
  border: 2px solid #374151;
  border-radius: 6px;
  background: #f9fafb;
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s;
}

.cell--active {
  background: #22c55e;
  border-color: #16a34a;
}

.cell:active {
  transform: scale(0.95);
}

.grid-toggle__header-btn {
  width: 48px;
  height: 32px;
  font-size: 11px;
  cursor: pointer;
}
```

### Immutable Update — Explain This in Interview

```javascript
// ❌ WRONG — mutates state directly
const toggleCell = (row, col) => {
  grid[row][col] = !grid[row][col];
  setGrid(grid); // same reference — React may not re-render!
};

// ✅ CORRECT — new array references at every level
const toggleCell = (row, col) => {
  setGrid((prev) =>
    prev.map((r, ri) =>
      ri === row
        ? r.map((cell, ci) => (ci === col ? !cell : cell))
        : r
    )
  );
};
```

### Flat Array Alternative (some interviewers prefer)

```jsx
function useGridFlat(rows, cols) {
  const [cells, setCells] = useState(() => Array(rows * cols).fill(false));

  const toggle = (index) => {
    setCells((prev) =>
      prev.map((cell, i) => (i === index ? !cell : cell))
    );
  };

  const getCell = (row, col) => cells[row * cols + col];

  return { cells, toggle, getCell, rows, cols };
}
```

### What Interviewers Look For

| Criteria | How to demonstrate |
|----------|-------------------|
| State management | 2D array or flat array with clear indexing |
| Immutable updates | `map` — never direct mutation |
| Component design | Hook + presentational components |
| Event handling | Correct row/col passed to handler |
| Clean code | Named functions, no magic numbers |
| Bonus | a11y (`aria-pressed`), select all, reset |

---

# Round 3 — Culture Fit


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Culture Fit & Behavioral Questions

### Theory

Blinkit's culture round assesses **how you work**, not what you know. They evaluate problem-solving approach, ownership, collaboration, and fit for a **fast-paced consumer product** (10-minute delivery).

Use the **STAR method**: Situation → Task → Action → Result.

### One-Line Interview Answer

> I describe real projects with measurable impact, explain my debugging process clearly, and show I collaborate well in fast-moving teams — with examples, not generic claims.

### Previous Projects — How to Answer

Structure your answer:

1. **What** — product/feature in one sentence
2. **Your role** — what you specifically built
3. **Tech stack** — React, state management, APIs
4. **Impact** — metrics if possible (load time, conversion, bug reduction)
5. **Challenge** — one hard problem you solved

**Example answer:**

> "At my last role I built the checkout flow for an e-commerce app. I owned the cart page and payment integration using React and Redux. The main challenge was handling partial API failures — if the inventory check failed but payment succeeded. I implemented optimistic UI with rollback and idempotent payment requests. Cart abandonment dropped 12% after we fixed loading states and error messaging."

### Problem Solving Approach

Interviewers want your **process**, not just the answer:

```
1. Clarify requirements    → "Should toggle affect neighbors?"
2. Break down the problem  → State, UI, events separately
3. Start simple            → Basic toggle before row/column
4. Test edge cases         → Empty grid, all selected, rapid clicks
5. Iterate                 → Add a11y, reset, count after MVP works
```

**Example answer:**

> "When I hit a bug, I reproduce it consistently first, then check the network tab and React DevTools. I add console logs or breakpoints at the state update boundary. For a recent CORS issue, I traced the preflight OPTIONS response and found the server wasn't returning the right Allow-Headers — fixed it with the backend team in one PR."

### Engineering Mindset

Traits Blinkit likely values:

| Trait | Example to mention |
|-------|-------------------|
| **Ownership** | "I didn't wait for QA — I added unit tests for edge cases" |
| **User-first** | "I optimized skeleton loaders because users on 3G saw blank screens" |
| **Pragmatism** | "Shipped MVP with long polling, migrated to WebSocket in v2" |
| **Learning** | "I hadn't used IndexedDB — I read docs, built a POC in a day" |
| **Performance** | "Virtualized a 500-item product list — scroll went from janky to 60fps" |

### Team Collaboration

**Example questions & answers:**

**"Tell me about a disagreement with a teammate."**

> "A teammate wanted to use Context for all global state. I preferred Redux for cart because of DevTools and middleware. We listed requirements — debuggability, async cart sync, team familiarity — and agreed Redux for cart/auth, Context for theme. We documented the decision in ADR format."

**"How do you handle tight deadlines?"**

> "I prioritize MVP scope with the PM — what's blocking launch vs nice-to-have. For a festival sale page, we shipped core catalog + cart first, deferred animations. I communicated trade-offs early so stakeholders weren't surprised."

**"How do you code review?"**

> "I check correctness first, then readability, then edge cases. I ask questions rather than dictate — 'What happens if this API returns null?' I approve quickly when tests cover the happy and error paths."

### Questions to Ask Them

Shows genuine interest:

- "How does the frontend team handle real-time inventory updates across warehouses?"
- "What's the balance between web and mobile web at Blinkit?"
- "How do you measure frontend performance in production?"
- "What does the on-call rotation look like for frontend engineers?"

---

# Quick Revision Cheat Sheet

| Round | Topic | One-liner |
|-------|-------|-----------|
| 1 | CORS | Server must allow cross-origin; fix on backend |
| 1 | WebSockets | Persistent duplex — live orders, wss + reconnect |
| 1 | Long polling vs WS | Polling = held HTTP; WS = true real-time |
| 1 | Storage | local = persistent; session = tab; cookies = server; IDB = large |
| 1 | Event loop | Sync → all microtasks → one macrotask |
| 2 | Grid toggle | 2D boolean array, immutable map toggle |
| 3 | Culture | STAR stories, process, collaboration examples |

---

# Blinkit-Specific Prep Tips

1. **Round 1** — Draw the event loop on paper. Know CORS headers by name.
2. **Round 2** — Practice Grid Toggle in 30 minutes without AI. Start basic, then refactor.
3. **Round 3** — Prepare 2 project stories and 1 conflict/collaboration story.
4. **Domain angle** — Mention real-time inventory, fast checkout, offline cart — shows you understand quick commerce.

---

*Blinkit SDE-1 interviews reward engineers who understand browsers and real-time systems — not just component syntax. Master Round 1 concepts and you'll stand out.*


<p><a href="#i7">Back to index</a></p>
