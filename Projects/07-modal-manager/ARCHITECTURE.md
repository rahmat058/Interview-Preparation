# Architecture — Modal Manager

## Overview

LayerForge implements a **stack-based modal manager** — the same pattern used by Radix Dialog, Headless UI, and internal design systems at scale. A central Redux store holds an ordered stack of modal entries; each entry renders as a React portal with incrementing z-index.

---

## Data Model

```typescript
interface ModalStackEntry {
  id: string
  type: 'info' | 'confirm' | 'form' | 'delete' | 'nested-demo'
  title: string
  payload?: ModalPayload
  closeOnEscape?: boolean    // default true
  closeOnBackdrop?: boolean  // default true
}
```

| Field | Purpose |
| ----- | ------- |
| `id` | Unique key for focus registry + close targeting |
| `type` | Maps to content component via `ModalContent` switch |
| `closeOnEscape` | Per-modal opt-out for Escape handling |

**Why a stack, not a single `activeModal`?**

Nested dialogs are common in real apps (confirm inside form inside settings). A stack models this naturally: push on open, pop on close, depth = `stack.length`.

---

## State Flow

```
User clicks trigger
  → useModal().open({ type, title, trigger: event.currentTarget })
  → registerModalTrigger(id, trigger)
  → dispatch openModal → stack.push(entry) + event log

User presses Escape
  → useGlobalEscapeKey (capture phase)
  → close top entry only
  → restoreModalFocus(top.id)

User clicks backdrop
  → ModalLayer.handleBackdropClick (top + closeOnBackdrop)
  → close + focus restore
```

### Event Log

Every open/close/escape/backdrop/nested-open is appended to `state.modal.events[]` (max 24). This makes **event management** visible during demos and interviews.

---

## Component Layers

```
App
├── ModalApp          — demo triggers + event log UI
├── ModalHost         — mounts when stack.length > 0
│   └── ModalLayer × N
│       ├── backdrop (motion.div)
│       ├── dialog shell (role="dialog", aria-*)
│       └── ModalContent
│           └── *ModalContent (info, form, etc.)
```

| Layer | Responsibility |
| ----- | -------------- |
| `ModalHost` | Scroll lock, global Escape, map stack → layers |
| `ModalLayer` | Portal, z-index, backdrop click, focus trap enable |
| `ModalContent` | Type → component registry |
| `*ModalContent` | Domain UI (form fields, delete copy, etc.) |

---

## Event Management (Interview Focus)

### Escape — capture phase

```typescript
document.addEventListener('keydown', handler, true)
```

**Why capture?** Child components (inputs, nested widgets) may stop propagation in bubble phase. Capture ensures the modal manager always sees `Escape` first.

**Why only top modal?** Closing a buried modal while a child is open breaks user mental model and focus order.

### Backdrop click

`onMouseDown` on the overlay container — not `onClick` — avoids accidental closes when dragging from inside the dialog.

```typescript
if (event.target !== event.currentTarget) return
```

### Focus trap

`useFocusTrap` listens for `Tab` / `Shift+Tab` on `document`:

1. Query focusable elements inside dialog ref
2. Wrap from last → first (and reverse)

Only enabled when `isTop === true`.

### Focus restore

HTMLElement refs **cannot live in Redux** (non-serializable). Pattern used here:

```typescript
// modalFocusRegistry.ts — Map<id, HTMLElement>
registerModalTrigger(id, triggerElement)
restoreModalFocus(id) // on close
```

On nested close, focus returns to the "Open nested modal" button inside the parent dialog — correct WCAG behavior.

---

## Accessibility Checklist

| Requirement | Implementation |
| ----------- | -------------- |
| Dialog role | `role="dialog"` + `aria-modal="true"` |
| Labelling | `aria-labelledby` → title, `aria-describedby` → body |
| Initial focus | `[data-autofocus]` or first focusable |
| Focus trap | `useFocusTrap` on top dialog |
| Escape to close | `useGlobalEscapeKey` |
| Hidden layers | `aria-hidden` + `inert` on non-top dialogs |
| Live status | Header badge `aria-live="polite"` for stack count |

---

## Z-Index Strategy

```typescript
const zIndex = 1000 + depth * 10
```

Each stack level gets +10 headroom for internal overlays (tooltips, dropdowns inside modal).

---

## Mock API

| Endpoint | File | Latency |
| -------- | ---- | ------- |
| `saveProfile` | `src/api/modalApi.ts` | 600–1000ms |
| `deleteItem` | `src/api/modalApi.ts` | 700–1200ms |

Swap these for real `fetch` calls without changing modal infrastructure.

---

## Extension Points

1. **Promise-based API** — `openModal().then(result => ...)` via RTK listener middleware
2. **URL hash modals** — sync stack to `?modal=delete&id=123`
3. **Animation coordination** — delay pop until exit animation completes (`onExitComplete`)
4. **Compound component API** — `<Modal><Modal.Header /></Modal>` for library-style DX

---

## File Map

```
src/
├── api/modalApi.ts
├── components/modal/
│   ├── ModalHost.tsx
│   ├── ModalLayer.tsx
│   ├── ModalContent.tsx
│   ├── ModalEventLog.tsx
│   └── modals/*.tsx
├── hooks/
│   ├── useModal.ts
│   ├── useEscapeKey.ts
│   ├── useFocusTrap.ts
│   └── useBodyScrollLock.ts
└── lib/
    ├── store/slices/modalSlice.ts
    ├── types/modal.ts
    └── utils/
        ├── focusable.ts
        └── modalFocusRegistry.ts
```
