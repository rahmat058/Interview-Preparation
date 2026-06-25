# Catalog SPA — Vanilla JS

Mini e-commerce app: **custom store**, **hash router**, **fetch API**, **localStorage cart**, and **dynamic SEO metadata**.

## Features

| Feature | Implementation |
| --- | --- |
| State | `createStore()` — reducer + subscribe (Redux-shaped) |
| Routing | Hash router (`#/`, `#/product/:id`, `#/cart`) |
| API | `fetch` + abort signal + loading/error UI |
| Persistence | Cart in `localStorage` |
| SEO | `document.title`, meta description, JSON-LD per route |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) — utility-first UI |
| Code-split | Dynamic `import()` for API module |

## Scripts

```bash
npm install
npm run dev
npm test
```

## Interview angle

Explain how the same boundaries become **Next.js App Router** pages + **RTK Query** or **Server Components** for catalog data.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md).
