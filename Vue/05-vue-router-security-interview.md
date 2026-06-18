---
title: "Vue Router, Axios & Security Interview"
description: "Vue Router guards, Axios patterns, XSS, CSRF, and auth for Vue SPA interviews."
tags: ["vue", "router", "axios", "security", "interview"]
level: "Mid-level"
---

# Vue Router, Axios & Security Interview

---

## Vue Router

### Navigation Guards

```javascript
router.beforeEach(async (to, from) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
});

router.afterEach((to) => {
  document.title = to.meta.title ?? "App";
});
```

### Lazy Routes

```javascript
{ path: "/admin", component: () => import("@/pages/Admin.vue") }
```

### Route Meta + Typed Routes

```javascript
{ path: "/dashboard", meta: { requiresAuth: true, roles: ["admin"] } }
```

---

## Axios in Vue

```javascript
// plugins/axios.js
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore();
      await auth.refreshToken();
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Composable Pattern

```javascript
export function useApi() {
  const loading = ref(false);
  const error = ref(null);

  async function request(fn) {
    loading.value = true;
    error.value = null;
    try { return await fn(); }
    catch (e) { error.value = e; throw e; }
    finally { loading.value = false; }
  }

  return { loading, error, request };
}
```

---

## Security

| Threat | Prevention |
|--------|------------|
| XSS | Avoid v-html with user input; sanitize with DOMPurify |
| CSRF | SameSite cookies, CSRF tokens |
| Token theft | httpOnly cookies, not localStorage |
| Open redirect | Validate redirect URLs in router guard |

```vue
<!-- ❌ XSS risk -->
<div v-html="userComment" />

<!-- ✅ Sanitized -->
<div v-html="DOMPurify.sanitize(userComment)" />
```

### One-Line Interview Answer
> Router guards for auth, Axios interceptors for tokens, httpOnly cookies for JWT, never v-html unsanitized user content.

---

## Event Loop (Common in Same Round)

```javascript
// Microtasks before macrotasks
Promise.resolve().then(() => console.log("micro"));
setTimeout(() => console.log("macro"), 0);
```

---

# Cheat Sheet

| Topic | Vue pattern |
|-------|-------------|
| Protected route | beforeEach + meta.requiresAuth |
| Token refresh | Axios response interceptor |
| API base URL | import.meta.env.VITE_API_URL |
| XSS | Sanitize before v-html |
