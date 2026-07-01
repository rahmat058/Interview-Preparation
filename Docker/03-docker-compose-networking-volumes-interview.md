---
title: "Docker Compose, Networking & Volumes Interview Questions"
description: "15 topics — Docker Compose, networks, volumes, port mapping, linking services, and MERN stack examples."
tags: ["docker", "docker-compose", "networking", "volumes", "interview"]
level: "Mid level"
---

# Docker Compose, Networking & Volumes Interview Questions

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is Docker Compose?](#p1) |
| <span id="i2"></span>2 | [docker-compose.yml structure](#p2) |
| <span id="i3"></span>3 | [Docker networking types](#p3) |
| <span id="i4"></span>4 | [Bridge network](#p4) |
| <span id="i5"></span>5 | [Container-to-container communication](#p5) |
| <span id="i6"></span>6 | [Port mapping](#p6) |
| <span id="i7"></span>7 | [What are Docker volumes?](#p7) |
| <span id="i8"></span>8 | [Volumes vs bind mounts](#p8) |
| <span id="i9"></span>9 | [Named volumes](#p9) |
| <span id="i10"></span>10 | [docker compose up vs run](#p10) |
| <span id="i11"></span>11 | [depends_on and healthchecks](#p11) |
| <span id="i12"></span>12 | [Environment variables in Compose](#p12) |
| <span id="i13"></span>13 | [Multiple services example](#p13) |
| <span id="i14"></span>14 | [Docker network commands](#p14) |
| <span id="i15"></span>15 | [Persist MongoDB data](#p15) |

---

<a id="p1"></a>

## 1. What is Docker Compose?

### Theory

**Docker Compose** defines and runs **multi-container** apps in a single YAML file — one command starts the full stack.

### Real Example

```bash
docker compose up -d        # start all services
docker compose down         # stop and remove
docker compose logs -f api  # follow logs
docker compose ps
```

### Interview Answer

> Docker Compose orchestrates multiple containers from a YAML file — ideal for local MERN dev with API, MongoDB, and Redis together.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. Explain docker-compose.yml structure

### Theory

Top-level keys: `services`, `networks`, `volumes`, `configs`, `secrets`.

### Real Example

```yaml
# docker-compose.yml
services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://mongo:27017/mern
    depends_on:
      - mongo
    networks:
      - mern-net

  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
    networks:
      - mern-net

volumes:
  mongo-data:

networks:
  mern-net:
    driver: bridge
```

### Interview Answer

> Compose YAML defines services, their images/build, ports, env, volumes, networks, and dependencies — version 3+ is standard for modern Compose.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What are Docker networking types?

### Theory

| Driver      | Use                                  |
| ----------- | ------------------------------------ |
| **bridge**  | Default — containers on same host    |
| **host**    | Container uses host network directly |
| **none**    | No networking                        |
| **overlay** | Multi-host (Swarm, Kubernetes CNI)   |

### Interview Answer

> Bridge is default for isolated containers on one machine; host removes network isolation; overlay connects containers across hosts in clusters.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is bridge network?

### Theory

Default **docker0** bridge — containers get private IPs and communicate by IP or **service name** (in Compose).

### Real Example

```bash
docker network ls
docker network inspect bridge
docker network create mern-net
docker run -d --network mern-net --name api mern-api:1.0
```

### Interview Answer

> Bridge networks connect containers on the same host with internal DNS — Compose creates a default bridge network per project.

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. How do containers communicate?

### Theory

- **Same Compose project:** use **service name** as hostname (`mongodb://mongo:27017`)
- **Custom network:** containers resolve each other by name
- **Host access:** `host.docker.internal` (Docker Desktop)

### Real Example

```javascript
// Express inside Docker — connect to mongo service by name
mongoose.connect("mongodb://mongo:27017/mernapp");
```

```yaml
services:
  api:
    environment:
      REDIS_URL: redis://redis:6379
  redis:
    image: redis:7-alpine
```

### Interview Answer

> On a shared Docker network, containers reach each other by service name — use `mongo` not `localhost` from inside another container.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. What is port mapping?

### Theory

`-p hostPort:containerPort` maps host traffic to container port. Format: `HOST:CONTAINER` or `IP:HOST:CONTAINER`.

### Real Example

```yaml
services:
  api:
    ports:
      - "5000:5000" # localhost:5000 → container:5000
  mongo:
    ports:
      - "27017:27017" # expose DB to host (dev only)
  client:
    ports:
      - "3000:80" # React nginx on 80
```

```bash
docker run -p 127.0.0.1:5000:5000 mern-api  # bind localhost only
```

### Interview Answer

> Port mapping publishes container ports to the host — `5000:5000` means host port 5000 forwards to container port 5000.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. What are Docker volumes?

### Theory

**Volumes** persist data outside the container writable layer — survive container delete/restart.

### Real Example

```bash
docker volume create mongo-data
docker run -d -v mongo-data:/data/db mongo:7
docker volume ls
docker volume inspect mongo-data
```

### Interview Answer

> Volumes store persistent data managed by Docker — essential for databases so data isn't lost when containers are recreated.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. Volumes vs bind mounts?

### Theory

|                | Named volume   | Bind mount            |
| -------------- | -------------- | --------------------- |
| Location       | Docker-managed | Host path             |
| Portability    | ✅ Better      | ❌ Host-specific path |
| Dev hot-reload | ❌             | ✅ Mount source code  |
| Production DB  | ✅ Preferred   | ⚠️ Rare               |

### Real Example

```yaml
services:
  api:
    volumes:
      - ./server:/app # bind mount — live code reload in dev
      - /app/node_modules # anonymous volume — preserve container modules

  mongo:
    volumes:
      - mongo-data:/data/db # named volume — persistent DB
```

### Interview Answer

> Named volumes are Docker-managed and best for databases; bind mounts map host directories — great for dev code sync, risky for prod data paths.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. What are named volumes?

### Theory

Declared in Compose `volumes:` top level — Docker creates and manages them with stable names like `project_mongo-data`.

### Real Example

```yaml
volumes:
  mongo-data:
    driver: local
  redis-data:

services:
  mongo:
    volumes:
      - mongo-data:/data/db
```

```bash
docker volume ls | grep mongo
# interview-preparation_mongo-data
```

### Interview Answer

> Named volumes are declared in Compose and reused across restarts — data persists even when you `docker compose down` without `-v`.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. docker compose up vs docker run?

### Theory

|            | `docker compose up`  | `docker run`       |
| ---------- | -------------------- | ------------------ |
| Scope      | Entire stack         | Single container   |
| Config     | YAML file            | CLI flags          |
| Networking | Auto-linked services | Manual `--network` |

### Real Example

```bash
docker compose up -d --build    # rebuild images + start
docker compose down -v          # stop + remove volumes (⚠️ deletes DB)
```

### Interview Answer

> `compose up` starts the whole defined stack with networking and volumes; `docker run` starts one container — Compose is for multi-service apps.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. depends_on and healthchecks?

### Theory

`depends_on` controls **start order** only — does **not** wait until service is ready. Use **healthcheck** + `condition: service_healthy` (Compose v2+).

### Real Example

```yaml
services:
  mongo:
    image: mongo:7
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: ./server
    depends_on:
      mongo:
        condition: service_healthy
```

### Interview Answer

> `depends_on` orders startup but doesn't guarantee readiness — add healthchecks and `condition: service_healthy` so the API waits for MongoDB.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. Environment variables in Compose?

### Theory

Pass via `environment`, `env_file`, or `${VAR}` substitution from host `.env`.

### Real Example

```yaml
services:
  api:
    env_file:
      - ./server/.env
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://mongo:27017/${DB_NAME:-mern}
```

```bash
# .env (project root — not committed)
DB_NAME=mernapp
JWT_SECRET=super-secret
```

### Interview Answer

> Use `env_file` for secrets and `environment` for overrides — Compose reads `.env` for variable substitution in the YAML itself.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. MERN stack Docker Compose example

### Real Example — Full stack

```yaml
# docker-compose.yml
services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - api

  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://mongo:27017/mern
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      mongo:
        condition: service_healthy
      redis:
        condition: service_started

  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  mongo-data:
  redis-data:
```

```bash
docker compose up -d --build
curl http://localhost:5000/api/health
```

### Interview Answer

> A MERN Compose file defines client, API, MongoDB, and optional Redis — API connects to `mongo` by hostname, data persists in named volumes.

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. Useful Docker network commands

### Real Example

```bash
docker network ls
docker network inspect mern_mern-net
docker network create custom-net
docker network connect custom-net api
docker network disconnect custom-net api
docker network rm custom-net
```

### Interview Answer

> Use `network ls/inspect` to debug connectivity; create custom networks to isolate environments or connect containers manually.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. How to persist MongoDB data in Docker?

### Real Example

```yaml
services:
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
    # Optional backup bind mount
    # - ./backups:/backups

volumes:
  mongo-data:
```

```bash
# Backup
docker exec mern-mongo-1 mongodump --out=/data/db/backup

# ⚠️ docker compose down -v  DELETES named volumes
docker compose down      # keeps volumes
```

### Interview Answer

> Mount a named volume at `/data/db` for MongoDB — data survives container restarts; avoid `docker compose down -v` unless you intend to wipe the database.

---

**Next:** [04-docker-production-security-interview.md](./04-docker-production-security-interview.md)


<p><a href="#i15">Back to index</a></p>
