---
title: "Vue.js Interview Preparation — Complete Guide"
description: "Comprehensive Vue 3 interview prep — Composition API, reactivity, Pinia, Vue Router, Nuxt, and senior topics."
tags: ["vue", "interview", "vue3", "composition-api", "pinia"]
level: "All levels (2–6 YOE)"
format: "Complete guide"
---

# Vue.js Interview Preparation — Complete Guide

End-to-end Vue 3 interview preparation covering **fundamentals → Composition API → state management → routing → performance → architecture**. Each topic includes **Theory**, **Pros & Cons**, **One-Line Interview Answer**, and **Real Examples**.

> Vue interviews focus on **reactivity internals**, **Options vs Composition API**, **Pinia/Vuex**, and **Vue Router** — know both syntax styles for legacy codebases.

---

## Table of Contents

1. [What is Vue.js?](#1-what-is-vuejs)
2. [Vue 2 vs Vue 3](#2-vue-2-vs-vue-3)
3. [Options API vs Composition API](#3-options-api-vs-composition-api)
4. [Template Syntax & Directives](#4-template-syntax--directives)
5. [Components — Props, Emits, Slots](#5-components--propss-emits-slots)
6. [Reactivity System](#6-reactivity-system)
7. [Computed vs Watch vs watchEffect](#7-computed-vs-watch-vs-watcheffect)
8. [Lifecycle Hooks](#8-lifecycle-hooks)
9. [Provide / Inject](#9-provide--inject)
10. [Pinia State Management](#10-pinia-state-management)
11. [Vue Router](#11-vue-router)
12. [Composables (Custom Hooks)](#12-composables-custom-hooks)
13. [Performance Optimization](#13-performance-optimization)
14. [Nuxt.js & SSR](#14-nuxtjs--ssr)
15. [Vue vs React](#15-vue-vs-react)

---

## 1. What is Vue.js?

### Theory

**Vue.js** is a progressive JavaScript framework for building user interfaces. It combines a **reactive data layer** with a **component-based architecture**. "Progressive" means you can adopt it incrementally — drop a script tag on a page or build a full SPA with Vue Router and Pinia.

### Pros & Cons

| Pros                          | Cons                                         |
| ----------------------------- | -------------------------------------------- |
| Gentle learning curve         | Two API styles (Options + Composition)       |
| Excellent docs                | Smaller job market vs React in some regions  |
| Built-in reactivity           | Ecosystem split between Vuex/Pinia migration |
| Single-file components (.vue) | Template syntax unfamiliar to JSX devs       |

### One-Line Interview Answer

> Vue is a progressive framework with reactive data binding and component-based UI. Vue 3 uses Proxy-based reactivity and the Composition API for scalable apps.

### Real Example

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
const increment = () => count.value++;
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

---

## 2. Vue 2 vs Vue 3

### Theory

|                     | Vue 2                   | Vue 3                      |
| ------------------- | ----------------------- | -------------------------- |
| Reactivity          | `Object.defineProperty` | `Proxy`                    |
| API                 | Options API primary     | Composition API + Options  |
| Multiple root nodes | No (single root)        | Yes (fragments)            |
| TypeScript          | Awkward                 | First-class                |
| State               | Vuex 3/4                | Pinia (recommended)        |
| Bundle size         | Larger                  | Tree-shakeable, smaller    |
| Performance         | Good                    | Faster diff, better memory |

### One-Line Interview Answer

> Vue 3 uses Proxy reactivity — tracks dynamic property add/delete, supports arrays natively, and enables Composition API with better TypeScript and tree-shaking.

---

## 3. Options API vs Composition API

### Theory

**Options API** — organize code by option type (`data`, `methods`, `computed`, `watch`).

**Composition API** — organize code by **feature/concern** using `setup()` or `<script setup>`.

Use Options for simple components or legacy codebases. Use Composition for complex logic, reuse via composables, and TypeScript.

### One-Line Interview Answer

> Options API groups by option type — great for beginners. Composition API groups by feature and enables reusable composables — I default to Composition API in Vue 3 projects.

### Real Example

```vue
<!-- Options API -->
<script>
export default {
  data() {
    return { count: 0 };
  },
  computed: {
    double() {
      return this.count * 2;
    },
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>

<!-- Composition API -->
<script setup>
import { ref, computed } from "vue";
const count = ref(0);
const double = computed(() => count.value * 2);
const increment = () => count.value++;
</script>
```

---

## 4. Template Syntax & Directives

### Theory

| Directive                    | Purpose                     |
| ---------------------------- | --------------------------- |
| `v-bind` / `:`               | Bind attribute              |
| `v-on` / `@`                 | Event listener              |
| `v-model`                    | Two-way binding             |
| `v-if` / `v-else` / `v-show` | Conditional render          |
| `v-for`                      | List rendering              |
| `v-slot` / `#`               | Named/scoped slots          |
| `v-once`                     | Render once, skip updates   |
| `v-memo`                     | Memoize sub-tree (Vue 3.2+) |

**v-if vs v-show:** `v-if` removes from DOM; `v-show` toggles `display: none`.

### One-Line Interview Answer

> v-if for conditional mount/unmount, v-show for frequent toggles. v-model is syntactic sugar for :value + @update:modelValue. Always use :key with v-for.

---

## 5. Components — Props, Emits, Slots

### Theory

- **Props** — parent → child (read-only)
- **Emits** — child → parent events
- **Slots** — parent injects content into child

`defineProps` and `defineEmits` are compiler macros in `<script setup>`.

### Real Example

```vue
<!-- Child: UserCard.vue -->
<script setup>
const props = defineProps({
  name: { type: String, required: true },
  role: { type: String, default: "user" },
});
const emit = defineEmits(["edit", "delete"]);
</script>

<template>
  <div class="card">
    <slot name="avatar" />
    <h3>{{ name }}</h3>
    <slot />
    <!-- default slot -->
    <button @click="emit('edit', name)">Edit</button>
  </div>
</template>

<!-- Parent -->
<UserCard name="Amit" @edit="handleEdit">
  <template #avatar><img src="/avatar.png" /></template>
  <p>Senior Developer</p>
</UserCard>
```

---

## 6. Reactivity System

### Theory

Vue 3 reactivity uses **Proxy** to intercept get/set on objects.

| API                    | Use for                                        |
| ---------------------- | ---------------------------------------------- |
| `ref()`                | Primitives — access via `.value` in JS         |
| `reactive()`           | Objects/arrays — no `.value`                   |
| `readonly()`           | Prevent mutations                              |
| `toRef()` / `toRefs()` | Destructure reactive without losing reactivity |
| `shallowRef()`         | Only `.value` change triggers update           |

### One-Line Interview Answer

> ref wraps primitives with .value; reactive makes objects deeply reactive via Proxy. Destructuring reactive loses reactivity — use toRefs.

### Real Example

```javascript
import { ref, reactive, toRefs } from "vue";

const count = ref(0);
count.value++; // ✅

const state = reactive({ name: "Amit", age: 28 });
state.name = "Rahul"; // ✅ reactive

// ❌ Destructuring breaks reactivity
const { name } = state;

// ✅ Fix with toRefs
const { name, age } = toRefs(state);
name.value = "Priya";
```

---

## 7. Computed vs Watch vs watchEffect

### Theory

|             | computed                 | watch                    | watchEffect                 |
| ----------- | ------------------------ | ------------------------ | --------------------------- |
| **Purpose** | Derived value (cached)   | React to specific source | Auto-track dependencies     |
| **Returns** | Ref                      | Stop handle              | Stop handle                 |
| **Lazy**    | Yes — only when accessed | No — on change           | Immediate                   |
| **Use for** | Filtered lists, totals   | API calls on ID change   | Side effects with auto deps |

### One-Line Interview Answer

> computed for derived cached values. watch when I need the old value or explicit control. watchEffect for side effects that auto-track dependencies.

### Real Example

```vue
<script setup>
import { ref, computed, watch, watchEffect } from "vue";

const query = ref("");
const products = ref([
  /* ... */
]);

const filtered = computed(() =>
  products.value.filter((p) => p.name.includes(query.value)),
);

watch(query, (newQ, oldQ) => {
  analytics.track("search", { query: newQ, prev: oldQ });
});

watchEffect(() => {
  document.title = query.value ? `Search: ${query.value}` : "Shop";
});
</script>
```

---

## 8. Lifecycle Hooks

### Theory

| Options API     | Composition API   | When                 |
| --------------- | ----------------- | -------------------- |
| `beforeCreate`  | `setup()`         | Before instance      |
| `created`       | `setup()`         | After reactive setup |
| `beforeMount`   | `onBeforeMount`   | Before DOM mount     |
| `mounted`       | `onMounted`       | DOM ready            |
| `beforeUpdate`  | `onBeforeUpdate`  | Before re-render     |
| `updated`       | `onUpdated`       | After re-render      |
| `beforeUnmount` | `onBeforeUnmount` | Before destroy       |
| `unmounted`     | `onUnmounted`     | Cleanup              |

### One-Line Interview Answer

> onMounted for DOM access and API calls. onUnmounted for cleanup — timers, listeners, WebSocket close. setup() replaces beforeCreate/created.

---

## 9. Provide / Inject

### Theory

**provide/inject** passes data from ancestor to descendant **without prop drilling**. Symbol keys recommended for large apps.

Unlike props, inject is not explicitly declared in every middle component.

### Real Example

```javascript
// provider.ts
import { provide, inject, readonly, ref } from "vue";

const ThemeKey = Symbol("theme");

export function provideTheme() {
  const theme = ref("light");
  const toggle = () =>
    (theme.value = theme.value === "light" ? "dark" : "light");
  provide(ThemeKey, { theme: readonly(theme), toggle });
}

export function useTheme() {
  const ctx = inject(ThemeKey);
  if (!ctx) throw new Error("useTheme requires provider");
  return ctx;
}
```

---

## 10. Pinia State Management

### Theory

**Pinia** is the official Vue 3 store — simpler than Vuex, no mutations, full TypeScript, DevTools support.

Concepts: **defineStore** → state, getters, actions.

### One-Line Interview Answer

> Pinia replaces Vuex in Vue 3 — defineStore with state, getters, and actions. No mutations, modular by default, excellent TypeScript and DevTools.

### Real Example

```javascript
// stores/cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({ items: [] }),
  getters: {
    total: (state) => state.items.reduce((sum, i) => sum + i.price, 0),
    itemCount: (state) => state.items.length,
  },
  actions: {
    addItem(product) {
      this.items.push(product);
    },
    async checkout() {
      await api.post("/checkout", this.items);
      this.items = [];
    },
  },
});

// Component
const cart = useCartStore();
cart.addItem(product);
console.log(cart.total);
```

```javascript
// Setup store syntax (Composition-style)
export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isLoggedIn = computed(() => !!user.value);
  async function login(credentials) {
    user.value = await api.login(credentials);
  }
  return { user, isLoggedIn, login };
});
```

---

## 11. Vue Router

### Theory

**Vue Router 4** handles client-side routing for Vue 3.

Key APIs: `createRouter`, `RouterView`, `RouterLink`, `useRoute`, `useRouter`, navigation guards.

### Real Example

```javascript
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("./pages/Home.vue") },
  {
    path: "/products/:id",
    component: () => import("./pages/Product.vue"),
    props: true,
  },
  {
    path: "/dashboard",
    component: () => import("./layouts/Dashboard.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", component: () => import("./pages/DashboardHome.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) next("/login");
  else next();
});
```

---

## 12. Composables (Custom Hooks)

### Theory

**Composables** are reusable functions using Composition API — Vue's equivalent of React custom hooks. Must start with `use`.

### Real Example

```javascript
// composables/useFetch.js
import { ref, watchEffect, onScopeDispose } from "vue";

export function useFetch(url) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  let controller;

  watchEffect(async (onCleanup) => {
    controller = new AbortController();
    loading.value = true;
    error.value = null;
    onCleanup(() => controller.abort());

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(res.statusText);
      data.value = await res.json();
    } catch (e) {
      if (e.name !== "AbortError") error.value = e.message;
    } finally {
      loading.value = false;
    }
  });

  return { data, loading, error };
}
```

---

## 13. Performance Optimization

### Theory

| Technique                | Purpose                          |
| ------------------------ | -------------------------------- |
| `v-memo`                 | Skip re-render if deps unchanged |
| `keep-alive`             | Cache inactive components        |
| Lazy routes              | Code splitting                   |
| `defineAsyncComponent`   | Async component loading          |
| `shallowRef` / `markRaw` | Reduce reactivity overhead       |
| Virtual scrolling        | Large lists                      |

### One-Line Interview Answer

> Lazy-load routes and heavy components, use v-memo on expensive lists, keep-alive for tab views, and shallowRef for large non-reactive data.

---

## 14. Nuxt.js & SSR

### Theory

**Nuxt 3** is the Vue meta-framework — file-based routing, SSR/SSG, auto-imports, server API routes.

Rendering: `useFetch`, `useAsyncData` for SSR-safe data fetching.

### One-Line Interview Answer

> Nuxt provides SSR, SSG, and file-based routing for Vue. useFetch runs on server and hydrates on client — better SEO than pure SPA.

---

## 15. Vue vs React

### Theory

|                 | Vue                         | React                   |
| --------------- | --------------------------- | ----------------------- |
| Type            | Framework (progressive)     | Library (UI only)       |
| Template        | HTML templates + directives | JSX                     |
| Reactivity      | Automatic (Proxy)           | Manual (setState/hooks) |
| State           | Pinia built-in ecosystem    | Redux/Zustand external  |
| Learning curve  | Gentler                     | Steeper (hooks rules)   |
| Two-way binding | v-model native              | Controlled components   |

### One-Line Interview Answer

> Vue gives automatic reactivity and templates with less boilerplate. React gives more flexibility and a larger ecosystem — I pick based on team and project needs.

---

# Quick Revision Cheat Sheet

| Topic             | One-liner                                           |
| ----------------- | --------------------------------------------------- |
| Vue 3 reactivity  | Proxy — ref for primitives, reactive for objects    |
| Composition API   | Feature-based logic, composables for reuse          |
| computed vs watch | Derived value vs side effect on change              |
| Pinia             | defineStore — state, getters, actions, no mutations |
| v-if vs v-show    | Mount/unmount vs display toggle                     |
| provide/inject    | Skip prop drilling across tree                      |
| Composables       | Reusable setup logic — useFetch, useDebounce        |

---

_Master Vue 3 Composition API + Pinia + Vue Router and you'll handle 90% of Vue interviews._
