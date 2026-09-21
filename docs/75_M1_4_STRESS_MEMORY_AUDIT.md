# 75 — M1.4 Stress & Memory Runtime Audit

Status: **CI STRESS PASS / TARGET-HARDWARE SOAK PENDING**

Date: 2026-09-21

## Scope

This milestone measures runtime engineering quality only.

It does not judge visual polish.

Covered:
- 40-citizen presentation load
- road-route connectivity
- draw-call budget
- triangle budget
- renderer resource stability
- JavaScript heap stability
- browser page-error detection
- scene rebuild churn

## Stress harness

Dev-only benchmark URL:

`/?stressCitizens=40`

This overrides only client presentation count.

It does not mutate authoritative Population or economy state.

The benchmark remains capped at 40 presented citizens.

## CI scenario

Automated test:

`tests/e2e/m1-stress.spec.ts`

The test verifies:

- exactly 40 presented citizens
- 40/40 routed
- 0 disconnected routes
- draw calls <= 450
- visible triangles <= 1,500,000
- render loop continues during soak
- Three.js geometry count remains bounded
- Three.js texture count remains bounded
- post-GC JavaScript heap growth remains bounded
- no uncaught page errors

## Measured CI result

Headless Chromium + SwiftShader:

- Citizens: **40**
- Draw calls: **106**
- Visible triangles: **9,324**
- Geometry resources: **67 -> 67**
- Texture resources: **3 -> 3**
- JS heap: **15,247,132 -> 16,004,828 bytes**
- Heap delta: **757,696 bytes (~0.72 MiB)**
- Allowed delta: **8 MiB**
- Observed frames during 12-second soak window: **96**
- Reported headless FPS: **7**
- p95 frame: **148.1 ms**
- Browser page errors: **0**

## Interpretation

Scene-complexity headroom is large:

- draw calls use ~24% of the M1 450-call budget
- triangles use well below 1% of the 1.5M budget

Resource stability passed:

- no geometry growth
- no texture growth
- heap growth after GC remained small

## Important FPS caveat

GitHub Actions uses software-rendered SwiftShader.

Therefore:

- CI FPS is **not** the desktop/laptop hardware acceptance metric
- CI p95 frame time is **not** used to fail M1 performance
- CI is used to detect regressions in scene complexity, route health, resource growth and browser correctness

Hardware FPS targets remain those in:

`docs/65_PERFORMANCE_BUDGETS.md`

They must be measured on representative physical hardware.

## Runtime issue fixed during M1.4

WorldView previously rebuilt the dynamic scene every ~120 frames.

That created unnecessary:
- geometry allocation
- material allocation
- route recomputation
- actor reconstruction
- garbage collection pressure

Fix:
- rebuild only when a deterministic presentation signature changes
- construction stage changes are part of the signature
- combat alive/status changes are part of the signature
- blocker/building state changes are part of the signature
- selected Prop/population benchmark changes are part of the signature
- construction builders read project progress live instead of requiring periodic rebuild
- removed dynamic geometry/material resources are explicitly disposed
- shared Prop/construction materials are marked and retained safely

## Current verdict

**M1.4 CI runtime stress baseline: PASS**

Still required before claiming target-hardware performance complete:

1. representative desktop 1080p measurement
2. lower-end laptop 720p/Low measurement
3. 30-minute physical-browser soak
4. final-art benchmark after visual polish merge

These are hardware/final-art validation gates, not current architecture blockers.
