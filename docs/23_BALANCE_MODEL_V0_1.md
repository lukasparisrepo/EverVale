# 23 — Balance Model v0.1

This is a **prototype balance contract**, not final release tuning.

Machine-readable SSOT: `data/balance/v0.1/`.

## Reference time

One balance cycle = **10 real minutes at 1x**.

Runtime integrates continuously; “per cycle” is only the human-readable balance unit.

Visual day/night target = 24 real minutes at 1x.

## Initial world

Reference new world:
- Population: 12
- Happiness: 80 initial, then simulation target takes over
- Money: 1200
- Treasury cap: 5000
- Power reserve: 60
- Water reserve: 60
- Varum: 0
- Tech: 0 / T0
- construction slots: 1

Starter buildings:
- Town Center
- 3 Houses
- 1 Power Plant
- 1 Water Plant
- 1 Workshop

This deliberately starts at full Housing capacity. Building another House is the clear way to begin Population growth.

## Citizen baseline

Per resident / cycle:
- Power consumption: 0.50
- Water consumption: 0.75

Aggregate Workforce:
- 75% of Population

## Resource storage

- each Power Plant: +120 Power cap
- each Water Plant: +120 Water cap
- each Varum Mine: +30 Varum cap
- Town Center: 5000 Treasury cap

Storage upgrades can be introduced later.

## Growth

Required:
- Happiness >= 65
- free Housing

Per occupied House / cycle:

`0.08 × clamp((Happiness - 60) / 40, 0, 1)`

World Growth gain cap:
- 0.25 / cycle

At healthy Happiness this gives roughly one resident every 40–90 minutes once spare Housing exists.

## Happiness

`20 + 20P + 20W + 15E + 10H + 5Edu + 5Rec + 10Safe`

Smoothed by 25% of target difference per cycle.

## Tech

School baseline:
- +4 Tech / cycle

Thresholds:
- T1 40
- T2 120
- T3 300
- T4 600
- T5 1000

One School therefore reaches:
- T1 in ~100 real minutes
- T2 in ~5 real hours total

Additional Schools trade Workforce/Money for faster progression.

## Varum

Varum Mine:
- +3 Varum / cycle

One Mine produces:
- 18 Varum / real hour

Reference advanced unit Varum costs:
- Armored Car: 10
- Tank: 30
- Fighter: 40
- AA Battery: 15
- Varum Shield: 80

## Economic interpretation

A worker in a Workshop is economically strong.

Moving that worker to:
- School buys future Tech
- Mine buys Varum
- Utility protects resource supply
- Defense buys safety

The entire game should preserve that tradeoff.
