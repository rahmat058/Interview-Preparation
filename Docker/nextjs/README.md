# Next.js — Docker Setup

Multi-stage build using Next.js **`output: 'standalone'`** — smallest production Node image.

## Required `next.config`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

## Quick Start

```bash
cd Docker/nextjs

# Point to your Next.js app
APP_CONTEXT=../../path/to/my-next-app docker compose up --build -d

open http://localhost:3002
```

## Essential Commands

| Command | Description |
| ------- | ----------- |
| `docker compose up --build -d` | Build and start Next.js container |
| `docker compose down` | Stop and remove containers |
| `docker compose logs -f next-app` | Follow server logs |
| `docker compose ps` | Service status |
| `docker compose exec next-app sh` | Shell inside container (as nextjs user) |
| `docker compose build --no-cache` | Clean rebuild |

## Environment Variables

```bash
APP_CONTEXT=../../my-next-app \
NEXT_PORT=3002 \
NEXT_PUBLIC_API_URL=https://api.example.com \
docker compose up --build -d
```

## Manual Docker Build

```bash
docker build \
  -f Docker/nextjs/Dockerfile \
  -t my-next-app:latest \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:5000 \
  path/to/next-app

docker run -d -p 3002:3000 --name next-app my-next-app:latest
```

## Debug

```bash
docker compose logs --tail=100 next-app
docker inspect next-app --format='{{.State.Health.Status}}'
```

## Interview Notes

- **Standalone output** bundles only needed `node_modules` — much smaller than copying full project.
- Runs as non-root **`nextjs`** user (UID 1001).
- `NEXT_PUBLIC_*` vars must be set at **build time** (baked into client bundle).
