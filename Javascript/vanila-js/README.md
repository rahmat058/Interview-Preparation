# Vanilla JavaScript — Interview Preparation

Core **string**, **array**, and **object** APIs plus **higher-order functions** — written for **intermediate** and **senior** frontend interviews.

## Files

| #   | File                                                                                                     | Focus                                                                      |
| --- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | [01-higher-order-functions.md](./01-higher-order-functions.md)                                           | HOF theory, `map`/`filter`/`reduce` from scratch, compose, curry, debounce |
| 2   | [02-arrays-core-functions.md](./02-arrays-core-functions.md)                                             | Mutating vs non-mutating, iteration, grouping, flat, sort pitfalls         |
| 3   | [03-strings-core-functions.md](./03-strings-core-functions.md)                                           | Search, slice vs substring, template literals, parsing, immutability       |
| 4   | [04-objects-core-functions.md](./04-objects-core-functions.md)                                           | Keys/values/entries, spread, destructuring, `structuredClone`, patterns    |
| 5   | [05-built-in-functions-reference.md](./05-built-in-functions-reference.md)                               | Math, Number, JSON, Date, Set, Map, Promise, globals                       |
| 6   | [06-shallow-deep-copy-closures-hoisting-memoize.md](./06-shallow-deep-copy-closures-hoisting-memoize.md) | Shallow/deep copy, memoize, hoisting, closures + output Q&A                |
| 7   | [07-sorting-stack-queue.md](./07-sorting-stack-queue.md)                                                 | Sorting algorithms, stack/queue impl, classic DSA problems                 |
| 8   | [08-top-30-javascript-interview-problems.md](./08-top-30-javascript-interview-problems.md)               | **30 most common** live-coding problems with solutions                     |
| —   | [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md)                                                       | **55 spoken Q&A** — HOF, arrays, strings, objects, built-ins, closures     |

## Related in this repo

- [JavaScript Arrays — Course folder](../array/) — tapaScript course reference and 54 practice tasks
- [KPMG Round 1 — Vanilla JS](./kpmg-round-1-vanilla-javascript-interview.md) — coercion, event loop, prototypes
- [LeetCode HOF problems](../leetcode/) — `2634` filter, `2635` map transform, `2665` counter
- [Vanilla JS projects](../../Projects/vanilla-js/) — store, CRUD, performance patterns in real apps

## Study order

1. **HOF file first** — interviewers often ask you to implement `map` or explain `reduce`
2. **Copy / closures / hoisting** — [06](./06-shallow-deep-copy-closures-hoisting-memoize.md) — classic output questions
3. **Arrays** — most live-coding is array manipulation
4. **Objects** — normalization, immutability, `Map` vs object
5. **Strings** — parsing URLs, slugs, search highlighting
6. **Built-ins reference** — Math, JSON, Promise, Set/Map
7. **[Top 30 problems](./08-top-30-javascript-interview-problems.md)** — Two Sum, debounce, parentheses, sliding window
8. **[Sorting / stack / queue](./07-sorting-stack-queue.md)** — comparators, valid parentheses, min stack
9. **INTERVIEW-QUESTIONS.md** — practice answers aloud before mocks

## Level guide

| Level            | What to master                                                                   |
| ---------------- | -------------------------------------------------------------------------------- |
| **Intermediate** | Built-in methods, arrow vs function, shallow copy, basic `map`/`filter`/`reduce` |
| **Senior**       | Implement HOFs, closure output, sorting complexity, stack/queue, top 30 problems |
