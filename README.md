# Interview Jury Scoring Hub

A mobile-first interview scoring platform where judges reserve a scoring desk, form a five-person panel, assess contestants, and export auditable results to Excel.

## Features

- Password-free judge check-in with an eight-hour browser session lock
- A 16-judge mock directory and exact-five panel builder
- Contestant selection and editable scoring while the event and contestant remain unlocked
- A 100-point rubric imported from the shared marksheet: Dedication, Commitment, Team Spirit, Problem Solving, Communication, Attire, Attendance, Practical Task, Concepts, and Past Work
- Score totals, completion progress, ranking, ties, and audit events
- Excel export with `Judges`, `Candidates`, `Panels`, `Raw Scores`, and `Final Results` sheets
- Seed data: one active event, 16 mock judges, and 74 contestants from the supplied marksheet

## Architecture

This pnpm/Turborepo workspace contains one Next.js app and shared TypeScript packages. SQLite/Prisma is the operational source of truth; Excel is a generated reporting artifact. See [architecture](docs/ARCHITECTURE.md).

## Prerequisites

Node.js 20+, pnpm 9+, and a supported local build toolchain for Prisma/SQLite.

## Install and run

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm db:push
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000` and choose an available mock judge. The judge then selects five panel members and continues to the contestant scorecard. The session can be released from the panel screen, or it expires after eight hours.

The existing `/admin` screens remain available for event administration and Excel exports. They use the development-only credentials in `.env`.

## Tests and verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The test suite covers weighted calculations and panel validation. The manual end-to-end checklist is in [PROGRESS.md](docs/PROGRESS.md).

## Environment variables

Copy `apps/web/.env.example`; never commit `.env` or the SQLite database.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma SQLite connection URL |
| `ADMIN_EMAIL` | Development-only admin identity |
| `ADMIN_PASSWORD` | Development-only admin password |
| `ADMIN_SESSION_SECRET` | Cookie signing secret and token-encryption key (use a random value outside development) |
| `INVITE_TOKEN_TTL_DAYS` | Lifetime for judge links |

## Excel sync

Select **Export Excel** on an event. The server queries SQLite, calculates final results, writes a workbook in memory, and downloads it. The schema is documented in [DATA_AND_SECURITY.md](docs/DATA_AND_SECURITY.md). The adapter boundary in `lib/excel.ts` makes replacing the local download with OneDrive/SharePoint Graph uploads straightforward.

## Screenshots

Screenshots can be added here after deployment:

- Admin event dashboard
- Mobile judge scoring form
- Excel final-results sheet
