# 05 — Infrastructure Networks

## Roads

Roads are the spatial backbone.

Canonical road classes:
- footpath
- dirt road
- paved local road
- main road
- bridge

Road geometry may be spline-based on the client, but the server stores a canonical graph.

Road graph supports:
- citizen routing
- service reach
- logistics
- emergency response
- defense movement

## Electricity

Power network is a graph of producers, connectors, and consumers.

Server computes connectivity and capacity.

Buildings expose visual state:
- powered
- brownout
- offline

## Water

Water network is a graph plus storage.

Components:
- source
- pump/treatment
- pipe
- reservoir/tank
- consumer

Loss of electricity can disable pumps, creating cascading failure.

## Service coverage

Schools, parks, clinics, security, fire response, and shelters use travel/coverage logic rather than arbitrary circles whenever practical.

## Failure propagation

Networks must report root causes.

Example diagnostic chain:

`Factory offline ← no water ← reservoir empty ← pump offline ← power feeder overloaded`

## Editing

Player can:
- draw roads
- upgrade roads
- demolish/replace segments
- connect utilities
- inspect flow overlays

Edits must update server graphs and navigation safely.

## Performance

Do not rebuild entire world graphs for one local edit if incremental recalculation is sufficient.
