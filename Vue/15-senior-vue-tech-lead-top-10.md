---
title: "Senior Vue Tech Lead — Top 10 Coding Challenges"
description: "Polyfills, flatten, stopwatch, todo app, infinite currying — implemented in Vue/JS for tech lead interviews."
tags: ["vue", "javascript", "coding", "tech-lead", "interview"]
level: "Tech Lead / Senior"
---

# Senior Vue Tech Lead — Top 10 Coding Challenges

Classic JavaScript coding challenges asked at senior/tech lead interviews — with **Vue implementations** where relevant.

---

## 1. call, apply, bind Polyfills

```javascript
Function.prototype.myCall = function (context, ...args) {
  context = context ?? globalThis;
  const key = Symbol();
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
};

Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  return function (...args) {
    return fn.apply(context, [...boundArgs, ...args]);
  };
};
```

---

## 2. Flatten Array

```javascript
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}
```

---

## 3. Stopwatch — Vue Component

```vue
<script setup>
const elapsed = ref(0);
const running = ref(false);
let intervalId;

function start() {
  if (running.value) return;
  running.value = true;
  intervalId = setInterval(() => elapsed.value += 10, 10);
}

function pause() {
  running.value = false;
  clearInterval(intervalId);
}

function reset() {
  pause();
  elapsed.value = 0;
}

onUnmounted(() => clearInterval(intervalId));

const formatted = computed(() => {
  const ms = elapsed.value;
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;
});
</script>

<template>
  <div>
    <output aria-live="polite">{{ formatted }}</output>
    <button @click="start" :disabled="running">Start</button>
    <button @click="pause" :disabled="!running">Pause</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

---

## 4. Todo App — Vue 3

```vue
<script setup>
const todos = ref([]);
const input = ref("");
const filter = ref("all");

const filtered = computed(() => {
  if (filter.value === "active") return todos.value.filter((t) => !t.done);
  if (filter.value === "done") return todos.value.filter((t) => t.done);
  return todos.value;
});

function addTodo() {
  if (!input.value.trim()) return;
  todos.value.push({ id: Date.now(), text: input.value, done: false });
  input.value = "";
}

function toggle(id) {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
}

function remove(id) {
  todos.value = todos.value.filter((t) => t.id !== id);
}
</script>

<template>
  <input v-model="input" @keyup.enter="addTodo" placeholder="Add todo" />
  <ul>
    <li v-for="todo in filtered" :key="todo.id">
      <input type="checkbox" :checked="todo.done" @change="toggle(todo.id)" />
      <span :style="{ textDecoration: todo.done ? 'line-through' : '' }">{{ todo.text }}</span>
      <button @click="remove(todo.id)">×</button>
    </li>
  </ul>
  <div>
    <button @click="filter = 'all'">All</button>
    <button @click="filter = 'active'">Active</button>
    <button @click="filter = 'done'">Done</button>
  </div>
</template>
```

---

## 5. Infinite Currying

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...next) => curried(...args, ...next);
  };
}

const sum = curry((a, b, c) => a + b + c);
sum(1)(2)(3); // 6
sum(1, 2)(3); // 6
```

---

## 6–10. Additional Challenges

| # | Challenge | Approach |
|---|-----------|----------|
| 6 | Debounce | setTimeout + clearTimeout |
| 7 | Deep clone | structuredClone or recursive |
| 8 | Promise.all polyfill | Counter + results array |
| 9 | LRU Cache | Map insertion order |
| 10 | Event emitter | on/off/emit pattern — like mitt library |

```javascript
// Event emitter (used in Vue internally)
function createEmitter() {
  const events = {};
  return {
    on(event, fn) { (events[event] ??= []).push(fn); },
    off(event, fn) { events[event] = events[event]?.filter((f) => f !== fn); },
    emit(event, ...args) { events[event]?.forEach((fn) => fn(...args)); },
  };
}
```

---

# Vue Integration Tips

- Build UI challenges as **single-file components**
- Extract logic into **composables** when interviewer asks to refactor
- Always **onUnmounted cleanup** for timers and listeners
- Mention **Pinia** if todo/cart needs persistence

---

*Tech lead rounds test JS depth + ability to express solutions in Vue idioms.*
