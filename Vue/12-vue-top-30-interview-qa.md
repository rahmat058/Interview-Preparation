---
title: "Top 30 Vue.js Interview Q&A Cheat Sheet"
description: "Short, practical Vue 3 interview answers — Basic, Intermediate, Advanced — with one real example each."
tags: ["vue", "interview", "cheat-sheet", "vue3", "composition-api"]
level: "All levels"
format: "Short Q&A"
---

# Top 30 Vue.js Interview Q&A Cheat Sheet

Short, practical answers for Vue 3 interviews. Each question: **Theory**, **Pros & Cons** (where useful), **One-Line Interview Answer**, **Real Example**.

Organized: **Basic → Intermediate → Advanced**

---

<a id="quick-index"></a>

## Quick index


### Intermediate (11–20)

| # | Section |
| --- | --- |
| <span id="i20"></span>20 | [nextTick](#p20) |

---
# Basic

<a id="p1"></a>

## 1. What is Vue.js?

### Theory
Progressive JavaScript **framework** for building UIs with reactive data binding and components.

### One-Line Interview Answer
> Vue is a progressive framework — reactive, component-based, with gentle learning curve and excellent documentation.

### Real Example
```vue
<script setup>
import { ref } from "vue";
const message = ref("Hello Vue");
</script>
<template><h1>{{ message }}</h1></template>
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Vue 2 vs Vue 3

### Theory
Vue 3: Proxy reactivity, Composition API, better TS, smaller bundle, Pinia over Vuex, fragments, Teleport.

### One-Line Interview Answer
> Vue 3 uses Proxy instead of defineProperty — supports dynamic keys, Composition API, and tree-shaking.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. Single File Components

### Theory
`.vue` files combine `<script>`, `<template>`, `<style scoped>` — colocated component logic and styling.

### One-Line Interview Answer
> SFCs colocate template, logic, and scoped styles — processed by Vite or Vue CLI.

```vue
<script setup>
defineProps({ title: String });
</script>
<template><h2>{{ title }}</h2></template>
<style scoped>h2 { color: #42b883; }</style>
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Props & Emits

### Theory
Props flow down (read-only). Emits flow up as events. Use `defineProps` and `defineEmits` in script setup.

### One-Line Interview Answer
> Props are read-only parent-to-child data. Emits declare events the child fires to the parent.

```vue
<script setup>
const props = defineProps({ label: String });
const emit = defineEmits(["submit"]);
</script>
<template><button @click="emit('submit')">{{ label }}</button></template>
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. v-model

### Theory
Two-way binding — `:modelValue` + `@update:modelValue`. Can use multiple v-models on one component.

### One-Line Interview Answer
> v-model is sugar for prop + emit. On custom components it's modelValue and update:modelValue.

```vue
<!-- Parent -->
<CustomInput v-model="search" />
<!-- Equivalent -->
<CustomInput :modelValue="search" @update:modelValue="search = $event" />

<!-- Multiple v-models -->
<UserForm v-model:name="name" v-model:email="email" />
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. ref vs reactive

### Theory
`ref` — any value, access `.value` in script. `reactive` — objects only, no `.value`.

### One-Line Interview Answer
> ref for primitives and when replacing entire value. reactive for objects — don't destructure without toRefs.

```javascript
const count = ref(0);
const state = reactive({ items: [] });
count.value++;
state.items.push(item);
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. Computed Properties

### Theory
Cached derived values — only recompute when dependencies change. Getter-only by default; setter optional.

### One-Line Interview Answer
> computed caches derived state — use instead of methods in templates when result depends on reactive data.

```javascript
const firstName = ref("Amit");
const lastName = ref("Shah");
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. v-if vs v-show

### Theory
`v-if` — conditional mount (lazy, higher toggle cost). `v-show` — CSS display toggle (initial render cost).

### One-Line Interview Answer
> v-if for infrequent toggles or lazy load. v-show for frequent visibility toggles — stays in DOM.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. Vue Router Basics

### Theory
`createRouter`, `RouterView`, `RouterLink`, dynamic routes with `:id`, `useRoute()`, `useRouter()`.

### One-Line Interview Answer
> Vue Router maps URLs to components — RouterView renders matched component, guards protect routes.

```javascript
const routes = [{ path: "/user/:id", component: UserPage }];
const router = createRouter({ history: createWebHistory(), routes });
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Conditional Rendering

### Theory
`v-if` / `v-else-if` / `v-else`, `v-show`, `<template v-if>` for grouping without extra DOM.

### Real Example
```vue
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <ProductList v-else :items="products" />
</template>
```

---

# Intermediate


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. watch vs watchEffect

### One-Line Interview Answer
> watch tracks explicit sources with old/new values. watchEffect auto-tracks deps and runs immediately.

```javascript
watch(userId, (id) => fetchUser(id));
watchEffect(() => { document.title = user.value?.name ?? "App"; });
```

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Lifecycle Hooks

### One-Line Interview Answer
> onMounted for DOM and fetch. onUnmounted for cleanup. onBeforeUnmount runs before teardown.

```javascript
onMounted(() => { window.addEventListener("resize", handleResize); });
onUnmounted(() => { window.removeEventListener("resize", handleResize); });
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Slots

### Theory
Default slot, named slots (`#header`), scoped slots (child passes data to slot).

```vue
<!-- Child -->
<slot name="header" :title="pageTitle" />
<slot :item="row" />

<!-- Parent -->
<template #header="{ title }"><h1>{{ title }}</h1></template>
<template #default="{ item }"><span>{{ item.name }}</span></template>
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Provide / Inject

### One-Line Interview Answer
> provide/inject shares data from ancestor to descendant without prop drilling — use Symbol keys in large apps.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Composables

### One-Line Interview Answer
> Composables are reusable setup functions — Vue's custom hooks. Name with use, call at top level of setup.

```javascript
export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => count.value++;
  return { count, increment };
}
```

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Keys in v-for

### One-Line Interview Answer
> Always use stable unique :key — never index when list can reorder, insert, or delete.

```vue
<li v-for="item in todos" :key="item.id">{{ item.text }}</li>
```

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

## 17. Pinia Basics

### One-Line Interview Answer
> Pinia: defineStore with state, getters, actions. No mutations. useCartStore() in components.

---


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

## 18. Dynamic Components

### Theory
`<component :is="activeTab">` switches rendered component. Works with keep-alive.

```vue
<component :is="tabs[activeIndex].component" />
```

---


<p><a href="#i18">Back to index</a></p>

<a id="p19"></a>

## 19. Template Refs

### One-Line Interview Answer
> ref on template element gives DOM access in onMounted — use for focus, scroll, third-party libs.

```vue
<script setup>
const inputRef = ref(null);
onMounted(() => inputRef.value.focus());
</script>
<template><input ref="inputRef" /></template>
```

---


<p><a href="#i19">Back to index</a></p>

<a id="p20"></a>

## 20. nextTick

### Theory
Wait for DOM update after reactive state change before accessing updated DOM.

```javascript
count.value++;
await nextTick();
console.log(el.value.textContent); // updated DOM
```

---

# Advanced


<p><a href="#i20">Back to index</a></p>

<a id="p21"></a>

## 21. Reactivity Internals

### One-Line Interview Answer
> Vue 3 uses Proxy to trap get/set. track() collects deps on get, trigger() notifies on set. ref wraps value in object with .value getter/setter.

---


<p><a href="#i21">Back to index</a></p>

<a id="p22"></a>

## 22. Teleport

### Theory
Render content elsewhere in DOM — modals, toasts to `<body>`.

```vue
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>
```

---


<p><a href="#i22">Back to index</a></p>

<a id="p23"></a>

## 23. Suspense

### Theory
Show fallback while async setup or async components resolve.

```vue
<Suspense>
  <AsyncDashboard />
  <template #fallback><Spinner /></template>
</Suspense>
```

---


<p><a href="#i23">Back to index</a></p>

<a id="p24"></a>

## 24. Custom Directives

```javascript
app.directive("focus", {
  mounted(el) { el.focus(); },
});
// <input v-focus />
```

---


<p><a href="#i24">Back to index</a></p>

<a id="p25"></a>

## 25. Keep-alive

### Theory
Cache inactive component instances — preserve state in tab switches.

```vue
<keep-alive include="Dashboard,Settings">
  <component :is="view" />
</keep-alive>
```

---


<p><a href="#i25">Back to index</a></p>

<a id="p26"></a>

## 26. Vuex vs Pinia

| | Vuex | Pinia |
|--|------|-------|
| Mutations | Required | Removed |
| Modules | Manual | Automatic per store |
| TypeScript | Verbose | Native |
| Vue 3 | Vuex 4 | Recommended |

### One-Line Interview Answer
> Pinia is the Vue 3 standard — simpler API, no mutations, better TypeScript. Vuex for legacy only.

---


<p><a href="#i26">Back to index</a></p>

<a id="p27"></a>

## 27. Nuxt.js SSR

### One-Line Interview Answer
> Nuxt adds SSR, file routing, and useFetch for Vue — pages/ directory auto-routes, server-side data fetch hydrates on client.

---


<p><a href="#i27">Back to index</a></p>

<a id="p28"></a>

## 28. Performance — v-memo

```vue
<div v-memo="[item.id, item.selected]">
  <ExpensiveRow :item="item" />
</div>
```

---


<p><a href="#i28">Back to index</a></p>

<a id="p29"></a>

## 29. TypeScript with Vue

```vue
<script setup lang="ts">
interface Props { title: string; count?: number; }
const props = withDefaults(defineProps<Props>(), { count: 0 });
const emit = defineEmits<{ submit: [id: string] }>();
</script>
```

---


<p><a href="#i29">Back to index</a></p>

<a id="p30"></a>

## 30. Vue Best Practices

- Default to `<script setup>` + Composition API
- Colocate composables per feature
- Pinia for global state, not provide/inject for everything
- Lazy-load routes and heavy components
- Use TypeScript for props and emits
- Scoped styles; CSS modules for complex components

### One-Line Interview Answer
> script setup, composables, Pinia, typed props, lazy routes, and feature-based folders — same principles as React but with Vue idioms.

---

# Quick Revision Table

| # | Topic | One-liner |
|---|-------|-----------|
| 1 | Vue | Progressive reactive framework |
| 6 | ref/reactive | .value vs Proxy object |
| 5 | v-model | modelValue + update:modelValue |
| 11 | watch | Explicit source, old/new value |
| 17 | Pinia | defineStore, no mutations |
| 26 | Pinia vs Vuex | Pinia for Vue 3 |
| 15 | Composables | Reusable setup logic |


<p><a href="#i30">Back to index</a></p>
