# 34 — Threat Cadence & Cozy Tension

## Problem found during audit

The first threat-pressure formula made successful towns receive major attacks too frequently.

That creates a perverse incentive:
- do not grow
- do not research
- do not mine Varum

That is incompatible with a cozy builder.

## Rule

Settlement growth should mostly increase **attack intensity**, not linearly increase major-attack frequency.

## Major threat pressure v0.2

Per 10-minute reference cycle:

`pressure += 0.35 + 0.01×Population + 0.12×TechTier + 0.15×ActiveVarumMines`

### First onboarding attack

Hidden threshold:
- 5–7

At Population 12 / T0 this gives roughly:
- 1h45–2h30 at 1x

The exact time remains seeded and hidden.

### Normal major attack

Hidden threshold:
- 20–32

Examples:

Population 24 / T1 / 1 mine:
- pressure ≈ 0.83/cycle
- major wave roughly every 4–6.5 hours before event modifiers

Population 40 / T2 / 2 mines:
- pressure ≈ 1.29/cycle
- major wave roughly every 2.6–4.1 hours

## Minor incidents

The world can remain active between major attacks using lower-impact events:
- small critter incursion
- raider scouting
- theft attempt
- radar anomaly
- monster tracks
- damaged fence
- UFO flyover

Minor incidents should not reset the major-threat pressure unless explicitly designed to.

## Wave strength

Growth still matters through attack budget.

Reference:

`budget = 20 + 1.2×Population + 15×TechTier + 8×ActiveVarumMines + variance`

Therefore:
- richer towns attract stronger threats
- but the player is not attacked every few minutes

## Recovery protection

After major attack:
- at least 6 reference cycles of recovery protection
- major threat cannot immediately chain into another major threat

## Offline

Offline major attacks remain capped.

Initial:
- max 2 major attacks per 24 hours offline
- structure damage cap
- critical infrastructure protection floor

## Design intent

The player should think:

> “My town is becoming important; I should improve defense.”

Not:

> “Researching technology makes the game annoy me more often.”
