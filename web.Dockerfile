FROM oven/bun:1 AS builder
WORKDIR /app
ENV HUSKY=0

# 【关键修复】安装 web 构建时可能需要的 git 和编译工具
RUN apt-get update && \
    apt-get install -y build-essential python3 git && \
    rm -rf /var/lib/apt/lists/*

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package.json bun.lock ./
COPY web/package.json web/package.json
COPY server/package.json server/package.json

RUN bun install --frozen-lockfile

COPY . .
WORKDIR /app/web

RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
