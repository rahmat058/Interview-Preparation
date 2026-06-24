# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for Nuxt 3 (SSR)
# Build from repo root: docker build -f Docker/nuxtjs/Dockerfile --build-arg APP_PATH=path/to/nuxt-app .

ARG APP_PATH=.

FROM node:24-alpine AS builder

ARG APP_PATH
WORKDIR /app

COPY ${APP_PATH}/package*.json ./
RUN npm ci

COPY ${APP_PATH}/ ./

ARG NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL}
ENV NUXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nuxt \
  && adduser --system --uid 1001 nuxt

COPY --from=builder --chown=nuxt:nuxt /app/.output ./.output

USER nuxt

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
