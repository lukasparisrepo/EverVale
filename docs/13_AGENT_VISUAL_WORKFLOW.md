# 13 — Agent Visual Development Workflow

## Dream Loop

Use `achimala/dream-loop` as a **workflow reference/agent skill**, not as runtime dependency.

Core visual loop:
1. define target composition
2. generate or select a visual target
3. build scene/assets
4. capture deterministic screenshot
5. critic compares result vs target
6. fix highest-impact gaps
7. repeat until quality gate passes

The project is MIT licensed and explicitly recommends Blender scripting/MCP when custom 3D modeling is needed.

## EverVale adaptation

Targets must respect game constraints.

A beautiful screenshot is invalid if it:
- cannot run at target frame rate
- hides important gameplay
- uses impossible asset density
- has no construction variants
- breaks navigation
- relies on inaccessible/licensed assets

## Visual milestone workflow

For a new biome/building family:
1. write art brief
2. create target frame
3. define asset list
4. author in Blender / procedural tools
5. export GLB
6. integrate Three.js
7. capture same camera/time/weather
8. run visual critique
9. optimize
10. lock art anchor

## Reference images

Reference images guide:
- silhouette
- proportions
- palette
- material breakup
- composition

Do not trace copyrighted game assets or reproduce a commercial game's identifiable content.

## Automated screenshots

Maintain deterministic capture presets:
- city overview
- street close-up
- day
- night
- rain/weather where supported
- low quality
- high quality

Visual regression is separate from gameplay correctness.

## Performance gate

Each dream-loop iteration records:
- FPS/frame time
- draw calls
- triangles
- texture memory estimate
- active lights
- shadow casters

The critic cannot approve visuals that violate the scene budget.
