# Fullstack — Frontend + Backend Docker Setup

One **root `docker-compose.yml`** orchestrates:

| Service | Image | Port | Role |
| ------- | ----- | ---- | ---- |
| `backend` | Node 24 + Express | 5000 | REST API (`/api/health`, `/api/items`) |
| `frontend` | Nginx + React build | 8080 | SPA + `/api` reverse proxy to backend |

## Quick Start

```bash
cd Docker/fullstack

# Optional: copy env file
cp .env.example .env

# Build and start both services
docker compose up --build -d

# Verify
curl http://localhost:5000/api/health
curl http://localhost:8080/api/health   # proxied through Nginx
open http://localhost:8080
```

## Essential Commands

| Command | Description |
| ------- | ----------- |
| `docker compose up --build -d` | Build and start frontend + backend |
| `docker compose down` | Stop and remove containers |
| `docker compose down -v --rmi local` | Stop, remove containers and local images |
| `docker compose ps` | Show service status |
| `docker compose logs -f` | Follow all service logs |
| `docker compose logs -f backend` | Backend logs only |
| `docker compose logs -f frontend` | Frontend logs only |
| `docker compose restart backend` | Restart API service |
| `docker compose build --no-cache frontend` | Clean rebuild frontend |
| `docker compose exec backend sh` | Shell into backend container |

## Environment Variables

```bash
# Use a different React project as frontend
FRONTEND_APP_PATH=Projects/02-infinite-scroll-feed docker compose up --build -d

# Custom ports
BACKEND_PORT=5001 FRONTEND_PORT=8081 docker compose up --build -d
```

## Architecture

```
Browser → :8080 (Nginx frontend)
              ├── /        → React SPA (static dist)
              └── /api/*   → proxy → backend:5000 (Docker network)

Browser → :5000 (Express)  → direct API access (dev/debug)
```

## Folder Structure

```
fullstack/
├── docker-compose.yml      ← root orchestration
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile          ← Express API
│   ├── package.json
│   └── src/index.js
└── frontend/
    ├── Dockerfile          ← React build + Nginx + API proxy
    ├── nginx.conf
    └── .dockerignore
```

## Manual Docker Build (without Compose)

```bash
# From repository root
docker build -t fullstack-api:latest Docker/fullstack/backend

docker build \
  -f Docker/fullstack/frontend/Dockerfile \
  -t fullstack-web:latest \
  --build-arg FRONTEND_APP_PATH=Projects/01-autocomplete-search \
  --build-arg VITE_API_BASE_URL=/api \
  .

docker network create app-net

docker run -d --name api --network app-net -p 5000:5000 fullstack-api:latest

docker run -d --name web --network app-net -p 8080:80 fullstack-web:latest
```

## Interview Notes

- **`depends_on: condition: service_healthy`** — frontend waits until backend healthcheck passes.
- **`VITE_API_BASE_URL=/api`** — browser uses same-origin `/api`; Nginx proxies to `backend:5000`.
- **Separate Dockerfiles** per service; **one compose file** at root wires network + ports.
