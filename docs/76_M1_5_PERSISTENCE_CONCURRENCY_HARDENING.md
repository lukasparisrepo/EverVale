# 76 — M1.5 Persistence & Concurrency Hardening

Status: **IMPLEMENTED / CI-GATED**

Date: 2026-09-21

## Scope

This milestone hardens the authoritative runtime and persistence path only.

It does not change visuals, balance, combat tuning, or UI presentation.

## 1. Accepted-command idempotency

Every mutating command already carries:

- commandId
- expectedRevision
- type
- payload

M1.5 now persists an accepted-command receipt.

A receipt includes:

- commandId
- ownerId
- worldId
- expectedRevision
- commandType
- deterministic fingerprint
- accepted WorldState result

### Retry rule

If the exact same commandId + fingerprint is received again:

- do not apply the command again
- do not spend resources again
- do not create a second entity
- return the original accepted result

### Command ID reuse rule

If the same commandId is reused with a different owner/type/revision/payload fingerprint:

`COMMAND_ID_CONFLICT`

HTTP status:

`409 Conflict`

## 2. Fingerprint

The application creates a stable JSON fingerprint from:

- ownerId
- expectedRevision
- command type
- payload

Object keys are sorted deterministically.

This prevents accidental commandId reuse from silently replaying an unrelated result.

## 3. Postgres transaction

For accepted commands, one transaction contains:

1. revision CAS update
2. snapshot write
3. significant event persistence
4. snapshot pruning
5. accepted command receipt
6. commit

If revision CAS fails, the transaction rolls back.

If the failure was caused by the same command winning on another process, WorldService re-reads the accepted receipt and returns that result.

## 4. Single-process owner serialization

Current server process serializes operations per owner.

This prevents the JSON development store from suffering a read-check-write race when two HTTP requests arrive together.

Rules:

- different owners may execute independently
- same owner operations execute in order
- two distinct commands with the same expected revision cannot both commit
- concurrent first-load requests create only one world in one process

Postgres revision CAS remains the cross-process authority.

## 5. One owned world per owner — M1 API invariant

Current M1 API has:

`findByOwner(ownerId)`

and no world picker.

Therefore the current persistence contract is:

**one owned world per user**

Migration:

`db/migrations/0002_owner_single_world.sql`

adds a partial unique index on OWNER membership user_id.

If two server instances race first creation:

- one transaction wins
- the losing transaction raises WORLD_OWNER_EXISTS
- application reloads the committed winner
- the losing candidate transaction rolls back

This invariant should only be removed when explicit multi-world UX/API exists.

## 6. JSON development persistence

JSON store now:

- atomically replaces files through temp + rename
- persists command receipts under a separate command directory
- restores receipts across repository restart
- rejects duplicate owned worlds

JSON remains development persistence, not the production concurrency authority.

## 7. Significant event table

Postgres now mirrors significant WorldState events into:

`world_events`

Insertion is idempotent by event ID.

The snapshot still contains the bounded player-facing recent event history.

The table exists for:

- timeline queries
- diagnostics
- after-action reporting
- future analytics/operations

## 8. Snapshot retention

Postgres retains the latest:

**50 snapshots per world**

Older snapshots are pruned transactionally after a new snapshot is inserted.

Event history remains independently available in world_events.

Accepted command receipts remain independent from snapshot retention.

## 9. Runtime command envelope validation

HTTP server rejects:

- invalid command UUID
- invalid expectedRevision

before persistence.

This avoids Postgres UUID-cast failures surfacing as internal server errors.

## 10. Migration runner

Fresh Docker volumes still use:

`db/migrations/*`

through Postgres init.

Existing databases must use:

`pnpm db:migrate`

Runner guarantees:

- Postgres advisory lock
- ordered migration filenames
- SHA-256 checksum tracking
- checksum mismatch rejection
- one transaction per migration + schema_migrations record
- safe reruns

Server startup does not auto-migrate.

## 11. Automated proof

Application tests:

- accepted command retry applies once
- commandId reuse with changed payload is rejected
- revision race can recover the winning receipt
- two stale concurrent commands cannot both commit
- concurrent first-load in one process creates one world
- cross-process-style WORLD_OWNER_EXISTS reloads the winner

Persistence tests:

- JSON accepted receipt survives repository restart
- migration wrapper/checksum helpers are deterministic

Browser/API test:

`tests/e2e/m1-idempotency.spec.ts`

proves through the real HTTP server + JSON persistence:

- first command accepted
- exact retry returns same revision
- persisted revision increases only once
- changed payload with same ID returns 409
- malformed command ID returns 400

## 12. Lease decision

The database already contains `world_leases`.

M1 does **not** yet run:

- a background simulation worker
- a second authoritative realtime room process
- pg-boss world advancement

Current mutation safety comes from:

- per-owner single-process serialization
- Postgres revision CAS
- command idempotency

The exclusive lease becomes mandatory **before introducing any second process that independently advances world time**.

Do not add a cosmetic/no-op lease implementation merely to satisfy the existence of the table.

## Decision

**M1.5 PERSISTENCE / CONCURRENCY HARDENING: IMPLEMENTED**
