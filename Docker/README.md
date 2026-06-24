# Docker Interview Preparation

Complete developer reference for **Docker fundamentals**, **Dockerfile**, **Compose**, **networking**, **volumes**, **production/DevOps**, **CLI commands**, and **ready-to-run templates** for popular frontend stacks.

Each interview file includes **Theory**, **Real Examples**, **Interview Answers**, and **Pros & Cons** where relevant — matching the structure used across this repo.

---

## Hands-On Templates (Dockerfile + Compose)

| Stack                 | Folder                     | Default port | Description                  |
| --------------------- | -------------------------- | ------------ | ---------------------------- |
| **React (Vite)**      | [reactjs/](./reactjs/)     | 3000         | Multi-stage Node → Nginx SPA |
| **Vue (Vite)**        | [vuejs/](./vuejs/)         | 3001         | Multi-stage Node → Nginx SPA |
| **Next.js**           | [nextjs/](./nextjs/)       | 3002         | Standalone output, Node SSR  |
| **Nuxt 3**            | [nuxtjs/](./nuxtjs/)       | 3003         | `.output` SSR server         |
| **Node.js (Express)** | [nodejs/](./nodejs/)       | 5000         | REST API + optional MongoDB  |
| **Fullstack**         | [fullstack/](./fullstack/) | 8080 + 5000  | React frontend + Express API |

### Quick commands (all stacks)

```bash
cd Docker/<stack>          # e.g. reactjs, fullstack
docker compose up --build -d
docker compose ps
docker compose logs -f
docker compose down
```

**Node.js API one-liner:**

```bash
cd Docker/nodejs && docker compose up --build -d
curl http://localhost:5000/api/health
```

**Fullstack one-liner:**

```bash
cd Docker/fullstack && docker compose up --build -d
curl http://localhost:5000/api/health
open http://localhost:8080
```

---

## Interview Study Files

| #   | File                                                                                                  | Focus                                               |
| --- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 01  | [docker-fundamentals-interview.md](./01-docker-fundamentals-interview.md)                             | Containers vs VMs, images, architecture, lifecycle  |
| 02  | [dockerfile-image-interview.md](./02-dockerfile-image-interview.md)                                   | Dockerfile instructions, layers, multi-stage builds |
| 03  | [docker-compose-networking-volumes-interview.md](./03-docker-compose-networking-volumes-interview.md) | Compose, networks, volumes, port mapping            |
| 04  | [docker-production-security-interview.md](./04-docker-production-security-interview.md)               | Security, CI/CD, registries, Docker vs Kubernetes   |
| 05  | [docker-commands-cheatsheet.md](./05-docker-commands-cheatsheet.md)                                   | Essential Docker & Compose CLI commands             |

---

## Folder Structure

```
Docker/
├── README.md
├── reactjs/          Dockerfile, docker-compose.yml, nginx.conf, README
├── vuejs/            Dockerfile, docker-compose.yml, nginx.conf, README
├── nextjs/           Dockerfile, docker-compose.yml, README
├── nuxtjs/           Dockerfile, docker-compose.yml, README
├── nodejs/           Dockerfile, docker-compose.yml, sample app/, README
├── fullstack/        docker-compose.yml (root)
│   ├── backend/      Dockerfile, Express API
│   └── frontend/     Dockerfile, nginx.conf (API proxy)
└── 01–05             Interview Q&A markdown files
```

---

## Recommended Study Path

### Week 1 — Foundations

1. **01** — What Docker is, containers vs VMs, image vs container
2. **05** — Run commands daily on a sample Node/MERN app

### Week 2 — Build & Run

3. **02** — Write a Dockerfile for Express API + multi-stage React build
4. **03** — Docker Compose for MERN (app + MongoDB + Redis)
5. Run **[fullstack/](./fullstack/)** — `docker compose up --build -d`

### Week 3 — Production

6. **04** — Security, registries, CI/CD pipeline
7. Build and push one image to Docker Hub
8. Dockerize a **Projects/** app via **[reactjs/](./reactjs/)** template

### Interview Week

9. Skim **Interview Answer** boxes in all files
10. Practice: `docker build`, `docker compose up`, debug with `docker logs` and `exec`

---

## Related Resources

| Topic           | Where                                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| MERN deployment | [MERN/05-mern-fullstack-interview.md](../MERN/05-mern-fullstack-interview.md)         |
| CI/CD concepts  | [MERN/06-tools-and-concepts-interview.md](../MERN/06-tools-and-concepts-interview.md) |
| React projects  | [Projects/](../Projects/) — use as `APP_PATH` build context                           |
| System design   | [System Design folder](../System%20Design/)                                           |

---

_Start with [fullstack/README.md](./fullstack/README.md) for hands-on practice, or [01-docker-fundamentals-interview.md](./01-docker-fundamentals-interview.md) for theory._
