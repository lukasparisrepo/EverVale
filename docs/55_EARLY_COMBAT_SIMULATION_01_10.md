# 55 — Early Combat Simulation — Levels 1–10

Status: **AUDIT / BALANCE BASELINE v0.1**

## Purpose

Turn the first ten combat progression steps into something testable instead of relying on vague “enemy gets stronger” rules.

Machine-readable source:

`data/combat/v0.2/early_levels_01_10.yaml`

## What “Combat Level” means

Combat Level is a hidden/read-only progression band derived from settlement development.

It is **not** XP and not spendable.

It does not increase because the player builds more military.

Reference rating:

`Population×2 + TechTier×80 + FunctionalBuildings×8 + VarumSites×25 + ClearedSectors×15`

This avoids the bad loop:

`build defense → rating rises → stronger enemy → build more defense → rating rises again`

Defense affects survival, not threat eligibility.

## Level ladder

| Lv | Expected state | Main new lesson |
|---:|---|---|
| 1 | starter town | harmless nuisance |
| 2 | Guard Post | Guards matter |
| 3 | T1 | armor + Watchtower |
| 4 | T1/Varum edge | fast response / Brute |
| 5 | T2 | first light-air |
| 6 | established T2 | mixed range + Scout UFO |
| 7 | T3 | Tank power spike |
| 8 | established T3 | combined roles |
| 9 | T4 | first heavy-air hard counter |
| 10 | established T4 | combined ground/air exam |

## Toy combat simulation

A simple HP/DPS/Armor Monte Carlo was used as a **sanity check**, not final combat truth.

It currently ignores:
- exact travel paths
- cover
- structure objectives
- sector geometry
- projectile timing
- special abilities

It does include:
- HP
- DPS
- Armor
- target class compatibility
- randomized target selection

With each level's expected reference defense, all ten levels are survivable in the toy model.

Typical defender HP lost in that simplified model is roughly:
- Lv1: ~50%
- Lv2: ~34%
- Lv3: ~57%
- Lv4: ~40%
- Lv5: ~56% after the T2 pressure increase
- Lv6: ~50%
- Lv7: ~28%
- Lv8: ~28%
- Lv9: ~34%
- Lv10: ~40%

Interpretation:

- Lv3 and Lv5 intentionally create a costly lesson.
- Lv7 feels easier because Tank is a genuine power spike.
- Lv9 requires a heavy-air counter.
- Lv10 increases combined-arms pressure without jumping directly to Carrier/boss content.

## Important audit result

Using a defense package from the previous progression step causes major failure spikes at several gates.

This is good **only where a new counter has clearly been introduced**.

The most important gate is Lv9:

Heavy UFOs should not appear before AA/Interceptor can reasonably exist.

## Onboarding fix

Previous design allowed the first wave before the player necessarily built a Guard Post.

That could create an unavoidable Breach.

Fix:

**Hearth Hall now supplies 2 weak Town Wardens.**

They are only a safety floor and should not replace real defense investment.

## Air-counter fix

Previous v0.2 data introduced air scouts before a valid early anti-air unit existed.

Fix:

**Watchtower now targets ground + light-air.**

Heavy air remains gated until T4 AA/Interceptor.

## Rating exploit fix

Previous Settlement Rating included Military Power.

That punished the player for defending themselves.

Fix:

Military Power no longer contributes to threat progression rating.

## Next simulation step

Before runtime lock, spatial simulation must add:
- sector distance
- response time
- objective progress
- road/gate failure
- defender readiness
- special enemy abilities

The present numbers are a coherent starting point, not release balance.
