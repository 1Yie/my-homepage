FROM oven/bun:latest
WORKDIR /app

COPY package.json ./
COPY server/package.json ./server/
COPY web/package.json ./web/

# 同样禁用 Husky 和安装后脚本
ENV HUSKY=0
RUN bun install --ignore-scripts

COPY . .

WORKDIR /app/server
RUN bunx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "bunx prisma db push && bun run src/index.ts"]