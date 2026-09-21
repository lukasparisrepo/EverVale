# 05 — Infrastructure & Connectivity

## Philosophy

EverVale uses **readable game infrastructure**, not a civil-engineering simulation.

## Canonical Access Graph

The server-side weighted Access Graph is the physical connectivity source of truth.

Edge classes may include:
- footpath
- dirt road
- paved road
- main road
- stair
- bridge
- Hill Lift
- tunnel

Actor access classes determine which edges they can use:
- pedestrian
- civilian vehicle
- heavy vehicle
- air after takeoff

See `docs/41_WORLD_CONNECTIVITY_AND_LEVELS.md`.

## Roads

Roads are the default town connector.

A functioning building normally needs a valid route from its entrance into the settlement Access Graph.

The graph supports:
- citizen commute cost
- workplace access
- service reach
- construction/repair access
- defense response
- civilian vehicles
- heavy vehicles
- future trade

## Vertical access

Outdoor terraces can connect through:
- stairs
- ramps/switchbacks
- bridges
- Hill Lift
- later tunnels

A powered Lift losing Power enters emergency pedestrian mode when mechanically intact, preventing circular recovery soft-locks.

## Server graph vs Recast

### Server Access Graph
Canonical for:
- reachability
- economy
- services
- commute/travel cost
- defense movement intent

Graphology / shortest-path tooling is the approved candidate stack.

### Recast navmesh
Used for:
- local 3D walkability
- local obstacle avoidance
- presentation path detail

Recast is **not** the economic source of truth.

A client navmesh rebuild cannot determine whether an authoritative building operates.

## Power and Water

MVP does not require explicit wires or pipes.

Power Plants and Water Plants generate settlement resources into stored reserves.

A connected operating building consumes from those reserves.

This is intentionally abstract.

## Disconnected buildings

A disconnected building may:
- remain under construction if access is lost mid-build
- become inactive
- stop requesting ordinary workers
- lose service
- become harder/impossible to repair
- be unreachable by some defender classes

No teleporting workforce or gameplay vehicles.

## Blockers

Generated world blockers can occupy:
- buildable land
- road/access candidates
- terrace connectors

Clearing a blocker:
- costs Money/time
- may require Tech/Varum
- uses construction/clearance capacity
- updates the authoritative Access Graph/buildable state

## Service travel

School, park, clinic, security, fire/maintenance and similar services can use weighted graph travel cost.

## Diagnostics

When a building is inactive, report a concrete cause:
- DISCONNECTED
- NO_WORKERS
- NO_POWER
- NO_WATER
- NO_MONEY
- TECH_LOCKED
- DAMAGED
- INCIDENT
- STORAGE_FULL

## Editing

Player can:
- draw/curve roads
- upgrade road class
- remove/replace segments
- build bridge/stair/ramp/lift
- clear blockers
- open new terrace routes

Graph updates should be incremental where practical.
