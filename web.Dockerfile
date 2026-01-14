FROM oven/bun:latest AS builder
WORKDIR /app

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package.json ./
COPY web/package.json ./web/
COPY server/package.json ./server/

ENV HUSKY=0
RUN bun install --ignore-scripts

COPY . .
WORKDIR /app/web
RUN bunx vite build

FROM nginx:alpine
COPY --from=builder /app/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80