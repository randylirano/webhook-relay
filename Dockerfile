FROM node:24-alpine AS base
COPY --from=oven/bun:1.4-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app

FROM base AS build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM base AS runtime
ENV NODE_ENV=production
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
COPY src/migrations ./src/migrations
EXPOSE 3000
CMD ["sh", "-c", "bun run migrate && node dist/main.js"]
