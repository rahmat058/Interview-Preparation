---
title: "Senior Vue Developer Interview — Altimetrik-Style Topics"
description: "Closure, event loop, debounce, a11y, flex/grid, CSR/SSR, Pinia workflow, Vue architecture, React internals equivalents."
tags: ["vue", "senior", "interview", "javascript"]
level: "Senior (4+ YOE)"
---

# Senior Vue Developer Interview Preparation

Senior Vue interviews blend **JavaScript fundamentals**, **CSS**, **live coding**, and **Vue internals** — same pattern as React senior rounds, with Vue-specific answers.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Closure](#p1) |
| <span id="i2"></span>2 | [Event Loop](#p2) |
| <span id="i3"></span>3 | [Debouncing & Throttling](#p3) |
| <span id="i4"></span>4 | [Web Accessibility & Semantic HTML](#p4) |
| <span id="i5"></span>5 | [Flexbox vs Grid](#p5) |
| <span id="i6"></span>6 | [Find Missing Numbers](#p6) |
| <span id="i7"></span>7 | [CSR vs SSR (Nuxt)](#p7) |
| <span id="i8"></span>8 | [call, apply, bind](#p8) |
| <span id="i9"></span>9 | [Star Rating 1–10 (Vue)](#p9) |
| <span id="i10"></span>10 | [Deep vs Shallow Copy](#p10) |
| <span id="i11"></span>11 | [Pinia Workflow](#p11) |
| <span id="i12"></span>12 | [Vue Architecture](#p12) |

### Client Round — Vue Internals

| # | Section |
| --- | --- |
| <span id="i13"></span>13 | [Composables in Conditions?](#p13) |
| <span id="i14"></span>14 | [watch vs onMounted execution order](#p14) |
| <span id="i15"></span>15 | [Render vs Patch (Vue equivalent)](#p15) |
| <span id="i16"></span>16 | [Garbage Collection](#p16) |
| <span id="i17"></span>17 | [Batching Updates in Vue](#p17) |
| <span id="i18"></span>18 | [Flatten Array without Built-ins](#p18) |

---

<a id="p1"></a>

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


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Event Loop

> Sync → all microtasks → one macrotask. Same as React interviews.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

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


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. Accessibility

```vue
<nav aria-label="Main">
  <button type="button" aria-pressed="true">Active</button>
</nav>
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Flexbox vs Grid

> Flex: 1D. Grid: 2D layouts. Same CSS — Vue uses class bindings.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

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


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. CSR vs SSR

| | Vue SPA (Vite) | Nuxt SSR |
|--|----------------|----------|
| Render | Client | Server + hydrate |
| SEO | Needs prerender | Built-in |

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. call, apply, bind

Same JavaScript — framework agnostic.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

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


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Deep vs Shallow Copy

```javascript
const deep = structuredClone(original);
const shallow = { ...original };
```

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

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


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Vue Architecture

```
src/features/{auth,catalog,cart}/
  components/, composables/, stores/, api/
src/shared/
src/app/ — router, plugins, App.vue
```

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. Composables in Conditions?

> **No** — same Rules of Hooks. Composables must run at top level of setup.

```javascript
// ❌ if (loggedIn) { const { user } = useAuth(); }
// ✅ const { user } = useAuth(); then use v-if in template
```

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. watch vs onMounted Order

> onMounted runs after DOM mount. watch with immediate:true runs during setup. watch on ref runs when value changes — after mount if changed in onMounted.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. Render vs Patch

> Vue render function creates VNode tree. Patch (diff) applies changes to DOM — Vue 3 uses optimized block tree + static hoisting.

---


<p><a href="#i15">Back to index</a></p>

<a id="p16"></a>

## 16. Garbage Collection

> Cleanup in onUnmounted — timers, listeners, WebSocket, watch stop handles.

---


<p><a href="#i16">Back to index</a></p>

<a id="p17"></a>

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


<p><a href="#i17">Back to index</a></p>

<a id="p18"></a>

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


<p><a href="#i18">Back to index</a></p>
