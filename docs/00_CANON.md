# 00 — Canonical Product Constitution

Status: **CANONICAL BASELINE — SIMULATION MODEL LOCKED v0.1**

## Identity

EverVale is a cozy persistent 3D society builder presented as a living miniature world.

> **You build the town. They live in it. The world keeps moving when you leave.**

The player shapes roads, housing, utilities, education, production, technology and defense. Citizens then autonomously live inside that system.

## Simulation philosophy

EverVale is a **game simulation, not an engineering simulator**.

Systems may be physically unrealistic as long as they are:
- immediately understandable
- internally consistent
- visible in the world
- useful for meaningful choices

A Water Plant simply produces Water. A Power Plant produces Power. A Varum Mine produces Varum. The game does not need to model fuel chemistry, aquifers, transformers, plumbing pressure, mining geology or realistic taxation unless a later feature genuinely improves gameplay.

This is intentional and follows the same abstraction principle that makes shelter-management games readable.

## Non-goals

EverVale is not:
- a stacked-room shelter clone
- a hardcore utility/traffic simulator
- an RTS requiring constant unit micro
- a survival game designed to punish absence
- a client-only browser toy
- a realistic municipal economics model

## Canonical resources

There are exactly four core resources in v0.1:

1. **Money**
2. **Power**
3. **Water**
4. **Varum**

### Progression state

**Tech** is progression, not a fifth economy currency. Schools produce Tech Points; thresholds raise Tech Tier and unlock upgrades, vehicles, aircraft and advanced defense.

### Social state

Population, Workforce and Happiness are state variables, not currencies.

## Canonical closed loop

`Housing + Happiness → Population → Workforce → Money`

`Power Plant → Power`

`Water Plant → Water`

`School → Tech → unlocks`

`Varum Mine → Varum → advanced construction / vehicles / defense`

`Money + Power + Water + Workforce → functioning settlement`

`Money + Tech + Varum → military capability`

`Threats → damage / repair / defense demand → new planning decisions`

## Varum

Varum is one fictional mineral resource.

Canonical chain for v0.1:

`Varum Mine → Varum storage → advanced buildings / upgrades / vehicles / aircraft / shields`

There is **no Raw Varum / Refined Varum split in the core game**.

Processing chains may be added later only if they create meaningful gameplay.

## Utilities

Power and Water behave like readable shelter-sim resource bars:
- produced by utility buildings
- stored up to capacity
- consumed by citizens and operating buildings
- shortages reduce operation and Happiness

MVP does not require individually drawn electrical cables or water pipes.

Road connectivity is the physical network that determines whether a building belongs to the functioning settlement.

## Population

Housing provides capacity.

When:
- spare housing exists
- Happiness is high enough

the settlement accumulates Growth and gains residents automatically.

The player does not click a “create citizen” button.

## Work and Money

A portion of Population becomes Workforce.

Citizens assigned to workplaces generate Money according to job type. Utility, education, Varum and defense jobs compete with high-income jobs for the same finite Workforce.

This workforce tradeoff is one of the main economic decisions.

## Education and Tech

Schools convert staffed operating capacity into Tech Points.

Tech Tier unlocks:
- utility upgrades
- improved buildings
- radar
- armored vehicles
- tanks
- aircraft
- anti-air
- Varum shield technology

## Threats

Threat families:
- fun monsters / creatures
- raiders
- hostile neighboring powers
- UFO / alien incursions
- rare anomalies

There is **no exact attack countdown**.

Threat pressure is hidden. The player receives clues and warnings, not a timer.

## Defense

Defense is preparation-first.

The player builds and maintains:
- guard posts
- watchtowers
- radar
- armored vehicles
- tanks
- anti-air
- aircraft
- Varum shields

Defense consumes workforce, Money, Power and/or Varum, so excessive militarization has an economic cost.

## Persistent world

World identity is separate from session identity.

Logout disconnects a client; it does not freeze or destroy the world.

Offline simulation continues at normal 1x world progression using coarse deterministic catch-up.

Automation is bounded by:
- storage caps
- Housing capacity
- Tech decision gates
- maintenance/repair capacity
- queued construction
- incident pressure
- bounded offline threats

The world can progress while unattended, but it cannot make major strategic choices or auto-win for the player.

## Player world identity

Every world has a persistent procedural seed.

The seed defines bounded variation in:
- terrain terraces
- water
- rock/rubble blockers
- forest patches
- Varum deposits
- expansion routes

All seeds must pass fairness validation so one player is not materially advantaged by generation.

## Buildings and art identity

Every buildable structure has:
- a stable gameplay ID
- authored display name
- art identity
- function
- visible activity
- incident profile
- upgrade hooks

See `docs/37_BUILDING_CATALOG_AND_ART.md`.

## Multiplayer evolution

Initial play is single-owner. Architecture must support future:
- co-builders
- visitors
- shared worlds
- neighboring player settlements

No simulation code may assume exactly one connected client.

## Technology canon

- TypeScript end-to-end where practical
- Three.js WebGL client
- React HUD only
- authoritative Node.js/TypeScript server
- PostgreSQL persistence
- server-side background simulation
- Graphology-compatible weighted mobility graph
- GLB/glTF runtime assets
- Blender CLI + MCP for Blender authoring

Changes to these require an ADR and explicit canon update.
