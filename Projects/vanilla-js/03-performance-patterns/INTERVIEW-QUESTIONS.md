# Interview Questions — Performance Patterns

### Q. Why virtualize instead of paginate?

Virtualization keeps scroll position and "infinite" feel with O(visible) DOM. Pagination is simpler but different UX.

### Q. debounce vs throttle?

**Debounce** — wait until typing stops (search). **Throttle** — at most once per interval (scroll).

### Q. How would you measure LCP in production?

`web-vitals` library → analytics. Lab: Lighthouse.

### Q. React Server Components vs this CSR list?

RSC sends HTML without shipping 10k row components to client. Virtual list still needed for interactive client-side sort/filter on huge client-held datasets.
