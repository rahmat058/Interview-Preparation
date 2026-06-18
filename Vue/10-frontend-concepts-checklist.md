---
title: "Frontend Concepts Checklist for Vue Developers"
description: "25 frontend concepts — pagination, WebSocket, SSR, caching — with Vue-specific examples."
tags: ["vue", "frontend", "concepts", "interview"]
level: "All levels"
---

# Frontend Concepts Checklist for Vue Developers

25 concepts every Vue developer should know — with **Vue-specific implementation notes**.

---

| # | Concept | Vue approach |
|---|---------|--------------|
| 1 | Pagination | v-for + Pinia page state or URL query |
| 2 | Infinite scroll | @scroll + Intersection Observer composable |
| 3 | Debounce search | useDebounce composable |
| 4 | WebSocket | useWebSocket composable + onUnmounted |
| 5 | SSE | EventSource in onMounted |
| 6 | CORS | Server headers — same as React |
| 7 | JWT auth | httpOnly cookie + Pinia auth store |
| 8 | OAuth | Redirect flow + callback route |
| 9 | SSR/SSG | Nuxt 3 — useFetch, useAsyncData |
| 10 | Hydration | ClientOnly for browser-only APIs |
| 11 | Code splitting | () => import() in router |
| 12 | Lazy loading images | loading="lazy" or @vueuse/core useIntersectionObserver |
| 13 | Virtual scroll | @tanstack/vue-virtual |
| 14 | i18n | vue-i18n |
| 15 | Form validation | VeeValidate or custom composable |
| 16 | File upload | FormData + progress with axios onUploadProgress |
| 17 | PWA | vite-plugin-pwa |
| 18 | SEO | Nuxt SSR or prerender |
| 19 | CDN caching | Cache-Control headers |
| 20 | Error tracking | Sentry Vue integration |
| 21 | Feature flags | provide/inject or env vars |
| 22 | Micro-frontends | Module federation or iframe |
| 23 | REST vs GraphQL | axios vs @vue/apollo-composable |
| 24 | Web Vitals | web-vitals library in main.js |
| 25 | CI/CD | GitHub Actions + Vitest + build |

---

## Pagination Example

```vue
<script setup>
const page = ref(1);
const { data, pending } = useFetch(() => `/api/items?page=${page.value}`, {
  watch: [page],
});
</script>
<template>
  <ItemList :items="data?.items" />
  <button :disabled="page <= 1" @click="page--">Prev</button>
  <button @click="page++">Next</button>
</template>
```

## Infinite Scroll Composable

```javascript
export function useInfiniteScroll(loadMore) {
  const sentinel = ref(null);
  useIntersectionObserver(sentinel, ([{ isIntersecting }]) => {
    if (isIntersecting) loadMore();
  });
  return { sentinel };
}
```

## Nuxt SSR

```javascript
const { data } = await useFetch("/api/products"); // runs server + client
```

---

*These concepts are framework-agnostic — implementations differ, principles don't.*
