# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for Vite + Vue (SPA)
# Build from repo root: docker build -f Docker/vuejs/Dockerfile --build-arg APP_PATH=path/to/vue-app .

ARG APP_PATH=Projects/01-autocomplete-search

FROM node:24-alpine AS builder

ARG APP_PATH
WORKDIR /app

COPY ${APP_PATH}/package*.json ./
RUN npm ci

COPY ${APP_PATH}/ ./

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY Docker/vuejs/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
