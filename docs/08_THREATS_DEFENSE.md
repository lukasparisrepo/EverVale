# 08 — Threats, Defense & Combat

Status: **COMBAT BASELINE v0.2**

Detailed values:
- `data/combat/v0.2/defense_units.yaml`
- `data/combat/v0.2/enemies.yaml`
- `data/combat/v0.2/waves.yaml`
- `data/balance/v0.1/threats.yaml`
- `docs/34_THREAT_CADENCE.md`
- `docs/49_ENEMY_UFO_WAVE_PROGRESSION.md`

## Threat philosophy

Threats create contrast inside a cozy game.

They should make the player prepare and recover without turning EverVale into an RTS or punishing success with constant raids.

There is **no exact attack countdown**.

## Frequency vs intensity

Settlement growth primarily increases **wave strength**, not attack frequency.

Reference major-threat pressure per 10-minute cycle:

`0.35 + 0.01×Population + 0.12×TechTier + 0.15×ActiveVarumMines`

Hidden threshold:
- onboarding attack: 5–7
- normal major attack: 20–32

After a major attack:
- pressure resets
- recovery cooldown applies
- the player receives an After-Action report

## Approximate cadence

At 1x, before modifiers:

Population 12 / T0:
- first onboarding wave roughly 1h45–2h30

Population 24 / T1 / one Mine:
- normal major wave roughly 4–6.5 hours

Population 40 / T2 / two Mines:
- roughly 2.6–4.1 hours

These are seeded ranges, not promises or visible timers.

## Minor incidents

Between major waves the world may produce low-impact threat flavor:

- critter incursion
- raider scouting
- monster tracks
- damaged fence
- radar anomaly
- UFO flyover

Minor incidents normally do not reset major Threat Pressure.

## Warning

Without Radar:
- world clues
- citizen/scout reports
- short warning

With Radar:
- earlier warning
- improved attacker classification
- better direction information

Radar does not prevent attacks.

## Settlement Rating

Wave composition is gated by a derived Settlement Rating, not only elapsed time.

Rating considers:
- Population
- Tech Tier
- functional building count
- Varum sites
- military power
- cleared territory

Low-rating settlements receive a few nuisance creatures.

High-rating settlements unlock:
- armored monsters
- drones
- UFO scouts
- drop pods
- alien walkers
- command saucers
- carriers / boss-like anomalies

See `docs/49_ENEMY_UFO_WAVE_PROGRESSION.md`.

## Wave budget

Reference:

`20 + 1.2×Population + 15×TechTier + 8×ActiveVarumMines + seeded variance`

Enemy types consume budget points.

This is where successful settlement growth should be felt most strongly.

## Threat families

T0:
- Critters
- Raiders

T1:
- Brutes

T2:
- stronger raiders
- early drones

T3:
- heavy ground groups
- UFO scouts

T4:
- UFO assault groups

T5:
- carriers / advanced anomalies

## Spatial combat

Combat outcomes must not be only “town DPS vs enemy DPS.”

World layout matters through:
- attacker entry corridor
- road/access class
- wall/gate pathing
- defender response travel time
- tower/radar coverage
- ground vs air target class
- terrain chokepoints

## Combat model

Server-authoritative core stats:
- HP
- DPS
- Armor
- target class
- movement speed
- attack range

Armor:

`effectiveDPS = rawDPS × 100 / (100 + Armor)`

## Defense progression

- Guard Post
- Watchtower
- Gate/Wall
- Radar
- Armored Car
- Tank
- Airfield
- Fighter
- Anti-Air
- Varum Shield

## No micro requirement

Player controls:
- placement
- staffing/readiness
- production
- access layout
- defense investment

Units autonomously:
- deploy
- choose valid targets
- engage
- return/recover

## Defeat without misery

MVP:
- citizens/guards become injured instead of permanently deleted
- vehicles become disabled and repairable
- structures become damaged/disabled
- offline sim never permanently erases critical infrastructure

## Economic purpose

Defense consumes:
- Workforce
- Money/upkeep
- Power
- Varum for advanced assets
- valuable building space

Over-defending slows growth and Tech; under-defending increases repair cost and downtime.
