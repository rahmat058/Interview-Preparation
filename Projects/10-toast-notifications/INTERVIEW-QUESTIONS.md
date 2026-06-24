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
  if (!duration) return;
  const id = setTimeout(onDismiss, duration);
  return () => clearTimeout(id);
}, [id, duration]);
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
  if (visible.length >= MAX || pending.length === 0) return;
  visible.push(pending.shift());
}
```

Call after every dismiss from `visible`.

---

### Q9. Priority queue extension?

Replace `pending[]` with sorted insert by `priority` field. Same promote logic, different dequeue order.

---

## Component Communication

### Q10. Context vs Redux vs custom event bus?

| Approach          | When                             |
| ----------------- | -------------------------------- |
| Context + reducer | Medium apps, no Redux            |
| Redux             | Already using RTK (this project) |
| Event emitter     | Legacy, avoid in React           |

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

| Value       | Use                            |
| ----------- | ------------------------------ |
| `polite`    | Success, info — wait for pause |
| `assertive` | Critical errors — interrupt    |

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

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria                  | What to demonstrate in **ToastForge**                   | Example from this project                        |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| **Component structure**   | Producers use hook; host renders portal                 | `useToast()` — no inline toast JSX in buttons    |
| **State management**      | visible + pending queues; timers outside Redux          | `enqueueToast` / `promoteNext`; `useAutoDismiss` |
| **Code readability**      | Timer logic isolated in one hook                        | clearTimeout on unmount; pause/resume named      |
| **Edge cases**            | Queue overflow, persistent toast, dismiss all mid-timer | `duration: 0`; `dismissAll` clears pending       |
| **Performance awareness** | Max 3 visible; cleanup timers                           | `MAX_VISIBLE_TOASTS`; effect cleanup             |

**Strong signal:** You explain why timeout IDs must not live in Redux state.

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **ToastForge**:

### Virtualization

Rare for toasts. If showing **notification history panel** (inbox), virtualize that list — separate from transient toast viewport.

**Interview Answer:** "Transient toasts cap at 3 DOM nodes — no virtualization needed. A notification inbox is a separate panel; virtualize that history list, keep `visible`/`pending` queue unchanged."

**Example:** Toast queue: max **3 visible**. A separate **notification inbox** page with 500 history rows → virtualize that list, not the toast viewport.

---

### Optimistic updates

**Ask:** "Toast only after server confirms."

Reverse: show loading toast → swap to success/error on promise settle (Sonner pattern):

```typescript
const id = toast.loading("Saving…");
await save();
toast.success("Saved", { id }); // replaces same toast
```

**Interview Answer:** "Issue toast with stable id on start, replace same slot on settle — Sonner pattern. ToastForge's queue already keys by id; swap type/message without adding a second toast."

**Example:** `toast.loading('Saving…', { id: 'abc' })` → on success `toast.success('Saved', { id: 'abc' })` → **same slot**, not a second toast.

---

### Undo functionality

**Ask:** "Action toast with Undo."

```typescript
toast.custom({
  title: "Item deleted",
  action: { label: "Undo", onClick: () => dispatch(restoreItem()) },
  duration: 8000,
});
```

Core queue unchanged — payload gains optional `action` callback.

**Interview Answer:** "Extend toast payload with optional `action` button. Pause-on-hover and max-3 queue stay the same — Undo is just a longer duration and a callback, not a new subsystem."

**Example:** **"Item deleted"** toast with **Undo** button, 8s duration → click Undo calls `restoreItem()` — queue logic unchanged.

---

### Accessibility support

**Ask:** "Error must interrupt."

`role="status"` + `aria-live="polite"` for success; `aria-live="assertive"` for errors. Ensure pause-on-hover doesn't trap keyboard users — dismiss button always reachable.

**Interview Answer:** "Map toast type to live politeness — assertive for errors, polite for success. Pause-on-hover extends timer but dismiss button stays in tab order so keyboard users aren't trapped."

**Example:** Error toast → `aria-live="assertive"` interrupts reading → **Tab** always reaches the ✕ dismiss button even while timer is paused on hover.

---

### Performance constraints

**Ask:** "Spam 100 toasts."

Queue in `pending` (implemented). Cap queue length (e.g. 20) dropping oldest. Single portal, max 3 DOM nodes visible.

**Interview Answer:** "`pending` FIFO already bounds visible DOM to 3. Cap `pending` at ~20 and drop oldest on overflow — timers live in `useAutoDismiss`, not Redux, so dropped toasts just never promote."

**Example:** Fire **100 toasts** in 2 seconds → **3 visible**, **17 pending**, rest dropped at cap 20 — never 100 DOM nodes or 100 Redux timers.

---

## Rapid Fire

| Question              | Short answer                        |
| --------------------- | ----------------------------------- |
| Max visible?          | Config constant (3 here)            |
| Persistent toast?     | duration 0, no timer                |
| Duplicate prevention? | Dedupe by id or message hash        |
| Server errors?        | error type, longer duration         |
| Test timers?          | fake timers (jest vi.useFakeTimers) |

---

## Series Completion

Project #10 completes the **10 React machine coding projects** series:

| #   | Focus                           |
| --- | ------------------------------- |
| 1   | Debounce, keyboard nav          |
| 2   | Infinite scroll                 |
| 3   | Recursive tree                  |
| 4   | Drag & drop state               |
| 5   | Data pipeline                   |
| 6   | Form architecture               |
| 7   | Event management (modals)       |
| 8   | Tree structures                 |
| 9   | State management (cart)         |
| 10  | Timers + communication (toasts) |
