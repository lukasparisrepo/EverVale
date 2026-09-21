# 39 — Procedural Player Maps

Status: **CANONICAL WORLD GENERATION BASELINE v0.2**

## Goal

Each player receives a persistent map that follows the same rules but differs slightly in practical layout.

Variation should change:
- route choice
- expansion cost
- visual identity
- defense geometry

It must not create unfair or impossible progression.

## Map identity

Each World has a permanent:

`world_seed`

It determines:
- terrace layout
- river/pond position
- rock/rubble blockers
- forest clusters
- Varum deposits
- landmarks
- optional elevation connectors
- threat approach corridors
- starting expansion directions

Existing worlds never silently regenerate when the generator changes.

Persist:
- `world_seed`
- `world_generator_version`

## World footprint

Initial target:
- roughly 300–320m × 300–320m
- organic visuals
- internal build cells/chunks allowed
- 3–5 elevation terraces
- one protected starter plateau
- water/ravine/rock boundaries

## Starter guarantees

Every accepted seed must provide:
- enough flat area for bootstrap town
- direct road access between starter structures
- at least two viable expansion directions
- no required Varum at T0
- at least one T1-reachable Varum deposit
- valid external threat approaches
- no mandatory content isolated behind impossible access

## Terrain tiers

Typical:
- Terrace 0 — starter valley
- Terrace 1 — farm/residential opportunity
- Terrace 2 — ridge/industry
- Terrace 3 — highland/defense/airfield
- optional basin/island/cliff zone

Connections:
- road
- footpath/stairs
- bridge
- Hill Lift
- Service Tunnel later

## Blockers

Examples:
- Loose Rubble
- Small Rocks
- Boulder Field
- Dense Forest
- Collapsed Road
- Old Ruins
- Landslide
- Cliff Face
- Varum Scar

Player selects blocker:
- sees Money/time/Tech requirement
- queues clearance
- Builder capacity resolves it automatically
- visual object transitions/disappears
- buildable/access graph updates

No manual rock-click grinding.

## Hill Lift

The Hill Lift is the outdoor analogue of a readable vertical connector.

Normal mode:
- uses Power
- has finite traffic capacity
- carries allowed actor classes

### Emergency mode

A Power outage must not permanently soft-lock an inhabited terrace.

When unpowered but structurally intact:
- pedestrian emergency mode remains available
- traversal is very slow/high-cost
- civilian vehicles cannot use it
- heavy vehicles/tanks cannot use it
- service response is degraded

A damaged/destroyed Lift may still fully disconnect the route, but the game must expose repair/recovery clearly.

Generator rule:
- mandatory T0 bootstrap may never depend on a powered Lift as its only access.

## Seed fairness

Generator validates:
- starting buildable area
- bootstrap affordability
- expansion cost bounds
- route length bounds
- first Varum accessibility
- defense perimeter viability
- no progression deadlock
- emergency access rules

Reject/re-roll seeds outside bounds.

Machine-readable generation baseline:
- `data/world/v0.1/map_generation.yaml`
- `data/world/v0.1/blockers.yaml`

## Player ownership

World layout is server-authoritative.

Client receives:
- terrain seed/data
- cleared blocker state
- access graph
- roads
- buildings
- deterministic decoration seed

## Replayability

Future broad archetypes can include:
- River Valley
- Hill Country
- Lakeside
- Forest Basin
- Coastal Ridge

All share the same economy and progression rules.
