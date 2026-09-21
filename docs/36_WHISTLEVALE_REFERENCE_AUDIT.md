# 36 — Whistlevale Reference Audit

Reference: `nickfromlater/whistlevale`

Classification: **ARCHITECTURE / VISUAL-LIFE / QA REFERENCE ONLY**

License: MIT.

## Why it matters

Whistlevale is a browser miniature-world project with:
- procedural scenery
- animated trains
- miniature people and animals
- multiple environments/rooms
- layout editing
- deterministic procedural generation
- strong geometry/performance QA
- explicit agent contribution instructions

Its subject is different from EverVale, but several engineering patterns are directly relevant.

## Strong patterns to learn

### 1. Content modules

Whistlevale keeps individual room content in separate modules under `src/rooms/` and registers rooms through a shared registry.

EverVale should use equivalent registries for:
- buildings
- threats
- animals
- vehicles
- world events
- activities

### 2. Deterministic procedural detail

Whistlevale uses fixed seeds and coordinate hashes for stable scenery/life details.

EverVale should use stable seeds for:
- citizen cosmetic variants
- ambient activity
- pets
- wildlife
- decoration scattering
- threat variation
- visual regression captures

### 3. Static vs animated detail budget

Whistlevale deliberately batches static miniature crowds/scenery while animating only selected actors.

EverVale should follow the same performance idea:
- most distant life can be static/low-rate
- nearby selected actors animate fully
- no requirement that every visible citizen runs an expensive controller

### 4. Geometry QA

Whistlevale has dedicated geometry tests and finite-geometry checks.

EverVale should add automated gates for:
- NaN/Infinity transforms
- invalid GLB bounds
- road geometry
- placement footprints
- nav data
- LOD availability
- triangle/material budgets

### 5. Subsystem QA scripts

Whistlevale separates checks for:
- geometry
- lighting
- startup
- rooms
- map
- trains
- guests
- mobile behavior

EverVale should mirror this principle with:
- economy audit
- workforce audit
- offline audit
- threat/combat audit
- road/nav audit
- citizen-life audit
- asset audit
- rendering/performance audit
- persistence audit

### 6. Agent instructions

Whistlevale's AGENTS/contribution workflow is unusually explicit.

EverVale should maintain:
- one canonical AGENTS entry
- local feature docs
- exact verification commands
- no silent budget loosening
- evidence for visual changes

## Patterns not to copy

### Custom WebGL renderer

Whistlevale intentionally owns a custom WebGL2 renderer.

EverVale already chose Three.js. Reimplementing a renderer would create work without helping the simulation game.

### Large central files

Some mature Whistlevale files are tens of kilobytes and combine many responsibilities.

EverVale should treat this as a scaling warning and use stronger layers/modules from the beginning.

### Script-order architecture

Whistlevale relies on ordered browser scripts/globals in parts of its application.

EverVale should use TypeScript modules and explicit imports/registries.

### Client-only simulation assumptions

Whistlevale is primarily a browser experience.

EverVale requires authoritative persistent server simulation and therefore cannot reuse its state ownership model directly.

## Useful content-life ideas

Whistlevale's miniature people system demonstrates an effective principle:

**Not every life detail needs an expensive autonomous AI agent.**

Many scenes can be:
- authored activity clusters
- deterministic pose variants
- a few true walkers
- static crowd groups
- camera-aware visual richness

EverVale should combine this with its authoritative schedules.

Example:
- server says 18 citizens are using the park
- client may render 8 detailed individuals + 10 lower-cost crowd instances

This preserves both simulation truth and visual density.

## Additional visual-composition findings

A later visual review of Whistlevale reinforces that its quality does not come from raw prop count alone.

### Authored landmark hierarchy

Strong scenes establish one or two dominant structures before micro-detail. Large station sheds, viaducts, water bodies, bridges and industrial halls create a readable composition from far zoom.

EverVale implication:
- Town Center and major utilities need distinctive massing
- district silhouettes should differ before facade decoration is noticed
- macro composition must be solved before increasing clutter density

### Mid-scale rhythm and negative space

Whistlevale alternates:
- dense urban strips
- water
- hills/trees
- rail corridors
- yards
- open green space

EverVale should avoid filling every empty patch with procedural vegetation. Negative space is part of the miniature composition.

### Building-to-ground integration

Roads, paths, platforms, walls, vegetation and yards visually meet the buildings. Structures do not appear to float as isolated meshes on one flat terrain sheet.

EverVale implication:
- authored frontage zones
- yard/path transitions
- foundation/terrain contact treatment
- district-specific edge dressing

### Repeated content still has authored difference

Repeated small buildings retain family resemblance while varying roof/frontage/placement/context.

EverVale formalizes this in `docs/79_VISUAL_IDENTITY_VARIATION_SYSTEM.md`.

### Diorama reward

Close views reveal secondary details such as trim, signs, doors, interior hints, platform furniture and tiny activity props.

This supports EverVale's existing two-scale rule: management readability plus diorama reward.

## Decision

Whistlevale is added as:
- architecture reference
- procedural miniature-life reference
- QA/reference workflow

It is **not** a runtime dependency and its code should not be copied wholesale.
