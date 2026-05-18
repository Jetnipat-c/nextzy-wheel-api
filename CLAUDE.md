# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Development (watch mode)
pnpm run start:dev

# Build
pnpm run build

# Production
pnpm run start:prod

# Lint (auto-fix)
pnpm run lint

# Format
pnpm run format

# Tests
pnpm run test                                          # unit tests
pnpm run test:watch                                    # watch mode
pnpm run test:cov                                      # with coverage
pnpm run test:e2e                                      # end-to-end tests
pnpm run test -- --testPathPattern=<filename>          # single test file

# Prisma
pnpm prisma migrate dev     # create and apply migration
pnpm prisma generate        # regenerate client after schema changes
```

## Architecture

Clean Architecture with NestJS (v11), TypeScript, Prisma (v7), pnpm.

### Layer Structure

```
src/
├── domain/           # Pure TypeScript — no NestJS/Prisma imports
│   ├── entities/
│   └── repositories/ # interfaces only
├── application/
│   └── use-cases/    # one file per use case, one execute() method
├── infrastructure/
│   ├── config/       # configuration.ts (app.nodeEnv, app.port)
│   ├── database/
│   │   └── prisma/   # schema.prisma, PrismaService, PrismaModule
│   └── repositories/ # implements domain repository interfaces
├── presentation/
│   ├── controllers/
│   └── dtos/
└── generated/
    └── prisma/       # auto-generated, do not edit manually
```

**Dependency rule**: `presentation` → `application` → `domain` ← `infrastructure`

### Module Wiring

- `AppModule` imports only `InfrastructureModule`
- `InfrastructureModule` imports `ConfigModule` (isGlobal) and `PrismaModule` (@Global)
- Feature modules import use cases as providers, inject repository interfaces via token

### Path Aliases

Configured in `tsconfig.json` and `package.json` (jest `moduleNameMapper`):

| Alias | Path |
|---|---|
| `@domain/*` | `src/domain/*` |
| `@application/*` | `src/application/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@presentation/*` | `src/presentation/*` |

### Prisma

- Schema: `src/infrastructure/database/prisma/schema.prisma`
- Config: `prisma.config.ts` (root) — points schema and migrations path
- Generated client output: `src/generated/prisma` (CJS format for NestJS)
- Models: `Player`, `SpinResult`, `RewardClaim` with snake_case DB column mapping

