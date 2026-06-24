# Interview Questions — Multi-Step Form

---

## Fundamentals

### Q1. Why react-hook-form for multi-step forms?

- Single form state across all steps
- Minimal re-renders (`register` uncontrolled)
- Built-in `trigger`, `handleSubmit`, `FormProvider`
- Works with Zod via `@hookform/resolvers`

**Interview Answer:** "One FormProvider wraps all steps — values persist as user navigates. No manual useState per field."

---

### Q2. Why not put all form state in Redux?

| Redux for fields       | RHF for fields         |
| ---------------------- | ---------------------- |
| Dispatch per keystroke | register handles it    |
| Manual error mapping   | errors object built-in |
| Boilerplate            | Less code              |

**Interview Answer:** "Redux for wizard step index and submit status. RHF for field values — best of both."

---

### Q3. How do you validate only the current step?

```typescript
await trigger(["firstName", "email", "phone"]); // step 1 fields only
```

Map steps to fields in `STEP_FIELD_MAP`.

**Interview Answer:** "Don't run full schema on Next — trigger only that step's field names."

---

## Validation

### Q4. Why Zod + zodResolver?

- Schema is source of truth (shareable with backend)
- Type inference: `z.infer<typeof schema>`
- Composable: `personal.merge(professional)`

---

### Q5. When does full validation run?

- **Next button:** partial `trigger(stepFields)`
- **Submit:** full `handleSubmit` → entire `wizardFormSchema`

---

### Q6. How handle optional fields (LinkedIn)?

```typescript
z.string().refine((val) => val === "" || isValidUrl(val));
```

Empty string allowed; non-empty must be URL.

---

## Progress & Navigation

### Q7. How track completed steps?

Redux array: `completedSteps: number[]`

Mark complete after successful step validation on Next.

Allow clicking back to completed steps only.

---

### Q8. Can user skip ahead?

Not without validating intermediate steps (bad UX + data integrity).

Allow click only on `completedSteps` or `step <= currentStep`.

---

## Persistence

### Q9. What do you persist?

```json
{ formValues, currentStep, completedSteps, savedAt }
```

Not Redux entire store — only what's needed to resume.

---

### Q10. When to clear persisted state?

- Successful submit
- User clicks "Clear draft"
- Optionally: TTL expiry (extension)

---

### Q11. localStorage vs sessionStorage?

| localStorage       | sessionStorage           |
| ------------------ | ------------------------ |
| Survives tab close | Tab session only         |
| Good for drafts    | Good for sensitive forms |

---

## Architecture

### Q12. What is FormProvider?

Shares `useForm` methods via context — step components use `useFormContext()` without prop drilling.

---

### Q13. How structure step components?

One file per step, each uses `register()` for its fields only. Review step uses `getValues()`.

---

### Q14. How animate step transitions?

`AnimatePresence` + `key={currentStep}` on step wrapper — unmount old, mount new.

---

## Advanced

### Q15. How would you add URL step sync?

`/onboarding?step=2` — read on mount, `navigate` on step change. Persist still in localStorage as backup.

---

### Q16. How would you handle server-side validation errors?

Map API field errors to `setError('email', { message: '...' })` from RHF.

---

### Q17. react-hook-form vs Formik?

| RHF                  | Formik              |
| -------------------- | ------------------- |
| Less re-renders      | More re-renders     |
| Uncontrolled default | Controlled tendency |
| Smaller bundle       | Larger              |

---

## What Interviewers Actually Look For

Not perfect UI. Interviewers evaluate **how you think under constraints**.

| Criteria                  | What to demonstrate in **FormFlow**                | Example from this project                        |
| ------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| **Component structure**   | RHF owns values; Redux owns wizard meta            | `FormProvider` + `StepPersonal` — step isolation |
| **State management**      | Validate only current step on Next                 | `trigger(stepFields)` — not whole form           |
| **Code readability**      | Zod schemas colocated; clear step map              | `WIZARD_STEPS` + `STEP_COMPONENTS` arrays        |
| **Edge cases**            | Refresh mid-wizard, invalid draft, back navigation | localStorage restore; merge with defaults        |
| **Performance awareness** | Don't re-validate all fields every keystroke       | RHF uncontrolled inputs; `mode: 'onTouched'`     |

**Strong signal:** You explain split: "RHF = form values, Redux = navigation — avoids duplicating fields in Redux."

---

## Senior-Level Variations

Interviewers often add mid-interview. How to extend **FormFlow**:

### Virtualization

**Ask:** "Step with 500 checkbox options."

Virtualize long option lists — rare in wizards but shows awareness. Multi-step itself is a UX substitute for one giant form.

**Interview Answer:** "Wizards already chunk UX — one step at a time. If a single step has hundreds of options, virtualize that list. The step index in Redux stays the navigation source of truth."

**Example:** Step 3: pick from **500 countries** → virtual checkbox list shows ~12 rows → Redux `currentStep` still drives navigation.

---

### Optimistic updates

**Ask:** "Submit feels slow."

Show success step immediately; roll back if API fails with error banner on review step. Or optimistic "Submitting…" with disable double-submit.

**Interview Answer:** "Advance to success step on submit click with `isSubmitting` guard against double-post. If API fails, step back to review with an error banner — user data is still in RHF."

**Example:** Click **Submit** → Success step shows instantly → API returns 500 → user lands back on **Review** with red banner, all fields still filled.

---

### Undo functionality

**Ask:** "User clicked Clear draft by mistake."

Confirm modal, or toast Undo restoring `localStorage` snapshot from ref before clear.

**Interview Answer:** "Snapshot `localStorage` draft to a ref before clear, then toast Undo that writes it back. Cheaper than confirm modal for power users; confirm for destructive in production."

**Example:** **Clear draft** wipes name + email → toast **Undo** → `localStorage` draft restored, form fields repopulated instantly.

---

### Accessibility support

**Ask:** "Wizard works with keyboard + screen reader."

Focus first field on step change (`useEffect` + `focus()`). `aria-current="step"` on progress. Announce step title via `aria-live` on navigation.

**Interview Answer:** "On step change, focus the first invalid or first field. Progress uses `aria-current=step`. Live region announces 'Step 2 of 4: Shipping' so screen reader users know context without hunting headings."

**Example:** Click **Next** → focus jumps to first shipping field → screen reader: **"Step 2 of 4: Shipping"**.

---

### Performance constraints

**Ask:** "Large form lags on every keystroke."

RHF avoids full-form re-render. Split steps so only active step mounts heavy fields. Lazy-load step components with `React.lazy`.

**Interview Answer:** "RHF registers only mounted fields — lazy-load step components so 40 fields on step 4 don't re-render when step 1 types. `trigger(stepFields)` on Next keeps validation scoped."

**Example:** Type email on **Step 1** → **Step 4**'s 40 fields aren't even mounted → zero re-renders from unrelated steps.

---

## Whiteboard Checklist

1. Single `useForm` + `FormProvider`
2. Zod schema per step + merged full schema
3. `trigger(stepFields)` on Next
4. Redux for step index + completed + submit
5. localStorage persistence on watch
6. Review step before submit
7. Clear draft on success
