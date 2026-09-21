# EverVale

**EverVale** is a cozy living-world city simulation built for the web.

> **You build the town. They live in it. The world keeps moving when you leave.**

EverVale combines the readable management loop of a shelter/city simulator with a fully navigable 3D miniature world. Players design roads, utilities, neighborhoods, services, industry and defenses while citizens autonomously live, work, learn, commute, socialize and react to world events.

The initial release is single-owner play, but the architecture is multiplayer-ready from day one.

## Core pillars

1. **Build a real place** — roads, buildings, parks, schools, utilities, industry and defenses exist physically in the world.
2. **Watch society live** — citizens are autonomous agents, not counters in rooms.
3. **Simple resources, deep consequences** — Money, Electricity, Water and Varum drive a connected economy.
4. **A world that persists** — logout disconnects the player, not the world.
5. **Cozy with tension** — monsters, raiders, neighboring powers and UFOs can attack without turning the game into an RTS.
6. **Visible simulation** — when data changes, the world should show it through citizens, vehicles, buildings, queues, lights, production and events.

## Technical baseline

- **Client:** TypeScript + Three.js r186 + Vite
- **HUD/UI:** React for interface only; raw Three.js owns the 3D scene
- **Server:** authoritative TypeScript/Node.js simulation
- **Realtime:** Colyseus/WebSocket
- **Persistence:** PostgreSQL
- **ORM:** Drizzle ORM
- **Background jobs:** pg-boss
- **Navigation:** recast-navigation-js
- **Spatial picking:** three-mesh-bvh
- **Post-processing:** pmndrs/postprocessing
- **Asset authoring:** Blender CLI + MCP for Blender
- **Visual iteration:** dream-loop style target → build → critic loop
- **Procedural art:** three-low-poly where appropriate

See [docs/00_CANON.md](docs/00_CANON.md) before implementing anything.

## Documentation map

- [Canon](docs/00_CANON.md)
- [Game vision](docs/01_GAME_VISION.md)
- [World & art direction](docs/02_WORLD_ART.md)
- [Core gameplay loop](docs/03_GAMEPLAY_LOOP.md)
- [Economy & resources](docs/04_ECONOMY_RESOURCES.md)
- [Infrastructure networks](docs/05_INFRASTRUCTURE.md)
- [Buildings & construction](docs/06_BUILDINGS_CONSTRUCTION.md)
- [Citizens & society](docs/07_CITIZENS_SOCIETY.md)
- [Threats, defense & military progression](docs/08_THREATS_DEFENSE.md)
- [Online/offline simulation](docs/09_OFFLINE_SIMULATION.md)
- [Client/server architecture](docs/10_CLIENT_SERVER_ARCHITECTURE.md)
- [Three.js stack](docs/11_THREEJS_STACK.md)
- [Blender asset pipeline](docs/12_BLENDER_PIPELINE.md)
- [Agent visual loop](docs/13_AGENT_VISUAL_WORKFLOW.md)
- [Persistence, auth & multiplayer evolution](docs/14_PERSISTENCE_MULTIPLAYER.md)
- [HUD & camera](docs/15_HUD_CAMERA.md)
- [MVP & roadmap](docs/16_MVP_ROADMAP.md)
- [Acceptance tests](docs/17_ACCEPTANCE_TESTS.md)
- [Library/reference matrix](docs/18_LIBRARY_REFERENCE_MATRIX.md)
- [Runtime asset standards](docs/19_ASSET_STANDARDS.md)
- [Core data contracts](docs/20_DATA_CONTRACTS.md)
- [World events](docs/21_WORLD_EVENTS.md)
- [Agent rules](AGENTS.md)

## Key external references

- [three-low-poly](https://github.com/jasonsturges/three-low-poly)
- [ShoreBreak](https://github.com/cryptomanavan/ShoreBreak)
- [dream-loop](https://github.com/achimala/dream-loop)
- [MCP for Blender](https://github.com/ahujasid/mcp-for-blender)
- [MCP for Blender — asset creation workflow](https://mcp-for-blender.com/use-cases/asset-creation)

These references have specific classifications in the library matrix. A reference repo is not automatically a runtime dependency.

## Status

**Phase: documentation / architecture lock.**

No gameplay runtime should be built until the canon, stack boundaries and MVP acceptance gates are understood.
