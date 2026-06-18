---
title: "Vue Best Practices & Project Guide"
description: "20 Vue 3 project best practices for production apps — structure, performance, testing, and maintainability."
tags: ["vue", "best-practices", "vue3", "pinia"]
level: "All levels"
---

# Vue 3 Best Practices & Project Guide

20 practices for production Vue 3 applications.

---

| # | Practice | Why |
|---|----------|-----|
| 1 | Use `<script setup>` | Less boilerplate, better TS |
| 2 | Feature-based folders | Scales with team size |
| 3 | Composables for logic | Reuse without mixins |
| 4 | Pinia for global state | Official, typed stores |
| 5 | Vue Query for server data | Cache, dedup, refetch |
| 6 | Lazy-load routes | Smaller initial bundle |
| 7 | Typed props/emits | Catch bugs at compile time |
| 8 | Avoid prop drilling | provide/inject or Pinia |
| 9 | Scoped styles | Prevent CSS leaks |
| 10 | ESLint + Prettier | Consistent code style |
| 11 | Vitest for unit tests | Fast, Vite-native |
| 12 | env variables via import.meta.env | Vite convention |
| 13 | AbortController in composables | Prevent memory leaks |
| 14 | v-memo on heavy lists | Skip unnecessary diffs |
| 15 | keep-alive for tabs | Preserve form state |
| 16 | Teleport modals to body | Avoid z-index issues |
| 17 | Symbol keys for provide/inject | Avoid collisions |
| 18 | readonly() on provided state | Prevent child mutation |
| 19 | Code review checklist | a11y, loading states, error boundaries |
| 20 | Document composable APIs | JSDoc on use* functions |

---

## Project Structure

```
src/
├── app/           # main.js, App.vue, router
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── types.ts
│   └── catalog/
├── shared/
│   ├── components/
│   └── composables/
├── services/
│   └── api.js
└── assets/
```

## Composable Example

```javascript
/**
 * @param {Ref<string>} url
 * @returns {{ data: Ref, loading: Ref, error: Ref }}
 */
export function useFetch(url) { /* ... */ }
```

## Error Handling

```vue
<script setup>
const { data, error, loading } = useProducts();
</script>
<template>
  <ErrorBoundary v-if="error" :error="error" />
  <ProductSkeleton v-else-if="loading" />
  <ProductGrid v-else :products="data" />
</template>
```

---

> Default to Composition API, colocate by feature, separate server state (Vue Query) from client state (Pinia).
