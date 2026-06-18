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

## Table of Contents

### Basic (1–10)
1. [What is Vue.js?](#1-what-is-vuejs) · 2. [Vue 2 vs Vue 3](#2-vue-2-vs-vue-3) · 3. [Single File Components](#3-single-file-components)
4. [Props & Emits](#4-props--emits) · 5. [v-model](#5-v-model) · 6. [ref vs reactive](#6-ref-vs-reactive)
7. [Computed Properties](#7-computed-properties) · 8. [v-if vs v-show](#8-v-if-vs-v-show)
9. [Vue Router Basics](#9-vue-router-basics) · 10. [Conditional Rendering](#10-conditional-rendering)

### Intermediate (11–20)
11. [watch vs watchEffect](#11-watch-vs-watcheffect) · 12. [Lifecycle Hooks](#12-lifecycle-hooks)
13. [Slots](#13-slots) · 14. [Provide / Inject](#14-provide--inject) · 15. [Composables](#15-composables)
16. [Keys in v-for](#16-keys-in-v-for) · 17. [Pinia Basics](#17-pinia-basics)
18. [Dynamic Components](#18-dynamic-components) · 19. [Template Refs](#19-template-refs)
20. [nextTick](#20-nexttick)

### Advanced (21–30)
21. [Reactivity Internals](#21-reactivity-internals) · 22. [Teleport](#22-teleport)
23. [Suspense](#23-suspense) · 24. [Custom Directives](#24-custom-directives)
25. [Keep-alive](#25-keep-alive) · 26. [Vuex vs Pinia](#26-vuex-vs-pinia)
27. [Nuxt.js SSR](#27-nuxtjs-ssr) · 28. [Performance — v-memo](#28-performance--v-memo)
29. [TypeScript with Vue](#29-typescript-with-vue) · 30. [Vue Best Practices](#30-vue-best-practices)

---

# Basic

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

## 2. Vue 2 vs Vue 3

### Theory
Vue 3: Proxy reactivity, Composition API, better TS, smaller bundle, Pinia over Vuex, fragments, Teleport.

### One-Line Interview Answer
> Vue 3 uses Proxy instead of defineProperty — supports dynamic keys, Composition API, and tree-shaking.

---

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

## 8. v-if vs v-show

### Theory
`v-if` — conditional mount (lazy, higher toggle cost). `v-show` — CSS display toggle (initial render cost).

### One-Line Interview Answer
> v-if for infrequent toggles or lazy load. v-show for frequent visibility toggles — stays in DOM.

---

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

## 11. watch vs watchEffect

### One-Line Interview Answer
> watch tracks explicit sources with old/new values. watchEffect auto-tracks deps and runs immediately.

```javascript
watch(userId, (id) => fetchUser(id));
watchEffect(() => { document.title = user.value?.name ?? "App"; });
```

---

## 12. Lifecycle Hooks

### One-Line Interview Answer
> onMounted for DOM and fetch. onUnmounted for cleanup. onBeforeUnmount runs before teardown.

```javascript
onMounted(() => { window.addEventListener("resize", handleResize); });
onUnmounted(() => { window.removeEventListener("resize", handleResize); });
```

---

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

## 14. Provide / Inject

### One-Line Interview Answer
> provide/inject shares data from ancestor to descendant without prop drilling — use Symbol keys in large apps.

---

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

## 16. Keys in v-for

### One-Line Interview Answer
> Always use stable unique :key — never index when list can reorder, insert, or delete.

```vue
<li v-for="item in todos" :key="item.id">{{ item.text }}</li>
```

---

## 17. Pinia Basics

### One-Line Interview Answer
> Pinia: defineStore with state, getters, actions. No mutations. useCartStore() in components.

---

## 18. Dynamic Components

### Theory
`<component :is="activeTab">` switches rendered component. Works with keep-alive.

```vue
<component :is="tabs[activeIndex].component" />
```

---

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

## 21. Reactivity Internals

### One-Line Interview Answer
> Vue 3 uses Proxy to trap get/set. track() collects deps on get, trigger() notifies on set. ref wraps value in object with .value getter/setter.

---

## 22. Teleport

### Theory
Render content elsewhere in DOM — modals, toasts to `<body>`.

```vue
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>
```

---

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

## 24. Custom Directives

```javascript
app.directive("focus", {
  mounted(el) { el.focus(); },
});
// <input v-focus />
```

---

## 25. Keep-alive

### Theory
Cache inactive component instances — preserve state in tab switches.

```vue
<keep-alive include="Dashboard,Settings">
  <component :is="view" />
</keep-alive>
```

---

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

## 27. Nuxt.js SSR

### One-Line Interview Answer
> Nuxt adds SSR, file routing, and useFetch for Vue — pages/ directory auto-routes, server-side data fetch hydrates on client.

---

## 28. Performance — v-memo

```vue
<div v-memo="[item.id, item.selected]">
  <ExpensiveRow :item="item" />
</div>
```

---

## 29. TypeScript with Vue

```vue
<script setup lang="ts">
interface Props { title: string; count?: number; }
const props = withDefaults(defineProps<Props>(), { count: 0 });
const emit = defineEmits<{ submit: [id: string] }>();
</script>
```

---

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
