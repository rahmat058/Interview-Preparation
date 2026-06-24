# Architecture — Toast Notification System

## Overview

ToastForge implements a **queued toast system** — the pattern behind Sonner, react-hot-toast, and Radix Toast. State lives in Redux; timers live in components; the viewport renders via portal.

---

## State Model

```typescript
interface ToastState {
  visible: Toast[]   // on screen (max 3)
  pending: Toast[]   // waiting in queue
  events: ToastEvent[]
}
```

| Array | Role |
| ----- | ---- |
| `visible` | Active toasts with running timers |
| `pending` | FIFO queue when visible is full |

---

## Queue Flow

```
enqueueToast
  ├─ visible.length < 3 → push to visible
  └─ else → push to pending

dismissToast (manual | auto)
  ├─ remove from visible
  └─ promoteNext() → shift pending → visible
```

**FIFO:** `pending.shift()` promotes the oldest waiting toast.

---

## Component Communication

### Producer: `useToast()` hook

```typescript
const toast = useToast()
toast.success('Profile updated')
toast.error({ title: 'Failed', message: 'Try again', duration: 8000 })
```

Any component dispatches `enqueueToast` without prop drilling.

### Consumer: `ToastHost`

Mounted once at app root. Subscribes to `visible` and renders `ToastViewport` portal.

**Decoupling:** Demo buttons don't render toasts inline — they only dispatch actions.

---

## Timer Management

Each `ToastItem` owns its dismiss timer via `useAutoDismiss`:

```typescript
useEffect(() => {
  timeoutId = setTimeout(() => dismiss, duration)
  return () => clearTimeout(timeoutId)
}, [toast.id, duration])
```

### Pause on hover

1. `mouseenter` → `clearTimeout`, store `remainingMs`
2. `mouseleave` → `setTimeout(remainingMs)`
3. CSS progress bar uses `animation-play-state: paused`

**Why per-item timers?** Simple, isolated cleanup on unmount. Alternative: central timer manager Map — mention in interviews.

### Persistent toasts

`duration: 0` → skip timer effect entirely.

---

## Dismiss Reasons

| Reason | Source |
| ------ | ------ |
| `manual` | X button |
| `auto` | Timer expiry |
| `clear-all` | Dismiss all button |

Logged in event panel for demo/debug.

---

## Accessibility

| Requirement | Implementation |
| ----------- | -------------- |
| Announce | `role="status"`, `aria-live="polite"` |
| Dismiss | Button with `aria-label` |
| Viewport | `aria-label="Notifications"` |

---

## Animation

- **Enter/exit:** Framer Motion on `ToastItem`
- **Progress:** CSS `@keyframes toast-shrink` synced to duration
- **Layout:** `layout` prop for stack reflow

---

## Type Defaults

| Type | Default duration |
| ---- | ---------------- |
| success | 4000ms |
| error | 7000ms |
| warning | 6000ms |
| info | 5000ms |

---

## File Map

```
src/
├── hooks/
│   ├── useToast.ts           ← public API
│   └── useAutoDismiss.ts     ← timer + pause
├── lib/store/slices/toastSlice.ts
├── components/toast/
│   ├── ToastViewport.tsx     ← portal
│   ├── ToastItem.tsx
│   └── ToastProgress.tsx
└── components/demo/ToastDemoPanel.tsx
```

---

## Extension Points

1. **Promise toast** — loading → success/error on resolve
2. **Action button** — "Undo" callback in toast payload
3. **Position variants** — top-left, bottom-center
4. **RTK listener** — global side effects on enqueue

---

## Cross-Project Links

| Project | Shared pattern |
| ------- | -------------- |
| #7 Modal Manager | Stack queue, portal host, global dismiss |
| #9 Shopping Cart | Redux actions as component API |
| #1 Autocomplete | Event logging for demos |
