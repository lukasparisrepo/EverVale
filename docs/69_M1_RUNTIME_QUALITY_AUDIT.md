# 69 — M1 Runtime Quality Audit

Status: **PASS BASELINE / CONTINUE MEASUREMENT**

Date: 2026-09-21

## Runtime-quality changes now implemented

### Placement UX
- green/red building ghost
- red when colliding with buildings/blockers or lacking nearby road
- road drag preview
- road length validity color
- authoritative server still decides final placement

### Terrain / expansion blocker
- starter world contains visible Fallen Tree + Rubble
- blockers are authoritative WorldState
- blocker blocks construction footprint
- Clear action costs Money/Varum and simulation time
- clearing persists through logout/catch-up
- blocker disappears only after clear timer resolves
- backward-compatible load for old snapshots with no blocker array

### Living-world readability
Citizens no longer continuously ping-pong between two positions.

Daily presentation now includes:
- HOME
- commute
- WORK
- SCHOOL
- PARK/LEISURE
- HOMEWARD
- SHELTER response during combat

Children without a completed School no longer fall back into adult job buildings.

Stable per-citizen offsets prevent crowd stacking.

World HUD now exposes in-world clock so routines can be visually understood.

### Ambient life
One lightweight dog actor is present in the starter neighborhood.
It wanders near housing and pulls closer to home during combat.

### Terrain readability
Starter plateau is visually framed by simple raised ridges.
This is graybox terrain, not final procedural terrain art.

## Browser performance baseline

Measured by Playwright + real Three.js renderer in headless Chromium.

Latest passing starter-world measurement:

- Draw calls: **68**
- Visible triangles: **4,400**
- Animated citizens: **12**
- Browser page errors: **0**

M1 budgets:

- Draw calls <= 450
- Visible triangles <= 1,500,000
- Animated near/mid citizens <= 30

Starter scene therefore has substantial headroom.

A dedicated 40-citizen benchmark now passes; see `docs/75_M1_4_STRESS_MEMORY_AUDIT.md`.

Final-art and target-hardware benchmarks are still pending.

## CI gates

Browser E2E now checks:
- renderer produces frames
- draw calls > 0 and <= 450
- triangles > 0 and <= 1.5M
- citizen presentation > 0 and <= 30
- blocker prevents placement
- blocker Clear action works
- build ghost reports invalid occupied-core placement
- no uncaught page errors
- persistent build/reload/offline/combat/repair loop remains valid

On E2E failure GitHub Actions now uploads:
- screenshot
- video
- Playwright trace

## Runtime bugs found during quality pass

### Q1 — zero telemetry regression
A quality change caused the React metrics probe to remain at zero in headless CI.

Resolution:
- direct render telemetry is now written by WorldView each rendered frame
- E2E reads renderer telemetry directly
- uncaught browser errors are captured

This makes performance failures distinguishable from telemetry failures.

### Q2 — child schedule fallback
Without School, child presentation could select an adult work building.

Resolution:
- child work target now falls back to Home until School exists

## Remaining M1 quality evidence

Before M1 is called fully playtest-ready, still measure:

1. 30-minute physical-browser memory stability
2. target desktop/laptop hardware
3. build/road feel with real mouse play, not only automated checks
4. blocker clearing feel and feedback timing
5. final graybox readability under rain/night
6. first human playtest notes

Completed since this audit:
- 40-citizen CI benchmark
- renderer geometry/texture leak gate
- bounded post-GC heap gate
- actual road-graph routing instead of center-waypoint presentation

These are measurement/polish gates, not foundational architecture gaps.

## Studio verdict

**M1 runtime-quality baseline: PASS**

The loop is now:
- technically executable
- browser-tested
- spatially readable at graybox level
- performance-instrumented
- regression-gated

Do not open broad M2 content until the 30–40 citizen and memory tests are also in place.
