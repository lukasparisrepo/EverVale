# 10 — Client / Server Architecture

Status: **SUMMARY ARCHITECTURE**

Detailed layer rules:
- `docs/35_LAYERED_ARCHITECTURE.md`

## Topology

```
Browser
  ├─ Three.js renderer
  ├─ React HUD
  ├─ local animation / ambient presentation
  └─ network client
          │
          │ HTTPS + WebSocket
          ▼
Application / Authoritative Server
  ├─ commands / queries
  ├─ world runtime
  ├─ offline catch-up
  ├─ workforce/economy orchestration
  ├─ threat/combat orchestration
  └─ event production
          │
          ▼
Pure Domain
  ├─ economy
  ├─ society
  ├─ utilities
  ├─ progression
  ├─ construction
  ├─ access/mobility
  ├─ threat
  └─ combat
          │
          ▼
Infrastructure Adapters
  ├─ PostgreSQL / Drizzle
  ├─ pg-boss
  ├─ Colyseus
  └─ Better Auth
```

## Runtime baseline

Node.js **22.12+**.

## Monorepo target

```
apps/
  client/
  server/

packages/
  domain/
  application/
  protocol/
  world-data/
  balance-data/
  content-data/
  asset-manifest/
  shared-kernel/

adapters/
  persistence/
  realtime/
  jobs/
  auth/

tools/
  blender/
  validation/
  simulation/
  content/

data/
  balance/
  world/
  life/
  content/
```

## Server authority

Authoritative state includes:
- Money
- Power
- Water
- Varum
- Tech
- Population/Happiness
- Workforce allocation
- buildings
- blockers
- Access Graph
- construction/repair/clearance
- combat/threat/incident state
- world seed/version
- world time

## Client authority

Presentation only:
- meshes
- animation
- local path smoothing
- particles
- camera
- HUD
- placement preview
- ambient actor density
- visual interpolation

## Command flow

1. client sends intent
2. server authenticates/authorizes
3. application checks lease/revision
4. domain validates and calculates
5. persistence commits canonical mutation
6. event/state patch broadcasts
7. client updates presentation

## Access / mobility

Server:
- weighted Access Graph is canonical

Client:
- Three.js road geometry
- Recast/local movement presentation

The client cannot change reachability by rendering a path.

## Exclusive world simulation

An ACTIVE room or background worker must hold the simulation lease before advancing time.

All critical writes use world revision/transaction checks.

## State replication

Use:
- initial snapshot
- compact patches/events
- timestamped logical actor state
- client interpolation

Never stream every citizen/vehicle transform at render frequency.

## Domain purity

Domain code imports no:
- Three.js
- React
- DOM
- Drizzle/PostgreSQL
- Colyseus
- pg-boss

The same domain rules support:
- online simulation
- offline catch-up
- tests
- future multiplayer.
