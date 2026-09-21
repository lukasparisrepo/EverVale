# 09 — Online / Offline Simulation

## Principle

`logout != pause`

The world persists independently from the browser session.

## World states

### ACTIVE
At least one connected owner/co-builder. Fine simulation and realtime replication.

### WARM
Recently disconnected. Reduced cadence.

### COLD
No connected player. Event-driven/coarse catch-up.

These are compute modes, not different gameplay rules.

## Time

Persistent progression uses authoritative server UTC.

Reference speeds while a single owner is online:
- 0x Pause
- 1x
- 2x
- 4x

On final disconnect:
- world returns to **1x**
- offline simulation continues

A paused browser session can never freeze the world permanently by logging out.

## Visual day/night

Visual day length is independent from balance units.

Initial target:
- 24 real minutes per visual day at 1x

Economic values remain defined per real-time rate and therefore do not depend on how many cosmetic “days” pass.

## Exclusive simulation lease

**P0 invariant:** only one process may advance a world revision.

Before simulation, ACTIVE rooms and background workers must acquire a database-backed world lease / transactional lock.

A worker must never catch up a world currently owned by a valid ACTIVE simulation lease.

This prevents:
- double Money
- double Varum
- duplicated population Growth
- duplicate threats

## Catch-up

On reconnect:
1. acquire exclusive simulation lease
2. load snapshot
3. read last_simulated_at
4. calculate elapsed authoritative time
5. advance economy in coarse intervals
6. resolve seeded events/threats
7. persist one new authoritative revision
8. send snapshot + history
9. transfer lease to ACTIVE room if needed

## Aggregation

Do not replay every render/simulation tick.

Stable systems can be integrated:
- Money
- Power
- Water
- Varum
- Tech
- construction progress
- Growth

Threat/combat uses discrete seeded events.

## Storage caps

Offline production respects:
- Treasury capacity
- Power storage
- Water storage
- Varum storage

This prevents infinite accumulation after very long absence.

## Fairness

Offline threat outcomes use the same combat stats but bounded damage rules.

Return timeline explains:
- population changes
- Tech unlocks
- construction completion
- utility shortages
- attacks
- damage
- repair
