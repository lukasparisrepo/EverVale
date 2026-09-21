# 68 — M1 Browser Runtime Proof

Status: **PASS**

Date: 2026-09-21

## Automated browser scenario

Playwright now runs the real client and server together and verifies:

1. dev login
2. Three.js canvas starts
3. starter world loads
4. isolated building placement is rejected by server road-access rules
5. road graph is extended authoritatively
6. House placement succeeds next to connected road
7. browser reload reconstructs persisted world
8. logout stops client polling
9. re-login projects offline catch-up
10. speed changes to 4x
11. surprise M1 wave starts
12. warning transitions into active combat
13. battle resolves
14. result enters persistent world event history
15. combat aftermath damages a building
16. Repair command is accepted
17. repair state persists

## Runtime bugs found and fixed

### R1 — Read polling revision race

Problem:
GET /api/world used to catch up, persist, and increment revision every poll.

Effect:
HUD polling could race a player command and cause REVISION_CONFLICT.

Fix:
World reads are now projection-only:
- load persisted snapshot
- advance deterministically in memory to current time
- return projected view
- do not mutate persistence/revision

Commands:
- load persisted snapshot
- validate expected revision
- catch up in memory
- apply command
- persist one new revision

Regression test:
packages/application/src/world-service.test.ts

### R2 — Combat projection stuck after warning

Problem:
A large elapsed-time advance starting from WARNING only consumed warning time and changed state to ACTIVE. Remaining elapsed time was discarded.

Because read views are projection-only, every poll started again from persisted WARNING and combat never reached RESOLVED.

Fix:
Combat now consumes elapsed time across phases in one call:
WARNING -> ACTIVE -> RESOLVED

Active battle uses deterministic fixed 0.5-second combat stepping.

Regression test:
packages/domain/src/combat.test.ts

## CI result

Latest main commit:
- EverVale Preflight: PASS
- EverVale Engineering: PASS
- TypeScript: PASS
- Unit/application tests: PASS
- Vite build: PASS
- Chromium install: PASS
- M1 Playwright runtime proof: PASS

## Decision

M1 is no longer only a compile/build graybox.

The core persistent gameplay loop has now passed an automated real-browser runtime proof.

Next M1 work should focus on:
- actual player feel/readability
- performance measurements
- richer road/build placement feedback
- citizen schedule presentation quality
- first real terrain/blocker interaction

Do not expand to M2 content until these runtime-quality gates are measured.
