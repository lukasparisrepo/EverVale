# 17 — Acceptance Tests

Status: **CANON-ALIGNED v0.2**

## A. Persistence

1. Create world.
2. Build House / Power / Water / income workplace.
3. Disconnect.
4. Advance authoritative test clock.
5. Reconnect from a fresh browser/session.
6. World reflects elapsed progression.
7. Client local storage deletion does not delete server world.
8. Return timeline explains meaningful changes.

PASS required.

## B. Server authority

Attempt a build command with insufficient Money.

Expected:
- server rejects
- no building persists
- client preview rolls back
- world revision remains valid

## C. Exclusive simulation lease

Race:
- ACTIVE world room
- background catch-up worker

Expected:
- only one acquires lease
- Money/Tech/Varum/Growth advance once
- no duplicate threat event

## D. Power / Water resource loop

1. Staff Power Plant and Water Plant.
2. Confirm production exceeds current consumption.
3. Increase Population/building demand or unstaff a utility.
4. Reserve begins falling.
5. Reserve reaches zero.
6. dependent buildings reduce operation.
7. Happiness target falls.
8. job allocator protects critical utility staffing by default.

No pipe/reservoir simulation is required.

## E. Road connectivity

Disconnect a workplace from the canonical road graph.

Expected:
- building does not request workers
- citizen visual commute does not enter it
- building reports DISCONNECTED
- reconnecting road restores eligibility

## F. Automatic Workforce allocation

Create more requested job slots than available Workforce.

Expected:
- assigned workers never exceed Workforce
- critical utilities fill first
- lower-priority buildings become partially staffed or idle
- partial output scales consistently
- player can reorder non-critical priorities
- deterministic tie breakers produce same result for same state

## G. Citizen routine

With an operating town:
- adult leaves home
- adult travels toward assigned workplace
- child travels toward School
- optional citizen visits Park
- evening returns toward home

Player issues no per-citizen move order.

## H. Living-world contradiction guard

Examples that must PASS:
- disabled School → no School arrival activity
- active attack → Park leisure density approaches zero
- night → civilian traffic reduced
- disconnected Farm → no farmer work loop
- rain → outdoor Park usage reduced

## I. School / Tech

Staff School with Power/Water available.

Expected:
- Tech increases at configured rate
- Education coverage exists
- threshold unlocks correct Tech Tier
- removing staff reduces/halts Tech output

## J. Varum

At required Tech Tier:
- build Varum Mine
- staff it
- provide Power/Water

Expected:
- Mine produces Varum directly
- no Raw/Refined split
- advanced unit purchase rejects insufficient Varum
- Varum respects storage cap

## K. Population Growth

With spare Housing and Happiness >= threshold:
- Growth accumulates
- Population eventually increases
- Workforce recalculates
- Growth stops when Housing is full
- Growth stops below Happiness threshold

## L. Threat secrecy

Ordinary client payload must not expose:
- hidden attack threshold
- exact scheduled major-attack time

Warning information may be exposed according to sensors/radar.

## M. Combat / defense

Ground test:
- attacker spawns at valid edge/entry
- defender coverage and travel time affect response
- target filters respected
- damage uses canonical stats/formula
- damaged structures create repair state

Air test:
- ground-only units do not magically hit air targets
- AA/Fighter can engage air targets

## N. Offline attack fairness

Simulate long absence.

Expected:
- attack may occur
- same canonical stats are used
- damage is bounded by offline safety rules
- critical infrastructure is not silently erased
- After-Action report explains loss/damage

## O. Navigation edit

Edit road/building footprint.

Expected:
- server mobility graph updates
- local navmesh/visual path updates independently
- economic simulation never depends on stale Recast data
- citizens recover from invalid presentation paths

## P. Activity anchors

Load representative House, School, Farm and Park assets.

Expected:
- required semantic anchors exist
- anchor capacity prevents obvious overlap
- activity system can bind actors without hardcoded asset coordinates

## Q. Asset validation

Production GLB passes:
- scale
- pivot
- naming
- material budget
- triangle/LOD policy
- license/provenance
- anchor metadata
- runtime load

## R. Layer boundary

Automated architecture check eventually verifies:
- simulation imports no Three.js/React/Drizzle/Colyseus
- UI imports no DB adapter
- server network handlers do not own gameplay formulas
- no circular dependency across canonical layers

## S. Performance

Representative scene:
- target desktop frame rate
- capped DPR
- actor density cap
- pooled transient actors
- static crowds require no per-frame update
- low quality remains playable

## T. Multiplayer readiness

Connect two read clients to same world.

Expected:
- same authoritative revision stream
- owner permissions enforced
- no assumption of exactly one observer


## U. Procedural world fairness

Generate at least 1000 seeded worlds.

Every accepted seed must provide:
- starter buildable area above minimum
- starter structures mutually reachable
- at least two expansion routes
- one T1-reachable Varum deposit
- no mandatory progression deadlock
- valid external threat approach
- expansion/clearance cost inside bounded range

Invalid seeds are rejected/re-rolled.

## V. Vertical access failure

Create an inhabited upper terrace whose main connection is Hill Lift.

Expected:
- ACTIVE Lift supports configured traffic
- Power loss switches intact Lift to EMERGENCY_PEDESTRIAN
- pedestrians can still escape/reach recovery route slowly
- cars/tanks cannot use emergency mode
- physical Lift damage can fully disconnect the edge
- UI reports isolation/repair cause

## W. Content registry scalability

Register a new Money building and a new Decor definition through data/registry paths.

Expected:
- no economy core switch statement edit
- no renderer mega-file edit
- activity profile can attach through semantic anchors
- content validator rejects duplicate IDs and unknown mechanic types


## X. Canonical content IDs

Expected:
- starter world references only IDs present in canonical content/balance registries
- `house_small` is used consistently
- deprecated combat/worldgen files are rejected as runtime SSOT
- unknown unit/building IDs fail validation

## Y. Combat production chain

For every buildable combat unit:
- source building exists
- required Tech Tier is reachable
- source building unlock Tier <= unit Tier
- Money/Varum costs are defined
- build/repair path is valid

No unit may exist only in a wave/reference doc without a production or supported-unit contract.

## Z. Civilian safety

During active threat:
- civilians prefer Civic Shelter when reachable and capacity exists
- otherwise use configured safe home/civic fallback
- no civilian remains in optional Park/Café activity during major combat
- isolated terrace reports unsafe/unreachable state

## AA. Ambient threat activity

Expected:
- ambient visual event does not count as a wave
- clue never exposes exact attack time
- probe does not reset major pressure
- events are suppressed during major combat
- same seed/state produces repeatable persistent clue/probe outcome

## AB. Authority/version guard

CI/content validation must fail when:
- deprecated SSOT is imported by runtime
- two canonical registries define conflicting IDs
- Tech unlock references nonexistent unit/building
- wave roster references nonexistent enemy
- production source unlocks after the unit it produces
