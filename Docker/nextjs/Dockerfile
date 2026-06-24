# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for Next.js (App Router)
# Requires next.config: { output: 'standalone' }
# Build from repo root: docker build -f Docker/nextjs/Dockerfile --build-arg APP_PATH=path/to/next-app .

ARG APP_PATH=.

FROM node:24-alpine AS deps

ARG APP_PATH
WORKDIR /app
COPY ${APP_PATH}/package*.json ./
RUN npm ci

FROM node:24-alpine AS builder

ARG APP_PATH
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ${APP_PATH}/ ./

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
