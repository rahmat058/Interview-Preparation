---
title: "Vue Machine Coding Interview — Forms, Debounce, SSR"
description: "Multi-round Vue interview patterns — vanilla JS, KYC form, debounce, SSR trade-offs."
tags: ["vue", "interview", "forms", "debounce", "ssr"]
level: "Mid–Senior"
---

# Vue Machine Coding Interview Preparation

Patterns from rigorous frontend interviews — **build from scratch**, **complex forms**, **debounce**, **SSR discussion**.

---

## Round 1 — Vanilla JS in Browser Context

Even Vue roles test raw JS:

```javascript
// Event delegation
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.matches(".delete-btn")) deleteItem(e.target.dataset.id);
});

// Debounce
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
```

---

## Round 2 — KYC Form in Vue

```vue
<script setup>
import { reactive, computed } from "vue";

const form = reactive({
  fullName: "",
  pan: "",
  dob: "",
  address: "",
});
const errors = reactive({});
const touched = reactive({});

const rules = {
  fullName: (v) => v.length >= 3 || "Name must be 3+ characters",
  pan: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v) || "Invalid PAN format",
  dob: (v) => v && new Date(v) < new Date() || "Invalid date of birth",
};

function validate() {
  Object.keys(rules).forEach((key) => {
    errors[key] = rules[key](form[key]) === true ? "" : rules[key](form[key]);
  });
  return !Object.values(errors).some(Boolean);
}

const isValid = computed(() => {
  return Object.keys(rules).every((k) => rules[k](form[k]) === true);
});

async function submit() {
  if (!validate()) return;
  await api.post("/kyc", form);
}
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <div v-for="field in ['fullName', 'pan', 'dob', 'address']" :key="field">
      <label :for="field">{{ field }}</label>
      <input
        :id="field"
        v-model="form[field]"
        @blur="touched[field] = true"
        :aria-invalid="!!errors[field]"
        :aria-describedby="errors[field] ? `${field}-error` : undefined"
      />
      <span v-if="touched[field] && errors[field]" :id="`${field}-error`" role="alert">
        {{ errors[field] }}
      </span>
    </div>
    <button type="submit" :disabled="!isValid">Submit KYC</button>
  </form>
</template>
```

---

## Round 3 — Debounced Search

```vue
<script setup>
const query = ref("");
const debouncedQuery = useDebounce(query, 400);
const { data: results, loading } = useFetch(
  computed(() => debouncedQuery.value ? `/api/search?q=${debouncedQuery.value}` : null)
);
</script>
```

---

## Round 4 — SSR Trade-offs (Discussion)

| | SPA (Vite + Vue) | Nuxt SSR |
|--|------------------|----------|
| SEO | Poor without prerender | Excellent |
| TTFB | Fast shell | Slower (server) |
| Complexity | Lower | Higher |
| Data fetch | onMounted / Vue Query | useFetch (universal) |

### One-Line Interview Answer
> Nuxt SSR for SEO-critical pages. SPA with Vue Query for authenticated dashboards. Can hybrid — SSG for marketing, SPA for app.

---

## VeeValidate Alternative

```vue
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  pan: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
});

const { handleSubmit, errors, defineField } = useForm({ validationSchema: schema });
const [email] = defineField("email");
const [pan] = defineField("pan");

const onSubmit = handleSubmit(async (values) => {
  await api.post("/kyc", values);
});
</script>
```

---

# Cheat Sheet

| Task | Vue tool |
|------|----------|
| Complex form | reactive + validation rules or VeeValidate |
| Debounce | useDebounce composable |
| SSR | Nuxt 3 + useFetch |
| API errors | try/catch + error ref + retry button |
