---
title: "Vue Composition API Deep Dive Interview"
description: "Composition API, script setup, composables, reactivity APIs — common senior Vue interview topics."
tags: ["vue", "composition-api", "composables", "interview"]
level: "Mid–Senior"
company: "General"
---

# Vue Composition API Deep Dive Interview

Round focused on **Vue 3 Composition API**, **reactivity**, **auth patterns**, and **performance** — common in product company Vue interviews.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [script setup vs setup()](#p1) |
| <span id="i2"></span>2 | [Reactivity Utilities](#p2) |
| <span id="i3"></span>3 | [Composables Architecture](#p3) |
| <span id="i4"></span>4 | [Auth with Pinia + Router](#p4) |
| <span id="i5"></span>5 | [Context vs Pinia Performance](#p5) |
| <span id="i6"></span>6 | [Vue 3.5+ Features](#p6) |

---
<a id="p1"></a>

## script setup

```vue
<script setup>
// Top-level bindings auto-exposed to template
// defineProps, defineEmits, defineExpose are compiler macros
const props = defineProps({ id: String });
const emit = defineEmits(["save"]);
</script>
```

> No need to return from setup — less boilerplate than setup() function.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## Reactivity Utilities

```javascript
import { ref, shallowRef, readonly, toRef, triggerRef } from "vue";

const state = shallowRef({ huge: "data" }); // only .value change triggers update
const readOnlyState = readonly(state);
const itemRef = toRef(state.value, "key");
triggerRef(state); // force update for shallowRef
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## Composables

```javascript
// composables/useAuth.js
export function useAuth() {
  const store = useAuthStore();
  const router = useRouter();

  async function login(credentials) {
    await store.login(credentials);
    router.push("/dashboard");
  }

  return { user: computed(() => store.user), login, logout: store.logout };
}
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## Auth with Pinia + Router

```javascript
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);

  const isLoggedIn = computed(() => !!token.value);

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    user.value = data.user;
    token.value = data.token;
  }

  function logout() {
    user.value = null;
    token.value = null;
  }

  return { user, token, isLoggedIn, login, logout };
});
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## Context vs Pinia Performance

| | provide/inject | Pinia |
|--|----------------|-------|
| Re-render | All injectors on change | Store subscribers only |
| DevTools | No | Yes |
| Use | Theme, i18n | Cart, auth, complex state |

> Don't put frequently changing data in provide/inject — use Pinia with selectors.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## Vue 3.5+

- **useTemplateRef()** — typed template refs
- **Reactive Props Destructure** — destructure props reactively
- **SSR improvements** in Nuxt 3

```vue
<script setup>
const props = defineProps<{ count: number }>();
// Vue 3.5: count stays reactive when destructured
const { count } = props;
</script>
```

---

# Quick Revision

| Topic | One-liner |
|-------|-----------|
| script setup | Macros, auto-expose, less boilerplate |
| shallowRef | Large objects — manual triggerRef |
| Auth | Pinia store + router.beforeEach guard |
| Performance | Pinia over provide for hot state |


<p><a href="#i6">Back to index</a></p>