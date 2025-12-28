FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY tsconfig*.json vite.config.ts ./
COPY client ./client
COPY src ./src
COPY migrations ./migrations
COPY config ./config

RUN npm ci
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev
RUN apk del python3 make g++

COPY --from=builder /app/dist ./dist
COPY migrations ./migrations
COPY config ./config

EXPOSE 3000
CMD ["node", "dist/server/server.js"]
