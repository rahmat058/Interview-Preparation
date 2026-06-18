---
title: "Blinkit-Style Vue Interview — Core Web + Grid Toggle"
description: "Core web concepts (CORS, WebSockets, storage, event loop) plus Vue Grid Toggle machine coding."
tags: ["vue", "interview", "websocket", "cors", "machine-coding"]
level: "SDE-1"
format: "Web concepts + coding"
---

# Vue Interview — Core Web Concepts + Machine Coding

Same interview patterns as frontend SDE roles — **browser fundamentals** plus **Vue machine coding**. Framework-agnostic web concepts apply identically; Grid Toggle implemented in **Vue 3 Composition API**.

---

## Table of Contents

### Round 1 — Core Web
1. [CORS](#1-cors) · 2. [WebSockets](#2-websockets) · 3. [Long Polling vs WebSockets](#3-long-polling-vs-websockets)
4. [Browser Storage](#4-browser-storage) · 5. [Event Loop](#5-event-loop)

### Round 2 — Vue Machine Coding
6. [Grid Toggle Component](#6-grid-toggle-component)

### Round 3 — Culture Fit
7. [Behavioral Questions](#7-behavioral-questions)

---

## 1. CORS

> Browser blocks cross-origin reads unless server sends `Access-Control-Allow-Origin`. Fix on server, not client.

```javascript
// Preflight for PUT with JSON
fetch("https://api.example.com/orders", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
});
```

---

## 2. WebSockets

```javascript
// composables/useWebSocket.js
export function useWebSocket(url) {
  const data = ref(null);
  const status = ref("connecting");
  let ws;

  onMounted(() => {
    ws = new WebSocket(url);
    ws.onopen = () => status.value = "open";
    ws.onmessage = (e) => data.value = JSON.parse(e.data);
    ws.onclose = () => status.value = "closed";
  });

  onUnmounted(() => ws?.close());
  return { data, status };
}
```

---

## 3. Long Polling vs WebSockets

| | Long Polling | WebSocket |
|--|--------------|-----------|
| Connection | Repeated HTTP | Persistent |
| Latency | Higher | Lower |
| Use | Fallback | Live tracking |

---

## 4. Browser Storage

| API | Lifetime | Use |
|-----|----------|-----|
| localStorage | Persistent | Preferences |
| sessionStorage | Tab | Wizard state |
| Cookies | Configurable | httpOnly auth |
| IndexedDB | Persistent | Offline cart |

> Never store JWT in localStorage — use httpOnly cookies.

---

## 5. Event Loop

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// 1 → 4 → 3 → 2
```

---

## 6. Grid Toggle Component

### Requirements
- N×N grid, click toggles cell on/off
- Immutable state updates
- Clean component structure

```vue
<!-- GridToggle.vue -->
<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  rows: { type: Number, default: 3 },
  cols: { type: Number, default: 3 },
});

function createGrid(r, c) {
  return Array.from({ length: r }, () => Array(c).fill(false));
}

const grid = ref(createGrid(props.rows, props.cols));

function toggleCell(row, col) {
  grid.value = grid.value.map((r, ri) =>
    ri === row ? r.map((cell, ci) => (ci === col ? !cell : cell)) : r
  );
}

function reset() {
  grid.value = createGrid(props.rows, props.cols);
}

const activeCount = computed(() => grid.value.flat().filter(Boolean).length);
</script>

<template>
  <div class="grid-toggle">
    <header>
      <span>{{ activeCount }} / {{ rows * cols }} active</span>
      <button type="button" @click="reset">Reset</button>
    </header>

    <div role="grid" :aria-rowcount="rows" :aria-colcount="cols">
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        role="row"
        class="grid-row"
      >
        <button
          v-for="(isActive, colIndex) in row"
          :key="colIndex"
          type="button"
          role="gridcell"
          :aria-pressed="isActive"
          :aria-label="`Row ${rowIndex + 1}, Col ${colIndex + 1}, ${isActive ? 'on' : 'off'}`"
          :class="['cell', { 'cell--active': isActive }]"
          @click="toggleCell(rowIndex, colIndex)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-row { display: flex; gap: 4px; margin-bottom: 4px; }
.cell {
  width: 48px; height: 48px;
  border: 2px solid #374151; border-radius: 6px;
  background: #f9fafb; cursor: pointer;
}
.cell--active { background: #22c55e; border-color: #16a34a; }
</style>
```

### Composable Version

```javascript
// composables/useGridToggle.js
export function useGridToggle(rows, cols) {
  const grid = ref(createGrid(rows, cols));

  const toggleCell = (row, col) => {
    grid.value = grid.value.map((r, ri) =>
      ri === row ? r.map((c, ci) => (ci === col ? !c : c)) : r
    );
  };

  const activeCount = computed(() => grid.value.flat().filter(Boolean).length);

  return { grid, toggleCell, activeCount };
}
```

### Immutable Update — Explain in Interview

```javascript
// ❌ Mutates — Vue may not detect if same reference
grid.value[row][col] = !grid.value[row][col];

// ✅ New references — always triggers update
grid.value = grid.value.map(/* ... */);
```

---

## 7. Behavioral Questions

Use **STAR** method: Situation → Task → Action → Result.

- **Previous project:** What you built, stack (Vue 3, Pinia, Nuxt), measurable impact
- **Problem solving:** Reproduce → DevTools → fix → verify
- **Collaboration:** Code review, disagreeing on Pinia vs provide/inject

---

# Quick Revision

| Round | Topic | One-liner |
|-------|-------|-----------|
| 1 | CORS | Server Allow-Origin header |
| 1 | WebSocket | Persistent duplex — use composable + onUnmounted cleanup |
| 1 | Event loop | Sync → micro → macro |
| 2 | Grid toggle | ref 2D array, immutable map toggle |
| 3 | Culture | STAR stories with metrics |
