# 10 — Client / Server Architecture

## Topology

```
Browser
  ├─ Three.js renderer
  ├─ React HUD
  ├─ input / camera / VFX
  └─ network client
          │
          │ HTTPS + WebSocket
          ▼
Authoritative Server
  ├─ session/auth
  ├─ world commands
  ├─ simulation
  ├─ threat director
  ├─ persistence
  └─ realtime state
          │
          ├─ PostgreSQL
          └─ background jobs
```

## Monorepo target

```
apps/
  client/
  server/
packages/
  simulation/
  protocol/
  world-data/
  asset-manifest/
  shared/
tools/
  blender/
  validation/
docs/
```

## Command flow

Client sends intent:
- place building
- draw road
- demolish
- set priority
- purchase vehicle

Server:
1. authenticates
2. authorizes membership
3. validates
4. mutates canonical state
5. persists/event-logs as needed
6. publishes authoritative result

## State replication

Do not transmit entire world every frame.

Use:
- initial snapshot
- compact patches/events
- logical citizen movement
- interpolation client-side

## Simulation package

`packages/simulation` must not import Three.js, React, DOM, or browser-only APIs.

## Protocol

All cross-boundary payloads require:
- schema
- version
- validation
- stable IDs

## Anti-cheat / future multiplayer

Because the browser is untrusted, all valuable mutations are revalidated server-side from the first prototype.
