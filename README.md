# Interview Jury Scoring Hub

A mobile-first interview scoring platform for selecting a five-judge panel, collecting independent candidate evaluations, and exporting auditable results to Excel.

## Features

- Development admin sign-in and role-scoped admin dashboard
- A 15-judge directory, exact-five panel validation, candidates, criteria, locks, and invite links
- Token-scoped judge scoring screens with editable submissions while unlocked
- Weighted score calculations, completion progress, ranking, ties, and audit events
- Excel export with `Judges`, `Candidates`, `Panels`, `Raw Scores`, and `Final Results` sheets
- Seed data: one event, 15 judges, five active panel members, three candidates, and sample scores

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

Open `http://localhost:3000`. The development admin is available at `/admin/login` with the credentials in `.env` (defaults are deliberately development-only). The seeded judge links appear on the event detail page.

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
| `ADMIN_SESSION_SECRET` | Cookie signing secret (use a random value outside development) |
| `INVITE_TOKEN_TTL_DAYS` | Lifetime for judge links |

## Excel sync

Select **Export Excel** on an event. The server queries SQLite, calculates final results, writes a workbook in memory, and downloads it. The schema is documented in [DATA_AND_SECURITY.md](docs/DATA_AND_SECURITY.md). The adapter boundary in `lib/excel.ts` makes replacing the local download with OneDrive/SharePoint Graph uploads straightforward.

## Screenshots

Screenshots can be added here after deployment:

- Admin event dashboard
- Mobile judge scoring form
- Excel final-results sheet
