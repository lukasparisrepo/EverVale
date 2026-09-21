# 33 — Per-Player World Map Generation

Status: **CANONICAL WORLD-GEN BASELINE v0.1**

## Product goal

Every player receives a persistent map that is recognizably EverVale but not geometrically identical to every other player's world.

The target feeling is:

- same rules
- same progression opportunity
- different terrain layout
- different expansion choices
- different blocker placement
- different Varum deposit placement
- different visual character

The world is not regenerated on login. It is created once from a stable `worldSeed` and then persists.

## Fair randomness

Randomness may change **shape and route**, not starter viability.

Every generated world must guarantee:

- one safe starter clearing
- enough buildable area for the complete T0 bootstrap
- road access inside the starter area
- at least two expansion directions
- at least one reachable Varum deposit after T1
- no required progression permanently trapped behind impossible geometry
- no hostile spawn directly inside protected starter bounds
- water/terrain visuals that do not invalidate required building footprints

## World structure

The initial map is a 3D outdoor miniature world divided into **terrain sectors**.

A sector can be:

- open meadow
- wooded patch
- rocky shelf
- riverbank
- pond/lake edge
- hillside terrace
- plateau
- ruined zone
- Varum-rich zone

Sectors connect through an **Access Graph**.

## Height / terraces

EverVale is not a flat board.

Terrain can contain several elevation bands.

Connections between bands may use:

- sloped road
- foot stair
- switchback
- bridge
- lift/elevator
- tunnel/underpass later

Vertical access is part of the world graph and can become a strategic build/expansion choice.

## Blockers

World generation places removable and permanent blockers.

### Removable
- loose rocks
- rubble
- dense bushes
- fallen tree
- abandoned debris
- small ruined wall
- collapsed access ramp

### Heavy removable
- boulder field
- old ruin foundation
- dense forest patch
- landslide
- blocked tunnel
- Varum-corrupted rock

### Permanent / geography
- cliff face
- deep water
- world boundary
- protected landmark

The player clears removable blockers using Money and time; advanced blockers may require Tech or Varum.

## Expansion cells

The map is not a visible square-tile board, but internally terrain can be partitioned into manageable build/validation cells.

The player experiences natural terrain, not a debug grid.

## Seed inputs

Canonical generation inputs:

```
worldSeed
biomeSeed
terrainSeed
blockerSeed
depositSeed
decorSeed
threatEntrySeed
```

These can be derived from one master seed.

## Generated vs persisted

Persist:
- master world seed
- generated terrain signature/version
- cleared blockers
- modified roads
- placed buildings
- construction
- discovered deposits
- player terraforming if later allowed

Do not persist every decorative pebble if it can be deterministically reconstructed.

## Generator versioning

World generation is versioned.

Existing worlds do not silently regenerate when the generator changes.

Save:

```
worldGeneratorVersion
worldSeed
```

## Threat entry points

Generation defines several valid external approach corridors.

Threats can later select among them.

This makes defense placement spatially meaningful without requiring handcrafted maps.

## Visual uniqueness

Per-world variation may include:

- river curve
- pond location
- tree clusters
- cliff silhouette
- ruin placement
- road approach
- rock formations
- seasonal color seed
- decorative vegetation
- distant mountain/background variant

## Acceptance

Generate at least 1000 seeds in automated tests.

Each seed must satisfy:
- starter footprint budget
- progression reachability
- T1 Varum reachability
- at least 2 expansion routes
- no disconnected required sector
- blocker budget bounds
- threat approach validity
