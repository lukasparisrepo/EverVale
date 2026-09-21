# 64 — Persistence & Database Contract

Status: **CANONICAL M0 DATABASE BASELINE**

PostgreSQL is authoritative persistence. Auth-provider tables are owned by the auth adapter; EverVale domain tables do not duplicate password/session implementation.

## Core tables
- worlds
- world_memberships
- world_snapshots
- world_events
- world_commands
- world_leases

## Lease rule
Only a valid world lease may advance simulation. Lease acquisition/renewal is transactional.

## Catch-up transaction
1. acquire lease
2. lock/read world row
3. load latest snapshot
4. verify revision
5. advance from last_simulated_at
6. append significant events
7. write snapshot/revision
8. update last_simulated_at
9. commit
10. renew/transfer lease for ACTIVE room

Failure rolls back. Command/job retry must be idempotent. No partial Money/Varum/Threat gain.

## Snapshot baseline
- clean disconnect
- after major combat
- every 5 real minutes while ACTIVE
- after catch-up

Concrete migration: db/migrations/0001_world_core.sql

## M1.5 runtime status

Implemented runtime hardening:

- accepted-command idempotency
- deterministic command fingerprinting
- per-owner single-process serialization
- Postgres revision CAS race recovery
- one-owned-world-per-user M1 invariant
- JSON receipt persistence
- significant event persistence
- latest-50 snapshot retention
- explicit checksum-verified migration runner

Migration command:

`pnpm db:migrate`

Lease note:

`world_leases` remains the canonical requirement before any second process/background worker independently advances world time. Current M1 has only one authoritative advancement process, so a no-op lease implementation is intentionally not added.

See:
`docs/76_M1_5_PERSISTENCE_CONCURRENCY_HARDENING.md`
