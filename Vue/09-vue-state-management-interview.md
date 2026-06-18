---
title: "Vue State Management & Testing Interview"
description: "Pinia patterns, Vuex migration, partial API errors, and snapshot testing in Vue interviews."
tags: ["vue", "pinia", "testing", "interview"]
level: "Mid–Senior"
---

# Vue State Management & Testing Interview

---

## Pinia Advanced Patterns

### Store Composition

```javascript
export const useCheckoutStore = defineStore("checkout", () => {
  const cart = useCartStore();
  const user = useUserStore();

  const canCheckout = computed(() =>
    cart.itemCount > 0 && user.isLoggedIn
  );

  async function checkout() {
    await api.post("/checkout", { items: cart.items, userId: user.id });
    cart.clear();
  }

  return { canCheckout, checkout };
});
```

### Partial API Error Scenario (3 APIs)

```vue
<script setup>
const results = ref({ products: null, inventory: null, pricing: null });
const errors = ref({});
const loading = ref(true);

onMounted(async () => {
  const [products, inventory, pricing] = await Promise.allSettled([
    api.getProducts(),
    api.getInventory(),
    api.getPricing(),
  ]);

  if (products.status === "fulfilled") results.value.products = products.value.data;
  else errors.value.products = products.reason;

  if (inventory.status === "fulfilled") results.value.inventory = inventory.value.data;
  else errors.value.inventory = inventory.reason;

  if (pricing.status === "fulfilled") results.value.pricing = pricing.value.data;
  else errors.value.pricing = pricing.reason;

  loading.value = false;
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <template v-else>
    <ErrorBanner v-if="errors.products" message="Products unavailable" />
    <ProductList v-else :items="results.products" />
    <WarningBanner v-if="errors.inventory" message="Stock info unavailable" />
    <PriceDisplay v-if="results.pricing" :data="results.pricing" />
  </template>
</template>
```

---

## Vuex vs Pinia (Interview Classic)

> Vuex: mutations + actions + modules. Pinia: actions only, flat stores, better TS. Migrate module-by-module.

---

## Testing

### Vitest + Vue Test Utils

```javascript
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import Counter from "./Counter.vue";

describe("Counter", () => {
  it("increments on click", async () => {
    const wrapper = mount(Counter, {
      global: { plugins: [createPinia()] },
    });
    await wrapper.find("[data-testid=increment]").trigger("click");
    expect(wrapper.text()).toContain("1");
  });
});
```

### Snapshot Testing

```javascript
it("matches snapshot", () => {
  const wrapper = mount(UserCard, { props: { name: "Amit" } });
  expect(wrapper.html()).toMatchSnapshot();
});
```

> Use snapshots for stable UI — update intentionally when design changes.

### Composable Testing

```javascript
import { useCounter } from "./useCounter";

it("useCounter increments", () => {
  const { count, increment } = useCounter(0);
  increment();
  expect(count.value).toBe(1);
});
```

---

# One-Line Answers

| Question | Answer |
|----------|--------|
| Partial API failure | Promise.allSettled — show partial UI + per-section errors |
| Pinia testing | createPinia() in global.plugins |
| Snapshot tests | Catch unintended UI regressions |
