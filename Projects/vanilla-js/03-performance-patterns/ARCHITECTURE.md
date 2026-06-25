# Architecture — Performance Patterns

## Virtual scrolling

Only mount rows in viewport + overscan buffer. Total scroll height preserved via spacer div.

```
scrollTop → startIndex → slice(items) → translateY offset
```

React equivalent: `react-virtual`, `react-window`.

## Debouncing

Search filters 10k items — debounce prevents work every keystroke. Measure with Performance API to prove cost in interviews.

## Lazy loading

`IntersectionObserver` loads `data-src` when card enters viewport. `loading="lazy"` is progressive enhancement.

## Code splitting

`02-catalog-spa` uses `import()` for API module on first load — same idea as `React.lazy` / dynamic `import()` in Next.js.

## Core Web Vitals mapping

| Vital | This project |
| --- | --- |
| **LCP** | Lazy images defer offscreen bytes |
| **INP** | Debounce reduces main-thread work during typing |
| **CLS** | Fixed row heights in virtual list prevent layout shift |
