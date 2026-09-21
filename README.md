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
- [Systems audit](docs/22_SYSTEMS_AUDIT_2026-09-21.md)
- [Balance model](docs/23_BALANCE_MODEL_V0_1.md)
- [Simulation results](docs/24_SIMULATION_RESULTS_V0_1.md)
- [Ambient life](docs/25_AMBIENT_LIFE_SIMULATION.md)
- [Daily schedules](docs/26_DAILY_SCHEDULES.md)
- [Traffic & transport](docs/27_TRAFFIC_AND_TRANSPORT.md)
- [Parks & social life](docs/28_PARKS_AND_SOCIAL_LIFE.md)
- [Animals, farms & pets](docs/29_ANIMALS_FARMS_PETS.md)
- [World Activity Director](docs/30_WORLD_ACTIVITY_DIRECTOR.md)
- [Visual state contracts](docs/31_VISUAL_STATE_CONTRACTS.md)
- [Automatic workforce](docs/32_AUTOMATIC_WORKFORCE.md)
- [Automation constitution](docs/33_AUTOMATION_DESIGN.md)
- [Threat cadence](docs/34_THREAT_CADENCE.md)
- [Layered architecture](docs/35_LAYERED_ARCHITECTURE.md)
- [Whistlevale reference audit](docs/36_WHISTLEVALE_REFERENCE_AUDIT.md)
- [Agent rules](AGENTS.md)

## Key external references

- [three-low-poly](https://github.com/jasonsturges/three-low-poly)
- [ShoreBreak](https://github.com/cryptomanavan/ShoreBreak)
- [dream-loop](https://github.com/achimala/dream-loop)
- [MCP for Blender](https://github.com/ahujasid/mcp-for-blender)
- [MCP for Blender — asset creation workflow](https://mcp-for-blender.com/use-cases/asset-creation)
- [Whistlevale](https://github.com/nickfromlater/whistlevale)

These references have specific classifications in the library matrix. A reference repo is not automatically a runtime dependency.

## Status

**Phase: documentation / architecture lock.**

No gameplay runtime should be built until the canon, stack boundaries and MVP acceptance gates are understood.


## Current world/content authorities

- [Named building catalog & art](docs/37_BUILDING_CATALOG_AND_ART.md)
- [Maintenance & local incidents](docs/38_MAINTENANCE_AND_LOCAL_INCIDENTS.md)
- [Procedural player maps](docs/39_PROCEDURAL_PLAYER_MAPS.md)
- [Starter world](docs/40_STARTER_WORLD_AND_EARLY_GAME.md)
- [Terraces, blockers & access](docs/41_WORLD_CONNECTIVITY_AND_LEVELS.md)
- [Anti-idle progression](docs/42_ANTI_IDLE_PROGRESSION.md)
- [Decor & world dressing](docs/43_DECOR_AND_WORLD_DRESSING.md)
- [Content authority index](docs/44_CONTENT_AUTHORITY_INDEX.md)
- [Anti-idle/content audit](docs/45_ANTI_IDLE_AND_CONTENT_AUDIT_2026-09-21.md)


## Start here for implementation

- [Studio readiness audit](docs/58_STUDIO_READINESS_AUDIT_2026-09-21.md)
- [Implementation start gate](docs/59_IMPLEMENTATION_START_GATE.md)

Current decision: **GREENLIGHT M0/M1 vertical slice.**
Full-content production remains gated behind M1 proof.
