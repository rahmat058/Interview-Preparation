# Interview Questions — Modal Manager

---

## Fundamentals

### Q1. Why use a stack instead of a single `isOpen` boolean?

A single boolean cannot represent **nested modals**. Real products open confirm dialogs inside forms inside settings panels. A stack (`push`/`pop`) models depth naturally and lets Escape close one layer at a time.

**Interview Answer:** "`stack.length` is the source of truth. Open = push, close = pop. Nested = multiple entries. This is how Radix and most design systems work internally."

---

### Q2. Why render modals with `createPortal`?

Modals must appear above all page content and escape parent `overflow: hidden` / `z-index` stacking contexts.

**Interview Answer:** "Portal to `document.body` guarantees the overlay sits at the top of the DOM tree. Without portals, a parent with `transform` or `overflow: hidden` can clip or trap the dialog."

---

### Q3. What happens when the user presses Escape?

Only the **topmost** modal closes. The capture-phase listener calls `preventDefault` and `stopPropagation` so lower layers and the page don't also react.

**Interview Answer:** "One global listener checks `stack[stack.length - 1]`. Close top, restore focus to that modal's trigger. Parent modal stays open with focus trapped again."

---

## Event Management

### Q4. Why use capture phase for Escape?

Bubble-phase listeners inside the modal (or browser extensions) might consume the event before it reaches a bubble-phase modal manager.

**Interview Answer:** "`addEventListener('keydown', handler, true)` — capture runs top-down before targets handle the event. Modal systems need first dibs on Escape."

---

### Q5. Backdrop click: `onClick` vs `onMouseDown`?

`onMouseDown` on the overlay fires when the press **starts** on the backdrop. Using `onClick` can fire incorrectly if the user mousedowns inside the dialog and mouseups on the backdrop.

**Interview Answer:** "Check `event.target === event.currentTarget` on mousedown. Also call `stopPropagation` on the dialog panel so inner clicks don't bubble to the overlay."

---

### Q6. How do you prevent event leaks when multiple modals are open?

| Concern | Solution |
| ------- | -------- |
| Escape closes all | Only handle if entry is stack top |
| Backdrop closes buried modal | Only top layer handles backdrop |
| Tab escapes dialog | Focus trap only on top layer |
| Scroll bleeds | `body { overflow: hidden }` while stack > 0 |

---

## Accessibility

### Q7. What ARIA attributes does a modal need?

| Attribute | Value |
| --------- | ----- |
| `role` | `dialog` |
| `aria-modal` | `true` |
| `aria-labelledby` | id of title element |
| `aria-describedby` | id of description/body (optional but recommended) |

**Interview Answer:** "Screen readers announce the dialog name via `aria-labelledby`. `aria-modal=true` tells assistive tech that content behind is inert."

---

### Q8. How does focus trap work?

1. On open, focus first focusable (or `data-autofocus` element)
2. On `Tab` from last focusable → wrap to first
3. On `Shift+Tab` from first → wrap to last
4. On close, restore focus to element that opened the modal

**Interview Answer:** "Query `button, a, input, select, textarea, [tabindex]:not(-1)`. Listen for Tab keydown at document level while modal is top."

---

### Q9. Why store trigger elements outside Redux?

Redux state must be serializable. `HTMLElement` references are not serializable and don't belong in the store.

**Interview Answer:** "Use a sidecar `Map<id, HTMLElement>` — `modalFocusRegistry`. Register on open, restore on close. Same pattern as keeping non-serializable refs out of Redux."

---

### Q10. What is `inert` and when do you use it?

The `inert` attribute makes an element and all descendants non-interactive and hidden from assistive tech. Applied to **non-top** dialogs in a stack so users can't tab into buried layers.

---

## State & Architecture

### Q11. Why split `ModalLayer` and `*ModalContent`?

| Component | Role |
| --------- | ---- |
| `ModalLayer` | Portal shell, a11y, focus trap, backdrop |
| `InfoModalContent` etc. | Business UI |

**Interview Answer:** "Shell is reusable infrastructure. Content components swap per use case — same split as Headless UI's Dialog.Panel vs your form."

---

### Q12. How would you add a promise-based API?

```typescript
async function confirm(options) {
  return new Promise((resolve) => {
    const id = open({ type: 'confirm', ...options, onResolve: resolve })
  })
}
```

Use RTK listener middleware or pass `onClose` callbacks in payload. Resolve promise when modal closes with result.

---

### Q13. How would you animate exit before removing from stack?

Keep entry in stack with `status: 'closing'`, run Framer Motion `onExitComplete`, then dispatch `pop`. Prevents flash unmount before animation finishes.

---

### Q14. What if two modals open simultaneously?

With a stack, order is deterministic — second `open` pushes on top. If you need modals from unrelated subtrees, a single global `ModalHost` (this project) is the correct architecture.

---

## Testing Scenarios (Live Coding)

### Q15. Whiteboard: implement minimal modal in 15 minutes

1. `useState` stack or single open id
2. Portal + fixed overlay
3. `useEffect` keydown Escape
4. Focus first button on open
5. `return () => trigger.focus()` on close

This project adds Redux, nested stack, event log, and full a11y — the interview baseline is steps 1–5.

---

### Q16. Common bugs interviewers look for

| Bug | Fix |
| --- | --- |
| Focus lost after close | Save + restore trigger |
| Scroll jumps | Lock body scroll |
| Escape closes wrong layer | Stack + top-only handler |
| Can't tab to submit | Focus trap + autofocus |
| Background still clickable | Backdrop covers viewport, `pointer-events` on top only |

---

## Rapid Fire

| Question | Short answer |
| -------- | ------------ |
| `aria-modal` vs `role=dialog`? | Both needed; role names it, aria-modal marks background inert |
| Close on route change? | `useEffect` → `closeAll()` on `pathname` change |
| SSR? | Only portal on client; `typeof document !== 'undefined'` |
| Multiple modal roots? | Anti-pattern — one host, one stack |
| z-index wars? | Central base (1000) + depth offset |
