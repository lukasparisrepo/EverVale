# 18 — Library & Reference Matrix

Status: **APPROVED RESEARCH BASELINE — 2026-09-21**

This file tells agents what to use, what to study, and what not to mix.

| Subsystem | Default | Classification | License | EverVale role |
|---|---|---|---|---|
| Renderer | `mrdoob/three.js` 0.186.x | Production | MIT | Scene, WebGL, animation, loaders, instancing |
| Procedural art | `jasonsturges/three-low-poly` 1.2.6 | Selective production | ISC | Parametric geometry, scattering, low-poly helpers |
| Mesh spatial queries | `gkjohnson/three-mesh-bvh` | Production | MIT | Fast picking/raycast/intersection |
| Navigation | `isaac-mason/recast-navigation-js` 0.43.x | Production | MIT | Navmesh generation, Detour/pathfinding/crowd |
| Post FX | `pmndrs/postprocessing` 6.39.x | Production | Zlib | SSAO/bloom/color polish by quality tier |
| Realtime | `colyseus/colyseus` core 0.18.x | Production | MIT | Rooms, WebSocket state/session sync |
| UI state | `pmndrs/zustand` | Production | MIT | Local HUD/editor state only |
| DB mapping | `drizzle-team/drizzle-orm` | Production | Apache-2.0 | Typed PostgreSQL access |
| Background jobs | `timgit/pg-boss` | Production | MIT | Durable offline/catch-up jobs |
| 2D spatial | `mourner/rbush` | Production | MIT | Footprints, districts, road proximity |
| Blender bridge | `ahujasid/mcp-for-blender` 2.0.x | Production authoring tool | MIT | Agent-driven Blender authoring/export |
| Visual iteration | `achimala/dream-loop` | Agent workflow/reference | MIT | Target screenshot → build → critic loop |
| Water/shader reference | `cryptomanavan/ShoreBreak` | Reference only | MIT code | Quality, water, adaptive rendering patterns |
| Game AI reference | `Mugen87/yuka` | Optional/reference | MIT | Steering/AI patterns, not primary nav |
| Simple nav fallback | `donmccurdy/three-pathfinding` | Reference/fallback | MIT | Simpler navmesh examples |

## Why Three.js r186

Current compatibility research supports r186 as a practical anchor:
- Three.js package reports 0.186.0.
- ShoreBreak uses Three.js 0.186.0.
- postprocessing 6.39.x accepts Three.js >=0.168 and <0.187.
- three-low-poly requires Three.js >=0.180.
- three-mesh-bvh supports modern Three.js versions.

Do not float major renderer versions casually.

## Reference policy

Reference repositories may be read to learn:
- algorithms
- architecture
- rendering techniques
- test strategies
- performance patterns

Agents must not copy an entire project structure or large implementation blocks without review.

## Navigation policy

Primary: Recast Navigation.

Do not simultaneously make:
- Recast
- Yuka navigation
- three-pathfinding

three independent sources of truth.

Yuka may later provide high-level steering behavior around Recast destinations if an ADR proves value.

## Physics policy

No general-purpose rigid-body engine is required for the MVP.

Use:
- BVH
- navmesh
- analytic motion
- simple collision volumes

before adding physics.

The historical `dimforge/rapier.js` GitHub repository is archived; it is not an automatic dependency choice.

## Art dependency policy

Do not let a library determine EverVale's identity.

`three-low-poly` can accelerate procedural assets, but hero assets and building kits should be authored to the EverVale visual bible.

## Links

- https://github.com/mrdoob/three.js
- https://github.com/jasonsturges/three-low-poly
- https://github.com/gkjohnson/three-mesh-bvh
- https://github.com/isaac-mason/recast-navigation-js
- https://github.com/pmndrs/postprocessing
- https://github.com/colyseus/colyseus
- https://github.com/ahujasid/mcp-for-blender
- https://mcp-for-blender.com/use-cases/asset-creation
- https://github.com/achimala/dream-loop
- https://github.com/cryptomanavan/ShoreBreak
