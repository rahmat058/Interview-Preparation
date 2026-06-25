# Vanilla JS — Senior Frontend Interview Projects

Plain **HTML + CSS + JavaScript** projects that mirror the skills in senior React/Next.js roles — without a framework. Use these to explain **architecture**, **trade-offs**, and **how you would scale the same ideas in React**.

## Job requirement mapping

| Requirement                       | Project                                               | What to demo                                                   |
| --------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| Component systems & design tokens | [01-ui-component-kit](./01-ui-component-kit/)         | Reusable primitives, CSS variables, Web Components             |
| State architecture & rationale    | [02-catalog-spa](./02-catalog-spa/)                   | Custom store (pub/sub), localStorage, unidirectional data flow |
| API integration & async state     | [02-catalog-spa](./02-catalog-spa/)                   | Fetch layer, loading/error/empty, abort signals                |
| Performance & render optimization | [03-performance-patterns](./03-performance-patterns/) | Virtual list, debounce, lazy images, `performance.mark`        |
| Accessibility                     | [01-ui-component-kit](./01-ui-component-kit/)         | Modal focus trap, ARIA, keyboard support                       |
| Testing (unit/component)          | All projects                                          | Vitest + happy-dom                                             |
| Build tooling (Vite)              | All projects                                          | ESM, code-splitting via dynamic `import()`                     |
| SEO & metadata                    | [02-catalog-spa](./02-catalog-spa/)                   | `document.title`, meta tags, JSON-LD on route change           |
| CSS layout & responsive UI        | All projects                                          | Grid, flex; Tailwind CSS v4 on catalog-spa & performance-patterns |

## Projects

| #   | Folder                    | One-liner                                             |
| --- | ------------------------- | ----------------------------------------------------- |
| 1   | `01-ui-component-kit`     | Production-style UI primitives (Button, Modal, Toast) |
| 2   | `02-catalog-spa`          | Mini e-commerce catalog — store, hash router, cart    |
| 3   | `03-performance-patterns` | 10k-row virtual scroll + debounced search lab         |

## Quick start

Each project is standalone:

```bash
cd Projects/vanilla-js/01-ui-component-kit   # or 02-catalog-spa, 03-performance-patterns
npm install
npm run dev
```

## How to talk about this in interviews

- **"Why vanilla?"** — Proves you understand what React abstracts: DOM patching, event delegation, component contracts.
- **SSR/SSG/ISR** — These demos are CSR; explain you'd move data fetching to the server in Next.js (`getServerSideProps`, RSC, or `fetch` in Server Components) while keeping the same store/API boundaries.
- **Redux vs Zustand vs Context** — `02-catalog-spa` store is a minimal Redux-shaped pub/sub; argue when you'd add Redux Toolkit (devtools, middleware) vs Zustand (small apps) vs Context (theme/locale only).

## Docs per project

- `README.md` — features & scripts
- `ARCHITECTURE.md` — design decisions
- `INTERVIEW-QUESTIONS.md` — likely Q&A
