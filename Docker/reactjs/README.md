# React (Vite) — Docker Setup

Multi-stage build: **Node 24** compiles the app → **Nginx** serves the `dist/` folder.

## Quick Start

```bash
cd Docker/reactjs

# Build & run (uses Projects/01-autocomplete-search by default)
docker compose up --build -d

open http://localhost:3000
```

## Essential Commands

| Command | Description |
| ------- | ----------- |
| `docker compose up --build -d` | Build image and start in background |
| `docker compose up --build` | Build and run with live logs |
| `docker compose down` | Stop and remove containers |
| `docker compose down -v` | Stop and remove volumes |
| `docker compose ps` | List running services |
| `docker compose logs -f react-app` | Follow container logs |
| `docker compose restart react-app` | Restart the service |
| `docker compose build --no-cache` | Force clean rebuild |

## Build a Different React App

```bash
# APP_PATH is relative to repository root
APP_PATH=Projects/02-infinite-scroll-feed docker compose up --build -d

# Custom port + API URL
REACT_PORT=3001 VITE_API_BASE_URL=https://api.example.com docker compose up --build -d
```

## Manual Docker Build (from repo root)

```bash
docker build \
  -f Docker/reactjs/Dockerfile \
  -t my-react-app:latest \
  --build-arg APP_PATH=Projects/01-autocomplete-search \
  --build-arg VITE_API_BASE_URL=http://localhost:5000 \
  .

docker run -d -p 3000:80 --name react-app my-react-app:latest
```

## Files

| File | Purpose |
| ---- | ------- |
| `Dockerfile` | Multi-stage build (Node → Nginx) |
| `docker-compose.yml` | One-service compose with env overrides |
| `nginx.conf` | SPA routing + gzip + asset caching |
| `.dockerignore` | Exclude node_modules, dist, etc. |
