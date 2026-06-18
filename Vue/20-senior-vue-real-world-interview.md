---
title: "Senior Vue Real-World Interview — Fundamentals vs Production Skills"
description: "Flatten array plus Web Vitals, Pinia/Zustand patterns, Vue Query, TypeScript, monitoring, architecture, debugging."
tags: ["vue", "senior", "web-vitals", "architecture", "interview"]
level: "Senior (5+ YOE)"
---

# Senior Vue Real-World Interview

At 5 YOE you may get *"flatten an array"* — but production Vue work is **Web Vitals**, **Pinia + Vue Query**, **TypeScript**, **Nuxt architecture**, and **production debugging**.

---

## Part A — Flatten Array (Still Asked)

```javascript
// Built-in
nested.flat(Infinity);

// Recursive
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}

// Real Vue use: flatten nested menu for flat sidebar
function flattenRoutes(routes, result = []) {
  for (const route of routes) {
    result.push({ path: route.path, name: route.name });
    if (route.children) flattenRoutes(route.children, result);
  }
  return result;
}
```

### Answer + Pivot Technique

> "flat(Infinity) for deep flatten. In our Nuxt app I used the same tree walk to flatten nested category routes for breadcrumb generation."

---

## Part B — Production Skills

### 1. Web Vitals (LCP, CLS, INP)

```javascript
// main.js
import { onCLS, onINP, onLCP } from "web-vitals";

function sendToAnalytics(metric) {
  navigator.sendBeacon("/api/vitals", JSON.stringify(metric));
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

**Vue-specific LCP fixes:**
- Lazy-load heavy components with `defineAsyncComponent`
- `priority` on Nuxt `<NuxtImg>` for hero images
- Defer non-critical plugins

```vue
<script setup>
const HeavyChart = defineAsyncComponent(() => import("./HeavyChart.vue"));
</script>
```

---

### 2. State at Scale — Pinia + Vue Query

| State | Tool |
|-------|------|
| Server/API | @tanstack/vue-query |
| Global client | Pinia |
| URL filters | useRoute().query |
| Form | ref/reactive or VeeValidate |

```javascript
// Don't duplicate API data in Pinia
const { data: products } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
const cart = useCartStore(); // client-only cart state
```

**Pinia vs Jotai/Zustand (React equivalents):**

| React | Vue |
|-------|-----|
| Zustand | Pinia setup store |
| Jotai | ref + provide/inject |
| Redux | Pinia options store |
| React Query | TanStack Vue Query |

---

### 3. Vue Query Caching

```javascript
const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: addToCart,
  onMutate: async (item) => {
    await queryClient.cancelQueries({ queryKey: ["cart"] });
    const prev = queryClient.getQueryData(["cart"]);
    queryClient.setQueryData(["cart"], (old = []) => [...old, item]);
    return { prev };
  },
  onError: (_e, _i, ctx) => queryClient.setQueryData(["cart"], ctx.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
});
```

---

### 4. TypeScript in Large Vue Codebases

```vue
<script setup lang="ts">
import type { Product } from "@/types";

defineProps<{ product: Product; loading?: boolean }>();
defineEmits<{ add: [product: Product]; remove: [id: string] }>();
</script>
```

- Shared types in monorepo package
- Zod validation at API boundary
- Strict `vue-tsc` in CI

---

### 5. Nuxt Production Monitoring

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@sentry/nuxt/module"],
  sentry: { dsn: process.env.SENTRY_DSN },
});
```

---

### 6. Scalable Vue Architecture

```
apps/web/          — Vue SPA or Nuxt
packages/ui/       — Shared component library
packages/types/    — Shared TypeScript types
packages/api-client/
```

Feature folders inside `apps/web/features/`.

---

### 7. Debugging Performance

| Symptom | Vue tool |
|---------|----------|
| Slow render | Vue DevTools Performance tab |
| Memory leak | onUnmounted missing cleanup |
| Large bundle | rollup-plugin-visualizer |
| Hydration mismatch | Nuxt SSR — check ClientOnly, date formatting |
| Watch firing too often | watch with deep:false, shallowRef |

```javascript
// Find why component re-renders
import { watchEffect } from "vue";
watchEffect(() => {
  console.log("Component re-rendered", props.id);
});
```

### Case Study

```
Problem: Product list INP 400ms on filter
Cause:   v-for 500 items, no v-memo, deep watch on array
Fix:     v-memo="[item.id, item.selected]" + computed filter + shallowRef for list
Result:  INP 110ms
```

---

## Part C — Interview Strategy

### 3 Stories to Prepare

1. **Performance** — Web Vitals improvement with metrics
2. **Architecture** — Pinia + Vue Query adoption
3. **Production bug** — Hydration mismatch or memory leak fix

### Questions for Interviewers

- "How do you handle SSR — Nuxt or custom?"
- "Pinia or still migrating from Vuex?"
- "Do you measure Core Web Vitals in production?"

---

# Cheat Sheet

| Puzzle | Vue parallel |
|--------|----------------|
| Flatten array | Flatten nested routes/menus |
| Debounce | useDebounce composable |
| State at scale | Pinia + Vue Query split |
| SSR | Nuxt useFetch |
| Performance | v-memo, async components, Vue DevTools |

---

*Answer the puzzle. Then pivot to production Vue engineering — that's what separates senior candidates.*
