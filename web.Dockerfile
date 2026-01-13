# --- 阶段 1: 构建阶段 ---
FROM oven/bun:latest AS builder
WORKDIR /app

# 复制 package 相关文件
COPY package.json ./
COPY web/package.json ./web/
COPY server/package.json ./server/

# 关键修复：通过环境变量禁用 Husky
ENV HUSKY=0
RUN bun install --ignore-scripts

# 复制所有源码并构建前端
COPY . .
WORKDIR /app/web
RUN bunx vite build

# --- 阶段 2: 运行阶段 ---
FROM nginx:alpine
COPY --from=builder /app/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80