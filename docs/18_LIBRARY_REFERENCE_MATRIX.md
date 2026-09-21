# 18 — Library & Reference Matrix

Status: **APPROVED RESEARCH BASELINE — 2026-09-21**

| Subsystem | Default | Classification | License | EverVale role |
|---|---|---|---|---|
| Renderer | `mrdoob/three.js` 0.186.x | Production | MIT | WebGL scene/runtime |
| Procedural art | `jasonsturges/three-low-poly` 1.2.x | Selective | ISC | procedural low-poly helpers |
| Mesh queries | `gkjohnson/three-mesh-bvh` | Production | MIT | accelerated raycast/intersection |
| Local navmesh | `isaac-mason/recast-navigation-js` 0.43.x | Production | MIT | local walkability/path/crowd |
| Server road graph | `graphology/graphology` + shortest-path | Production candidate | MIT | weighted road/service routing |
| Post FX | `pmndrs/postprocessing` 6.39.x | Production | Zlib | visual polish |
| Realtime | `colyseus/colyseus` 0.18.x | Production | MIT | WebSocket rooms/state |
| Auth | `better-auth/better-auth` | Production candidate | MIT | login/session |
| UI state | `pmndrs/zustand` | Production | MIT | client HUD state |
| DB | `drizzle-team/drizzle-orm` | Production | Apache-2.0 | PostgreSQL ORM |
| Jobs | `timgit/pg-boss` | Production | MIT | durable catch-up/background jobs |
| Spatial 2D | `mourner/rbush` | Production | MIT | footprints / proximity |
| Blender bridge | `ahujasid/mcp-for-blender` 2.0.x | Authoring | MIT | AI-assisted Blender |
| Visual loop | `achimala/dream-loop` | Workflow | MIT | target/build/critic |
| Shader reference | `cryptomanavan/ShoreBreak` | Reference | MIT code | rendering/water/perf |
| AI reference | `Mugen87/yuka` | Reference | MIT | steering ideas |
| Nav fallback | `donmccurdy/three-pathfinding` | Reference | MIT | simple nav examples |
| Miniature-world architecture | `nickfromlater/whistlevale` | Reference only | MIT | modular scenes, deterministic life, subsystem QA |

## Responsibility split

Graphology solves **simulation routing**.

Recast solves **3D local walkability**.

three-mesh-bvh solves **mesh spatial queries**.

These systems are complementary, not three competing pathfinding authorities.

## Version anchor

Three.js r186 remains the initial renderer anchor because the selected visual stack intersects cleanly around it.

Server baseline is Node.js 22.12+.

## Reference rule

Reference projects may teach algorithms and architecture. They are not permission to paste whole subsystems into EverVale.

## Physics

No general rigid-body engine is canonical for MVP.

The old standalone `dimforge/rapier.js` repository is archived; reassess current maintained options only if physics becomes a real requirement.


## Whistlevale classification

Whistlevale is **not** a runtime dependency.

Approved learnings:
- module/registry-based scene composition
- deterministic procedural detail
- static-vs-animated life budgeting
- geometry and subsystem QA
- explicit agent contribution rules

Do not copy:
- custom WebGL renderer
- global script-order architecture
- client-only state ownership
- large central-file structure
