---
title: "Docker Commands Cheatsheet"
description: "Essential Docker and Docker Compose CLI commands for interviews and daily development."
tags: ["docker", "commands", "cheatsheet", "cli"]
level: "All levels"
---

# Docker Commands Cheatsheet

Quick reference for interviews and MERN development with Docker.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [Image Commands](#p1) |
| <span id="i2"></span>2 | [Container Commands](#p2) |
| <span id="i3"></span>3 | [Volume Commands](#p3) |
| <span id="i4"></span>4 | [Network Commands](#p4) |
| <span id="i5"></span>5 | [Dockerfile & Build](#p5) |
| <span id="i6"></span>6 | [Docker Compose](#p6) |
| <span id="i7"></span>7 | [Logs & Debugging](#p7) |
| <span id="i8"></span>8 | [Cleanup Commands](#p8) |
| <span id="i9"></span>9 | [Registry Commands](#p9) |
| <span id="i10"></span>10 | [MERN Quick Start](#p10) |

---
<a id="p1"></a>

## Image Commands

```bash
# Pull / list / remove
docker pull node:20-alpine
docker pull mongo:7
docker images
docker images node
docker rmi mern-api:1.0
docker rmi -f $(docker images -q)    # remove all images (careful)

# Inspect / history
docker image inspect node:20-alpine
docker history mern-api:1.0

# Tag
docker tag mern-api:1.0 rahmat058/mern-api:1.0
docker tag mern-api:1.0 rahmat058/mern-api:latest

# Prune unused images
docker image prune
docker image prune -a                  # all unused
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## Container Commands

```bash
# Run
docker run nginx:alpine                          # foreground
docker run -d nginx:alpine                       # detached
docker run -d --name web nginx:alpine            # named
docker run -it ubuntu sh                         # interactive shell
docker run -d -p 5000:5000 mern-api:1.0          # port map
docker run -d -e NODE_ENV=production mern-api    # env var
docker run -d --rm mern-api                       # auto-remove on stop
docker run -d --restart unless-stopped mern-api    # restart policy

# List / inspect
docker ps                                        # running
docker ps -a                                     # all
docker inspect mern-api
docker top mern-api                              # processes inside

# Lifecycle
docker stop mern-api                             # SIGTERM then SIGKILL
docker start mern-api
docker restart mern-api
docker pause mern-api
docker unpause mern-api
docker kill mern-api                             # SIGKILL

# Remove
docker rm mern-api
docker rm -f mern-api                            # force remove running
docker container prune                           # remove stopped containers
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## Volume Commands

```bash
docker volume create mongo-data
docker volume ls
docker volume inspect mongo-data
docker volume rm mongo-data
docker volume prune

# Run with named volume
docker run -d \
  --name mongo \
  -v mongo-data:/data/db \
  -p 27017:27017 \
  mongo:7

# Bind mount (dev)
docker run -d \
  -v $(pwd)/server:/app \
  -v /app/node_modules \
  mern-api:1.0
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## Network Commands

```bash
docker network ls
docker network create mern-net
docker network inspect bridge
docker network connect mern-net mern-api
docker network disconnect mern-net mern-api
docker network rm mern-net
docker network prune

# Run on custom network
docker run -d --network mern-net --name api mern-api:1.0
docker run -d --network mern-net --name mongo mongo:7
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## Dockerfile & Build

```bash
# Build
docker build -t mern-api:1.0 .
docker build -t mern-api:1.0 -f Dockerfile.prod .
docker build --no-cache -t mern-api:1.0 .
docker build --target production -t mern-api:prod .

# Build args
docker build --build-arg NODE_VERSION=20 -t mern-api .

# BuildKit (faster builds)
DOCKER_BUILDKIT=1 docker build -t mern-api:1.0 .
```

### Sample Dockerfile commands reference

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
USER node
HEALTHCHECK CMD wget -qO- http://localhost:5000/api/health || exit 1
CMD ["node", "index.js"]
```

---


<p><a href="#i5">Back to index</a></p>

<a id="p6"></a>

## Docker Compose

```bash
# Start / stop
docker compose up                          # foreground, all services
docker compose up -d                       # detached
docker compose up -d --build               # rebuild images first
docker compose up -d --scale api=3         # scale service (Swarm-like)

docker compose down                        # stop + remove containers
docker compose down -v                     # also remove volumes ⚠️
docker compose down --rmi local            # remove built images

# Status / logs
docker compose ps
docker compose logs
docker compose logs -f api                   # follow api logs
docker compose logs --tail=50 mongo

# Execute commands
docker compose exec api sh
docker compose exec mongo mongosh

# Config / validate
docker compose config                      # resolved YAML
docker compose pull                        # pull images
docker compose build api                   # build one service
docker compose restart api
```

### Sample docker-compose.yml

```yaml
services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://mongo:27017/mern
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

---


<p><a href="#i6">Back to index</a></p>

<a id="p7"></a>

## Logs & Debugging

```bash
# Logs
docker logs mern-api
docker logs -f mern-api                    # follow
docker logs --tail 100 mern-api
docker logs --since 30m mern-api

# Shell inside container
docker exec -it mern-api sh
docker exec -it mern-api node -v
docker exec mern-api ls -la /app

# Copy files
docker cp mern-api:/app/logs/error.log ./error.log
docker cp ./config.json mern-api:/app/config.json

# Resource usage
docker stats
docker stats mern-api --no-stream

# Events
docker events
```

---


<p><a href="#i7">Back to index</a></p>

<a id="p8"></a>

## Cleanup Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Nuclear — remove everything unused
docker system prune
docker system prune -a --volumes          # ⚠️ very destructive

# Disk usage
docker system df
```

---


<p><a href="#i8">Back to index</a></p>

<a id="p9"></a>

## Registry Commands

```bash
# Docker Hub
docker login
docker logout
docker push rahmat058/mern-api:1.0
docker pull rahmat058/mern-api:1.0
docker search nginx

# AWS ECR example
aws ecr get-login-password | docker login --username AWS --password-stdin 123456.dkr.ecr.region.amazonaws.com
docker tag mern-api:1.0 123456.dkr.ecr.region.amazonaws.com/mern-api:1.0
docker push 123456.dkr.ecr.region.amazonaws.com/mern-api:1.0
```

---


<p><a href="#i9">Back to index</a></p>

<a id="p10"></a>

## MERN Quick Start with Docker

```bash
# 1. Project structure
# mern-app/
#   docker-compose.yml
#   server/Dockerfile
#   client/Dockerfile

# 2. Build and run full stack
cd mern-app
docker compose up -d --build

# 3. Verify
docker compose ps
curl http://localhost:5000/api/health
open http://localhost:3000

# 4. View logs
docker compose logs -f api

# 5. Shell into API
docker compose exec api sh

# 6. Stop (keep DB data)
docker compose down

# 7. Stop and wipe DB
docker compose down -v
```

### One-liner MERN MongoDB (dev)

```bash
docker run -d \
  --name mern-mongo \
  -p 27017:27017 \
  -v mern-mongo-data:/data/db \
  mongo:7
```

### One-liner MERN API

```bash
docker build -t mern-api:1.0 ./server
docker run -d \
  --name mern-api \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/mern \
  mern-api:1.0
```

---

## Interview Quick Recall

| Task               | Command                                |
| ------------------ | -------------------------------------- |
| Build image        | `docker build -t name:tag .`           |
| Run container      | `docker run -d -p host:container name` |
| List running       | `docker ps`                            |
| View logs          | `docker logs -f container`             |
| Shell in container | `docker exec -it container sh`         |
| Start stack        | `docker compose up -d`                 |
| Stop stack         | `docker compose down`                  |
| Push image         | `docker push user/image:tag`           |
| Clean up           | `docker system prune`                  |

---

**Back to:** [Docker README](./README.md)


<p><a href="#i10">Back to index</a></p>