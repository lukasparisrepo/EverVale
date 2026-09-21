# 25 — Layered Architecture Constitution

Status: **CANONICAL ARCHITECTURE v0.1**

## Why this exists

EverVale has enough systems that a flat codebase will become unmaintainable very quickly.

The architecture must prevent:
- simulation logic inside Three.js scene code
- SQL inside gameplay rules
- network messages mutating domain state directly
- React components calculating economy
- one giant `world.ts` / `game.ts` / `main.ts`
- circular imports between features
- ambient-life code becoming required for authoritative simulation

The goal is not maximum abstraction. The goal is **replaceable layers with small explicit contracts**.

---

# Dependency direction

Dependencies flow inward:

```
UI / Rendering / Network / Database / Workers
                    ↓
              Application
                    ↓
               Domain
                    ↓
            Pure data/types
```

The inner layers never import outer layers.

Examples:

- Domain can define `PlaceBuildingCommand`.
- Application can execute it.
- PostgreSQL adapter can persist its result.
- Three.js can render the result.

But:

- Domain must never import Three.js.
- Domain must never import Drizzle.
- Domain must never know Colyseus exists.
- Domain must never know React exists.

---

# Layer 0 — Contracts & Data

Packages:

```
packages/
  contracts/
  balance-data/
  content-schema/
  ids/
```

Responsibilities:
- stable IDs
- schemas
- balance definitions
- content definitions
- protocol-safe DTOs
- enums
- version declarations

Must contain no gameplay side effects.

---

# Layer 1 — Domain Simulation

```
packages/simulation/
  economy/
  society/
  population/
  workforce/
  utilities/
  progression/
  construction/
  mobility/
  threats/
  combat/
  world-events/
  time/
```

Each feature owns:
- state model
- pure calculations
- state transitions
- validation rules
- deterministic tests

Example:

```
simulation/economy/
  economy.types.ts
  economy.rules.ts
  economy.step.ts
  economy.test.ts
```

No file should become the universal owner of every system.

## Domain API rule

Cross-feature calls use explicit public APIs.

Good:

```
workforce.allocate(...)
economy.step(...)
threats.advance(...)
```

Bad:

```
import { internalThing } from '../economy/private/helper'
```

---

# Layer 2 — Application / World Orchestration

```
packages/application/
  world-engine/
  commands/
  queries/
  catchup/
  scheduler/
  event-log/
  job-allocation/
```

Responsibilities:
- order domain systems
- execute commands
- acquire world lease
- run one simulation step
- offline catch-up
- convert domain changes into events
- transaction boundaries

The application layer decides **when** domain systems run.

The domain layer decides **how their rules work**.

## World step

`WorldEngine.step()` may orchestrate:

1. time
2. construction
3. workforce allocation
4. Power/Water
5. Money
6. Tech/Varum
7. Happiness
8. Growth
9. threat pressure
10. combat/event resolution
11. world event emission

It must not contain the formulas itself.

---

# Layer 3 — Server Infrastructure

```
apps/server/src/
  api/
  realtime/
  auth/
  persistence/
  jobs/
  leases/
  composition/
```

Responsibilities:
- HTTP
- WebSocket / Colyseus
- Better Auth integration
- Drizzle/PostgreSQL
- pg-boss
- locks / leases
- server startup
- dependency composition

Infrastructure implements ports defined by application/domain.

Example:

```
WorldRepository
WorldLeaseProvider
EventStore
Clock
RandomSource
```

Tests can replace these with in-memory implementations.

---

# Layer 4 — Client World Runtime

```
apps/client/src/
  core/
  network/
  world/
  rendering/
  actors/
  editor/
  camera/
  audio/
  fx/
  assets/
```

Three.js exists here.

Submodules should remain separate:

```
actors/
  citizens/
  vehicles/
  animals/
  military/

world/
  terrain/
  roads/
  buildings/
  vegetation/
  activity-anchors/
```

Client consumes server state. It does not recalculate authoritative economy.

---

# Layer 5 — React HUD

```
apps/client/src/ui/
  shell/
  hud/
  build-menu/
  inspector/
  overlays/
  alerts/
  auth/
  settings/
```

React receives client read models.

React must not directly mutate Three.js scene internals.

Use explicit commands/event bridge:

```
UI → ClientCommandBus → network/editor → scene feedback
```

---

# Layer 6 — Content & Asset Tooling

```
tools/
  blender/
  assets/
  balance/
  simulation/
  screenshots/
  validation/
```

This layer can:
- build GLB assets
- validate assets
- run balance simulations
- run Monte Carlo combat
- generate reports
- create deterministic screenshots

It is not shipped as gameplay runtime.

---

# Feature ownership rule

Every major feature gets one clear owner.

Examples:

| Feature | Owner |
|---|---|
| Money | simulation/economy |
| Population | simulation/population |
| Job allocation | application/job-allocation |
| Power/Water | simulation/utilities |
| Tech | simulation/progression |
| Varum | simulation/progression |
| Threat pressure | simulation/threats |
| Combat math | simulation/combat |
| Citizen schedule intent | simulation/society |
| Citizen animation | client/actors/citizens |
| Traffic visuals | client/actors/vehicles |
| Save/load | server/persistence |
| Offline catch-up | application/catchup |

Never give one responsibility two owners.

---

# File-size / complexity guardrails

These are review triggers, not arbitrary compile errors.

Investigate when:
- a source file exceeds ~500 lines
- a function exceeds ~80 lines
- one module imports >10 unrelated feature modules
- a file owns rendering + simulation + networking
- a feature cannot be unit-tested without browser/server startup

Large asset-builder scripts may be exceptions, but runtime system modules should stay focused.

---

# Public barrel rule

Each feature exposes a small public surface.

Example:

```
simulation/economy/index.ts
```

Other modules import the public API, not private files.

---

# No circular dependency rule

Required dependency graph:

```
contracts
   ↑
domain features
   ↑
application
   ↑
infrastructure / client adapters
```

CI should eventually run a dependency-cycle check.

---

# Testing by layer

### Domain
Pure unit tests.

### Application
In-memory world integration tests.

### Server
DB/network/lease integration tests.

### Client
Scene module tests + deterministic screenshot tests.

### End-to-end
Login → load world → build → logout → catch-up → reconnect.

---

# Architecture acceptance rule

A feature is not complete if it “works” only because unrelated layers know internal implementation details.

The correct question is:

> Can this subsystem be replaced or rewritten without rewriting the rest of EverVale?

If not, its boundary is probably wrong.
