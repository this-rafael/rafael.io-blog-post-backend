# ── Stage 1: build admin panel ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ && \
    npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .
RUN pnpm run build

# ── Stage 2: production runner ─────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache python3 make g++ && \
    npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY --from=builder /app/dist ./dist
COPY tsconfig.json ./
COPY config ./config
COPY src ./src
COPY database ./database
COPY public ./public
COPY scripts ./scripts

RUN mkdir -p /data/uploads

COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 1337

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
CMD ["pnpm", "start"]
