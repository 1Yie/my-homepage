FROM oven/bun:latest
WORKDIR /app

COPY package.json ./
COPY server/package.json ./server/
COPY web/package.json ./web/

ENV HUSKY=0
RUN bun install --ignore-scripts

COPY . .

WORKDIR /app/server
RUN bunx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "bunx prisma db push && bun run src/index.ts"]