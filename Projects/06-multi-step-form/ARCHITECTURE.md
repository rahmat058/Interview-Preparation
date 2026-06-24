# Architecture — Multi-Step Form (FormFlow)

## Overview

FormFlow demonstrates **multi-step form architecture** — how to split validation, navigation, and persistence across react-hook-form and Redux without fighting either library.

```
┌─────────────────────────────────────────────────────────────────┐
│  WizardApp                                                       │
│    FormProvider (RHF — single form, all steps)                │
│      ├── WizardProgress ← Redux (step, completed)               │
│      ├── StepPersonal / Professional / Preferences / Review     │
│      └── WizardNavigation                                       │
│            Next → trigger(stepFields) → markStepCompleted       │
│            Submit → handleSubmit → submitWizard thunk           │
├─────────────────────────────────────────────────────────────────┤
│  useFormPersistence → localStorage on every watch() change    │
├─────────────────────────────────────────────────────────────────┤
│  Redux wizard slice                                              │
│    currentStep · completedSteps · submitStatus                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why Split RHF + Redux?

| Concern            | Owner           | Why                          |
| ------------------ | --------------- | ---------------------------- |
| Field values       | react-hook-form | Built-in register, errors    |
| Validation         | Zod + RHF       | Schema-driven, per-step trigger |
| Current step       | Redux           | UI state, progress bar       |
| Completed steps    | Redux           | Clickable step navigation    |
| Submit status      | Redux           | Async thunk + loading/error  |
| Persistence        | RHF watch + util| Serialize formValues + step  |

**Interview answer:** "RHF for fields, Redux for wizard chrome. Don't put every keystroke in Redux."

---

## Validation Strategy

### Schemas (`wizardSchemas.ts`)

```typescript
personalStepSchema
professionalStepSchema
preferencesStepSchema
wizardFormSchema = personal.merge(professional).merge(preferences)
```

### Per-step validation on Next

```typescript
const fields = STEP_FIELD_MAP[currentStep]  // e.g. ['firstName', 'email', ...]
const isValid = await trigger([...fields])
if (!isValid) return
dispatch(markStepCompleted(currentStep))
dispatch(goToNextStep())
```

Only validates **current step fields** — user isn't blocked by step 3 errors on step 1.

### Full validation on Submit

`handleSubmit` runs full `wizardFormSchema` via resolver before API call.

---

## Progress Tracking

| UI Element        | Data Source                    |
| ----------------- | ------------------------------ |
| Progress bar      | `currentStep / (total - 1)`    |
| Step circles      | `completedSteps.includes(id)`  |
| Header % complete | completed + review bonus       |
| Clickable steps   | completed or ≤ currentStep     |

---

## State Persistence

### Save trigger

`useFormPersistence` watches RHF values + Redux step state → writes to localStorage on every change.

### Restore on mount

1. `useForm` `defaultValues` reads localStorage
2. `useEffect` dispatches `restoreWizardState`
3. Header shows "Draft restored" badge

### Clear

- Successful submit → `clearPersistedWizard()`
- User clicks "Clear saved draft" → reset form + Redux

---

## Component Architecture

| Component          | Role                              |
| ------------------ | --------------------------------- |
| `FormField`        | Label + error wrapper (presentational) |
| `StepPersonal`     | Step 1 fields via `useFormContext` |
| `WizardProgress`   | Visual step tracker               |
| `WizardNavigation` | Back / Next / Submit logic        |
| `StepReview`       | `getValues()` read-only summary   |

Each step is **self-contained** — add StepPayment by adding schema + component + STEP_FIELD_MAP entry.

---

## API Contract

### `POST /api/wizard/submit`

**Body:** `WizardFormValues`

**Response `201`**

```json
{
  "id": "sub_abc123",
  "message": "Welcome aboard, Jane!",
  "submittedAt": "2026-06-24T..."
}
```

---

## File Map

```
src/
├── lib/validation/wizardSchemas.ts   ★ Zod schemas
├── hooks/useFormPersistence.ts
├── lib/utils/wizardPersistence.ts
├── lib/store/slices/wizardSlice.ts
├── components/wizard/
│   ├── WizardProgress.tsx
│   ├── WizardNavigation.tsx
│   └── steps/Step*.tsx
└── components/form/FormField.tsx
```
