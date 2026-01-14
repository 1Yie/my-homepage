FROM oven/bun:latest AS builder
WORKDIR /app

ENV HUSKY=0
COPY package.json bun.lockb* ./
COPY server/package.json ./server/
COPY web/package.json ./web/

RUN bun install --ignore-scripts

COPY . .


WORKDIR /app/server
ENV DATABASE_URL="file:/app/server/data/sqlite.db"
RUN bunx prisma generate

FROM oven/bun:slim AS runner
WORKDIR /app/server

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/server /app/server

ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/server/data/sqlite.db"

EXPOSE 3000

CMD ["bun", "src/index.ts"]