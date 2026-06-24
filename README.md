# Interview Preparation

**Personal frontend & full-stack interview prep repository** — runnable React machine-coding apps, markdown Q&A guides, Docker templates, and system design notes. Built to **run code locally**, **read architecture**, and **practice spoken interview answers**.

![CartPulse — Shopping Cart](./Projects/Projects-Images/09-shoping-cart.png)

---

## What This Repo Contains

| Section                     | Description                                                              | Folder                                                 |
| --------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| **Machine coding projects** | 10 complete React apps with README, architecture docs, and interview Q&A | [Projects/](./Projects/)                               |
| **React interviews**        | Fundamentals, senior topics, company-specific rounds, Next.js            | [React/](./React/)                                     |
| **Vue interviews**          | Vue 3, Pinia, Router, Nuxt, live coding                                  | [Vue/](./Vue/)                                         |
| **MERN stack**              | MongoDB, Express, React, Node, JWT, deployment                           | [MERN/](./MERN/)                                       |
| **Docker**                  | Interview Q&A + Dockerfile / Compose for React, Vue, Next, Nuxt, Node    | [Docker/](./Docker/)                                   |
| **JavaScript**              | Vanilla JS rounds, star patterns, LeetCode-style helpers                 | [Javascript/](./Javascript/)                           |
| **System design**           | Scalability, core components, design process, file upload case           | [System Design/](./System%20Design/)                   |
| **Architecture diagrams**   | CDN, load balancer, caching, sharding, microservices                     | [Advanced Topic Images/](./Advanced%20Topic%20Images/) |

---

## Machine Coding Projects (10)

Hands-on UI challenges — each folder has **`README.md`**, **`ARCHITECTURE.md`**, and **`INTERVIEW-QUESTIONS.md`**.

| #   | Codename       | What it teaches                                 | Folder                                                         |
| --- | -------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| 1   | **QueryLens**  | Debounce, keyboard nav, ARIA combobox           | [01-autocomplete-search](./Projects/01-autocomplete-search/)   |
| 2   | **FlowFeed**   | Infinite scroll, Intersection Observer          | [02-infinite-scroll-feed](./Projects/02-infinite-scroll-feed/) |
| 3   | **TreeScope**  | Recursive tree, expand/collapse                 | [03-file-explorer](./Projects/03-file-explorer/)               |
| 4   | **FlowBoard**  | Drag & drop, normalized kanban state            | [04-kanban-board](./Projects/04-kanban-board/)                 |
| 5   | **GridLens**   | Sort, filter, search, pagination pipeline       | [05-data-table](./Projects/05-data-table/)                     |
| 6   | **FormFlow**   | Multi-step form, RHF + Zod, persistence         | [06-multi-step-form](./Projects/06-multi-step-form/)           |
| 7   | **LayerForge** | Modal stack, focus trap, Escape key             | [07-modal-manager](./Projects/07-modal-manager/)               |
| 8   | **ThreadNest** | Nested comments, immutable tree updates         | [08-nested-comments](./Projects/08-nested-comments/)           |
| 9   | **CartPulse**  | Shopping cart, Redux selectors, derived pricing | [09-shopping-cart](./Projects/09-shopping-cart/)               |
| 10  | **ToastForge** | Toast queue, auto-dismiss, pause-on-hover       | [10-toast-notifications](./Projects/10-toast-notifications/)   |

Full series overview: [Projects/README.md](./Projects/README.md)

---

## Tech Stack (Projects)

| Layer       | Technology                                                                   |
| ----------- | ---------------------------------------------------------------------------- |
| Runtime     | Node.js **24.11.0**                                                          |
| Build       | Vite 7                                                                       |
| UI          | React 19, TypeScript                                                         |
| Styling     | Tailwind CSS 4 — per-project themes (Soft Glass Aurora, Commerce Jade, etc.) |
| State       | Redux Toolkit + memoized selectors                                           |
| Motion      | Framer Motion                                                                |
| Forms       | react-hook-form + Zod (Project #6)                                           |
| Drag & drop | @dnd-kit (Project #4)                                                        |

---

## Getting Started

**Prerequisites:** Node.js **24.11.0**, npm

### Run a machine coding project

```bash
cd Projects/01-autocomplete-search
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Then read that project's docs in order:

1. `README.md` — features and scripts
2. `ARCHITECTURE.md` — data flow and state shape
3. `INTERVIEW-QUESTIONS.md` — practice answers aloud

### Run another project

```bash
cd Projects/09-shopping-cart
npm install
npm run dev
```

Try promo codes **`SAVE10`** and **`FREESHIP`** — cart persists in `localStorage` after refresh.

### Docker (optional)

```bash
# Fullstack: React frontend + Express API
cd Docker/fullstack
docker compose up --build -d

curl http://localhost:5000/api/health
open http://localhost:8080
```

More templates: [Docker/README.md](./Docker/README.md)

---

## Repo Structure

```
Interview-Preparation/
├── README.md                 ← you are here
├── Projects/                 ← 10 runnable React apps + screenshots
├── React/                    ← React / Next.js interview guides
├── Vue/                      ← Vue / Nuxt interview guides
├── MERN/                     ← MongoDB, Express, Node, full-stack
├── Docker/                   ← Docker Q&A + compose templates
├── Javascript/               ← JS patterns + coding rounds
├── System Design/            ← System design fundamentals
└── Advanced Topic Images/    ← Architecture PNG diagrams
```

---

## How to Use This Repo

| Goal                       | Where to go                                                                      |
| -------------------------- | -------------------------------------------------------------------------------- |
| Practice live coding       | [Projects/](./Projects/) — run app, explain code without reading                 |
| State management deep dive | [Projects/09-shopping-cart/](./Projects/09-shopping-cart/)                       |
| Quick React theory refresh | [React/12-react-top-30-interview-qa.md](./React/12-react-top-30-interview-qa.md) |
| Full-stack / backend       | [MERN/](./MERN/) + [Docker/fullstack/](./Docker/fullstack/)                      |
| System design round        | [System Design/](./System%20Design/) + diagram PNGs                              |
| Company-specific prep      | [React/](./React/) — KPMG, Blinkit, Capgemini, etc.                              |

---

## Study Path

1. **Week 1** — Projects #1–#3 (debounce, scroll, recursion)
2. **Week 2** — Projects #4–#6 (DnD, data pipeline, forms)
3. **Week 3** — Projects #7–#10 (modals, trees, cart, toasts) + [MERN/](./MERN/)
4. **Interview week** — Re-read each project's `INTERVIEW-QUESTIONS.md` senior sections; skim [React/17-top-50-react-interview-questions.md](./React/17-top-50-react-interview-questions.md)

---

## Interview Q&A Format (Projects)

Each `INTERVIEW-QUESTIONS.md` includes:

| Section                    | Purpose                                                |
| -------------------------- | ------------------------------------------------------ |
| Fundamentals               | Core concepts tied to the code                         |
| What Interviewers Look For | 5 criteria + strong signal line                        |
| Senior-Level Variations    | Virtualization, optimistic UI, undo, a11y, performance |
| **Interview Answer**       | Spoken one-liner for live rounds                       |
| **Example**                | Concrete scenario to remember                          |

---

## Docs Quick Links

- [Projects/README.md](./Projects/README.md) — all 10 projects
- [Projects/09-shopping-cart/README.md](./Projects/09-shopping-cart/README.md) — cart, pricing, promo codes
- [Projects/09-shopping-cart/INTERVIEW-QUESTIONS.md](./Projects/09-shopping-cart/INTERVIEW-QUESTIONS.md) — richest Redux Q&A
- [Docker/README.md](./Docker/README.md) — Docker interview + templates
- [MERN/README.md](./MERN/README.md) — full-stack MERN Q&A
- [System Design/README.md](./System%20Design/README.md) — system design path

---

_Start with [Projects/01-autocomplete-search/](./Projects/01-autocomplete-search/) or jump to [Projects/09-shopping-cart/](./Projects/09-shopping-cart/) for state management._
