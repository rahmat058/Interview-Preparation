# syntax=docker/dockerfile:1
# Express API — production Node image

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

RUN addgroup --system --gid 1001 api \
  && adduser --system --uid 1001 api \
  && chown -R api:api /app

USER api

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

CMD ["npm", "start"]
