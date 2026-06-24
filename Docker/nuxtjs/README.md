# Nuxt 3 — Docker Setup

Multi-stage build: compile with **`npm run build`** → run **`node .output/server/index.mjs`**.

## Quick Start

```bash
cd Docker/nuxtjs

APP_CONTEXT=../../path/to/my-nuxt-app docker compose up --build -d

open http://localhost:3003
```

## Essential Commands

| Command | Description |
| ------- | ----------- |
| `docker compose up --build -d` | Build and start Nuxt SSR container |
| `docker compose down` | Stop and remove containers |
| `docker compose logs -f nuxt-app` | Follow server logs |
| `docker compose ps` | Service status |
| `docker compose exec nuxt-app sh` | Shell inside container |
| `docker compose build --no-cache` | Clean rebuild |

## Environment Variables

```bash
APP_CONTEXT=../../my-nuxt-app \
NUXT_PORT=3003 \
NUXT_PUBLIC_API_URL=http://localhost:5000 \
docker compose up --build -d
```

## Manual Docker Build

```bash
docker build \
  -f Docker/nuxtjs/Dockerfile \
  -t my-nuxt-app:latest \
  --build-arg NUXT_PUBLIC_API_URL=http://localhost:5000 \
  path/to/nuxt-app

docker run -d -p 3003:3000 --name nuxt-app my-nuxt-app:latest
```

## Interview Notes

- Nuxt 3 outputs to **`.output/`** — not `.nuxt/` (that's dev cache).
- `NUXT_PUBLIC_*` vars are embedded at build time for client-side use.
- Runs as non-root **`nuxt`** user.
