# 35 — Layered Architecture

Status: **CANONICAL ARCHITECTURE RULE**

EverVale must remain developable after the prototype.

The project must never collapse into:
- one giant `main.ts`
- one giant `GameManager`
- economy logic inside Three.js scene code
- SQL/database calls directly from HUD
- network handlers that contain game formulas
- giant generic `utils.ts` dumping grounds
- feature behavior split across unrelated files without ownership

## Core dependency direction

```
Presentation
    ↓
Application
    ↓
Domain
    ↓
Ports / Contracts

Infrastructure implements Ports.
```

Domain never imports:
- Three.js
- React
- DOM/browser APIs
- PostgreSQL/Drizzle
- Colyseus
- pg-boss
- Blender tooling

## Target monorepo

```
apps/
  client/
  server/

packages/
  domain/
    economy/
    society/
    construction/
    threat/
    combat/
    world-time/
    events/

  application/
    commands/
    queries/
    world-runtime/
    offline-catchup/

  protocol/
  world-data/
  balance-data/
  asset-manifest/
  shared-kernel/

adapters/
  persistence/
  realtime/
  jobs/
  auth/

apps/client/src/
  renderer/
  world/
  camera/
  animation/
  vfx/
  input/
  ui/
  features/

apps/server/src/
  bootstrap/
  rooms/
  api/
  workers/

tools/
  blender/
  validation/
  simulation/
  content/

docs/
data/
```

Folder names may evolve, but the boundaries may not disappear.

# Domain layer

Pure game rules.

Examples:
- Money production
- Power/Water accounting
- Happiness
- Population Growth
- automatic Workforce assignment
- Tech progression
- Varum
- construction
- Threat Pressure
- combat math
- damage/repair
- world events

Requirements:
- plain TypeScript
- no I/O
- deterministic or seeded where practical
- unit-testable
- usable online and offline

Example:

```
packages/domain/economy/
  economy.types.ts
  resource-flow.ts
  workforce.ts
  happiness.ts
  population-growth.ts
  economy.test.ts
```

# Application layer

Coordinates use cases.

Examples:
- PlaceBuilding
- DrawRoad
- AdvanceWorld
- ChangeJobPriority
- CatchUpOfflineWorld
- ResolveThreat
- RepairBuilding
- PurchaseVehicle

Application:
1. loads state through interfaces
2. invokes Domain
3. produces domain events/results
4. persists through ports

Application does not know SQL details or render meshes.

# Infrastructure / adapters

Own external technology:
- PostgreSQL / Drizzle repositories
- pg-boss workers
- Colyseus rooms
- Better Auth
- logging/metrics

Infrastructure implements interfaces defined inward.

It does not become the place where game rules live.

# Client presentation

## Three.js layer

Owns:
- terrain meshes
- buildings
- citizens
- pets/animals
- traffic visuals
- animation
- particles
- VFX
- camera
- picking
- visual road geometry
- interpolation

## React HUD layer

Owns:
- top resources
- build menu
- inspector
- priority controls
- warnings
- login/settings

Neither Three.js nor React owns authoritative economy state.

# Vertical feature modules

Large features should be cohesive modules.

Example threat feature:

```
packages/domain/threat/
  pressure.ts
  cadence.ts
  wave-budget.ts
  threat.types.ts

packages/domain/combat/
  damage.ts
  targeting.ts
  combat.types.ts

packages/application/threat/
  resolve-threat.ts
  generate-warning.ts

apps/client/src/features/threat/
  threat-vfx.ts
  warning-ui.ts
  attacker-view.ts
```

Avoid a 5,000-line `simulation.ts`.

# Registry pattern

Inspired by successful extensible miniature-world projects such as Whistlevale:

Content should register through explicit registries rather than editing giant switch statements.

Examples:
- BuildingDefinitionRegistry
- CitizenActivityRegistry
- AnimalBehaviorRegistry
- VehicleDefinitionRegistry
- ThreatDefinitionRegistry
- WorldEventRegistry
- VisualEffectRegistry

Adding a new building should normally mean:
1. add definition data
2. add asset/presentation adapter
3. register it
4. add tests

It should not require editing fifteen central files.

# File responsibility rule

A file should have one primary reason to change.

Soft warning:
- repeatedly exceeding ~300–400 lines
- more than one unrelated subsystem
- significant renderer + simulation logic together
- networking + formulas together

This is a review trigger, not an arbitrary compile failure.

# No generic dumping grounds

Avoid:
- `utils.ts`
- `helpers.ts`
- `common.ts`
- `misc.ts`

Prefer intent:
- `road-distance.ts`
- `seeded-random.ts`
- `resource-clamp.ts`

# Runtime composition root

Only a small bootstrap/composition layer may know many concrete implementations.

Example server bootstrap wires:
- repositories
- job scheduler
- auth
- realtime
- application services

It must not contain actual gameplay formulas.

# State ownership

Each state field has one owner.

Examples:
- Money → Domain/World State
- mesh position interpolation → Client presentation
- login session → Auth adapter
- persisted snapshot → Persistence adapter

No duplicated writable truth.

# Cross-layer communication

Use typed:
- commands
- queries
- events
- snapshots
- DTOs

Do not pass raw Three.js objects, DB rows or WebSocket objects into Domain.

# Testing structure

Mirror architecture:

```
tests/
  domain/
  application/
  protocol/
  server/
  client/
  visual/
  performance/
```

Each subsystem receives its own QA gate.

# Whistlevale lessons adopted

From `nickfromlater/whistlevale` we explicitly adopt:
- feature/room modules
- registry-based extensibility
- subsystem-specific QA
- geometry/performance checks
- deterministic procedural seeds
- clear AGENTS documentation
- contributor/agent recipes

We explicitly do **not** copy:
- custom WebGL renderer architecture
- global script load ordering
- large central files as the long-term structure
- its railway-specific domain model

EverVale uses Three.js and stronger server/domain separation.

# Architecture definition of done

A feature is not complete unless:
- Domain rule has an owner module
- Application use case is explicit
- persistence/network adapters are separate
- presentation listens to authoritative state
- offline behavior is specified
- tests exist at the correct layer
- feature can be removed/replaced without rewriting unrelated systems
