# UI Component Kit — Vanilla JS

Reusable UI primitives without React: **design tokens**, **factory functions**, **native `<dialog>`**, and a **Toast Web Component**.

## Features

| Feature | Implementation |
| --- | --- |
| Design tokens | CSS custom properties in `tokens.css` |
| Button | `createButton()` factory |
| Modal | `<dialog>` + focus trap + restore focus |
| Toast | `ui-toast-host` custom element |
| Accessibility | `aria-*`, `role="status"`, keyboard Tab trap |
| Tests | Vitest + happy-dom |

## Scripts

```bash
npm install
npm run dev
npm test
```

## Interview angle

Maps to **shared component library** work: tokens → primitives → documented API. In React you'd wrap the same contracts with JSX; the a11y rules stay identical.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md).
