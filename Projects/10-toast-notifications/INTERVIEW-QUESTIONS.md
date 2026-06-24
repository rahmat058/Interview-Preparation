# Interview Questions — Toast Notifications

---

## Fundamentals

### Q1. Why separate `visible` and `pending` queues?

Without a cap, 20 simultaneous toasts cover the screen. Production systems limit visible count and FIFO-queue the rest.

**Interview Answer:** "`visible` max 3 for UX. Overflow goes to `pending`. On dismiss, promote with `shift()`."

---

### Q2. Where should timers live — Redux or components?

**Components (this project).** Timers are side effects; Redux should stay serializable.

**Interview Answer:** "`useEffect` + `setTimeout` in `ToastItem`. Cleanup on unmount. Redux only stores toast data, not timeout IDs."

---

### Q3. How does `useToast()` enable component communication?

Decouples producers from the toast UI:

```
Button → useToast().success() → dispatch → ToastHost re-renders
```

No props, no context provider wrapper required beyond Redux store.

---

## Timers

### Q4. Implement auto-dismiss in 5 lines.

```typescript
useEffect(() => {
  if (!duration) return
  const id = setTimeout(onDismiss, duration)
  return () => clearTimeout(id)
}, [id, duration])
```

---

### Q5. Pause on hover — how?

1. Clear timeout on enter
2. Save `remaining = duration - elapsed`
3. Restart timeout with `remaining` on leave
4. Pause CSS animation with `animation-play-state`

---

### Q6. What breaks if you forget cleanup?

Memory leaks, dismiss fires after unmount, React warning, ghost toasts re-appearing.

**Always:** `return () => clearTimeout(id)` in effect cleanup.

---

### Q7. Strict Mode double-mount?

React 18+ dev Strict Mode runs effects twice. Timers may fire early unless cleanup is correct. Mention you'd test in production build or use ref guard.

---

## Queue Management

### Q8. promoteNext pseudocode

```typescript
function promoteNext() {
  if (visible.length >= MAX || pending.length === 0) return
  visible.push(pending.shift())
}
```

Call after every dismiss from `visible`.

---

### Q9. Priority queue extension?

Replace `pending[]` with sorted insert by `priority` field. Same promote logic, different dequeue order.

---

## Component Communication

### Q10. Context vs Redux vs custom event bus?

| Approach | When |
| -------- | ---- |
| Context + reducer | Medium apps, no Redux |
| Redux | Already using RTK (this project) |
| Event emitter | Legacy, avoid in React |

---

### Q11. Why portal for toasts?

Toasts must render above all content, outside parent `overflow: hidden` / z-index traps.

```typescript
createPortal(<Viewport />, document.body)
```

Same as Project #7 modals.

---

## Accessibility

### Q12. `aria-live` polite vs assertive?

| Value | Use |
| ----- | --- |
| `polite` | Success, info — wait for pause |
| `assertive` | Critical errors — interrupt |

This project uses `polite` for all; switch error to assertive in production if needed.

---

## Whiteboard

### Q13. Build minimal toast in 15 minutes

1. `useState<Toast[]>` or Redux slice
2. `toast(msg)` push with id
3. Portal list top-right
4. `setTimeout` remove after 3s
5. Optional X button

---

### Q14. Bug: queue never promotes

Check dismiss removes from `visible` not `pending`, and `promoteNext` runs after every visible removal.

---

## Rapid Fire

| Question | Short answer |
| -------- | ------------ |
| Max visible? | Config constant (3 here) |
| Persistent toast? | duration 0, no timer |
| Duplicate prevention? | Dedupe by id or message hash |
| Server errors? | error type, longer duration |
| Test timers? | fake timers (jest vi.useFakeTimers) |

---

## Series Completion

Project #10 completes the **10 React machine coding projects** series:

| # | Focus |
|---|-------|
| 1 | Debounce, keyboard nav |
| 2 | Infinite scroll |
| 3 | Recursive tree |
| 4 | Drag & drop state |
| 5 | Data pipeline |
| 6 | Form architecture |
| 7 | Event management (modals) |
| 8 | Tree structures |
| 9 | State management (cart) |
| 10 | Timers + communication (toasts) |
