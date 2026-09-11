# Architecture

## Monorepo

`apps/web` is the Next.js App Router application. `packages/scoring` owns pure, tested calculation and validation functions; `packages/config` holds shared TypeScript configuration. Turborepo coordinates lint, test, typecheck, and build tasks.

## Application layers

Routes render the admin and invite interfaces. Route handlers perform authentication/token authorization and call Prisma. Prisma persists operational data in SQLite. The scoring package calculates derived result views. The Excel adapter serializes those views into an `.xlsx` download.

## Submission to export flow

1. A judge link is resolved to an active, unexpired invite.
2. The server validates the selected candidate belongs to the invite event and the criterion values fit the configured scale.
3. The submission is upserted for that judge/candidate; its scores and note are atomically replaced.
4. The audit log records creation or update.
5. Admin result queries calculate per-criterion averages, weighted overall average, completion, and deterministic rank.
6. Export records an audit event and renders the five worksheet report.

## Why database first

Excel workbooks are poor concurrent transactional stores: simultaneous judges can overwrite one another, cannot enforce relational constraints reliably, and are difficult to audit. SQLite stores canonical rows and constraints; Excel is a reproducible reporting integration.

## Authentication and security

Admin pages use a signed development cookie. Judge links use cryptographically random, hashed-at-rest tokens with expiry/revocation checks. Judge requests are scoped to the invite's panel/event and never return another judge's submissions. Production should replace the mock admin gate with an OIDC provider, secure cookies, CSRF policy, rate limits, and managed database.
