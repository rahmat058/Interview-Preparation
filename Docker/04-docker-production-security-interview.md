---
title: "Docker Production, Security & DevOps Interview Questions"
description: "15 topics — Docker security, CI/CD, registries, orchestration, Docker vs Kubernetes, and production best practices."
tags: ["docker", "security", "cicd", "kubernetes", "devops", "interview"]
level: "Mid to Senior"
---

# Docker Production, Security & DevOps Interview Questions

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Docker security best practices](#p1) |
| <span id="i2"></span>2 | [Running as root risk](#p2) |
| <span id="i3"></span>3 | [Secrets in Docker](#p3) |
| <span id="i4"></span>4 | [Image scanning](#p4) |
| <span id="i5"></span>5 | [Docker in CI/CD](#p5) |
| <span id="i6"></span>6 | [GitHub Actions with Docker](#p6) |
| <span id="i7"></span>7 | [Docker vs Kubernetes](#p7) |
| <span id="i8"></span>8 | [What is container orchestration?](#p8) |
| <span id="i9"></span>9 | [Docker Swarm basics](#p9) |
| <span id="i10"></span>10 | [Immutable infrastructure](#p10) |
| <span id="i11"></span>11 | [Blue-green deployment](#p11) |
| <span id="i12"></span>12 | [Resource limits](#p12) |
| <span id="i13"></span>13 | [Logging and monitoring](#p13) |
| <span id="i14"></span>14 | [Production Dockerfile checklist](#p14) |
| <span id="i15"></span>15 | [Common Docker interview scenarios](#p15) |

---

<a id="p1"></a>

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


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

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


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

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


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

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


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. How is Docker used in CI/CD?

### Theory

```text
Push code → CI builds image → run tests in container → push to registry → CD pulls and deploys
```

Benefits: identical test environment, reproducible builds, fast rollbacks (previous image tag).

### Interview Answer

> CI builds and tests Docker images, pushes to a registry, and CD deploys tagged images — same artifact from dev through production.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

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


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

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


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. What is container orchestration?

### Theory

Automates deployment, scaling, networking, and health of containers across many hosts.

Examples: **Kubernetes**, **Docker Swarm**, **AWS ECS**, **Nomad**.

### Interview Answer

> Orchestration automates running containers at scale — health checks, rolling updates, service discovery, and load balancing across machines.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

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


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

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


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

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


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

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


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

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


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

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


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

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


<p><a href="#i15">Back to index</a></p>
