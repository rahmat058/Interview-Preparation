# Data Table — Vanilla JS

**GridLens** — sortable, filterable, searchable employee table with **full CRUD**, pagination, and localStorage persistence. Plain HTML + JavaScript + Tailwind CSS v4.

## Features

| Feature | Implementation |
| --- | --- |
| **Create** | Modal form → `employees/create` action |
| **Read** | 80 seed records from JSON + query pipeline |
| **Update** | Edit modal → `employees/update` action |
| **Delete** | Confirmation dialog → `employees/delete` action |
| **Sorting** | Click column headers — asc/desc with `aria-sort` |
| **Filtering** | Department, role, status, location dropdowns |
| **Search** | 300ms debounced global search |
| **Pagination** | Page nav + page size (10 / 25 / 50) |
| **Persistence** | CRUD mutations saved to `localStorage` |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Interview angle

Same query pipeline as the React [05-data-table](../../05-data-table/) project — pure `tableQuery.js` functions you can unit test without a DOM. Explain how CRUD maps to REST (`POST /employees`, `PATCH /employees/:id`, `DELETE /employees/:id`) and optimistic updates in React Query or RTK Query.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md).
