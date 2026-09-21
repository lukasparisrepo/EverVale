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

## Production dependencies

### Three.js — `mrdoob/three.js`
Role: renderer, scene graph, loaders, animation mixer, materials, instancing.

### three-mesh-bvh — `gkjohnson/three-mesh-bvh`
Role:
- accelerated raycasting
- placement picking
- terrain/building intersection queries
- spatial tooling

Do not use naive full-scene raycasts when BVH can solve the hot path.

### recast-navigation-js — `isaac-mason/recast-navigation-js`
Role:
- navmesh generation
- walkable navigation
- pathfinding
- crowd/Detour capabilities where appropriate

Default navigation choice.

### postprocessing — `pmndrs/postprocessing`
Role:
- restrained SSAO/bloom/color effects
- final visual polish

Effects are optional per quality tier.

### Colyseus — `colyseus/colyseus`
Role:
- realtime rooms
- schema/state synchronization
- future multiplayer session transport

Game simulation remains EverVale code, not framework-owned logic.

### Zustand — `pmndrs/zustand`
Role:
- client HUD/editor state
- selection
- panels
- transient UI state

Never use it as authoritative world storage.

### Drizzle ORM — `drizzle-team/drizzle-orm`
Role: typed PostgreSQL persistence.

### pg-boss — `timgit/pg-boss`
Role:
- background world jobs
- offline progression scheduling
- durable server jobs using PostgreSQL

### RBush — `mourner/rbush`
Role:
- cheap 2D spatial index for footprints, roads, districts, placement, and nearby queries where 3D BVH is unnecessary.

## Art / procedural dependency

### three-low-poly — `jasonsturges/three-low-poly`

Classification: **approved, selective use**.

Good for:
- procedural BufferGeometry
- repeated props
- rocks/vegetation
- batching/instancing patterns
- atmospheric lightweight effects

It explicitly favors merged geometry, material groups, and instancing. Use it where its art language fits EverVale; do not let library aesthetics dictate the whole game.

## Reference-only projects

### ShoreBreak — `cryptomanavan/ShoreBreak`

Classification: **REFERENCE / TECHNIQUE LAB**.

Study:
- Three.js r186 structure
- adaptive quality
- shader organization
- water/wetness
- particles
- deterministic captures
- build/test discipline

Do not import its heavy ocean stack unless EverVale actually needs that subsystem.

### Yuka — `Mugen87/yuka`

Classification: **REFERENCE / OPTIONAL AI TOOLKIT**.

Study steering and game-AI patterns. Do not run Yuka and Recast as competing primary navigation systems without an ADR.

### three-pathfinding — `donmccurdy/three-pathfinding`

Classification: **REFERENCE / FALLBACK**.

Useful for simpler navmesh patterns. Recast remains default.

## Physics

Do **not** add a full rigid-body engine by default.

EverVale primarily needs spatial queries, pathfinding, placement, simple projectile/vehicle logic, and authored destruction.

The legacy `dimforge/rapier.js` repository is archived; do not adopt it blindly as current infrastructure. Re-evaluate a maintained physics package only when a concrete gameplay feature requires it.

## Rendering rules

Use:
- InstancedMesh for repeated props
- LOD/culling
- capped DPR
- quality tiers
- limited shadow casters
- compressed GLB where pipeline supports it
- material sharing

Avoid:
- one draw call per grass tuft
- unique material per building
- giant transparent layers
- unnecessary realtime reflections

## “One job, one default” rule

Navigation: Recast.
Mesh raycast: three-mesh-bvh.
2D spatial index: RBush.
Post FX: postprocessing.
Realtime: Colyseus.
UI state: Zustand.
Database: Drizzle/PostgreSQL.
Jobs: pg-boss.

Adding a competing core library requires an ADR.
