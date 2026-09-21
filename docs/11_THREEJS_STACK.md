# 11 — Approved Three.js & Web Stack

Status: **APPROVED BASELINE**

Goal: prevent agents from rebuilding solved technology or mixing competing libraries.

## Compatibility anchor

Initial renderer baseline: **Three.js 0.186.x**.

Reason:
- ShoreBreak demonstrates r186 in a demanding WebGL2 project.
- current `postprocessing` line supports Three.js below 0.187.
- `three-low-poly` accepts Three.js >=0.180.
- `three-mesh-bvh` accepts modern Three.js.

Pin versions in the lockfile. Upgrade deliberately.

## Runtime baseline

Server Node.js: **22.12+**

## Production dependencies

### Three.js — `mrdoob/three.js`
Renderer, scene graph, loaders, animation, materials and instancing.

### three-mesh-bvh — `gkjohnson/three-mesh-bvh`
Fast mesh raycast/intersection for placement and scene queries.

### Recast Navigation JS — `isaac-mason/recast-navigation-js`
Local navmesh generation, walkability and crowd/path helpers.

It is not the authoritative economic road graph.

### Graphology + graphology-shortest-path — `graphology/graphology`
Approved server mobility graph candidate.

Use for:
- weighted road graph
- Dijkstra/A*
- service travel
- commute cost
- logistics/defense routing

### postprocessing — `pmndrs/postprocessing`
Restrained SSAO/bloom/color polish by quality tier.

### Colyseus — `colyseus/colyseus`
Realtime room/session transport and schema synchronization.

Simulation rules remain EverVale code.

### Zustand — `pmndrs/zustand`
Local HUD/editor state only.

### Better Auth — `better-auth/better-auth`
Approved authentication candidate for account/login/session flows.

World authorization remains EverVale domain logic.

### Drizzle ORM — `drizzle-team/drizzle-orm`
Typed PostgreSQL access.

### pg-boss — `timgit/pg-boss`
Durable background jobs and offline catch-up scheduling.

### RBush — `mourner/rbush`
Cheap 2D spatial index for footprints and nearby placement queries.

## Procedural art

### three-low-poly — `jasonsturges/three-low-poly`

Selective production use for:
- procedural props
- rocks/vegetation
- geometry helpers
- batching/instancing patterns

Do not let its aesthetic define EverVale.

## Reference-only

### ShoreBreak
Study rendering, water, particles, quality scaling and capture discipline.

### Yuka
Study steering/game-AI patterns. Not the primary server mobility graph.

### three-pathfinding
Fallback/reference only; do not compete with Recast/Graphology responsibilities.

## Physics

No general rigid-body engine in MVP unless a concrete feature proves it is needed.

Prefer:
- weighted graph
- navmesh
- BVH
- simple colliders
- analytic projectiles

## One job, one default

Renderer: Three.js  
Road/economy graph: Graphology  
Local navmesh: Recast  
Mesh queries: three-mesh-bvh  
2D index: RBush  
Post FX: postprocessing  
Realtime: Colyseus  
Auth: Better Auth candidate  
UI state: Zustand  
Database: PostgreSQL + Drizzle  
Jobs: pg-boss

Adding a competing core library requires an ADR.
