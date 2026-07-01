---
title: "Vue Developer Interview — Pinia, TypeScript, Vue Query"
description: "State management comparison, TypeScript patterns, and data fetching in Vue 3 interviews."
tags: ["vue", "pinia", "typescript", "vue-query", "interview"]
level: "Mid–Senior"
---

# Vue Developer Interview — Pinia, TypeScript & Vue Query

Topics mirroring enterprise Vue interviews: **Pinia vs Vuex**, **TypeScript**, **TanStack Vue Query**, and **RTK-equivalent patterns**.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Pinia vs Vuex](#p1) |
| <span id="i2"></span>2 | [Pinia Setup Store vs Options Store](#p2) |
| <span id="i3"></span>3 | [TypeScript with Vue 3](#p3) |
| <span id="i4"></span>4 | [TanStack Vue Query](#p4) |
| <span id="i5"></span>5 | [When to Use What](#p5) |

---
<a id="p1"></a>

## Pinia vs Vuex

| | Vuex 4 | Pinia |
|--|--------|-------|
| Mutations | Required | Removed |
| Modules | Nested modules | Flat stores |
| TypeScript | Boilerplate | Native |
| DevTools | Yes | Yes |
| Vue 3 | Supported | **Recommended** |

### One-Line Interview Answer
> Pinia removes mutations — actions handle sync and async. One store per domain, full TypeScript, modular by default.

```javascript
// Vuex (legacy)
mutations: { ADD_ITEM(state, item) { state.items.push(item); } },
actions: { addItem({ commit }, item) { commit("ADD_ITEM", item); } },

// Pinia
actions: { addItem(item) { this.items.push(item); } },
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## Store Styles

```javascript
// Options store
export const useCartStore = defineStore("cart", {
  state: () => ({ items: [] }),
  getters: { total: (s) => s.items.reduce((a, i) => a + i.price, 0) },
  actions: { addItem(p) { this.items.push(p); } },
});

// Setup store (Composition — like script setup)
export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const total = computed(() => items.value.reduce((a, i) => a + i.price, 0));
  function addItem(p) { items.value.push(p); }
  return { items, total, addItem };
});
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## TypeScript

```vue
<script setup lang="ts">
interface Product { id: string; name: string; price: number; }

const props = withDefaults(defineProps<{
  product: Product;
  editable?: boolean;
}>(), { editable: false });

const emit = defineEmits<{
  save: [product: Product];
  cancel: [];
}>();
</script>
```

```typescript
// Typed store
export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isAdmin = computed(() => user.value?.role === "admin");
  return { user, isAdmin };
});
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## Vue Query

```javascript
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["products", category],
  queryFn: () => api.getProducts(category.value),
});

const queryClient = useQueryClient();
const { mutate: addToCart } = useMutation({
  mutationFn: (item) => api.addToCart(item),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
});
```

### Pinia vs Vue Query

| | Pinia | Vue Query |
|--|-------|-----------|
| Data | Client state (UI, cart) | Server state (API cache) |
| Cache | Manual | Automatic |
| Refetch | Manual | Background, staleTime |

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## Decision Guide

| Need | Tool |
|------|------|
| Cart, theme, auth UI state | Pinia |
| API product list | Vue Query |
| Form input | ref/reactive local |
| URL filters | Vue Router query params |
| Deep tree config | provide/inject |

### One-Line Interview Answer
> Server state in Vue Query, client global state in Pinia, local UI in component refs — never duplicate API data in Pinia.


<p><a href="#i5">Back to index</a></p>