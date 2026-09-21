# 32 — Whistlevale Reference Audit

Reference:
https://github.com/nickfromlater/whistlevale

Classification: **REFERENCE ONLY**

License: MIT for code/repository artwork as documented by upstream.

## Why it is relevant

Whistlevale is a browser-based miniature-world project with:
- custom WebGL 2 rendering
- procedural geometry
- people/scenery
- trains
- room modules
- performance/memory tooling
- substantial automated QA
- explicit agent contribution rules

Its product is different from EverVale, but several engineering patterns are valuable.

## Adopt conceptually

### Explicit module ownership

Whistlevale documents which source module owns:
- trains
- rooms
- people
- map
- sound
- UI
- performance

EverVale should be even stricter because it also has server simulation.

### Static vs dynamic life

Whistlevale deliberately batches static crowds and updates only walkers/occasional animated details.

EverVale should apply the same cost principle:
- static cafe/market scenes may be batched
- authoritative moving citizens remain dynamic
- ambient life uses simulation LOD

### Scene registry

Whistlevale uses registered room builders rather than hardcoding every room into one UI list.

EverVale should similarly use registries/data definitions for:
- building types
- actor types
- activity anchors
- world-event definitions
- visual factories

### Geometry / memory QA

Whistlevale has dedicated geometry and memory checks.

EverVale should eventually provide:
- GLB validation
- draw-call/triangle budgets
- memory leak checks
- deterministic scene captures
- performance budgets

### Agent documentation

Whistlevale's `AGENTS.md` is explicit about:
- ownership
- validation
- preserving existing work
- checking real behavior
- not treating green CI as proof of quality

EverVale adopts the same discipline.

## Do not copy structurally

Whistlevale documents that `src/railway.js` contains:
- simulation
- renderer
- layout editor

That can be workable for its scope, but EverVale must not create an equivalent monolith.

EverVale separates:
- domain simulation
- application orchestration
- server infrastructure
- client rendering
- editor
- HUD

## Renderer decision

Whistlevale uses a custom WebGL 2 renderer and no browser package dependencies.

EverVale keeps Three.js because:
- editable city world
- GLB asset pipeline
- animation
- instancing
- postprocessing
- agent/tool ecosystem

The lesson is architectural discipline, not renderer replacement.

## Content lesson

Whistlevale's small handcrafted people, dogs, bicycles, cafes and scene-specific details demonstrate an important art principle:

**small purposeful activity clusters read better than uniform random clutter.**

EverVale uses Activity Anchors and contextual scheduling to achieve this dynamically.

## Attribution

Do not copy upstream source/assets without following license and attribution requirements.

This repo is currently used as engineering/art-direction reference only.
