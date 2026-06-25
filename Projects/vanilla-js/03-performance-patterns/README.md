# Performance Patterns — Vanilla JS

Hands-on **Core Web Vitals–adjacent** techniques without React: virtual scrolling, debounce, lazy loading, Performance API.

## Features

| Pattern | Implementation |
| --- | --- |
| Virtual list | 10,000 rows → ~10 DOM nodes |
| Debounced search | 300ms debounce + `performance.measure` |
| Lazy images | `IntersectionObserver` + `loading="lazy"` |
| Metrics | `performance.mark` / `measure` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |

## Scripts

```bash
npm install
npm run dev
npm test
```

## Interview angle

Same techniques apply in React: `@tanstack/react-virtual`, `useDeferredValue`, `next/image`, Lighthouse CI.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md).
