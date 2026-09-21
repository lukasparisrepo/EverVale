# EverVale Agent Rules

Read this file, `docs/00_CANON.md`, and `docs/25_LAYERED_ARCHITECTURE.md` before changing architecture, simulation rules, dependencies, or asset conventions.

## Architecture is a product requirement

EverVale must remain maintainable after many AI-agent iterations.

Do not optimize for “make it run in one file.”

### Required dependency direction

```
contracts/data
    ↑
domain simulation
    ↑
application/orchestration
    ↑
server infrastructure / client adapters
    ↑
React HUD / Three.js presentation
```

Inner layers never import outer layers.

Forbidden examples:
- simulation imports Three.js
- economy code imports Drizzle
- React calculates authoritative Money
- WebSocket handlers contain combat formulas
- one world file owns rendering + networking + simulation + editor

### Feature modules

Domain systems are separate modules:
- economy
- utilities
- population
- workforce
- progression
- society
- construction
- mobility
- threats
- combat
- events

Each module owns its state transitions and tests.

Cross-module use goes through public APIs.

### File complexity review triggers

Review/refactor when:
- runtime source file exceeds ~500 lines
- function exceeds ~80 lines
- module imports many unrelated systems
- feature cannot be tested without browser/server startup
- one file owns more than one architectural layer

Asset-authoring scripts can be exceptions when justified.

## Authority boundaries

### Server owns truth

The authoritative server owns:
- world time
- Money/Power/Water/Varum
- Tech
- Population/Happiness/Workforce
- construction
- building operation
- road graph
- threat/combat outcomes
- persistence
- offline progression

### Three.js client owns presentation

The client owns:
- rendering
- animation
- interpolation
- local avoidance
- particles
- camera
- picking
- placement previews
- ambient-life presentation

It never grants itself resources or finalizes authoritative state.

### React owns HUD only

React is approved for:
- HUD
- menus
- overlays
- inspector
- login
- settings

Do not make React Three Fiber the core scene architecture.

### Blender is authoring only

Blender CLI and MCP for Blender may:
- create
- edit
- optimize
- validate
- export

Runtime assets are GLB/glTF and must load without Blender installed.

## Simulation rule

Gameplay domain logic must be plain TypeScript, testable without renderer, and usable by:
- online ticks
- worker processes
- offline catch-up
- tests
- future multiplayer

Never bind economy rules directly to Three.js objects.

## Autonomous-world rule

The player does not micromanage citizens.

Core principle:

> world state → actor intent → autonomous behavior → visible life

Persistent citizens may have identity and routines, while ambient animals/traffic can be reconstructed client-side from seed and world context.

Never let ambient visuals contradict authoritative state.

## Persistent-world rule

`logout != pause`.

Each time-dependent system explicitly declares offline behavior:
- continuous
- coarse aggregated
- bounded
- suspended

Only one process may hold the simulation lease for a world.

## Dependency rule

Use `docs/11_THREEJS_STACK.md` and `docs/18_LIBRARY_REFERENCE_MATRIX.md`.

One default library per subsystem.

A second library solving the same core job requires an ADR.

Reference projects are references, not code dumps.

## Data-driven rule

Do not hardcode:
- building balance
- Tech thresholds
- combat unit stats
- routine windows
- ambient density
- activity-anchor behavior

when the value belongs in versioned content data.

Gameplay code interprets data; content data should not contain arbitrary executable code.

## Asset rule

Every asset has provenance metadata:
- source
- license
- author if required
- modifications
- export date
- asset ID

Preference:
1. original procedural
2. Blender-authored original
3. CC0
4. permissive licensed references

## Visual rule

EverVale must work at:
- management zoom
- close diorama zoom

It is a premium cozy miniature world, not a generic low-poly demo.

## Definition of done

A gameplay feature must pass:
- correct layer ownership
- server authority
- save/load
- declared offline behavior
- deterministic or bounded simulation behavior
- visible world feedback
- performance budget
- acceptance tests
- no fake buttons
- no hidden placeholder production path
