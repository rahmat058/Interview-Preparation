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

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is Vue.js?](#p1) |
| <span id="i2"></span>2 | [Single File Components (SFC)](#p2) |
| <span id="i3"></span>3 | [Template Syntax & Directives](#p3) |
| <span id="i4"></span>4 | [Vue 2 vs Vue 3](#p4) |
| <span id="i5"></span>5 | [Vue vs React](#p5) |
| <span id="i6"></span>6 | [Props Validation](#p6) |
| <span id="i7"></span>7 | [Emits & Two-Way Communication](#p7) |
| <span id="i8"></span>8 | [Slots — Default, Named, Scoped](#p8) |
| <span id="i9"></span>9 | [v-model on Components](#p9) |
| <span id="i10"></span>10 | [Event Handling & Modifiers](#p10) |
| <span id="i11"></span>11 | [ref()](#p11) |
| <span id="i12"></span>12 | [reactive()](#p12) |
| <span id="i13"></span>13 | [computed()](#p13) |
| <span id="i14"></span>14 | [watch()](#p14) |
| <span id="i15"></span>15 | [watchEffect()](#p15) |
| <span id="i16"></span>16 | [toRef / toRefs](#p16) |
| <span id="i17"></span>17 | [script setup](#p17) |
| <span id="i18"></span>18 | [Composables](#p18) |
| <span id="i19"></span>19 | [Lifecycle Mapping](#p19) |
| <span id="i20"></span>20 | [provide / inject](#p20) |
| <span id="i21"></span>21 | [defineExpose()](#p21) |
| <span id="i22"></span>22 | [Composable vs Mixin](#p22) |
| <span id="i23"></span>23 | [Pinia defineStore](#p23) |
| <span id="i24"></span>24 | [Pinia vs Component State](#p24) |
| <span id="i25"></span>25 | [Vuex to Pinia Migration](#p25) |
| <span id="i26"></span>26 | [Store Composition](#p26) |
| <span id="i27"></span>27 | [Route Configuration](#p27) |
| <span id="i28"></span>28 | [Navigation Guards](#p28) |
| <span id="i29"></span>29 | [Lazy-Loaded Routes](#p29) |
| <span id="i30"></span>30 | [useRoute & useRouter](#p30) |
| <span id="i31"></span>31 | [useFetch Composable](#p31) |
| <span id="i32"></span>32 | [Pinia Async Actions](#p32) |
| <span id="i33"></span>33 | [@tanstack/vue-query](#p33) |
| <span id="i34"></span>34 | [Loading / Error / Empty UI](#p34) |
| <span id="i35"></span>35 | [v-memo](#p35) |
| <span id="i36"></span>36 | [keep-alive](#p36) |
| <span id="i37"></span>37 | [defineAsyncComponent](#p37) |
| <span id="i38"></span>38 | [Virtual Scrolling](#p38) |
| <span id="i39"></span>39 | [Teleport — Modals](#p39) |
| <span id="i40"></span>40 | [Suspense](#p40) |
| <span id="i41"></span>41 | [Custom Directives](#p41) |
| <span id="i42"></span>42 | [Plugins](#p42) |
| <span id="i43"></span>43 | [render Functions & h()](#p43) |
| <span id="i44"></span>44 | [CSR vs SSR in Vue](#p44) |
| <span id="i45"></span>45 | [useAsyncData / useFetch (Nuxt)](#p45) |
| <span id="i46"></span>46 | [Hydration Mismatch](#p46) |
| <span id="i47"></span>47 | [Typed defineProps & defineEmits](#p47) |
| <span id="i48"></span>48 | [Vitest + Vue Test Utils](#p48) |
| <span id="i49"></span>49 | [Feature-Based Structure](#p49) |
| <span id="i50"></span>50 | [Vue Design Patterns](#p50) |

---
# Pattern 1 — Fundamentals

<a id="p1"></a>

## 1. What is Vue.js?

> Progressive framework — adopt incrementally from a widget to full SPA. Reactive data + component architecture.

```vue
<script setup>
import { ref } from "vue";
const count = ref(0);
</script>
<template><button @click="count++">{{ count }}</button></template>
```


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Single File Components (SFC)

> `.vue` files combine script, template, scoped styles — compiled by Vite.


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Template Syntax & Directives

> `{{ }}` interpolation, `v-bind`, `v-on`, `v-if`, `v-for`, `v-model` — declarative DOM binding.


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Vue 2 vs Vue 3

> Proxy reactivity, Composition API, fragments, Teleport, better TS, Pinia, smaller bundle.


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Vue vs React

> Vue: automatic reactivity, templates, v-model. React: JSX, larger ecosystem, manual state updates.

---

# Pattern 2 — Components & Data Flow


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. Props Validation

```javascript
defineProps({
  id: { type: String, required: true },
  status: { type: String, default: "active", validator: (v) => ["active","archived"].includes(v) },
});
```


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Emits & Two-Way Communication

```javascript
const emit = defineEmits(["update:modelValue", "save"]);
emit("update:modelValue", newValue);
```


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Slots — Default, Named, Scoped

```vue
<!-- Scoped slot -->
<slot name="item" :row="item" :index="i" />
```


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. v-model on Components

> Multiple v-models: `v-model:title` maps to prop `title` and emit `update:title`.


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Event Handling & Modifiers

```vue
<form @submit.prevent="handleSubmit">
  <input @keyup.enter="search" />
  <a @click.stop.prevent="navigate">Link</a>
</form>
```

---

# Pattern 3 — Reactivity


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. ref()

> Wraps value in reactive object — `.value` in script, auto-unwrap in template.


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. reactive()

> Proxy-based deep reactivity for objects. Cannot replace entire object reference without losing binding.


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. computed()

> Cached getter; optional setter for writable computed.

```javascript
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (val) => { [first.value, last.value] = val.split(" "); },
});
```


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. watch()

```javascript
watch(source, (newVal, oldVal) => {}, { immediate: true, deep: true, flush: "post" });
watch([a, b], ([newA, newB]) => {});
```


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. watchEffect()

> Runs immediately, auto-tracks deps. `onCleanup` for teardown inside effect.


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. toRef / toRefs

> Preserve reactivity when destructuring reactive objects.

---

# Pattern 4 — Composition API


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. script setup

> Compiler sugar — top-level bindings auto-exposed to template. defineProps/defineEmits are macros.


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

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


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Lifecycle Mapping

| Options | Composition |
|---------|-------------|
| mounted | onMounted |
| unmounted | onUnmounted |


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. provide / inject

```javascript
provide("api", readonly(apiClient));
const api = inject("api");
```


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

## 21. defineExpose()

> Expose public methods to parent via template ref.

```javascript
defineExpose({ focus: () => inputRef.value?.focus() });
```


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

## 22. Composable vs Mixin

> Composables replace mixins — explicit imports, no naming collisions, better TypeScript.

---

# Pattern 5 — State Management


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

## 23. Pinia defineStore

```javascript
export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0));
  function addItem(p) { items.value.push(p); }
  return { items, total, addItem };
});
```


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

## 24. Pinia vs Component State

> Local useState/ref for UI-only. Pinia for cross-route shared state (cart, auth).


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

## 25. Vuex to Pinia Migration

> Remove mutations — move logic to actions. Modules become separate defineStore calls.


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

## 26. Store Composition

```javascript
const user = useUserStore();
const cart = useCartStore();
const checkout = computed(() => ({ user: user.profile, items: cart.items }));
```

---

# Pattern 6 — Vue Router


<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

## 27. Route Configuration

```javascript
{ path: "/products/:id", name: "product", component: Product, props: true }
```


<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

## 28. Navigation Guards

```javascript
router.beforeEach(async (to) => {
  if (to.meta.auth && !isLoggedIn()) return "/login";
});
```


<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

## 29. Lazy-Loaded Routes

```javascript
{ path: "/admin", component: () => import("./pages/Admin.vue") }
```


<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

## 30. useRoute & useRouter

```javascript
const route = useRoute();
const router = useRouter();
router.push({ name: "product", params: { id: "123" } });
```

---

# Pattern 7 — Async & API


<p><a href="#i30">Back to index</a></p>

<a id="p31"></a>

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


<p><a href="#i31">Back to index</a></p>

<a id="p32"></a>

## 32. Pinia Async Actions

```javascript
async function fetchProducts() {
  this.loading = true;
  try { this.products = await api.getProducts(); }
  finally { this.loading = false; }
}
```


<p><a href="#i32">Back to index</a></p>

<a id="p33"></a>

## 33. @tanstack/vue-query

```javascript
const { data, isLoading } = useQuery({
  queryKey: ["products", filters],
  queryFn: () => api.getProducts(filters),
});
```


<p><a href="#i33">Back to index</a></p>

<a id="p34"></a>

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


<p><a href="#i34">Back to index</a></p>

<a id="p35"></a>

## 35. v-memo

> Skip update if memo deps unchanged — like React.memo for template subtrees.


<p><a href="#i35">Back to index</a></p>

<a id="p36"></a>

## 36. keep-alive

> Cache component instances — preserve form state across tab switches.


<p><a href="#i36">Back to index</a></p>

<a id="p37"></a>

## 37. defineAsyncComponent

```javascript
const HeavyChart = defineAsyncComponent({
  loader: () => import("./HeavyChart.vue"),
  loadingComponent: Spinner,
  delay: 200,
});
```


<p><a href="#i37">Back to index</a></p>

<a id="p38"></a>

## 38. Virtual Scrolling

> vue-virtual-scroller or @tanstack/vue-virtual for 10k+ row lists.

---

# Pattern 9 — Advanced Vue 3


<p><a href="#i38">Back to index</a></p>

<a id="p39"></a>

## 39. Teleport — Modals

```vue
<Teleport to="#modal-root"><Dialog /></Teleport>
```


<p><a href="#i39">Back to index</a></p>

<a id="p40"></a>

## 40. Suspense

> Async setup() + Suspense fallback for loading states.


<p><a href="#i40">Back to index</a></p>

<a id="p41"></a>

## 41. Custom Directives

```javascript
vTooltip = { mounted(el, binding) { /* tippy setup */ } }
```


<p><a href="#i41">Back to index</a></p>

<a id="p42"></a>

## 42. Plugins

```javascript
app.use(router).use(pinia).use(i18n);
```


<p><a href="#i42">Back to index</a></p>

<a id="p43"></a>

## 43. render Functions & h()

> Escape hatch for dynamic rendering — rarely needed with templates.

---

# Pattern 10 — Nuxt & SSR


<p><a href="#i43">Back to index</a></p>

<a id="p44"></a>

## 44. CSR vs SSR in Vue

> SPA: client-only. Nuxt SSR: HTML with data on first load, hydrates on client.


<p><a href="#i44">Back to index</a></p>

<a id="p45"></a>

## 45. useAsyncData / useFetch (Nuxt)

```javascript
const { data, pending } = await useFetch("/api/products");
```


<p><a href="#i45">Back to index</a></p>

<a id="p46"></a>

## 46. Hydration Mismatch

> Caused by server/client HTML difference — use ClientOnly, match dates, avoid window in setup.

---

# Pattern 11 — TypeScript & Testing


<p><a href="#i46">Back to index</a></p>

<a id="p47"></a>

## 47. Typed defineProps & defineEmits

```typescript
const props = defineProps<{ id: string; optional?: number }>();
const emit = defineEmits<{ (e: "save", payload: FormData): void }>();
```


<p><a href="#i47">Back to index</a></p>

<a id="p48"></a>

## 48. Vitest + Vue Test Utils

```javascript
import { mount } from "@vue/test-utils";
const wrapper = mount(Counter);
await wrapper.find("button").trigger("click");
expect(wrapper.text()).toContain("1");
```

---

# Pattern 12 — Architecture


<p><a href="#i48">Back to index</a></p>

<a id="p49"></a>

## 49. Feature-Based Structure

```
src/features/cart/{components,composables,stores,types}
src/shared/{components,composables}
```


<p><a href="#i49">Back to index</a></p>

<a id="p50"></a>

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


<p><a href="#i50">Back to index</a></p>
