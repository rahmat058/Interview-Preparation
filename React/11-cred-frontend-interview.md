---
title: "CRED Frontend Developer Interview Preparation (Bangalore)"
description: "5-round CRED interview guide — vanilla JS, React forms, reconciliation, Next.js rendering, and cultural fit with theory, pros/cons, and full code examples."
tags:
  ["cred", "react", "javascript", "interview", "bangalore", "machine-coding"]
level: "3–6 years (28 LPA)"
company: "CRED"
rounds: 5
---

# CRED Frontend Developer Interview Preparation (Bangalore)

CRED runs **5 rounds** across separate days — testing **vanilla JS depth**, **React state design**, **browser internals**, and **cultural fit**. Each topic includes **Theory**, **Pros & Cons**, and **Real-Life Examples**.

> **Key insight:** CRED wants **depth, not memorized answers**. Vanilla JS fundamentals matter as much as React. Reaching for React immediately in Round 2 is a red flag.

---

<a id="quick-index"></a>

## Quick index


### Round 1 — Technical (90 mins)

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Projects deep dive](#p1) |
| <span id="i2"></span>2 | [Event bubbling vs event delegation](#p2) |
| <span id="i3"></span>3 | [defer vs async — HTML parsing](#p3) |
| <span id="i4"></span>4 | [Why CSS blocks rendering](#p4) |
| <span id="i5"></span>5 | [Debounce from scratch (cancellable)](#p5) |
| <span id="i6"></span>6 | [Closure memory leak + fix](#p6) |

### Round 2 — Machine Coding + JS Deep Dive (90 mins)

| # | Section |
| --- | --- |
| <span id="i7"></span>7 | [Live search box — vanilla JS](#p7) |
| <span id="i8"></span>8 | [React reconciliation — what updates](#p8) |
| <span id="i9"></span>9 | [50 components, one context — re-renders](#p9) |
| <span id="i10"></span>10 | [Event loop — microtasks vs macrotasks](#p10) |
| <span id="i11"></span>11 | [Next.js SSR vs CSR vs ISR — real trade-offs](#p11) |

### Round 3 — Machine Coding in React (90 mins)

| # | Section |
| --- | --- |
| <span id="i12"></span>12 | [Multi-field form — PAN, Aadhaar, validations](#p12) |
| <span id="i13"></span>13 | [10+ fields — unnecessary re-renders](#p13) |
| <span id="i14"></span>14 | [Single state object vs individual useState](#p14) |
| <span id="i15"></span>15 | [Dependent fields — state structure](#p15) |

### Round 4 — Cultural Fit (60 mins)

| # | Section |
| --- | --- |
| <span id="i16"></span>16 | [Technical weaknesses + growth plan](#p16) |
| <span id="i17"></span>17 | [Approaching an unfamiliar codebase](#p17) |
| <span id="i18"></span>18 | [A decision you regretted](#p18) |

### Meta

| # | Section |
| --- | --- |
| <span id="i19"></span>19 | [Why CRED specifically](#p19) |
| <span id="i20"></span>20 | [Round-by-round prep strategy](#p20) |

---
# Round 1 — Technical (90 mins)

<a id="p1"></a>

## 1. Projects deep dive

### Theory

CRED Round 1 opens with a **deep project walkthrough** — not a resume summary. They probe: what you built, **why** you made specific technical choices, what broke, and **what you'd do differently** today.

Use **STAR** for features but add a **technical decision layer**: alternatives considered, trade-offs, metrics.

### What interviewers probe

| Question                     | What they want                          |
| ---------------------------- | --------------------------------------- |
| Why this architecture?       | Trade-off thinking, not "it was trendy" |
| What broke in production?    | Ownership, debugging skill              |
| What would you redo?         | Growth mindset, hindsight learning      |
| How did you measure success? | Impact, not just code                   |

### Real-Life Example — Answer skeleton

> **Project:** Payment checkout flow for a fintech app handling UPI, cards, and wallet.
>
> **What I built:** Multi-step checkout with real-time payment status via WebSocket, optimistic cart updates, and retry logic for failed UPI intents.
>
> **Why:** Chose TanStack Query for payment status polling with exponential backoff instead of raw setInterval — automatic dedup and cache invalidation. Used optimistic updates for cart because 95% of add-to-cart succeeds; rollback on failure.
>
> **What I'd do differently:** Initially stored payment tokens in localStorage — migrated to httpOnly cookies after security review. Would also split the 800-line checkout component into feature slices from day one.
>
> **Metrics:** Payment success rate improved 4% → 97.2%. Checkout abandonment dropped 18% after adding skeleton loaders and fixing CLS.

### Pros & Cons framing (for "why X over Y")

| Choice                       | Pros                      | Cons                  | When CRED cares              |
| ---------------------------- | ------------------------- | --------------------- | ---------------------------- |
| React Query vs Redux for API | Less boilerplate, caching | Another dependency    | Server vs client state split |
| WebSocket vs polling         | Real-time                 | Connection management | Payment status UX            |
| Monolith vs micro-frontend   | Simpler                   | Team scaling          | Only if you led the decision |

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Event bubbling vs event delegation

### Theory

**Event bubbling** is a **mechanism** — after an event fires on a target, it propagates upward through ancestors (target → parent → ... → window).

**Event delegation** is a **pattern** — attach one listener on a parent and handle events from children using `event.target` and bubbling.

They are related but not the same. Delegation **uses** bubbling. You can bubble without delegating (each child has its own listener that bubbles up).

### When each actually matters

| Situation                    | Bubbling matters                              | Delegation matters                  |
| ---------------------------- | --------------------------------------------- | ----------------------------------- |
| Nested click handlers        | `stopPropagation()` to prevent parent handler | One listener for 100 list items     |
| Modal overlay click-to-close | Click on content bubbles to overlay           | —                                   |
| Dynamically added DOM nodes  | —                                             | Delegation works without re-binding |
| Memory / performance         | Many listeners vs one                         | 1000 rows → 1 listener              |

### Pros & Cons

| Event delegation                              | Individual listeners                   |
| --------------------------------------------- | -------------------------------------- |
| ✅ Fewer listeners, less memory               | ✅ Explicit per-element control        |
| ✅ Works for dynamic children                 | ✅ Easier to debug which handler fired |
| ❌ Must filter with `closest()` / `matches()` | ❌ Must re-bind on DOM changes         |
| ❌ Doesn't work for non-bubbling events\*     | ❌ 1000 items = 1000 listeners         |

\*Non-bubbling: `focus`, `blur`, `scroll` — use capture phase or direct binding.

### Real-Life Example

```javascript
// BUBBLING — event travels up
document.getElementById("card").addEventListener("click", () => {
  console.log("card clicked");
});
document.getElementById("btn").addEventListener("click", (e) => {
  console.log("button clicked");
  e.stopPropagation(); // prevents "card clicked"
});

// DELEGATION — one listener on parent
const transactionList = document.getElementById("transactions");

transactionList.addEventListener("click", (e) => {
  const row = e.target.closest("[data-txn-id]");
  if (!row) return;

  const action = e.target.closest("[data-action]")?.dataset.action;
  const txnId = row.dataset.txnId;

  if (action === "view") openTransaction(txnId);
  if (action === "dispute") openDispute(txnId);
});

// New transactions appended later — delegation still works, zero re-binding
```

### Interview answer (concise)

> Bubbling is the propagation mechanism — events travel from target to root. Delegation is a pattern that exploits bubbling: one parent listener handles events from all children via `event.target`. Delegation matters for dynamic lists and performance. Bubbling matters when you need `stopPropagation` — like preventing modal content clicks from closing the overlay.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. defer vs async — which blocks HTML parsing?

### Theory

Both `<script defer>` and `<script async>` are **non-blocking downloads** — the browser fetches them in parallel while continuing to parse HTML. The difference is **when they execute**:

| Attribute       | Download      | Execute                                            | Blocks parsing?                                    |
| --------------- | ------------- | -------------------------------------------------- | -------------------------------------------------- |
| _(none)_        | Blocks parser | Immediately                                        | **Yes — blocks parsing AND download**              |
| `async`         | Parallel      | As soon as downloaded                              | No parsing block, but **execution blocks parsing** |
| `defer`         | Parallel      | After HTML fully parsed, before `DOMContentLoaded` | No — execution after parse complete                |
| `type="module"` | Parallel      | Deferred by default                                | No                                                 |

**Neither `async` nor `defer` blocks HTML parsing during download.** The classic blocking script has no attribute.

**Execution** of `async` scripts can interrupt parsing when they arrive. `defer` waits until parsing finishes.

### Pros & Cons

| defer                                    | async                               |
| ---------------------------------------- | ----------------------------------- |
| ✅ Preserves script order                | ✅ Executes ASAP                    |
| ✅ Safe for scripts that depend on DOM   | ✅ Good for independent analytics   |
| ✅ Predictable — before DOMContentLoaded | ❌ Order not guaranteed             |
| ❌ Waits for full parse                  | ❌ Can interrupt parsing on execute |

### Real-Life Example

```html
<!-- ❌ BLOCKS parsing — worst case -->
<script src="heavy-app.js"></script>

<!-- async — download parallel, execute when ready (may interrupt parse) -->
<script async src="analytics.js"></script>

<!-- defer — download parallel, execute after parse, in order -->
<script defer src="app.js"></script>
<script defer src="app-init.js"></script>
<!-- always runs after app.js -->

<!-- module — deferred by default -->
<script type="module" src="main.js"></script>
```

```
Timeline — defer:
[Parse HTML=========>][Execute defer scripts][DOMContentLoaded][Load event]

Timeline — async (script arrives mid-parse):
[Parse HTML===][EXEC async][Parse HTML===][DOMContentLoaded]
                  ↑ can interrupt parsing

Timeline — no attribute:
[STOP parse][Download+Execute script][Resume parse...]
```

### Interview answer (concise)

> Neither defer nor async blocks HTML parsing during download — both fetch in parallel. Plain `<script>` without attributes blocks parsing. `async` executes as soon as it's downloaded, which can interrupt parsing. `defer` waits until HTML parsing completes, then runs in order before DOMContentLoaded. Use defer for app scripts, async for independent third-party scripts.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Why does CSS block rendering?

### Theory

Browsers build the **render tree** by combining the **DOM** and **CSSOM** (CSS Object Model). The browser **cannot render** until it knows how elements look — so CSS is a **render-blocking resource**.

Pipeline:

```
HTML → DOM tree
CSS  → CSSOM tree
DOM + CSSOM → Render tree → Layout → Paint → Composite
```

If CSS hasn't loaded, the browser would show unstyled content (**FOUC** — Flash of Unstyled Content), then repaint when CSS arrives — causing layout shift and wasted work. So browsers block rendering until critical CSS is parsed.

**JavaScript can also block rendering** because `document.write` and synchronous scripts can modify DOM/CSSOM. CSS blocking is about the render tree dependency, not JS execution per se.

### Pros & Cons of render-blocking CSS

| Blocking (default)               | Non-blocking (media trick / async) |
| -------------------------------- | ---------------------------------- |
| ✅ No FOUC                       | ✅ Faster first paint              |
| ✅ Correct layout on first paint | ❌ Flash of unstyled content       |
| ❌ Delays first render           | ❌ CLS risk                        |

### Real-Life Example

```html
<!-- Render-blocking — browser waits before painting -->
<link rel="stylesheet" href="styles.css" />

<!-- Non-render-blocking — loads but doesn't block render -->
<link rel="stylesheet" href="print.css" media="print" />
<link rel="stylesheet" href="mobile.css" media="(max-width: 768px)" />

<!-- Critical CSS — inline above-the-fold styles -->
<style>
  .header {
    height: 64px;
    background: #0d0d0d;
  }
  .hero {
    min-height: 400px;
  }
</style>
<link
  rel="preload"
  href="styles.css"
  as="style"
  onload="this.rel='stylesheet'"
/>
```

**Optimization strategies CRED expects you to know:**

- Inline **critical CSS** for above-the-fold
- `media` attribute for non-critical stylesheets
- `preload` for important CSS
- Avoid `@import` in CSS (serial loading)
- Minimize CSS size — remove unused (PurgeCSS)

### Interview answer (concise)

> CSS blocks rendering because the browser needs the CSSOM to build the render tree — it won't paint until it knows how elements are styled, preventing FOUC. JS doesn't block rendering the same way, but synchronous scripts block HTML parsing which indirectly delays DOM/CSSOM. Optimize with critical inline CSS, preload, and media queries for non-critical styles.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Write a debounce function (cancellable)

### Theory

**Debouncing** delays execution until after a pause in calls. A **cancellable** debounce also exposes `.cancel()` to abort pending execution — essential for cleanup on unmount, route change, or explicit user action.

CRED asks you to write this **from scratch** — no lodash.

### Pros & Cons

| Cancellable debounce            | Basic debounce                         |
| ------------------------------- | -------------------------------------- |
| ✅ Cleanup on component unmount | ❌ Pending call may fire after unmount |
| ✅ Cancel on route change       |                                        |
| ✅ Abort stale API responses    |                                        |

### Real-Life Example

```javascript
function debounce(fn, delay) {
  let timerId;

  function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  }

  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
  };

  debounced.flush = function (...args) {
    clearTimeout(timerId);
    fn.apply(this, args);
  };

  return debounced;
}

// Usage
const search = debounce((query) => {
  fetch(`/api/search?q=${query}`).then(renderResults);
}, 300);

searchInput.addEventListener("input", (e) => search(e.target.value));

// Cancel on navigate away
router.beforeEach(() => search.cancel());

// Flush on form submit (don't wait for debounce)
form.addEventListener("submit", () => search.flush(input.value));
```

```javascript
// TypeScript version — CRED-grade
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): T & { cancel: () => void; flush: (...args: Parameters<T>) => void } {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn.apply(this, args);
    }, delay);
  } as T & { cancel: () => void; flush: (...args: Parameters<T>) => void };

  debounced.cancel = () => {
    if (timerId) clearTimeout(timerId);
    timerId = null;
  };

  debounced.flush = function (this: unknown, ...args: Parameters<T>) {
    debounced.cancel();
    fn.apply(this, args);
  };

  return debounced;
}
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Closure memory leak and fix

### Theory

A **memory leak** occurs when JavaScript retains references to objects that are no longer needed. Closures are a common cause — an inner function holds references to outer variables, preventing garbage collection of large objects even after the outer function returns.

### Pros & Cons

| Awareness of closure leaks             | Ignorance                            |
| -------------------------------------- | ------------------------------------ |
| ✅ Clean up timers, listeners, refs    | ❌ App slows over time               |
| ✅ Pass only needed data into closures | ❌ Detached DOM nodes stay in memory |
| ✅ Use WeakMap for DOM metadata        |                                      |

### Real-Life Example

```javascript
// ❌ LEAK — closure holds entire dataset forever
function createTransactionHandler(transactions) {
  // transactions = 50MB array
  return function handleClick(id) {
    const txn = transactions.find((t) => t.id === id);
    console.log(txn.amount);
  };
}

const handler = createTransactionHandler(hugeTransactionList);
button.addEventListener("click", handler);
// Even if button removed, handler + hugeTransactionList stay in memory

// ✅ FIX 1 — pass only what's needed
function createTransactionHandler(transactionMap) {
  return function handleClick(id) {
    console.log(transactionMap.get(id)?.amount);
  };
}

// ✅ FIX 2 — remove listener on cleanup
function setupHandler(button, transactions) {
  const handler = (e) => {
    const id = e.target.dataset.id;
    console.log(transactions.find((t) => t.id === id)?.amount);
  };
  button.addEventListener("click", handler);
  return () => button.removeEventListener("click", handler);
}

// ✅ FIX 3 — WeakMap for DOM-associated data (GC when element removed)
const txnMetadata = new WeakMap();
function attachTransaction(el, data) {
  txnMetadata.set(el, { id: data.id, amount: data.amount });
  // When el is GC'd, WeakMap entry is GC'd too
}
```

```javascript
// ❌ LEAK — interval in closure
function startPolling(userId) {
  const cache = loadMassiveUserCache(userId);
  setInterval(() => {
    updateUI(cache.lastBalance);
  }, 1000);
  // Never cleared — cache lives forever
}

// ✅ FIX
function startPolling(userId) {
  let cache = loadMassiveUserCache(userId);
  const intervalId = setInterval(() => updateUI(cache.lastBalance), 1000);

  return () => {
    clearInterval(intervalId);
    cache = null; // release reference
  };
}
```

---

# Round 2 — Machine Coding + JS Deep Dive (90 mins)


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Live search box — vanilla JavaScript

### Theory

CRED explicitly tests **vanilla JS** — reaching for React is a red flag. Build a live search with:

1. **Debounced API calls** — don't hit server on every keystroke
2. **Keyboard navigation** — ArrowUp/Down, Enter, Escape
3. **Click outside to close** — mousedown on document
4. **Accessibility** — ARIA combobox pattern

### Pros & Cons

| Vanilla JS                      | React for this task      |
| ------------------------------- | ------------------------ |
| ✅ Shows DOM fundamentals       | ❌ CRED Round 2 red flag |
| ✅ No build step in interview   | Overkill for 90-min test |
| ✅ Proves you understand events |                          |

### Real-Life Example — Full implementation

```html
<div class="search" id="search-root">
  <label for="search-input" class="sr-only">Search transactions</label>
  <input
    id="search-input"
    type="search"
    role="combobox"
    aria-expanded="false"
    aria-controls="search-results"
    aria-autocomplete="list"
    placeholder="Search transactions..."
    autocomplete="off"
  />
  <ul id="search-results" role="listbox" hidden></ul>
</div>
```

```javascript
function debounce(fn, delay) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

class LiveSearch {
  constructor(root) {
    this.root = root;
    this.input = root.querySelector("#search-input");
    this.list = root.querySelector("#search-results");
    this.items = [];
    this.activeIndex = -1;
    this.abortController = null;

    this.debouncedSearch = debounce(this.search.bind(this), 300);
    this.bindEvents();
  }

  bindEvents() {
    this.input.addEventListener("input", () => {
      const q = this.input.value.trim();
      if (!q) return this.close();
      this.debouncedSearch(q);
    });

    this.input.addEventListener("keydown", (e) => this.handleKeydown(e));

    // Click outside to close
    document.addEventListener("mousedown", (e) => {
      if (!this.root.contains(e.target)) this.close();
    });
  }

  async search(query) {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: this.abortController.signal,
      });
      const data = await res.json();
      this.items = data.results ?? [];
      this.render();
      this.open();
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  }

  render() {
    this.list.innerHTML = this.items
      .map(
        (item, i) =>
          `<li role="option" id="option-${i}" aria-selected="${i === this.activeIndex}">
            ${item.label}
          </li>`,
      )
      .join("");

    this.list.querySelectorAll("li").forEach((li, i) => {
      li.addEventListener("mousedown", (e) => {
        e.preventDefault(); // prevent input blur before click
        this.select(i);
      });
    });
  }

  handleKeydown(e) {
    if (!this.items.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.activeIndex = Math.min(
          this.activeIndex + 1,
          this.items.length - 1,
        );
        this.highlight();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this.highlight();
        break;
      case "Enter":
        e.preventDefault();
        if (this.activeIndex >= 0) this.select(this.activeIndex);
        break;
      case "Escape":
        this.close();
        break;
    }
  }

  highlight() {
    this.list.querySelectorAll("li").forEach((li, i) => {
      li.setAttribute("aria-selected", i === this.activeIndex);
      li.classList.toggle("active", i === this.activeIndex);
    });
    this.input.setAttribute(
      "aria-activedescendant",
      `option-${this.activeIndex}`,
    );
  }

  select(index) {
    this.input.value = this.items[index].label;
    this.close();
    // navigate or callback
    console.log("Selected:", this.items[index]);
  }

  open() {
    this.list.hidden = false;
    this.input.setAttribute("aria-expanded", "true");
    this.activeIndex = 0;
    this.highlight();
  }

  close() {
    this.list.hidden = true;
    this.input.setAttribute("aria-expanded", "false");
    this.activeIndex = -1;
    this.debouncedSearch.cancel();
  }

  destroy() {
    this.debouncedSearch.cancel();
    if (this.abortController) this.abortController.abort();
  }
}

new LiveSearch(document.getElementById("search-root"));
```

**What CRED evaluates:** debounce + cancel, AbortController, keyboard UX, click-outside, no framework dependency.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. React reconciliation — what to update?

### Theory

React reconciliation compares the new element tree with the previous Fiber tree and decides the **minimum DOM operations**.

**Update rules:**

1. **Different type** (`div` → `span`) → destroy entire subtree, rebuild
2. **Same type** → update props on DOM node, recurse children
3. **Same type + same key** → update in place, preserve state
4. **Keys differ in lists** → unmount old, mount new (or move if key matches)

React **bails out** if `Object.is(oldState, newState)` for state, or if `React.memo` shallow-compares equal props.

### Pros & Cons

| Understanding reconciliation | Ignorance                       |
| ---------------------------- | ------------------------------- |
| ✅ Know why keys matter      | ❌ Index keys cause state bugs  |
| ✅ Targeted memoization      | ❌ Random React.memo everywhere |
| ✅ Predict render behavior   | ❌ Unnecessary DOM work         |

### Real-Life Example

```jsx
// Case 1: Same type — UPDATE props only
// Before: <div className="card"><h2>₹500</h2></div>
// After:  <div className="card active"><h2>₹500</h2></div>
// → Only className updated on div

// Case 2: Different type — REPLACE subtree
// Before: <div><TransactionList /></div>
// After:  <section><TransactionList /></section>
// → TransactionList unmounts and remounts — state lost

// Case 3: Keys in list
// Before: [<Row key="a" />, <Row key="b" />]
// After:  [<Row key="b" />, <Row key="a" />]
// → React MOVES nodes — state preserved

// Case 4: Bailout
function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(0)}>{n}</button>; // click at 0 → no re-render
}
```

### Interview answer (concise)

> Reconciliation diffs old and new trees. Same element type updates props in place. Different type replaces the subtree. Keys identify list items for efficient moves. React skips re-renders when state/props are unchanged (Object.is). Commit phase applies only the DOM mutations the diff marks.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. 50 components, one context — re-renders

### Theory

When a Context **value changes**, **every component that calls `useContext`** for that context re-renders — regardless of whether it uses the part that changed.

50 components sharing one context → **all 50 re-render** on any context update.

This is why CRED asks this — they want you to know Context is not a free global store.

### Pros & Cons

| Single large context           | Split contexts / Zustand selectors             |
| ------------------------------ | ---------------------------------------------- |
| ❌ 50 re-renders on any change | ✅ Only subscribers to changed slice re-render |
| ✅ Simple setup                | Slightly more setup                            |
| ❌ Performance death at scale  | ✅ Scales to CRED-level apps                   |

### Real-Life Example

```jsx
// ❌ One context — 50 components all re-render when theme OR user changes
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState([]);

  // New object every render → ALL consumers re-render
  const value = { user, setUser, theme, setTheme, notifications, setNotifications };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 50 components:
function Header() { const { user } = useContext(AppContext); ... }
function Sidebar() { const { theme } = useContext(AppContext); ... }
function NotifBell() { const { notifications } = useContext(AppContext); ... }
// theme changes → Header, Sidebar, NotifBell ALL re-render even if they don't use theme
```

```jsx
// ✅ FIX 1 — Split contexts
const UserContext = createContext();
const ThemeContext = createContext();

// theme change → only ThemeContext consumers re-render

// ✅ FIX 2 — Memoize value
const userValue = useMemo(() => ({ user, setUser }), [user]);

// ✅ FIX 3 — Zustand with selectors
const theme = useStore((s) => s.theme); // only re-renders when theme changes

// ✅ FIX 4 — React 19 use(Context) + smaller providers per route
```

### Interview answer (concise)

> All 50 components that consume the context re-render when the Provider value changes — React doesn't know which field each component uses. Fix by splitting contexts by update frequency, memoizing the value object, or using Zustand/Jotai with selectors so components subscribe only to the slice they need.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Event loop — microtasks vs macrotasks

### Theory

**Order:** Sync code → **drain all microtasks** → **one macrotask** → repeat.

| Microtasks                   | Macrotasks                   |
| ---------------------------- | ---------------------------- |
| `Promise.then/catch/finally` | `setTimeout` / `setInterval` |
| `queueMicrotask()`           | I/O callbacks                |
| `await` continuation         | UI events (click, scroll)    |
| `MutationObserver`           | `requestAnimationFrame`\*    |

- rAF is its own queue, runs before paint.

### Real-Life Example

```javascript
console.log("1");

setTimeout(() => console.log("5"), 0);

Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));

queueMicrotask(() => console.log("3b"));

console.log("2");

// 1 → 2 → 3 → 3b → 4 → 5
```

```javascript
// CRED-style trap
async function foo() {
  console.log("A");
  await bar();
  console.log("B");
}

async function bar() {
  console.log("C");
}

console.log("D");
foo();
console.log("E");

// D → A → C → E → B
// await bar() runs bar synchronously until its first await,
// then foo resumes as microtask after sync code
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Next.js SSR vs CSR vs ISR

### Theory — real trade-offs, not definitions

|                     | CSR                     | SSR                  | ISR                  |
| ------------------- | ----------------------- | -------------------- | -------------------- |
| **First byte**      | Fast (empty shell)      | Slower (server work) | Fast (CDN cached)    |
| **SEO**             | Poor without extra work | Excellent            | Excellent            |
| **Data freshness**  | Client fetch            | Always current       | TTL-based stale      |
| **Server cost**     | Low                     | High at scale        | Low                  |
| **TTFB**            | Low                     | Higher               | Low (edge)           |
| **Personalization** | Easy (client)           | Per-request          | Hard (cached)        |
| **CRED use case**   | Dashboard post-login    | Account settings     | Credit score landing |

### Pros & Cons — when CRED would choose each

| CSR                      | SSR                            | ISR                        |
| ------------------------ | ------------------------------ | -------------------------- |
| ✅ Post-auth app screens | ✅ User-specific bill pay page | ✅ Marketing / SEO pages   |
| ✅ No server render cost | ✅ Always fresh balance        | ✅ 1M users, same HTML     |
| ❌ Blank until JS loads  | ❌ Server spike at peak        | ❌ Stale for TTL window    |
| ❌ Bad for crawlers      | ❌ TTFB dependency             | ❌ Invalidation complexity |

### Real-Life Example

```tsx
// CSR — CRED app dashboard (authenticated, no SEO need)
"use client";
export default function Dashboard() {
  const { data } = useQuery({ queryKey: ["rewards"], queryFn: fetchRewards });
  return <RewardsCard data={data} />;
}

// SSR — personalized credit card bill (must be fresh, user-specific)
export async function getServerSideProps({ req }) {
  const bill = await fetchBill(req.cookies.session);
  return { props: { bill } };
}

// ISR — credit score explainer page (SEO, same for all, refresh hourly)
export async function getStaticProps() {
  const content = await fetchCMSContent("credit-score-guide");
  return { props: { content }, revalidate: 3600 };
}
```

### Interview answer (concise)

> For CRED: ISR for public SEO pages (score guides, landing) — fast CDN, cheap. SSR for personalized financial data that must be fresh on first paint. CSR for authenticated app experiences where SEO doesn't matter and we want rich interactivity. The trade-off is always freshness vs speed vs server cost.

---

# Round 3 — Machine Coding in React (90 mins)


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Multi-field form — PAN, Aadhaar

### Theory

CRED Round 3 tests **KYC-style forms** — PAN, Aadhaar, with strict validation, error states, and **state design before coding**. They watch your architecture decisions before you write the first `<input>`.

**Validation rules (typical):**

- **PAN:** `AAAAA9999A` — 5 letters, 4 digits, 1 letter
- **Aadhaar:** 12 digits, Verhoeff checksum (or format-only in interviews)

### Pros & Cons — form libraries vs custom

| React Hook Form                                  | Manual useState              |
| ------------------------------------------------ | ---------------------------- |
| ✅ Less re-renders (uncontrolled)                | ✅ Full control in interview |
| ✅ Built-in validation                           | ❌ More boilerplate          |
| Interview: either works if state design is clean |                              |

### Real-Life Example

```tsx
// validators.ts — pure functions, easy to test
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const AADHAAR_REGEX = /^\d{12}$/;

export function validatePAN(value: string): string | null {
  if (!value) return "PAN is required";
  if (!PAN_REGEX.test(value.toUpperCase()))
    return "Invalid PAN format (e.g. ABCDE1234F)";
  return null;
}

export function validateAadhaar(value: string): string | null {
  const digits = value.replace(/\s/g, "");
  if (!digits) return "Aadhaar is required";
  if (!AADHAAR_REGEX.test(digits)) return "Aadhaar must be 12 digits";
  return null;
}

export function validateFullName(value: string): string | null {
  if (!value.trim()) return "Full name is required";
  if (value.trim().length < 3) return "Name too short";
  return null;
}
```

```tsx
// KYCForm.tsx — controlled fields with per-field errors
type FormState = {
  fullName: string;
  pan: string;
  aadhaar: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  fullName: "",
  pan: "",
  aadhaar: "",
  consent: false,
};

function KYCForm() {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  const validators: Record<string, (v: string) => string | null> = {
    fullName: validateFullName,
    pan: validatePAN,
    aadhaar: validateAadhaar,
  };

  const setField = (field: keyof FormState, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field] && typeof value === "string") {
      const error = validators[field]?.(value) ?? null;
      setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = values[field];
    if (typeof val === "string") {
      const error = validators[field]?.(val);
      setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    (["fullName", "pan", "aadhaar"] as const).forEach((field) => {
      const err = validators[field](values[field] as string);
      if (err) newErrors[field] = err;
    });
    if (!values.consent) newErrors.consent = "Consent is required";
    setErrors(newErrors);
    setTouched({ fullName: true, pan: true, aadhaar: true, consent: true });
    if (Object.keys(newErrors).length === 0) submitKYC(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        label="Full Name"
        id="fullName"
        value={values.fullName}
        error={touched.fullName ? errors.fullName : undefined}
        onChange={(v) => setField("fullName", v)}
        onBlur={() => handleBlur("fullName")}
      />
      <Field
        label="PAN"
        id="pan"
        value={values.pan}
        error={touched.pan ? errors.pan : undefined}
        onChange={(v) => setField("pan", v.toUpperCase())}
        onBlur={() => handleBlur("pan")}
        maxLength={10}
        placeholder="ABCDE1234F"
      />
      <Field
        label="Aadhaar"
        id="aadhaar"
        value={values.aadhaar}
        error={touched.aadhaar ? errors.aadhaar : undefined}
        onChange={(v) => setField("aadhaar", v.replace(/\D/g, "").slice(0, 12))}
        onBlur={() => handleBlur("aadhaar")}
        inputMode="numeric"
      />
      <button type="submit">Verify & Continue</button>
    </form>
  );
}
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Optimize 10+ fields — re-renders

### Theory

With **one state object**, every keystroke in any field re-renders the **entire form** and all 10+ field components.

Fields that cause unnecessary re-renders:

- All fields when using single `useState({ ...10 fields })`
- Parent re-render → all unmemoized children re-render
- Context provider wrapping form with changing value
- Inline object/function props to child fields

### Pros & Cons

| React Hook Form (uncontrolled)         | Single useState object                   |
| -------------------------------------- | ---------------------------------------- |
| ✅ Field change doesn't re-render form | ❌ Every keystroke re-renders all fields |
| ✅ Scales to 50+ fields                | ✅ Simple mental model                   |
| Industry standard for large forms      | OK for <5 fields                         |

### Real-Life Example

```tsx
// ❌ BAD — typing in field 1 re-renders fields 1-10
function BigForm() {
  const [form, setForm] = useState({ f1: "", f2: "", ... f10: "" });
  return (
    <>
      {FIELDS.map((f) => (
        <input
          key={f}
          value={form[f]}
          onChange={(e) => setForm({ ...form, [f]: e.target.value })}
        />
      ))}
    </>
  );
}

// ✅ GOOD — memoized field components
const FormField = React.memo(function FormField({
  label, value, error, onChange, onBlur,
}: FieldProps) {
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
      {error && <span role="alert">{error}</span>}
    </div>
  );
});

// ✅ BETTER — React Hook Form (CRED production pattern)
import { useForm } from "react-hook-form";

function OptimizedKYCForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("pan", { validate: validatePAN })} />
      {errors.pan && <span>{errors.pan.message}</span>}
      {/* Only error display re-renders — not entire form */}
    </form>
  );
}
```

**What to say in interview:** "I'd start with isolated field components + memo. For 10+ fields I'd switch to React Hook Form because it uses refs — field keystrokes don't re-render siblings."

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Single state object vs individual useState

### Theory

|                 | Single object                | Individual useState                |
| --------------- | ---------------------------- | ---------------------------------- |
| Update          | `setForm({...form, pan: x})` | `setPan(x)`                        |
| Re-render scope | Whole form re-renders        | Whole component still re-renders\* |
| Validation      | Easy cross-field rules       | Must coordinate multiple states    |
| Submit          | One object ready             | Must assemble                      |
| Risk            | Mutating state directly      | 10+ setter names                   |

\*Individual useState still re-renders the whole function component — memoized children help.

### What breaks in each

| Single object breaks when... | Individual useState breaks when...      |
| ---------------------------- | --------------------------------------- |
| You mutate: `form.pan = x`   | Cross-field validation (PAN name match) |
| Spread typo misses fields    | Submit assembly forgotten               |
| One huge re-render tree      | 10 useState calls — verbose             |
| Deep nesting grows           | Dependent fields get messy              |

### Real-Life Example

```tsx
// Single object — good for submit, bad for perf without memo
const [form, setForm] = useState({ pan: "", aadhaar: "", name: "" });
const update = (field: string, value: string) =>
  setForm((prev) => ({ ...prev, [field]: value }));

// Individual — good for simple fields
const [pan, setPan] = useState("");
const [aadhaar, setAadhaar] = useState("");

// useReducer — CRED sweet spot for complex forms
type Action =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "SET_ERRORS"; errors: FormErrors }
  | { type: "RESET" };

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return INITIAL;
    default:
      return state;
  }
}

const [form, dispatch] = useReducer(formReducer, INITIAL);
```

**Interview recommendation:** useReducer or React Hook Form for 10+ fields with cross-validation.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Dependent field state structure

### Theory

When **field B depends on field A** (e.g., city depends on state, verification method depends on ID type), flat state becomes awkward. Structure options:

1. **Derived state** — compute B options from A, don't store redundantly
2. **Nested state** — `{ address: { state, city } }`
3. **Reset dependent on parent change** — when A changes, clear B

### Pros & Cons

| Derived (computed)                  | Stored separately                          |
| ----------------------------------- | ------------------------------------------ |
| ✅ Single source of truth           | ❌ Can desync (city invalid for new state) |
| ✅ No stale city when state changes | ❌ Must manually reset                     |
| Must recalculate on render          | Extra sync logic                           |

### Real-Life Example

```tsx
const STATES_CITIES: Record<string, string[]> = {
  Karnataka: ["Bangalore", "Mysore"],
  Maharashtra: ["Mumbai", "Pune"],
};

function AddressForm() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // Derived — cities depend on state
  const cityOptions = state ? (STATES_CITIES[state] ?? []) : [];

  const handleStateChange = (newState: string) => {
    setState(newState);
    setCity(""); // reset dependent field — CRITICAL
  };

  return (
    <>
      <Select
        label="State"
        value={state}
        onChange={handleStateChange}
        options={Object.keys(STATES_CITIES)}
      />
      <Select
        label="City"
        value={city}
        onChange={setCity}
        options={cityOptions}
        disabled={!state}
      />
    </>
  );
}

// KYC: IFSC depends on bank selection
function BankDetails() {
  const [bankCode, setBankCode] = useState("");
  const [ifsc, setIfsc] = useState("");

  const handleBankChange = (code: string) => {
    setBankCode(code);
    setIfsc(""); // reset
  };

  // Validate IFSC prefix matches bank
  const validateIFSC = (value: string) => {
    if (!bankCode) return "Select bank first";
    if (!value.startsWith(bankCode.slice(0, 4)))
      return "IFSC doesn't match selected bank";
    return null;
  };
}
```

**State design answer for CRED:** "Parent field change dispatches SET_FIELD for parent + clears child. Child options are derived, not stored. Cross-field validation runs on submit and on parent blur."

---

# Round 4 — Cultural Fit (60 mins)


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Technical weaknesses

### Theory

CRED's Tech Lead **opens with feedback from all 3 previous rounds** and asks where you're weak. They watch for **honesty, self-awareness, and action** — not perfection.

### Pros & Cons of answer approaches

| Do                                    | Don't                                    |
| ------------------------------------- | ---------------------------------------- |
| Name a real gap with a learning plan  | "I don't have weaknesses"                |
| Reference something Round 1-3 exposed | Blame interviewers or questions          |
| Show progress already made            | Be defensive about feedback              |
| Connect weakness to growth            | List fake weaknesses ("I work too hard") |

### Real-Life Example — Answer skeleton

> Round 2 feedback showed my vanilla JS DOM skills were rusty — I default to React too quickly. Since then I've rebuilt two components in plain JS: an autocomplete and an infinite scroll list. I also spent time on the WHATWG event model and can now explain delegation vs bubbling with concrete examples.
>
> My ongoing gap is **system design for frontend at scale** — I've worked on features but not owned full architecture. I'm reading through "Frontend Architecture" patterns and built a small monorepo side project with Module Federation to practice.

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Unfamiliar codebase

### Theory

They want your **onboarding process** — how you become productive without breaking things.

### Real-Life Example — Answer skeleton

> **Week 1 — Observe:** Clone, run locally, read README and ADRs. Don't change code. Trace one user flow end-to-end in debugger (login → payment). Map folder structure and ask "why" in 1:1s.
>
> **Week 2 — Small wins:** Fix a good-first-issue bug. Add a test to understand testing patterns. Pair with someone on a small PR.
>
> **Ongoing:** Keep a personal doc of "gotchas" (env vars, feature flags, deploy process). Prefer reading existing code over introducing new patterns until I understand conventions.
>
> **Tools:** Source graph / IDE find references, git blame for context, React DevTools for component tree, Redux DevTools if applicable.

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. A decision you regretted

### Theory

Tests **humility, learning, and judgment**. Structure: decision → why it seemed right → what went wrong → what you do differently now.

### Real-Life Example — Answer skeleton

> **Decision:** Chose to build a custom form validation library instead of adopting React Hook Form for a KYC flow.
>
> **Why:** Wanted zero dependencies and full control. Team was small, timeline seemed comfortable.
>
> **Regret:** Spent 3 sprints on edge cases RHF already handles. Introduced subtle re-render bugs we didn't catch until QA. Delayed the feature launch.
>
> **Now:** Default to battle-tested libraries for solved problems. Custom code only when there's a specific requirement libraries can't meet. I evaluate "build vs buy" with a time-boxed spike first.

**CRED tip:** Defensiveness ends interviews. Acknowledge feedback, thank them, show what changed.

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Why CRED specifically

### Theory

Generic "fintech is growing" answers fail. CRED wants **specific motivation** — product, design culture, tech challenges, user base.

### Real-Life Example — Points to personalize

| Generic (avoid)     | CRED-specific (use)                                                 |
| ------------------- | ------------------------------------------------------------------- |
| "Fintech is hot"    | "CRED rewards responsible credit behavior — rare mission alignment" |
| "Good salary"       | "CRED's design-first culture — consumer fintech UX at Indian scale" |
| "React job"         | "Complex KYC, payments, real-time credit — frontend depth I want"   |
| "Bangalore startup" | "Engineering blog / open source / craft standards I've followed"    |

> I'm drawn to CRED because you're solving trust and design in Indian fintech — not just transactions. The KYC flows, payment reliability, and premium UX at scale are exactly the problems I want to work on. I've used CRED as a user and noticed how much attention goes into micro-interactions and error states — that's the engineering culture I want.

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. Round-by-round prep strategy

### Theory

CRED spreads rounds across **different days**. Use the gap to fix what went wrong.

| Round | Focus                                 | If you fail, fix before next                        |
| ----- | ------------------------------------- | --------------------------------------------------- |
| 1     | Browser internals, closures, projects | Write debounce from memory, CSS render blocking     |
| 2     | Vanilla JS live search                | Build autocomplete without React, event loop drills |
| 3     | React form state design               | KYC form with PAN/Aadhaar validation, RHF           |
| 4     | Cultural fit                          | Reflect on feedback, prepare honest weakness story  |
| 5     | (Final)                               | Usually offer/higher-level — review all weak areas  |

### Checklist before CRED

- [ ] Write cancellable debounce from scratch in 5 minutes
- [ ] Build vanilla JS search with keyboard nav + click outside
- [ ] Explain defer vs async with timeline diagram
- [ ] Explain CSS render blocking + critical CSS
- [ ] KYC form with validation — state design on whiteboard first
- [ ] Context re-render problem + 3 fixes
- [ ] SSR vs ISR trade-offs for CRED product examples
- [ ] Closure leak example + fix ready
- [ ] "Why CRED" answer — specific, not generic
- [ ] 2 project deep-dive stories with "what I'd do differently"

---

# Quick Revision Cheat Sheet

| Topic                  | One-liner                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Bubbling vs delegation | Mechanism vs pattern; delegation uses bubbling                                     |
| defer vs async         | Neither blocks download; async exec can interrupt parse; defer waits for parse end |
| CSS blocks render      | Needs CSSOM for render tree — prevents FOUC                                        |
| Cancellable debounce   | clearTimeout + `.cancel()` + `.flush()`                                            |
| Closure leak           | Inner fn holds large outer ref — cleanup/remove listener                           |
| Vanilla search         | Debounce + AbortController + keydown + mousedown outside                           |
| Reconciliation         | Same type update; diff type replace; keys for lists                                |
| 50 + context           | All consumers re-render — split context or selectors                               |
| Event loop             | Sync → all microtasks → one macrotask                                              |
| SSR/CSR/ISR            | Fresh vs fast vs SEO — CRED uses all three                                         |
| Form state             | RHF for 10+ fields; reset dependents on parent change                              |
| Cultural fit           | Honest weakness + action plan, no defensiveness                                    |

---

_CRED wants depth. Know why, not just what. Vanilla JS is non-negotiable for Round 2. State design is the whole test in Round 3. Use days between rounds to fix exactly what they told you went wrong._


<p><a href="#i20">Back to index</a></p>
