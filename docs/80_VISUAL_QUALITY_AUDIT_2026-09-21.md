# 80 — Visual Quality Audit — Identity Canon Gate

Date: 2026-09-21

Status: **DOCS/DATA READY AFTER THIS AUDIT; RUNTIME REWORK REQUIRED**

Reference quality target:
- EverVale current judged detail: approximately 3.5/10
- next milestone target: approximately 6/10
- Whistlevale is a reference for authored miniature density/composition, not a code dependency

## Audit scope

Reviewed:
- `docs/00_CANON.md`
- `AGENTS.md`
- `docs/02_WORLD_ART.md`
- `docs/36_WHISTLEVALE_REFERENCE_AUDIT.md`
- `docs/37_BUILDING_CATALOG_AND_ART.md`
- `docs/43_DECOR_AND_WORLD_DRESSING.md`
- `docs/46_CITIZEN_VISUAL_ROSTER.md`
- `docs/47_CITIZEN_ACTOR_CATALOG.md`
- `docs/59_IMPLEMENTATION_START_GATE.md`
- `docs/65_PERFORMANCE_BUDGETS.md`
- `docs/66_PRE_ENGINEERING_DESIGN_LOCK.md`
- current Three.js visual modules
- proposed visual identity/dialect/variant design

## Findings

### PASS — existing content identity is strong enough to build from

The repository already defines:
- named building families with art tags
- citizen roles and outfit grammar
- animal/pet behaviors
- decor/district grammar
- camera and performance constraints

A new gameplay/content system is not required.

### GAP CLOSED — repeated instances lacked a canonical anti-clone contract

Before this audit, docs described a Hearth Cottage or Workshop but did not fully define how three instances in one view should differ.

`docs/79_VISUAL_IDENTITY_VARIATION_SYSTEM.md` and
`data/presentation/v0.1/visual_identities.yaml` now own that contract.

### GAP CLOSED — world-level visual identity was underspecified

World seeds already existed for terrain/worldgen but there was no canonical presentation dialect.

Four bounded visual dialects are now defined:
- Hearthstone
- Willowbrook
- Amberfield
- Bluebell

They are cosmetic only.

### GAP CLOSED — variant names were not enough

A production variant now requires structural/dressing differences rather than a palette swap.

The machine-readable presentation manifest records:
- family DNA
- variant IDs
- silhouette/massing intent
- facade/roof/yard intent
- signature props

### BLOCKER FOUND — runtime visual module became too large

The experimental identity runtime placed many family renderers into one growing `building-visual.ts`.

This violates the review trigger in `AGENTS.md` (~500 lines) and repeats a pattern explicitly listed under “do not copy” from the Whistlevale audit.

Decision:
- do not merge that runtime implementation
- implement a registry + family modules after docs/data reach main

### BLOCKER FOUND — presentation data had no authority-index entry

Fixed in the docs-only canon pack.

### BLOCKER FOUND — original visual identity doc number collided with M1.7 doc 78

Fixed by assigning this contract doc **79**.

### PERFORMANCE INTERPRETATION

The current headless browser stress gate can fluctuate around the 30-frame short-soak threshold under SwiftShader.

Main has already documented that this can produce 29/30/31-frame jitter without a real renderer regression.

Do not lower the gate silently.

Visual implementation still must preserve:
- draw calls <= 450
- visible triangles <= 1.5M
- shadow casters <= 24
- stable geometry/texture counts
- no browser errors
- target-hardware acceptance separately from SwiftShader FPS

## Whistlevale gap analysis

The remaining visual gap is mainly:

1. authored macro composition;
2. building massing variety;
3. roof/facade depth;
4. object-to-ground integration;
5. district-specific clutter;
6. role-readable people;
7. hero assets and visible interior hints;
8. lighting/material richness.

It is **not** primarily a need for more random grass/flowers/VFX.

## Implementation decision after docs merge

Start with one 40×40 m visual vertical slice.

Priority:
1. Town Center hero identity
2. three non-cloned Hearth Cottages
3. Workshop + Power + Water silhouette pass
4. road/terrain/building contact treatment
5. four citizen-role silhouettes
6. screenshot/visual regression capture
7. performance verification

Only then expand the same grammar to the rest of M1.

## Verdict

### Docs/data
**PASS after this canon pack is merged.**

### Previous runtime identity branch
**DO NOT MERGE AS-IS.**

### Next runtime work
**APPROVED only after main contains docs 79/80 and presentation data.**
