# System Design Interview Preparation

System design is **not only for senior engineers**. You start with fundamentals — scale, data, reliability, and trade-offs — then layer on architecture components and a repeatable design process.

Each guide follows the same structure used across this repo:

- **Theory** — what it is and why it matters
- **Pros & Cons** — where trade-offs appear
- **Real Example** — concrete scenario (often a product you already know)
- **Interview Answer** — concise one-liner for live rounds

Diagrams for several components live in [`../Advanced Topic Images/`](../Advanced%20Topic%20Images/).

---

## File Index

| #   | File                                                                | Focus                                                                        |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 01  | [system-design-fundamentals.md](./01-system-design-fundamentals.md) | What is SD, scalability, reliability, availability, performance              |
| 02  | [core-components.md](./02-core-components.md)                       | Client, app server, database, cache, load balancer, queue, external services |
| 03  | [design-process.md](./03-design-process.md)                         | Requirements, HLA, trade-offs, security, monitoring & scaling                |

---

## The Big Picture

```
System Design =
  Handling scale
+ Managing data
+ Designing reliable systems
+ Making smart engineering trade-offs
```

Most people make it look complicated. It isn't — you just need the fundamentals first.

---

## Recommended Study Path

### Level 1 — Fundamentals (you're ahead of 80% here)

1. **01** — Read all five pillars: scalability, reliability, availability, performance
2. Skim the **Quick Revision** section at the end of `01`

### Level 2 — Building Blocks

3. **02** — Learn each core component with a real product example
4. Cross-reference PNGs in `Advanced Topic Images/` (Load Balancer, Caching, CDN, etc.)

### Level 3 — Design Like an Engineer

5. **03** — Practice the 5-step process on a sample problem (URL shortener, news feed)
6. Pair with [React/02-frontend-fullstack-interview-preparation.md](../React/02-frontend-fullstack-interview-preparation.md) for fullstack context

### Interview Week

7. Re-read **Interview Answer** boxes in all three files
8. Whiteboard one HLA diagram per day from `02`
9. Run through the **URL Shortener walkthrough** in `03`

---

## Related Resources in This Repo

| Topic                    | Where                                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Load Balancer diagram    | [Advanced Topic Images/Load Balancer.png](../Advanced%20Topic%20Images/Load%20Balancer.png)                                                                          |
| Caching diagram          | [Advanced Topic Images/Caching.png](../Advanced%20Topic%20Images/Caching.png)                                                                                        |
| CDN diagram              | [Advanced Topic Images/CDN(Content Delivery Network).png](<../Advanced%20Topic%20Images/CDN(Content%20Delivery%20Network).png>)                                      |
| API Gateway diagram      | [Advanced Topic Images/API Gateway.png](../Advanced%20Topic%20Images/API%20Gateway.png)                                                                              |
| Message queues / async   | [Advanced Topic Images/Rate Limiting.png](../Advanced%20Topic%20Images/Rate%20Limiting.png)                                                                          |
| Database scaling         | [Advanced Topic Images/Database Sharding.png](../Advanced%20Topic%20Images/Database%20Sharding.png), [Replication.png](../Advanced%20Topic%20Images/Replication.png) |
| Microservices            | [Advanced Topic Images/Microservice.png](../Advanced%20Topic%20Images/Microservice.png)                                                                              |
| Frontend architecture    | [React/10-frontend-concepts-checklist.md](../React/10-frontend-concepts-checklist.md)                                                                                |
| Senior real-world topics | [React/20-senior-frontend-real-world-interview.md](../React/20-senior-frontend-real-world-interview.md)                                                              |

---

_Start with [01-system-design-fundamentals.md](./01-system-design-fundamentals.md) — it takes ~20 minutes and puts you ahead of most developers._
