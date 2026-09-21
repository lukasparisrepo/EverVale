# 36 — Blockers, Roads & Vertical Access

## Design goal

EverVale should gain the progression clarity of shelter/base games without copying stacked-room construction.

The outdoor equivalent is:

> **terrain sectors + blockers + access links**

## Access Graph

Canonical access edges can be:

- ROAD
- PATH
- BRIDGE
- STAIR
- RAMP
- LIFT
- TUNNEL

Each edge declares:
- endpoints
- traversal class
- allowed actors
- traversal cost
- capacity hint
- operational state

## Roads

Roads are still the default town connector.

Citizens, service actors and vehicles use road/path access depending on type.

## Vertical layers

Terrain may form natural terraces.

Example:

```
Upper Plateau
     │
   LIFT
     │
Market Terrace
     │
 switchback road
     │
Starter Valley
```

This gives world expansion a strong spatial identity.

## Lift / elevator

The Lift is an access building.

It can connect two compatible elevation nodes.

Mechanical role:
- reduces long detour
- enables otherwise inaccessible terrace
- affects commute/service response

It is not a Fallout-style room connector; it is an outdoor infrastructure element.

## Stair

Cheap pedestrian-only vertical connection.

Allowed:
- citizens
- guards on foot
- pets

Not allowed:
- cars
- tanks
- service trucks

## Ramp / switchback

Supports road vehicles but consumes more land.

## Bridge

Connects across:
- water
- ravine
- lower path

Bridge can be strategically vulnerable during threats later.

## Blocker classes

### Light
- bushes
- rubble
- fallen tree
- small rocks

### Medium
- dense grove
- ruined wall
- rock cluster
- landslide

### Heavy
- giant boulder
- collapsed tunnel
- Varum rock
- major ruin

Each blocker definition can declare:
- Money clear cost
- clear time
- required Tech
- optional Varum
- footprint
- visual destruction sequence

## Clear behavior

Clearing is a construction-like task.

Sequence:
1. player selects blocker
2. sees clear cost/time/reward
3. server validates
4. clear task begins
5. optional worker/vehicle animation
6. blocker transitions visually
7. Access Graph/buildable area updates

## No deadlocks

World generation must never place all progression behind a blocker whose clear requirement depends on progression behind that same blocker.

Automated graph validation is mandatory.

## Defense interaction

Blockers and terrain can affect:
- enemy approach
- line of sight
- vehicle access
- tower placement

But removable decorative rocks should not accidentally become exploitable perfect walls unless explicitly tagged as blocking threat movement.
