---
title: "Senior Vue Developer Interview — Altimetrik-Style Topics"
description: "Closure, event loop, debounce, a11y, flex/grid, CSR/SSR, Pinia workflow, Vue architecture, React internals equivalents."
tags: ["vue", "senior", "interview", "javascript"]
level: "Senior (4+ YOE)"
---

# Senior Vue Developer Interview Preparation

Senior Vue interviews blend **JavaScript fundamentals**, **CSS**, **live coding**, and **Vue internals** — same pattern as React senior rounds, with Vue-specific answers.

---

## Table of Contents — Round 1 (Technical)

1. [Closure](#1-closure)
2. [Event Loop](#2-event-loop)
3. [Debouncing & Throttling](#3-debouncing--throttling)
4. [Web Accessibility & Semantic HTML](#4-accessibility)
5. [Flexbox vs Grid](#5-flexbox-vs-grid)
6. [Find Missing Numbers `[1,2,3,5,7]` → `[4,6]`](#6-missing-numbers)
7. [CSR vs SSR (Nuxt)](#7-csr-vs-ssr)
8. [call, apply, bind](#8-call-apply-bind)
9. [Star Rating 1–10 (Vue)](#9-star-rating)
10. [Deep vs Shallow Copy](#10-deep-vs-shallow-copy)
11. [Pinia Workflow](#11-pinia-workflow)
12. [Vue Architecture](#12-vue-architecture)

## Client Round — Vue Internals

13. [Composables in Conditions?](#13-composables-in-conditions)
14. [watch vs onMounted execution order](#14-watch-vs-mounted-order)
15. [Render vs Patch (Vue equivalent)](#15-render-vs-patch)
16. [Garbage Collection](#16-garbage-collection)
17. [Batching Updates in Vue](#17-batching)
18. [Flatten Array without Built-ins](#18-flatten)

---

## 1. Closure

> Function + remembered scope. Used in composables, debounce, module pattern.

```javascript
function createStore(initial) {
  let state = initial;
  return {
    get: () => state,
    set: (v) => { state = v; },
  };
}
```

---

## 2. Event Loop

> Sync → all microtasks → one macrotask. Same as React interviews.

---

## 3. Debouncing & Throttling

```javascript
// Vue composable
export function useDebounce(value, delay = 300) {
  const debounced = ref(value.value);
  watch(value, (v) => {
    const t = setTimeout(() => debounced.value = v, delay);
    onScopeDispose(() => clearTimeout(t));
  });
  return debounced;
}
```

---

## 4. Accessibility

```vue
<nav aria-label="Main">
  <button type="button" aria-pressed="true">Active</button>
</nav>
```

---

## 5. Flexbox vs Grid

> Flex: 1D. Grid: 2D layouts. Same CSS — Vue uses class bindings.

---

## 6. Missing Numbers

```javascript
function findMissing(arr) {
  const set = new Set(arr);
  const missing = [];
  for (let i = Math.min(...arr); i <= Math.max(...arr); i++) {
    if (!set.has(i)) missing.push(i);
  }
  return missing;
}
findMissing([1, 2, 3, 5, 7]); // [4, 6]
```

---

## 7. CSR vs SSR

| | Vue SPA (Vite) | Nuxt SSR |
|--|----------------|----------|
| Render | Client | Server + hydrate |
| SEO | Needs prerender | Built-in |

---

## 8. call, apply, bind

Same JavaScript — framework agnostic.

---

## 9. Star Rating (Vue)

```vue
<script setup>
const props = defineProps({ max: { type: Number, default: 10 }, modelValue: Number });
const emit = defineEmits(["update:modelValue"]);
const hover = ref(0);
const display = computed(() => hover.value || props.modelValue || 0);
</script>

<template>
  <div role="radiogroup" :aria-label="`Rating out of ${max}`">
    <button
      v-for="n in max"
      :key="n"
      type="button"
      role="radio"
      :aria-checked="modelValue === n"
      :aria-label="`${n} out of ${max}`"
      @click="emit('update:modelValue', n)"
      @mouseenter="hover = n"
      @mouseleave="hover = 0"
      :style="{ color: n <= display ? '#f59e0b' : '#d1d5db' }"
    >★</button>
  </div>
</template>
```

---

## 10. Deep vs Shallow Copy

```javascript
const deep = structuredClone(original);
const shallow = { ...original };
```

---

## 11. Pinia Workflow

```
User action → store.action() → state update → reactive subscribers re-render
```

```javascript
const cart = useCartStore();
cart.addItem(product); // action mutates state (Immer in Pinia)
// Components using storeToRefs(cart) re-render
```

---

## 12. Vue Architecture

```
src/features/{auth,catalog,cart}/
  components/, composables/, stores/, api/
src/shared/
src/app/ — router, plugins, App.vue
```

---

## 13. Composables in Conditions?

> **No** — same Rules of Hooks. Composables must run at top level of setup.

```javascript
// ❌ if (loggedIn) { const { user } = useAuth(); }
// ✅ const { user } = useAuth(); then use v-if in template
```

---

## 14. watch vs onMounted Order

> onMounted runs after DOM mount. watch with immediate:true runs during setup. watch on ref runs when value changes — after mount if changed in onMounted.

---

## 15. Render vs Patch

> Vue render function creates VNode tree. Patch (diff) applies changes to DOM — Vue 3 uses optimized block tree + static hoisting.

---

## 16. Garbage Collection

> Cleanup in onUnmounted — timers, listeners, WebSocket, watch stop handles.

---

## 17. Batching

> Vue 3 batches reactive updates in same tick — multiple ref changes = one re-render. nextTick waits for DOM flush.

```javascript
count.value++;
flag.value = true;
// One re-render
await nextTick();
// DOM updated
```

---

## 18. Flatten without Built-ins

```javascript
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) result.push(...flatten(item));
    else result.push(item);
  }
  return result;
}
```

---

# Cheat Sheet

| Topic | Vue angle |
|-------|-----------|
| State workflow | Pinia actions, not Redux dispatch |
| Rules | Composables at top level — like hooks |
| SSR | Nuxt, not Next.js |
| Batching | Vue reactive batch + nextTick |
