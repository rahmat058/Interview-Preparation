---
title: "Dockerfile & Image Interview Questions & Answers"
description: "15 Dockerfile topics — instructions, layers, caching, multi-stage builds, .dockerignore, and image optimization."
tags: ["docker", "dockerfile", "images", "devops", "interview"]
level: "Mid level"
---

# Dockerfile & Image Interview Questions & Answers

---

## Table of Contents

1. [What is a Dockerfile?](#1-what-is-a-dockerfile)
2. [FROM instruction](#2-what-does-from-do)
3. [RUN vs CMD vs ENTRYPOINT](#3-what-is-the-difference-between-run-cmd-and-entrypoint)
4. [COPY vs ADD](#4-what-is-the-difference-between-copy-and-add)
5. [WORKDIR and ENV](#5-what-are-workdir-and-env)
6. [EXPOSE instruction](#6-what-does-expose-do)
7. [Docker layers](#7-what-are-docker-layers)
8. [Layer caching](#8-how-does-docker-layer-caching-work)
9. [Multi-stage builds](#9-what-are-multi-stage-builds)
10. [Optimize image size](#10-how-do-you-optimize-docker-image-size)
11. [.dockerignore](#11-what-is-dockerignore)
12. [USER instruction](#12-why-use-user-in-dockerfile)
13. [HEALTHCHECK](#13-what-is-healthcheck)
14. [ARG vs ENV](#14-what-is-the-difference-between-arg-and-env)
15. [docker build explained](#15-explain-docker-build)

---

## 1. What is a Dockerfile?

### Theory

A **Dockerfile** is a text file of instructions Docker uses to **build an image** layer by layer.

### Real Example — MERN Express API

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
USER node
CMD ["node", "index.js"]
```

```bash
docker build -t mern-api:1.0 .
```

### Interview Answer

> A Dockerfile is a recipe of instructions that Docker executes sequentially to produce an immutable image.

---

## 2. What does FROM do?

### Theory

**FROM** sets the **base image** — must be first instruction (except ARG before FROM). Examples: `node:20-alpine`, `nginx:alpine`, `golang:1.22`.

### Real Example

```dockerfile
# Small production base (~5MB alpine + node)
FROM node:20-alpine

# Official slim variant
FROM node:20-slim

# Multi-stage — different FROM per stage
FROM node:20-alpine AS builder
FROM node:20-alpine AS production
```

### Interview Answer

> `FROM` specifies the parent image every layer builds on — choose alpine or slim bases to reduce image size.

---

## 3. What is the difference between RUN, CMD, and ENTRYPOINT?

### Theory

| Instruction    | When               | Purpose                           |
| -------------- | ------------------ | --------------------------------- |
| **RUN**        | Build time         | Execute command, create new layer |
| **CMD**        | Run time (default) | Default command — overridable     |
| **ENTRYPOINT** | Run time           | Fixed executable — args appended  |

### Real Example

```dockerfile
# RUN — install deps at build
RUN npm ci --only=production

# CMD — default, overridden by docker run args
CMD ["node", "index.js"]
# docker run mern-api node debug.js  ← overrides CMD

# ENTRYPOINT + CMD — fixed entry, default args
ENTRYPOINT ["node"]
CMD ["index.js"]
# docker run mern-api server.js → node server.js
```

### Interview Answer

> `RUN` executes at build time and creates layers; `CMD` is the default overridable command at run time; `ENTRYPOINT` defines the fixed executable with `CMD` supplying default arguments.

---

## 4. What is the difference between COPY and ADD?

### Theory

|                  | COPY | ADD              |
| ---------------- | ---- | ---------------- |
| Basic copy       | ✅   | ✅               |
| Auto-extract tar | ❌   | ✅               |
| Remote URLs      | ❌   | ✅ (discouraged) |

**Best practice:** Prefer **COPY** — explicit and predictable.

### Real Example

```dockerfile
COPY package*.json ./
COPY . .

# Avoid ADD for URLs — use curl in RUN instead
# ADD https://example.com/file.tar.gz /tmp/  ❌
```

### Interview Answer

> Use `COPY` for files from build context; avoid `ADD` unless you need tar auto-extraction — COPY is clearer and more portable.

---

## 5. What are WORKDIR and ENV?

### Theory

- **WORKDIR** — sets working directory for subsequent instructions
- **ENV** — sets environment variables (available at build and run)

### Real Example

```dockerfile
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
```

### Interview Answer

> `WORKDIR` sets the container working directory; `ENV` defines environment variables baked into the image and available to running containers.

---

## 6. What does EXPOSE do?

### Theory

**EXPOSE** documents which port the container listens on — **does not publish** to the host. Use `-p` on `docker run` or `ports` in Compose.

### Real Example

```dockerfile
EXPOSE 5000
```

```bash
docker run -p 5000:5000 mern-api:1.0   # host:container
```

### Interview Answer

> `EXPOSE` is documentation for the intended port — actual publishing requires `-p` or Compose `ports` mapping.

---

## 7. What are Docker layers?

### Theory

Each Dockerfile instruction creates an **immutable layer**. Layers are cached and shared between images — union filesystem presents them as one tree.

### Real Example

```text
mern-api:1.0
  sha256:layer4  COPY . .
  sha256:layer3  RUN npm ci
  sha256:layer2  COPY package*.json
  sha256:layer1  FROM node:20-alpine
```

```bash
docker history mern-api:1.0
```

### Interview Answer

> Each Dockerfile step creates a cached layer; shared layers save disk space when multiple images use the same base.

---

## 8. How does Docker layer caching work?

### Theory

Docker reuses cached layers if instruction and **context** unchanged. **Order matters** — put slow-changing steps first.

### Real Example

```dockerfile
# ✅ Good — package.json changes less often than source
COPY package*.json ./
RUN npm ci
COPY . .

# ❌ Bad — any code change invalidates npm ci cache
COPY . .
RUN npm ci
```

### Interview Answer

> Docker caches layers when instructions and inputs are unchanged — copy dependency files and run `npm ci` before copying app source to speed rebuilds.

---

## 9. What are multi-stage builds?

### Theory

Multiple **FROM** stages in one Dockerfile — copy only build artifacts into final small image (no build tools in production).

### Real Example — MERN React + Express

```dockerfile
# Stage 1 — build React client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2 — production API serves static + API
FROM node:20-alpine AS production
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
COPY --from=client-build /app/client/dist ./public
EXPOSE 5000
USER node
CMD ["node", "index.js"]
```

```bash
docker build -t mern-fullstack:1.0 .
# Final image: no devDependencies, no React source — only dist/
```

### Pros & Cons

| Multi-stage               | Single stage                   |
| ------------------------- | ------------------------------ |
| ✅ Tiny production image  | ✅ Simpler Dockerfile          |
| ✅ No build tools in prod | ❌ Bloated image with dev deps |
| ❌ More complex           | ❌ Larger attack surface       |

### Interview Answer

> Multi-stage builds compile in a builder stage and copy only artifacts to a minimal runtime image — essential for production Node/React deployments.

---

## 10. How do you optimize Docker image size?

### Theory

| Technique                          | Impact                                   |
| ---------------------------------- | ---------------------------------------- |
| Alpine / distroless base           | − hundreds of MB                         |
| Multi-stage builds                 | Remove build deps                        |
| `.dockerignore`                    | Smaller context                          |
| `npm ci --only=production`         | No devDependencies                       |
| Combine RUN commands               | Fewer layers (less relevant in BuildKit) |
| Don't install unnecessary packages | Security + size                          |

### Real Example

```dockerfile
FROM node:20-alpine
RUN npm ci --only=production && npm cache clean --force
```

```bash
# Compare sizes
docker images mern-api
# node:20        ~1GB
# node:20-alpine ~180MB base
```

### Interview Answer

> Use alpine bases, multi-stage builds, production-only dependencies, and `.dockerignore` — aim for minimal runtime images without compilers or dev tools.

---

## 11. What is .dockerignore?

### Theory

Like `.gitignore` — excludes files from **build context** sent to daemon. Faster builds, smaller context, no secrets leaked.

### Real Example

```text
# .dockerignore
node_modules
npm-debug.log
.git
.env
.env.*
Dockerfile
docker-compose*.yml
README.md
client/node_modules
coverage
dist
```

### Interview Answer

> `.dockerignore` excludes files from the build context — always ignore `node_modules`, `.git`, and `.env` to speed builds and avoid copying secrets.

---

## 12. Why use USER in Dockerfile?

### Theory

Containers run as **root** by default — security risk if process escapes. **USER** switches to non-root.

### Real Example

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --chown=nodejs:nodejs . .
USER nodejs
CMD ["node", "index.js"]
```

### Interview Answer

> Run containers as a non-root user to limit damage from container breakout — create a dedicated user and `chown` app files.

---

## 13. What is HEALTHCHECK?

### Theory

Docker periodically runs a command to determine container health — used by orchestrators for restarts and load balancing.

### Real Example

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1
```

```bash
docker ps   # STATUS column: healthy / unhealthy
```

### Interview Answer

> `HEALTHCHECK` defines how Docker probes container health — expose a `/health` endpoint and fail the check if the app is unresponsive.

---

## 14. What is the difference between ARG and ENV?

### Theory

|              | ARG                       | ENV                |
| ------------ | ------------------------- | ------------------ |
| Available at | Build time only           | Build + run time   |
| Set via      | `--build-arg`             | `-e` or Dockerfile |
| Use          | Version pins, build flags | App config         |

### Real Example

```dockerfile
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine

ARG BUILD_DATE
LABEL build-date=$BUILD_DATE

ENV NODE_ENV=production
ENV PORT=5000
```

```bash
docker build --build-arg NODE_VERSION=20 -t mern-api .
```

### Interview Answer

> `ARG` is build-time only and not available in running containers; `ENV` persists into the runtime environment.

---

## 15. Explain docker build

### Theory

`docker build [OPTIONS] PATH` — sends context to daemon, executes Dockerfile, tags result.

| Flag             | Purpose                |
| ---------------- | ---------------------- |
| `-t name:tag`    | Tag image              |
| `-f Dockerfile`  | Custom Dockerfile path |
| `--no-cache`     | Force full rebuild     |
| `--build-arg`    | Pass ARG values        |
| `--target stage` | Multi-stage target     |

### Real Example

```bash
docker build -t mern-api:1.0 -t mern-api:latest .
docker build --target production -t mern-api:prod .
docker build --no-cache -t mern-api:1.0 .
```

### Interview Answer

> `docker build` executes the Dockerfile against a context directory and tags the resulting image — use `-t` for naming and `--target` for multi-stage builds.

---

**Next:** [03-docker-compose-networking-volumes-interview.md](./03-docker-compose-networking-volumes-interview.md)
