# 10 — Client / Server Architecture

## Topology

```
Browser
  ├─ Three.js world renderer
  ├─ React HUD
  ├─ local visual animation
  └─ network client
          │
          │ HTTPS + WebSocket
          ▼
Authoritative Node.js Server
  ├─ auth/session
  ├─ world commands
  ├─ economy simulation
  ├─ mobility graph
  ├─ threat/combat
  ├─ persistence
  └─ realtime replication
          │
          ├─ PostgreSQL
          └─ pg-boss workers
```

## Runtime baseline

Node.js **22.12+** is the server baseline because approved realtime/background-job dependencies require modern Node 22.

## Monorepo target

```
apps/
  client/
  server/
packages/
  simulation/
  protocol/
  world-data/
  balance-data/
  asset-manifest/
  shared/
tools/
  blender/
  validation/
docs/
data/
  balance/
```

## Server truth

Server owns:
- Money
- Power
- Water
- Varum
- Tech
- Population
- Happiness
- Workforce assignment
- buildings
- road graph
- construction
- combat
- threat pressure
- world time

## Client truth

Client owns only presentation:
- mesh
- animation
- particles
- camera
- UI
- placement preview
- interpolation

## Command flow

Client submits intent.

Server:
1. authenticates
2. authorizes
3. checks world revision/lease
4. validates resources/Tech/placement
5. mutates canonical state
6. persists
7. broadcasts result

## Mobility

The server maintains a weighted road/access graph.

Approved graph stack:
- Graphology
- graphology-shortest-path

Three.js/Recast can create visual/local walking paths but cannot replace the server graph as the economy source of truth.

## Exclusive world ownership

An ACTIVE room or background worker must hold the simulation lease before advancing time.

All writes use world revision checks / transactions.

## State replication

Use:
- initial snapshot
- compact patches/events
- logical citizen destination/state
- client interpolation

Never replicate every citizen transform every render frame.

## Simulation package

`packages/simulation` imports no Three.js, React, DOM or browser API.

The same package must support:
- online world ticks
- offline catch-up
- deterministic tests
- future multiplayer
