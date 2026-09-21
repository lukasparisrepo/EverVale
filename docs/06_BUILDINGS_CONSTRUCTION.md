# 06 — Buildings & Construction

## Philosophy

Buildings are both:
1. simulation machines
2. stages for visible autonomous life

Every important building should have a clear mechanical purpose and an activity profile.

## Core building families

### Residential

**House**
- +Housing capacity
- enables Population Growth when Happiness is sufficient
- creates home routines and pets

### Income

**Workshop**
- strongest compact early Money workplace

**Market**
- Money workplace
- creates customer activity and street life

**Farm**
- Money workplace
- creates rural visual identity
- supports chickens, ducks, tractor/farm activity
- does **not** create a Food resource in v0.1

**Café** — T1
- Money workplace
- small recreation contribution
- lunch/evening activity

### Utility

**Power Plant**
- produces Power

**Water Plant**
- produces Water
- consumes some Power

### Education

**School**
- produces Tech Points
- provides Education coverage
- generates child/school routines

### Happiness

**Park**
- Recreation coverage
- major leisure/animal activity stage

### Varum

**Varum Mine**
- produces Varum directly
- T1 unlock

### Defense

- Guard Post
- Watchtower
- Radar
- Vehicle Factory
- Airfield
- Anti-Air
- Varum Shield

## Building definition contract

Every definition may declare:
- ID
- Tech Tier
- footprint
- Money cost
- optional Varum cost
- construction time
- worker slots
- job category
- default job priority
- staffing mode
- Money yield per worker
- Power production/use
- Water production/use
- Varum production
- Tech production
- upkeep
- Housing
- service effect
- capacity additions
- combat attachment
- activity profile
- visual variants

Machine-readable baseline:
`data/balance/v0.1/buildings.yaml`

## Staffing modes

### continuous
Requests workers whenever operational.

Examples:
- Power Plant
- School
- Mine

### production_order
Requests workers only when it has an active production order.

Example:
- Vehicle Factory

This prevents an idle advanced factory from consuming Workforce forever.

## Construction model

v0.1 construction uses:
- Money
- optional Varum
- time

No construction-goods commodity.

## Construction stages

Visual:
1. footprint
2. foundation
3. frame
4. shell
5. completed

These are visible presentation stages; domain state can remain compact.

## Construction capacity

Initial:
- Town Center provides 1 active construction slot

Later upgrades may increase slots.

## Placement

Server validates:
- terrain
- footprint collision
- road access
- Money
- Varum
- Tech
- construction slot

Client only previews.

## Activity anchors

Gameplay-ready assets should expose semantic anchors such as:
- front door
- worker entrance
- schoolyard
- field work
- bench
- loading area
- guard spawn
- runway

See `docs/28_ACTIVITY_ANCHORS_AND_SCHEDULES.md`.

## Upgrades

Upgrades should alter:
- visible modules
- capacity
- output
- activity

where practical.

Avoid invisible “Level 5” stat inflation with no world change.

## Damage / repair

States:
- healthy
- damaged
- disabled
- repairing

Damage remains visible.

Repair consumes:
- Money
- time

Advanced repair may later consume Varum.

Offline attacks cannot permanently delete critical MVP infrastructure.
