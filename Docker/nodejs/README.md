# Node.js — Docker Setup

Production **Express API** template with a runnable sample app, health checks, and optional **MongoDB** profile for MERN-style interviews.

## Quick Start

```bash
cd Docker/nodejs

# API only (default sample app)
docker compose up --build -d

curl http://localhost:5000/api/health
curl http://localhost:5000/api/items
```

## Essential Commands

| Command | Description |
| ------- | ----------- |
| `docker compose up --build -d` | Build and start Node API |
| `docker compose down` | Stop and remove containers |
| `docker compose ps` | Service status |
| `docker compose logs -f node-api` | Follow API logs |
| `docker compose restart node-api` | Restart API |
| `docker compose exec node-api sh` | Shell inside container |
| `docker compose build --no-cache` | Force clean rebuild |

## With MongoDB (optional profile)

```bash
docker compose --profile with-db up --build -d

docker compose ps
# node-api + node-mongo running
```

Mongo runs on `localhost:27017`. Wire your app to `MONGO_URI=mongodb://mongo:27017/interview-prep` inside the compose network.

## Test API Endpoints

```bash
# Health
curl http://localhost:5000/api/health

# List items
curl http://localhost:5000/api/items

# Create item
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Redis Caching","tag":"backend"}'

# Delete item
curl -X DELETE http://localhost:5000/api/items/4
```

## Dockerize Your Own Node Project

```bash
# APP_PATH relative to repository root
APP_PATH=MERN/my-express-api docker compose up --build -d

# Custom port
NODE_PORT=5001 docker compose up --build -d
```

Your project must have:

```
my-api/
├── package.json      # "start": "node src/index.js"
└── src/
    └── index.js
```

## Manual Docker Build (from repo root)

```bash
docker build \
  -f Docker/nodejs/Dockerfile \
  -t my-node-api:latest \
  --build-arg APP_PATH=Docker/nodejs/app \
  .

docker run -d -p 5000:5000 --name node-api my-node-api:latest
```

## TypeScript Projects

Use `Dockerfile.typescript` (multi-stage: `npm run build` → `node dist/index.js`):

```bash
docker build \
  -f Docker/nodejs/Dockerfile.typescript \
  -t my-ts-api:latest \
  --build-arg APP_PATH=path/to/ts-api \
  .
```

## Files

| File | Purpose |
| ---- | ------- |
| `Dockerfile` | Production Node 24 Alpine image |
| `Dockerfile.typescript` | Multi-stage build for TS → `dist/` |
| `docker-compose.yml` | API + optional MongoDB profile |
| `app/` | Sample Express API (works out of the box) |
| `.env.example` | Port and path overrides |

## Interview Notes

- Runs as non-root **`nodejs`** user (UID 1001).
- **`npm install --omit=dev`** in production — no devDependencies in image.
- **Healthcheck** on `/api/health` — Compose can use `depends_on: condition: service_healthy`.
- **Alpine + wget** for health checks — lightweight base image (~50MB).
