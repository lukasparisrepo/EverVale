# EverVale Agent Rules

Read this file and `docs/00_CANON.md` before changing architecture, simulation rules, dependencies, or asset conventions.

## Authority boundaries

### Server owns truth
The authoritative server owns world time, resources, infrastructure state, construction, citizen logical state, jobs, services, threats, combat outcomes, persistence, and offline progression.

### Three.js client owns presentation
The client owns rendering, visual interpolation, animation, particles, camera, picking, placement previews, and input feedback. It never grants itself resources or finalizes authoritative state.

### React owns HUD only
React is approved for HUD, menus, overlays, inspector panels, authentication screens, and non-3D UI. Do not make React Three Fiber the core scene architecture.

### Blender is authoring only
Blender CLI and MCP for Blender may create, edit, optimize, validate, and export assets. Runtime assets must be GLB/glTF and must load without Blender installed.

## Simulation rule

Gameplay domain logic must be plain TypeScript, testable without a renderer, and usable by:
- online simulation ticks
- worker processes
- offline catch-up
- tests
- future multiplayer worlds

Never bind economy rules directly to Three.js objects.

## Persistent-world rule

`logout != pause`.

Each time-dependent system must explicitly define offline behavior as one of:
- continuous
- coarse aggregated
- bounded
- suspended

## Dependency rule

Use `docs/11_THREEJS_STACK.md`. One default library per subsystem. A second library solving the same core job requires an ADR.

Reference projects are references, not code dumps. Understand and reimplement techniques for EverVale.

## Asset rule

Every asset must have provenance metadata: source, license, author if required, modifications, export date, and asset ID.

Prefer:
1. original procedural assets
2. Blender-authored originals
3. CC0
4. permissive licensed references

## Visual rule

EverVale must look good at both:
- management zoom
- close diorama zoom

It is a premium cozy miniature world, not a generic low-poly tech demo.

## Definition of done

A gameplay feature must pass:
- server authority
- save/load
- declared offline behavior
- deterministic or bounded simulation behavior
- visible world feedback
- performance budget
- acceptance tests
- no fake buttons or placeholder production paths
