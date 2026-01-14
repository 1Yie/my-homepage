# ---------- base ----------
FROM oven/bun:1 AS base
WORKDIR /app
ENV HUSKY=0

# 【关键修复】在这里安装构建工具，因为 bun install 需要它们
RUN apt-get update && \
    apt-get install -y build-essential python3 git && \
    rm -rf /var/lib/apt/lists/*

# ---------- install deps ----------
FROM base AS install
# 复制 lockfile 和所有 package.json
COPY package.json bun.lock ./
COPY server/package.json server/package.json
COPY web/package.json web/package.json

# 现在 bun install 拥有了 git 和编译环境，不会再报错了
RUN bun install --frozen-lockfile

# ---------- build ----------
FROM install AS build
COPY . .
WORKDIR /app/server

# Prisma 生成
ENV DATABASE_URL="file:/app/server/data/sqlite.db"
RUN bunx prisma generate

# ---------- runtime ----------
# 运行时可以使用 slim 镜像来减小体积
FROM oven/bun:1-slim AS runner
WORKDIR /app/server

# 运行时可能仍需要基本的库支持（如果 Prisma 或原生模块需要）
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 从 build 阶段拷贝整个 app（包含生成的 Prisma client 和 node_modules）
COPY --from=build /app /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/server/data/sqlite.db"

# 确保 SQLite 数据库所在的文件夹存在并有写权限
RUN mkdir -p /app/server/data

EXPOSE 3000
CMD ["bun", "src/index.ts"]