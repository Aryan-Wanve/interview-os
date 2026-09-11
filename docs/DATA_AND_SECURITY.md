# Data and Security

## Data model

`Judge`, `InterviewEvent`, `Candidate`, `Panel`, `PanelMember`, `JudgeInvite`, `ScoreSubmission`, `CriterionScore`, `JudgeNote`, and `AuditLog` are represented in Prisma. A score submission is unique on `(candidateId, judgeId)` and carries its individual criterion rows and optional note. Events own versioned criterion configuration JSON.

## Permissions

Admins manage directory records, events, panels, locks, invites, exports, and results. A judge invite can only read its event candidates and its own submission state; it cannot enumerate peer scores or write outside the active panel/event.

## Link security and duplicates

Invite tokens are 32 random bytes URL-safe encoded. A SHA-256 hash is used for lookup and the token is encrypted at rest solely so an admin can re-open/copy a previously generated link; access validation always uses the hash plus active/non-expired status. A database unique index and transaction-backed upsert prevent duplicate live submissions; updates replace only the caller's own response until a candidate/event lock applies.

## Audit requirements

Audit records capture actor, action, entity, metadata, and timestamp for panel changes, scoring creates/edits, candidate locks, event locks, and exports. Production retention and actor identity should follow organizational policy.

## Workbook schema

All exports include headers. `Judges`: identity/contact/status. `Candidates`: event/candidate/reference/status. `Panels`: event/panel/judge rows. `Raw Scores`: event/candidate/judge/submission time/note plus one column per criterion. `Final Results`: event/candidate, per-criterion averages, weighted overall average, high/low overall, rank, completion count, and exported timestamp.
