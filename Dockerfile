# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN DATABASE_URL=postgresql://x:x@localhost/x npx prisma generate
RUN npm run build

# ── Stage 2: Production ─────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/infrastructure/database/prisma ./src/infrastructure/database/prisma
COPY --from=builder /app/package.json ./
COPY prisma.config.ts ./

ENV NODE_ENV=production
ENV PORT=8080
ENV NODE_PATH=/app

EXPOSE 8080

CMD ["node", "dist/src/main.js"]
