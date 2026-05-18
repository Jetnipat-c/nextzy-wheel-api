# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm run build

# ── Stage 2: Production ─────────────────────────────────────────
FROM node:22-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/infrastructure/database/prisma ./src/infrastructure/database/prisma
COPY prisma.config.ts ./

ENV NODE_ENV=production
ENV PORT=8080
ENV NODE_PATH=/app

EXPOSE 8080

CMD ["node", "dist/main.js"]
