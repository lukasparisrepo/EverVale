# 05 — Infrastructure & Connectivity

## Philosophy

EverVale uses **readable game infrastructure**, not a civil-engineering simulation.

## Roads are canonical

Roads are the physical connectivity source of truth.

Road classes:
- footpath
- dirt road
- paved local road
- main road
- bridge

A functioning building normally needs a valid connection to the settlement road graph.

The weighted server graph supports:
- citizen commute cost
- workplace access
- service reach
- construction access
- defense response
- vehicle movement
- future trade

## Server graph vs Recast

These are different systems.

### Server mobility graph
Canonical for simulation and path cost.

Use a weighted graph representation; Graphology / graphology-shortest-path are approved candidates.

### Recast navmesh
Used for local 3D walkability, avoidance and visual movement where useful.

Recast is **not** the economic source of truth.

A road edit must not require the whole economy to depend on a rebuilt 3D navmesh.

## Power and Water

MVP does not require explicit wires or pipes.

Power Plants and Water Plants generate settlement resources into stored reserves.

A connected building consumes from those reserves.

This is deliberately similar to shelter-management abstraction: physically simplified, mechanically readable.

Later versions may introduce district grids or specialized utility routing if playtests prove it adds value.

## Disconnected buildings

A disconnected building may:
- remain under construction
- become inactive
- lose service
- be unreachable by workers/defenders

No teleporting workforce or production.

## Service travel

School, park, security and similar coverage can use road travel cost rather than perfect Euclidean circles.

## Diagnostics

When a building is inactive, report a concrete reason:
- NO_ROAD
- NO_WORKERS
- NO_POWER
- NO_WATER
- NO_MONEY
- TECH_LOCKED
- DAMAGED
- STORAGE_FULL

## Editing

Player can:
- draw roads
- curve roads
- replace segments
- upgrade road class
- remove roads
- build bridges

Graph updates should be incremental where practical.
