---
title: "Vue Live Coding Interview — Counter, useFetch, Object Merge"
description: "Encora-style Vue machine coding — counter, useFetch composable, merge objects, plus Vue fundamentals."
tags: ["vue", "interview", "coding", "composables", "machine-coding"]
level: "Senior"
format: "Live coding + theory"
---

# Vue Live Coding Interview Preparation

Live coding patterns commonly asked in Vue interviews — **counter**, **useFetch composable**, **object merge**, plus fundamentals (**watchEffect**, **provide/inject**, **debouncing**).

---

## Table of Contents

1. [Auto Increment/Decrement Counter](#1-counter)
2. [Custom useFetch Composable](#2-usefetch-composable)
3. [Join/Merge Objects from List](#3-merge-objects)
4. [watch vs watchEffect vs computed](#4-watch-vs-watcheffect)
5. [Provide / Inject](#5-provide--inject)
6. [Why Composables?](#6-why-composables)
7. [Debouncing in Vue](#7-debouncing)

---

## 1. Counter

### Basic

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
const increment = () => count.value++;
const decrement = () => count.value--;
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="decrement">−</button>
    <button @click="increment">+</button>
  </div>
</template>
```

### Senior — Composable + Bounds

```javascript
// composables/useCounter.js
export function useCounter(initial = 0, { min = -Infinity, max = Infinity, step = 1 } = {}) {
  const count = ref(initial);
  const increment = () => { count.value = Math.min(count.value + step, max); };
  const decrement = () => { count.value = Math.max(count.value - step, min); };
  const reset = () => { count.value = initial; };
  return { count, increment, decrement, reset };
}
```

```vue
<script setup>
import { useCounter } from "@/composables/useCounter";
const { count, increment, decrement, reset } = useCounter(0, { min: 0, max: 10 });
</script>

<template>
  <output aria-live="polite">{{ count }}</output>
  <button :disabled="count <= 0" @click="decrement">−</button>
  <button :disabled="count >= 10" @click="increment">+</button>
  <button @click="reset">Reset</button>
</template>
```

---

## 2. useFetch Composable

```javascript
import { ref, watch, toValue } from "vue";

export function useFetch(url, options = {}) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  let controller;

  async function execute() {
    const resolvedUrl = toValue(url);
    if (!resolvedUrl) return;

    controller?.abort();
    controller = new AbortController();
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(resolvedUrl, {
        signal: controller.signal,
        ...options.fetchOptions,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data.value = await res.json();
    } catch (e) {
      if (e.name !== "AbortError") error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  watch(() => toValue(url), execute, { immediate: true });

  return { data, loading, error, refetch: execute };
}
```

```vue
<script setup>
import { useFetch } from "@/composables/useFetch";

const userId = ref("1");
const { data: user, loading, error, refetch } = useFetch(
  computed(() => `https://jsonplaceholder.typicode.com/users/${userId.value}`)
);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }} <button @click="refetch">Retry</button></div>
  <div v-else-if="user"><h1>{{ user.name }}</h1></div>
</template>
```

---

## 3. Merge Objects

```javascript
// Shallow merge — later wins
function mergeObjects(list) {
  return list.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

// Deep merge
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (isPlainObject(target[key]) && isPlainObject(source[key])) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function mergeObjectList(list) {
  return list.reduce((acc, obj) => deepMerge(acc, obj), {});
}
```

```vue
<script setup>
import { computed } from "vue";

const configSources = ref([
  { theme: "dark", api: "/v1" },
  { api: "/v2", timeout: 5000 },
]);

const mergedConfig = computed(() =>
  configSources.value.reduce((acc, c) => ({ ...acc, ...c }), {})
);
</script>
```

---

## 4. watch vs watchEffect vs computed

| | computed | watch | watchEffect |
|--|----------|-------|-------------|
| Use | Derived value | React to source | Auto-tracked side effect |
| Lazy | Yes | No | Immediate |

> useDeferredValue equivalent in Vue: `computed` + debounced ref, or `@vueuse/core` `useDebounceFn`.

---

## 5. Provide / Inject

```javascript
const AuthKey = Symbol("auth");
provide(AuthKey, { user: readonly(user), login, logout });
const auth = inject(AuthKey);
```

---

## 6. Why Composables?

> Reuse stateful logic across components — Vue's answer to React custom hooks. Explicit, typed, no mixin conflicts.

---

## 7. Debouncing

```javascript
import { ref, watch } from "vue";

export function useDebounce(value, delay = 300) {
  const debounced = ref(value.value);
  let timer;
  watch(value, (v) => {
    clearTimeout(timer);
    timer = setTimeout(() => { debounced.value = v; }, delay);
  });
  return debounced;
}
```

```vue
<script setup>
const query = ref("");
const debouncedQuery = useDebounce(query, 400);
const { data } = useFetch(computed(() =>
  debouncedQuery.value ? `/api/search?q=${debouncedQuery.value}` : null
));
</script>
```

---

# Cheat Sheet

| Topic | Vue approach |
|-------|--------------|
| Counter | ref + composable |
| useFetch | watch + AbortController |
| Merge | reduce + spread / deepMerge |
| Debounce | useDebounce composable |
| Share state | provide/inject or Pinia |
