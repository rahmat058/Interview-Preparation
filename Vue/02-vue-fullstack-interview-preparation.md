---
title: "Vue Fullstack Interview Preparation"
description: "Vue 3 + JavaScript + system design topics for fullstack frontend interviews."
tags: ["vue", "fullstack", "javascript", "interview"]
level: "2–5 YOE"
---

# Vue Fullstack Interview Preparation

Vue 3 frontend combined with **JavaScript fundamentals**, **API integration**, and **system design** topics commonly asked in fullstack Vue roles.

---

## Table of Contents

### Vue Core
1. [Composition API Deep Dive](#composition-api)
2. [Pinia + API Layer](#pinia--api-layer)
3. [Nuxt Fullstack Patterns](#nuxt-fullstack)

### JavaScript (Interview Essentials)
4. [Closures & Event Loop](#javascript-essentials)
5. [Async/Await & Promises](#async)
6. [ES6+ Features](#es6)

### System Design (Frontend)
7. [Vue App Architecture](#architecture)
8. [Auth Flow in Vue SPA](#auth)
9. [Real-Time with WebSockets](#realtime)

---

## Composition API

```vue
<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/products";

const store = useProductStore();
const filter = ref("");

const filtered = computed(() =>
  store.products.filter((p) => p.name.includes(filter.value))
);

onMounted(() => store.fetchProducts());
</script>
```

## Pinia + API Layer

```javascript
// services/api.js
export const api = axios.create({ baseURL: "/api/v1" });

// stores/products.js
export const useProductStore = defineStore("products", () => {
  const products = ref([]);
  const loading = ref(false);

  async function fetchProducts() {
    loading.value = true;
    try { products.value = (await api.get("/products")).data; }
    finally { loading.value = false; }
  }

  return { products, loading, fetchProducts };
});
```

## Nuxt Fullstack

```javascript
// server/api/products.get.ts — Nuxt server route
export default defineEventHandler(async () => {
  return await db.products.findMany();
});

// pages/products.vue
const { data: products } = await useFetch("/api/products");
```

## JavaScript Essentials

**Closure:** Function + remembered scope — used in composables and debounce.

**Event loop:** Sync → microtasks (Promise) → macrotask (setTimeout).

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4); // 1,4,3,2
```

## Async

```javascript
async function loadDashboard() {
  const [user, orders] = await Promise.all([
    api.get("/user"), api.get("/orders"),
  ]);
  return { user: user.data, orders: orders.data };
}
```

## ES6

Spread, destructuring, optional chaining, nullish coalescing, modules, arrow functions.

## Architecture

```
src/features/{auth,catalog,cart}/
src/shared/{components,composables}/
src/services/api.js
src/stores/ (Pinia)
```

## Auth

```javascript
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (to.meta.auth && !auth.token) return "/login";
});
```

## Realtime

```javascript
const { data: orderStatus } = useWebSocket(`wss://api.example.com/orders/${id}`);
```

---

# One-Line Answers

| Topic | Answer |
|-------|--------|
| Vue fullstack | Vue/Nuxt frontend + REST/GraphQL + optional Nuxt server routes |
| State | Pinia for client, useFetch/vue-query for server |
| Auth | JWT in httpOnly cookie, router guards, Pinia auth store |
