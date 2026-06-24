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

| Redux for fields      | RHF for fields        |
| --------------------- | --------------------- |
| Dispatch per keystroke| register handles it   |
| Manual error mapping  | errors object built-in|
| Boilerplate           | Less code             |

**Interview Answer:** "Redux for wizard step index and submit status. RHF for field values — best of both."

---

### Q3. How do you validate only the current step?

```typescript
await trigger(['firstName', 'email', 'phone'])  // step 1 fields only
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
z.string().refine(val => val === '' || isValidUrl(val))
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

| localStorage | sessionStorage |
| ------------ | -------------- |
| Survives tab close | Tab session only |
| Good for drafts | Good for sensitive forms |

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

| RHF           | Formik        |
| ------------- | ------------- |
| Less re-renders | More re-renders |
| Uncontrolled default | Controlled tendency |
| Smaller bundle | Larger |

---

## Whiteboard Checklist

1. Single `useForm` + `FormProvider`
2. Zod schema per step + merged full schema
3. `trigger(stepFields)` on Next
4. Redux for step index + completed + submit
5. localStorage persistence on watch
6. Review step before submit
7. Clear draft on success
