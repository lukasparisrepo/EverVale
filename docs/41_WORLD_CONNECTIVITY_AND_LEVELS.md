# 41 — World Connectivity, Terraces & Access

## Core idea

EverVale borrows Fallout Shelter's readable access logic without copying its stacked-room structure.

Instead of underground floors:
- the world has outdoor terraces, hills, ravines and blocked land
- roads and lifts determine connectivity
- expansion changes the physical shape of the town

# Access graph

Server stores a canonical weighted access graph.

Node examples:
- road junction
- building entrance
- bridge endpoint
- lift station
- tunnel portal
- terrace access node

Edge examples:
- road
- footpath
- stairs
- bridge
- lift
- tunnel

# Access classes

Actors have access class:

### Pedestrian
Can use:
- path
- road
- stairs
- pedestrian lift
- bridge
- tunnel

### Civilian Vehicle
Can use:
- vehicle road
- vehicle bridge
- cargo-capable lift
- tunnel

### Heavy Vehicle
Tank/service heavy:
- main road
- heavy bridge
- heavy lift
- wide tunnel

### Air
Ignores road graph after takeoff but requires Airfield.

# Building validity

A building may be physically placed only where:
- terrain permits
- footprint is clear
- required access class can reach it
- blocker state allows it

A building may exist but become operationally isolated after:
- bridge failure
- lift fault
- road destruction
- threat blockage

# Fallout-like blockers

Expansion blockers exist as world objects.

They occupy land until cleared:
- rubble
- rocks
- forest
- ruin
- collapsed route
- Varum scar

They are visible and selectable.

# Hill Lift behavior

Hill Lift is a real transit edge.

State:
- ACTIVE
- EMERGENCY_PEDESTRIAN
- QUEUED
- FAULT
- DAMAGED
- REPAIRING

Capacity affects traffic cost but MVP does not require individual elevator queue physics.

### Emergency pedestrian mode

A Power shortage must not create a circular soft-lock where residents or utility workers cannot leave a terrace because the powered Lift stopped.

If the Lift is mechanically intact but unpowered:
- pedestrians and guards on foot can still cross at very high traversal cost
- capacity is strongly reduced
- civilian vehicles cannot cross
- tanks/heavy service vehicles cannot cross

A physically damaged Lift may fully block the edge until repaired.

Generator rule:
- mandatory T0 bootstrap may never depend on a powered Lift as its only route.

# Strategic consequence

A beautiful high terrace may be:
- excellent for homes/park
- expensive to connect
- poor for heavy industry
- strong defensively

A lower flat valley may be:
- cheap to build
- efficient for industry
- more exposed to ground attack

This makes map variation meaningful without changing the game's rules.
