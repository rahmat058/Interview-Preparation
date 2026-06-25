# Architecture — UI Component Kit

## Layering

```
tokens.css     → semantic colors, spacing, motion
components.css → BEM-style .ui-* classes
Button.js      → DOM factory (no global registry)
Modal.js       → imperative API (Promise<boolean>)
Toast.js       → Web Component host (declarative mount in HTML)
```

## Why factory + Web Component mix?

| Pattern | Use when |
| --- | --- |
| **Factory** (`createButton`) | One-off elements, full parent control |
| **Web Component** (`ui-toast-host`) | Singleton portal-like UI (toast stack) |
| **Imperative API** (`openModal`) | Async user decision (`await` confirm) |

React equivalent: Button = component; Toast = portal + context; Modal = headless hook + dialog.

## Accessibility

- Modal uses native `<dialog>` → built-in `Escape` + top layer
- Custom Tab trap for older browser edge cases inside dialog
- Focus restored to trigger element on close
- Toast uses `aria-live="polite"` so screen readers announce without stealing focus

## Extension

- Add `registerComponents()` for tree-shaking friendly barrel
- Shadow DOM for style encapsulation (trade-off: harder theming)
- Storybook for visual regression
