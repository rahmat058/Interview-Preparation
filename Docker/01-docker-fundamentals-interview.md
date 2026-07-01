---
title: "Docker Fundamentals Interview Questions & Answers"
description: "15 Docker fundamentals — containers vs VMs, images, architecture, lifecycle, registries, and core concepts."
tags: ["docker", "containers", "devops", "interview"]
level: "All levels"
---

# Docker Fundamentals Interview Questions & Answers

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [What is Docker?](#p1) |
| <span id="i2"></span>2 | [Containers vs Virtual Machines](#p2) |
| <span id="i3"></span>3 | [What is a Docker image?](#p3) |
| <span id="i4"></span>4 | [What is a Docker container?](#p4) |
| <span id="i5"></span>5 | [Docker architecture](#p5) |
| <span id="i6"></span>6 | [Image vs container](#p6) |
| <span id="i7"></span>7 | [Docker Engine](#p7) |
| <span id="i8"></span>8 | [Container lifecycle](#p8) |
| <span id="i9"></span>9 | [Docker Hub and registries](#p9) |
| <span id="i10"></span>10 | [Why use Docker?](#p10) |
| <span id="i11"></span>11 | [docker run explained](#p11) |
| <span id="i12"></span>12 | [docker exec vs docker attach](#p12) |
| <span id="i13"></span>13 | [Container isolation](#p13) |
| <span id="i14"></span>14 | [Namespaces and cgroups](#p14) |
| <span id="i15"></span>15 | [Docker limitations](#p15) |

---

<a id="p1"></a>

## 1. What is Docker?

### Theory

**Docker** is a platform for building, shipping, and running applications in **containers** — lightweight, portable, isolated environments that package code and dependencies together.

### Real Example

```bash
# Run MongoDB without installing it on your machine
docker run -d --name mongo -p 27017:27017 mongo:7

# MERN dev — same Mongo version for entire team
docker run -d --name mern-mongo -v mongo-data:/data/db mongo:7
```

### Interview Answer

> Docker packages applications and dependencies into containers that run consistently on any machine with Docker Engine — solving "works on my machine" problems.

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## 2. What is the difference between Containers and Virtual Machines?

### Theory

|           | Containers        | Virtual Machines            |
| --------- | ----------------- | --------------------------- |
| OS        | Share host kernel | Full guest OS per VM        |
| Size      | MBs               | GBs                         |
| Boot time | Seconds           | Minutes                     |
| Isolation | Process-level     | Hardware-level (hypervisor) |
| Overhead  | Low               | High                        |

```text
VMs:     App → Guest OS → Hypervisor → Host OS → Hardware
Docker:  App → Container → Docker Engine → Host OS → Hardware
```

### Pros & Cons

| Containers                       | VMs                         |
| -------------------------------- | --------------------------- |
| ✅ Fast, dense packing           | ✅ Stronger isolation       |
| ✅ Less resource waste           | ✅ Run different OS kernels |
| ❌ Share kernel — less isolation | ❌ Slow to start, heavy     |

### Interview Answer

> VMs virtualize hardware and run full OS instances; containers share the host kernel and isolate processes — containers are lighter and faster, VMs provide stronger isolation.

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## 3. What is a Docker image?

### Theory

An **image** is a **read-only template** with filesystem layers, app code, runtime, libraries, and config. Built from a `Dockerfile` or pulled from a registry.

### Real Example

```bash
docker pull node:20-alpine          # download image
docker images                       # list local images
docker image inspect node:20-alpine # metadata, layers
```

```text
node:20-alpine layers (simplified):
  Layer 4: app code (your COPY)
  Layer 3: npm dependencies
  Layer 2: node binary
  Layer 1: alpine linux base
```

### Interview Answer

> A Docker image is an immutable, layered template used to create containers — like a class; the container is the running instance.

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## 4. What is a Docker container?

### Theory

A **container** is a **running instance** of an image — writable layer on top of read-only image layers. Isolated processes with own network, filesystem, and PID namespace.

### Real Example

```bash
docker run -d --name api -p 5000:5000 mern-api:1.0
docker ps                           # running containers
docker stop api
docker start api
docker rm api
```

### Interview Answer

> A container is a runnable instance of an image — isolated processes with a writable layer that is discarded when the container is removed (unless data is in volumes).

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## 5. Explain Docker architecture

### Theory

| Component         | Role                                                  |
| ----------------- | ----------------------------------------------------- |
| **Docker Client** | CLI — `docker build`, `docker run`                    |
| **Docker Daemon** | Background service — builds, runs, manages containers |
| **containerd**    | Lower-level runtime — manages container lifecycle     |
| **runc**          | OCI runtime — actually starts containers              |
| **Registry**      | Stores images (Docker Hub, ECR, GCR)                  |

```text
docker CLI  →  Docker Daemon  →  containerd  →  runc  →  Container
                    ↓
               Registry (pull/push images)
```

### Interview Answer

> The Docker client talks to the daemon, which uses containerd and runc to run OCI-compliant containers; images are pulled from or pushed to registries.

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## 6. What is the difference between image and container?

### Theory

|         | Image                       | Container                 |
| ------- | --------------------------- | ------------------------- |
| State   | Read-only                   | Read-write (thin layer)   |
| Analogy | Class / blueprint           | Object / instance         |
| Count   | One image → many containers | One running process group |

### Real Example

```bash
docker build -t mern-api:1.0 .     # create image
docker run -d --name api1 mern-api:1.0
docker run -d --name api2 mern-api:1.0  # same image, two containers
```

### Interview Answer

> Images are immutable templates; containers are ephemeral running instances with a writable layer on top of the image.

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## 7. What is Docker Engine?

### Theory

**Docker Engine** is the core — **dockerd** (daemon) + **Docker CLI**. Community (CE) for dev/small prod; Enterprise for advanced features (legacy naming).

### Interview Answer

> Docker Engine is the daemon plus CLI that builds images and runs containers on the host machine.

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## 8. What is the container lifecycle?

### Theory

```text
created → running → paused → stopped → deleted
              ↓
           restarting (policy)
```

### Real Example

```bash
docker create --name web nginx:alpine   # created, not started
docker start web                        # running
docker pause web / docker unpause web
docker stop web                         # stopped (SIGTERM, then SIGKILL)
docker rm web                           # deleted
```

```bash
# Auto-restart on failure
docker run -d --restart unless-stopped --name api mern-api:1.0
```

### Interview Answer

> Containers move through create, start, run, stop, and remove — use `--restart` policies for production resilience.

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## 9. What is Docker Hub and container registry?

### Theory

A **registry** stores and distributes images. **Docker Hub** is the public default; private options: AWS ECR, Google GCR, GitHub Container Registry, Harbor.

### Real Example

```bash
docker login
docker tag mern-api:1.0 rahmat058/mern-api:1.0
docker push rahmat058/mern-api:1.0
docker pull rahmat058/mern-api:1.0
```

### Interview Answer

> A container registry hosts images — tag with `registry/user/image:tag`, push after build, pull in CI/CD or production deploys.

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## 10. Why use Docker?

### Theory

- **Consistency** — dev = staging = prod
- **Isolation** — dependencies don't conflict
- **Portability** — run anywhere with Docker
- **Scalability** — foundation for Kubernetes, ECS
- **Fast CI/CD** — build once, deploy everywhere

### Real Example

```text
Without Docker: "Node 18 on my Mac, Node 16 on server, Mongo version mismatch"
With Docker:    docker compose up → identical stack for all developers
```

### Interview Answer

> Docker ensures consistent environments, isolates dependencies, speeds onboarding, and is the standard packaging format for cloud deployment and orchestration.

---


<p><a href="#i10">Back to index</a></p>

<a id="p11"></a>

## 11. Explain docker run command

### Theory

`docker run [OPTIONS] IMAGE [COMMAND]` — creates and starts a container.

| Flag                | Purpose               |
| ------------------- | --------------------- |
| `-d`                | Detached (background) |
| `-p host:container` | Port mapping          |
| `--name`            | Container name        |
| `-e`                | Environment variable  |
| `-v`                | Volume mount          |
| `--rm`              | Remove on exit        |
| `-it`               | Interactive terminal  |

### Real Example

```bash
# MERN API — map port, env, auto-remove on stop
docker run -d \
  --name mern-api \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://mongo:27017/mern \
  -e NODE_ENV=production \
  --restart unless-stopped \
  mern-api:1.0
```

### Interview Answer

> `docker run` creates and starts a container from an image — use `-p` for ports, `-e` for env vars, `-v` for persistent data, and `-d` for background mode.

---


<p><a href="#i11">Back to index</a></p>

<a id="p12"></a>

## 12. What is the difference between docker exec and docker attach?

### Theory

|         | `docker exec`                        | `docker attach`                     |
| ------- | ------------------------------------ | ----------------------------------- |
| Purpose | Run new command in running container | Attach to main process stdin/stdout |
| Use     | `docker exec -it api sh`             | `docker attach api`                 |
| Exit    | Doesn't stop container               | Ctrl+C may stop container           |

### Real Example

```bash
# Debug running MERN API — open shell without stopping app
docker exec -it mern-api sh
node -v
ls -la

# View logs (prefer over attach for servers)
docker logs -f mern-api
```

### Interview Answer

> `exec` runs a new process inside a running container (e.g. shell for debugging); `attach` connects to the main process — prefer `exec` and `logs` for debugging servers.

---


<p><a href="#i12">Back to index</a></p>

<a id="p13"></a>

## 13. How does Docker isolate containers?

### Theory

Linux kernel features: **namespaces** (PID, network, mount, UTS, IPC, user) and **cgroups** (CPU, memory limits).

### Interview Answer

> Docker uses Linux namespaces for isolation (separate PIDs, networks, filesystems) and cgroups to limit CPU and memory per container.

---


<p><a href="#i13">Back to index</a></p>

<a id="p14"></a>

## 14. What are namespaces and cgroups?

### Theory

|          | Namespaces                          | cgroups                    |
| -------- | ----------------------------------- | -------------------------- |
| Purpose  | **Isolation** — what container sees | **Limits** — resource caps |
| Examples | Own network stack, own PIDs         | Max 512MB RAM, 50% CPU     |

### Real Example

```bash
docker run -d --name api --memory=512m --cpus=0.5 mern-api:1.0
```

### Interview Answer

> Namespaces isolate what a container can see; cgroups cap resources it can use — together they provide lightweight virtualization.

---


<p><a href="#i14">Back to index</a></p>

<a id="p15"></a>

## 15. What are limitations of Docker?

### Theory

- Not full VM isolation (shared kernel)
- Windows/macOS run Linux VMs under the hood (Docker Desktop)
- Stateful data needs volumes — containers are ephemeral
- Not a replacement for orchestration at scale (use Kubernetes)
- Security misconfigurations (root user, exposed sockets)

### Interview Answer

> Docker shares the host kernel so isolation is weaker than VMs; containers are ephemeral without volumes; and at scale you need orchestration like Kubernetes for scheduling and self-healing.

---

**Next:** [02-dockerfile-image-interview.md](./02-dockerfile-image-interview.md)


<p><a href="#i15">Back to index</a></p>
