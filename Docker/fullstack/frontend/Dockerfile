# syntax=docker/dockerfile:1
# Fullstack frontend: Vite/React build + Nginx with /api reverse proxy
# Build from repo root

ARG FRONTEND_APP_PATH=Projects/01-autocomplete-search

FROM node:24-alpine AS builder

ARG FRONTEND_APP_PATH
WORKDIR /app

COPY ${FRONTEND_APP_PATH}/package*.json ./
RUN npm ci

COPY ${FRONTEND_APP_PATH}/ ./

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY Docker/fullstack/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
