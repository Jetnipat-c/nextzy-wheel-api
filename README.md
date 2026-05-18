# Nextzy Wheel API

Backend for the Nextzy point-collection game — a spin-the-wheel gamification app where players accumulate points, unlock reward checkpoints, and compete on a global leaderboard.

## Tech Stack

- **Runtime**: Node.js 22, TypeScript
- **Framework**: NestJS 11
- **Database**: PostgreSQL via Prisma 7
- **Deploy**: Google Cloud Run + Cloud SQL
- **CI/CD**: GitHub Actions

---

## Architecture

Clean Architecture with strict dependency rules:

```
src/
├── domain/           # Pure business logic — no framework or DB imports
│   ├── entities/     # Player, SpinResult, RewardClaim
│   ├── repositories/ # Interfaces only (PlayerRepository, SpinResultRepository, ...)
│   └── constants/    # WHEEL_SEGMENTS, reward checkpoints
├── application/
│   └── use-cases/    # One file per use case, one execute() method
│       ├── player/   # get-or-create-player
│       ├── spin/     # spin-wheel
│       ├── reward/   # claim-reward
│       └── import/   # import-csv
├── infrastructure/
│   ├── config/       # configuration.ts
│   ├── database/     # PrismaService, schema.prisma, migrations
│   └── repositories/ # Prisma implementations of domain interfaces
└── presentation/
    ├── player/       # PlayerController
    ├── spin/         # SpinController
    ├── reward/       # RewardController
    └── import/       # ImportController
```

**Dependency rule**: `presentation` → `application` → `domain` ← `infrastructure`

### Database Schema

| Table | Description |
|---|---|
| `players` | Player profile with cumulative `total_points` (max 10,000) |
| `spin_results` | Each spin record with `points_earned` and timestamp |
| `reward_claims` | Claimed reward checkpoints per player (unique per player+points) |

---

## Features

### Player
- `POST /api/v1/players/login` — Get or create a player by username (case-insensitive match)

### Spin
- `POST /api/v1/players/:playerId/spins` — Record a spin result sent from the frontend (`300`, `500`, `1000`, `3000`)
- `GET /api/v1/players/:playerId/spins` — Get spin history for a player
- `GET /api/v1/spins` — Get global spin history (all players)

### Reward
- `POST /api/v1/players/:playerId/rewards` — Claim a reward checkpoint (`500`, `1000`, `10000`)
- `GET /api/v1/players/:playerId/rewards` — Get claimed rewards for a player

### Import
- `POST /api/v1/import/csv` — Bulk import spin history from CSV file (multipart/form-data, field: `file`)
- `POST /api/v1/import/recalculate-points` — Recalculate `total_points` for all players from spin history

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL database

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
PORT=3000
NODE_ENV=development
```

### Database Setup

```bash
# Apply migrations
pnpm prisma migrate dev

# Regenerate Prisma client after schema changes
pnpm prisma generate
```

### Running

```bash
# Development (watch mode)
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod
```

### Testing

```bash
pnpm run test           # unit tests
pnpm run test:cov       # with coverage
pnpm run test:e2e       # end-to-end tests
```

---

## CSV Import Format

The CSV file must have the following columns:

```
nickname,point,datetime
playerA,300,2024-01-01T10:00:00Z
playerB,1000,2024-01-02T12:00:00Z
```

- `nickname` — player username (case-insensitive, matched against existing players)
- `point` — must be one of `300`, `500`, `1000`, `3000`
- `datetime` — ISO 8601 format (optional, defaults to import time)

Rows with invalid points or missing nickname are skipped. Import is processed in batches of 1,000 rows.

---

## Deployment

Deployed to **Google Cloud Run** with automated CI/CD via GitHub Actions on push to `main`.

Pipeline steps:
1. Install dependencies
2. Connect to Cloud SQL via Auth Proxy
3. Run Prisma migrations
4. Build and push Docker image to Artifact Registry
5. Deploy to Cloud Run

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `GCP_PROJECT_ID` | Google Cloud project ID |
| `GCP_SA_KEY` | Service account JSON key |
| `CLOUD_SQL_INSTANCE` | Cloud SQL instance name |
| `MIGRATION_DATABASE_URL` | PostgreSQL URL for running migrations |

### Required GCP Secrets (Secret Manager)

| Secret | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL for production |
