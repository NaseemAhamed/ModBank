# Build is performed once, inside Docker. Runtime contains only static assets.
FROM node:22-alpine AS builder
WORKDIR /workspace
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY angular.json tsconfig*.json ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/dist/modbank/browser/ /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
