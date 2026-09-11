# Progress

## Documentation

- [x] README
- [x] Architecture, data/security, scoring rules, and roadmap

## Implementation

- [x] pnpm workspace/Turborepo scaffold
- [x] Prisma data model and seed scenario
- [x] Admin and mobile judge routes
- [x] Secure invite validation, score upsert, locks, and audit logging
- [x] Excel export

## Testing

- [x] Unit tests for calculations and exact-five validation
- [x] Manual end-to-end checklist documented below
- [ ] Run commands after dependencies are installed in this environment (registry DNS was unavailable during this build session)

## Manual submission-to-Excel checklist

1. Sign in at `/admin/login` and open the seeded event.
2. Copy a seeded judge invite URL and submit scores for a candidate on a narrow viewport.
3. Verify completion increases and the judge can update only that response.
4. Lock the candidate; verify further updates are rejected.
5. Export Excel and inspect the five expected worksheets, raw row, final-result row, and timestamp.

## Known limitations

SQLite and the development login are appropriate only for local/demo deployment. Admin CRUD is intentionally focused on the seeded event workflow; production needs full user management, CSRF/rate limiting, background export storage, and Microsoft Graph configuration.
