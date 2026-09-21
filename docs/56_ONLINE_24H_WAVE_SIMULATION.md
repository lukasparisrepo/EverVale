# 56 — 24h Online Wave Simulation

Status: **AUDIT BASELINE v0.1**

## Question

If one player somehow remains online for a full real 24-hour day at 1x, how many combat waves should EverVale produce?

## Assumed active progression day

The audit used this deliberately aggressive first-day development path:

| Real time | Pop | Tech | Mines |
|---|---:|---:|---:|
| 0–2h | 12 | T0 | 0 |
| 2–6h | 18 | T1 | 1 |
| 6–12h | 26 | T2 | 1 |
| 12–18h | 34 | T3 | 2 |
| 18–24h | 44 | T4 | 2 |

This is a stress-test progression, not a promise that every player reaches T4 in one day.

## Major-wave simulation

Major pressure:

`0.35 + 0.01×Population + 0.12×TechTier + 0.15×ActiveVarumMines`

Rules:
- first hidden threshold: 5–7
- later threshold: 20–32
- 6-cycle recovery cooldown
- one cycle = 10 minutes

Monte Carlo: **5,000 simulated online days**

Result:

- average major waves: **~5.1/day**
- typical: **5 waves**
- common range: **5–6**

Example seeded day:

- 02:10
- 07:10
- 12:10
- 16:00
- 20:20

These are internal simulated times only; the player never sees an exact countdown.

## Minor combat

Minor nuisance combat is separate from:
- rats/fire/weather incidents
- major waves

Baseline:
- first possible nuisance: 1.5–3h
- then 3–4.5h apart
- suppressed near a major attack
- max 5 in 24h online

Monte Carlo result with the major-wave schedule:

- average minor combat contacts: **~4.0/day**
- total combat contacts: **~9.1/day**
- usual total: **8–10**
- simulated range observed: **6–11**

## Design interpretation

A real player normally plays much less than 24 hours.

At this cadence:

### 30-minute session
Often no battle.

### 1-hour session
May see a nuisance or warning, but combat is not guaranteed.

### 2-hour session
Usually around 0–1 combat contact; occasionally a major wave.

### Long 4–6h session
Likely:
- 1 major wave
- 1–2 minor contacts/incidents
- meaningful recovery/build time between fights

This fits the cozy-builder identity better than combat every 10–20 minutes.

## Important distinction

**~9 combat contacts/day does not mean 9 major wars.**

Typical stress-test day:

- ~5 major waves
- ~4 small nuisance contacts

Plus non-combat world incidents/weather events.

## Audit conclusion

The current major-wave formula is acceptable for an actively growing town.

Do not make major waves much more frequent.

If more action is needed:
- add short nuisance contacts
- add flyovers/scouting
- add visual threat events

instead of shortening the major-wave timer.

Growth should increase **composition complexity and spectacle**, not turn the game into constant tower defense.
