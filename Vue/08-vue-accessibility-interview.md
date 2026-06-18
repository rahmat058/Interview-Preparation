---
title: "Vue Accessibility & CSS Interview"
description: "Web accessibility, semantic HTML, CSS position, flexbox/grid — with Vue implementation examples."
tags: ["vue", "accessibility", "css", "interview"]
level: "Mid-level"
---

# Vue Accessibility & CSS Interview

---

## Web Accessibility (a11y)

### Semantic HTML in Vue Templates

```vue
<template>
  <header>
    <nav aria-label="Main navigation">
      <RouterLink to="/">Home</RouterLink>
    </nav>
  </header>
  <main id="main-content">
    <article>
      <h1>{{ pageTitle }}</h1>
      <button type="button" @click="submit" :aria-busy="loading">
        {{ loading ? "Saving..." : "Save" }}
      </button>
    </article>
  </main>
</template>
```

### Focus Management with Teleport Modal

```vue
<script setup>
const isOpen = ref(false);
const dialogRef = ref(null);

watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    dialogRef.value?.focus();
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" role="dialog" aria-modal="true" ref="dialogRef" tabindex="-1">
      <h2 id="dialog-title">Confirm</h2>
      <button @click="isOpen = false" aria-label="Close dialog">×</button>
    </div>
  </Teleport>
</template>
```

### One-Line Interview Answer
> Semantic HTML, ARIA labels, keyboard navigation, focus trap in modals via Teleport, and aria-live for dynamic updates.

---

## CSS Position

| Value | Behavior |
|-------|----------|
| static | Default flow |
| relative | Offset from self |
| absolute | Relative to nearest positioned ancestor |
| fixed | Viewport |
| sticky | Hybrid scroll |

---

## Flexbox vs Grid

> Flexbox: 1D alignment. Grid: 2D page layouts.

```css
.navbar { display: flex; justify-content: space-between; }
.dashboard { display: grid; grid-template-columns: 240px 1fr; }
```

---

## Vue Machine Coding — Traffic Light

```vue
<script setup>
const lights = ["red", "yellow", "green"];
const active = ref(0);

function cycle() {
  active.value = (active.value + 1) % lights.length;
}

onMounted(() => setInterval(cycle, 3000));
</script>

<template>
  <div class="traffic-light" role="img" aria-label="Traffic light">
    <div
      v-for="(color, i) in lights"
      :key="color"
      :class="['light', color, { active: active === i }]"
      :aria-hidden="active !== i"
    />
  </div>
</template>

<style scoped>
.traffic-light { display: flex; flex-direction: column; gap: 8px; }
.light { width: 60px; height: 60px; border-radius: 50%; opacity: 0.3; }
.light.active { opacity: 1; }
.red { background: red; }
.yellow { background: yellow; }
.green { background: green; }
</style>
```

---

# Cheat Sheet

| Topic | Vue note |
|-------|----------|
| Modal a11y | Teleport + role="dialog" + focus trap |
| Dynamic content | aria-live="polite" on status regions |
| Buttons vs divs | Always `<button type="button">` for actions |
