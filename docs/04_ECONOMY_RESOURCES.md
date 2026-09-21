# 04 — Economy & Resources

Status: **BALANCE MODEL v0.2 BASELINE**

Canonical building numbers: `data/balance/v0.2/buildings.yaml`.

Other simulation constants remain in versioned balance files under `data/balance/v0.1/` until individually promoted.

## Design rule

Keep the economy small enough that a player can understand a shortage by looking at the town.

No food chain, fuel chain, ore chain or construction-goods chain is required for the first complete loop.

## Core resources

### Money

Money comes primarily from citizens working.

Each workplace defines:
- worker slots
- Money yield per worker
- upkeep

High-income workplaces compete for Workforce with utilities, schools, mines and defense.

Money is spent on:
- construction
- repairs
- upgrades
- military units
- building upkeep

Treasury has a capacity so months of offline time cannot create infinite Money.

### Power

Power is produced by Power Plants and stored in the settlement reserve.

Power is consumed by:
- residents
- Water Plants
- workplaces
- schools
- mines
- military facilities
- advanced technology

A deficit drains the reserve. Once reserve reaches zero, operation efficiency and Happiness fall.

### Water

Water is produced by Water Plants and stored.

Water is consumed by:
- residents
- workplaces
- schools
- mines
- civic buildings
- military facilities

### Varum

Varum is produced directly by Varum Mines.

No refinement step in the core model.

Varum is consumed by:
- armored vehicles
- tanks
- aircraft
- anti-air
- advanced upgrades
- shields
- later special technology

## Tech

Schools produce Tech Points while staffed and supplied.

Tech Points are cumulative progression.

Default thresholds:

| Tier | Required Tech | Main unlock intent |
|---|---:|---|
| T0 | 0 | basic town, school, guard, utilities |
| T1 | 40 | Varum Mine, Watchtower |
| T2 | 120 | Radar, Vehicle Factory, Armored Car |
| T3 | 300 | Tank, Heavy Defense |
| T4 | 600 | Airfield, Fighter, Anti-Air |
| T5 | 1000 | Varum Shield, advanced UFO defense |

## Workforce

Reference rule:

`Workforce = floor(Population × 0.75)`

This is an aggregate demographic abstraction. The world may visually contain children and non-workers without simulating a full demographic model in the current baseline.

Workers are auto-assigned by job priority. Player may change priorities.

Critical utilities have a safe default priority.

## Reference balance cycle

Balance sheets use a **10 real-minute reference cycle at 1x**.

Runtime code integrates rates using delta time; it does not literally wait ten minutes and pulse all logic.

## Citizen consumption per reference cycle

Per resident:
- Power: **0.50**
- Water: **0.75**

Population therefore creates direct pressure on utilities.

## Happiness

Target Happiness:

`20 + 20P + 20W + 15E + 10H + 5Edu + 5Rec + 10Safe`

Where each factor is normalized 0..1:
- P = Power satisfaction
- W = Water satisfaction
- E = employment satisfaction
- H = housing satisfaction
- Edu = education coverage
- Rec = recreation coverage
- Safe = safety

Happiness is clamped 0..100 and smoothed rather than teleporting instantly.

## Population growth

Growth occurs only when:
- Happiness >= 65
- spare housing exists

Reference growth per occupied house per cycle:

`0.08 × clamp((Happiness - 60) / 40, 0, 1)`

Global Growth gain is capped at **0.25 resident-progress per cycle**.

At 80–90 Happiness, a healthy small town typically gains roughly one resident every 40–90 real minutes at 1x, subject to spare housing.

## Funding failure

Money never silently becomes infinitely negative.

If upkeep cannot be paid:
1. discretionary services lose funding first
2. advanced facilities reduce operation
3. defense readiness falls
4. core utilities are protected as long as possible

The exact priority table is data-driven.

## Core economic tension

The intended problem is not “collect 20 resource types.”

It is:

**Where should the next worker go?**

Examples:
- Workshop → more Money
- Power Plant → more utility capacity
- School → faster Tech
- Mine → more Varum
- Guard Post → more safety

Every one of those choices uses the same finite Workforce.
