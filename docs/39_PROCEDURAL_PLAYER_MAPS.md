# 39 — Procedural Player Maps

Status: **CANONICAL WORLD GENERATION BASELINE**

## Goal

Each player receives a map that is recognizably EverVale but slightly different.

Target feeling:
- like Clash of Clans: every base has the same rules but a different practical layout
- like Fallout Shelter: expansion is constrained by blockers and unlockable space
- unlike a blank infinite sandbox: terrain matters

# Map identity

Each World has a permanent:

`world_seed`

The seed determines:
- terrace layout
- river/pond position
- rock/rubble blockers
- forest clusters
- Varum deposits
- decorative landmark positions
- optional elevation connectors
- starting expansion directions

The seed never changes after world creation.

# World footprint

Initial target world:
- approximately 300m × 300m
- divided logically into build cells/chunks, but visuals remain organic
- 3–5 elevation terraces
- one primary starting plateau
- water/ravine/rock boundaries

The game should not look like a visible square grid unless build mode needs subtle snapping.

# Starting plateau

Every map guarantees:
- enough flat area for starter town
- direct road access between starter structures
- at least two viable expansion directions
- no required Varum at T0
- one reachable future Varum deposit after early clearance

# Terrain tiers

Instead of Fallout Shelter's stacked underground rooms, EverVale uses outdoor elevation bands:

- Terrace 0 — starter valley
- Terrace 1 — low hill / farm district
- Terrace 2 — ridge / industrial opportunity
- Terrace 3 — highland / defense or airfield
- optional special basin / island / cliff area

Terraces may connect through:
- winding road
- stairs/footpath
- bridge
- Hill Lift
- Service Tunnel later

# Blockers

Blockers create expansion pacing.

Types:

## Loose Rubble
Cheap to clear.
Visual: stones, broken masonry, roots.

## Boulder Field
Medium cost and time.
Requires basic construction capacity.

## Dense Forest
Clearing costs Money/time.
Some players may intentionally keep it for beauty/Happiness.

## Collapsed Road
Requires repair before traffic can pass.

## Cliff Face
Cannot be directly cleared.
Requires road switchback, Hill Lift, or later tunnel.

## Old Ruins
Can be cleared or restored later.
May become event/content hook.

## Varum Scar
Tech-gated terrain around deposits.

# Clearing mechanic

Blockers are not resources to grind manually.

Player selects blocker:
- sees Money/time requirement
- queues clearance
- Builder capacity handles it automatically

Large blockers occupy construction/clearance slots.

# Connectivity

A terrace with buildings is economically disconnected until a valid access path exists.

Pedestrians may use:
- path
- stairs
- lift

Vehicles require:
- road
- bridge
- vehicle-capable lift
- tunnel

This creates spatial strategy.

# Hill Lift

Hill Lift is the outdoor analogue of Fallout Shelter's elevator.

It can connect two authored terrace nodes.

Variants later:
- pedestrian lift
- cargo lift
- heavy vehicle lift

A lift is:
- visible
- powered
- capacity-limited
- vulnerable to faults

If disabled, connected upper district may temporarily lose efficient access.

# Seed fairness

Random maps may differ, but not in core progression difficulty beyond a bounded range.

Generator validates:
- starting buildable area
- expansion cost
- route length
- first Varum accessibility
- defense perimeter viability
- no isolated mandatory content

Reject/re-roll seeds outside bounds.

# Player ownership

World layout is server-authoritative.

Client receives:
- terrain seed/data
- cleared blockers
- roads
- built structures
- cosmetic deterministic detail seed

# Replayability

Future new worlds can offer broad archetypes:
- River Valley
- Hill Country
- Lakeside
- Forest Basin
- Coastal Ridge

They share gameplay rules but differ in geometry and expansion decisions.
