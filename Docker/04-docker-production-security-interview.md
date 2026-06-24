---
title: "Docker Production, Security & DevOps Interview Questions"
description: "15 topics — Docker security, CI/CD, registries, orchestration, Docker vs Kubernetes, and production best practices."
tags: ["docker", "security", "cicd", "kubernetes", "devops", "interview"]
level: "Mid to Senior"
---

# Docker Production, Security & DevOps Interview Questions

---

## Table of Contents

1. [Docker security best practices](#1-docker-security-best-practices)
2. [Running as root risk](#2-why-is-running-containers-as-root-risky)
3. [Secrets in Docker](#3-how-do-you-handle-secrets-in-docker)
4. [Image scanning](#4-what-is-container-image-scanning)
5. [Docker in CI/CD](#5-how-is-docker-used-in-cicd)
6. [GitHub Actions with Docker](#6-github-actions-docker-example)
7. [Docker vs Kubernetes](#7-docker-vs-kubernetes)
8. [What is container orchestration?](#8-what-is-container-orchestration)
9. [Docker Swarm basics](#9-what-is-docker-swarm)
10. [Immutable infrastructure](#10-what-is-immutable-infrastructure)
11. [Blue-green deployment](#11-blue-green-deployment-with-docker)
12. [Resource limits](#12-how-do-you-set-resource-limits)
13. [Logging and monitoring](#13-how-do-you-handle-logging-in-docker)
14. [Production Dockerfile checklist](#14-production-dockerfile-checklist)
15. [Common Docker interview scenarios](#15-common-docker-interview-scenarios)

---

## 1. Docker security best practices

### Theory

| Practice             | Why                    |
| -------------------- | ---------------------- |
| Non-root USER        | Limit breakout impact  |
| Minimal base images  | Smaller attack surface |
| Scan images          | Find CVEs              |
| Don't embed secrets  | Use secrets manager    |
| Read-only filesystem | Prevent tampering      |
| Pin image digests    | Avoid tag hijacking    |
| Keep images updated  | Patch vulnerabilities  |

### Real Example

```dockerfile
FROM node:20-alpine
RUN adduser -S appuser -u 1001
USER appuser
COPY --chown=appuser:appuser . .
```

```bash
docker scan mern-api:1.0    # Snyk / Docker Scout
```

### Interview Answer

> Run as non-root, use minimal bases, scan for CVEs, never put secrets in images, pin versions, and keep images patched.

---

## 2. Why is running containers as root risky?

### Theory

Root inside container ≈ root on host if **namespace escape** or **privileged** mode. Capabilities can allow host access.

### Real Example

```bash
# ❌ Never in production
docker run --privileged mern-api

# ✅ Non-root
docker run --user 1001:1001 mern-api
```

### Interview Answer

> Container root can escape to host root via kernel bugs or misconfiguration — always run application processes as an unprivileged user.

---

## 3. How do you handle secrets in Docker?

### Theory

| Method              | Use                                   |
| ------------------- | ------------------------------------- |
| **Env at runtime**  | `-e` from orchestrator (not in image) |
| **Docker secrets**  | Swarm encrypted secrets               |
| **K8s secrets**     | Kubernetes native                     |
| **Vault / AWS SM**  | Fetch at startup                      |
| **Compose secrets** | Mount as files in containers          |

### Real Example

```yaml
# docker-compose.yml (secrets)
secrets:
  jwt_secret:
    file: ./secrets/jwt.txt

services:
  api:
    secrets:
      - jwt_secret
    environment:
      JWT_SECRET_FILE: /run/secrets/jwt_secret
```

```javascript
// Read secret from file — not env in image
const secret = fs.readFileSync(process.env.JWT_SECRET_FILE, "utf8").trim();
```

### Interview Answer

> Never bake secrets into images — inject at runtime via orchestrator secrets, env from CI, or mounted secret files.

---

## 4. What is container image scanning?

### Theory

Tools analyze image layers for **known CVEs** in OS packages and dependencies.

Tools: **Docker Scout**, **Snyk**, **Trivy**, **Grype**.

### Real Example

```bash
# Trivy scan
trivy image mern-api:1.0

# CI gate — fail on HIGH/CRITICAL
trivy image --exit-code 1 --severity HIGH,CRITICAL mern-api:1.0
```

### Interview Answer

> Image scanning finds vulnerabilities in base images and packages — integrate Trivy or Snyk in CI and block deploys on critical CVEs.

---

## 5. How is Docker used in CI/CD?

### Theory

```text
Push code → CI builds image → run tests in container → push to registry → CD pulls and deploys
```

Benefits: identical test environment, reproducible builds, fast rollbacks (previous image tag).

### Interview Answer

> CI builds and tests Docker images, pushes to a registry, and CD deploys tagged images — same artifact from dev through production.

---

## 6. GitHub Actions Docker example

### Real Example

```yaml
# .github/workflows/docker.yml
name: Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./server
          push: true
          tags: rahmat058/mern-api:${{ github.sha }},rahmat058/mern-api:latest
```

### Interview Answer

> GitHub Actions checks out code, builds the image with build-push-action, tags with git SHA, and pushes to Docker Hub or ECR.

---

## 7. Docker vs Kubernetes?

### Theory

|                | Docker                 | Kubernetes              |
| -------------- | ---------------------- | ----------------------- |
| Scope          | Single host containers | Cluster orchestration   |
| Scheduling     | Manual / Compose       | Automatic across nodes  |
| Self-healing   | Restart policy         | Replicas, health checks |
| Scaling        | Manual                 | HPA, replicas           |
| Load balancing | Basic                  | Service, Ingress        |

**Relationship:** Kubernetes **runs** containers (via container runtime); Docker **builds** images K8s deploys.

### Interview Answer

> Docker packages and runs containers on one host; Kubernetes orchestrates containers across a cluster — scheduling, scaling, and self-healing. Docker builds images; K8s runs them.

---

## 8. What is container orchestration?

### Theory

Automates deployment, scaling, networking, and health of containers across many hosts.

Examples: **Kubernetes**, **Docker Swarm**, **AWS ECS**, **Nomad**.

### Interview Answer

> Orchestration automates running containers at scale — health checks, rolling updates, service discovery, and load balancing across machines.

---

## 9. What is Docker Swarm?

### Theory

Docker's native clustering — **managers** + **workers**, `docker stack deploy` with Compose file.

Simpler than K8s; less ecosystem; declining vs K8s in enterprise.

### Real Example

```bash
docker swarm init
docker stack deploy -c docker-compose.yml mern
docker service ls
```

### Interview Answer

> Docker Swarm is built-in clustering for Docker — simpler than Kubernetes but less feature-rich; most enterprises choose K8s for orchestration.

---

## 10. What is immutable infrastructure?

### Theory

Don't patch running servers — **replace** containers with new image versions. Roll back by redeploying old tag.

### Real Example

```bash
# Deploy v2 — replace containers, don't SSH and npm install
docker pull rahmat058/mern-api:v2
docker stop mern-api && docker rm mern-api
docker run -d --name mern-api rahmat058/mern-api:v2

# Rollback
docker run -d --name mern-api rahmat058/mern-api:v1
```

### Interview Answer

> Immutable infrastructure means deploying new container images instead of modifying running ones — enables reliable rollbacks and reproducible deploys.

---

## 11. Blue-green deployment with Docker?

### Theory

**Blue** = live version. **Green** = new version on parallel stack. Switch traffic, keep blue for rollback.

### Real Example

```bash
# Green on port 5001, blue on 5000
docker run -d --name api-green -p 5001:5000 mern-api:v2
# smoke test curl localhost:5001/api/health
# nginx switch upstream 5000 → 5001
docker stop api-blue
```

### Interview Answer

> Run new version alongside old, verify green, switch load balancer traffic, then retire blue — zero-downtime with instant rollback.

---

## 12. How do you set resource limits?

### Real Example

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
        reservations:
          memory: 256M
```

```bash
docker run -d --memory=512m --cpus=0.5 mern-api:1.0
```

### Interview Answer

> Set `--memory` and `--cpus` on `docker run` or `deploy.resources` in Compose to prevent one container from starving the host.

---

## 13. How do you handle logging in Docker?

### Theory

Containers log to **stdout/stderr** — Docker captures to json-file (default). Ship with **Fluentd**, **Loki**, **CloudWatch**, or `docker logs`.

### Real Example

```javascript
// Log to stdout — Docker captures it
console.log(
  JSON.stringify({ level: "info", msg: "Server started", port: 5000 }),
);
```

```yaml
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

```bash
docker logs -f --tail 100 mern-api
```

### Interview Answer

> Apps should log to stdout; Docker collects logs — configure log rotation and forward to ELK/Loki/CloudWatch in production.

---

## 14. Production Dockerfile checklist

### Checklist

```dockerfile
# ✅ Multi-stage build
# ✅ node:20-alpine or distroless
# ✅ npm ci --only=production
# ✅ .dockerignore (node_modules, .env)
# ✅ Non-root USER
# ✅ HEALTHCHECK
# ✅ EXPOSE documented
# ✅ No secrets in ENV
# ✅ Pin base image digest (optional)
```

### Real Example — production MERN API

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nodejs -u 1001
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 5000
HEALTHCHECK CMD wget -qO- http://localhost:5000/api/health || exit 1
CMD ["node", "index.js"]
```

### Interview Answer

> Production Dockerfiles use multi-stage alpine builds, non-root user, health checks, no secrets, and minimal layers — scan before deploy.

---

## 15. Common Docker interview scenarios

### Scenario 1 — "Dockerize this Node app"

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

### Scenario 2 — "App can't connect to MongoDB in Compose"

```text
Fix: Use service name mongo://mongo:27017 not localhost
Check: docker compose ps, same network, healthcheck
```

### Scenario 3 — "Image is 1.2GB"

```text
Fix: alpine base, multi-stage, .dockerignore, npm ci --only=production
Remove: devDependencies, build tools from final stage
```

### Scenario 4 — "Container exits immediately"

```bash
docker logs mern-api
docker run -it mern-api sh    # debug interactively
# Check CMD, missing env vars, crash on startup
```

### Interview Answer

> Interview scenarios test Dockerfile writing, Compose networking (service names), image optimization, and debugging with `logs` and `exec`.

---

**Next:** [05-docker-commands-cheatsheet.md](./05-docker-commands-cheatsheet.md)
