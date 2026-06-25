# Interview Questions — UI Component Kit

### Q. Factory vs class vs Web Component?

**Factory** — lightweight, no lifecycle. **Class component** — stateful widgets. **Web Component** — framework-agnostic, good for design system distribution.

### Q. How do you implement focus trap without a library?

Query focusable descendants, listen for `Tab` / `Shift+Tab`, wrap from last→first and first→last.

### Q. `<dialog>` vs div overlay?

`<dialog>` gives top layer, `::backdrop`, and `cancel` event. Prefer native; polyfill only if you must support very old browsers.

### Q. How does this relate to your React design system?

Same token names, same variant API (`primary` / `secondary`), same a11y checklist — swap DOM factories for JSX.
