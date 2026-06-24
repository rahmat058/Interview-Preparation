# syntax=docker/dockerfile:1
# Production Node.js / Express API
# Default: Docker/nodejs/app
# Custom:  docker build -f Docker/nodejs/Dockerfile --build-arg APP_PATH=path/to/api .

ARG APP_PATH=Docker/nodejs/app

FROM node:24-alpine AS production

ARG APP_PATH

WORKDIR /app

ENV NODE_ENV=production

COPY ${APP_PATH}/package*.json ./
RUN npm install --omit=dev

COPY ${APP_PATH}/src ./src

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nodejs \
  && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

ENV PORT=5000

CMD ["npm", "start"]
