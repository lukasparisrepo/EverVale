# 28 — Activity Anchors & Schedules

## Why anchors exist

Procedural life looks artificial when actors wander randomly with no relationship to the environment.

Buildings and public spaces therefore publish **Activity Anchors**.

An anchor is a semantic point where a believable action can occur.

## Anchor examples

### House
- front_door
- porch
- garden
- mailbox
- pet_yard
- driveway

### School
- entrance
- classroom
- schoolyard
- bench
- pickup_zone

### Workshop
- worker_entrance
- workbench
- loading_area
- break_spot

### Farm
- farmhouse_door
- field_work
- barn
- chicken_zone
- duck_pond
- tractor_start
- fence_gate

### Park
- bench
- playground
- picnic
- pond_edge
- walking_loop
- dog_area
- fountain
- bicycle_rack

### Guard Post
- guard_spawn
- patrol_start
- gate_watch
- response_vehicle

## Runtime representation

Example:

```
ActivityAnchor {
  id
  ownerEntityId
  type
  position
  facing
  capacity
  tags[]
  enabled
}
```

## Activity request

A building can emit:

```
ActivityRequest {
  activityType
  actorClass
  desiredCount
  startWindow
  durationRange
  priority
  anchorTags[]
}
```

Example:

School at 08:00:

```
activityType: SCHOOL_ARRIVAL
actorClass: CHILD
desiredCount: based on education attendance
anchorTags: [entrance, schoolyard]
```

## Scheduling architecture

Server owns broad intent.

Client owns local staging.

Server:
- citizen is attending School
- citizen work shift
- citizen leisure window
- threat override

Client:
- which schoolyard anchor
- which bench
- exact animation
- small randomized delay

## Capacity

Anchors prevent ten citizens occupying one chair.

If all suitable anchors are occupied:
- choose another anchor
- wait
- skip optional activity

## Seeded variation

Use stable seeds for:
- preferred park
- walking speed band
- idle style
- pet ownership
- clothing variant
- animation selection weights

This gives recognizable citizens without expensive personality simulation.

## Weather modifier

Rain:
- reduce open park requests
- increase home/cafe/sheltered activity
- decrease bicycle ambience
- allow umbrella visual variants

## Threat modifier

Warning:
- optional activities decline

Active attack:
- leisure requests disabled
- evacuation/shelter requests dominate

## Content authoring

Blender-authored buildings may include empty anchor objects.

Export process converts them into runtime metadata rather than visible meshes.

Naming example:

```
ANCHOR__front_door__01
ANCHOR__bench__02
ANCHOR__loading_area__01
```

This lets asset agents author gameplay-ready buildings instead of only visual shells.
