---
title: "Top 50 Vue Interview Questions — Pattern-Wise Guide"
description: "50 Vue 3 interview questions by topic pattern — reactivity, Composition API, Pinia, Router, Nuxt, performance."
tags: ["vue", "interview", "vue3", "pinia", "composition-api"]
level: "All levels"
format: "Pattern-wise Q&A"
---

# Top 50 Vue Interview Questions — Pattern-Wise Guide

50 Vue 3 questions organized by **patterns** — fundamentals, reactivity, Composition API, state, routing, async data, performance, and Nuxt.

Each includes **Theory**, **One-Line Interview Answer**, and **Real Example**.

---

## Table of Contents

**Pattern 1 — Fundamentals (1–5)** · Vue basics, SFC, template syntax, directives, Vue vs React  
**Pattern 2 — Components & Data Flow (6–10)** · Props, emits, slots, v-model, event handling  
**Pattern 3 — Reactivity (11–16)** · ref, reactive, computed, watch, watchEffect, toRefs  
**Pattern 4 — Composition API (17–22)** · script setup, composables, lifecycle, provide/inject  
**Pattern 5 — State Management (23–26)** · Pinia, Vuex migration, store patterns  
**Pattern 6 — Vue Router (27–30)** · Routes, guards, lazy loading, navigation  
**Pattern 7 — Async & API (31–34)** · useFetch composable, TanStack Query, error states  
**Pattern 8 — Performance (35–38)** · v-memo, keep-alive, async components, virtual scroll  
**Pattern 9 — Advanced Vue 3 (39–43)** · Teleport, Suspense, custom directives, plugins  
**Pattern 10 — Nuxt & SSR (44–46)** · SSR, useAsyncData, hydration  
**Pattern 11 — TypeScript & Testing (47–48)** · Typed components, Vitest  
**Pattern 12 — Architecture & Patterns (49–50)** · Folder structure, design patterns  

---

# Pattern 1 — Fundamentals

## 1. What is Vue.js?

> Progressive framework — adopt incrementally from a widget to full SPA. Reactive data + component architecture.

```vue
<script setup>
import { ref } from "vue";
const count = ref(0);
</script>
<template><button @click="count++">{{ count }}</button></template>
```

## 2. Single File Components (SFC)

> `.vue` files combine script, template, scoped styles — compiled by Vite.

## 3. Template Syntax & Directives

> `{{ }}` interpolation, `v-bind`, `v-on`, `v-if`, `v-for`, `v-model` — declarative DOM binding.

## 4. Vue 2 vs Vue 3

> Proxy reactivity, Composition API, fragments, Teleport, better TS, Pinia, smaller bundle.

## 5. Vue vs React

> Vue: automatic reactivity, templates, v-model. React: JSX, larger ecosystem, manual state updates.

---

# Pattern 2 — Components & Data Flow

## 6. Props Validation

```javascript
defineProps({
  id: { type: String, required: true },
  status: { type: String, default: "active", validator: (v) => ["active","archived"].includes(v) },
});
```

## 7. Emits & Two-Way Communication

```javascript
const emit = defineEmits(["update:modelValue", "save"]);
emit("update:modelValue", newValue);
```

## 8. Slots — Default, Named, Scoped

```vue
<!-- Scoped slot -->
<slot name="item" :row="item" :index="i" />
```

## 9. v-model on Components

> Multiple v-models: `v-model:title` maps to prop `title` and emit `update:title`.

## 10. Event Handling & Modifiers

```vue
<form @submit.prevent="handleSubmit">
  <input @keyup.enter="search" />
  <a @click.stop.prevent="navigate">Link</a>
</form>
```

---

# Pattern 3 — Reactivity

## 11. ref()

> Wraps value in reactive object — `.value` in script, auto-unwrap in template.

## 12. reactive()

> Proxy-based deep reactivity for objects. Cannot replace entire object reference without losing binding.

## 13. computed()

> Cached getter; optional setter for writable computed.

```javascript
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (val) => { [first.value, last.value] = val.split(" "); },
});
```

## 14. watch()

```javascript
watch(source, (newVal, oldVal) => {}, { immediate: true, deep: true, flush: "post" });
watch([a, b], ([newA, newB]) => {});
```

## 15. watchEffect()

> Runs immediately, auto-tracks deps. `onCleanup` for teardown inside effect.

## 16. toRef / toRefs

> Preserve reactivity when destructuring reactive objects.

---

# Pattern 4 — Composition API

## 17. script setup

> Compiler sugar — top-level bindings auto-exposed to template. defineProps/defineEmits are macros.

## 18. Composables

```javascript
export function useDebounce(value, delay = 300) {
  const debounced = ref(value.value);
  watch(value, (v) => {
    const t = setTimeout(() => debounced.value = v, delay);
    onScopeDispose(() => clearTimeout(t));
  });
  return debounced;
}
```

## 19. Lifecycle Mapping

| Options | Composition |
|---------|-------------|
| mounted | onMounted |
| unmounted | onUnmounted |

## 20. provide / inject

```javascript
provide("api", readonly(apiClient));
const api = inject("api");
```

## 21. defineExpose()

> Expose public methods to parent via template ref.

```javascript
defineExpose({ focus: () => inputRef.value?.focus() });
```

## 22. Composable vs Mixin

> Composables replace mixins — explicit imports, no naming collisions, better TypeScript.

---

# Pattern 5 — State Management

## 23. Pinia defineStore

```javascript
export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0));
  function addItem(p) { items.value.push(p); }
  return { items, total, addItem };
});
```

## 24. Pinia vs Component State

> Local useState/ref for UI-only. Pinia for cross-route shared state (cart, auth).

## 25. Vuex to Pinia Migration

> Remove mutations — move logic to actions. Modules become separate defineStore calls.

## 26. Store Composition

```javascript
const user = useUserStore();
const cart = useCartStore();
const checkout = computed(() => ({ user: user.profile, items: cart.items }));
```

---

# Pattern 6 — Vue Router

## 27. Route Configuration

```javascript
{ path: "/products/:id", name: "product", component: Product, props: true }
```

## 28. Navigation Guards

```javascript
router.beforeEach(async (to) => {
  if (to.meta.auth && !isLoggedIn()) return "/login";
});
```

## 29. Lazy-Loaded Routes

```javascript
{ path: "/admin", component: () => import("./pages/Admin.vue") }
```

## 30. useRoute & useRouter

```javascript
const route = useRoute();
const router = useRouter();
router.push({ name: "product", params: { id: "123" } });
```

---

# Pattern 7 — Async & API

## 31. useFetch Composable

```javascript
export function useFetch(url) {
  const data = ref(null), loading = ref(true), error = ref(null);
  watchEffect(async (onCleanup) => {
    const ctrl = new AbortController();
    onCleanup(() => ctrl.abort());
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      data.value = await r.json();
    } catch (e) { error.value = e.message; }
    finally { loading.value = false; }
  });
  return { data, loading, error };
}
```

## 32. Pinia Async Actions

```javascript
async function fetchProducts() {
  this.loading = true;
  try { this.products = await api.getProducts(); }
  finally { this.loading = false; }
}
```

## 33. @tanstack/vue-query

```javascript
const { data, isLoading } = useQuery({
  queryKey: ["products", filters],
  queryFn: () => api.getProducts(filters),
});
```

## 34. Loading / Error / Empty UI

```vue
<template>
  <Spinner v-if="loading" />
  <ErrorBanner v-else-if="error" @retry="refetch" />
  <EmptyState v-else-if="!items.length" />
  <ItemList v-else :items="items" />
</template>
```

---

# Pattern 8 — Performance

## 35. v-memo

> Skip update if memo deps unchanged — like React.memo for template subtrees.

## 36. keep-alive

> Cache component instances — preserve form state across tab switches.

## 37. defineAsyncComponent

```javascript
const HeavyChart = defineAsyncComponent({
  loader: () => import("./HeavyChart.vue"),
  loadingComponent: Spinner,
  delay: 200,
});
```

## 38. Virtual Scrolling

> vue-virtual-scroller or @tanstack/vue-virtual for 10k+ row lists.

---

# Pattern 9 — Advanced Vue 3

## 39. Teleport — Modals

```vue
<Teleport to="#modal-root"><Dialog /></Teleport>
```

## 40. Suspense

> Async setup() + Suspense fallback for loading states.

## 41. Custom Directives

```javascript
vTooltip = { mounted(el, binding) { /* tippy setup */ } }
```

## 42. Plugins

```javascript
app.use(router).use(pinia).use(i18n);
```

## 43. render Functions & h()

> Escape hatch for dynamic rendering — rarely needed with templates.

---

# Pattern 10 — Nuxt & SSR

## 44. CSR vs SSR in Vue

> SPA: client-only. Nuxt SSR: HTML with data on first load, hydrates on client.

## 45. useAsyncData / useFetch (Nuxt)

```javascript
const { data, pending } = await useFetch("/api/products");
```

## 46. Hydration Mismatch

> Caused by server/client HTML difference — use ClientOnly, match dates, avoid window in setup.

---

# Pattern 11 — TypeScript & Testing

## 47. Typed defineProps & defineEmits

```typescript
const props = defineProps<{ id: string; optional?: number }>();
const emit = defineEmits<{ (e: "save", payload: FormData): void }>();
```

## 48. Vitest + Vue Test Utils

```javascript
import { mount } from "@vue/test-utils";
const wrapper = mount(Counter);
await wrapper.find("button").trigger("click");
expect(wrapper.text()).toContain("1");
```

---

# Pattern 12 — Architecture

## 49. Feature-Based Structure

```
src/features/cart/{components,composables,stores,types}
src/shared/{components,composables}
```

## 50. Vue Design Patterns

| Pattern | Vue equivalent |
|---------|----------------|
| Custom hooks | Composables |
| Context | provide/inject, Pinia |
| HOC | Composables or wrapper components |
| Render props | Scoped slots |
| Compound components | Multi-component with provide/inject |

### One-Line Interview Answer
> Feature folders, composables for logic, Pinia for global state, scoped slots instead of render props, lazy routes for performance.

---

# Pattern Map — Quick Revision

| Pattern | Q# | Core idea |
|---------|-----|-----------|
| Fundamentals | 1–5 | Progressive framework, SFC, directives |
| Components | 6–10 | Props down, emits up, v-model |
| Reactivity | 11–16 | ref, reactive, computed, watch |
| Composition | 17–22 | script setup, composables |
| State | 23–26 | Pinia stores |
| Router | 27–30 | Guards, lazy routes |
| Async | 31–34 | Composables, vue-query |
| Performance | 35–38 | v-memo, keep-alive, async |
| Advanced | 39–43 | Teleport, Suspense |
| Nuxt | 44–46 | SSR, useFetch |
| TS/Test | 47–48 | Typed props, Vitest |
| Architecture | 49–50 | Feature folders, patterns |

---

*50 patterns. Master reactivity + Composition API + Pinia and Vue interviews become predictable.*
