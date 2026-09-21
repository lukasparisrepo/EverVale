# 09 — Online / Offline Simulation

## Principle

The world persists independently from the browser session.

## World states

### ACTIVE
At least one connected player. Fine simulation.

### WARM
Recently disconnected or background-active world. Reduced cadence.

### COLD
No player connected. Aggregated jobs and event-driven catch-up.

These are performance states, not gameplay pauses.

## Server time

All persistent progression uses authoritative UTC/server timestamps.

Never trust client clock for economic progression.

## Online ticks

Target initial simulation cadence:
- economy/social systems: 1–5 Hz
- threat/combat: higher only when needed
- rendering: client-side 30/60+ FPS

Render FPS and simulation TPS are independent.

## Offline catch-up

On disconnect:
1. persist snapshot
2. persist last_simulated_at
3. schedule coarse jobs where useful

On reconnect:
1. load snapshot
2. determine elapsed server time
3. process bounded coarse intervals
4. resolve generated events
5. persist new snapshot
6. send world state + timeline to client

## Aggregation

Do not replay hundreds of thousands of tiny ticks.

Aggregate stable systems analytically or in coarse steps.

Example:
- food production over six hours
- water reservoir delta
- building construction progress
- population changes
- scheduled maintenance
- threat event windows

## Systems requiring bounded treatment

Combat, starvation, cascading infrastructure collapse, and disasters need safety caps and discrete event resolution.

## Determinism

Use:
- world seed
- explicit event seeds
- server timestamps
- versioned simulation rules

Exact floating-point replay across all environments is not required, but outcomes must be reproducible enough for audits and tests.

## Catch-up budget

Reconnect should not block for unbounded time. Process large absences in coarse epochs and cap expensive event detail.

## Player-facing return

Show a concise timeline:
- construction completed
- population changed
- utility issue occurred
- raid happened
- damage repaired
- major trade or production event
