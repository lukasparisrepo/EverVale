# 24 — Prototype Simulation Results v0.1

These are design simulations using the values in `data/balance/v0.1/`.

They are not claims about final release balance.

## Economy scenario A — starter settlement

Configuration:
- Population 12
- Workforce 9
- 3 Houses
- 1 Power Plant
- 1 Water Plant
- 1 Workshop

Reference output per cycle:
- Power production: 40
- Power demand: ~14
- Water production: 35
- Water demand: ~10
- net Money: ~+26
- Tech: 0
- Varum: 0

Result:
- stable
- enough reserve headroom
- one worker may remain available
- Housing is full, so Population does not grow until player builds another House

This creates a clear first expansion decision.

## Economy scenario B — civic town

Configuration:
- Population 16
- 4 Houses
- Power + Water
- Workshop
- School
- Park
- Guard Post

Reference:
- Workforce 12
- Power demand ~21 / production 40
- Water demand ~17 / production 35
- net Money ~+19
- Tech +4/cycle
- high Happiness

Result:
- safe and progressing
- less profitable than pure Workshop expansion
- Tech is purchased indirectly through Workforce opportunity cost

## Economy scenario C — Varum town

Configuration:
- Population 24
- 6 Houses
- 1 Power Plant
- 1 Water Plant
- 2 Workshops
- School
- Park
- Guard
- 1 Varum Mine

Reference:
- Workforce 18, fully used
- Power ~40 production / 35 demand
- Water ~35 / 26
- net Money ~+45
- Tech +4
- Varum +3

Result:
- one Power Plant still works but is becoming tight
- expansion naturally pressures utility capacity
- Mine does not replace Money economy

## Economy scenario D — 32 residents

Configuration:
- 2 Power Plants
- 1 Water Plant
- 2 Workshops
- School
- 2 Parks
- Guard
- Mine
- Watchtower

Reference:
- Power 80 / ~41
- Water 35 / ~33
- net Money ~+38
- Tech +4
- Varum +3
- some Workforce remains free

Result:
- Water is now near its limit
- one extra growth/building decision can force a second Water Plant

The resource curve creates visible scaling pressure.

## Economy scenario E — overbuilt advanced town

Population 40 with:
- 2 Power
- 2 Water
- 3 Workshops
- 2 Schools
- 2 Mines
- 2 Guards
- 2 Towers
- Radar
- Vehicle Factory

Reference:
- Workforce: 30, fully allocated
- Power: 80 production / ~82 demand
- Water: 70 / ~49
- Money: approximately **-9/cycle**
- Tech: ~+7.8
- Varum: ~+5.9

Result:
- high Tech/Varum ambition creates a Money and Power problem
- the town is not “lost”; player can add Population/Housing, another Power Plant, more Workshop capacity, or lower job priorities

This is a successful systemic failure mode.

## Economy scenario F — corrected advanced town

Population 44 with additional housing, Power and income capacity:

Reference:
- Power ~120 / 86
- Water ~70 / 52
- Money ~+16
- Tech +8
- Varum +6

Result:
- the advanced town returns to positive operation through planning rather than arbitrary level gating

## Growth timing

At ~88–90 Happiness with one newly available House:
- expected early Growth ≈ one resident per ~60 minutes
- accelerates modestly as more Houses become occupied
- global cap prevents exponential population explosion

## Tech timing

One School:
- +24 Tech/hour
- T1 ~1h40
- T2 ~5h

Two Schools:
- roughly double speed
- but require more Workforce/Power/Water/upkeep

## Varum timing

One Mine:
- 18 Varum/hour

Approximate resource time after unlock:
- Armored Car 10 Varum: ~34 min
- Tank 30: ~100 min
- Fighter 40: ~134 min

Money and Tech remain additional gates.

# Combat simulations

Reference armor:

`effectiveDPS = rawDPS × 100 / (100 + Armor)`

Seeded target selection was used for these prototype checks.

## Ground — early

Defense:
- 2 Guards
- 1 Watchtower

Attack:
- 3 Raiders
- 1 Critter

Result:
- defenders win in ~12 seconds
- multiple defenders damaged

Good: early defense matters without being a guaranteed wipe.

## Ground — mid

Defense:
- 2 Guards
- Watchtower
- Armored Car

Attack:
- 6 Raiders
- 1 Brute

Result:
- defenders win in ~22 seconds
- defense is heavily damaged

Good: close enough to justify repair and stronger preparation.

## Ground — Tank tier

Defense:
- 2 Guards
- 2 Watchtowers
- Armored Car
- Tank

Attack:
- 8 Raiders
- 2 Brutes

Result:
- defenders win in ~14 seconds
- Tank materially changes the outcome

This validates the military progression fantasy.

## Air — prepared

Defense:
- AA Battery
- Fighter

Attack:
- 2 Drones
- 1 UFO Raider

Result:
- defenders win in ~14 seconds
- both defenders take meaningful damage

Without AA/Fighter, ordinary ground defense cannot efficiently target air attackers.

## Audit interpretation

The current numbers already produce:
- workforce tension
- infrastructure thresholds
- profitable vs non-profitable specialization
- a meaningful Varum/Tech military gate
- defense repair costs

Next step is automated Monte Carlo simulation, not adding more resources.
