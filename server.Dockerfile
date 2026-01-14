FROM oven/bun:1 AS base
WORKDIR /app
ENV HUSKY=0

RUN apt-get update && \
    apt-get install -y build-essential python3 git && \
    rm -rf /var/lib/apt/lists/*

FROM base AS install
COPY package.json bun.lock ./
COPY server/package.json server/package.json
COPY web/package.json web/package.json

RUN bun install --frozen-lockfile

FROM install AS build
COPY . .
WORKDIR /app/server

ENV DATABASE_URL="file:/app/server/data/sqlite.db"
RUN bunx prisma generate


FROM oven/bun:1-slim AS runner
WORKDIR /app/server

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/server/data/sqlite.db"

RUN mkdir -p /app/server/data

EXPOSE 3000
CMD ["bun", "src/index.ts"]