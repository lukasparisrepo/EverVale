# 45 — Anti-Idle & Content Audit — 2026-09-21

Status: **AUDITED / CONTENT EXPANSION PASS**

## Audit goal

Verify that EverVale is:
- autonomous
- visually alive
- content-rich
- spatially strategic
- persistent offline
- not an idle auto-win game

## Key conclusion

The game works better when automation handles **execution**, while the player retains **strategy**.

Automation may:
- staff jobs
- run buildings
- move citizens
- attend school
- generate resources
- respond to minor incidents
- finish queued construction
- resolve bounded threats

Automation may not:
- choose new districts
- place buildings
- draw roads
- clear unqueued blockers
- choose Tech specialization
- buy expensive military units
- redesign weak infrastructure

This is the core anti-idle boundary.

# Content audit

## Building variety

The canonical catalogue now includes 40+ named building/access definitions across:
- civic
- residential
- commerce
- utilities
- education
- leisure
- rural
- Varum industry
- services
- military
- transport/access

Each canonical building now requires:
- display name
- art tags/silhouette
- function
- incident profile
- visible activity anchors

This resolves the previous gap where buildings existed only as generic mechanic labels.

## Decoration

Decor is now split into:
- Pure Visual
- Soft Happiness/Beauty
- Functional Activity Anchors

This prevents decor from becoming either meaningless clutter or an exploitative Happiness spam system.

# World-layout audit

Every player world uses a stable procedural seed.

Variation includes:
- terraces
- river/pond
- blocker layout
- forest
- Varum deposits
- expansion routes
- landmarks

Fairness validation prevents bad seeds.

Outdoor terraces + Hill Lift provide the readability of Fallout Shelter's vertical floors without copying underground stacked rooms.

# Anti-idle audit

## 2-hour absence

Expected:
- some Money earned
- Power/Water produced/consumed
- queued building may finish
- T1 may unlock
- Population may grow if Housing exists
- one minor incident may occur
- resources may approach storage caps

Desired result:
player returns with progress plus a next decision.

## 24-hour absence

Expected plateau mechanisms:
- Money reaches Treasury cap
- Power/Water reach reserve caps
- Varum reaches storage cap if Mine exists
- Population stops at Housing cap
- construction queue empties
- Tech can hit a decision gate
- maintenance/incident activity consumes some Money
- at most bounded major offline threats resolve

The simulation does not:
- build more Housing
- add utility capacity
- expand roads
- clear new land
- buy a Tank
- solve a Tech branch

Therefore time alone cannot solve the town.

## 48-hour absence

Without player decisions, a mature town should normally be in one of these states:

### Well-prepared
- resources mostly capped
- buildings mostly stable
- minor repair history
- Tech gate waiting
- some offline threat history
- no further strategic expansion

### Underbuilt
- utility reserve depleted
- Happiness lower
- Growth stopped
- some buildings understaffed/disabled
- repair backlog

### Overmilitarized
- upkeep consumes Treasury
- civic/Tech growth slower
- military still does not expand automatically

No scenario should convert unattended elapsed time directly into automatic completion of the game.

# Tech exploit found and fixed

Previous design allowed unlimited Tech accumulation.

Problem:
- player could leave multiple Schools running for days
- return with enough points for several tiers

Fix:
- T1 may auto-unlock for onboarding
- T2+ requires milestone confirmation
- pending gate reduces School output
- Tech overflow is capped
- no multi-tier offline jump

# Incident-system audit

Incidents are necessary because fully stable buildings plus automatic production create a solved idle loop.

Approved local incidents include:
- rats
- fire
- generator fault
- pump failure
- contamination
- cave-in
- Varum anomaly
- explosion
- fallen tree
- Hill Lift fault
- animal escape
- litter

Incidents are:
- risk-based, not flat spam
- mitigated by maintenance/services
- visible in the world
- bounded offline

# Remaining balance gaps

## G1 — Maintenance rates are not yet numerically tuned

Need:
- condition wear/cycle
- repair Money cost
- repair capacity
- service response times

## G2 — Happiness-building values need anti-stacking curves

Restaurant/Park/Garden/etc. need:
- local radius
- category cap
- diminishing returns

## G3 — Expansion blocker costs need progression simulation

Current blocker costs are baseline only.

Need to test:
- first 30 minutes
- first 2 hours
- T1/T2 expansion pressure

## G4 — Named building catalogue has art/function identity but not full balance stats

The v0.2 content registry intentionally separates identity from the current v0.1 numerical balance.

Next pass should add:
- Money cost
- worker slots
- Power/Water
- upkeep
- Happiness
- build time
- Tech requirements

for every production/civic building.

## G5 — Local incident frequency must remain cozy

Too many fires/rats will become chores.

Target:
- most active play has occasional local incidents
- a healthy town resolves many automatically
- simultaneous incidents become meaningful only when the player overextends

# Final audit verdict

The concept now has a workable long-term control loop:

`Build → Connect → Automate → Observe → Incident/Capacity Pressure → Decide → Expand`

not:

`Build once → wait → win`

This is the correct direction for EverVale.
