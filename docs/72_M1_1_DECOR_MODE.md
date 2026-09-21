# 72 — M1.1 Decor Mode Runtime Contract

Status: **IMPLEMENTED / BROWSER-PROVEN**

Date: 2026-09-21

## Goal

Turn decor from static catalog data into a persistent player editor and a visible-life tool without letting decoration replace real economy/civic systems.

## Reference knowledge applied

EverVale uses repository-approved learnings:

- `three-low-poly`: simple procedural geometry and reusable low-poly construction patterns
- Whistlevale: deterministic visual variation, module/registry separation, static-vs-animated budget discipline
- ShoreBreak: keep visual polish performance-measured
- dream-loop: target → build → capture → critique → optimize
- Blender MCP/CLI: reserved for hero/final authored assets; simple M1 props remain procedural Three.js

These are reference patterns, not copied runtime subsystems.

## Player Decor editor

Implemented:
- Build / Decor catalog tabs
- Prop groups
- 1m Decor grid
- stable human-readable titles
- physical size display
- money cost display
- green/red placement footprint
- 45-degree placement rotation
- keyboard Q/E rotation
- click Select mode for placed Props
- selected Prop ring
- rotate selected Prop
- move selected Prop
- delete selected Prop
- persistent save/reload

Server remains authoritative for all edits.

## Authoritative commands

- `PLACE_PROP`
- `MOVE_PROP`
- `ROTATE_PROP`
- `DELETE_PROP`

Rules:
- placement snaps again on server
- money is spent server-side
- building/blocker/Prop collision is validated server-side
- rotation normalizes to 45-degree steps
- move/rotate preserve stable Prop identity

## Prop classes

### visual
Presentation only.

### beauty
Adds a deliberately small town Beauty contribution.

### activity_anchor
Creates a client-visible destination such as:
- sit
- social
- picnic
- read
- child play
- animal gather
- transport wait

## Beauty

Beauty is derived from authoritative placed Props.

Rules:
- duplicate Prop types have diminishing returns
- total Decor Beauty contribution hard-caps at 5
- Beauty is only a small addition to Happiness
- Decor cannot substitute for Power, Water, Housing, School, Park, Safety or employment

## Living-world integration

Activity-anchor Props can replace generic Park leisure destinations for presentation:
- adults may visit benches/gazebo/picnic/read/gather anchors
- children prefer child-play anchors when available

This is presentation routing in M1, not final navmesh pathfinding.

## Procedural art

Runtime factory:

`apps/client/src/world/prop-factory.ts`

Current authored procedural silhouettes include:
- trees
- flower beds / planters
- benches
- lamps
- fountain
- picnic/festival table
- playground swing
- farm fence
- hay bale
- water trough
- duck house

Other catalog entries receive a category-aware low-poly fallback until their Blender/procedural final asset exists.

Variation is deterministic from world seed + Prop instance ID.

## HUD

HUD source/crops:
- `apps/client/public/ui/hud-master.svg`
- `hud-topbar.svg`
- `hud-sidepanel.svg`
- `hud-chip.svg`

Runtime text remains HTML/CSS.

See:
`docs/71_HUD_AUDIO_ASSET_PIPELINE.md`

## Music

Music asset slots are locked in:

`data/audio/v0.1/music.yaml`

Binary tracks are still pending creation/approval.

## Automated evidence

Domain:
- `packages/domain/src/props.test.ts`

Browser:
- Decor tab/categorization
- 1m grid
- title + physical size
- PLACE / MOVE / ROTATE persistence
- reload persistence
- renderer budget remains enforced
- no uncaught page errors

## Decision

**M1.1 DECOR MODE: IMPLEMENTED**

Next quality work should prioritize:
1. final/hero Prop asset passes through Blender
2. true road/navmesh citizen routing
3. 30–40 citizen stress scene
4. visual screenshot/dream-loop comparisons
