# Vue (Vite) — Docker Setup

Multi-stage build: **Node 24** compiles the app → **Nginx** serves the `dist/` folder.

Works with any **Vite + Vue 3** project (`npm run build` → `dist/`).

## Quick Start

```bash
cd Docker/vuejs

# Set APP_PATH to your Vue project (relative to repo root)
APP_PATH=path/to/my-vue-app docker compose up --build -d

open http://localhost:3001
```

## Essential Commands

| Command | Description |
| ------- | ----------- |
| `docker compose up --build -d` | Build and start in background |
| `docker compose down` | Stop and remove containers |
| `docker compose logs -f vue-app` | Follow logs |
| `docker compose ps` | Service status |
| `docker compose restart vue-app` | Restart service |
| `docker compose build --no-cache` | Force clean rebuild |

## Manual Docker Build (from repo root)

```bash
docker build \
  -f Docker/vuejs/Dockerfile \
  -t my-vue-app:latest \
  --build-arg APP_PATH=path/to/vue-app \
  --build-arg VITE_API_BASE_URL=http://localhost:5000 \
  .

docker run -d -p 3001:80 --name vue-app my-vue-app:latest
```
