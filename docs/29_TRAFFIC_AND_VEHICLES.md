# 29 — Traffic & Vehicles

Status: **LIGHTWEIGHT TRAFFIC v0.1**

## Goal

Roads should look used without becoming a hardcore traffic simulator.

## Vehicle classes

### Gameplay vehicles

Authoritative or semi-authoritative:
- construction vehicle
- repair/service vehicle
- military armored car
- tank
- emergency vehicle
- aircraft ground movement

Their destination matters to gameplay.

### Ambient civilian traffic

Client-generated from world context:
- small cars
- vans
- bicycles
- carts where art direction allows

These provide life, not economic truth.

## Traffic density

Ambient traffic density derives from:
- Population
- time of day
- road class
- nearby active buildings
- district activity
- weather
- threat state

Reference qualitative curve:

- night: very low
- morning commute: high
- midday: medium
- evening commute: high
- active threat: near zero civilian traffic

## Spawn rule

Never spawn arbitrary cars directly in camera view.

Spawn from:
- road graph entry points
- building driveways
- parking/activity anchors
- district boundaries

Despawn:
- outside active visual radius
- at valid destination/exit

## Routing

Authoritative gameplay vehicles use the server mobility graph.

Ambient vehicles can use a client road graph mirror derived from authoritative road data.

## Congestion

MVP traffic does **not** need full lane-level congestion simulation.

Optional lightweight visual spacing:
- minimum headway
- speed adjustment
- intersection reservation

Economic commute calculations use weighted road cost, not rendered car positions.

## Public transport

Deferred until the core town loop proves a need.

## Aircraft

Aircraft are gameplay actors.

They may use:
- Airfield activity anchors
- takeoff/landing spline
- server combat state
- client animation spline

No need for full aerodynamic simulation.

## Parking

Parking is visual abstraction in v0.1.

Buildings may expose driveway/parking anchors to make arrival/departure believable.

## Performance

Use:
- pooled vehicle instances
- InstancedMesh where models permit
- distance culling
- simplified far movement
- low update frequency outside camera focus

Ambient traffic must never consume server simulation budget proportional to visible FPS.
