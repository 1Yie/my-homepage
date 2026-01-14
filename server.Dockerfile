FROM oven/bun:latest AS builder
WORKDIR /app

ENV HUSKY=0

COPY package.json ./
COPY server/package.json ./server/
COPY web/package.json ./web/

COPY bun.lockb* ./ 

RUN bun install --ignore-scripts

COPY . .

WORKDIR /app/server
ENV DATABASE_URL="file:./data.db"
RUN bunx prisma generate

FROM oven/bun:slim AS runner

WORKDIR /app/server

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/server ./

ENV NODE_ENV=production
ENV HUSKY=0

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma db push && bun run src/index.ts"]